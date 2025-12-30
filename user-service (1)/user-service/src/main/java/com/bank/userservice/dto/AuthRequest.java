package com.bank.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for authentication request
 * Sử dụng cho đăng nhập
 */
@Data
public class AuthRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}