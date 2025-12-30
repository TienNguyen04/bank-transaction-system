package com.example.SavingService.repository;

import com.example.SavingService.enity.Accounts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavingRepository extends JpaRepository<Accounts, Long> {

    Optional<Accounts> findByAccountNumber(String accountNumber);
    List<Accounts> findByUserId(int userId);
}
