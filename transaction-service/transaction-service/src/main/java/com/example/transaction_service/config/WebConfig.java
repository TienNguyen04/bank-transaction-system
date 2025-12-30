package com.example.transaction_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private UserInterceptor userInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Dòng này rất quan trọng: Nó kích hoạt Interceptor cho các link /api/...
        registry.addInterceptor(userInterceptor).addPathPatterns("/api/**");
    }
}