package com.example.SavingService.service;

import com.example.SavingService.dto.AddBalanceRequest;
import com.example.SavingService.enity.Accounts;
import com.example.SavingService.repository.SavingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SavingService {

    private SavingRepository savingRepository;
    private  RestTemplate restTemplate;

    public void SavingService(
            SavingRepository savingRepository,
            RestTemplate restTemplate
    ) {
        this.savingRepository = savingRepository;
        this.restTemplate = restTemplate;
    }

    public String getPaymentAccountNumber(int userid){
        Accounts account1 = new Accounts();
        List<Accounts> accounts = savingRepository.findByUserId(userid);
        for(Accounts account: accounts){
            if(account.getAccountType().equals("payment")){
                account1 = account;
            }
        }
        return account1.getAccountNumber();
    }

    @Transactional
    public void closeSaving(int userId, String savingAccountNumber) {

        Accounts saving = savingRepository
                .findByAccountNumber(savingAccountNumber)
                .orElseThrow(() -> new RuntimeException("Saving account not found"));

        // 🔐 Ownership check
        if (saving.getUserId()==userId) {
            throw new RuntimeException("Access denied");
        }

        if (!saving.getStatus().equals("ACTIVE")) {
            throw new RuntimeException("Saving account already closed");
        }

        // 💰 tất toán
        saving.setStatus("CLOSED");
        saving.setUpdatedAt(LocalDateTime.now());

        savingRepository.save(saving);

        // 🔁 Cộng tiền về tài khoản thanh toán
        restTemplate.postForEntity(
                "http://account-service/account/internal/add-balance",
                new AddBalanceRequest(
                        getPaymentAccountNumber(userId),
                        saving.getBalance()
                ),
                Void.class
        );
    }
}

