package com.example.transaction_service.repository;

import com.example.transaction_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotiRepository extends JpaRepository<Notification, Long> {

}
