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
            // Construct proper API URL with key
            String url = apiUrl + apiKey + "/latest/" + fromCurrency.name();
            System.out.println("Fetching exchange rate from: " + url);
            
            ExchangeRateResponse response = restTemplate.getForObject(url, ExchangeRateResponse.class);

            if (response != null && response.getRates() != null) {
                BigDecimal rate = response.getRates().get(toCurrency.name());
                if (rate != null) {
                    System.out.println("Exchange rate found: " + fromCurrency + " to " + toCurrency + " = " + rate);
                    return rate;
                }
            }

            // Fallback: return 1.0 for same currency
            if (fromCurrency == toCurrency) {
                return BigDecimal.ONE;
            }

            // Fallback: use realistic default rates based on currency pairs
            BigDecimal fallbackRate = getFallbackRate(fromCurrency, toCurrency);
            System.out.println("Using fallback rate: " + fromCurrency + " to " + toCurrency + " = " + fallbackRate);
            return fallbackRate;

        } catch (Exception e) {
            // Log the error and return a fallback rate
            System.err.println("Error fetching exchange rate: " + e.getMessage());
            BigDecimal fallbackRate = getFallbackRate(fromCurrency, toCurrency);
            System.out.println("Using fallback rate due to error: " + fromCurrency + " to " + toCurrency + " = " + fallbackRate);
            return fallbackRate;
        }
    }

    /**
     * Get realistic fallback rates for common currency pairs
     */
    private BigDecimal getFallbackRate(CurrencyType fromCurrency, CurrencyType toCurrency) {
        // GHS to other currencies
        if (fromCurrency == CurrencyType.GHS) {
            switch (toCurrency) {
                case USD: return new BigDecimal("0.12");
                case EUR: return new BigDecimal("0.11");
                case GBP: return new BigDecimal("0.095");
                default: return new BigDecimal("1.0");
            }
        }
        
        // Other currencies to GHS
        if (toCurrency == CurrencyType.GHS) {
            switch (fromCurrency) {
                case USD: return new BigDecimal("8.33");
                case EUR: return new BigDecimal("9.09");
                case GBP: return new BigDecimal("10.53");
                default: return new BigDecimal("1.0");
            }
        }
        
        // Cross-currency conversions (USD to EUR, etc.)
        if (fromCurrency == CurrencyType.USD && toCurrency == CurrencyType.EUR) {
            return new BigDecimal("0.92");
        }
        if (fromCurrency == CurrencyType.USD && toCurrency == CurrencyType.GBP) {
            return new BigDecimal("0.79");
        }
        if (fromCurrency == CurrencyType.EUR && toCurrency == CurrencyType.USD) {
            return new BigDecimal("1.09");
        }
        if (fromCurrency == CurrencyType.EUR && toCurrency == CurrencyType.GBP) {
            return new BigDecimal("0.86");
        }
        if (fromCurrency == CurrencyType.GBP && toCurrency == CurrencyType.USD) {
            return new BigDecimal("1.27");
        }
        if (fromCurrency == CurrencyType.GBP && toCurrency == CurrencyType.EUR) {
            return new BigDecimal("1.16");
        }
        
        // Default fallback
        return new BigDecimal("1.0");
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