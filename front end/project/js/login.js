// ====== CẤU HÌNH API ======
const API_BASE_URL = 'http://localhost:8081/user-service-Linh/api';

// ====== BIẾN TOÀN CỤC ======
let currentForm = 'login';

// ====== CHUYỂN FORM ======
function showLogin() {
    document.querySelectorAll(".form-box").forEach(box => {
        box.classList.remove("active");
    });
    document.getElementById("loginFormBox").classList.add("active");
    clearErrors();
    currentForm = 'login';
}

function showForgot() {
    document.querySelectorAll(".form-box").forEach(box => {
        box.classList.remove("active");
    });
    document.getElementById("forgotFormBox").classList.add("active");
    clearErrors();
    currentForm = 'forgot';
}

function showReset() {
    document.querySelectorAll(".form-box").forEach(box => {
        box.classList.remove("active");
    });
    document.getElementById("resetFormBox").classList.add("active");
    clearErrors();
    currentForm = 'reset';
}

function showRegister() {
    document.querySelectorAll(".form-box").forEach(box => {
        box.classList.remove("active");
    });
    document.getElementById("registerFormBox").classList.add("active");
    clearErrors();
    currentForm = 'register';
}

// ====== XÓA LỖI ======
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
        el.textContent = '';
        el.style.color = '#dc3545';
    });
    document.querySelectorAll('.success').forEach(el => {
        el.textContent = '';
    });
}

// ====== KIỂM TRA ĐỊNH DẠNG ======
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }
    return { valid: true, message: '' };
}

// ====== XỬ LÝ ĐĂNG NHẬP ======
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();
    const errorElement = document.getElementById("loginError");
    const submitBtn = document.querySelector("#loginForm .btn");

    errorElement.textContent = "";
    errorElement.style.color = "#dc3545";

    if (!username || !password) {
        errorElement.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    // Disable button và hiển thị loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang đăng nhập...";

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Lưu thông tin vào localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            localStorage.setItem('status', data.status);
            localStorage.setItem('email', data.email || '');
            localStorage.setItem('fullName', data.fullName || '');
            
            // Hiển thị thông báo thành công
            errorElement.style.color = "#28a745";
            errorElement.textContent = "Đăng nhập thành công! Đang chuyển hướng...";
            
            // Chuyển hướng sau 1 giây
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);
        } else {
            const errorData = await response.json();
            errorElement.textContent = errorData.message || "Sai tài khoản hoặc mật khẩu!";
        }
    } catch (error) {
        errorElement.textContent = "Lỗi kết nối đến server. Vui lòng thử lại!";
        console.error("Login error:", error);
    } finally {
        // Enable button
        submitBtn.disabled = false;
        submitBtn.textContent = "Đăng nhập";
    }
}

// ====== XỬ LÝ QUÊN MẬT KHẨU ======
async function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById("forgotEmail").value.trim();
    const errorElement = document.getElementById("forgotError");
    const submitBtn = document.querySelector("#forgotForm .btn");

    errorElement.textContent = "";
    errorElement.style.color = "#dc3545";

    if (!email) {
        errorElement.textContent = "Vui lòng nhập email!";
        return;
    }

    if (!isValidEmail(email)) {
        errorElement.textContent = "Email không hợp lệ!";
        return;
    }

    // Disable button và hiển thị loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang gửi...";

    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        });

        if (response.ok) {
            errorElement.style.color = "#28a745";
            errorElement.textContent = "Đã gửi mã khôi phục qua email! Vui lòng kiểm tra hộp thư.";
            
            // Lưu email để sử dụng trong form reset
            sessionStorage.setItem('resetEmail', email);
            
            // Chuyển sang form reset sau 2 giây
            setTimeout(() => {
                showReset();
            }, 2000);
        } else {
            const errorData = await response.json();
            errorElement.textContent = errorData.message || "Không tìm thấy email trong hệ thống!";
        }
    } catch (error) {
        errorElement.textContent = "Lỗi kết nối đến server. Vui lòng thử lại!";
        console.error("Forgot password error:", error);
    } finally {
        // Enable button
        submitBtn.disabled = false;
        submitBtn.textContent = "Gửi mã";
    }
}

// ====== XỬ LÝ ĐẶT LẠI MẬT KHẨU ======
async function handleResetPassword(e) {
    e.preventDefault();

    const token = document.getElementById("resetToken").value.trim();
    const newPassword = document.getElementById("resetNewPassword").value.trim();
    const confirmPassword = document.getElementById("resetConfirmPassword").value.trim();
    const errorElement = document.getElementById("resetError");
    const successElement = document.getElementById("resetSuccess");
    const submitBtn = document.querySelector("#resetForm .btn");

    errorElement.textContent = "";
    successElement.textContent = "";

    if (!token || !newPassword || !confirmPassword) {
        errorElement.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    if (newPassword !== confirmPassword) {
        errorElement.textContent = "Mật khẩu xác nhận không khớp!";
        return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
        errorElement.textContent = passwordValidation.message;
        return;
    }

    // Disable button và hiển thị loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang xử lý...";

    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                newPassword: newPassword
            })
        });

        if (response.ok) {
            successElement.textContent = "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.";
            
            // Clear form
            document.getElementById("resetForm").reset();
            
            // Chuyển về form đăng nhập sau 3 giây
            setTimeout(() => {
                showLogin();
            }, 3000);
        } else {
            const errorData = await response.json();
            errorElement.textContent = errorData.message || "Mã xác nhận không hợp lệ hoặc đã hết hạn!";
        }
    } catch (error) {
        errorElement.textContent = "Lỗi kết nối đến server. Vui lòng thử lại!";
        console.error("Reset password error:", error);
    } finally {
        // Enable button
        submitBtn.disabled = false;
        submitBtn.textContent = "Đặt lại mật khẩu";
    }
}

// ====== XỬ LÝ ĐĂNG KÝ ======
async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById("regUser").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPass").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const fullName = document.getElementById("regFullName").value.trim();
    const errorElement = document.getElementById("regError");
    const submitBtn = document.querySelector("#registerForm .btn");

    errorElement.textContent = "";
    errorElement.style.color = "#dc3545";

    // Kiểm tra thông tin đầu vào
    if (!username || !email || !password || !phone || !fullName) {
        errorElement.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    // Kiểm tra định dạng email
    if (!isValidEmail(email)) {
        errorElement.textContent = "Email không hợp lệ!";
        return;
    }

    // Kiểm tra mật khẩu
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        errorElement.textContent = passwordValidation.message;
        return;
    }

    // Kiểm tra số điện thoại
    if (!isValidPhone(phone)) {
        errorElement.textContent = "Số điện thoại không hợp lệ! (10-11 chữ số)";
        return;
    }

    // Disable button và hiển thị loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang đăng ký...";

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                phone: phone,
                fullName: fullName
                // Role sẽ được server set mặc định
            })
        });

        if (response.ok) {
            const data = await response.json();
            errorElement.style.color = "#28a745";
            errorElement.textContent = "Đăng ký thành công! Vui lòng đăng nhập.";
            
            // Tự động chuyển về form đăng nhập sau 2 giây
            setTimeout(() => {
                showLogin();
                // Clear form
                document.getElementById("registerForm").reset();
            }, 2000);
        } else {
            const errorData = await response.json();
            errorElement.textContent = errorData.message || "Đăng ký thất bại! Tên đăng nhập hoặc email đã tồn tại.";
        }
    } catch (error) {
        errorElement.textContent = "Lỗi kết nối đến server. Vui lòng thử lại!";
        console.error("Register error:", error);
    } finally {
        // Enable button
        submitBtn.disabled = false;
        submitBtn.textContent = "Đăng ký";
    }
}

// ====== KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP ======
// function checkAuthStatus() {
//     const token = localStorage.getItem('token');
//     if (token) {
//         // Nếu đã đăng nhập, chuyển hướng đến trang chủ
//         window.location.href = "home.html";
//     }
// }

// ====== GẮN SỰ KIỆN ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM đã tải xong');
    
    // Kiểm tra trạng thái đăng nhập
    //checkAuthStatus();
    
    // Hiển thị form đăng nhập mặc định
    showLogin();
    
    // ====== GẮN SỰ KIỆN CHO CÁC LINK CHUYỂN FORM ======
    document.getElementById('forgotLink').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Nhấp vào Quên mật khẩu');
        showForgot();
    });
    
    document.getElementById('registerLink').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Nhấp vào Đăng ký');
        showRegister();
    });
    
    document.getElementById('backToLoginLink').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Nhấp vào Quay lại đăng nhập');
        showLogin();
    });
    
    document.getElementById('backToLoginFromResetLink').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Nhấp vào Quay lại đăng nhập từ reset');
        showLogin();
    });
    
    document.getElementById('loginLink').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Nhấp vào Đăng nhập từ form đăng ký');
        showLogin();
    });
    
    // Button "Đăng nhập" ở header
    document.getElementById('loginBtn').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Nhấp vào nút Đăng nhập ở header');
        showLogin();
        // Cuộn đến form đăng nhập
        document.querySelector('.login-container').scrollIntoView({ behavior: 'smooth' });
    });
    
    // ====== GẮN SỰ KIỆN SUBMIT CHO CÁC FORM ======
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("forgotForm").addEventListener("submit", handleForgotPassword);
    document.getElementById("resetForm").addEventListener("submit", handleResetPassword);
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
    
    // ====== THÊM VALIDATION REAL-TIME ======
    document.getElementById('regEmail').addEventListener('blur', function() {
        const email = this.value.trim();
        const errorElement = document.getElementById('regError');
        
        if (email && !isValidEmail(email)) {
            errorElement.textContent = 'Email không hợp lệ!';
        } else {
            errorElement.textContent = '';
        }
    });
    
    document.getElementById('regPhone').addEventListener('blur', function() {
        const phone = this.value.trim();
        const errorElement = document.getElementById('regError');
        
        if (phone && !isValidPhone(phone)) {
            errorElement.textContent = 'Số điện thoại không hợp lệ! (10-11 chữ số)';
        } else {
            errorElement.textContent = '';
        }
    });
    
    document.getElementById('regPass').addEventListener('input', function() {
        const password = this.value;
        const errorElement = document.getElementById('regError');
        
        if (password.length > 0 && password.length < 6) {
            errorElement.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
        } else {
            errorElement.textContent = '';
        }
    });
});

// ====== HÀM TRỢ GIÚP CHO TOKEN ======
function setAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

// ====== HÀM ĐĂNG XUẤT ======
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('status');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');
    
    // Gọi API logout nếu cần
    fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST'
    }).catch(error => {
        console.error('Logout error:', error);
    });
    
    // Chuyển hướng về trang đăng nhập
    window.location.href = 'login.html';
}

// ====== KIỂM TRA TOKEN VALID ======
async function validateToken() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/internal/validate-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ token: token })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

// ====== LẤY THÔNG TIN USER HIỆN TẠI ======
async function getCurrentUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Get user info error:', error);
        return null;
    }
}
fetch("http://localhost:8080/accountService/my-accounts", {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
});


