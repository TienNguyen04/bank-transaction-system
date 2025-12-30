// =================== DOM READY ===================
document.addEventListener("DOMContentLoaded", () => {
    // Ẩn tất cả modal khi load trang
    hideAllModals();
    fetchMyAccounts();
    // Gán sự kiện xác nhận khóa tài khoản
    const lockConfirmBtn = document.querySelector("#lockSection .btn.danger");
    if (lockConfirmBtn) {
        lockConfirmBtn.addEventListener("click", handleLockAccount);
    }

    // Gán sự kiện submit form tiết kiệm
    const savingForm = document.querySelector(".saving-form");
    if (savingForm) {
        savingForm.addEventListener("submit", handleSavingSubmit);
    }
});
//api

const BASE_API = "http://localhost:8080/accountService/account";

async function fetchMyAccounts() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
    }

    try {
        const response = await fetch(`${BASE_API}/my-accounts`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Phiên đăng nhập hết hạn!");
            return;
        }

        const data = await response.json();
        renderAccountList(data);

    } catch (error) {
        console.error("API error:", error);
        alert("Không thể tải danh sách tài khoản");
    }
}


function renderAccountTable(accounts) {
    const tbody = document.getElementById("accountTableBody");
    tbody.innerHTML = "";

    if (!accounts || accounts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center">
                    Không có tài khoản nào
                </td>
            </tr>
        `;
        return;
    }

    accounts.forEach(acc => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${acc.accountNumber}</td>
            <td>${mapAccountType(acc.accountType)}</td>
            <td>${formatMoney(acc.balance)}</td>
            <td>${formatDate(acc.createdAt)}</td>
            <td class="${acc.status === 'ACTIVE' ? 'green' : 'red'}">
                ${mapStatus(acc.status)}
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ================= HELPER =================
function mapAccountType(type) {
    if (type === "PAYMENT") return "Thanh toán";
    if (type === "SAVING") return "Tiết kiệm";
    return type;
}

function mapStatus(status) {
    return status === "ACTIVE" ? "Hoạt động" : "Đã khóa";
}

function formatMoney(amount) {
    return Number(amount).toLocaleString("vi-VN") + " VND";
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
}
// =================== MODAL CONTROL ===================
function hideAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.style.display = "none";
    });
}

function showLock() {
    hideAllModals();
    document.getElementById("lockSection").style.display = "flex";
}

function showSaving() {
    hideAllModals();
    document.getElementById("savingSection").style.display = "flex";
}

function backToList() {
    hideAllModals();
}

// =================== LOCK ACCOUNT ===================
function handleLockAccount() {
    const selectedAccount = document.querySelector(
        "input[name='lockAccount']:checked"
    );

    if (!selectedAccount) {
        alert("Vui lòng chọn tài khoản để khóa!");
        return;
    }

    const confirmLock = confirm("Bạn có chắc chắn muốn khóa tài khoản này?");
    if (confirmLock) {
        alert("Khóa tài khoản thành công! (demo)");
        backToList();
    }
}

// =================== SAVING ACCOUNT SUBMIT ===================
function handleSavingSubmit(e) {
    e.preventDefault();

    const amountInput = e.target.querySelector("input[type='number']");
    const amount = Number(amountInput.value);

    if (!amount || amount <= 0) {
        alert("Số tiền gửi không hợp lệ!");
        return;
    }

    alert("Đăng ký tài khoản tiết kiệm thành công! (demo)");
    e.target.reset();
    backToList();
}
