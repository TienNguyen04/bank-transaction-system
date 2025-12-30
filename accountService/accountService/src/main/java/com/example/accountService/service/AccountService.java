package com.example.accountService.service;

import com.example.accountService.dto.request.CreateSavingAccReq;
import com.example.accountService.dto.response.AccountRes;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    BigDecimal getAccountBalance(String account_number);
    AccountRes getAccount(String account_number);
    AccountRes createAccount(int userID, CreateSavingAccReq accReq);
    List<AccountRes> getAccountList(long userId);
}
