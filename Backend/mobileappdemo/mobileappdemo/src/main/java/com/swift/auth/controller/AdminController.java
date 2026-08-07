package com.swift.auth.controller;

import com.swift.auth.dto.UserResponse;
import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        // Stopgap: requires authentication (enforced by WebSecurityConfig) and never
        // exposes the User entity directly, since it carries the (hashed) password.
        // A real role-based check should replace this once the app has an admin role.
        List<UserResponse> users = userRepository.findAll().stream()
                .map(this::toUserResponse)
                .toList();
        return ResponseEntity.ok(users);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
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
    }
} 