package com.example.accountService.dto.response;

public record ApiResponse<T>(
        String status,
        T data
) {
}
