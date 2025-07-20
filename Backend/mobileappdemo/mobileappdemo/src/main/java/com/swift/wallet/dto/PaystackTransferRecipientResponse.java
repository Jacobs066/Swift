package com.swift.wallet.dto;

public class PaystackTransferRecipientResponse {
    private boolean status;
    private String message;
    private Data data;

    public static class Data {
        private String recipient_code;
        public String getRecipient_code() { return recipient_code; }
        public void setRecipient_code(String recipient_code) { this.recipient_code = recipient_code; }
    }

    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }
} 