package com.example.accountService.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
//@AllArgsConstructor
//@NoArgsConstructor
@Data
public class AccountRes {
    //private int id;
    private String accountNumber;
    private int userId;
    private BigDecimal balance;
    private String accountType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AccountRes(String accountNumber, BigDecimal balance, String accountType, String status) {
        this.accountNumber = accountNumber;
        //this.userId = userId;
        this.balance = balance;
        this.status = status;
        this.accountType = accountType;

        //this.createdAt = LocalDateTime.now();
        //this.updatedAt = LocalDateTime.now();

    }

}
