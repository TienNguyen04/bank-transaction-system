package com.bank.userservice.service;

import com.bank.userservice.dto.*;

/**
 * Service interface for user operations
 * Định nghĩa các chức năng của User Service
 */
public interface UserService {
    AuthResponse login(AuthRequest request);
    UserResponse createUser(UserCreateRequest request, String createdByRole);
    UserResponse getUserById(Long id);
    UserResponse getUserByUsername(String username);
    UserResponse updateUser(Long id, UserUpdateRequest request);
    void changePassword(Long id, ChangePasswordRequest request);
    UserResponse changeUserRole(Long id, String role, String changedBy);
    UserResponse changeUserStatus(Long id, String status, String changedBy);

    // Internal APIs for other services
    boolean validateUserExists(Long userId);
    UserResponse getUserInfoForInternal(Long userId);
    boolean validateToken(String token);

    UserResponse register(RegisterRequest request);
    void sendResetPasswordEmail(String email);
    void resetPassword(String token, String newPassword);
    UserResponse updateCurrentUser(String username, UserUpdateRequest request);
}