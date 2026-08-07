package com.swift.auth.controller;

import com.swift.auth.dto.ChangePasswordRequest;
import com.swift.auth.dto.UserResponse;
import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import com.swift.auth.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal Long userId) {
        logger.info("Getting user profile for user: {}", userId);

        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            User user = userOpt.get();

            UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getEmailOrPhone(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getCreatedAt()
            );

            return ResponseEntity.ok(Map.of(
                "success", true,
                "user", userResponse
            ));

        } catch (Exception e) {
            logger.error("Error getting user profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Failed to fetch user profile"
            ));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request, @AuthenticationPrincipal Long userId) {
        return authService.changePassword(userId, request);
    }

    @GetMapping("/activity-logs")
    public ResponseEntity<?> getActivityLogs(@AuthenticationPrincipal Long userId) {
        try {
            // For demo purposes, return mock activity logs
            // In production, you would have an ActivityLog entity and repository
            return ResponseEntity.ok(Map.of(
                "success", true,
                "logs", new Object[]{
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
                }
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to fetch activity logs: " + e.getMessage()
            ));
        }
    }
} 