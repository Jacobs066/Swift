package com.swift.wallet.repository;

import com.swift.wallet.enums.TransactionType;
import com.swift.wallet.models.Transaction;
import com.swift.wallet.models.Wallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByWalletOrderByCreatedAtDesc(Wallet wallet);
    
    List<Transaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
    
    Page<Transaction> findByWalletId(Long walletId, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.wallet.user.id = :userId ORDER BY t.createdAt DESC")
    List<Transaction> findUserTransactions(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Transaction t WHERE t.wallet.user.id = :userId ORDER BY t.createdAt DESC")
    Page<Transaction> findUserTransactionsPaginated(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.wallet.user.id = :userId AND t.createdAt >= :startDate ORDER BY t.createdAt DESC")
    List<Transaction> findUserTransactionsFromDate(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.wallet.user.id = :userId AND t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:userId IS NULL OR t.wallet.user.id = :userId) AND " +
           "(:walletId IS NULL OR t.wallet.id = :walletId) AND " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:startDate IS NULL OR t.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR t.createdAt <= :endDate) " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findTransactionHistory(@Param("userId") Long userId, 
                                           @Param("walletId") Long walletId, 
                                           @Param("type") String type, 
                                           @Param("status") String status, 
                                           @Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate, 
                                           Pageable pageable);
    
    List<Transaction> findByReference(String reference);
    
    List<Transaction> findByStatus(String status);
    
    List<Transaction> findByType(TransactionType type);
    
    @Query("SELECT t FROM Transaction t WHERE t.wallet.user.id = :userId ORDER BY t.createdAt DESC LIMIT :limit")
    List<Transaction> findRecentTransactionsByUserId(@Param("userId") Long userId, @Param("limit") int limit);
    
    // Statistics queries
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.wallet.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.wallet.user.id = :userId AND t.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.wallet.user.id = :userId AND t.createdAt >= :startDate")
    long countByUserIdAndCreatedAtAfter(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.wallet.user.id = :userId AND t.type = :type")
    BigDecimal sumAmountByUserIdAndType(@Param("userId") Long userId, @Param("type") TransactionType type);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.wallet.user.id = :userId AND t.type = :type")
    long countByUserIdAndType(@Param("userId") Long userId, @Param("type") TransactionType type);
    
    // Currency-specific statistics
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.wallet.user.id = :userId AND t.currency = :currency")
    BigDecimal sumAmountByUserIdAndCurrency(@Param("userId") Long userId, @Param("currency") String currency);
    
    @Query("SELECT t.currency, SUM(t.amount) FROM Transaction t WHERE t.wallet.user.id = :userId GROUP BY t.currency")
    List<Object[]> sumAmountByCurrencyForUser(@Param("userId") Long userId);
    
    // Monthly statistics
    @Query("SELECT YEAR(t.createdAt) as year, MONTH(t.createdAt) as month, COUNT(t) as count, SUM(t.amount) as total " +
           "FROM Transaction t WHERE t.wallet.user.id = :userId " +
           "GROUP BY YEAR(t.createdAt), MONTH(t.createdAt) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> getMonthlyStatistics(@Param("userId") Long userId);
} 