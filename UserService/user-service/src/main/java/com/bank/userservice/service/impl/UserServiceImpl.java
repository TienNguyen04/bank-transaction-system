package com.bank.userservice.service.impl;

import com.bank.userservice.config.JwtTokenProvider;
import com.bank.userservice.dto.*;
import com.bank.userservice.entity.Notification;
import com.bank.userservice.entity.User;
import com.bank.userservice.repository.NotiRepository;
import com.bank.userservice.repository.UserRepository;
import com.bank.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

/**
 * Implementation of UserService
 * Triển khai logic nghiệp vụ
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestTemplate restTemplate;
    private final NotiRepository notiRepository;

    @Override
    public AuthResponse login(AuthRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user details
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check status
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new RuntimeException("Account is locked");
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Generate token
        String token = jwtTokenProvider.generateToken(authentication);

        // Tạo response cho FE
        AuthResponse authResponse = AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .status(user.getStatus())
                .token(token)
                .build();

        // Gửi token đến các service khác (bất đồng bộ)
        broadcastTokenToOtherServices(token, user);
        Notification noti = new Notification();
        noti.setAccountNumber("");
        noti.setTime(LocalDateTime.now());
        noti.setContent(" Đăng nhập thành công! ");
        noti.setTitle(" Thông báo phiên đăng nhập mới ");
        noti.setUserId(user.getId());
        noti.setStatus(" UNREAD ");
        notiRepository.save(noti);

        return authResponse;
    }

    /**
     * Gửi token đến tất cả các service khác trong hệ thống
     * Gửi bất đồng bộ để không ảnh hưởng đến response time
     */
    private void broadcastTokenToOtherServices(String token, User user) {
        CompletableFuture.runAsync(() -> {
            try {
                // Tạo request body
                TokenBroadcastRequest broadcastRequest = TokenBroadcastRequest.builder()
                        .token(token)
                        .userId(user.getId())
                        .username(user.getUsername())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .timestamp(LocalDateTime.now())
                        .build();

                // Tạo headers
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("X-Internal-Request", "true"); // Header để nhận biết internal call
                HttpEntity<TokenBroadcastRequest> entity = new HttpEntity<>(broadcastRequest, headers);

                // Gửi đến tất cả các cổng service có thể (8081-8090, trừ 8080 của service hiện tại)
                for (int port = 8080; port <= 8090; port++) {
                    // Bỏ qua cổng của chính service này (8080)
//                    if (port == 8080) continue;

                    String serviceUrl = "http://localhost:" + port + "/api/internal/receive-token";

                    try {
                        ResponseEntity<String> response = restTemplate.exchange(
                                serviceUrl,
                                HttpMethod.POST,
                                entity,
                                String.class
                        );

                        if (response.getStatusCode().is2xxSuccessful()) {
                            log.info("✅ Token đã được gửi đến service cổng: {}", port);
                        }
                    } catch (Exception e) {
                        // Không log lỗi để tránh spam log file
                        // Service có thể không tồn tại hoặc chưa chạy
                    }
                }

                log.info("✅ Đã hoàn tất gửi token đến các service khác");

            } catch (Exception e) {
                log.error("❌ Lỗi khi gửi token đến các service: {}", e.getMessage());
            }
        });
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request, String createdByRole) {
        // Check permissions
        if (!"ADMIN".equals(createdByRole) && !"STAFF".equals(createdByRole)) {
            throw new RuntimeException("Permission denied");
        }

        // Check duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .fullName(request.getFullName())
                .role(request.getRole() != null ? request.getRole() : "USER")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        Notification noti = new Notification();
        noti.setAccountNumber("");
        noti.setTime(LocalDateTime.now());
        noti.setContent(" Bạn đã tạo tài khoản thành công! ");
        noti.setTitle(" Thông báo tạo tài khoa mới ");
        noti.setUserId(user.getId());
        noti.setStatus(" UNREAD ");
        notiRepository.save(noti);
        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only allow updating specific fields
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getFullName() != null) user.setFullName(request.getFullName());

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        Notification noti = new Notification();
        noti.setAccountNumber("");
        noti.setTime(LocalDateTime.now());
        noti.setContent(" Cập nhật thông tin thành công! ");
        noti.setTitle(" Thông báo cập nhật thông tin ");
        noti.setUserId(user.getId());
        noti.setStatus(" UNREAD ");
        notiRepository.save(noti);
        return mapToResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());

        Notification noti = new Notification();
        noti.setAccountNumber("");
        noti.setTime(LocalDateTime.now());
        noti.setContent(" Đổi mật khẩu thành công! ");
        noti.setTitle(" Thông báo thay đổi thông tin ");
        noti.setUserId(user.getId());
        noti.setStatus(" UNREAD ");
        notiRepository.save(noti);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse changeUserRole(Long id, String role, String changedBy) {
        // Only ADMIN can change roles
        if (!"ADMIN".equals(changedBy)) {
            throw new RuntimeException("Permission denied");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse changeUserStatus(Long id, String status, String changedBy) {
        // Only ADMIN can lock/unlock accounts
        if (!"ADMIN".equals(changedBy)) {
            throw new RuntimeException("Permission denied");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(status);
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    @Override
    public boolean validateUserExists(Long userId) {
        return userRepository.existsById(userId);
    }

    @Override
    public UserResponse getUserInfoForInternal(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    @Override
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // Check duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user with role USER and status ACTIVE
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .fullName(request.getFullName())
                .role("USER") // Default role for self-registration
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Generate reset token (simplified - in production use proper token generation)
        String resetToken = jwtTokenProvider.generateToken(
                new UsernamePasswordAuthenticationToken(user.getUsername(), null)
        );

        // TODO: Send email with reset token (integrate with email service)
        // For now, just log the token (in production, send email)
        System.out.println("Reset token for " + email + ": " + resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Validate token
        if (!jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        // Get username from token
        String username = jwtTokenProvider.getUsernameFromToken(token);

        // Find user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        Notification noti = new Notification();
        noti.setAccountNumber("");
        noti.setTime(LocalDateTime.now());
        noti.setContent(" Đổi mật khẩu thành công! ");
        noti.setTitle(" Thông báo thay đổi thông tin ");
        noti.setUserId(user.getId());
        noti.setStatus(" UNREAD ");
        notiRepository.save(noti);
    }

    @Override
    @Transactional
    public UserResponse updateCurrentUser(String username, UserUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update allowed fields
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            // Check if new email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getFullName() != null) user.setFullName(request.getFullName());

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        Notification noti = new Notification();
        noti.setAccountNumber("");
        noti.setTime(LocalDateTime.now());
        noti.setContent(" Đã thay đổi thông tin người dùng ");
        noti.setTitle(" Thông báo thay đổi thông tin ");
        noti.setUserId(user.getId());
        noti.setStatus(" UNREAD ");
        notiRepository.save(noti);
        return mapToResponse(updatedUser);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}