package com.example.SavingService.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequest {

    private int userId;
    private String title;
    private String accountNumber;
    private String content;
}
