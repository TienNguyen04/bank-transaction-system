package com.example.NotificationService.controller;

//import com.example.notificationservice.service.NotificationService;
import com.example.NotificationService.dto.CreateNotificationRequest;
import com.example.NotificationService.dto.NotificationResponse;
import com.example.NotificationService.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("noti")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }
    @GetMapping("/listnoti")
    public List<NotificationResponse> getNotiList(
            Authentication authentication
    ) {
        int userId = (int) authentication.getPrincipal();
        return service.getByUser(userId);
    }
    // 🔒 INTERNAL API (account / saving gọi)
    @PostMapping("/private/create")
    public void create(@RequestBody CreateNotificationRequest request) {
        service.create(request);
    }

    // 👤 USER API
    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            @RequestHeader("X-User-Id") int userId
    ) {
        return service.getByUser(userId);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable long id) {
        service.markAsRead(id);
    }
}
