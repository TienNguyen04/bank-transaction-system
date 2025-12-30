package com.example.transaction_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "accounts", schema = "account_service")
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "user_id")
    private Long userId;

    private BigDecimal balance;
}
