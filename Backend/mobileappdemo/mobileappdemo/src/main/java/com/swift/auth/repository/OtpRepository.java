package com.swift.auth.repository;

import com.swift.auth.models.OtpEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpEntry, Long> {
    Optional<OtpEntry> findTopByEmailOrderByExpiresAtDesc(String email);
}