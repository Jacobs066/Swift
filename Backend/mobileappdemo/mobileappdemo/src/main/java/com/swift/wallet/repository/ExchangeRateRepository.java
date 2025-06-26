package com.swift.wallet.repository;

import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.models.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    
    Optional<ExchangeRate> findByFromCurrencyAndToCurrency(CurrencyType fromCurrency, CurrencyType toCurrency);
    
    @Query("SELECT er FROM ExchangeRate er WHERE er.fromCurrency = :fromCurrency AND er.toCurrency = :toCurrency AND er.expiresAt > :now")
    Optional<ExchangeRate> findValidExchangeRate(@Param("fromCurrency") CurrencyType fromCurrency, 
                                                @Param("toCurrency") CurrencyType toCurrency, 
                                                @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM ExchangeRate er WHERE er.expiresAt < :now")
    void deleteByExpiresAtBefore(@Param("now") LocalDateTime now);
    
    @Query("SELECT er FROM ExchangeRate er WHERE er.expiresAt < :now")
    java.util.List<ExchangeRate> findExpiredRates(@Param("now") LocalDateTime now);
} 