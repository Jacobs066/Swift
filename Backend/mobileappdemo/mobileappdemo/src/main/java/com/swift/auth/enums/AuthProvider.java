package com.swift.auth.enums;

public enum AuthProvider {
    EMAIL("Email"),
    PHONE("Phone"),
    GOOGLE("Google"),
    FACEBOOK("Facebook");

    private final String displayName;

    AuthProvider(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 