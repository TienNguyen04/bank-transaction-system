package com.example.accountService.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class EncodePass {

    public static void main(String[] args) {

        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "12345";

        String hash = encoder.encode(rawPassword);

        System.out.println("Mật khẩu gốc: " + rawPassword);
        System.out.println("Mật khẩu đã mã hóa: " + hash);

        boolean check = encoder.matches("12345", hash);
        System.out.println("Khớp mật khẩu: " + check);
    }
}