package com.example.transaction_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Entity
// TRỎ VÀO SCHEMA CỦA TRANSACTION SERVICE
@Table(name = "transactions", schema = "transaction_service")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Hibernate tự động JOIN sang bảng accounts ở schema bên kia
    @ManyToOne
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;

    @ManyToOne
    @JoinColumn(name = "to_account_id")
    private Account toAccount;

    private BigDecimal amount;
    private String type;
    private String status;
    private String description;

    @Column(name = "transaction_code", unique = true, nullable = false)
    private String transactionCode;


    @Column(name = "from_account_number")
    private String fromAccountNumber;

    @Column(name = "to_account_number")
    private String toAccountNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ==========================================
    // CHỈ ĐỂ DUY NHẤT 1 HÀM @PrePersist NÀY THÔI
    // ==========================================
    @PrePersist
    public void prePersist() {
        // 1. Logic tự động set ngày tạo (Gộp vào đây)
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }

        // 2. Logic tự động sinh mã giao dịch (Gộp vào đây luôn)
        if (this.transactionCode == null) {
            this.transactionCode = generateTransactionCode();
        }
    }

    // Hàm hỗ trợ sinh mã (không cần @PrePersist)
    private String generateTransactionCode() {
        long randomNumber = ThreadLocalRandom.current().nextLong(1_000_000_000L, 10_000_000_000L);
        return "TRX" + randomNumber;
    }
}
