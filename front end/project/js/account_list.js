// =================== DOM READY ===================
document.addEventListener("DOMContentLoaded", () => {
    hideAllModals();

    bindClick("#lockSection .btn.danger", handleLockAccount);
    bindSubmit(".saving-form", handleSavingSubmit);
    bindClick("#transferInternalSection .btn.primary", handleSavingSettlement);

    // Load danh sách ngay khi vào trang
    loadAccounts();
});

// =================== CONFIG & VARIABLES ===================
const API_BASE = "http://localhost:8080/accountService/account";
const accountlist_api = `${API_BASE}/my-accounts`;
const opensaving_api = `${API_BASE}/opensaving`;
const closesaving_api = `${API_BASE}/closesaving`;
// API khóa tài khoản (Cần kiểm tra lại endpoint backend của bạn)
const lockaccount_api = `${API_BASE}/lock`; 

let accounts = []; // Biến toàn cục lưu danh sách

// =================== LOAD ACCOUNTS ===================
async function loadAccounts() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
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
    } catch (err) {
        console.error("Lỗi tải danh sách:", err);
    }
}

function renderAccountTable(accounts) {
    const tbody = document.getElementById("accountTableBody");
    tbody.innerHTML = "";

    if (!accounts || accounts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center">Không có tài khoản nào</td>
            </tr>`;
        return;
    }

    accounts.forEach(acc => {
        const tr = document.createElement("tr");
        const canSettle = acc.status === "ACTIVE" && acc.accountType === "SAVING";

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

// =================== MODAL & RENDER HELPER ===================
let selectedSavingAccount = null;

function openSettleModal(accountNumber, balance) {
    selectedSavingAccount = accountNumber;
    hideAllModals();

    // Set dữ liệu vào modal tất toán
    const accInput = document.getElementById("savingAccountInput");
    const amtInput = document.getElementById("settleAmountInput"); // Input hiển thị số dư hiện tại
    
    if(accInput) accInput.value = accountNumber;
    if(amtInput) amtInput.value = balance; // Hoặc formatMoney(balance) tùy input type text/number

    // Render danh sách tài khoản nhận tiền (Payment)
    renderPaymentAccounts();

    document.getElementById("transferInternalSection").style.display = "flex";
}

// Hàm render dropdown tài khoản thanh toán + TRẢ VỀ DANH SÁCH
function renderPaymentAccounts() {
    const select = document.getElementById("receiverAccountSelect"); // Select box chọn tài khoản nhận
    // Hoặc select box chọn tài khoản nguồn khi mở tiết kiệm
    // Lưu ý: Code cũ của bạn dùng chung hàm này cho 2 modal khác nhau, cần cẩn thận ID

    // Ở đây mình giả định bạn dùng chung logic lọc Payment Account
    
    // Lọc danh sách Payment
    const paymentAccounts = accounts.filter(acc =>
        acc.status === "ACTIVE" &&
        acc.accountType === "PAYMENT"
    );

    // Nếu đang ở modal Mở tiết kiệm, cần fill vào dropdown nguồn
    const sourceSelect = document.getElementById("sourceAccount"); 
    // Nếu đang ở modal Tất toán, fill vào dropdown nhận
    const receiverSelect = document.getElementById("receiverAccountSelect");

    // Helper render option
    const renderOptions = (selElement) => {
        if (!selElement) return;
        selElement.innerHTML = "";
        if (paymentAccounts.length === 0) {
            selElement.innerHTML = `<option value="">Không có tài khoản thanh toán</option>`;
        } else {
            paymentAccounts.forEach(acc => {
                const option = document.createElement("option");
                option.value = acc.accountNumber;
                option.textContent = `${acc.accountNumber} - ${formatMoney(acc.balance)}`;
                selElement.appendChild(option);
            });
        }
    };

    renderOptions(sourceSelect);
    renderOptions(receiverSelect);

    return paymentAccounts; // QUAN TRỌNG: Phải return để hàm showSaving dùng được
}

function showSaving() {
    hideAllModals();
    document.getElementById("savingSection").style.display = "flex";
    
    // Gọi hàm render và lấy danh sách trả về
    const paymentAccounts = renderPaymentAccounts();
    
    // Auto select tài khoản đầu tiên
    if (paymentAccounts && paymentAccounts.length > 0) {
        const paymentAcc = paymentAccounts[0];
        const sourceInput = document.getElementById("sourceAccount");
        // Nếu là thẻ select thì .value = accountNumber, nếu là input readonly thì .value = accountNumber
        if(sourceInput) sourceInput.value = paymentAcc.accountNumber; 
    }
}

// =================== OPEN SAVING ACCOUNT ===================
async function handleSavingSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Lấy token lại

    // Lấy GIÁ TRỊ từ input (Sửa lỗi .value)
    const amountVal = parseFloat(document.getElementById("savingAmount").value);
    const termVal = document.getElementById("savingTerm").value; 
    const sourceAcc = document.getElementById("sourceAccount").value; // Tài khoản nguồn trừ tiền

    // Validate
    if (isNaN(amountVal) || amountVal < 1000000) {
        showMessage("Số tiền mở sổ tiết kiệm tối thiểu là 1.000.000 VND!");
        return;
    }

    try {
        const res = await fetch(opensaving_api, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sourceAccountNumber: sourceAcc, // Cần gửi tài khoản nguồn để trừ tiền
                balance: amountVal,             // Số tiền gửi
                term: termVal                   // Kỳ hạn
            })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Mở sổ thất bại");
        }

        showMessage("✅ Mở sổ tiết kiệm thành công", () => {
            e.target.reset(); // Reset form
            backToList();
            loadAccounts();   // Reload danh sách
        });

    } catch (err) {
        console.error(err);
        showMessage("❌ Lỗi: " + err.message);
    }
}

// =================== SETTLE SAVING ACCOUNT (TẤT TOÁN) ===================
async function handleSavingSettlement() {
    if (!selectedSavingAccount) {
        showMessage("Không xác định được tài khoản tiết kiệm");
        return;
    }

    const token = localStorage.getItem("token"); // Lấy token lại
    
    // Lấy tài khoản nhận tiền (Payment) từ dropdown
    const receiverAcc = document.getElementById("receiverAccountSelect")?.value;

    try {
        const res = await fetch(closesaving_api, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                savingAccountNumber: selectedSavingAccount, // Tài khoản tiết kiệm cần đóng
                toAccountNumber: receiverAcc                // Tài khoản nhận tiền về (nếu backend cần)
            })
        });

        if (!res.ok) {
             const text = await res.text();
             throw new Error(text || "Tất toán thất bại");
        }

        showMessage("✅ Tất toán sổ tiết kiệm thành công", () => {
            backToList();
            loadAccounts(); 
        });

    } catch (err) {
        showMessage("❌ Lỗi: " + err.message);
    }
}

// =================== HELPERS & UI CONTROL ===================
function hideAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(m => m.style.display = "none");
}
function backToList() { hideAllModals(); }

function showLock() {
    hideAllModals();
    document.getElementById("lockSection").style.display = "flex";
}
function showTransferInternal() {
    hideAllModals();
    document.getElementById("transferInternalSection").style.display = "flex";
}

function handleLockAccount() {
    // Demo logic
    showMessage("Chức năng đang phát triển");
}

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
    return type === "PAYMENT" ? "Thanh toán" : (type === "SAVING" ? "Tiết kiệm" : type);
}
function mapStatus(status) {
    return status === "ACTIVE" ? "Hoạt động" : (status === "LOCKED" ? "Đã khóa" : status);
}
function formatMoney(amount) {
    return (amount || 0).toLocaleString("vi-VN") + " VND";
}
function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN");
}

// MESSAGE OVERLAY
function showMessage(message, callback = null) {
    const msgText = document.getElementById("messageText");
    const msgOverlay = document.getElementById("messageOverlay");
    if(msgText && msgOverlay) {
        msgText.innerText = message;
        msgOverlay.style.display = "flex";
        window._messageCallback = callback;
    } else {
        alert(message);
        if(callback) callback();
    }
}
function closeMessage() {
    document.getElementById("messageOverlay").style.display = "none";
    if (typeof window._messageCallback === "function") {
        const cb = window._messageCallback;
        window._messageCallback = null;
        cb();
    }
}