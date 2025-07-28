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
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    public ResponseEntity<?> signup(SignupRequest request) {
        logger.info("Processing signup for: {}", request.getEmailOrPhone());
        // Validate password length (8 characters or more)
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            logger.warn("Password too short for signup: {}", request.getEmailOrPhone());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Password must be at least 8 characters"));
        }

        // Validate password confirmation
        if (request.getConfirmPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
            logger.warn("Password mismatch for signup: {}", request.getEmailOrPhone());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Passwords do not match"));
        }

        // Check if email/phone already exists
        if (userRepository.findByEmailOrPhone(request.getEmailOrPhone()).isPresent()) {
            logger.warn("Email/Phone already registered: {}", request.getEmailOrPhone());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email/Phone already registered"));
        }

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            logger.warn("Username already taken: {}", request.getUsername());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username already taken"));
        }

        // Create new user
        User user = new User();
        user.setEmailOrPhone(request.getEmailOrPhone());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // In production, this should be hashed
        // Set email field if input is an email
        if (request.getEmailOrPhone() != null && request.getEmailOrPhone().contains("@")) {
            user.setEmail(request.getEmailOrPhone());
        } else {
            // If not an email, do not proceed with signup (or you can handle phone signup differently)
            logger.warn("Signup attempted with non-email identifier: {}", request.getEmailOrPhone());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Signup requires a valid email address."));
        }
        userRepository.save(user);
        logger.info("User created: {}", user.getUsername());

        // Send welcome email
        try {
            logger.info("Attempting to send welcome email to: {}", user.getEmail());
            SimpleMailMessage welcomeMessage = new SimpleMailMessage();
            welcomeMessage.setTo(user.getEmail());
            welcomeMessage.setSubject("Welcome to Swift - Registration Successful!");
            welcomeMessage.setText(String.format(
                "Dear %s,\n\n" +
                "Welcome to Swift! Your account has been successfully created.\n\n" +
                "Account Details:\n" +
                "• Username: %s\n" +
                "• Email: %s\n" +
                "• Registration Date: %s\n\n" +
                "You can now log in to your account and start using our services.\n\n" +
                "Best regards,\n" +
                "The Swift Team",
                user.getUsername(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt().toString()
            ));
            logger.info("Sending welcome email...");
            mailSender.send(welcomeMessage);
            logger.info("Welcome email sent successfully!");
        } catch (Exception e) {
            logger.error("Failed to send welcome email: {}", e.getMessage());
            e.printStackTrace();
        }

        // Generate and send OTP to email
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
        OtpEntry entry = new OtpEntry();
        entry.setEmail(user.getEmail());
        entry.setOtp(otp);
        entry.setExpiresAt(expiresAt);
        otpRepository.save(entry);
        logger.info("OTP generated and saved for user: {}", user.getUsername());
        try {
            SimpleMailMessage otpMessage = new SimpleMailMessage();
            otpMessage.setTo(user.getEmail());
            otpMessage.setSubject("Your Registration OTP Code");
            otpMessage.setText("Your OTP is: " + otp + "\nIt expires in 10 minutes.");
            mailSender.send(otpMessage);
            logger.info("OTP sent to email: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send OTP email: {}", e.getMessage());
        }

        String successMessage = String.format(
            "Registration successful!\nUsername: %s\nEmail: %s\nAccount created: %s\n\nA welcome email and OTP have been sent to your email address.",
            user.getUsername(),
            user.getEmail(),
            user.getCreatedAt().toString()
        );
        return ResponseEntity.ok(Map.of("success", true, "message", successMessage));
    }

    public ResponseEntity<?> login(LoginRequest request) {
        logger.info("Processing login for: {}", request.getEmailOrPhone());
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            logger.warn("Login attempt with null or empty password for: {}", request.getEmailOrPhone());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Password is required"));
        }
        // Find user by email/phone
        Optional<User> userOpt = userRepository.findByEmailOrPhone(request.getEmailOrPhone());
        if (userOpt.isEmpty()) {
            logger.warn("User not found: {}", request.getEmailOrPhone());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        User user = userOpt.get();
        
        // Check password
        if (!user.getPassword().equals(request.getPassword())) { // In production, use proper password hashing
            logger.warn("Invalid credentials for user: {}", request.getEmailOrPhone());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid credentials"));
        }

        // Send login notification email
        try {
            SimpleMailMessage loginMessage = new SimpleMailMessage();
            loginMessage.setTo(user.getEmail());
            loginMessage.setSubject("Swift Account Login Notification");
            loginMessage.setText(String.format(
                "Dear %s,\n\n" +
                "Your Swift account was just signed into. If this was you, you can safely ignore this email.\n" +
                "If you did not sign in, please reset your password immediately.\n\n" +
                "Login Details:\n" +
                "• Username: %s\n" +
                "• Email: %s\n" +
                "• Login Time: %s\n\n" +
                "Best regards,\n" +
                "The Swift Team",
                user.getUsername(),
                user.getUsername(),
                user.getEmailOrPhone(),
                java.time.LocalDateTime.now().toString()
            ));
            mailSender.send(loginMessage);
            logger.info("Login notification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send login notification email: {}", e.getMessage());
        }

        // Generate and send OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
        
        OtpEntry entry = new OtpEntry();
        entry.setEmail(user.getEmailOrPhone()); // Use email/phone as email for OTP
        entry.setOtp(otp);
        entry.setExpiresAt(expiresAt);
        otpRepository.save(entry);
        logger.info("OTP generated and saved for user: {}", user.getUsername());

        // Send OTP via email (assuming emailOrPhone is an email for now)
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your Login OTP Code");
        message.setText("Your OTP is: " + otp + "\nIt expires in 10 minutes.");
        mailSender.send(message);
        logger.info("OTP sent to email: {}", user.getEmail());

        return ResponseEntity.ok(Map.of("success", true, "message", "OTP sent successfully to your email"));
    }

    public ResponseEntity<?> verifyOtp(OtpRequest request) {
        Optional<OtpEntry> entryOpt = otpRepository.findTopByEmailOrderByExpiresAtDesc(request.getEmail());
        if (entryOpt.isEmpty()) {
            logger.warn("No OTP found for email: {}", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "No OTP found"));
        }

        OtpEntry entry = entryOpt.get();
        if (!entry.getOtp().equals(request.getOtp())) {
            logger.warn("Invalid OTP for email: {}", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid OTP"));
        }
        if (entry.getExpiresAt().isBefore(LocalDateTime.now())) {
            logger.warn("OTP expired for email: {}", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "OTP expired"));
        }

        // Find user by email/phone
        Optional<User> userOpt = userRepository.findByEmailOrPhone(request.getEmail());
        if (userOpt.isEmpty()) {
            logger.warn("User not found for OTP verification: {}", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        User user = userOpt.get();
        logger.info("OTP verified successfully for user: {}", user.getUsername());
        return ResponseEntity.ok(Map.of("success", true, "message", "Login successful! Welcome " + user.getUsername()));
    }

    public ResponseEntity<?> sendOtp(String phoneNumber, String purpose) {
        try {
            logger.info("Attempting to send OTP for phone number: {}", phoneNumber);
            // Find user by phone number
            Optional<User> userOpt = userRepository.findByEmailOrPhone(phoneNumber);
            if (userOpt.isEmpty()) {
                logger.warn("User not found for OTP: {}", phoneNumber);
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
            }

            User user = userOpt.get();
            logger.info("User found for OTP: {}", user.getUsername());

            // Generate and send OTP
            String otp = String.format("%06d", new Random().nextInt(999999));
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
            
            OtpEntry entry = new OtpEntry();
            entry.setEmail(user.getEmailOrPhone());
            entry.setOtp(otp);
            entry.setExpiresAt(expiresAt);
            otpRepository.save(entry);
            logger.info("OTP generated and saved for user: {}", user.getUsername());

            // Send OTP via email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Your OTP Code");
            message.setText("Your OTP is: " + otp + "\nIt expires in 10 minutes.");
            mailSender.send(message);
            logger.info("OTP sent to email: {}", user.getEmail());

            return ResponseEntity.ok(Map.of("success", true, "message", "OTP sent successfully to your email"));
        } catch (Exception e) {
            logger.error("Failed to send OTP: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to send OTP: " + e.getMessage()));
        }
    }

    public ResponseEntity<?> resendOtp(String phoneNumber, String purpose) {
        try {
            logger.info("Attempting to resend OTP for phone number: {}", phoneNumber);
            // Find user by phone number
            Optional<User> userOpt = userRepository.findByEmailOrPhone(phoneNumber);
            if (userOpt.isEmpty()) {
                logger.warn("User not found for resend OTP: {}", phoneNumber);
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
            }

            User user = userOpt.get();
            logger.info("User found for resend OTP: {}", user.getUsername());

            // Generate and send new OTP
            String otp = String.format("%06d", new Random().nextInt(999999));
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
            
            OtpEntry entry = new OtpEntry();
            entry.setEmail(user.getEmailOrPhone());
            entry.setOtp(otp);
            entry.setExpiresAt(expiresAt);
            otpRepository.save(entry);
            logger.info("New OTP generated and saved for user: {}", user.getUsername());

            // Send OTP via email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Your New OTP Code");
            message.setText("Your new OTP is: " + otp + "\nIt expires in 10 minutes.");
            mailSender.send(message);
            logger.info("New OTP sent to email: {}", user.getEmail());

            return ResponseEntity.ok(Map.of("success", true, "message", "New OTP sent successfully to your email"));
        } catch (Exception e) {
            logger.error("Failed to resend OTP: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to resend OTP: " + e.getMessage()));
        }
    }
}