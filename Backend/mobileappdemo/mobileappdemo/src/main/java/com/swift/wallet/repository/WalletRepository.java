package com.swift.wallet.repository;

import com.swift.auth.models.User;
import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.models.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    
    List<Wallet> findByUser(User user);
    
    List<Wallet> findByUserId(Long userId);
    
    Optional<Wallet> findByUserAndCurrency(User user, CurrencyType currency);
    
    Optional<Wallet> findByUserIdAndCurrency(Long userId, CurrencyType currency);
    
    Optional<Wallet> findByUserAndIsPrimaryTrue(User user);
    
    Optional<Wallet> findByUserIdAndIsPrimaryTrue(Long userId);
    
    @Query("SELECT w FROM Wallet w WHERE w.user.id = :userId AND w.currency = :currency")
    Optional<Wallet> findUserWalletByCurrency(@Param("userId") Long userId, @Param("currency") CurrencyType currency);
    
    @Query("SELECT w FROM Wallet w WHERE w.user.id = :userId ORDER BY w.isPrimary DESC, w.currency")
    List<Wallet> findUserWalletsOrdered(@Param("userId") Long userId);
    
    boolean existsByUserAndCurrency(User user, CurrencyType currency);
    
    boolean existsByUserIdAndCurrency(Long userId, CurrencyType currency);
} 