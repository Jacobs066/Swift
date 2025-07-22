package com.swift.wallet.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.swift.wallet.enums.CurrencyType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class ExchangeRateService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${exchange.rate.api.key}")
    private String apiKey;

    @Value("${exchange.rate.api.url:https://v6.exchangerate-api.com/v6/}")
    private String apiUrl;

    // Caffeine cache for exchange rates
    private final Cache<String, BigDecimal> exchangeRateCache = Caffeine.newBuilder()
            .expireAfterWrite(30, TimeUnit.MINUTES) // Cache for 30 minutes
            .maximumSize(100) // Maximum 100 entries
            .build();

    /**
     * Get exchange rate between two currencies
     */
    public BigDecimal getExchangeRate(CurrencyType fromCurrency, CurrencyType toCurrency) {
        // Check cache first
        String cacheKey = fromCurrency.name() + "_TO_" + toCurrency.name();
        BigDecimal cachedRate = exchangeRateCache.getIfPresent(cacheKey);

        if (cachedRate != null) {
            return cachedRate;
        }

        // Fetch from API
        BigDecimal rate = fetchExchangeRateFromAPI(fromCurrency, toCurrency);

        // Save to cache
        exchangeRateCache.put(cacheKey, rate);

        return rate;
    }

    /**
     * Fetch exchange rate from external API
     */
    private BigDecimal fetchExchangeRateFromAPI(CurrencyType fromCurrency, CurrencyType toCurrency) {
        try {
            String url = apiUrl + fromCurrency.name();
            ExchangeRateResponse response = restTemplate.getForObject(url, ExchangeRateResponse.class);

            if (response != null && response.getRates() != null) {
                BigDecimal rate = response.getRates().get(toCurrency.name());
                if (rate != null) {
                    return rate;
                }
            }

            // Fallback: return 1.0 for same currency
            if (fromCurrency == toCurrency) {
                return BigDecimal.ONE;
            }

            // Fallback: use a default rate (you might want to log this)
            return BigDecimal.valueOf(1.2); // Default fallback rate

        } catch (Exception e) {
            // Log the error and return a fallback rate
            System.err.println("Error fetching exchange rate: " + e.getMessage());
            return BigDecimal.valueOf(1.2); // Default fallback rate
        }
    }

    /**
     * Convert amount between currencies
     */
    public BigDecimal convertAmount(BigDecimal amount, CurrencyType fromCurrency, CurrencyType toCurrency) {
        if (fromCurrency == toCurrency) {
            return amount;
        }

        BigDecimal rate = getExchangeRate(fromCurrency, toCurrency);
        return amount.multiply(rate);
    }

    /**
     * Clear all cached exchange rates
     */
    public void clearCache() {
        exchangeRateCache.invalidateAll();
    }

    /**
     * Get cache statistics (for monitoring)
     */
    public String getCacheStats() {
        return exchangeRateCache.stats().toString();
    }

    // Inner class for API response
    public static class ExchangeRateResponse {
        private String base;
        private String date;
        private java.util.Map<String, BigDecimal> rates;

        public String getBase() { return base; }
        public void setBase(String base) { this.base = base; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public java.util.Map<String, BigDecimal> getRates() { return rates; }
        public void setRates(java.util.Map<String, BigDecimal> rates) { this.rates = rates; }
    }
} 