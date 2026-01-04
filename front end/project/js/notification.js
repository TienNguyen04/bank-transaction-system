// LẤY ELEMENTS
const filterButtons = document.querySelectorAll(".filter");
const notifications = document.querySelectorAll(".notify-item");

// LỌC KHI CLICK
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Xóa class active của tất cả nút
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const type = btn.dataset.filter; // all / unread / read

        notifications.forEach(item => {

            // reset hiển thị
            item.style.display = "grid";

            if (type === "unread" && !item.classList.contains("unread")) {
                item.style.display = "none";
            }

            if (type === "read" && !item.classList.contains("read")) {
                item.style.display = "none";
            }

            if (type === "all") {
                item.style.display = "grid";
            }
        });
    });
});

function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}
