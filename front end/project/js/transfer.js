const base_api ="http://localhost:8082/transService-Sang/api"
const accountlist_api ="http://localhost:8080/accountService/account/my-accounts";
 document.addEventListener("DOMContentLoaded",()=>{
        loadAccounts();
       
       //432493497377
   const transferForm = document.getElementById('transferForm');
    if (transferForm) {
        transferForm.addEventListener('submit', handleTransferSubmit);
    }
 })
 

 let account;
 //hiển thị tài khoản
async function loadAccounts() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const res = await fetch(accountlist_api, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (res.status === 401 || res.status === 403) {
        alert("Phiên đăng nhập hết hạn");
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    let accounts = await res.json();
    const paymentAccounts = accounts.filter(acc =>
        acc.status === "ACTIVE" &&
        acc.accountType === "PAYMENT"
    );
    if (paymentAccounts.length === 0) {
        select.innerHTML = `<option value="">Không có tài khoản thanh toán</option>`;
        return;
    }
    const paymentAccount = paymentAccounts[0];
    document.getElementById("sourceAcc").value = paymentAccount.accountNumber;
    document.getElementById("sourceBalance").innerText =
        "Số dư: " + new Intl.NumberFormat('vi-VN').format(paymentAccount.balance) + " đ";
}
//hiển thị người nhận
async function loadReciveAccount(){
    const token = localStorage.getItem("token");
    const receiverAccInput = document.getElementById("receiverAcc").value.trim();
    if (!receiverAccInput) return;

    // Reset tên cũ trước khi tìm mới
    const nameDisplay = document.getElementById("receiverName"); // Sửa lại đúng ID
    if(nameDisplay) nameDisplay.value = "Đang kiểm tra...";
    try{
        const res = await fetch (
            `http://localhost:8080/accountService/account/check-name/${receiverAccInput}`,
            {
                method:"GET",
                headers: 
                {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            }
            
        )
        if (!res.ok) throw new Error("không tìm thấy người dùng");
        let accountName = await res.json(); 
        
        // Hiển thị tên
        if(nameDisplay) {
            nameDisplay.value = accountName.fullName;
            nameDisplay.style.color = "blue";
        }

    } catch (err){
        console.error(err);
        if(nameDisplay) {
            nameDisplay.value = "Không tìm thấy người nhận";
            nameDisplay.style.color = "red";
    }
}
}
// async function chuyentien() {
//     const token = localStorage.getItem("token");
//     const transferForm = document.querySelector('.transfer-form');

//     if (transferForm) {
//         transferForm.addEventListener('submit', function(event) {
//             // 1. Chặn hành động load lại trang mặc định
//             event.preventDefault();

//             // 2. Lấy dữ liệu từ các ô input (Dựa theo ID trong file HTML của bạn)
//             const sourceAccInput = document.getElementById('sourceAcc');
//             const receiverAccInput = document.getElementById('receiverAcc');
//             const amountInput = document.getElementById('amount');
//             const noteInput = document.getElementById('note');

//             // Kiểm tra dữ liệu có trống không
//             if (!sourceAccInput.value || !receiverAccInput.value || !amountInput.value) {
//                 alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
//                 return;
//             }

//             // 3. Tạo cục dữ liệu JSON để gửi đi (Khớp với DTO Java)
//             const requestData = {
//                 fromAccountNumber: sourceAccInput.value,  // String
//                 toAccountNumber: receiverAccInput.value,  // String
//                 amount: parseFloat(amountInput.value),    // Số tiền
//                 type: "TRANSFER",                         // Mặc định là Chuyển khoản
//                 description: noteInput.value || "Chuyển tiền nhanh"
//             };

//             // 4. Gọi API xuống Backend (Cổng 8082 như đã cấu hình)
//             fetch('http://localhost:8082/api/transService-Sang/chuyentien', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(requestData)
//             })
//             .then(response => {
//                 // Nếu Backend trả về OK (200)
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     // Nếu lỗi (ví dụ: Không đủ tiền)
//                     return response.text().then(text => { throw new Error(text) });
//                 }
//             })
//             .then(data => {
//                 // Xử lý khi thành công
//                 alert("✅ Giao dịch thành công!\nMã giao dịch: " + data.id);
//                 console.log("Success:", data);
//                 // Reset form sau khi chuyển xong
//                 transferForm.reset();
//             })
//             .catch(error => {
//                 // Xử lý khi lỗi
//                 alert("❌ Giao dịch thất bại:\n" + error.message);
//                 console.error('Error:', error);
//             });
//         });
//     }
    
// }
async function handleTransferSubmit(event) {
    // QUAN TRỌNG: Chặn reload trang
    event.preventDefault(); 

    const token = localStorage.getItem("token");
    const sourceAccInput = document.getElementById('sourceAcc');
    const receiverAccInput = document.getElementById('receiverAcc');
    const amountInput = document.getElementById('amount');
    const noteInput = document.getElementById('note');
    const transferForm = document.getElementById('transferForm');
    const submitBtn = transferForm.querySelector('button[type="submit"]');

    // Validate cơ bản
    if (!sourceAccInput.value || !receiverAccInput.value || !amountInput.value) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
    }

    // Disable nút để tránh click nhiều lần
    if(submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    }

    const requestData = {
        fromAccountNumber: sourceAccInput.value,
        toAccountNumber: receiverAccInput.value,
        amount: parseFloat(amountInput.value),
        type: "TRANSFER",
        description: noteInput.value || "Chuyển tiền nhanh"
    };

    try {
        const response = await fetch('http://localhost:8082/transService-Sang/api/chuyentien', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const data = await response.json();
            alert("✅ Giao dịch thành công!\nMã giao dịch: " + (data.id || "Hoàn tất"));
            transferForm.reset(); // Xóa trắng form
            loadAccounts(); // Load lại số dư mới
            
            // Reset ô tên người nhận
            document.getElementById("receiverName").value = "";
        } else {
            const text = await response.text();
            throw new Error(text);
        }

    } catch (error) {
        alert("❌ Giao dịch thất bại:\n" + error.message);
        console.error('Error:', error);
    } finally {
        // Mở lại nút button dù thành công hay thất bại
        if(submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Xác nhận chuyển tiền';
        }
    }
}

// Biến lưu trữ dữ liệu tạm thời
// let pendingRequestData = null;

// document.addEventListener("DOMContentLoaded", () => {
//     loadAccounts();
//     const transferForm = document.getElementById('transferForm');
//     if (transferForm) {
//         transferForm.addEventListener('submit', handleTransferSubmit);
//     }

//     // Gán sự kiện cho các nút trong Modal
//     document.getElementById('cancelBtn').onclick = closeModal;
//     document.getElementById('finalConfirmBtn').onclick = executeTransfer;
// });

// // 1. Khi bấm nút "Xác nhận chuyển tiền" trên Form chính
// async function handleTransferSubmit(event) {
//     event.preventDefault();

//     // Lấy dữ liệu từ form
//     const sourceAcc = document.getElementById('sourceAcc').value;
//     const receiverAcc = document.getElementById('receiverAcc').value;
//     const amount = document.getElementById('amount').value;
//     const note = document.getElementById('note').value;

//     if (!sourceAcc || !receiverAcc || !amount) {
//         alert("Vui lòng điền đầy đủ thông tin!");
//         return;
//     }

//     // Lưu dữ liệu vào biến tạm
//     pendingRequestData = {
//         fromAccountNumber: sourceAcc,
//         toAccountNumber: receiverAcc,
//         amount: parseFloat(amount),
//         type: "TRANSFER",
//         description: note || "Chuyển tiền nhanh"
//     };

//     // Hiển thị Modal nhập mật khẩu
//     document.getElementById('passwordModal').style.display = 'flex';
// }

// // 2. Khi bấm "Xác nhận" bên trong Modal
// async function executeTransfer() {
//     const password = document.getElementById('confirmPassword').value;
//     const token = localStorage.getItem("token");
//     const submitBtn = document.querySelector('.confirm-btn'); // Nút ngoài form chính
//     const finalConfirmBtn = document.getElementById('finalConfirmBtn');

//     if (!password) {
//         alert("Vui lòng nhập mật khẩu xác nhận!");
//         return;
//     }

//     // Thêm mật khẩu vào requestData (Nếu Backend của bạn yêu cầu verify password)
//     // pendingRequestData.password = password; 

//     try {
//         // Disable nút trong modal để tránh click trùng
//         finalConfirmBtn.disabled = true;
//         finalConfirmBtn.innerText = "Đang xác thực...";

//         const response = await fetch('http://localhost:8082/transService-Sang/api/chuyentien', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + token
//             },
//             body: JSON.stringify(pendingRequestData)
//         });

//         if (response.ok) {
//             const data = await response.json();
//             alert("✅ Giao dịch thành công!");
//             closeModal();
//             document.getElementById('transferForm').reset();
//             loadAccounts();
//         } else {
//             const text = await response.text();
//             throw new Error(text);
//         }
//     } catch (error) {
//         alert("❌ Giao dịch thất bại: " + error.message);
//     } finally {
//         finalConfirmBtn.disabled = false;
//         finalConfirmBtn.innerText = "Xác nhận";
//     }
// }

// function closeModal() {
//     document.getElementById('passwordModal').style.display = 'none';
//     document.getElementById('confirmPassword').value = ''; // Xóa mật khẩu đã nhập
//     pendingRequestData = null;
// }