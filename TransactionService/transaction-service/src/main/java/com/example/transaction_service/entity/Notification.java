package com.example.transaction_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification",schema = "notification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(name = "user_id")
    private int userId;
    @Column(name = "title")
    private String title;
    @Column(name = "account_number")
    private String accountNumber;
    @Column(name = "content")
    private String content;
    @Column(name = "status")
    private String status; // UNREAD, READ
    @Column(name = "time")
    private LocalDateTime time;
}