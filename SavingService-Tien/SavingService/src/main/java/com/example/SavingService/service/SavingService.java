package com.example.SavingService.service;

import com.example.SavingService.dto.response.APIRes;
import com.example.SavingService.dto.request.OpenSavingRequest;
import com.example.SavingService.enity.Accounts;
import com.example.SavingService.repository.SavingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

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
    public APIRes<OpenSavingRequest> openSaving (int userid, BigDecimal balance, String term) {
        List<Accounts> account0 = savingRepository.findByUserId(userid);
        Accounts account1 = new Accounts();
        Accounts account2 = new Accounts();
        for(Accounts account: account0){
            if(account.getAccountType().equals("payment")){
                account1 = account;
            }
        }
        if(balance.compareTo(account1.getBalance())>0){
//            return new APIRes<OpenSavingRequest>(
//                    "fail","Số dư tài khoản hiện không đủ",
//
//            )
            throw new RuntimeException("Số dư tài khoản hiện không đủ");
        }
        else {
            BigDecimal newBalance = account1.getBalance().subtract(balance);
            account1.setBalance(newBalance);
        }

        account2.setUserId(userid);
        account2.setBalance(balance);
        account2.setCurrency("VND");
        account2.setAccountType("saving");
        account2.setCreatedAt(LocalDateTime.now());
        account2.setAccountNumber(generate());
        account2.setTerm(term);
        savingRepository.save(account2);
        OpenSavingRequest openSavingRequest = new OpenSavingRequest();
        openSavingRequest.setAccountNumber(account2.getAccountNumber());
        openSavingRequest.setBalance(balance);
        openSavingRequest.setTerm(term);
        return new APIRes<>(
                "200 OK",
                openSavingRequest
        );
    }

        public static String generate() {
            String time = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

            int random = ThreadLocalRandom.current().nextInt(100, 999);

            return time + random;
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

        Accounts paymentaccount = savingRepository.findAccountsByUserIdAndAccountType(userId,"payment");
        paymentaccount.setBalance(paymentaccount.getBalance().add(saving.getBalance()));
//        // 🔁 Cộng tiền về tài khoản thanh toán
//        restTemplate.postForEntity(
//                "http://account-service/account/internal/add-balance",
//                new OpenSavingRequest(
//                        getPaymentAccountNumber(userId),
//                        saving.getBalance(),
//                        saving.getTerm()
//                ),
//                Void.class
//        );
    }
}

