package com.swift.wallet.controller;

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
                    "icon", "mobile",
                    "enabled", true
                ),
                Map.of(
                    "id", "bank",
                    "name", "Bank Transfer",
                    "description", "Deposit via Bank Transfer",
                    "icon", "bank",
                    "enabled", true
                ),
                Map.of(
                    "id", "card",
                    "name", "Debit/Credit Card",
                    "description", "Deposit via Card",
                    "icon", "card",
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
            String reference = "DEP_" + System.currentTimeMillis();

            // Initialize Paystack payment for all deposit methods
            Map<String, Object> paystackResponse = paystackService.initializePayment(
                email, 
                amount, 
                com.swift.wallet.enums.CurrencyType.GHS, 
                reference
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("depositId", reference);
            response.put("paystackResponse", paystackResponse);
            response.put("method", method);
            response.put("amount", amount);
            response.put("email", email);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
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