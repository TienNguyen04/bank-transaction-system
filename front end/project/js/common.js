// =========================
// CONFIG
// =========================
const BASE_URL = "http://localhost:8086/accountService";

// =========================
// AUTH
// =========================
function getToken() {
    return localStorage.getItem("token");
}

function getAccountNumber() {
    return localStorage.getItem("accountNumber");
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accountNumber");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

// =========================
// API FETCH CHUẨN
// =========================
async function apiFetch(url, options = {}) {
    const token = getToken();

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập đã hết hạn");
        logout();
        throw new Error("Unauthorized");
    }

    return response;
}

// =========================
// FORMAT
// =========================
function formatMoney(amount) {
    return Number(amount).toLocaleString("vi-VN") + " VND";
}

// =========================
// REDIRECT
// =========================
function goLogin() {
    window.location.href = "login.html";
}

function goHome() {
    window.location.href = "home.html";
}

function goTransfer() {
    window.location.href = "transfer.html";
}
