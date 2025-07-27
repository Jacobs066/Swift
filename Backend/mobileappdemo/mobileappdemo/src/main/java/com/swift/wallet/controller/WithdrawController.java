package com.swift.wallet.controller;

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
                    "icon", "mobile",
                    "enabled", true
                ),
                Map.of(
                    "id", "bank",
                    "name", "Bank Transfer",
                    "description", "Withdraw to Bank Account",
                    "icon", "bank",
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
            Map<String, Object> accountDetails = (Map<String, Object>) request.get("accountDetails");

            // For demo purposes, create a mock recipient code
            String recipientCode = "RCP_" + System.currentTimeMillis();
            String reason = "Withdrawal via " + method;

            // Initiate Paystack transfer
            Map<String, Object> paystackResponse = paystackService.initiateTransfer(recipientCode, amount, reason);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("withdrawId", recipientCode);
            response.put("paystackResponse", paystackResponse);
            response.put("method", method);
            response.put("amount", amount);
            response.put("accountDetails", accountDetails);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to initiate withdraw: " + e.getMessage());
        }
    }
} 