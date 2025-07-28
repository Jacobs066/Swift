package com.swift.auth.service;

import com.swift.auth.dto.BiometricLoginRequest;
import com.swift.auth.dto.BiometricSetupRequest;
import com.swift.auth.enums.BiometricType;
import com.swift.auth.models.BiometricData;
import com.swift.auth.models.OtpEntry;
import com.swift.auth.models.User;
import com.swift.auth.repository.BiometricDataRepository;
import com.swift.auth.repository.OtpRepository;
import com.swift.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class BiometricService {

    @Autowired
    private BiometricDataRepository biometricDataRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Setup biometric authentication for a user
     */
    public ResponseEntity<?> setupBiometric(BiometricSetupRequest request) {
        try {
            // Find user by email/phone
            Optional<User> userOpt = userRepository.findByEmailOrPhone(request.getEmailOrPhone());
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();

            // Verify password for security
            if (!user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid password");
            }

            // Check if biometric data already exists for this device and type
            Optional<BiometricData> existingBiometric = biometricDataRepository
                .findByUserAndBiometricTypeAndDeviceIdAndIsActiveTrue(
                    user, request.getBiometricType(), request.getDeviceId());

            if (existingBiometric.isPresent()) {
                return ResponseEntity.badRequest().body("Biometric data already exists for this device and type");
            }

            // Create new biometric data
            BiometricData biometricData = new BiometricData(
                user,
                request.getBiometricType(),
                request.getBiometricData(),
                request.getDeviceId(),
                request.getDeviceName()
            );

            biometricDataRepository.save(biometricData);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", request.getBiometricType().getDisplayName() + " setup successful");
            response.put("deviceName", request.getDeviceName());
            response.put("biometricType", request.getBiometricType().getDisplayName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Biometric setup failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Login using biometric authentication
     */
    public ResponseEntity<?> biometricLogin(BiometricLoginRequest request) {
        try {
            // Find user by email/phone
            Optional<User> userOpt = userRepository.findByEmailOrPhone(request.getEmailOrPhone());
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();

            // Find biometric data for this user, type, and device
            Optional<BiometricData> biometricDataOpt = biometricDataRepository
                .findByUserAndBiometricTypeAndDeviceIdAndIsActiveTrue(
                    user, request.getBiometricType(), request.getDeviceId());

            if (biometricDataOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Biometric data not found for this device");
            }

            BiometricData biometricData = biometricDataOpt.get();

            // Verify biometric data (in a real implementation, this would use proper biometric verification)
            if (!verifyBiometricData(request.getBiometricData(), biometricData.getBiometricData())) {
                return ResponseEntity.badRequest().body("Biometric verification failed");
            }

            // Update last used timestamp
            biometricData.setLastUsedAt(LocalDateTime.now());
            biometricDataRepository.save(biometricData);

            // Generate and send OTP for additional security
            String otp = String.format("%06d", new Random().nextInt(999999));
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
            
            OtpEntry entry = new OtpEntry();
            entry.setEmail(user.getEmail());
            entry.setOtp(otp);
            entry.setExpiresAt(expiresAt);
            otpRepository.save(entry);

            // Send OTP via email
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(user.getEmail());
                message.setSubject("Your Biometric Login OTP Code");
                message.setText("Your OTP is: " + otp + "\nIt expires in 10 minutes.");
                mailSender.send(message);
            } catch (Exception e) {
                System.err.println("Failed to send OTP email: " + e.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Biometric authentication successful! OTP sent to your email.");
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "emailOrPhone", user.getEmailOrPhone(),
                "phoneNumber", user.getEmailOrPhone() // For frontend compatibility
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Biometric login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get user's biometric devices
     */
    public ResponseEntity<?> getUserBiometricDevices(String emailOrPhone) {
        try {
            Optional<User> userOpt = userRepository.findByEmailOrPhone(emailOrPhone);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();
            List<BiometricData> biometricDevices = biometricDataRepository.findByUserAndIsActiveTrue(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("devices", biometricDevices.stream().map(device -> Map.of(
                "id", device.getId(),
                "biometricType", device.getBiometricType().getDisplayName(),
                "deviceName", device.getDeviceName(),
                "deviceId", device.getDeviceId(),
                "createdAt", device.getCreatedAt(),
                "lastUsedAt", device.getLastUsedAt()
            )).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get biometric devices: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Remove biometric device
     */
    public ResponseEntity<?> removeBiometricDevice(Long biometricId, String emailOrPhone) {
        try {
            Optional<User> userOpt = userRepository.findByEmailOrPhone(emailOrPhone);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();
            Optional<BiometricData> biometricDataOpt = biometricDataRepository.findById(biometricId);

            if (biometricDataOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Biometric device not found");
            }

            BiometricData biometricData = biometricDataOpt.get();

            // Verify the biometric data belongs to the user
            if (!biometricData.getUser().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body("Unauthorized access to biometric device");
            }

            // Deactivate the biometric data
            biometricData.setActive(false);
            biometricDataRepository.save(biometricData);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Biometric device removed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to remove biometric device: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Check if user has biometric authentication enabled
     */
    public ResponseEntity<?> checkBiometricStatus(String emailOrPhone) {
        try {
            Optional<User> userOpt = userRepository.findByEmailOrPhone(emailOrPhone);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();
            boolean hasBiometric = biometricDataRepository.existsByUserAndIsActiveTrue(user);
            long biometricCount = biometricDataRepository.countByUserAndIsActiveTrue(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hasBiometric", hasBiometric);
            response.put("biometricCount", biometricCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to check biometric status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verify biometric data (simplified implementation)
     * In a real application, this would use proper biometric verification libraries
     */
    private boolean verifyBiometricData(String inputData, String storedData) {
        // This is a simplified verification
        // In a real implementation, you would use proper biometric verification
        // For now, we'll do a simple comparison (not secure for production)
        return inputData != null && inputData.equals(storedData);
    }
} 