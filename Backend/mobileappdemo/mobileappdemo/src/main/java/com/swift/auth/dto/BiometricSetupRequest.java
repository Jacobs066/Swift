package com.swift.auth.dto;

import com.swift.auth.enums.BiometricType;

public class BiometricSetupRequest {
    private String emailOrPhone;
    private String password; // Required for initial setup
    private BiometricType biometricType;
    private String biometricData; // Base64 encoded biometric data
    private String deviceId; // Unique device identifier
    private String deviceName; // User-friendly device name

    // Constructors
    public BiometricSetupRequest() {}

    public BiometricSetupRequest(String emailOrPhone, String password, BiometricType biometricType, 
                                String biometricData, String deviceId, String deviceName) {
        this.emailOrPhone = emailOrPhone;
        this.password = password;
        this.biometricType = biometricType;
        this.biometricData = biometricData;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
    }

    // Getters and Setters
    public String getEmailOrPhone() {
        return emailOrPhone;
    }

    public void setEmailOrPhone(String emailOrPhone) {
        this.emailOrPhone = emailOrPhone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }
} 