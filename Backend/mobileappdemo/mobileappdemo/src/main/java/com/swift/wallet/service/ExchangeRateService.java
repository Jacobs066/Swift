package com.swift.wallet.service;

import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.models.ExchangeRate;
import com.swift.wallet.repository.ExchangeRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ExchangeRateService {

    @Autowired
    private ExchangeRateRepository exchangeRateRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${exchange.rate.api.key}")
    private String apiKey;

    @Value("${exchange.rate.api.url:https://api.exchangerate-api.com/v4/latest/}")
    private String apiUrl;

    /**
     * Get exchange rate between two currencies
     */
    public BigDecimal getExchangeRate(CurrencyType fromCurrency, CurrencyType toCurrency) {
        // Check cache first
        Optional<ExchangeRate> cachedRate = exchangeRateRepository
                .findValidExchangeRate(fromCurrency, toCurrency, LocalDateTime.now());

        if (cachedRate.isPresent()) {
            return cachedRate.get().getRate();
        }

        // Fetch from API
        BigDecimal rate = fetchExchangeRateFromAPI(fromCurrency, toCurrency);

        // Save to cache
        ExchangeRate exchangeRate = new ExchangeRate(fromCurrency, toCurrency, rate);
        exchangeRateRepository.save(exchangeRate);

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
     * Clear expired exchange rates
     */
    public void clearExpiredRates() {
        exchangeRateRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    // Inner class for API response
    public static class ExchangeRateResponse {
        private String base;
        private String date;
        private java.util.Map<String, BigDecimal> rates;

        // Getters and setters
        public String getBase() { return base; }
        public void setBase(String base) { this.base = base; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public java.util.Map<String, BigDecimal> getRates() { return rates; }
        public void setRates(java.util.Map<String, BigDecimal> rates) { this.rates = rates; }
    }
} 