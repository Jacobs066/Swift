package com.swift.auth.repository;

import com.swift.auth.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email = :emailOrPhone OR u.phone = :emailOrPhone OR u.emailOrPhone = :emailOrPhone")
    Optional<User> findByEmailOrPhone(@Param("emailOrPhone") String emailOrPhone);
    
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.phone = :phone")
    boolean existsByPhone(@Param("phone") String phone);
    
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.username = :username")
    boolean existsByUsername(@Param("username") String username);
    
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.emailOrPhone = :emailOrPhone")
    boolean existsByEmailOrPhone(@Param("emailOrPhone") String emailOrPhone);
}