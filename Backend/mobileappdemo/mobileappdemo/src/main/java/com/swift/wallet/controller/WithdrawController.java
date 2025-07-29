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
@RequestMapping("/api/withdraw")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class WithdrawController {

    @Autowired
    private com.swift.wallet.service.PaystackService paystackService;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/methods")
    public ResponseEntity<?> getWithdrawMethods() {
        try {
            // Return available withdraw methods
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("methods", new Object[]{
                Map.of(
                    "id", "mobile_money",
                    "name", "Mobile Money",
                    "description", "Withdraw to Mobile Money",
                    "icon", "phone-portrait-outline",
                    "enabled", true
                ),
                Map.of(
                    "id", "bank",
                    "name", "Bank Transfer",
                    "description", "Withdraw to Bank Account",
                    "icon", "business-outline",
                    "enabled", true
                )
            });
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch withdraw methods: " + e.getMessage());
        }
    }

    @PostMapping("/initiate")
    public ResponseEntity<?> initiateWithdraw(@RequestBody Map<String, Object> request) {
        try {
            String method = (String) request.get("method");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            Map<String, Object> recipientDetails = (Map<String, Object>) request.get("recipientDetails");
            Long userId = request.containsKey("userId") ? Long.valueOf(request.get("userId").toString()) : 1L;

            System.out.println("Initiating withdrawal - Method: " + method + ", Amount: " + amount + ", User ID: " + userId);

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

            // Record withdrawal transaction
            String reference = "WITHDRAW_" + System.currentTimeMillis();
            transactionService.createTransaction(ghsWallet, com.swift.wallet.enums.TransactionType.WITHDRAWAL, amount.negate(), com.swift.wallet.enums.CurrencyType.GHS, "Withdrawal via " + method, reference);

            System.out.println("Withdrawal transaction recorded successfully");
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("withdrawalId", reference);
                response.put("method", method);
                response.put("amount", amount);
            response.put("message", "Withdrawal to " + method + " initiated successfully");
            response.put("isMock", true); // Flag for frontend to show test mode
                
                return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Failed to initiate withdrawal: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to initiate withdrawal: " + e.getMessage());
        }
    }
    
    private String createMobileMoneyRecipient(Map<String, Object> recipientDetails) {
        try {
            // Create Paystack transfer recipient for mobile money
            com.swift.wallet.dto.PaystackTransferRecipientRequest recipientRequest = new com.swift.wallet.dto.PaystackTransferRecipientRequest();
            recipientRequest.setName((String) recipientDetails.get("fullName"));
            recipientRequest.setAccount_number((String) recipientDetails.get("phoneNumber"));
            recipientRequest.setBank_code("MPS"); // Mobile money code
            recipientRequest.setCurrency("GHS");
            
            return paystackService.createTransferRecipient(recipientRequest);
        } catch (Exception e) {
            System.err.println("Failed to create mobile money recipient: " + e.getMessage());
            // Fallback to mock recipient for demo
        return "RCP_MOBILE_" + System.currentTimeMillis();
        }
    }
    
    private String createBankRecipient(Map<String, Object> recipientDetails) {
        try {
            // Create Paystack transfer recipient for bank transfer
            com.swift.wallet.dto.PaystackTransferRecipientRequest recipientRequest = new com.swift.wallet.dto.PaystackTransferRecipientRequest();
            recipientRequest.setName((String) recipientDetails.get("fullName"));
            recipientRequest.setAccount_number((String) recipientDetails.get("accountNumber"));
            recipientRequest.setBank_code((String) recipientDetails.get("bankCode"));
            recipientRequest.setCurrency("GHS");
            
            return paystackService.createTransferRecipient(recipientRequest);
        } catch (Exception e) {
            System.err.println("Failed to create bank recipient: " + e.getMessage());
            // Fallback to mock recipient for demo
        return "RCP_BANK_" + System.currentTimeMillis();
        }
    }
    
    private ResponseEntity<?> createMockWithdrawalResponse(String method, BigDecimal amount, Map<String, Object> recipientDetails, String reference) {
        try {
            // Create a mock Paystack response for testing
            Map<String, Object> mockPaystackResponse = new HashMap<>();
            mockPaystackResponse.put("status", true);
            mockPaystackResponse.put("message", "Transfer initiated successfully");
            
            Map<String, Object> mockData = new HashMap<>();
            mockData.put("domain", "test");
            mockData.put("amount", amount.multiply(BigDecimal.valueOf(100)).longValue());
            mockData.put("currency", "GHS");
            mockData.put("source", "balance");
            mockData.put("reason", method.equals("mobile_money") ? "Mobile Money Withdrawal" : "Bank Withdrawal");
            mockData.put("recipient", recipientDetails.get("fullName"));
            mockData.put("status", "pending");
            mockData.put("transfer_code", "TRF_" + System.currentTimeMillis());
            mockData.put("id", System.currentTimeMillis());
            mockData.put("createdAt", "2024-01-15T10:30:00.000Z");
            mockData.put("updatedAt", "2024-01-15T10:30:00.000Z");
            
            mockPaystackResponse.put("data", mockData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("withdrawalId", reference);
            response.put("paystackResponse", mockPaystackResponse);
            response.put("method", method);
            response.put("amount", amount);
            response.put("recipientDetails", recipientDetails);
            response.put("isMock", true); // Flag to indicate this is a mock response
            
            System.out.println("Created mock withdrawal response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Failed to create mock withdrawal response: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create withdrawal response: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 