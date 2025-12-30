// =========================
// ẨN / HIỆN SỐ DƯ
// =========================
const toggleBtn = document.getElementById("toggleMoney");
const balanceText = document.getElementById("balance");

if (toggleBtn && balanceText) {
    toggleBtn.addEventListener("click", () => {
        const isBlur = balanceText.classList.toggle("blurred");

        if (isBlur) {
            toggleBtn.classList.replace("fa-eye-slash", "fa-eye");
        } else {
            toggleBtn.classList.replace("fa-eye", "fa-eye-slash");
        }
    });
}

// =========================
// CHUYỂN TRANG
// =========================
function goLogin() {
    window.location.href = "login.html";
}

function goTransfer() {
    window.location.href = "transfer.html";
}

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

    if (role !== "admin") {
        document.querySelectorAll(".admin-only").forEach(item => {
            item.style.display = "none";
        });
    }
});
