package com.example.transaction_service.repository;

import com.example.transaction_service.entity.Account;
import com.example.transaction_service.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByFromAccountNumber(String AccountNumber);
    List<Transaction> findByToAccountNumber(String AccountNumber);
}