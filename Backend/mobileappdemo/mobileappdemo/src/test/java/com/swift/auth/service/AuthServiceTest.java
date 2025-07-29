package com.swift.auth.service;

import com.swift.auth.dto.SignupRequest;
import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSuccessfulSignup() {
        // Create a signup request
        SignupRequest request = new SignupRequest();
        request.setEmailOrPhone("test@example.com");
        request.setUsername("testuser");
        request.setPassword("TestPass123");
        request.setConfirmPassword("TestPass123");
        request.setFirstName("Test");
        request.setLastName("User");

        // Perform signup
        ResponseEntity<?> response = authService.signup(request);

        // Verify response
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());

        // Verify user was created in database
        assertTrue(userRepository.findByEmailOrPhone("test@example.com").isPresent());
        assertTrue(userRepository.findByUsername("testuser").isPresent());

        User createdUser = userRepository.findByEmailOrPhone("test@example.com").get();
        assertEquals("test@example.com", createdUser.getEmail());
        assertEquals("testuser", createdUser.getUsername());
        assertEquals("Test", createdUser.getFirstName());
        assertEquals("User", createdUser.getLastName());
        assertEquals("TestPass123", createdUser.getPassword()); // Plain text password
    }

    @Test
    public void testDuplicateEmailSignup() {
        // Create first user
        SignupRequest request1 = new SignupRequest();
        request1.setEmailOrPhone("duplicate@example.com");
        request1.setUsername("user1");
        request1.setPassword("TestPass123");
        request1.setConfirmPassword("TestPass123");
        request1.setFirstName("User");
        request1.setLastName("One");

        ResponseEntity<?> response1 = authService.signup(request1);
        assertEquals(200, response1.getStatusCodeValue());

        // Try to create second user with same email
        SignupRequest request2 = new SignupRequest();
        request2.setEmailOrPhone("duplicate@example.com");
        request2.setUsername("user2");
        request2.setPassword("TestPass123");
        request2.setConfirmPassword("TestPass123");
        request2.setFirstName("User");
        request2.setLastName("Two");

        ResponseEntity<?> response2 = authService.signup(request2);
        assertEquals(400, response2.getStatusCodeValue());
    }

    @Test
    public void testDuplicateUsernameSignup() {
        // Create first user
        SignupRequest request1 = new SignupRequest();
        request1.setEmailOrPhone("user1@example.com");
        request1.setUsername("duplicateuser");
        request1.setPassword("TestPass123");
        request1.setConfirmPassword("TestPass123");
        request1.setFirstName("User");
        request1.setLastName("One");

        ResponseEntity<?> response1 = authService.signup(request1);
        assertEquals(200, response1.getStatusCodeValue());

        // Try to create second user with same username
        SignupRequest request2 = new SignupRequest();
        request2.setEmailOrPhone("user2@example.com");
        request2.setUsername("duplicateuser");
        request2.setPassword("TestPass123");
        request2.setConfirmPassword("TestPass123");
        request2.setFirstName("User");
        request2.setLastName("Two");

        ResponseEntity<?> response2 = authService.signup(request2);
        assertEquals(400, response2.getStatusCodeValue());
    }

    @Test
    public void testWeakPasswordSignup() {
        SignupRequest request = new SignupRequest();
        request.setEmailOrPhone("test@example.com");
        request.setUsername("testuser");
        request.setPassword("weak"); // Too short
        request.setConfirmPassword("weak");
        request.setFirstName("Test");
        request.setLastName("User");

        ResponseEntity<?> response = authService.signup(request);
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    public void testPasswordMismatchSignup() {
        SignupRequest request = new SignupRequest();
        request.setEmailOrPhone("test@example.com");
        request.setUsername("testuser");
        request.setPassword("TestPass123");
        request.setConfirmPassword("DifferentPass123"); // Mismatch
        request.setFirstName("Test");
        request.setLastName("User");

        ResponseEntity<?> response = authService.signup(request);
        assertEquals(400, response.getStatusCodeValue());
    }
} 