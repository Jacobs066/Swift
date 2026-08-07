package com.swift.notification.controller;

import com.swift.notification.dto.NotificationDto;
import com.swift.notification.models.Notification;
import com.swift.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(@AuthenticationPrincipal Long userId) {
        List<NotificationDto> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(Map.of("success", true, "notifications", notifications));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        return notificationService.markAsRead(id, userId)
                .map(n -> ResponseEntity.ok(Map.of("success", true, "notification", new NotificationDto(n))))
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success", false, "message", "Notification not found")));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@AuthenticationPrincipal Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        boolean deleted = notificationService.deleteNotification(id, userId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success", false, "message", "Notification not found"));
        }
        return ResponseEntity.ok(Map.of("success", true));
    }
}
