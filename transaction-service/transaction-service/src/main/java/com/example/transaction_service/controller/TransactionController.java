package com.example.transaction_service.controller;

import com.example.transaction_service.dto.TransactionRequest;
import com.example.transaction_service.entity.Account;
import com.example.transaction_service.repository.AccountRepository;
import com.example.transaction_service.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest request) {
        try {
            return ResponseEntity.ok(transactionService.createTransaction(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/history")
    public ResponseEntity<?> getTransactionHistory() {
        try {
            // Gọi service để lấy danh sách
            return ResponseEntity.ok(transactionService.getMyTransactionHistory());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/check-name/{accountNumber}")
    public ResponseEntity<?> getAccountName(@PathVariable String accountNumber) {
        try {
            String fullName = transactionService.getAccountName(accountNumber);
            // Trả về JSON: { "fullName": "Nguyen Van A" }
            Map<String, String> response = Collections.singletonMap("fullName", fullName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/balance/{accountNumber}")
    public ResponseEntity<?> getAccountBalance(@PathVariable String accountNumber) {
        try {
            java.math.BigDecimal balance = transactionService.getAccountBalance(accountNumber);
            // Trả về JSON: { "balance": 12000000 }
            return ResponseEntity.ok(java.util.Collections.singletonMap("balance", balance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/my-account")
    public ResponseEntity<Account> getMyAccount() {
        return ResponseEntity.ok(transactionService.getMyAccountInfo());
    }
}