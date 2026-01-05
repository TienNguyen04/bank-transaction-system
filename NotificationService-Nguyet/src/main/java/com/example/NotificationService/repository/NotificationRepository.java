package com.example.NotificationService.repository;

import com.example.NotificationService.enity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByTimeDesc(Long userId);
}
