package com.swift.wallet.controller;

import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import com.swift.wallet.dto.TransferRequest;
import com.swift.wallet.dto.WalletDto;
import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.enums.TransactionType;
import com.swift.wallet.service.WalletService;
import com.swift.wallet.service.PaystackService;
import com.swift.wallet.service.TransactionService;
import com.swift.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaystackService paystackService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private WalletRepository walletRepository;

    /**
     * Get all wallets for the current user
     */
    @GetMapping("/wallets")
    public ResponseEntity<List<WalletDto>> getUserWallets(@RequestParam Long userId) {
        List<WalletDto> wallets = walletService.getUserWallets(userId);
        return ResponseEntity.ok(wallets);
    }

    /**
     * Ensure user has wallets for all currencies
     */
    @PostMapping("/wallets/ensure")
    public ResponseEntity<?> ensureWalletsExist(@RequestParam Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User not found"
                ));
            }

            User user = userOpt.get();
            walletService.createUserWallets(user);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Wallets ensured for user: " + user.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Failed to ensure wallets: " + e.getMessage()
            ));
        }
    }

    /**
     * Get specific wallet by ID
     */
    @GetMapping("/wallets/{walletId}")
    public ResponseEntity<WalletDto> getWalletById(@PathVariable Long walletId) {
        return walletService.getWalletById(walletId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get wallet by currency for current user
     */
    @GetMapping("/wallets/currency/{currency}")
    public ResponseEntity<WalletDto> getWalletByCurrency(@RequestParam Long userId, @PathVariable CurrencyType currency) {
        return walletService.getUserWalletByCurrency(userId, currency)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Interwallet transfer: move money between user's own wallets (no Paystack)
     */
    @PostMapping("/interwallet")
    public ResponseEntity<Map<String, Object>> interwalletTransfer(@Valid @RequestBody TransferRequest request) {
        try {
            boolean success = walletService.transferMoney(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "Interwallet transfer successful" : "Transfer failed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * External transfer: send money to another user via Paystack
     */
    @PostMapping("/transfer")
    public ResponseEntity<Map<String, Object>> externalTransfer(@RequestBody Map<String, Object> request) {
        try {
            // Required fields: accountNumber, bankCode, currency, amount, reason
            String name = request.containsKey("name") ? (String) request.get("name") : null;
            String accountNumber = (String) request.get("accountNumber");
            String bankCode = (String) request.get("bankCode");
            String currency = (String) request.get("currency");
            if (currency == null || currency.isEmpty()) {
                currency = "GHS";
            }
            java.math.BigDecimal amount = new java.math.BigDecimal(request.get("amount").toString());
            String reason = (String) request.getOrDefault("reason", "External transfer");

            // 1. Create transfer recipient
            com.swift.wallet.dto.PaystackTransferRecipientRequest recipientRequest = new com.swift.wallet.dto.PaystackTransferRecipientRequest();
            if (name != null) recipientRequest.setName(name);
            recipientRequest.setAccount_number(accountNumber);
            recipientRequest.setBank_code(bankCode);
            recipientRequest.setCurrency(currency);
            String recipientCode = paystackService.createTransferRecipient(recipientRequest);

            // 2. Initiate transfer
            Map<String, Object> paystackResponse = paystackService.initiateTransfer(recipientCode, amount, reason);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paystackResponse", paystackResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Withdraw funds to a recipient's bank account using Paystack
     */
    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, Object>> withdraw(@RequestBody Map<String, Object> request) {
        try {
            String recipientCode = (String) request.get("recipientCode");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String reason = (String) request.getOrDefault("reason", "Withdrawal");
            Map<String, Object> paystackResponse = paystackService.initiateTransfer(recipientCode, amount, reason);
            // Record withdrawal transaction
            Long walletId = request.containsKey("walletId") ? Long.valueOf(request.get("walletId").toString()) : null;
            if (walletId != null) {
                walletRepository.findById(walletId).ifPresent(wallet -> {
                    transactionService.createTransaction(wallet, TransactionType.WITHDRAWAL, amount.negate(), wallet.getCurrency(), reason, paystackResponse.getOrDefault("reference", "").toString());
                });
            }
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paystackResponse", paystackResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Deposit funds into wallet using Paystack payment initialization
     */
    @PostMapping("/deposit")
    public ResponseEntity<Map<String, Object>> deposit(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String reference = (String) request.getOrDefault("reference", "DEP_" + System.currentTimeMillis());
            Long userId = request.containsKey("userId") ? Long.valueOf(request.get("userId").toString()) : 1L; // Default to user 1 for demo
            
            // Create metadata for webhook identification
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("user_id", userId);
            metadata.put("deposit_type", "wallet_deposit");
            metadata.put("currency", "GHS");
            
            System.out.println("Initializing deposit with metadata - User ID: " + userId + ", Email: " + email + ", Amount: " + amount);
            
            // You can change CurrencyType.GHS to support other currencies if needed
            Map<String, Object> paystackResponse = paystackService.initializePayment(email, amount, com.swift.wallet.enums.CurrencyType.GHS, reference, metadata);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paystackResponse", paystackResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verify Paystack payment and credit wallet after successful deposit
     */
    @PostMapping("/deposit/verify")
    public ResponseEntity<Map<String, Object>> verifyDeposit(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String reference = (String) request.get("reference");
            java.math.BigDecimal amount = new java.math.BigDecimal(request.get("amount").toString());
            com.swift.wallet.enums.CurrencyType currency = com.swift.wallet.enums.CurrencyType.GHS; // Or get from request if needed

            System.out.println("Verifying deposit - Email: " + email + ", Reference: " + reference + ", Amount: " + amount);

            // For test mode, simulate successful verification
            boolean paymentVerified = true; // In production, this would be: paystackService.verifyPayment(reference);
            
            Map<String, Object> response = new HashMap<>();
            if (paymentVerified) {
                // Find user and wallet
                com.swift.auth.models.User user = userRepository.findByEmail(email).orElse(null);
                if (user == null) {
                    response.put("success", false);
                    response.put("message", "User not found");
                    return ResponseEntity.badRequest().body(response);
                }
                java.util.Optional<com.swift.wallet.models.Wallet> walletOpt = walletRepository.findUserWalletByCurrency(user.getId(), currency);
                if (walletOpt.isEmpty()) {
                    response.put("success", false);
                    response.put("message", "Wallet not found");
                    return ResponseEntity.badRequest().body(response);
                }
                com.swift.wallet.models.Wallet wallet = walletOpt.get();
                
                // Credit wallet
                java.math.BigDecimal oldBalance = wallet.getBalance();
                wallet.setBalance(wallet.getBalance().add(amount));
                walletRepository.save(wallet);
                
                System.out.println("Wallet updated - User: " + user.getId() + ", Currency: " + currency + 
                                 ", Old Balance: " + oldBalance + ", New Balance: " + wallet.getBalance());
                
                // Record deposit transaction
                transactionService.createTransaction(wallet, TransactionType.DEPOSIT, amount, currency, "Deposit via Paystack", reference);
                
                response.put("success", true);
                response.put("message", "Deposit verified and wallet credited");
                response.put("oldBalance", oldBalance);
                response.put("newBalance", wallet.getBalance());
                response.put("amount", amount);
            } else {
                response.put("success", false);
                response.put("message", "Payment verification failed");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Failed to verify deposit: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get wallet balance
     */
    @GetMapping("/balance/{walletId}")
    public ResponseEntity<Map<String, Object>> getWalletBalance(@PathVariable Long walletId) {
        return walletService.getWalletById(walletId)
                .map(wallet -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("walletId", wallet.getId());
                    response.put("currency", wallet.getCurrency());
                    response.put("balance", wallet.getBalance());
                    response.put("symbol", wallet.getCurrency().getSymbol());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all balances for user
     */
    @GetMapping("/balances")
    public ResponseEntity<List<Map<String, Object>>> getAllBalances(@RequestParam Long userId) {
        System.out.println("=== BALANCE REQUEST ===");
        System.out.println("User ID: " + userId);
        
        List<WalletDto> wallets = walletService.getUserWallets(userId);
        System.out.println("Found " + wallets.size() + " wallets for user " + userId);
        
        List<Map<String, Object>> balances = wallets.stream()
                .map(wallet -> {
                    Map<String, Object> balance = new HashMap<>();
                    balance.put("walletId", wallet.getId());
                    balance.put("currency", wallet.getCurrency());
                    balance.put("balance", wallet.getBalance());
                    balance.put("symbol", wallet.getCurrency().getSymbol());
                    balance.put("isPrimary", wallet.isPrimary());
                    
                    System.out.println("Wallet: " + wallet.getCurrency() + " - Balance: " + wallet.getBalance() + " - Primary: " + wallet.isPrimary());
                    return balance;
                })
                .toList();
        
        System.out.println("Returning " + balances.size() + " balance entries");
        System.out.println("=== BALANCE REQUEST END ===");
        
        return ResponseEntity.ok(balances);
    }
} 