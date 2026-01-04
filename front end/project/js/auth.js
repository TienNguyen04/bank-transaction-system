function getToken() {
    return localStorage.getItem("token");
}

function requireAuth() {
    const token = getToken();
    if (!token) {
        alert("Vui lòng đăng nhập");
        window.location.replace("login.html");
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.replace("login.html");
}
