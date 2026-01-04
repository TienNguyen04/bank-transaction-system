package com.bank.userservice.controller;

import com.bank.userservice.dto.UserResponse;
import com.bank.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Internal API controller for other services
 * Chỉ dành cho BE-BE communication
 */
@RestController
@RequestMapping("/api/internal")
@RequiredArgsConstructor
public class InternalController {

    private final UserService userService;

    @GetMapping("/users/{userId}/exists")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable Long userId) {
        boolean exists = userService.validateUserExists(userId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponse> getUserInfo(@PathVariable Long userId) {
        UserResponse response = userService.getUserInfoForInternal(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate-token")
    public ResponseEntity<Boolean> validateToken(@RequestBody String token) {
        boolean isValid = userService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
}