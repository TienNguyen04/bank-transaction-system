package com.example.accountService.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor


public class CloseSavingInternalRequest {

    private String savingAccountNumber;

    public String getSavingAccountNumber() {
        return savingAccountNumber;
    }

    public void setSavingAccountNumber(String savingAccountNumber) {
        this.savingAccountNumber = savingAccountNumber;
    }
}

