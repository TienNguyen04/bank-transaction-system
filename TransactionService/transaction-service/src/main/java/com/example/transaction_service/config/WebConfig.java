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

     //1. CẤU HÌNH CORS (Bắt buộc phải có để Frontend gọi được)
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//
//                .allowedOrigins("http://127.0.0.1:5500") // Thay đúng cổng Frontend hộ bạn
//                .allowedOriginPatterns("*")
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*") // Cho phép gửi Token (Authorization)
//                .allowCredentials(true);
//    }
//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         registry.addMapping("/**")
//                 //.allowedOrigins("http://localhost:8082", "http://127.0.0.1:5500") // Chỉ định rõ origin
//                 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                 .allowedOriginPatterns("*")
//                 .allowedHeaders("*")
//                 .allowCredentials(true)
//                 .maxAge(3600); // Cache preflight request trong 1 giờ
//     }

    // 2. ĐĂNG KÝ INTERCEPTOR (Để chặn và đọc Token)
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userInterceptor)
                .addPathPatterns("/api/**") // Áp dụng cho tất cả API
                .excludePathPatterns("/api/auth/login", "/api/auth/register"); // TRỪ API Đăng nhập/Đăng ký ra
    }
}