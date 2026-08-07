package com.swift.wallet.controller;

import com.swift.auth.models.User;
import com.swift.auth.repository.UserRepository;
import com.swift.wallet.dto.PaystackTransferRecipientRequest;
import com.swift.wallet.dto.TransferRequest;
import com.swift.wallet.dto.WalletDto;
import com.swift.wallet.enums.CurrencyType;
import com.swift.wallet.enums.TransactionType;
import com.swift.wallet.service.WalletService;
import com.swift.wallet.service.PaystackService;
import com.swift.wallet.service.ExchangeRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaystackService paystackService;

    @Autowired
    private ExchangeRateService exchangeRateService;

    /**
     * Get all wallets for the current user
     */
    @GetMapping("/wallets")
    public ResponseEntity<List<WalletDto>> getUserWallets(@AuthenticationPrincipal Long currentUserId) {
        List<WalletDto> wallets = walletService.getUserWallets(currentUserId);
        return ResponseEntity.ok(wallets);
    }

    /**
     * Ensure user has wallets for all currencies
     */
    @PostMapping("/wallets/ensure")
    public ResponseEntity<?> ensureWalletsExist(@AuthenticationPrincipal Long currentUserId) {
        try {
            Optional<User> userOpt = userRepository.findById(currentUserId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User not found"
                ));
            }

            User user = userOpt.get();
            walletService.createUserWallets(user);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Wallets ensured for user: " + user.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Failed to ensure wallets: " + e.getMessage()
            ));
        }
    }

    /**
     * Get specific wallet by ID
     */
    @GetMapping("/wallets/{walletId}")
    public ResponseEntity<WalletDto> getWalletById(@PathVariable Long walletId, @AuthenticationPrincipal Long currentUserId) {
        Optional<WalletDto> wallet = walletService.getWalletById(walletId);
        if (wallet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!wallet.get().getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(wallet.get());
    }

    /**
     * Get wallet by currency for current user
     */
    @GetMapping("/wallets/currency/{currency}")
    public ResponseEntity<WalletDto> getWalletByCurrency(@RequestParam Long userId, @PathVariable CurrencyType currency, @AuthenticationPrincipal Long currentUserId) {
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return walletService.getUserWalletByCurrency(userId, currency)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Interwallet transfer: move money between user's own wallets (no Paystack)
     */
    @PostMapping("/interwallet")
    public ResponseEntity<Map<String, Object>> interwalletTransfer(@Valid @RequestBody TransferRequest request, @AuthenticationPrincipal Long currentUserId) {
        if (request.getUserId() != null && !request.getUserId().equals(currentUserId)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Cannot transfer wallets belonging to another user");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        request.setUserId(currentUserId);
        try {
            boolean success = walletService.transferMoney(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "Interwallet transfer successful" : "Transfer failed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Send money to a third party's bank/mobile money account via Paystack.
     * Balance is checked before calling Paystack, and only debited after Paystack confirms.
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(@RequestBody Map<String, Object> request, @AuthenticationPrincipal Long currentUserId) {
        try {
            CurrencyType currency = CurrencyType.valueOf(((String) request.getOrDefault("currency", "GHS")).toUpperCase());
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String reason = (String) request.getOrDefault("reason", "Send");

            // Fail fast if funds aren't there, before ever calling Paystack
            walletService.ensureSufficientBalance(currentUserId, currency, amount);

            String recipientCode = resolveRecipientCode(request, currency);
            Map<String, Object> paystackResponse = paystackService.initiateTransfer(recipientCode, amount, reason);
            String reference = referenceFrom(paystackResponse, "SEND_");

            walletService.debitWallet(currentUserId, currency, amount, TransactionType.TRANSFER, reason, reference);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paystackResponse", paystackResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Withdraw funds to the user's own bank/mobile money account using Paystack.
     * Balance is checked before calling Paystack, and only debited after Paystack confirms.
     */
    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, Object>> withdraw(@RequestBody Map<String, Object> request, @AuthenticationPrincipal Long currentUserId) {
        try {
            CurrencyType currency = CurrencyType.valueOf(((String) request.getOrDefault("currency", "GHS")).toUpperCase());
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String reason = (String) request.getOrDefault("reason", "Withdrawal");

            walletService.ensureSufficientBalance(currentUserId, currency, amount);

            String recipientCode = resolveRecipientCode(request, currency);
            Map<String, Object> paystackResponse = paystackService.initiateTransfer(recipientCode, amount, reason);
            String reference = referenceFrom(paystackResponse, "WITHDRAW_");

            walletService.debitWallet(currentUserId, currency, amount, TransactionType.WITHDRAWAL, reason, reference);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paystackResponse", paystackResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Use a client-supplied Paystack recipient code if present, otherwise create one from
     * bank/mobile money details.
     */
    private String resolveRecipientCode(Map<String, Object> request, CurrencyType currency) {
        if (request.get("recipientCode") != null) {
            return (String) request.get("recipientCode");
        }
        PaystackTransferRecipientRequest recipientRequest = new PaystackTransferRecipientRequest();
        String name = (String) request.get("name");
        if (name != null) recipientRequest.setName(name);
        recipientRequest.setAccount_number((String) request.get("accountNumber"));
        recipientRequest.setBank_code((String) request.get("bankCode"));
        recipientRequest.setCurrency(currency.name());
        return paystackService.createTransferRecipient(recipientRequest);
    }

    private String referenceFrom(Map<String, Object> paystackResponse, String prefix) {
        Object reference = paystackResponse != null ? paystackResponse.get("reference") : null;
        return reference != null ? reference.toString() : prefix + System.currentTimeMillis();
    }

    /**
     * Initialize a Paystack checkout for a deposit. Balance is not touched here - only
     * /deposit/verify credits the wallet, and only after Paystack confirms payment.
     */
    @PostMapping("/deposit")
    public ResponseEntity<Map<String, Object>> deposit(@RequestBody Map<String, Object> request, @AuthenticationPrincipal Long currentUserId) {
        try {
            String email = (String) request.get("email");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String reference = (String) request.getOrDefault("reference", "DEP_" + System.currentTimeMillis());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("user_id", currentUserId);
            metadata.put("deposit_type", "wallet_deposit");
            metadata.put("currency", "GHS");

            Map<String, Object> paystackResponse = paystackService.initializePayment(email, amount, CurrencyType.GHS, reference, metadata);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paystackResponse", paystackResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verify a Paystack payment and credit the wallet only if verification actually succeeds.
     */
    @PostMapping("/deposit/verify")
    public ResponseEntity<Map<String, Object>> verifyDeposit(@RequestBody Map<String, Object> request, @AuthenticationPrincipal Long currentUserId) {
        try {
            String reference = (String) request.get("reference");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            CurrencyType currency = CurrencyType.GHS;

            boolean paymentVerified = paystackService.verifyPayment(reference);

            Map<String, Object> response = new HashMap<>();
            if (!paymentVerified) {
                response.put("success", false);
                response.put("message", "Payment verification failed");
                return ResponseEntity.badRequest().body(response);
            }

            walletService.allocateFundsToWallet(currentUserId, currency, amount, "Deposit via Paystack - " + reference, reference);
            WalletDto wallet = walletService.getUserWalletByCurrency(currentUserId, currency)
                    .orElseThrow(() -> new RuntimeException("Wallet not found after deposit"));

            response.put("success", true);
            response.put("message", "Deposit verified and wallet credited");
            response.put("newBalance", wallet.getBalance());
            response.put("amount", amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Current exchange rates for the supported currency pairs.
     */
    @GetMapping("/rates")
    public ResponseEntity<Map<String, Object>> getRates() {
        try {
            List<Map<String, Object>> rates = new java.util.ArrayList<>();
            CurrencyType[] currencies = CurrencyType.values();
            for (CurrencyType from : currencies) {
                for (CurrencyType to : currencies) {
                    if (from == to) continue;
                    rates.add(Map.of(
                        "fromCurrency", from.name(),
                        "toCurrency", to.name(),
                        "rate", exchangeRateService.getExchangeRate(from, to)
                    ));
                }
            }
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("rates", rates);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch rates: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Valid Paystack recipient banks/mobile-money providers, so the client can offer
     * a real picker instead of free-text bank codes.
     */
    @GetMapping("/banks")
    public ResponseEntity<Map<String, Object>> getBanks(@RequestParam(required = false) String type) {
        try {
            List<Map<String, Object>> banks = paystackService.listBanks(type);
            List<Map<String, Object>> simplified = banks.stream()
                    .map(b -> Map.<String, Object>of(
                        "name", b.getOrDefault("name", ""),
                        "code", b.getOrDefault("code", "")
                    ))
                    .toList();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("banks", simplified);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch banks: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get wallet balance
     */
    @GetMapping("/balance/{walletId}")
    public ResponseEntity<Map<String, Object>> getWalletBalance(@PathVariable Long walletId, @AuthenticationPrincipal Long currentUserId) {
        Optional<WalletDto> walletOpt = walletService.getWalletById(walletId);
        if (walletOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        WalletDto wallet = walletOpt.get();
        if (!wallet.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("walletId", wallet.getId());
        response.put("currency", wallet.getCurrency());
        response.put("balance", wallet.getBalance());
        response.put("symbol", wallet.getCurrency().getSymbol());
        return ResponseEntity.ok(response);
    }

    /**
     * Get all balances for user
     */
    @GetMapping("/balances")
    public ResponseEntity<List<Map<String, Object>>> getAllBalances(@RequestParam Long userId, @AuthenticationPrincipal Long currentUserId) {
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        System.out.println("=== BALANCE REQUEST ===");
        System.out.println("User ID: " + userId);
        
        List<WalletDto> wallets = walletService.getUserWallets(userId);
        System.out.println("Found " + wallets.size() + " wallets for user " + userId);
        
        List<Map<String, Object>> balances = wallets.stream()
                .map(wallet -> {
                    Map<String, Object> balance = new HashMap<>();
                    balance.put("walletId", wallet.getId());
                    balance.put("currency", wallet.getCurrency());
                    balance.put("balance", wallet.getBalance());
                    balance.put("symbol", wallet.getCurrency().getSymbol());
                    balance.put("isPrimary", wallet.isPrimary());
                    
                    System.out.println("Wallet: " + wallet.getCurrency() + " - Balance: " + wallet.getBalance() + " - Primary: " + wallet.isPrimary());
                    return balance;
                })
                .toList();
        
        System.out.println("Returning " + balances.size() + " balance entries");
        System.out.println("=== BALANCE REQUEST END ===");
        
        return ResponseEntity.ok(balances);
    }
} 