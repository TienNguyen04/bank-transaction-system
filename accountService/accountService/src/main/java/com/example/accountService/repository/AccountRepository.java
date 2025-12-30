package com.example.accountService.repository;

import com.example.accountService.model.Accounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface AccountRepository extends JpaRepository<Accounts, Integer> {
    Optional<Accounts> findByAccountNumber(String account_number);
    List<Accounts> findByUserId(long user_id);
    //Optional<Accounts> createAccount(Accounts accounts);

    boolean existsByAccountNumber(String accountNumber);
}
