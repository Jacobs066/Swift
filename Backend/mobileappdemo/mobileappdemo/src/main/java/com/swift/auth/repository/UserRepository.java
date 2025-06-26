package com.swift.auth.repository;

import com.swift.auth.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailOrPhone(String emailOrPhone);
    Optional<User> findByUsername(String username);
}