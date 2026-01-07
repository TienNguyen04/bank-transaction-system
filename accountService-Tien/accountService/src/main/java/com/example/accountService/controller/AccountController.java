package com.example.accountService.controller;

import com.example.accountService.config.JwtUtil;
import com.example.accountService.dto.request.CloseSavingInternalRequest;
import com.example.accountService.dto.request.OpenSavingAccReq;
import com.example.accountService.dto.response.AccountRes;
import com.example.accountService.dto.response.ApiResponse;
import com.example.accountService.repository.AccountRepository;
import com.example.accountService.service.AccountService;
import com.example.accountService.service.AccountServiceIml;
import com.example.accountService.service.SavingClient;
import com.example.accountService.service.SavingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/account")
public class AccountController {
    private final AccountService accountService;
    private final AccountServiceIml accountServiceIml;
    private final JwtUtil jwtUtil;
    private final SavingClient savingClient;
    private final AccountRepository accountRepository;

    public AccountController(AccountService accountService, AccountServiceIml accountServiceIml, JwtUtil jwtUtil, SavingClient savingClient, AccountRepository accountRepository) {
        this.accountService = accountService;
        this.accountServiceIml = accountServiceIml;
        this.jwtUtil = jwtUtil;
        this.savingClient = savingClient;
        this.accountRepository = accountRepository;
    }
    @GetMapping("/my-accounts")
    public List<AccountRes> getMyAccounts(Authentication authentication) {
        int userId = (int) authentication.getPrincipal();
        return accountService.getAccountList(userId);
    }
    @GetMapping("/my-paymentnumber")
    public String getMyAccountNumber(Authentication authentication) {
        int userId = (int) authentication.getPrincipal();
        return accountRepository.findByUserIdAndAccountType(userId,"PAYMENT").getAccountNumber();
    }
    @GetMapping("/{accountNumber}/balance")
    public BigDecimal getAccountBalance(@PathVariable("accountNumber") String accountNumber) {
        return accountService.getAccountBalance(accountNumber);
    }
    @GetMapping("/{accountNumber}/accountInfor")
    public AccountRes getAccountInfor(@PathVariable("accountNumber") String accountNumber) {
        return accountService.getAccount(accountNumber);
    }
//    @GetMapping("/{userId}/accountList")
//    public List<AccountRes> getAccountList(@PathVariable("userId") int userId) {
//        return accountService.getAccountList(userId);
//    }
    @GetMapping("/check-name/{accountNumber}")
    public ResponseEntity<?> getAccountName(@PathVariable String accountNumber) {
        try {
            String fullName = accountServiceIml.getAccountName(accountNumber);
            // Trả về JSON: { "fullName": "Nguyen Van A" }
            Map<String, String> response = Collections.singletonMap("fullName", fullName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/{userID}/createAccount")
    public ApiResponse<AccountRes> createAccount(@PathVariable("userID") int userID, @RequestBody OpenSavingAccReq accReq) {
        return new ApiResponse<>(
                "success",
                accountService.createAccount(userID,accReq)
        );
    }
    @PostMapping("/closesaving")
    public ResponseEntity<?> closeSaving(
            Authentication authentication,
            @RequestBody CloseSavingInternalRequest req
    ) {
        int userId = (int) authentication.getPrincipal();
        savingClient.closeSaving(
                userId,
                req.getSavingAccountNumber()
        );

        return ResponseEntity.ok("Tất toán thành công");
    }
    @PostMapping("/opensaving")
    public ResponseEntity<?> openSaving(
            Authentication authentication,
            @RequestBody OpenSavingAccReq accReq
    ) {
        int userId = (int) authentication.getPrincipal();
        savingClient.openSaving(
                userId,
                accReq.getBalance(),
                accReq.getTerm()
        );

        return ResponseEntity.ok("Mở tài khoản thành công");
    }




}
