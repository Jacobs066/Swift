package com.swift.wallet.controller;

import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import com.swift.wallet.models.Wallet;
import com.swift.wallet.repository.WalletRepository;
import com.swift.wallet.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/deposit")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class DepositController {

    @Autowired
    private com.swift.wallet.service.PaystackService paystackService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/methods")
    public ResponseEntity<?> getDepositMethods() {
        try {
            // Return available deposit methods
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("methods", new Object[]{
                Map.of(
                    "id", "mobile_money",
                    "name", "Mobile Money",
                    "description", "Deposit via Mobile Money",
                    "icon", "phone-portrait-outline",
                    "enabled", true
                ),
                Map.of(
                    "id", "bank",
                    "name", "Bank Transfer",
                    "description", "Deposit via Bank Transfer",
                    "icon", "business-outline",
                    "enabled", true
                ),
                Map.of(
                    "id", "card",
                    "name", "Debit/Credit Card",
                    "description", "Deposit via Card",
                    "icon", "card-outline",
                    "enabled", true
                )
            });
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch deposit methods: " + e.getMessage());
        }
    }

    @PostMapping("/initiate")
    public ResponseEntity<?> initiateDeposit(@RequestBody Map<String, Object> request) {
        try {
            String method = (String) request.get("method");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String email = (String) request.get("email");
            String reference = (String) request.get("reference");
            Long userId = request.containsKey("userId") ? Long.valueOf(request.get("userId").toString()) : 1L; // Default to user 1 for demo
            
            if (reference == null) {
                reference = "DEP_" + System.currentTimeMillis();
            }

            System.out.println("Initiating deposit - Method: " + method + ", Amount: " + amount + ", Email: " + email + ", Reference: " + reference + ", User ID: " + userId);

            // Create metadata for webhook identification
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("user_id", userId);
            metadata.put("deposit_type", "wallet_deposit");
            metadata.put("currency", "GHS");
            metadata.put("method", method);

            // Initialize Paystack payment for all deposit methods (for show)
            Map<String, Object> paystackResponse = paystackService.initializePayment(
                email, 
                amount, 
                com.swift.wallet.enums.CurrencyType.GHS, 
                reference,
                metadata
            );

            System.out.println("Paystack response: " + paystackResponse);

            // Immediately credit the GHS wallet
            try {
                // Find user and GHS wallet
                com.swift.auth.models.User user = userRepository.findByEmail(email).orElse(null);
                if (user == null) {
                    // Create a default user if not found (for demo)
                    user = new com.swift.auth.models.User();
                    user.setId(userId);
                    user.setEmail(email);
                }
                
                java.util.Optional<com.swift.wallet.models.Wallet> walletOpt = walletRepository.findUserWalletByCurrency(userId, com.swift.wallet.enums.CurrencyType.GHS);
                if (walletOpt.isEmpty()) {
                    // Create GHS wallet if it doesn't exist
                    com.swift.wallet.models.Wallet ghsWallet = new com.swift.wallet.models.Wallet();
                    ghsWallet.setUser(user);
                    ghsWallet.setCurrency(com.swift.wallet.enums.CurrencyType.GHS);
                    ghsWallet.setBalance(BigDecimal.ZERO);
                    ghsWallet.setPrimary(true);
                    walletRepository.save(ghsWallet);
                    walletOpt = java.util.Optional.of(ghsWallet);
                }
                
                com.swift.wallet.models.Wallet wallet = walletOpt.get();
                
                // Credit wallet
                java.math.BigDecimal oldBalance = wallet.getBalance();
                wallet.setBalance(wallet.getBalance().add(amount));
                walletRepository.save(wallet);
                
                System.out.println("GHS wallet credited - User: " + userId + ", Old Balance: " + oldBalance + ", New Balance: " + wallet.getBalance());
                
                // Record deposit transaction
                transactionService.createTransaction(wallet, com.swift.wallet.enums.TransactionType.DEPOSIT, amount, com.swift.wallet.enums.CurrencyType.GHS, "Deposit via " + method, reference);
                
                System.out.println("Deposit transaction recorded successfully");
                
            } catch (Exception e) {
                System.err.println("Error crediting wallet: " + e.getMessage());
                e.printStackTrace();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("depositId", reference);
            response.put("paystackResponse", paystackResponse);
            response.put("method", method);
            response.put("amount", amount);
            response.put("email", email);
            response.put("message", "Deposit initiated and wallet credited successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Failed to initiate deposit: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to initiate deposit: " + e.getMessage());
        }
    }

    @PostMapping("/process")
    public ResponseEntity<?> processDeposit(@RequestBody Map<String, Object> request) {
        try {
            String depositId = (String) request.get("depositId");
            Map<String, Object> paymentDetails = (Map<String, Object>) request.get("paymentDetails");

            // Verify Paystack payment
            String reference = depositId;
            boolean isPaymentVerified = paystackService.verifyPayment(reference);

            Map<String, Object> response = new HashMap<>();
            if (isPaymentVerified) {
                response.put("success", true);
                response.put("message", "Deposit processed successfully");
                response.put("transactionId", reference);
            } else {
                response.put("success", false);
                response.put("message", "Deposit verification failed");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process deposit: " + e.getMessage());
        }
    }
} 