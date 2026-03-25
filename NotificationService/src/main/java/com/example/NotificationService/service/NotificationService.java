package com.example.NotificationService.service;

import com.example.NotificationService.dto.CreateNotificationRequest;

import com.example.NotificationService.enity.Notification;
import com.example.NotificationService.dto.NotificationResponse;
import com.example.NotificationService.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;


    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    // 🔔 Tạo notification (internal call)
    public void create(CreateNotificationRequest request) {

        Notification noti = Notification.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .accountNumber(request.getAccountNumber())
                .content(request.getContent())
                .status("UNREAD")
                .time(LocalDateTime.now())
                .build();
        repository.save(noti);
    }

    // 📥 Lấy danh sách notification theo user
    public List<NotificationResponse> getByUser(int userId) {

        return repository.findByUserId(userId)
                .stream()
                .map(n -> NotificationResponse.builder()
                        .title(n.getTitle())
                        .content(n.getContent())
                        .status(n.getStatus())
                        .time(n.getTime())
                        .build()
                ).toList();
    }

    // ✅ Đánh dấu đã đọc
//    public void markAsRead(int id) {
//        Notification noti = repository.findByUserId(id)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//        noti.setStatus("READ");
//        repository.save(noti);
//    }
}
