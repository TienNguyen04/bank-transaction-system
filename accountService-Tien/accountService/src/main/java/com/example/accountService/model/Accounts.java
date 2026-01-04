package com.example.accountService.model;

import jakarta.persistence.*;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "accounts",schema ="account_service")
public class Accounts {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "user_id")
    private int userId;
    @Column(name="balance")
    private BigDecimal balance;
    @Column(name ="account_type")
    private String accountType;

    @Column(name="currency")
    private String currency;

    @Column(name="status")
    private String status;
    @Column(name="created_at")
    private LocalDateTime createdAt;
    @Column(name="updated_at")
    private LocalDateTime updatedAt;


}

