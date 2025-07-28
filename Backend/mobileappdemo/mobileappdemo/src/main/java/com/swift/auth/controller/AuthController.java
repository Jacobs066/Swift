package com.swift.auth.controller;

import com.swift.auth.dto.LoginRequest;
import com.swift.auth.dto.OtpRequest;
import com.swift.auth.dto.SignupRequest;
import com.swift.auth.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        logger.info("Received signup request: {}", request);
        ResponseEntity<?> response = authService.signup(request);
        logger.info("Signup response: {}", response.getBody());
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        logger.info("Received login request: {}", request);
        ResponseEntity<?> response = authService.login(request);
        logger.info("Login response: {}", response.getBody());
        return response;
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
        return authService.verifyOtp(request);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        return authService.sendOtp(request.get("phoneNumber"), request.get("purpose"));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        return authService.resendOtp(request.get("phoneNumber"), request.get("purpose"));
    }
}
