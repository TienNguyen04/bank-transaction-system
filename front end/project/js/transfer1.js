// File: src/main/resources/static/js/transfer.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================================
    // 1. CẤU HÌNH VÀ KIỂM TRA ĐĂNG NHẬP
    // ============================================================
    const token = localStorage.getItem("token");
    const API_BASE_URL = "http://localhost:8082/api/transService-Sang";

    // Nếu chưa đăng nhập, chuyển về trang login
    if (!token) {
        alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login.html";
        return;
    }

    // Header chung cho tất cả request
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Biến lưu số dư tài khoản nguồn để validate
    let currentBalance = 0;

    // ============================================================
    // 2. TỰ ĐỘNG LOAD THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP
    // ============================================================
    const sourceAccInput = document.getElementById('sourceAcc');
    const balanceDiv = document.getElementById('sourceBalance');

    async function loadMyAccount() {
        try {
            if (balanceDiv) {
                balanceDiv.innerText = "⏳ Đang tải thông tin...";
                balanceDiv.style.color = "#666";
            }

            const response = await fetch(`${API_BASE_URL}/my-account`, {
                method: "GET",
                headers: authHeaders
            });

            if (!response.ok) {
                throw new Error("Không thể tải thông tin tài khoản");
            }

            const data = await response.json();
            console.log("✅ Thông tin tài khoản:", data);

            // Điền số tài khoản nguồn
            if (sourceAccInput) {
                sourceAccInput.value = data.accountNumber;
                sourceAccInput.readOnly = true; // Không cho sửa
            }

            // Hiển thị số dư
            if (balanceDiv) {
                const formattedMoney = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(data.balance);

                balanceDiv.innerText = `Số dư: ${formattedMoney}`;
                balanceDiv.style.color = "#0056d6";
                balanceDiv.style.fontWeight = "bold";
            }

            // Lưu số dư để validate sau
            currentBalance = data.balance;

        } catch (error) {
            console.error("❌ Lỗi tải tài khoản:", error);
            if (balanceDiv) {
                balanceDiv.innerText = "❌ Lỗi tải thông tin!";
                balanceDiv.style.color = "red";
            }
            
            // Nếu lỗi 401 (Unauthorized), chuyển về login
            if (error.message.includes("401")) {
                alert("Phiên đăng nhập hết hạn!");
                localStorage.removeItem("token");
                window.location.href = "/login.html";
            }
        }
    }

    // Gọi hàm load thông tin tài khoản
    loadMyAccount();

    // ============================================================
    // 3. KIỂM TRA SỐ DƯ TÀI KHOẢN NGƯỜI NHẬN (Tùy chọn)
    // ============================================================
    const receiverAccInput = document.getElementById('receiverAcc');
    const receiverInfoDiv = document.getElementById('receiverInfo'); // Nếu có trong HTML

    if (receiverAccInput) {
        receiverAccInput.addEventListener('blur', async function() {
            const accountNumber = this.value.trim();

            if (receiverInfoDiv) {
                receiverInfoDiv.innerText = "";
            }

            if (!accountNumber) return;

            // Kiểm tra không được chuyển cho chính mình
            if (accountNumber === sourceAccInput.value) {
                if (receiverInfoDiv) {
                    receiverInfoDiv.innerText = "⚠️ Không thể chuyển cho chính mình!";
                    receiverInfoDiv.style.color = "orange";
                }
                return;
            }

            try {
                if (receiverInfoDiv) {
                    receiverInfoDiv.innerText = "🔍 Đang kiểm tra...";
                    receiverInfoDiv.style.color = "#666";
                }

                const response = await fetch(`${API_BASE_URL}/check-name/${accountNumber}`, {
                    method: "GET",
                    headers: authHeaders
                });

                if (response.ok) {
                    const data = await response.json();
                    if (receiverInfoDiv) {
                        receiverInfoDiv.innerText = `✓ Tìm thấy: ${data.ownerName || 'Tài khoản hợp lệ'}`;
                        receiverInfoDiv.style.color = "green";
                    }
                } else {
                    throw new Error("Không tìm thấy tài khoản");
                }
            } catch (error) {
                console.warn("Lỗi kiểm tra tài khoản:", error);
                if (receiverInfoDiv) {
                    receiverInfoDiv.innerText = "⚠️ Không tìm thấy tài khoản";
                    receiverInfoDiv.style.color = "red";
                }
            }
        });
    }

    // ============================================================
    // 4. XỬ LÝ FORM CHUYỂN TIỀN
    // ============================================================
    const transferForm = document.querySelector('.transfer-form');

    if (transferForm) {
        transferForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Lấy dữ liệu từ form
            const amountInput = document.getElementById('amount');
            const noteInput = document.getElementById('note');
            const amount = parseFloat(amountInput.value);

            // ===== VALIDATION =====
            if (!receiverAccInput.value || !amount) {
                alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            if (amount <= 0) {
                alert("⚠️ Số tiền chuyển phải lớn hơn 0!");
                return;
            }

            if (amount > currentBalance) {
                const formatted = new Intl.NumberFormat('vi-VN').format(currentBalance);
                alert(`⚠️ Số dư không đủ!\n(Số dư hiện tại: ${formatted} đ)`);
                return;
            }

            if (sourceAccInput.value === receiverAccInput.value) {
                alert("⚠️ Không thể chuyển tiền cho chính mình!");
                return;
            }

            // Xác nhận trước khi chuyển
            const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);
            const confirmMsg = `Xác nhận chuyển ${formattedAmount} đ\n` +
                             `Đến TK: ${receiverAccInput.value}\n` +
                             `Nội dung: ${noteInput.value || 'Chuyển tiền nhanh'}`;
            
            if (!confirm(confirmMsg)) {
                return;
            }

            // Tạo dữ liệu gửi đi
            const requestData = {
                fromAccountNumber: sourceAccInput.value,
                toAccountNumber: receiverAccInput.value,
                amount: amount,
                type: "TRANSFER",
                description: noteInput.value || "Chuyển tiền nhanh"
            };

            // Disable nút submit để tránh spam
            const submitBtn = transferForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "⏳ Đang xử lý...";
            }

            try {
                const response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify(requestData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Giao dịch thất bại");
                }

                const data = await response.json();
                
                alert(`✅ Giao dịch thành công!\nMã giao dịch: ${data.id || 'Hoàn tất'}`);
                console.log("✅ Giao dịch thành công:", data);

                // Reload lại trang để cập nhật số dư
                window.location.reload();

            } catch (error) {
                console.error("❌ Lỗi giao dịch:", error);
                alert(`❌ Giao dịch thất bại!\n${error.message}`);

                // Enable lại nút submit
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Xác nhận chuyển";
                }
            }
        });
    }

    // ============================================================
    // 5. FORMAT SỐ TIỀN KHI NHẬP (Tùy chọn - UX tốt hơn)
    // ============================================================
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', function(e) {
            // Chỉ cho phép nhập số
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        amountInput.addEventListener('blur', function(e) {
            const value = parseFloat(this.value);
            if (value) {
                // Có thể thêm format preview nếu muốn
                console.log('Số tiền nhập:', new Intl.NumberFormat('vi-VN').format(value));
            }
        });
    }
});