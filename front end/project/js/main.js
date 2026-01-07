document.addEventListener("DOMContentLoaded", () => {
    requireAuth();
});

function goLogin() {
    window.location.href = "login.html"; 
}
function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
}

// Cuộn xuống dịch vụ
function scrollToServices() {
    const target = document.getElementById("services");
    target.scrollIntoView({ behavior: "smooth" });
}

// Cuộn xuống footer khi bấm Hỗ trợ
document.querySelector('a[href="#footer"]').addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
});

// Cuộn xuống dịch vụ khi bấm menu "Dịch vụ"
document.querySelector('a[href="#services"]').addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");

    console.log("Role:", role); // kiểm tra thử

    if (role !== "admin") {
        document.querySelectorAll(".admin-only").forEach(item => {
            item.style.display = "none";
        });
    }
});
