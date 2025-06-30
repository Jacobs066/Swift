package com.swift.auth.repository;

import com.swift.auth.enums.BiometricType;
import com.swift.auth.models.BiometricData;
import com.swift.auth.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BiometricDataRepository extends JpaRepository<BiometricData, Long> {
    
    // Find active biometric data for a user
    List<BiometricData> findByUserAndIsActiveTrue(User user);
    
    // Find biometric data by user and type
    List<BiometricData> findByUserAndBiometricTypeAndIsActiveTrue(User user, BiometricType biometricType);
    
    // Find biometric data by user, type, and device
    Optional<BiometricData> findByUserAndBiometricTypeAndDeviceIdAndIsActiveTrue(
        User user, BiometricType biometricType, String deviceId);
    
    // Find all biometric data for a user (including inactive)
    List<BiometricData> findByUser(User user);
    
    // Find by device ID
    List<BiometricData> findByDeviceIdAndIsActiveTrue(String deviceId);
    
    // Check if user has any biometric data
    boolean existsByUserAndIsActiveTrue(User user);
    
    // Count active biometric data for a user
    long countByUserAndIsActiveTrue(User user);
    
    // Find biometric data by user ID
    @Query("SELECT b FROM BiometricData b WHERE b.user.id = :userId AND b.isActive = true")
    List<BiometricData> findActiveByUserId(@Param("userId") Long userId);
    
    // Find biometric data by user ID and type
    @Query("SELECT b FROM BiometricData b WHERE b.user.id = :userId AND b.biometricType = :type AND b.isActive = true")
    List<BiometricData> findActiveByUserIdAndType(@Param("userId") Long userId, @Param("type") BiometricType type);
} 