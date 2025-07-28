package com.swift.auth.controller;

import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from token (simplified for demo)
            // In production, you would decode the JWT token to get user ID
            Long userId = 1L; // Default user ID for demo
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("username", user.getUsername());
            profile.put("emailOrPhone", user.getEmailOrPhone());
            profile.put("firstName", user.getUsername().split(" ")[0]); // Extract first name
            profile.put("fullName", user.getUsername());
            profile.put("phoneNumber", user.getEmailOrPhone());
            profile.put("email", user.getEmailOrPhone());
            profile.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch user profile: " + e.getMessage());
        }
    }

    @GetMapping("/activity-logs")
    public ResponseEntity<?> getActivityLogs(@RequestHeader("Authorization") String token) {
        try {
            // For demo purposes, return mock activity logs
            // In production, you would have an ActivityLog entity and repository
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("logs", new Object[]{
                Map.of(
                    "id", 1,
                    "action", "Login",
                    "description", "User logged in successfully",
                    "timestamp", "2024-01-15T10:30:00",
                    "ipAddress", "192.168.1.100"
                ),
                Map.of(
                    "id", 2,
                    "action", "Deposit",
                    "description", "Deposited ₵500.00 via Mobile Money",
                    "timestamp", "2024-01-15T09:15:00",
                    "ipAddress", "192.168.1.100"
                ),
                Map.of(
                    "id", 3,
                    "action", "Transfer",
                    "description", "Transferred ₵200.00 to John Doe",
                    "timestamp", "2024-01-14T16:45:00",
                    "ipAddress", "192.168.1.100"
                )
            });

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch activity logs: " + e.getMessage());
        }
    }

    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllUsers() {
        userRepository.deleteAll();
        return ResponseEntity.ok("All users deleted successfully");
    }
} 