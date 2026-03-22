package com.example.transaction_service.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.lang.Nullable; // Import để xử lý cảnh báo vàng
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Base64;

@Component
public class UserInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    // Thêm @Nullable vào handler để tránh cảnh báo IntelliJ
    public boolean preHandle(HttpServletRequest request, @NonNull HttpServletResponse response, @Nullable Object handler) {

        // 1. Lấy Header Authorization từ request gửi lên
        String authHeader = request.getHeader("Authorization");

        // 2. Kiểm tra xem có token hợp lệ (Bearer ...) không
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Cắt bỏ chữ "Bearer " để lấy mã token

            try {
                // 3. Giải mã phần Payload của Token (Base64)
                String[] parts = token.split("\\.");
                if (parts.length >= 2) {
                    String payload = new String(Base64.getUrlDecoder().decode(parts[1]));

                    // 4. Đọc JSON để lấy thông tin user
                    JsonNode node = objectMapper.readTree(payload);
                    String username = "";

                    // Kiểm tra field 'sub' (chuẩn JWT) hoặc 'username'
                    if (node.has("sub")) {
                        username = node.get("sub").asText();
                    } else if (node.has("username")) {
                        username = node.get("username").asText();
                    }

                    // 5. Nếu lấy được username -> Lưu vào Context để dùng xuyên suốt request
                    if (!username.isEmpty()) {
                        UserContext.setUsername(username);
                        return true;
                    }
                }
            } catch (Exception e) {
                // Chỉ in lỗi ra console để debug, không chặn request (để Controller xử lý lỗi 401/403 sau)
                System.out.println("❌ Lỗi giải mã token: " + e.getMessage());
            }
        }

        // Nếu không có token hoặc token sai -> Vẫn cho qua (return true)
        // Nhưng UserContext sẽ rỗng. Các hàm trong Service sẽ tự kiểm tra và báo lỗi "Chưa đăng nhập".
        return true;
    }

    @Override
    // Thêm @Nullable vào handler và ex
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, @Nullable Exception ex) {
        // Dọn dẹp dữ liệu user sau khi request kết thúc để giải phóng bộ nhớ
        UserContext.clear();
    }
}