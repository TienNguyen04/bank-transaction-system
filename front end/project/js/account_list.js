// =================== DOM READY ===================
document.addEventListener("DOMContentLoaded", () => {
    hideAllModals();

    bindClick("#lockSection .btn.danger", handleLockAccount);
    bindSubmit(".saving-form", handleSavingSubmit);
    bindClick("#transferInternalSection .btn.primary", handleSavingSettlement);
});
const accountlist_api ="http://localhost:8080/accountService/account/my-accounts";
const lockaccount_api ="http://localhost:8080/accountService/account/my-accounts"
const opensaving_api ="http://localhost:8082/savingService/account/opensaving"
const closesaving_api ="http://localhost:8082/savingService/account/closesaving"

let accounts = [];


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

    accounts = await res.json();
    renderAccountTable(accounts);
}

document.addEventListener("DOMContentLoaded", loadAccounts);

function renderAccountTable(accounts) {
    const tbody = document.getElementById("accountTableBody");
    tbody.innerHTML = "";

    if (!accounts || accounts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center">
                    Không có tài khoản nào
                </td>
            </tr>
        `;
        return;
    }

    accounts.forEach(acc => {
        const tr = document.createElement("tr");

        const canSettle =
            acc.status === "ACTIVE" && acc.accountType === "SAVING";

        tr.innerHTML = `
            <td>${acc.accountNumber}</td>
            <td>${mapAccountType(acc.accountType)}</td>
            <td>${formatMoney(acc.balance)}</td>
            <td>${formatDate(acc.createdAt)}</td>
            <td class="${acc.status === 'ACTIVE' ? 'green' : 'red'}">
                ${mapStatus(acc.status)}
            </td>
            <td>
                ${canSettle
                    ? `<button class="btn primary small"
                          onclick="openSettleModal('${acc.accountNumber}', ${acc.balance})">
                          Tất toán
                       </button>`
                    : '-'}
            </td>
        `;

        tbody.appendChild(tr);
    });
}


//MODAL TẤT TOÁN
let selectedSavingAccount = null;

function openSettleModal(accountNumber, balance) {
    selectedSavingAccount = accountNumber;

    // Ẩn modal khác TRƯỚC
    hideAllModals();

    // Set dữ liệu
    document.getElementById("savingAccountInput").value = accountNumber;
    document.getElementById("settleAmountInput").value = balance;

    // Render payment account
    renderPaymentAccounts();

    // Hiện modal
    document.getElementById("transferInternalSection").style.display = "flex";
}

//function lấy payment account
function renderPaymentAccounts() {
    const select = document.getElementById("receiverAccountSelect");
    select.innerHTML = "";

    const paymentAccounts = accounts.filter(acc =>
        acc.status === "ACTIVE" &&
        acc.accountType === "PAYMENT"
    );

    if (paymentAccounts.length === 0) {
        select.innerHTML = `<option value="">Không có tài khoản thanh toán</option>`;
        return;
    }

    paymentAccounts.forEach(acc => {
        const option = document.createElement("option");
        option.value = acc.accountNumber;
        option.textContent = acc.accountNumber;
        select.appendChild(option);
    });
}

// =================== HELPER ===================
function bindClick(selector, handler) {
    const el = document.querySelector(selector);
    if (el) el.addEventListener("click", handler);
}

function bindSubmit(selector, handler) {
    const form = document.querySelector(selector);
    if (form) form.addEventListener("submit", handler);
}

function getAmount(container) {
    const input = container.querySelector("input[type='number']");
    return Number(input?.value);
}
function mapAccountType(type) {
    switch (type) {
        case "PAYMENT": return "Thanh toán";
        case "SAVING": return "Tiết kiệm";
        default: return type;
    }
}

function mapStatus(status) {
    switch (status) {
        case "ACTIVE": return "Hoạt động";
        case "LOCKED": return "Đã khóa";
        default: return status;
    }
}

function formatMoney(amount) {
    if (amount == null) return "0 VND";
    return amount.toLocaleString("vi-VN") + " VND";
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
}

// =================== MODAL CONTROL ===================
function hideAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(m => {
        m.style.display = "none";
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

function showTransferInternal() {
    hideAllModals();
    document.getElementById("transferInternalSection").style.display = "flex";
}

function backToList() {
    hideAllModals();
}

// =================== MESSAGE OVERLAY ===================
function showMessage(message, callback = null) {
    // ⚠️ KHÔNG hide modal phía dưới
    document.getElementById("messageText").innerText = message;
    document.getElementById("messageOverlay").style.display = "flex";
    window._messageCallback = callback;
}

function closeMessage() {
    document.getElementById("messageOverlay").style.display = "none";
    if (typeof window._messageCallback === "function") {
        const cb = window._messageCallback;
        window._messageCallback = null;
        cb();
    }
}

// =================== LOCK ACCOUNT ===================
function handleLockAccount() {
    const selected = document.querySelector("input[name='lockAccount']:checked");

    if (!selected) {
        showMessage("Vui lòng chọn tài khoản để khóa!");
        return;
    }

    showMessage("Xác nhận khóa tài khoản này?", () => {
        showMessage("Khóa tài khoản thành công! (demo)", backToList);
    });
}

// =================== OPEN SAVING ACCOUNT ===================
function handleSavingSubmit(e) {
    e.preventDefault();

    const amount = getAmount(e.target);

    // 🔴 NGHIỆP VỤ: MỞ SỔ ≥ 1 TRIỆU
    if (isNaN(amount) || amount < 1_000_000) {
        showMessage("Số tiền mở sổ tiết kiệm tối thiểu là 1.000.000 VND!");
        return;
    }

    showMessage("Mở tài khoản tiết kiệm thành công! (demo)", () => {
        e.target.reset();
        backToList();
    });
}

// =================== SETTLE SAVING ACCOUNT ===================
// function handleSavingSettlement() {
//     const section = document.getElementById("transferInternalSection");
//     const amount = getAmount(section);

//     // 🔴 NGHIỆP VỤ: TẤT TOÁN > 1 TRIỆU
//     if (isNaN(amount) || amount <= 1_000_000) {
//         showMessage("Số tiền tất toán phải lớn hơn 1.000.000 VND!");
//         return;
//     }

//     showMessage("Xác nhận tất toán sổ tiết kiệm này?", () => {
//         showMessage("Tất toán sổ tiết kiệm thành công! (demo)", () => {
//             section.querySelector("input[type='number']").value = "";
//             backToList();
//         });
//     });
// }
async function handleSavingSettlement() {
    if (!selectedSavingAccount) {
        showMessage("Không xác định được tài khoản tiết kiệm");
        return;
    }

    const token = localStorage.getItem("token");
    const amount = getAmount(
        document.getElementById("transferInternalSection")
    );

    if (isNaN(amount) || amount <= 0) {
        showMessage("Số tiền không hợp lệ");
        return;
    }

    try {
        const res = await fetch(closesaving_api, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                savingAccountNumber: selectedSavingAccount
            })
        });

        if (!res.ok) throw new Error("Tất toán thất bại");

        showMessage("Tất toán sổ tiết kiệm thành công", () => {
            backToList();
            loadAccounts(); // reload danh sách
        });

    } catch (err) {
        showMessage("Lỗi khi tất toán sổ tiết kiệm");
    }
}
