package com.example.transaction_service.repository;

import com.example.transaction_service.entity.Account;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);
    // Tìm tài khoản bằng Số tài khoản (String) và KHÓA dòng đó lại
    @Query(value = "SELECT * FROM account_service.accounts WHERE account_number = :accountNumber FOR UPDATE", nativeQuery = true)
    Optional<Account> findByAccountNumberForUpdate(@Param("accountNumber") String accountNumber);

    @Query(value = """
        SELECT a.* FROM account_service.accounts a
        JOIN user_service.users u ON a.user_id = u.id
        WHERE u.username = :username
        LIMIT 1
    """, nativeQuery = true)
    Optional<Account> findAccountByUsername(@Param("username") String username);
    @Query(value = """
        SELECT u.full_name FROM user_service.users u
        JOIN account_service.accounts a ON a.user_id = u.id
        WHERE a.account_number = :accountNumber
    """, nativeQuery = true)
    String findUserNameByAccountNumber(@Param("accountNumber") String accountNumber);
}
