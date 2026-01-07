package com.example.accountService.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OpenSavingAccReq {
    //private String accountNumber;
    private BigDecimal balance;
    private String term;
}
