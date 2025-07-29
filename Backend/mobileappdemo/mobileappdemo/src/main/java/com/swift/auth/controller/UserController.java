package com.swift.auth.controller;

import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import com.swift.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletService walletService;

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
            profile.put("firstName", user.getFirstName());
            profile.put("lastName", user.getLastName());
            profile.put("fullName", user.getFirstName() + " " + user.getLastName());
            profile.put("phoneNumber", user.getEmailOrPhone());
            profile.put("email", user.getEmail());
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
                    "ipAddress", "192.168.1.100",
                    "icon", "log-in-outline",
                    "label", "Login",
                    "time", "10:30 AM"
                ),
                Map.of(
                    "id", 2,
                    "action", "Deposit",
                    "description", "Deposited ₵500.00 via Mobile Money",
                    "timestamp", "2024-01-15T09:15:00",
                    "ipAddress", "192.168.1.100",
                    "icon", "cash-outline",
                    "label", "Deposit",
                    "time", "9:15 AM"
                ),
                Map.of(
                    "id", 3,
                    "action", "Transfer",
                    "description", "Transferred ₵200.00 to John Doe",
                    "timestamp", "2024-01-14T16:45:00",
                    "ipAddress", "192.168.1.100",
                    "icon", "swap-horizontal-outline",
                    "label", "Transfer",
                    "time", "4:45 PM"
                ),
                Map.of(
                    "id", 4,
                    "action", "Withdrawal",
                    "description", "Withdrew ₵150.00 to Bank Account",
                    "timestamp", "2024-01-14T14:20:00",
                    "ipAddress", "192.168.1.100",
                    "icon", "arrow-down-outline",
                    "label", "Withdrawal",
                    "time", "2:20 PM"
                ),
                Map.of(
                    "id", 5,
                    "action", "Settings",
                    "description", "Updated security settings",
                    "timestamp", "2024-01-14T11:10:00",
                    "ipAddress", "192.168.1.100",
                    "icon", "settings-outline",
                    "label", "Settings",
                    "time", "11:10 AM"
                )
            });

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch activity logs: " + e.getMessage());
        }
    }

    @PostMapping("/create-wallets")
    public ResponseEntity<?> createWalletsForUser(@RequestParam Long userId) {
        try {
            System.out.println("=== CREATE WALLETS REQUEST ===");
            System.out.println("User ID: " + userId);
            
            Optional<User> userOpt = userRepository.findById(userId);
            System.out.println("User found: " + userOpt.isPresent());
            
            if (userOpt.isEmpty()) {
                // Try to find any existing user instead of creating a new one
                System.out.println("User not found, looking for any existing user...");
                List<User> existingUsers = userRepository.findAll();
                if (!existingUsers.isEmpty()) {
                    User existingUser = existingUsers.get(0);
                    System.out.println("Using existing user: " + existingUser.getUsername() + " (ID: " + existingUser.getId() + ")");
                    userOpt = Optional.of(existingUser);
                } else {
                    System.out.println("No users found in database");
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "No users found in database. Please create a user first.");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            User user = userOpt.get();
            System.out.println("Using user: " + user.getUsername());
            
            walletService.createUserWallets(user);
            
            System.out.println("Wallets created successfully for user: " + user.getUsername());
            System.out.println("=== CREATE WALLETS REQUEST END ===");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Wallets created successfully for user: " + user.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Failed to create wallets: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create wallets: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/allocate-funds")
    public ResponseEntity<?> allocateFundsToWallets(@RequestParam Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();
            
            // Allocate funds to each wallet
            Map<String, Object> results = new HashMap<>();
            
            // GHS Wallet - 1000 GHS
            try {
                walletService.allocateFundsToWallet(user.getId(), com.swift.wallet.enums.CurrencyType.GHS, new java.math.BigDecimal("1000"));
                results.put("GHS", "1000 GHS allocated successfully");
            } catch (Exception e) {
                results.put("GHS", "Failed to allocate GHS: " + e.getMessage());
            }
            
            // USD Wallet - 50 USD
            try {
                walletService.allocateFundsToWallet(user.getId(), com.swift.wallet.enums.CurrencyType.USD, new java.math.BigDecimal("50"));
                results.put("USD", "50 USD allocated successfully");
            } catch (Exception e) {
                results.put("USD", "Failed to allocate USD: " + e.getMessage());
            }
            
            // GBP Wallet - 30 GBP
            try {
                walletService.allocateFundsToWallet(user.getId(), com.swift.wallet.enums.CurrencyType.GBP, new java.math.BigDecimal("30"));
                results.put("GBP", "30 GBP allocated successfully");
            } catch (Exception e) {
                results.put("GBP", "Failed to allocate GBP: " + e.getMessage());
            }
            
            // EUR Wallet - 100 EUR
            try {
                walletService.allocateFundsToWallet(user.getId(), com.swift.wallet.enums.CurrencyType.EUR, new java.math.BigDecimal("100"));
                results.put("EUR", "100 EUR allocated successfully");
            } catch (Exception e) {
                results.put("EUR", "Failed to allocate EUR: " + e.getMessage());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Fund allocation completed");
            response.put("results", results);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to allocate funds: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllUsers() {
        userRepository.deleteAll();
        return ResponseEntity.ok("All users deleted successfully");
    }
} 