package com.swift.notification.service;

import com.swift.auth.models.User;
import com.swift.notification.dto.NotificationDto;
import com.swift.notification.enums.NotificationType;
import com.swift.notification.models.Notification;
import com.swift.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User user, NotificationType type, String title, String message, Long referenceId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReferenceId(referenceId);
        return notificationRepository.save(notification);
    }

    public Notification createNotification(User user, NotificationType type, String title, String message) {
        return createNotification(user, type, title, message, null);
    }

    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationDto::new)
                .toList();
    }

    public Optional<Notification> markAsRead(Long notificationId, Long userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isEmpty() || !notificationOpt.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }
        Notification notification = notificationOpt.get();
        notification.setRead(true);
        return Optional.of(notificationRepository.save(notification));
    }

    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public boolean deleteNotification(Long notificationId, Long userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isEmpty() || !notificationOpt.get().getUser().getId().equals(userId)) {
            return false;
        }
        notificationRepository.delete(notificationOpt.get());
        return true;
    }
}
