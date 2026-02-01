package com.example.accountService.service;

import com.example.accountService.dto.request.CreateNotificationRequest;

import com.example.accountService.model.Notification;
import com.example.accountService.dto.response.NotificationResponse;
import com.example.accountService.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;


    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    //  Tạo notification (internal call)
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

    //  Lấy danh sách notification theo user
    public List<NotificationResponse> getByUser(int userId) {
        return repository.findByUserIdOrderByTimeDesc(userId)
                .stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .accountNumber(n.getAccountNumber())
                        .content(n.getContent())
                        .status(n.getStatus())
                        .time(n.getTime())
                        .build()
                ).toList();
    }

    //  Đánh dấu đã đọc
    public void markAsRead(Long id) {
        Notification noti = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        noti.setStatus("READ");
        repository.save(noti);
    }
}
