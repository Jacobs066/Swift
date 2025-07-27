package com.swift.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class NotificationController {

    @GetMapping
    public ResponseEntity<?> getNotifications(@RequestHeader("Authorization") String token) {
        try {
            // For demo purposes, return mock notifications
            // In production, you would have a Notification entity and repository
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("notifications", new Object[]{
                Map.of(
                    "id", 1,
                    "title", "Deposit Successful",
                    "message", "Your deposit of ₵500.00 has been processed successfully",
                    "type", "deposit",
                    "timestamp", LocalDateTime.now().minusMinutes(5).toString(),
                    "read", false,
                    "transactionId", 101
                ),
                Map.of(
                    "id", 2,
                    "title", "Transfer Completed",
                    "message", "Transfer of ₵200.00 to John Doe has been completed",
                    "type", "transfer",
                    "timestamp", LocalDateTime.now().minusHours(2).toString(),
                    "read", false,
                    "transactionId", 102
                ),
                Map.of(
                    "id", 3,
                    "title", "Welcome to Swift",
                    "message", "Welcome to Swift! Your account has been created successfully",
                    "type", "welcome",
                    "timestamp", LocalDateTime.now().minusDays(1).toString(),
                    "read", true
                ),
                Map.of(
                    "id", 4,
                    "title", "Security Alert",
                    "message", "New login detected from a new device",
                    "type", "security",
                    "timestamp", LocalDateTime.now().minusDays(2).toString(),
                    "read", true
                )
            });

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch notifications: " + e.getMessage());
        }
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<?> markNotificationAsRead(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String token) {
        try {
            // In production, you would update the notification status in database
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification marked as read");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mark notification as read: " + e.getMessage());
        }
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<?> markAllNotificationsAsRead(@RequestHeader("Authorization") String token) {
        try {
            // In production, you would update all notifications status in database
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All notifications marked as read");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mark all notifications as read: " + e.getMessage());
        }
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String token) {
        try {
            // In production, you would delete the notification from database
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete notification: " + e.getMessage());
        }
    }
} 