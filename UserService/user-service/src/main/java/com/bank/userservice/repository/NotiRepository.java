package com.bank.userservice.repository;


import com.bank.userservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotiRepository extends JpaRepository<Notification, Long> {

}
