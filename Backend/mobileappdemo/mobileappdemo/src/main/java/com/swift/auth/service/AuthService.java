package com.swift.auth.service;

import com.swift.auth.dto.LoginRequest;
import com.swift.auth.dto.OtpRequest;
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

    public ResponseEntity<?> sendOtp(LoginRequest request) {
        String email = request.getEmail();
        String otp = String.format("%06d", new Random().nextInt(999999));

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);
        OtpEntry entry = new OtpEntry();
        entry.setEmail(email);
        entry.setOtp(otp);
        entry.setExpiresAt(expiresAt);
        otpRepository.save(entry);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otp + "\nIt expires in 5 minutes.");
        mailSender.send(message);

        return ResponseEntity.ok("OTP sent successfully");
    }

    public ResponseEntity<?> verifyOtp(OtpRequest request) {
        Optional<OtpEntry> entryOpt = otpRepository.findTopByEmailOrderByExpiresAtDesc(request.getEmail());
        if (entryOpt.isEmpty()) return ResponseEntity.badRequest().body("No OTP found");

        OtpEntry entry = entryOpt.get();
        if (!entry.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
        if (entry.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP expired");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(request.getEmail());
                    return userRepository.save(newUser);
                });

        return ResponseEntity.ok("User authenticated: " + user.getEmail());
    }
}