package com.bank.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for updating user information
 * Chỉ cho phép cập nhật email, phone, fullName
 */
@Data
public class UserUpdateRequest {
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone must be 10-15 digits")
    private String phone;

    @Size(max = 100, message = "Full name too long")
    private String fullName;
}