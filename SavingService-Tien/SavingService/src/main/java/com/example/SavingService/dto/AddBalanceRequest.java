package com.example.SavingService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddBalanceRequest {
    private String accountNumber;
    private BigDecimal balance;

//    public AddBalanceRequest(String accountNumber, BigDecimal balance) {
//        this.accountNumber = accountNumber;
//        this.balance = balance;
//    }
}
