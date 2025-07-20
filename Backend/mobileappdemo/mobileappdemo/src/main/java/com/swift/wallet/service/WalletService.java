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
        // Create primary GHS wallet
        Wallet primaryWallet = new Wallet(user, CurrencyType.GHS, true);
        walletRepository.save(primaryWallet);

        // Create other currency wallets
        for (CurrencyType currency : CurrencyType.values()) {
            if (currency != CurrencyType.GHS) {
                Wallet wallet = new Wallet(user, currency, false);
                walletRepository.save(wallet);
            }
        }
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
        // Look up wallets by user and currency
        Optional<Wallet> fromWalletOpt = walletRepository.findUserWalletByCurrency(request.getUserId(), request.getFromCurrency());
        Optional<Wallet> toWalletOpt = walletRepository.findUserWalletByCurrency(request.getUserId(), request.getToCurrency());
        if (fromWalletOpt.isEmpty() || toWalletOpt.isEmpty()) {
            throw new RuntimeException("One or both wallets not found");
        }
        Wallet fromWallet = fromWalletOpt.get();
        Wallet toWallet = toWalletOpt.get();
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
} 