package com.swift.wallet.service;

import com.swift.wallet.dto.TransactionHistoryDto;
import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.enums.TransactionType;
import com.swift.wallet.models.Transaction;
import com.swift.wallet.models.Wallet;
import com.swift.wallet.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    /**
     * Create a new transaction with enhanced description
     */
    public Transaction createTransaction(Wallet wallet, TransactionType type, BigDecimal amount, 
                                       CurrencyType currency, String description, String reference) {
        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setCurrency(currency);
        transaction.setDescription(description);
        transaction.setReference(reference);
        transaction.setStatus("COMPLETED");
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());
        
        return transactionRepository.save(transaction);
    }

    /**
     * Create transfer transactions with recipient/sender information
     */
    public void createTransferTransactions(Wallet fromWallet, Wallet toWallet, BigDecimal amount, 
                                         CurrencyType currency, String description, String reference) {
        // Create debit transaction for sender
        String debitDescription = "Sent to " + toWallet.getUser().getUsername() + " - " + description;
        createTransaction(fromWallet, TransactionType.TRANSFER, amount, currency, debitDescription, reference);
        
        // Create credit transaction for recipient
        String creditDescription = "Received from " + fromWallet.getUser().getUsername() + " - " + description;
        createTransaction(toWallet, TransactionType.TRANSFER, amount, currency, creditDescription, reference);
    }

    /**
     * Get transactions for a wallet with enhanced DTO
     */
    public List<TransactionHistoryDto> getWalletTransactions(Long walletId) {
        List<Transaction> transactions = transactionRepository.findByWalletIdOrderByCreatedAtDesc(walletId);
        return transactions.stream()
                .map(TransactionHistoryDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Get transactions for a wallet with pagination and enhanced DTO
     */
    public Page<TransactionHistoryDto> getWalletTransactionsPaginated(Long walletId, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findByWalletId(walletId, pageable);
        return transactions.map(TransactionHistoryDto::new);
    }

    /**
     * Get all transactions for a user with enhanced DTO
     */
    public List<TransactionHistoryDto> getUserTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository.findUserTransactions(userId);
        return transactions.stream()
                .map(TransactionHistoryDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Get all transactions for a user with pagination and enhanced DTO
     */
    public Page<TransactionHistoryDto> getUserTransactionsPaginated(Long userId, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findUserTransactionsPaginated(userId, pageable);
        return transactions.map(TransactionHistoryDto::new);
    }

    /**
     * Get transaction history with advanced filtering and enhanced DTO
     */
    public Page<TransactionHistoryDto> getTransactionHistory(Long userId, Long walletId, String type, 
                                                           String status, LocalDateTime startDate, 
                                                           LocalDateTime endDate, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findTransactionHistory(userId, walletId, type, status, startDate, endDate, pageable);
        return transactions.map(TransactionHistoryDto::new);
    }

    /**
     * Get transaction summary/statistics for a user
     */
    public Map<String, Object> getTransactionSummary(Long userId) {
        Map<String, Object> summary = new HashMap<>();
        
        // Total transactions
        long totalTransactions = transactionRepository.countByUserId(userId);
        summary.put("totalTransactions", totalTransactions);
        
        // Total amount by type
        BigDecimal totalDeposits = transactionRepository.sumAmountByUserIdAndType(userId, TransactionType.DEPOSIT);
        BigDecimal totalWithdrawals = transactionRepository.sumAmountByUserIdAndType(userId, TransactionType.WITHDRAWAL);
        summary.put("totalDeposits", totalDeposits != null ? totalDeposits : BigDecimal.ZERO);
        summary.put("totalWithdrawals", totalWithdrawals != null ? totalWithdrawals : BigDecimal.ZERO);
        
        // Transactions by status
        long completedTransactions = transactionRepository.countByUserIdAndStatus(userId, "COMPLETED");
        long pendingTransactions = transactionRepository.countByUserIdAndStatus(userId, "PENDING");
        long failedTransactions = transactionRepository.countByUserIdAndStatus(userId, "FAILED");
        
        summary.put("completedTransactions", completedTransactions);
        summary.put("pendingTransactions", pendingTransactions);
        summary.put("failedTransactions", failedTransactions);
        
        // Recent activity (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long recentTransactions = transactionRepository.countByUserIdAndCreatedAtAfter(userId, weekAgo);
        summary.put("recentTransactions", recentTransactions);
        
        return summary;
    }

    /**
     * Get transaction by ID
     */
    public Optional<Transaction> getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId);
    }

    /**
     * Get transactions by reference with enhanced DTO
     */
    public List<TransactionHistoryDto> getTransactionsByReference(String reference) {
        List<Transaction> transactions = transactionRepository.findByReference(reference);
        return transactions.stream()
                .map(TransactionHistoryDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Get transactions by status with enhanced DTO
     */
    public List<TransactionHistoryDto> getTransactionsByStatus(String status) {
        List<Transaction> transactions = transactionRepository.findByStatus(status);
        return transactions.stream()
                .map(TransactionHistoryDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Get transactions by type with enhanced DTO
     */
    public List<TransactionHistoryDto> getTransactionsByType(String type) {
        List<Transaction> transactions = transactionRepository.findByType(TransactionType.valueOf(type.toUpperCase()));
        return transactions.stream()
                .map(TransactionHistoryDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Get recent transactions with enhanced DTO
     */
    public List<TransactionHistoryDto> getRecentTransactions(Long userId, int limit) {
        List<Transaction> transactions = transactionRepository.findRecentTransactionsByUserId(userId, limit);
        return transactions.stream()
                .map(TransactionHistoryDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Update transaction status
     */
    public Transaction updateTransactionStatus(Long transactionId, String status) {
        Optional<Transaction> transactionOpt = transactionRepository.findById(transactionId);
        if (transactionOpt.isPresent()) {
            Transaction transaction = transactionOpt.get();
            transaction.setStatus(status);
            transaction.setUpdatedAt(LocalDateTime.now());
            return transactionRepository.save(transaction);
        }
        throw new RuntimeException("Transaction not found with ID: " + transactionId);
    }

    /**
     * Export transaction history to CSV with enhanced information
     */
    public String exportTransactionHistory(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Transaction> transactions;
        
        if (startDate != null && endDate != null) {
            transactions = transactionRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
        } else {
            transactions = transactionRepository.findUserTransactions(userId);
        }
        
        StringBuilder csv = new StringBuilder();
        csv.append("Transaction ID,Wallet ID,Type,Display Type,Amount,Currency,Description,Reference,Status,Recipient,Sender,Date,Time\n");
        
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        for (Transaction transaction : transactions) {
            TransactionHistoryDto dto = new TransactionHistoryDto(transaction);
            csv.append(String.format("%d,%d,%s,%s,%s,%s,\"%s\",%s,%s,%s,%s,%s,%s\n",
                transaction.getId(),
                transaction.getWallet().getId(),
                transaction.getType(),
                dto.getDisplayType(),
                transaction.getAmount(),
                transaction.getCurrency(),
                transaction.getDescription().replace("\"", "\"\""),
                transaction.getReference(),
                transaction.getStatus(),
                dto.getRecipientName() != null ? dto.getRecipientName().replace("\"", "\"\"") : "",
                dto.getSenderName() != null ? dto.getSenderName().replace("\"", "\"\"") : "",
                dto.getFormattedDate(),
                dto.getFormattedTime()
            ));
        }
        
        return csv.toString();
    }
} 