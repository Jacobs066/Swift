package com.swift.wallet.dto;

public class PaystackTransferRecipientRequest {
    private String type = "mobile_money";
    private String name;
    private String account_number;
    private String bank_code;
    private String currency;

    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAccount_number() { return account_number; }
    public void setAccount_number(String account_number) { this.account_number = account_number; }
    public String getBank_code() { return bank_code; }
    public void setBank_code(String bank_code) { this.bank_code = bank_code; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
} 