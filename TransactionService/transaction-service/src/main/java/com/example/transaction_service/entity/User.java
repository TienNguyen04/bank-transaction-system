package com.example.transaction_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users", schema = "user_service")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;
}