package com.swift.auth.controller;

import com.swift.auth.dto.BiometricLoginRequest;
import com.swift.auth.dto.BiometricSetupRequest;
import com.swift.auth.service.BiometricService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/biometric")
public class BiometricController {

    @Autowired
    private BiometricService biometricService;

    /**
     * Setup biometric authentication
     */
    @PostMapping("/setup")
    public ResponseEntity<?> setupBiometric(@RequestBody BiometricSetupRequest request) {
        return biometricService.setupBiometric(request);
    }

    /**
     * Login using biometric authentication
     */
    @PostMapping("/login")
    public ResponseEntity<?> biometricLogin(@RequestBody BiometricLoginRequest request) {
        return biometricService.biometricLogin(request);
    }

    /**
     * Get user's biometric devices
     */
    @GetMapping("/devices")
    public ResponseEntity<?> getUserBiometricDevices(@RequestParam String emailOrPhone) {
        return biometricService.getUserBiometricDevices(emailOrPhone);
    }

    /**
     * Remove biometric device
     */
    @DeleteMapping("/devices/{biometricId}")
    public ResponseEntity<?> removeBiometricDevice(
            @PathVariable Long biometricId,
            @RequestParam String emailOrPhone) {
        return biometricService.removeBiometricDevice(biometricId, emailOrPhone);
    }

    /**
     * Check biometric status
     */
    @GetMapping("/status")
    public ResponseEntity<?> checkBiometricStatus(@RequestParam String emailOrPhone) {
        return biometricService.checkBiometricStatus(emailOrPhone);
    }
} 