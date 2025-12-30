// =================== DOM READY ===================
document.addEventListener("DOMContentLoaded", () => {
    hideAllModals();

    bindClick("#lockSection .btn.danger", handleLockAccount);
    bindSubmit(".saving-form", handleSavingSubmit);
    bindClick("#transferInternalSection .btn.primary", handleSavingSettlement);
});

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
function handleSavingSettlement() {
    const section = document.getElementById("transferInternalSection");
    const amount = getAmount(section);

    // 🔴 NGHIỆP VỤ: TẤT TOÁN > 1 TRIỆU
    if (isNaN(amount) || amount <= 1_000_000) {
        showMessage("Số tiền tất toán phải lớn hơn 1.000.000 VND!");
        return;
    }

    showMessage("Xác nhận tất toán sổ tiết kiệm này?", () => {
        showMessage("Tất toán sổ tiết kiệm thành công! (demo)", () => {
            section.querySelector("input[type='number']").value = "";
            backToList();
        });
    });
}
