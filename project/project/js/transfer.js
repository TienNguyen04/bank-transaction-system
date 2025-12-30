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
const amountInput = document.getElementById("amount");
const feeDiv = document.getElementById("fee");

amountInput.addEventListener("input", function () {
    const val = Number(this.value);
    if (val > 0) {
        const fee = Math.round(val * 0.001);
        feeDiv.textContent = fee.toLocaleString() + " VND";
    } else {
        feeDiv.textContent = "0đ";
    }
});

