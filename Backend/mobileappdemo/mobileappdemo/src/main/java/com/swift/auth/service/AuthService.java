package com.swift.auth.service;

import com.swift.auth.dto.LoginRequest;
import com.swift.auth.dto.OtpRequest;
import com.swift.auth.dto.SignupRequest;
import com.swift.auth.models.OtpEntry;
import com.swift.auth.models.User;
import com.swift.auth.repository.OtpRepository;
import com.swift.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    public ResponseEntity<?> signup(SignupRequest request) {
        // Validate password length (8 characters or more)
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters");
        }

        // Validate password confirmation
        if (request.getConfirmPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        // Check if email/phone already exists
        if (userRepository.findByEmailOrPhone(request.getEmailOrPhone()).isPresent()) {
            return ResponseEntity.badRequest().body("Email/Phone already registered");
        }

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken");
        }

        // Create new user
        User user = new User();
        user.setEmailOrPhone(request.getEmailOrPhone());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // In production, this should be hashed
        userRepository.save(user);

        String successMessage = String.format(
            "Registration successful!\nUsername: %s\nEmail/Phone: %s\nAccount created: %s",
            user.getUsername(),
            user.getEmailOrPhone(),
            user.getCreatedAt().toString()
        );

        return ResponseEntity.ok(successMessage);
    }

    public ResponseEntity<?> login(LoginRequest request) {
        // Find user by email/phone
        Optional<User> userOpt = userRepository.findByEmailOrPhone(request.getEmailOrPhone());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        
        // Check password
        if (!user.getPassword().equals(request.getPassword())) { // In production, use proper password hashing
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        // Generate and send OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
        
        OtpEntry entry = new OtpEntry();
        entry.setEmail(user.getEmailOrPhone()); // Use email/phone as email for OTP
        entry.setOtp(otp);
        entry.setExpiresAt(expiresAt);
        otpRepository.save(entry);

        // Send OTP via email (assuming emailOrPhone is an email for now)
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmailOrPhone());
        message.setSubject("Your Login OTP Code");
        message.setText("Your OTP is: " + otp + "\nIt expires in 10 minutes.");
        mailSender.send(message);

        return ResponseEntity.ok("OTP sent successfully to your email");
    }

    public ResponseEntity<?> verifyOtp(OtpRequest request) {
        Optional<OtpEntry> entryOpt = otpRepository.findTopByEmailOrderByExpiresAtDesc(request.getEmail());
        if (entryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No OTP found");
        }

        OtpEntry entry = entryOpt.get();
        if (!entry.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
        if (entry.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP expired");
        }

        // Find user by email/phone
        Optional<User> userOpt = userRepository.findByEmailOrPhone(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        return ResponseEntity.ok("Login successful! Welcome " + user.getUsername());
    }
}