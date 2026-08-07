package com.swift.wallet.controller;

import com.swift.wallet.dto.TransactionHistoryDto;
import com.swift.wallet.dto.WalletDto;
import com.swift.wallet.models.Transaction;
import com.swift.wallet.service.TransactionService;
import com.swift.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private WalletService walletService;

    /**
     * Get transactions for a specific wallet with pagination and enhanced display
     */
    @GetMapping("/wallet/{walletId}")
    public ResponseEntity<Map<String, Object>> getWalletTransactions(
            @PathVariable Long walletId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal Long currentUserId) {

        Optional<WalletDto> wallet = walletService.getWalletById(walletId);
        if (wallet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!wallet.get().getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TransactionHistoryDto> transactions = transactionService.getWalletTransactionsPaginated(walletId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("transactions", transactions.getContent());
        response.put("currentPage", transactions.getNumber());
        response.put("totalItems", transactions.getTotalElements());
        response.put("totalPages", transactions.getTotalPages());
        response.put("hasNext", transactions.hasNext());
        response.put("hasPrevious", transactions.hasPrevious());

        return ResponseEntity.ok(response);
    }

    /**
     * Get all transactions for a user with pagination and enhanced display
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserTransactions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal Long currentUserId) {

        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TransactionHistoryDto> transactions = transactionService.getUserTransactionsPaginated(userId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("transactions", transactions.getContent());
        response.put("currentPage", transactions.getNumber());
        response.put("totalItems", transactions.getTotalElements());
        response.put("totalPages", transactions.getTotalPages());
        response.put("hasNext", transactions.hasNext());
        response.put("hasPrevious", transactions.hasPrevious());

        return ResponseEntity.ok(response);
    }

    /**
     * Get transaction history with advanced filtering and enhanced display
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getTransactionHistory(
            @RequestParam Long userId,
            @RequestParam(required = false) Long walletId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal Long currentUserId) {

        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TransactionHistoryDto> transactions = transactionService.getTransactionHistory(
            userId, walletId, type, status, startDate, endDate, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("transactions", transactions.getContent());
        response.put("currentPage", transactions.getNumber());
        response.put("totalItems", transactions.getTotalElements());
        response.put("totalPages", transactions.getTotalPages());
        response.put("hasNext", transactions.hasNext());
        response.put("hasPrevious", transactions.hasPrevious());
        Map<String, Object> filters = new HashMap<>();
        filters.put("userId", userId);
        filters.put("walletId", walletId);
        filters.put("type", type);
        filters.put("status", status);
        filters.put("startDate", startDate);
        filters.put("endDate", endDate);
        response.put("filters", filters);

        return ResponseEntity.ok(response);
    }

    /**
     * Get transaction summary/statistics for a user
     */
    @GetMapping("/summary/{userId}")
    public ResponseEntity<Map<String, Object>> getTransactionSummary(@PathVariable Long userId, @AuthenticationPrincipal Long currentUserId) {
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Map<String, Object> summary = transactionService.getTransactionSummary(userId);
        return ResponseEntity.ok(summary);
    }

    /**
     * Get transaction by ID
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId, @AuthenticationPrincipal Long currentUserId) {
        Optional<Transaction> transaction = transactionService.getTransactionById(transactionId);
        if (transaction.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!transaction.get().getWallet().getUser().getId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(transaction.get());
    }

    /**
     * Get transactions by reference with enhanced display, scoped to the current user
     */
    @GetMapping("/reference/{reference}")
    public ResponseEntity<List<TransactionHistoryDto>> getTransactionsByReference(@PathVariable String reference, @AuthenticationPrincipal Long currentUserId) {
        List<TransactionHistoryDto> transactions = transactionService.getTransactionsByReference(reference, currentUserId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Get transactions by status with enhanced display, scoped to the current user
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TransactionHistoryDto>> getTransactionsByStatus(@PathVariable String status, @AuthenticationPrincipal Long currentUserId) {
        List<TransactionHistoryDto> transactions = transactionService.getTransactionsByStatus(status, currentUserId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Get transactions by type with enhanced display, scoped to the current user
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<TransactionHistoryDto>> getTransactionsByType(@PathVariable String type, @AuthenticationPrincipal Long currentUserId) {
        List<TransactionHistoryDto> transactions = transactionService.getTransactionsByType(type, currentUserId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Get recent transactions with enhanced display
     */
    @GetMapping("/recent/{userId}")
    public ResponseEntity<List<TransactionHistoryDto>> getRecentTransactions(@PathVariable Long userId, @AuthenticationPrincipal Long currentUserId) {
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<TransactionHistoryDto> transactions = transactionService.getRecentTransactions(userId, 5);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Update transaction status
     */
    @PutMapping("/{transactionId}/status")
    public ResponseEntity<Map<String, Object>> updateTransactionStatus(
            @PathVariable Long transactionId,
            @RequestParam String status,
            @AuthenticationPrincipal Long currentUserId) {
        try {
            Optional<Transaction> existing = transactionService.getTransactionById(transactionId);
            if (existing.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            if (!existing.get().getWallet().getUser().getId().equals(currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            Transaction transaction = transactionService.updateTransactionStatus(transactionId, status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transaction status updated successfully");
            response.put("transaction", transaction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Export transaction history (CSV format) with enhanced information
     */
    @GetMapping("/export/{userId}")
    public ResponseEntity<String> exportTransactionHistory(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @AuthenticationPrincipal Long currentUserId) {

        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String csvData = transactionService.exportTransactionHistory(userId, startDate, endDate);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=\"transactions_" + userId + ".csv\"")
                .body(csvData);
    }
} 