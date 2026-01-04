package com.example.transaction_service.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Base64;

@Component
//public class UserInterceptor implements HandlerInterceptor {
//
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        // 1. Lấy Header Authorization
//        String authHeader = request.getHeader("Authorization");
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7); // Bỏ chữ "Bearer "
//
//            try {
//                // 2. Giải mã phần Payload của JWT (Phần ở giữa 2 dấu chấm)
//                String[] parts = token.split("\\.");
//                if (parts.length >= 2) { // Token phải có ít nhất header và payload
//                    String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
//
//                    // 3. Đọc JSON để lấy field "sub" (thường là username)
//                    // Nếu bên User Service bạn lưu username ở field khác (vd: "username") thì sửa "sub" thành "username"
//                    JsonNode node = objectMapper.readTree(payload);
//                    String username = "";
//
//                    if (node.has("sub")) {
//                        username = node.get("sub").asText();
//                    } else if (node.has("username")) { // Dự phòng
//                        username = node.get("username").asText();
//                    }
//
//                    // Lưu vào Context để Service dùng
//                    if (!username.isEmpty()) {
//                        UserContext.setUsername(username);
//                        return true;
//                    }
//                }
//            } catch (Exception e) {
//                System.out.println("Lỗi parse token: " + e.getMessage());
//            }
//        }
//
//        // Nếu không có token hoặc token lỗi -> Vẫn cho qua (nhưng UserContext sẽ null)
//        // Service sẽ tự check null và báo lỗi sau.
//        return true;
//    }
//
//    @Override
//    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
//        // Dọn dẹp sau khi request xong để tránh rò rỉ bộ nhớ
//        UserContext.clear();
//    }
//}
public class UserInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // 1. Lấy Header Authorization
        String authHeader = request.getHeader("Authorization");

        // -----------------------------------------------------------
        // 🔥 CỬA HẬU (BACKDOOR) ĐỂ TEST NHANH (KHÔNG CẦN TOKEN)
        // -----------------------------------------------------------
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            // 👇 THAY 'nguyenvana' BẰNG USERNAME CÓ THẬT TRONG DB CỦA BẠN
            String testUser = "hoangjane343";

            System.out.println("⚠️ WARNING: Đang chạy chế độ TEST (Không Token).");
            System.out.println("👉 Tự động gán User: " + testUser);

            UserContext.setUsername(testUser);
            return true; // Cho qua luôn
        }
//         -----------------------------------------------------------


//         2. Logic giải mã Token thật (Khi nào test xong thì dùng lại cái này)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String[] parts = token.split("\\.");
                if (parts.length >= 2) {
                    String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                    JsonNode node = objectMapper.readTree(payload);

                    String username = "";
                    if (node.has("sub")) username = node.get("sub").asText();
                    else if (node.has("username")) username = node.get("username").asText();

                    if (!username.isEmpty()) {
                        UserContext.setUsername(username);
                        return true;
                    }
                }
            } catch (Exception e) {
                System.out.println("Lỗi parse token: " + e.getMessage());
            }
        }

        return true;
    }

    @Override
    public void afterCompletion (HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UserContext.clear();
    }
}