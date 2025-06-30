package com.swift.auth.models;

import com.swift.auth.enums.BiometricType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "biometric_data")
public class BiometricData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BiometricType biometricType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String biometricData; // Base64 encoded biometric data

    @Column(nullable = false)
    private String deviceId;

    @Column(nullable = false)
    private String deviceName;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public BiometricData() {}

    public BiometricData(User user, BiometricType biometricType, String biometricData, 
                        String deviceId, String deviceName) {
        this.user = user;
        this.biometricType = biometricType;
        this.biometricData = biometricData;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getLastUsedAt() {
        return lastUsedAt;
    }

    public void setLastUsedAt(LocalDateTime lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }
} 