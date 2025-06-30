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
    Optional<User> findByAppleId(String appleId);
    
    @Query("SELECT u FROM User u WHERE u.appleId = :appleId OR u.email = :email")
    Optional<User> findByAppleIdOrEmail(@Param("appleId") String appleId, @Param("email") String email);
}