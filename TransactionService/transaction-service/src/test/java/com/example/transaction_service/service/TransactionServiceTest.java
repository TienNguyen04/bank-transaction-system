package com.example.transaction_service.service;

import com.example.transaction_service.config.UserContext;
import com.example.transaction_service.dto.TransactionRequest;
import com.example.transaction_service.entity.Account;
import com.example.transaction_service.entity.Transaction;
import com.example.transaction_service.repository.AccountRepository;
import com.example.transaction_service.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Account fromAccount;
    private Account toAccount;

    // Giả định Enum của bạn tên là TransactionType (hoặc tương tự)
    // Nếu bạn đang dùng Enum nội bộ trong class khác, hãy import đúng đường dẫn
    enum TransactionType { TRANSFER, DEPOSIT, WITHDRAW }

    @BeforeEach
    void setUp() {
        // Setup dữ liệu mẫu trước mỗi test case
        fromAccount = new Account();
        fromAccount.setId(1L);
        fromAccount.setAccountNumber("111111");
        fromAccount.setBalance(new BigDecimal("500000"));
        fromAccount.setUserId(100);

        toAccount = new Account();
        toAccount.setId(2L);
        toAccount.setAccountNumber("222222");
        toAccount.setBalance(new BigDecimal("100000"));
        toAccount.setUserId(200);
    }

    @Test
    void createTransaction_Transfer_Success() {
        // Arrange
        TransactionRequest request = new TransactionRequest();
        // Giả sử request có method setType nhận enum
        // request.setType(TransactionType.TRANSFER);
        request.setToAccountNumber("222222");
        request.setAmount(new BigDecimal("100000"));
        request.setDescription("Chuyen tien test");

        // Mock Static method UserContext
        try (MockedStatic<UserContext> mockedUserContext = mockStatic(UserContext.class)) {
            mockedUserContext.when(UserContext::getUsername).thenReturn("john_doe");

            // Mock kết quả trả về từ DB
            when(accountRepository.findAccountByUsername("john_doe")).thenReturn(Optional.of(fromAccount));
            when(accountRepository.findByAccountNumber("222222")).thenReturn(Optional.of(toAccount));
            when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArguments()[0]);

            // Act
            Transaction result = transactionService.createTransaction(request);

            // Assert
            assertNotNull(result);
            assertEquals("SUCCESS", result.getStatus());
            assertEquals(new BigDecimal("400000"), fromAccount.getBalance()); // 500k - 100k
            assertEquals(new BigDecimal("200000"), toAccount.getBalance());   // 100k + 100k

            // Verify các hàm save đã được gọi
            verify(accountRepository, times(1)).save(fromAccount);
            verify(accountRepository, times(1)).save(toAccount);
            verify(transactionRepository, times(1)).save(any(Transaction.class));
        }
    }

    @Test
    void createTransaction_Transfer_Fail_InsufficientBalance() {
        // Arrange
        TransactionRequest request = new TransactionRequest();
        // request.setType(TransactionType.TRANSFER);
        request.setToAccountNumber("222222");
        request.setAmount(new BigDecimal("600000")); // Lớn hơn số dư 500k

        try (MockedStatic<UserContext> mockedUserContext = mockStatic(UserContext.class)) {
            mockedUserContext.when(UserContext::getUsername).thenReturn("john_doe");
            when(accountRepository.findAccountByUsername("john_doe")).thenReturn(Optional.of(fromAccount));
            when(accountRepository.findByAccountNumber("222222")).thenReturn(Optional.of(toAccount));

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                transactionService.createTransaction(request);
            });

            assertEquals("Số dư không đủ", exception.getMessage());

            // Verify rằng tiền KHÔNG bị lưu thay đổi
            verify(accountRepository, never()).save(fromAccount);
            verify(transactionRepository, never()).save(any(Transaction.class));
        }
    }

    @Test
    void createTransaction_Transfer_Fail_SelfTransfer() {
        // Arrange
        TransactionRequest request = new TransactionRequest();
        // request.setType(TransactionType.TRANSFER);
        request.setToAccountNumber("111111"); // Chuyển cho chính mình
        request.setAmount(new BigDecimal("50000"));

        try (MockedStatic<UserContext> mockedUserContext = mockStatic(UserContext.class)) {
            mockedUserContext.when(UserContext::getUsername).thenReturn("john_doe");
            when(accountRepository.findAccountByUsername("john_doe")).thenReturn(Optional.of(fromAccount));
            when(accountRepository.findByAccountNumber("111111")).thenReturn(Optional.of(fromAccount));

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                transactionService.createTransaction(request);
            });

            assertEquals("Không thể tự chuyển tiền cho chính mình", exception.getMessage());
        }
    }

    @Test
    void getAccountName_Success() {
        // Arrange
        String accountNumber = "111111";
        when(accountRepository.findUserNameByAccountNumber(accountNumber)).thenReturn("Nguyen Van A");

        // Act
        String result = transactionService.getAccountName(accountNumber);

        // Assert
        assertEquals("Nguyen Van A", result);
    }

    @Test
    void getAccountName_Fail_NotFound() {
        // Arrange
        String accountNumber = "999999";
        when(accountRepository.findUserNameByAccountNumber(accountNumber)).thenReturn(null);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.getAccountName(accountNumber);
        });

        assertEquals("Tài khoản không tồn tại hoặc chưa có tên chủ sở hữu", exception.getMessage());
    }

    @Test
    void getAccountBalance_Success() {
        // Arrange
        String accountNumber = "111111";
        when(accountRepository.findByAccountNumber(accountNumber)).thenReturn(Optional.of(fromAccount));

        // Act
        BigDecimal balance = transactionService.getAccountBalance(accountNumber);

        // Assert
        assertEquals(new BigDecimal("500000"), balance);
    }
}