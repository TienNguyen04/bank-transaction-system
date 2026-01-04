package com.example.transaction_service.service;

import com.example.transaction_service.dto.TransactionRequest;
import com.example.transaction_service.entity.Account;
import com.example.transaction_service.entity.Transaction;
import com.example.transaction_service.repository.AccountRepository;
import com.example.transaction_service.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.transaction_service.config.UserContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional(rollbackFor = Exception.class)
    public Transaction createTransaction(TransactionRequest request) {
        String currentUsername = UserContext.getUsername();
        // 1. TÌM TÀI KHOẢN TỪ SỐ TÀI KHOẢN (STRING)
        Account fromAccount = null;
        if (currentUsername == null || currentUsername.isEmpty()) {
            throw new RuntimeException("Bạn chưa đăng nhập hoặc Token không hợp lệ!");
        }
        Account loggedInAccount = accountRepository.findAccountByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản của user: " + currentUsername));
        Account toAccount = null;

        // 2. XỬ LÝ TIỀN NONG
        switch (request.getType()) {
            case TRANSFER:
                // --- SỬA LỖI TẠI ĐÂY: Gán tài khoản nguồn là chính chủ ---
                fromAccount = loggedInAccount;

                // Tìm tài khoản đích
                toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                        .orElseThrow(() -> new RuntimeException("Tài khoản nhận không tồn tại"));

                // Validate tự chuyển cho mình
                if (fromAccount.getId().equals(toAccount.getId())) {
                    throw new RuntimeException("Không thể tự chuyển tiền cho chính mình");
                }
                break;

            case DEPOSIT:
                toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                        .orElseThrow(() -> new RuntimeException("Tài khoản nhận không tồn tại"));
                break;

            case WITHDRAW:
                fromAccount = loggedInAccount;
                break;
        }

        if (fromAccount != null) {
            // Check số dư
            if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException("Số dư không đủ");
            }
            // Trừ tiền
            fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
            accountRepository.save(fromAccount);
        }

        if (toAccount != null) {
            // Cộng tiền
            toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
            accountRepository.save(toAccount);
        }

        // 3. LƯU LỊCH SỬ
        Transaction tx = new Transaction();
        tx.setFromAccount(fromAccount); // Hibernate tự lấy ID của account này lưu vào DB
        tx.setToAccount(toAccount);

        if (fromAccount != null) {
            tx.setFromAccountNumber(fromAccount.getAccountNumber());
        }
        if (toAccount != null) {
            tx.setToAccountNumber(toAccount.getAccountNumber());
        }

        tx.setAmount(request.getAmount());
        tx.setType(request.getType().name());
        tx.setDescription(request.getDescription());
        tx.setStatus("SUCCESS");

        return transactionRepository.save(tx);
    }
    public String getAccountName(String accountNumber) {
        // 1. In ra xem nhận được số tài khoản gì (Kiểm tra thừa khoảng trắng)
        System.out.println("DEBUG: Đang tìm STK = [" + accountNumber + "]");

        String fullName = accountRepository.findUserNameByAccountNumber(accountNumber.trim());
        if (fullName == null) {
            throw new RuntimeException("Tài khoản không tồn tại hoặc chưa có tên chủ sở hữu");
        }
        System.out.println("DEBUG: Đã tìm thấy tên: " + fullName);
        return fullName;
    }

    public java.math.BigDecimal getAccountBalance(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber.trim())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        return account.getBalance();
    }

//    public java.util.List<Transaction> getMyTransactionHistory() {
//        // 1. Lấy tên người đang đăng nhập từ Token
//        String currentUsername = UserContext.getUsername();
//        if (currentUsername == null || currentUsername.isEmpty()) {
//            throw new RuntimeException("Bạn chưa đăng nhập!");
//        }
//
//        // 2. Tìm Account của người này
//        Account myAccount = accountRepository.findAccountByUsername(currentUsername)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản của user: " + currentUsername));
//
//        // 3. Gọi Repository để lấy lịch sử
//        // Truyền myAccount vào cả 2 vị trí (tìm xem mình là người gửi HOẶC mình là người nhận)
//        return transactionRepository.findByFromAccountOrToAccountOrderByIdDesc(myAccount, myAccount);
//    }
    public List<Transaction> getMyTransactionHistory(Long userId) {

    }
    public Account getMyAccountInfo() {
        // 1. Lấy user từ Token/Context
        String currentUsername = UserContext.getUsername();
        if (currentUsername == null || currentUsername.isEmpty()) {
            throw new RuntimeException("Bạn chưa đăng nhập!");
        }

        // 2. Tìm Account của user đó
        return accountRepository.findAccountByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản của user: " + currentUsername));
    }
}
