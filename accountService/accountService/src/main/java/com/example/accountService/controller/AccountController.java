package com.example.accountService.controller;

import com.example.accountService.config.JwtUtil;
import com.example.accountService.dto.request.CreateSavingAccReq;
import com.example.accountService.dto.response.AccountRes;
import com.example.accountService.dto.response.ApiResponse;
import com.example.accountService.service.AccountService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/account")
public class AccountController {
    private final AccountService accountService;
    private final JwtUtil jwtUtil;
    public AccountController(AccountService accountService, JwtUtil jwtUtil) {
        this.accountService = accountService;
        this.jwtUtil = jwtUtil;
    }
    @GetMapping("/my-accounts")
    public List<AccountRes> getMyAccounts(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return accountService.getAccountList(userId);
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
    @PostMapping("/{userID}/createAccount")
    public ApiResponse<AccountRes> createAccount(@PathVariable("userID") int userID, @RequestBody CreateSavingAccReq accReq) {
        return new ApiResponse<>(
                "success",
                accountService.createAccount(userID,accReq)
        );
    }


}
