package com.example.SavingService.dto.request;

public class CloseSavingInternalRequest {

    private String savingAccountNumber;

    public CloseSavingInternalRequest() {}

    public CloseSavingInternalRequest(String savingAccountNumber) {
        this.savingAccountNumber = savingAccountNumber;
    }

    public String getSavingAccountNumber() {
        return savingAccountNumber;
    }
}
