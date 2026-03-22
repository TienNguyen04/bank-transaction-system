package com.example.NotificationService.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private Long id;
    private String title;
    private String accountNumber;
    private String content;
    private String status;
    private LocalDateTime time;
}
