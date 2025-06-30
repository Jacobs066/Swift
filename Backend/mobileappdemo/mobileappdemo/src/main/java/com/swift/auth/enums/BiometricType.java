package com.swift.auth.enums;

public enum BiometricType {
    FACE_ID("Face ID", "Face recognition biometric"),
    FINGERPRINT("Fingerprint", "Fingerprint biometric");

    private final String displayName;
    private final String description;

    BiometricType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
} 