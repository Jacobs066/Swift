package com.swift.auth.service;

import com.swift.auth.dto.AppleIdLoginRequest;
import com.swift.auth.enums.AuthProvider;
import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AppleIdService {

    @Autowired
    private UserRepository userRepository;

    @Value("${apple.auth.client-id:}")
    private String appleClientId;

    @Value("${apple.auth.team-id:}")
    private String appleTeamId;

    @Value("${apple.auth.key-id:}")
    private String appleKeyId;

    /**
     * Handle Apple ID login/signup
     */
    public ResponseEntity<?> appleIdLogin(AppleIdLoginRequest request) {
        try {
            // Verify Apple ID token (in a real implementation, you would verify the JWT token)
            if (!verifyAppleIdToken(request.getIdentityToken())) {
                return ResponseEntity.badRequest().body("Invalid Apple ID token");
            }

            // Check if user exists by Apple ID
            Optional<User> existingUser = userRepository.findByAppleId(request.getAppleId());
            
            if (existingUser.isPresent()) {
                // User exists, perform login
                User user = existingUser.get();
                return performAppleIdLogin(user);
            } else {
                // User doesn't exist, create new account
                return performAppleIdSignup(request);
            }

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Apple ID authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Perform Apple ID login for existing user
     */
    private ResponseEntity<?> performAppleIdLogin(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Apple ID login successful! Welcome " + user.getUsername());
        response.put("user", Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "authProvider", user.getAuthProvider().getDisplayName()
        ));
        response.put("loginMethod", "APPLE_ID");
        response.put("requiresOtp", false); // Apple ID login doesn't require OTP

        return ResponseEntity.ok(response);
    }

    /**
     * Perform Apple ID signup for new user
     */
    private ResponseEntity<?> performAppleIdSignup(AppleIdLoginRequest request) {
        // Check if email is already registered with another account
        if (request.getEmail() != null) {
            Optional<User> existingEmailUser = userRepository.findByEmail(request.getEmail());
            if (existingEmailUser.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email is already registered with another account");
                return ResponseEntity.badRequest().body(response);
            }
        }

        // Generate username if not provided
        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = generateUsername(request.getFirstName(), request.getLastName());
        }

        // Check if username is available
        Optional<User> existingUsername = userRepository.findByUsername(username);
        if (existingUsername.isPresent()) {
            username = generateUniqueUsername(username);
        }

        // Create new user
        User newUser = new User();
        newUser.setAppleId(request.getAppleId());
        newUser.setEmail(request.getEmail());
        newUser.setUsername(username);
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setAuthProvider(AuthProvider.APPLE_ID);
        newUser.setEmailOrPhone(request.getEmail() != null ? request.getEmail() : request.getAppleId());
        newUser.setCreatedAt(LocalDateTime.now());

        userRepository.save(newUser);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Apple ID registration successful! Welcome " + username);
        response.put("user", Map.of(
            "id", newUser.getId(),
            "username", newUser.getUsername(),
            "email", newUser.getEmail(),
            "firstName", newUser.getFirstName(),
            "lastName", newUser.getLastName(),
            "authProvider", newUser.getAuthProvider().getDisplayName(),
            "accountCreated", newUser.getCreatedAt()
        ));
        response.put("loginMethod", "APPLE_ID");
        response.put("requiresOtp", false);

        return ResponseEntity.ok(response);
    }

    /**
     * Verify Apple ID token (simplified implementation)
     * In a real implementation, you would verify the JWT token signature and claims
     */
    private boolean verifyAppleIdToken(String identityToken) {
        // This is a simplified verification
        // In a real implementation, you would:
        // 1. Decode the JWT token
        // 2. Verify the signature using Apple's public keys
        // 3. Verify the issuer, audience, and expiration
        // 4. Check that the token was issued by Apple
        
        return identityToken != null && !identityToken.trim().isEmpty();
    }

    /**
     * Generate username from first and last name
     */
    private String generateUsername(String firstName, String lastName) {
        String baseUsername = "";
        if (firstName != null && !firstName.trim().isEmpty()) {
            baseUsername += firstName.toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
        }
        if (lastName != null && !lastName.trim().isEmpty()) {
            baseUsername += lastName.toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
        }
        
        if (baseUsername.isEmpty()) {
            baseUsername = "user" + System.currentTimeMillis() % 10000;
        }
        
        return baseUsername;
    }

    /**
     * Generate unique username by appending numbers
     */
    private String generateUniqueUsername(String baseUsername) {
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }
} 