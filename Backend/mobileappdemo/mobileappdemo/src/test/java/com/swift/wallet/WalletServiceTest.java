package com.swift.wallet;

import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import com.swift.wallet.dto.TransferRequest;
import com.swift.wallet.dto.WalletDto;
import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.enums.TransactionType;
import com.swift.wallet.models.Transaction;
import com.swift.wallet.models.Wallet;
import com.swift.wallet.repository.WalletRepository;
import com.swift.wallet.service.ExchangeRateService;
import com.swift.wallet.service.TransactionService;
import com.swift.wallet.service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private TransactionService transactionService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ExchangeRateService exchangeRateService;

    @InjectMocks
    private WalletService walletService;

    private User testUser;
    private Wallet ghsWallet;
    private Wallet usdWallet;
    private Wallet eurWallet;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmailOrPhone("test@example.com");

        ghsWallet = new Wallet(testUser, CurrencyType.GHS, true);
        ghsWallet.setId(1L);
        ghsWallet.setBalance(BigDecimal.valueOf(1000.00));

        usdWallet = new Wallet(testUser, CurrencyType.USD, false);
        usdWallet.setId(2L);
        usdWallet.setBalance(BigDecimal.valueOf(500.00));

        eurWallet = new Wallet(testUser, CurrencyType.EUR, false);
        eurWallet.setId(3L);
        eurWallet.setBalance(BigDecimal.valueOf(400.00));
    }

    @Test
    void testGetUserWallets() {
        // Arrange
        List<Wallet> wallets = Arrays.asList(ghsWallet, usdWallet, eurWallet);
        when(walletRepository.findUserWalletsOrdered(1L)).thenReturn(wallets);

        // Act
        List<WalletDto> result = walletService.getUserWallets(1L);

        // Assert
        assertEquals(3, result.size());
        assertEquals(CurrencyType.GHS, result.get(0).getCurrency());
        assertEquals(CurrencyType.USD, result.get(1).getCurrency());
        assertEquals(CurrencyType.EUR, result.get(2).getCurrency());
        assertTrue(result.get(0).isPrimary());
        assertFalse(result.get(1).isPrimary());
        assertFalse(result.get(2).isPrimary());
    }

    @Test
    void testGetWalletById() {
        // Arrange
        when(walletRepository.findById(1L)).thenReturn(Optional.of(ghsWallet));

        // Act
        Optional<WalletDto> result = walletService.getWalletById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals(CurrencyType.GHS, result.get().getCurrency());
        assertEquals(BigDecimal.valueOf(1000.00), result.get().getBalance());
    }

    @Test
    void testGetWalletByIdNotFound() {
        // Arrange
        when(walletRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<WalletDto> result = walletService.getWalletById(999L);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void testGetUserWalletByCurrency() {
        // Arrange
        when(walletRepository.findUserWalletByCurrency(1L, CurrencyType.USD))
                .thenReturn(Optional.of(usdWallet));

        // Act
        Optional<WalletDto> result = walletService.getUserWalletByCurrency(1L, CurrencyType.USD);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(CurrencyType.USD, result.get().getCurrency());
        assertEquals(BigDecimal.valueOf(500.00), result.get().getBalance());
    }

    @Test
    void testTransferMoneySameCurrency() {
        // Arrange
        TransferRequest request = new TransferRequest(1L, 2L, BigDecimal.valueOf(100.00), 
                                                    CurrencyType.GHS, "Test transfer");
        
        when(walletRepository.findById(1L)).thenReturn(Optional.of(ghsWallet));
        when(walletRepository.findById(2L)).thenReturn(Optional.of(usdWallet));
        when(exchangeRateService.getExchangeRate(CurrencyType.GHS, CurrencyType.GHS)).thenReturn(BigDecimal.ONE);
        when(transactionService.createTransaction(any(com.swift.wallet.models.Wallet.class), any(TransactionType.class), 
                                                any(BigDecimal.class), any(CurrencyType.class), 
                                                anyString(), anyString())).thenReturn(new Transaction());

        // Act
        boolean result = walletService.transferMoney(request);

        // Assert
        assertTrue(result);
        verify(walletRepository, times(2)).save(any(com.swift.wallet.models.Wallet.class));
        verify(transactionService, times(2)).createTransaction(any(com.swift.wallet.models.Wallet.class), any(TransactionType.class), 
                                                              any(BigDecimal.class), any(CurrencyType.class), 
                                                              anyString(), anyString());
        
        // Verify balances were updated correctly
        assertEquals(BigDecimal.valueOf(900.00), ghsWallet.getBalance());
        assertEquals(BigDecimal.valueOf(600.00), usdWallet.getBalance());
    }

    @Test
    void testTransferMoneyCrossCurrency() {
        // Arrange
        TransferRequest request = new TransferRequest(1L, 2L, BigDecimal.valueOf(100.00), 
                                                    CurrencyType.GHS, "Cross currency transfer");
        
        when(walletRepository.findById(1L)).thenReturn(Optional.of(ghsWallet));
        when(walletRepository.findById(2L)).thenReturn(Optional.of(usdWallet));
        when(exchangeRateService.getExchangeRate(CurrencyType.GHS, CurrencyType.USD))
                .thenReturn(BigDecimal.valueOf(0.12)); // 1 GHS = 0.12 USD
        when(transactionService.createTransaction(any(com.swift.wallet.models.Wallet.class), any(TransactionType.class), 
                                                any(BigDecimal.class), any(CurrencyType.class), 
                                                anyString(), anyString())).thenReturn(new Transaction());

        // Act
        boolean result = walletService.transferMoney(request);

        // Assert
        assertTrue(result);
        verify(walletRepository, times(2)).save(any(com.swift.wallet.models.Wallet.class));
        verify(transactionService, times(2)).createTransaction(any(com.swift.wallet.models.Wallet.class), any(TransactionType.class), 
                                                              any(BigDecimal.class), any(CurrencyType.class), 
                                                              anyString(), anyString());
        verify(exchangeRateService).getExchangeRate(CurrencyType.GHS, CurrencyType.USD);
        
        // Verify balances were updated correctly
        assertEquals(BigDecimal.valueOf(900.00), ghsWallet.getBalance());
        assertEquals(0, usdWallet.getBalance().compareTo(BigDecimal.valueOf(512.00)));
    }

    @Test
    void testTransferMoneyInsufficientBalance() {
        // Arrange
        TransferRequest request = new TransferRequest(1L, 2L, BigDecimal.valueOf(2000.00), 
                                                    CurrencyType.GHS, "Large transfer");
        
        when(walletRepository.findById(1L)).thenReturn(Optional.of(ghsWallet));
        when(walletRepository.findById(2L)).thenReturn(Optional.of(usdWallet));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            walletService.transferMoney(request);
        });
        
        verify(walletRepository, never()).save(any(com.swift.wallet.models.Wallet.class));
        verify(transactionService, never()).createTransaction(any(com.swift.wallet.models.Wallet.class), any(TransactionType.class), 
                                                             any(BigDecimal.class), any(CurrencyType.class), 
                                                             anyString(), anyString());
    }

    @Test
    void testTransferMoneyWalletNotFound() {
        // Arrange
        TransferRequest request = new TransferRequest(999L, 2L, BigDecimal.valueOf(100.00), 
                                                    CurrencyType.GHS, "Invalid transfer");
        
        when(walletRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            walletService.transferMoney(request);
        });
        
        verify(walletRepository, never()).save(any(com.swift.wallet.models.Wallet.class));
        verify(transactionService, never()).createTransaction(any(com.swift.wallet.models.Wallet.class), any(TransactionType.class), 
                                                             any(BigDecimal.class), any(CurrencyType.class), 
                                                             anyString(), anyString());
    }

    @Test
    void testTransferMoneyDifferentUsers() {
        // Arrange
        User otherUser = new User();
        otherUser.setId(2L);
        Wallet otherWallet = new Wallet(otherUser, CurrencyType.USD, false);
        otherWallet.setId(4L);
        
        TransferRequest request = new TransferRequest(1L, 4L, BigDecimal.valueOf(100.00), 
                                                    CurrencyType.GHS, "Cross user transfer");
        
        when(walletRepository.findById(1L)).thenReturn(Optional.of(ghsWallet));
        when(walletRepository.findById(4L)).thenReturn(Optional.of(otherWallet));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            walletService.transferMoney(request);
        });
        
        verify(walletRepository, never()).save(any(com.swift.wallet.models.Wallet.class));
        verify(transactionService, never()).createTransaction(any(com.swift.wallet.models.Wallet.class), any(TransactionType.class), 
                                                             any(BigDecimal.class), any(CurrencyType.class), 
                                                             anyString(), anyString());
    }
} 