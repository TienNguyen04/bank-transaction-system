package com.bank.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for broadcasting token to other services
 * Dùng để gửi token đến các service khác
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenBroadcastRequest {
    private String token;
    private Long userId;
    private String username;
    private String role;
    private String status;
    private LocalDateTime timestamp;
}