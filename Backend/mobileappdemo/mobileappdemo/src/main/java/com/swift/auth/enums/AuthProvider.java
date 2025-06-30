package com.swift.auth.enums;

public enum AuthProvider {
    EMAIL("Email"),
    PHONE("Phone"),
    APPLE_ID("Apple ID"),
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