package com.swift.wallet.controller;

import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import com.swift.wallet.dto.TransferRequest;
import com.swift.wallet.dto.WalletDto;
import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all wallets for the current user
     */
    @GetMapping("/wallets")
    public ResponseEntity<List<WalletDto>> getUserWallets(@RequestParam Long userId) {
        List<WalletDto> wallets = walletService.getUserWallets(userId);
        return ResponseEntity.ok(wallets);
    }

    /**
     * Get specific wallet by ID
     */
    @GetMapping("/wallets/{walletId}")
    public ResponseEntity<WalletDto> getWalletById(@PathVariable Long walletId) {
        return walletService.getWalletById(walletId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get wallet by currency for current user
     */
    @GetMapping("/wallets/currency/{currency}")
    public ResponseEntity<WalletDto> getWalletByCurrency(@RequestParam Long userId, @PathVariable CurrencyType currency) {
        return walletService.getUserWalletByCurrency(userId, currency)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Transfer money between wallets
     */
    @PostMapping("/transfer")
    public ResponseEntity<Map<String, Object>> transferMoney(@Valid @RequestBody TransferRequest request) {
        try {
            boolean success = walletService.transferMoney(request);
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("success", true);
                response.put("message", "Transfer completed successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Transfer failed");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get wallet balance
     */
    @GetMapping("/balance/{walletId}")
    public ResponseEntity<Map<String, Object>> getWalletBalance(@PathVariable Long walletId) {
        return walletService.getWalletById(walletId)
                .map(wallet -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("walletId", wallet.getId());
                    response.put("currency", wallet.getCurrency());
                    response.put("balance", wallet.getBalance());
                    response.put("symbol", wallet.getCurrency().getSymbol());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all balances for user
     */
    @GetMapping("/balances")
    public ResponseEntity<List<Map<String, Object>>> getAllBalances(@RequestParam Long userId) {
        List<WalletDto> wallets = walletService.getUserWallets(userId);
        List<Map<String, Object>> balances = wallets.stream()
                .map(wallet -> {
                    Map<String, Object> balance = new HashMap<>();
                    balance.put("walletId", wallet.getId());
                    balance.put("currency", wallet.getCurrency());
                    balance.put("balance", wallet.getBalance());
                    balance.put("symbol", wallet.getCurrency().getSymbol());
                    balance.put("isPrimary", wallet.isPrimary());
                    return balance;
                })
                .toList();
        return ResponseEntity.ok(balances);
    }
} 