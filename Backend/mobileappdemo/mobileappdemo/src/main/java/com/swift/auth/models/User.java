package com.swift.auth.models;

import com.swift.auth.enums.AuthProvider;
import com.swift.wallet.models.Wallet;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String emailOrPhone;

    @Column(unique = true)
    private String username;

    private String password;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Wallet> wallets = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BiometricData> biometricData = new ArrayList<>();

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    private String firstName;
    private String lastName;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmailOrPhone() { return emailOrPhone; }
    public void setEmailOrPhone(String emailOrPhone) { this.emailOrPhone = emailOrPhone; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Wallet> getWallets() { return wallets; }
    public void setWallets(List<Wallet> wallets) { this.wallets = wallets; }

    public List<BiometricData> getBiometricData() { return biometricData; }
    public void setBiometricData(List<BiometricData> biometricData) { this.biometricData = biometricData; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}