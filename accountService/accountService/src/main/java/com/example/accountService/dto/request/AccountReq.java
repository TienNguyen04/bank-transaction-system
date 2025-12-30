package com.example.accountService.dto.request;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountReq {
    private int id;
    private String accountNumber;
    private int userId;
    private BigDecimal balance;
    private String accountType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

//    public AccountReq(String accountNumber, int userId, BigDecimal balance, String accountType, String status) {
//        this.accountNumber = accountNumber;
//        this.userId = userId;
//        this.balance = balance;
//        this.accountType = accountType;
//        this.status = status;
//
//    }


}
