package com.swift.wallet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transfer")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class TransferController {

    @Autowired
    private com.swift.wallet.service.ExchangeRateService exchangeRateService;

    @GetMapping("/rates")
    public ResponseEntity<?> getTransferRates() {
        try {
            // Test exchange rate service
            System.out.println("Testing exchange rates...");
            
            // Test GHS to USD
            BigDecimal ghsToUsd = exchangeRateService.getExchangeRate(
                com.swift.wallet.enums.CurrencyType.GHS, 
                com.swift.wallet.enums.CurrencyType.USD
            );
            
            // Test USD to GHS
            BigDecimal usdToGhs = exchangeRateService.getExchangeRate(
                com.swift.wallet.enums.CurrencyType.USD, 
                com.swift.wallet.enums.CurrencyType.GHS
            );
            
            // Test EUR to GBP
            BigDecimal eurToGbp = exchangeRateService.getExchangeRate(
                com.swift.wallet.enums.CurrencyType.EUR, 
                com.swift.wallet.enums.CurrencyType.GBP
            );
            
            System.out.println("Exchange rates tested - GHS to USD: " + ghsToUsd + 
                             ", USD to GHS: " + usdToGhs + 
                             ", EUR to GBP: " + eurToGbp);
            
            // Return current exchange rates
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("rates", new Object[]{
                Map.of(
                    "fromCurrency", "GHS",
                    "toCurrency", "USD",
                    "rate", ghsToUsd,
                    "lastUpdated", "2024-01-15T10:30:00"
                ),
                Map.of(
                    "fromCurrency", "GHS",
                    "toCurrency", "EUR",
                    "rate", exchangeRateService.getExchangeRate(
                        com.swift.wallet.enums.CurrencyType.GHS, 
                        com.swift.wallet.enums.CurrencyType.EUR
                    ),
                    "lastUpdated", "2024-01-15T10:30:00"
                ),
                Map.of(
                    "fromCurrency", "GHS",
                    "toCurrency", "GBP",
                    "rate", exchangeRateService.getExchangeRate(
                        com.swift.wallet.enums.CurrencyType.GHS, 
                        com.swift.wallet.enums.CurrencyType.GBP
                    ),
                    "lastUpdated", "2024-01-15T10:30:00"
                ),
                Map.of(
                    "fromCurrency", "USD",
                    "toCurrency", "GHS",
                    "rate", usdToGhs,
                    "lastUpdated", "2024-01-15T10:30:00"
                ),
                Map.of(
                    "fromCurrency", "EUR",
                    "toCurrency", "GHS",
                    "rate", exchangeRateService.getExchangeRate(
                        com.swift.wallet.enums.CurrencyType.EUR, 
                        com.swift.wallet.enums.CurrencyType.GHS
                    ),
                    "lastUpdated", "2024-01-15T10:30:00"
                ),
                Map.of(
                    "fromCurrency", "GBP",
                    "toCurrency", "GHS",
                    "rate", exchangeRateService.getExchangeRate(
                        com.swift.wallet.enums.CurrencyType.GBP, 
                        com.swift.wallet.enums.CurrencyType.GHS
                    ),
                    "lastUpdated", "2024-01-15T10:30:00"
                )
            });
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error testing exchange rates: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch transfer rates: " + e.getMessage());
        }
    }

    @PostMapping("/initiate")
    public ResponseEntity<?> initiateTransfer(@RequestBody Map<String, Object> request) {
        try {
            String fromCurrency = (String) request.get("fromCurrency");
            String toCurrency = (String) request.get("toCurrency");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());

            // For demo purposes, create a mock transfer
            String transferId = "TRANSFER_" + System.currentTimeMillis();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transferId", transferId);
            response.put("fromCurrency", fromCurrency);
            response.put("toCurrency", toCurrency);
            response.put("amount", amount);
            response.put("message", "Transfer initiated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to initiate transfer: " + e.getMessage());
        }
    }

    @PostMapping("/process")
    public ResponseEntity<?> processTransfer(@RequestBody Map<String, Object> request) {
        try {
            String transferId = (String) request.get("transferId");
            Map<String, Object> confirmationDetails = (Map<String, Object>) request.get("confirmationDetails");

            // For demo purposes, assume success
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transfer processed successfully");
            response.put("transactionId", transferId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process transfer: " + e.getMessage());
        }
    }
} 