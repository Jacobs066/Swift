package com.swift.wallet.dto;

import com.swift.wallet.enums.CurrencyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TransferRequest {
    @NotNull(message = "From currency is required")
    private CurrencyType fromCurrency;

    @NotNull(message = "To currency is required")
    private CurrencyType toCurrency;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String description;

    // Constructors
    public TransferRequest() {}

    public TransferRequest(CurrencyType fromCurrency, CurrencyType toCurrency, BigDecimal amount, String description) {
        this.fromCurrency = fromCurrency;
        this.toCurrency = toCurrency;
        this.amount = amount;
        this.description = description;
    }

    // Getters and Setters
    public CurrencyType getFromCurrency() {
        return fromCurrency;
    }

    public void setFromCurrency(CurrencyType fromCurrency) {
        this.fromCurrency = fromCurrency;
    }

    public CurrencyType getToCurrency() {
        return toCurrency;
    }

    public void setToCurrency(CurrencyType toCurrency) {
        this.toCurrency = toCurrency;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
} 