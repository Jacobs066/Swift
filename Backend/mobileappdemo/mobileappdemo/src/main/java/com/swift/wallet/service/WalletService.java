package com.swift.wallet.service;

import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import com.swift.wallet.dto.TransferRequest;
import com.swift.wallet.dto.WalletDto;
import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.enums.TransactionType;
import com.swift.wallet.models.Transaction;
import com.swift.wallet.models.Wallet;
import com.swift.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExchangeRateService exchangeRateService;

    /**
     * Create wallets for a new user
     */
    public void createUserWallets(User user) {
        // Check if user already has wallets
        List<Wallet> existingWallets = walletRepository.findUserWalletsOrdered(user.getId());
        if (!existingWallets.isEmpty()) {
            System.out.println("User " + user.getId() + " already has wallets, skipping creation");
            return;
        }

        System.out.println("Creating wallets for user: " + user.getId());
        
        // Create all currency wallets
        for (CurrencyType currency : CurrencyType.values()) {
            boolean isPrimary = currency == CurrencyType.GHS;
            Wallet wallet = new Wallet(user, currency, isPrimary);
            walletRepository.save(wallet);
            System.out.println("Created " + currency + " wallet for user " + user.getId() + " (Primary: " + isPrimary + ")");
        }
        
        System.out.println("All wallets created successfully for user: " + user.getId());
    }

    /**
     * Get all wallets for a user
     */
    public List<WalletDto> getUserWallets(Long userId) {
        List<Wallet> wallets = walletRepository.findUserWalletsOrdered(userId);
        return wallets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get wallet by ID
     */
    public Optional<WalletDto> getWalletById(Long walletId) {
        return walletRepository.findById(walletId)
                .map(this::convertToDto);
    }

    /**
     * Get wallet by user and currency
     */
    public Optional<WalletDto> getUserWalletByCurrency(Long userId, CurrencyType currency) {
        return walletRepository.findUserWalletByCurrency(userId, currency)
                .map(this::convertToDto);
    }

    /**
     * Transfer money between wallets
     */
    public boolean transferMoney(TransferRequest request) {
        System.out.println("Processing transfer request: " + request);
        
        // Find source and destination wallets
        java.util.Optional<com.swift.wallet.models.Wallet> fromWalletOpt = walletRepository.findUserWalletByCurrency(request.getUserId(), request.getFromCurrency());
        java.util.Optional<com.swift.wallet.models.Wallet> toWalletOpt = walletRepository.findUserWalletByCurrency(request.getUserId(), request.getToCurrency());
        
        if (fromWalletOpt.isEmpty()) {
            throw new RuntimeException("From wallet not found for currency: " + request.getFromCurrency());
        }
        if (toWalletOpt.isEmpty()) {
            throw new RuntimeException("To wallet not found for currency: " + request.getToCurrency());
        }
        
        com.swift.wallet.models.Wallet fromWallet = fromWalletOpt.get();
        com.swift.wallet.models.Wallet toWallet = toWalletOpt.get();
        
        System.out.println("Found wallets - From: " + fromWallet.getCurrency() + " (Balance: " + fromWallet.getBalance() + 
                         "), To: " + toWallet.getCurrency() + " (Balance: " + toWallet.getBalance() + ")");
        
        // Check sufficient balance in source wallet
        if (fromWallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds in " + fromWallet.getCurrency() + " wallet. Available: " + fromWallet.getBalance() + ", Required: " + request.getAmount());
        }
        
        return transferMoneyByWallets(fromWallet, toWallet, request);
    }

    public boolean transferMoneyByWallets(Wallet fromWallet, Wallet toWallet, TransferRequest request) {
        // Check if user owns the from wallet
        if (!fromWallet.getUser().getId().equals(toWallet.getUser().getId())) {
            throw new RuntimeException("Can only transfer between your own wallets");
        }
        // Check sufficient balance
        if (fromWallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        // Perform transfer
        if (fromWallet.getCurrency() == toWallet.getCurrency()) {
            // Same currency transfer
            return performSameCurrencyTransfer(fromWallet, toWallet, request);
        } else {
            // Cross-currency transfer
            return performCrossCurrencyTransfer(fromWallet, toWallet, request);
        }
    }

    /**
     * Same currency transfer
     */
    private boolean performSameCurrencyTransfer(Wallet fromWallet, Wallet toWallet, TransferRequest request) {
        // Deduct from source wallet
        fromWallet.setBalance(fromWallet.getBalance().subtract(request.getAmount()));
        walletRepository.save(fromWallet);

        // Add to destination wallet
        toWallet.setBalance(toWallet.getBalance().add(request.getAmount()));
        walletRepository.save(toWallet);

        // Create transactions
        String reference = "TRANSFER_" + System.currentTimeMillis();
        transactionService.createTransaction(fromWallet, TransactionType.TRANSFER, request.getAmount().negate(), 
                         request.getFromCurrency(), "Transfer to " + toWallet.getCurrency(), reference + "_OUT");
        transactionService.createTransaction(toWallet, TransactionType.TRANSFER, request.getAmount(), 
                         request.getToCurrency(), "Transfer from " + fromWallet.getCurrency(), reference + "_IN");

        return true;
    }

    /**
     * Cross-currency transfer
     */
    private boolean performCrossCurrencyTransfer(Wallet fromWallet, Wallet toWallet, TransferRequest request) {
        // Get exchange rate
        BigDecimal exchangeRate = exchangeRateService.getExchangeRate(request.getFromCurrency(), request.getToCurrency());
        BigDecimal convertedAmount = request.getAmount().multiply(exchangeRate);

        // Deduct from source wallet
        fromWallet.setBalance(fromWallet.getBalance().subtract(request.getAmount()));
        walletRepository.save(fromWallet);

        // Add converted amount to destination wallet
        toWallet.setBalance(toWallet.getBalance().add(convertedAmount));
        walletRepository.save(toWallet);

        // Create transactions with exchange rate info
        String reference = "EXCHANGE_" + System.currentTimeMillis();
        Transaction fromTransaction = transactionService.createTransaction(fromWallet, TransactionType.CURRENCY_EXCHANGE, 
                                                       request.getAmount().negate(), request.getFromCurrency(),
                                                       "Currency exchange to " + toWallet.getCurrency(), reference + "_OUT");
        fromTransaction.setExchangeRate(exchangeRate);
        fromTransaction.setConvertedAmount(convertedAmount);
        fromTransaction.setConvertedCurrency(toWallet.getCurrency());

        Transaction toTransaction = transactionService.createTransaction(toWallet, TransactionType.CURRENCY_EXCHANGE, 
                                                     convertedAmount, toWallet.getCurrency(),
                                                     "Currency exchange from " + fromWallet.getCurrency(), reference + "_IN");
        toTransaction.setExchangeRate(exchangeRate);
        toTransaction.setConvertedAmount(request.getAmount());
        toTransaction.setConvertedCurrency(request.getFromCurrency());

        return true;
    }

    /**
     * Convert Wallet entity to DTO
     */
    private WalletDto convertToDto(Wallet wallet) {
        return new WalletDto(
            wallet.getId(),
            wallet.getUser().getId(),
            wallet.getCurrency(),
            wallet.getBalance(),
            wallet.isPrimary(),
            wallet.getCreatedAt(),
            wallet.getUpdatedAt()
        );
    }

    /**
     * Allocate funds to a specific wallet
     */
    public void allocateFundsToWallet(Long userId, CurrencyType currency, BigDecimal amount) {
        System.out.println("Allocating " + amount + " " + currency + " to user " + userId);
        
        Optional<Wallet> walletOpt = walletRepository.findUserWalletByCurrency(userId, currency);
        if (walletOpt.isEmpty()) {
            throw new RuntimeException("Wallet not found for user " + userId + " and currency " + currency);
        }
        
        Wallet wallet = walletOpt.get();
        BigDecimal oldBalance = wallet.getBalance();
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
        
        System.out.println("Wallet updated - User: " + userId + ", Currency: " + currency + 
                         ", Old Balance: " + oldBalance + ", New Balance: " + wallet.getBalance());
        
        // Create allocation transaction
        String reference = "ALLOCATION_" + System.currentTimeMillis();
        transactionService.createTransaction(wallet, TransactionType.DEPOSIT, amount, currency, 
                                         "Fund allocation", reference);
    }
} 