package com.example.transaction_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private UserInterceptor userInterceptor;

    // 1. CẤU HÌNH CORS (Bắt buộc phải có để Frontend gọi được)
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOriginPatterns("*")
//                //.allowedOrigins("http://localhost:8082") // Thay đúng cổng Frontend hộ bạn
//                // Hoặc dùng .allowedOriginPatterns("*") nếu muốn mở hết
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*") // Cho phép gửi Token (Authorization)
//                .allowCredentials(true);
//    }

    // 2. ĐĂNG KÝ INTERCEPTOR (Để chặn và đọc Token)
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userInterceptor)
                .addPathPatterns("/api/**") // Áp dụng cho tất cả API
                .excludePathPatterns("/api/auth/login", "/api/auth/register"); // TRỪ API Đăng nhập/Đăng ký ra
    }
}