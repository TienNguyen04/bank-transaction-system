package com.example.SavingService.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpenSavingRequest {
    private String accountNumber;
    private BigDecimal balance;
    private String term;
//    public AddBalanceRequest(String accountNumber, BigDecimal balance) {
//        this.accountNumber = accountNumber;
//        this.balance = balance;
//    }
}
