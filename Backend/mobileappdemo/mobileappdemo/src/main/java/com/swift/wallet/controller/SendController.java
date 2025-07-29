package com.swift.wallet.controller;

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
@RequestMapping("/api/send")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class SendController {

    @Autowired
    private com.swift.wallet.service.PaystackService paystackService;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/methods")
    public ResponseEntity<?> getSendMethods() {
        try {
            // Return available send methods
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("methods", new Object[]{
                Map.of(
                    "id", "bank",
                    "name", "Bank Transfer",
                    "description", "Send to Bank Account",
                    "icon", "bank",
                    "enabled", true
                ),
                Map.of(
                    "id", "mobile_money",
                    "name", "Mobile Money",
                    "description", "Send to Mobile Money",
                    "icon", "mobile",
                    "enabled", true
                )
            });
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch send methods: " + e.getMessage());
        }
    }

    @PostMapping("/initiate")
    public ResponseEntity<?> initiateSend(@RequestBody Map<String, Object> request) {
        try {
            String method = (String) request.get("method");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            Map<String, Object> recipientDetails = (Map<String, Object>) request.get("recipientDetails");
            Long userId = request.containsKey("userId") ? Long.valueOf(request.get("userId").toString()) : 1L;

            System.out.println("Initiating send - Method: " + method + ", Amount: " + amount + ", User ID: " + userId);

            // Check GHS wallet balance
            java.util.Optional<com.swift.wallet.models.Wallet> ghsWalletOpt = walletRepository.findUserWalletByCurrency(userId, com.swift.wallet.enums.CurrencyType.GHS);
            if (ghsWalletOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "GHS wallet not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            com.swift.wallet.models.Wallet ghsWallet = ghsWalletOpt.get();
            
            // Check sufficient balance
            if (ghsWallet.getBalance().compareTo(amount) < 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Insufficient funds in GHS wallet");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Deduct from GHS wallet
            java.math.BigDecimal oldBalance = ghsWallet.getBalance();
            ghsWallet.setBalance(ghsWallet.getBalance().subtract(amount));
            walletRepository.save(ghsWallet);

            System.out.println("GHS wallet debited - User: " + userId + ", Old Balance: " + oldBalance + ", New Balance: " + ghsWallet.getBalance());

            // Record send transaction
            String reference = "SEND_" + System.currentTimeMillis();
            transactionService.createTransaction(ghsWallet, com.swift.wallet.enums.TransactionType.TRANSFER, amount.negate(), com.swift.wallet.enums.CurrencyType.GHS, "Send via " + method, reference);

            System.out.println("Send transaction recorded successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sendId", reference);
            response.put("method", method);
            response.put("amount", amount);
            response.put("message", "Send to " + method + " initiated successfully");
            response.put("isMock", true); // Flag for frontend to show test mode

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Failed to initiate send: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to initiate send: " + e.getMessage());
        }
    }

    @PostMapping("/process")
    public ResponseEntity<?> processSend(@RequestBody Map<String, Object> request) {
        try {
            String sendId = (String) request.get("sendId");
            Map<String, Object> paymentDetails = (Map<String, Object>) request.get("paymentDetails");

            // For demo purposes, assume success
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Send processed successfully");
            response.put("transactionId", sendId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process send: " + e.getMessage());
        }
    }
    
    private ResponseEntity<?> createMockSendResponse(String method, BigDecimal amount, Map<String, Object> recipientDetails) {
        try {
            // Create a mock Paystack response for testing
            Map<String, Object> mockPaystackResponse = new HashMap<>();
            mockPaystackResponse.put("status", true);
            mockPaystackResponse.put("message", "Send initiated successfully");
            
            Map<String, Object> mockData = new HashMap<>();
            mockData.put("domain", "test");
            mockData.put("amount", amount.multiply(BigDecimal.valueOf(100)).longValue());
            mockData.put("currency", "GHS");
            mockData.put("source", "balance");
            mockData.put("reason", "Send via " + method);
            mockData.put("recipient", recipientDetails.get("accountName") != null ? recipientDetails.get("accountName") : "Recipient");
            mockData.put("status", "pending");
            mockData.put("transfer_code", "TRF_" + System.currentTimeMillis());
            mockData.put("id", System.currentTimeMillis());
            mockData.put("createdAt", "2024-01-15T10:30:00.000Z");
            mockData.put("updatedAt", "2024-01-15T10:30:00.000Z");
            
            mockPaystackResponse.put("data", mockData);
            
            String sendId = "SEND_" + System.currentTimeMillis();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sendId", sendId);
            response.put("paystackResponse", mockPaystackResponse);
            response.put("method", method);
            response.put("amount", amount);
            response.put("recipientDetails", recipientDetails);
            response.put("isMock", true); // Flag to indicate this is a mock response
            
            System.out.println("Created mock send response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Failed to create mock send response: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create send response: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 