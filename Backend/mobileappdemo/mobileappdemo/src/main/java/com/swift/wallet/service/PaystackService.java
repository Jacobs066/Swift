package com.swift.wallet.service;

import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.models.Wallet;
import com.swift.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaystackService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private WalletRepository walletRepository;

    @Value("${paystack.secret.key}")
    private String secretKey;

    @Value("${paystack.public.key}")
    private String publicKey;

    @Value("${paystack.api.url:https://api.paystack.co}")
    private String apiUrl;

    /**
     * Initialize payment
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> initializePayment(String email, BigDecimal amount, CurrencyType currency, String reference) {
        String url = apiUrl + "/transaction/initialize";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + secretKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("email", email);
        requestBody.put("amount", amount.multiply(BigDecimal.valueOf(100)).longValue()); // Convert to kobo
        requestBody.put("currency", currency.name());
        requestBody.put("reference", reference);
        requestBody.put("callback_url", "http://localhost:3000/payment/callback");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(url, request, (Class<Map<String, Object>>) (Class<?>) Map.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize payment: " + e.getMessage());
        }
    }

    /**
     * Verify payment
     */
    @SuppressWarnings("unchecked")
    public boolean verifyPayment(String reference) {
        String url = apiUrl + "/transaction/verify/" + reference;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.GET, request, (Class<Map<String, Object>>) (Class<?>) Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null) {
                Boolean status = (Boolean) responseBody.get("status");
                if (status != null && status) {
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    if (data != null) {
                        String paymentStatus = (String) data.get("status");
                        return "success".equals(paymentStatus);
                    }
                }
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify payment: " + e.getMessage());
        }
    }

    /**
     * Process payment to wallet
     */
    public boolean processPaymentToWallet(String email, BigDecimal amount, CurrencyType currency, String reference) {
        // Verify payment first
        if (!verifyPayment(reference)) {
            throw new RuntimeException("Payment verification failed");
        }

        // Find user's wallet for the currency
        // Note: You'll need to implement user lookup by email
        // For now, we'll assume we have the user ID
        // This is a simplified version - you'll need to adapt based on your user management

        return true;
    }

    /**
     * Get Paystack public key
     */
    public String getPublicKey() {
        return publicKey;
    }
} 