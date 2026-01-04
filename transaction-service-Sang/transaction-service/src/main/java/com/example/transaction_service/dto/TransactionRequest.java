package com.example.transaction_service.dto;

import com.example.transaction_service.enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransactionRequest {
    // UI gửi "0123456789" (Chuỗi)
    private String fromAccountNumber;
    private String toAccountNumber;

    @NotNull(message = "Số tiền không được để trống")
    @Positive(message = "Số tiền phải lớn hơn 0")
    private BigDecimal amount;

    @NotNull(message = "Loại giao dịch là bắt buộc")
    private TransactionType type;

    private String description;
}