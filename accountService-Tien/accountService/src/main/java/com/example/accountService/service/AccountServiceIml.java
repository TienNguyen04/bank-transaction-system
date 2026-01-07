package com.example.accountService.service;
import com.example.accountService.dto.request.OpenSavingAccReq;
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
    public AccountRes createAccount(int userID, OpenSavingAccReq accReq) {
        Accounts account = new Accounts();
        account.setUserId(userID);
        account.setAccountType("SAVING");
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
                account.getStatus(),
                account.getAccountType()

        );
    }
    @Override
    public List<AccountRes> getAccountList(int userId) {

        List<AccountRes> accountsList = new ArrayList<>();

        List<Accounts> accounts = accountRepository.findByUserId(userId);

        for (Accounts account : accounts) {
            accountsList.add(
                    new AccountRes(
                            account.getAccountNumber(),
                            account.getBalance(),
                            account.getAccountType(),
                            account.getStatus()

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
    public String getAccountName(String accountNumber) {
        // 1. In ra xem nhận được số tài khoản gì (Kiểm tra thừa khoảng trắng)
        System.out.println("DEBUG: Đang tìm STK = [" + accountNumber + "]");

        String fullName = accountRepository.findUserNameByAccountNumber(accountNumber.trim());
        if (fullName == null) {
            throw new RuntimeException("Tài khoản không tồn tại hoặc chưa có tên chủ sở hữu");
        }
        System.out.println("DEBUG: Đã tìm thấy tên: " + fullName);
        return fullName;
    }

}

