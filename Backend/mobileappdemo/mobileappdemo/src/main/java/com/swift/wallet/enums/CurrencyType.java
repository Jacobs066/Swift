package com.swift.wallet.enums;

public enum CurrencyType {
    GHS("Ghana Cedi", "₵"),
    USD("US Dollar", "$"),
    GBP("British Pound", "£"),
    EUR("Euro", "€");

    private final String displayName;
    private final String symbol;

    CurrencyType(String displayName, String symbol) {
        this.displayName = displayName;
        this.symbol = symbol;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getSymbol() {
        return symbol;
    }
} 