// Dữ liệu số dư và tên người nhận theo STK
const accountData = {
    "0123456789": { balance: 12000000, name: "Nguyễn Văn A" },
    "0987654321": { balance: 5000000, name: "Nguyễn Văn B" }
};

const sourceAcc = document.getElementById("sourceAcc");
const sourceBalance = document.getElementById("sourceBalance");
const receiverAcc = document.getElementById("receiverAcc");
const receiverName = document.getElementById("receiverName");

// Cập nhật số dư khi chọn tài khoản nguồn
sourceAcc.addEventListener("change", function () {
    const selected = this.value;
    sourceBalance.textContent = accountData[selected].balance.toLocaleString() + " VND";
});

// Cập nhật tên người nhận khi nhập số tài khoản
receiverAcc.addEventListener("input", function () {
    const val = this.value;
    if (accountData[val]) {
        receiverName.value = accountData[val].name;
    } else {
        receiverName.value = "";
    }
});

// Tính phí giao dịch (ví dụ 0.1% tổng số tiền)
// const amountInput = document.getElementById("amount");
// const feeDiv = document.getElementById("fee");

// amountInput.addEventListener("input", function () {
//     const val = Number(this.value);
//     if (val > 0) {
//         const fee = Math.round(val * 0.001);
//         feeDiv.textContent = fee.toLocaleString() + " VND";
//     } else {
//         feeDiv.textContent = "0đ";
//     }
// });
// File: src/main/resources/static/js/transfer.js

document.addEventListener('DOMContentLoaded', function() {


const sourceAccInput = document.getElementById('sourceAcc');
    const balanceDiv = document.getElementById('sourceBalance');

    if (sourceAccInput && balanceDiv) {
        // Dùng sự kiện 'blur': Khi nhập xong và bấm ra ngoài thì mới gọi API
        sourceAccInput.addEventListener('blur', function() {
            const accountNumber = this.value.trim();

            // Reset hiển thị
            balanceDiv.innerText = "Đang kiểm tra...";
            balanceDiv.style.color = "#666";

            if (!accountNumber) {
                balanceDiv.innerText = "—";
                return;
            }

            // Gọi API lấy số dư (Port 8082)
            fetch(`http://localhost:8082/api/transactions/balance/${accountNumber}`)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error("Không tìm thấy");
                })
                .then(data => {
                    // data.balance là số tiền trả về từ DB
                    const formattedMoney = new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(data.balance);

                    balanceDiv.innerText = "Số dư: " + formattedMoney;
                    balanceDiv.style.color = "#0056d6"; // Màu xanh
                    balanceDiv.style.fontWeight = "bold";
                })
                .catch(err => {
                    console.error("Lỗi lấy số dư:", err);
                    balanceDiv.innerText = "Không tìm thấy TK";
                    balanceDiv.style.color = "red";
                });
        });
    }
    // Tìm form chuyển khoản trong HTML
    const transferForm = document.querySelector('.transfer-form');

    if (transferForm) {
        transferForm.addEventListener('submit', function(event) {
            // 1. Chặn hành động load lại trang mặc định
            event.preventDefault();

            // 2. Lấy dữ liệu từ các ô input (Dựa theo ID trong file HTML của bạn)
            const sourceAccInput = document.getElementById('sourceAcc');
            const receiverAccInput = document.getElementById('receiverAcc');
            const amountInput = document.getElementById('amount');
            const noteInput = document.getElementById('note');

            // Kiểm tra dữ liệu có trống không
            if (!sourceAccInput.value || !receiverAccInput.value || !amountInput.value) {
                alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
                return;
            }

            // 3. Tạo cục dữ liệu JSON để gửi đi (Khớp với DTO Java)
            const requestData = {
                fromAccountNumber: sourceAccInput.value,  // String
                toAccountNumber: receiverAccInput.value,  // String
                amount: parseFloat(amountInput.value),    // Số tiền
                type: "TRANSFER",                         // Mặc định là Chuyển khoản
                description: noteInput.value || "Chuyển tiền nhanh"
            };

            // 4. Gọi API xuống Backend (Cổng 8082 như đã cấu hình)
            fetch('http://localhost:8082/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                // Nếu Backend trả về OK (200)
                if (response.ok) {
                    return response.json();
                } else {
                    // Nếu lỗi (ví dụ: Không đủ tiền)
                    return response.text().then(text => { throw new Error(text) });
                }
            })
            .then(data => {
                // Xử lý khi thành công
                alert("✅ Giao dịch thành công!\nMã giao dịch: " + data.id);
                console.log("Success:", data);
                // Reset form sau khi chuyển xong
                transferForm.reset();
            })
            .catch(error => {
                // Xử lý khi lỗi
                alert("❌ Giao dịch thất bại:\n" + error.message);
                console.error('Error:', error);
            });
        });
    }
});

