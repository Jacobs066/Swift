package com.swift.wallet.controller;

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

            // For demo purposes, create a mock recipient code
            String recipientCode = "RCP_" + System.currentTimeMillis();
            String reason = "Send via " + method;

            // Initiate Paystack transfer
            Map<String, Object> paystackResponse = paystackService.initiateTransfer(recipientCode, amount, reason);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sendId", recipientCode);
            response.put("paystackResponse", paystackResponse);
            response.put("method", method);
            response.put("amount", amount);
            response.put("recipientDetails", recipientDetails);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
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
} 