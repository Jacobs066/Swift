package com.swift.auth.dto;

import com.swift.auth.enums.BiometricType;

public class BiometricLoginRequest {
    private String emailOrPhone;
    private BiometricType biometricType;
    private String biometricData; // Base64 encoded biometric data
    private String deviceId; // Unique device identifier

    // Constructors
    public BiometricLoginRequest() {}

    public BiometricLoginRequest(String emailOrPhone, BiometricType biometricType, 
                                String biometricData, String deviceId) {
        this.emailOrPhone = emailOrPhone;
        this.biometricType = biometricType;
        this.biometricData = biometricData;
        this.deviceId = deviceId;
    }

    // Getters and Setters
    public String getEmailOrPhone() {
        return emailOrPhone;
    }

    public void setEmailOrPhone(String emailOrPhone) {
        this.emailOrPhone = emailOrPhone;
    }

    public BiometricType getBiometricType() {
        return biometricType;
    }

    public void setBiometricType(BiometricType biometricType) {
        this.biometricType = biometricType;
    }

    public String getBiometricData() {
        return biometricData;
    }

    public void setBiometricData(String biometricData) {
        this.biometricData = biometricData;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
} 