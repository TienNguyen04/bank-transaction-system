package com.example.NotificationService.controller;

//import com.example.notificationservice.service.NotificationService;
import com.example.NotificationService.dto.CreateNotificationRequest;
import com.example.NotificationService.dto.NotificationResponse;
import com.example.NotificationService.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // 🔒 INTERNAL API (account / saving gọi)
    @PostMapping("/private/create")
    public void create(@RequestBody CreateNotificationRequest request) {
        service.create(request);
    }

    // 👤 USER API
    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return service.getByUser(userId);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
    }
}
