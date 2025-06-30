package com.swift.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class AppleIdLoginRequest {
    
    @NotBlank(message = "Apple ID is required")
    private String appleId;
    
    @NotBlank(message = "Identity token is required")
    private String identityToken;
    
    private String authorizationCode;
    private String email;
    private String firstName;
    private String lastName;
    private String username;

    // Constructors
    public AppleIdLoginRequest() {}

    public AppleIdLoginRequest(String appleId, String identityToken) {
        this.appleId = appleId;
        this.identityToken = identityToken;
    }

    // Getters and setters
    public String getAppleId() {
        return appleId;
    }

    public void setAppleId(String appleId) {
        this.appleId = appleId;
    }

    public String getIdentityToken() {
        return identityToken;
    }

    public void setIdentityToken(String identityToken) {
        this.identityToken = identityToken;
    }

    public String getAuthorizationCode() {
        return authorizationCode;
    }

    public void setAuthorizationCode(String authorizationCode) {
        this.authorizationCode = authorizationCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
} 