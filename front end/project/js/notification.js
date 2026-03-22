// 1. CẤU HÌNH ĐƯỜNG DẪN API
// Lưu ý: Nếu Controller của bạn có @RequestMapping("/api") thì phải thêm /api vào
const NOTI_API_URL = "http://localhost:8086/noti_Nguyet/noti/listnoti";

document.addEventListener("DOMContentLoaded", () => {
    loadNotifications();
    setupFilters();
});

// 2. HÀM GỌI API LẤY DỮ LIỆU
async function loadNotifications() {
    const token = localStorage.getItem("token");
    const container = document.getElementById("notification-list");

    if (!token) {
        container.innerHTML = '<p class="text-center">Vui lòng đăng nhập.</p>';
        return;
    }

    try {
        const res = await fetch(NOTI_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json();
            renderNotifications(data);
        } else {
            container.innerHTML = '<p class="text-center text-danger">Lỗi tải thông báo.</p>';
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        container.innerHTML = '<p class="text-center text-danger">Lỗi kết nối server.</p>';
    }
}

// 3. HÀM VẼ GIAO DIỆN (RENDER HTML)
function renderNotifications(list) {
    const container = document.getElementById("notification-list");
    container.innerHTML = ""; // Xóa nội dung "Đang tải..."

    if (!list || list.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">Không có thông báo nào.</p>';
        return;
    }

    // Lặp qua danh sách và tạo HTML
    list.forEach(item => {
        // Xử lý trạng thái: Backend thường trả về "UNREAD" (hoa), Frontend cần class "unread" (thường)
        // Kiểm tra kỹ field trả về từ Java là 'status' hay 'read' hay 'isRead'
        let statusClass = "read";
        if (item.status === "UNREAD" || item.isRead === false) {
            statusClass = "unread";
        }

        const icon = statusClass === "unread" 
            ? '<i class="fas fa-envelope" style="color:red"></i>' 
            : '<i class="fas fa-envelope-open" style="color:gray"></i>';

        // Tạo chuỗi HTML
        const html = `
            <div class="notify-item ${statusClass}" data-id="${item.id}">
                <div class="notify-icon">${icon}</div>
                <div class="notify-content">
                    <div class="notify-title">${item.title || 'Thông báo'}</div>
                    <div class="notify-desc">${item.message || item.content || ''}</div>
                    <div class="notify-time">${formatDate(item.createdAt)}</div>
                </div>
            </div>
        `;
        
        // Cộng dồn vào container
        container.insertAdjacentHTML('beforeend', html);
    });
}

// 4. HÀM XỬ LÝ BỘ LỌC (FILTER)
function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Active nút bấm
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const type = btn.dataset.filter; // all / unread / read

            // Lấy lại danh sách item ĐÃ ĐƯỢC RENDER
            const items = document.querySelectorAll(".notify-item");

            items.forEach(item => {
                // Reset hiển thị
                item.style.display = "flex"; // Hoặc "grid" tùy CSS của bạn

                // Logic ẩn hiện
                if (type === "unread" && !item.classList.contains("unread")) {
                    item.style.display = "none";
                }
                if (type === "read" && !item.classList.contains("read")) {
                    item.style.display = "none";
                }
            });
        });
    });
}

// Helper: Format ngày giờ
function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('vi-VN');
}