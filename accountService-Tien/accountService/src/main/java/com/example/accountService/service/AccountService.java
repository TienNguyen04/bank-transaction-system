package com.example.accountService.service;

import com.example.accountService.dto.request.OpenSavingAccReq;
import com.example.accountService.dto.response.AccountRes;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    BigDecimal getAccountBalance(String account_number);
    AccountRes getAccount(String account_number);
    AccountRes createAccount(int userID, OpenSavingAccReq accReq);
    List<AccountRes> getAccountList(int userId);
}
