package com.example.NotificationService.dto;

import lombok.Data;

@Data
public class CreateNotificationRequest {

    private Long userId;
    private String title;
    private String accountNumber;
    private String content;
}
