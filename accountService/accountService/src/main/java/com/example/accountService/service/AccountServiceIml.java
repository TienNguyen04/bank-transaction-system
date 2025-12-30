package com.example.accountService.service;
import com.example.accountService.dto.request.CreateSavingAccReq;
import com.example.accountService.dto.response.AccountRes;
import com.example.accountService.model.Accounts;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.example.accountService.repository.AccountRepository;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AccountServiceIml implements AccountService {
    private final AccountRepository accountRepository;
    public AccountServiceIml(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }
    @Override
    public BigDecimal getAccountBalance(String accountNumber){
        Accounts account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if(!"ACTIVE".equals(account.getStatus())){
            throw new RuntimeException("Account not activated");
        }
        return account.getBalance();
    }
    @Override
    public AccountRes createAccount(int userID, CreateSavingAccReq accReq) {
        Accounts account = new Accounts();
        account.setUserId(userID);
        account.setAccountType(accReq.getAccountType());
        account.setStatus("ACTIVE");
        while (accountRepository.existsByAccountNumber(account.getAccountNumber())){
            account.setAccountNumber(generateAccountNumber());
        }
        account.setBalance(BigDecimal.ZERO);
        Accounts saved = accountRepository.save(account);

        return new AccountRes(
                saved.getAccountNumber(),
                saved.getBalance(),
                saved.getAccountType(),
                saved.getStatus()
        );
    }
    @Override
    public AccountRes getAccount(String accountNumber) {
        Accounts account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        if(!"ACTIVE".equals(account.getStatus())){
            throw new RuntimeException("Account not activated");
        }
        return new AccountRes(
                account.getAccountNumber(),
                account.getBalance(),
                account.getAccountType(),
                account.getStatus()
        );
    }
    @Override
    public List<AccountRes> getAccountList(long userId) {

        List<AccountRes> accountsList = new ArrayList<>();

        List<Accounts> accounts = accountRepository.findByUserId(userId);

        for (Accounts account : accounts) {
            accountsList.add(
                    new AccountRes(
                            account.getAccountNumber(),
                            account.getBalance(),
                            account.getStatus(),
                            account.getAccountType()
                    )
            );
        }
        return accountsList;
    }

    private String generateAccountNumber() {
        SecureRandom random = new SecureRandom();
        long number = 100000000000L +
                (Math.abs(random.nextLong()) % 900000000000L);
        return String.valueOf(number);
    }

}

