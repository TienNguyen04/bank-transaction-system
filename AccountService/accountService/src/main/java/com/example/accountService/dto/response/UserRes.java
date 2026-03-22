package com.example.accountService.dto.response;

public record UserRes (
    int userID,
    String name,
    String email,
    String status
){}
