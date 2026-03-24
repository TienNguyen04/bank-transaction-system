const API_URL = "http://localhost:8082/transService-Sang/api";
const history_api ="http://localhost:8082/transService-Sang/api/history" // URL gốc

// Biến lưu số tài khoản của mình (sẽ được cập nhật từ API)
let myAccountNumber = "";

document.addEventListener("DOMContentLoaded", () => {
    loadData();
});

async function loadData() {
    const token = localStorage.getItem("token");

    // Nếu chưa đăng nhập (và không chạy mode test backdoor) thì đá về login
    // if (!token) {
    //     // window.location.href = "login.html"; // Mở dòng này nếu muốn bắt buộc login
    // }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };

    try {
        // 1. GỌI API LẤY THÔNG TIN TÀI KHOẢN TRƯỚC
        const userRes = await fetch(
            `http://localhost:8080/accountService/account/my-paymentnumber`,
            { method: "GET", 
                headers: headers });

        if (userRes.ok) {
            const userData = await userRes.json();
            myAccountNumber = userData; // 👉 LẤY ĐƯỢC SỐ TK THẬT Ở ĐÂY
            console.log("Đang đăng nhập với STK:", myAccountNumber);
        } else {
            console.warn("Không lấy được thông tin user, logic màu sắc có thể sai.");
        }
        
        // 2. SAU ĐÓ MỚI GỌI API LỊCH SỬ
        const historyRes = await fetch(history_api, { method: "GET", headers: headers });

        if (!historyRes.ok) throw new Error("Lỗi tải lịch sử");

        const transactions = await historyRes.json();
        renderTable(transactions);

    } catch (error) {
        console.error(error);
        const list = document.getElementById("history-list");
        if(list) list.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Lỗi kết nối: ${error.message}</td></tr>`;
    }
}

function renderTable(data) {
    const tbody = document.getElementById("history-list");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (data.length === 0) {
        document.getElementById("no-data").style.display = "block";
        return;
    } else {
        document.getElementById("no-data").style.display = "none";
    }

    data.forEach(tx => {
        let isMoneyOut = false;
        let typeLabel = "Giao dịch";
        let partnerName = "";
        let colorClass = "receive";
        let amountSign = "+";

        // Logic tô màu dựa trên myAccountNumber vừa lấy được
        if (tx.type === "DEPOSIT") {
            typeLabel = "Nạp tiền";
            colorClass = "receive";
            amountSign = "+";
            partnerName = "Tại quầy/ATM";
        }
        else if (tx.type === "WITHDRAW") {
            typeLabel = "Rút tiền";
            colorClass = "send";
            amountSign = "-";
            isMoneyOut = true;
            partnerName = "ATM";
        }
        else if (tx.type === "TRANSFER") {
            // So sánh với số tài khoản thật lấy từ API
            if (tx.fromAccountNumber === myAccountNumber) {
                typeLabel = "Chuyển đi";
                colorClass = "send";
                amountSign = "-";
                isMoneyOut = true;
                partnerName = tx.toAccountNumber;
            } else {
                typeLabel = "Nhận tiền";
                colorClass = "receive";
                amountSign = "+";
                partnerName = tx.fromAccountNumber;
            }
        }

        const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount);
        const dateStr = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN');

        const row = `
            <tr>
                <td>${dateStr}</td>
                <td>
                    <span class="type ${colorClass}">
                        <i class="fa-solid ${isMoneyOut ? 'fa-arrow-up' : 'fa-arrow-down'}"></i> ${typeLabel}
                    </span>
                </td>
                <td class="money ${isMoneyOut ? 'red' : 'green'}">
                    ${amountSign} ${formattedAmount}
                </td>
                <td>${partnerName}</td>
                <td>${tx.description || 'Không có nội dung'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function logout() {
    localStorage.removeItem("accessToken");
    window.location.href = "login.html";
}