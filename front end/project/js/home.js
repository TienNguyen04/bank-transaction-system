// =========================
// ẨN / HIỆN SỐ DƯ
// =========================

const toggleBtn = document.getElementById("toggleMoney");
//const balanceText = document.getElementById("balance");
const account_url ="http://localhost:8080/accountService/account";
const accountlist_api ="http://localhost:8080/accountService/account/my-accounts";
const token = localStorage.getItem("token");
// if (toggleBtn && balanceText) {
//     toggleBtn.addEventListener("click", () => {
//         const isBlur = balanceText.classList.toggle("blurred");

//         if (isBlur) {
//             toggleBtn.classList.replace("fa-eye-slash", "fa-eye");
//         } else {
//             toggleBtn.classList.replace("fa-eye", "fa-eye-slash");
//         }
//     });
// }
async function loadUsser() {
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
    const res1 = await fetch (
            `http://localhost:8080/accountService/account/check-name/${paymentAccount.accountNumber}`,
            {
                method:"GET",
                headers: 
                {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            }
            
        )
    const paymentAcc = await res1.json();
    document.getElementById("usernameBig").innerText=paymentAcc.fullName;
    document.getElementById("accNumber").innerText=paymentAccount.accountNumber;
    document.getElementById("balance").innerText=paymentAccount.balance;
    
}
// =========================
// CHUYỂN TRANG
// =========================
// function goLogin() {
//     window.location.href = "login.html";
// }

// function goTransfer() {
//     window.location.href = "transfer.html";
// }

function goHistory() {
    window.location.href = "history.html";
}

function goNotification() {
    window.location.href = "notification.html";
}

function goAccount() {
    window.location.href = "admin_account.html";
}

// =========================
// ĐĂNG XUẤT
// =========================
function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

// =========================
// ẨN CHỨC NĂNG ADMIN
// =========================
window.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");
    loadUsser();
    if (role !== "admin") {
        document.querySelectorAll(".admin-only").forEach(item => {
            item.style.display = "none";
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {

    // Tìm nút Đăng xuất bằng ID
    const btnLogout = document.getElementById('btnLogout');

    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            // e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a> nếu có
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('status');
            localStorage.removeItem('email');
            localStorage.removeItem('fullName');

            // 2. Thông báo cho người dùng (tùy chọn)
            alert("Bạn đã đăng xuất thành công!");

            // 3. Chuyển hướng về trang Login ngay lập tức
            window.location.href = 'index.html';
        });
    }
});