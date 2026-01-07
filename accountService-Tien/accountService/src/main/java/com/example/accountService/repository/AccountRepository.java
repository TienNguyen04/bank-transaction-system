package com.example.accountService.repository;

import com.example.accountService.model.Accounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface AccountRepository extends JpaRepository<Accounts, Integer> {
    Optional<Accounts> findByAccountNumber(String account_number);
    List<Accounts> findByUserId(int user_id);
    Accounts findByUserIdAndAccountType(int user_id, String account_type);
    //Optional<Accounts> createAccount(Accounts accounts);
    //Accounts findUserNameByAccountNumber(String account_number);
    boolean existsByAccountNumber(String accountNumber);
    @Query(value = "SELECT * FROM account_service.accounts WHERE account_number = :accountNumber FOR UPDATE", nativeQuery = true)
    Optional<Accounts> findByAccountNumberForUpdate(@Param("accountNumber") String accountNumber);

    @Query(value = """
        SELECT a.* FROM account_service.accounts a
        JOIN user_service.users u ON a.user_id = u.id
        WHERE u.username = :username
        LIMIT 1
    """, nativeQuery = true)
    Optional<Accounts> findAccountByUsername(@Param("username") String username);
    @Query(value = """
        SELECT u.full_name FROM user_service.users u
        JOIN account_service.accounts a ON a.user_id = u.id
        WHERE a.account_number = :accountNumber
    """, nativeQuery = true)
    String findUserNameByAccountNumber(@Param("accountNumber") String accountNumber);
}
