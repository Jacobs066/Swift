package com.swift.wallet.controller;

import com.swift.wallet.service.WalletService;
import com.swift.wallet.service.TransactionService;
import com.swift.wallet.repository.WalletRepository;
import com.swift.auth.repository.UserRepository;
import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.enums.TransactionType;
import com.swift.auth.models.User;
import com.swift.wallet.models.Wallet;
import com.swift.wallet.models.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.math.BigDecimal;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/v1/webhooks")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class WebhookController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${paystack.secret.key}")
    private String paystackSecretKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/paystack")
    public ResponseEntity<?> handlePaystackWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Paystack-Signature") String signature) {
        
        try {
            System.out.println("Received Paystack webhook: " + payload);
            System.out.println("Signature: " + signature);

            // Verify the webhook signature
            if (!verifyPaystackSignature(payload, signature)) {
                System.err.println("Invalid webhook signature");
                return ResponseEntity.badRequest().body("Invalid signature");
            }

            // Parse the webhook payload
            Map<String, Object> webhookData = parseWebhookPayload(payload);
            String event = (String) webhookData.get("event");
            
            System.out.println("Webhook event: " + event);

            if ("charge.success".equals(event)) {
                return handleChargeSuccess(webhookData);
            } else {
                System.out.println("Unhandled webhook event: " + event);
                return ResponseEntity.ok().body("Event received");
            }

        } catch (Exception e) {
            System.err.println("Error processing webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing webhook");
        }
    }

    private boolean verifyPaystackSignature(String payload, String signature) {
        try {
            Mac sha512Hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(paystackSecretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            sha512Hmac.init(secretKeySpec);
            byte[] hmacBytes = sha512Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            
            // Convert to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hmacBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            String expectedSignature = hexString.toString();
            System.out.println("Expected signature: " + expectedSignature);
            System.out.println("Received signature: " + signature);
            
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            System.err.println("Error verifying signature: " + e.getMessage());
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseWebhookPayload(String payload) {
        try {
            return objectMapper.readValue(payload, Map.class);
        } catch (Exception e) {
            System.err.println("Error parsing webhook payload: " + e.getMessage());
            return new HashMap<>();
        }
    }



    @SuppressWarnings("unchecked")
    private ResponseEntity<?> handleChargeSuccess(Map<String, Object> webhookData) {
        try {
            Map<String, Object> data = (Map<String, Object>) webhookData.get("data");
            Long amount = (Long) data.get("amount");
            String reference = (String) data.get("reference");
            
            // Extract customer email from nested customer object
            String customerEmail = null;
            Map<String, Object> customer = (Map<String, Object>) data.get("customer");
            if (customer != null) {
                customerEmail = (String) customer.get("email");
            }
            
            Map<String, Object> metadata = (Map<String, Object>) data.get("metadata");
            
            System.out.println("Processing charge.success - Amount: " + amount + ", Reference: " + reference + ", Email: " + customerEmail);
            
            // Find user by email or metadata
            User user = findUserFromWebhook(customerEmail, metadata);
            if (user == null) {
                System.err.println("User not found for email: " + customerEmail);
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Convert amount from kobo to naira (Paystack amounts are in kobo)
            BigDecimal depositAmount = BigDecimal.valueOf(amount).divide(BigDecimal.valueOf(100));
            
            // Find or create user's primary wallet (GHS)
            Optional<Wallet> primaryWalletOpt = walletRepository.findUserWalletByCurrency(user.getId(), CurrencyType.GHS);
            Wallet primaryWallet;
            
            if (primaryWalletOpt.isEmpty()) {
                // Create primary wallet if it doesn't exist
                walletService.createUserWallets(user);
                primaryWalletOpt = walletRepository.findUserWalletByCurrency(user.getId(), CurrencyType.GHS);
                if (primaryWalletOpt.isEmpty()) {
                    System.err.println("Failed to create primary wallet for user: " + user.getId());
                    return ResponseEntity.badRequest().body("Failed to create wallet");
                }
            }
            
            primaryWallet = primaryWalletOpt.get();
            
            // Update wallet balance
            BigDecimal newBalance = primaryWallet.getBalance().add(depositAmount);
            primaryWallet.setBalance(newBalance);
            walletRepository.save(primaryWallet);
            
            // Create transaction record
            Transaction transaction = transactionService.createTransaction(
                primaryWallet,
                TransactionType.DEPOSIT,
                depositAmount,
                CurrencyType.GHS,
                "Deposit via Paystack - " + reference,
                reference
            );
            
            System.out.println("Successfully processed deposit - User: " + user.getId() + 
                             ", Amount: " + depositAmount + 
                             ", New Balance: " + newBalance + 
                             ", Transaction ID: " + transaction.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Deposit processed successfully");
            response.put("user_id", user.getId());
            response.put("amount", depositAmount);
            response.put("new_balance", newBalance);
            response.put("transaction_id", transaction.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error processing charge.success: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing deposit");
        }
    }

    private User findUserFromWebhook(String customerEmail, Map<String, Object> metadata) {
        try {
            // First try to find user by metadata user_id
            if (metadata != null && metadata.containsKey("user_id")) {
                Long userId = (Long) metadata.get("user_id");
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    System.out.println("Found user by metadata user_id: " + userId);
                    return userOpt.get();
                }
            }
            
            // Then try to find user by email
            if (customerEmail != null && !customerEmail.isEmpty()) {
                Optional<User> userOpt = userRepository.findByEmail(customerEmail);
                if (userOpt.isPresent()) {
                    System.out.println("Found user by email: " + customerEmail);
                    return userOpt.get();
                }
            }
            
            // For demo purposes, return user with ID 1 if no user found
            System.out.println("No user found, using demo user ID 1");
            return userRepository.findById(1L).orElse(null);
            
        } catch (Exception e) {
            System.err.println("Error finding user: " + e.getMessage());
            return null;
        }
    }

    // Test endpoint for webhook verification
    @GetMapping("/paystack/test")
    public ResponseEntity<?> testWebhookEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Webhook endpoint is accessible");
        response.put("timestamp", System.currentTimeMillis());
        response.put("endpoint", "/api/v1/webhooks/paystack");
        return ResponseEntity.ok(response);
    }

    // Test endpoint to simulate a webhook payload
    @PostMapping("/paystack/test-simulation")
    public ResponseEntity<?> testWebhookSimulation(@RequestBody Map<String, Object> testPayload) {
        try {
            System.out.println("Testing webhook simulation with payload: " + testPayload);
            
            // Create a mock webhook payload
            Map<String, Object> mockWebhookData = new HashMap<>();
            mockWebhookData.put("event", "charge.success");
            mockWebhookData.put("data", testPayload);
            
            return handleChargeSuccess(mockWebhookData);
        } catch (Exception e) {
            System.err.println("Error in webhook simulation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error in webhook simulation: " + e.getMessage());
        }
    }
} 