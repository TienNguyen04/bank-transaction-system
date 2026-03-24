package com.example.accountService.config;

import jakarta.servlet.http.HttpServletRequest; // Lưu ý dùng jakarta cho Spring Boot 3
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Collections;

@Configuration
public class RestConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // Tạo một Interceptor tự động nhét Token vào mọi request gửi đi
        ClientHttpRequestInterceptor interceptor = (request, body, execution) -> {

            // 1. Lấy thông tin của Request đang gửi đến Account Service
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            if (attributes != null) {
                HttpServletRequest servletRequest = attributes.getRequest();

                // 2. Trích xuất chữ "Bearer eyJhb..." từ Header
                String token = servletRequest.getHeader(HttpHeaders.AUTHORIZATION);

                // 3. Nếu có Token, tự động gắn nó vào Header của request sắp gửi đi
                if (token != null) {
                    request.getHeaders().add(HttpHeaders.AUTHORIZATION, token);
                }
            }

            // 4. Cho phép request tiếp tục chạy
            return execution.execute(request, body);
        };

        // Gắn anh bảo vệ này vào RestTemplate
        restTemplate.setInterceptors(Collections.singletonList(interceptor));

        return restTemplate;
    }
}