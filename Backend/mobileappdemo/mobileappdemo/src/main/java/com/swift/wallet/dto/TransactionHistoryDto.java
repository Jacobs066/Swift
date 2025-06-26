package com.swift.wallet.dto;

import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.enums.TransactionType;
import com.swift.wallet.models.Transaction;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

public class TransactionHistoryDto {
    private Long id;
    private String transactionType;
    private String displayType; // "Sent", "Received", "Deposit", "Withdrawal"
    private BigDecimal amount;
    private CurrencyType currency;
    private String currencySymbol;
    private String description;
    private String reference;
    private String status;
    private String formattedDate;
    private String formattedTime;
    private String recipientName;
    private String senderName;
    private String walletName;
    private boolean isIncoming; // true if money came in, false if money went out

    public TransactionHistoryDto() {}

    public TransactionHistoryDto(Transaction transaction) {
        this.id = transaction.getId();
        this.transactionType = transaction.getType().name();
        this.amount = transaction.getAmount();
        this.currency = transaction.getCurrency();
        this.description = transaction.getDescription();
        this.reference = transaction.getReference();
        this.status = transaction.getStatus();
        
        // Format date and time
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        this.formattedDate = transaction.getCreatedAt().format(dateFormatter);
        this.formattedTime = transaction.getCreatedAt().format(timeFormatter);
        
        // Set currency symbol
        this.currencySymbol = getCurrencySymbol(transaction.getCurrency());
        
        // Determine display type and incoming/outgoing
        setDisplayTypeAndDirection(transaction);
        
        // Set recipient/sender information based on transaction type
        setRecipientSenderInfo(transaction);
        
        // Set wallet name
        this.walletName = transaction.getWallet().getCurrency().name() + " Wallet";
    }

    private void setDisplayTypeAndDirection(Transaction transaction) {
        switch (transaction.getType()) {
            case DEPOSIT:
                this.displayType = "Deposit";
                this.isIncoming = true;
                break;
            case WITHDRAWAL:
                this.displayType = "Withdrawal";
                this.isIncoming = false;
                break;
            case TRANSFER:
                this.displayType = "Transfer";
                this.isIncoming = false;
                break;
            case CURRENCY_EXCHANGE:
                this.displayType = "Currency Exchange";
                this.isIncoming = false;
                break;
            case PAYMENT:
                this.displayType = "Payment";
                this.isIncoming = false;
                break;
            default:
                this.displayType = transaction.getType().getDisplayName();
                this.isIncoming = false;
        }
    }

    private void setRecipientSenderInfo(Transaction transaction) {
        String description = transaction.getDescription();
        
        if (description != null && !description.isEmpty()) {
            if (description.contains("to") || description.contains("sent to")) {
                String[] parts = description.split("to");
                if (parts.length > 1) {
                    this.recipientName = parts[1].trim();
                    this.displayType = "Sent";
                    this.isIncoming = false;
                }
            } else if (description.contains("from") || description.contains("received from")) {
                String[] parts = description.split("from");
                if (parts.length > 1) {
                    this.senderName = parts[1].trim();
                    this.displayType = "Received";
                    this.isIncoming = true;
                }
            } else if (description.toLowerCase().contains("deposit")) {
                this.displayType = "Deposit";
                this.isIncoming = true;
            } else if (description.toLowerCase().contains("withdrawal")) {
                this.displayType = "Withdrawal";
                this.isIncoming = false;
            }
        }
        
        if (this.recipientName == null && this.senderName == null) {
            if (this.isIncoming) {
                this.senderName = "External";
            } else {
                this.recipientName = "External";
            }
        }
    }

    private String getCurrencySymbol(CurrencyType currency) {
        switch (currency) {
            case GHS: return "₵";
            case USD: return "$";
            case EUR: return "€";
            case GBP: return "£";
            default: return currency.name();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getDisplayType() { return displayType; }
    public void setDisplayType(String displayType) { this.displayType = displayType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public CurrencyType getCurrency() { return currency; }
    public void setCurrency(CurrencyType currency) { this.currency = currency; }

    public String getCurrencySymbol() { return currencySymbol; }
    public void setCurrencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFormattedDate() { return formattedDate; }
    public void setFormattedDate(String formattedDate) { this.formattedDate = formattedDate; }

    public String getFormattedTime() { return formattedTime; }
    public void setFormattedTime(String formattedTime) { this.formattedTime = formattedTime; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getWalletName() { return walletName; }
    public void setWalletName(String walletName) { this.walletName = walletName; }

    public boolean isIncoming() { return isIncoming; }
    public void setIncoming(boolean incoming) { isIncoming = incoming; }
} 