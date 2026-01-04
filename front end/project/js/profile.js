// ====== CẤU HÌNH API ======
const API_BASE_URL = 'http://localhost:8081/user-service/api';

// ====== BIẾN TOÀN CỤC ======
let userData = null;

// ====== KIỂM TRA AUTHENTICATION ======
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ====== ĐỊNH DẠNG NGÀY THÁNG ======
function formatDateTime(dateString) {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Chưa cập nhật';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    } catch (error) {
        return 'Chưa cập nhật';
    }
}

// ====== DỊCH TRẠNG THÁI SANG TIẾNG VIỆT ======
function getStatusText(status) {
    const statusMap = {
        'ACTIVE': 'Hoạt động',
        'LOCKED': 'Đã khóa',
        'PENDING': 'Chờ kích hoạt',
        'INACTIVE': 'Không hoạt động'
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'ACTIVE': 'status-active',
        'LOCKED': 'status-locked',
        'PENDING': 'status-pending'
    };
    return classMap[status] || '';
}

// ====== DỊCH ROLE SANG TIẾNG VIỆT ======
function getRoleText(role) {
    const roleMap = {
        'ADMIN': 'Quản trị viên',
        'STAFF': 'Nhân viên',
        'USER': 'Người dùng',
        'CUSTOMER': 'Khách hàng'
    };
    return roleMap[role] || role;
}

// ====== LẤY THÔNG TIN NGƯỜI DÙNG ======
async function loadUserProfile() {
    if (!checkAuth()) return;
    
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('profileContent').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }
            throw new Error('Không thể lấy thông tin người dùng');
        }
        
        userData = await response.json();
        displayUserInfo(userData);
        document.getElementById('headerUsername').textContent = userData.username;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('profileContent').style.display = 'block';
        checkAdminRole(userData.role);
        
    } catch (error) {
        console.error('Error loading user profile:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorText').textContent = 
            'Không thể tải thông tin người dùng. Vui lòng thử lại sau.';
    }
}

// ====== HIỂN THỊ THÔNG TIN NGƯỜI DÙNG ======
function displayUserInfo(data) {
    document.getElementById('fullName').textContent = data.fullName || 'Chưa cập nhật';
    document.getElementById('username').textContent = data.username || 'N/A';
    document.getElementById('email').textContent = data.email || 'Chưa cập nhật';
    document.getElementById('phone').textContent = data.phone || 'Chưa cập nhật';
    
    const roleElement = document.getElementById('role');
    const statusElement = document.getElementById('status');
    
    roleElement.textContent = getRoleText(data.role);
    statusElement.textContent = getStatusText(data.status);
    statusElement.className = getStatusClass(data.status);
    
    document.getElementById('userId').textContent = data.id || 'N/A';
    document.getElementById('createdAt').textContent = formatDateTime(data.createdAt);
    document.getElementById('updatedAt').textContent = formatDateTime(data.updatedAt);
    document.getElementById('lastLogin').textContent = formatDateTime(data.lastLogin);
    
    updateAvatar(data);
}

// ====== CẬP NHẬT AVATAR ======
function updateAvatar(data) {
    const avatarElement = document.getElementById('userAvatar');
    const avatarDefault = document.getElementById('avatarDefault');
    
    if (data.avatarUrl) {
        avatarElement.src = data.avatarUrl;
        avatarElement.style.display = 'block';
        avatarDefault.style.display = 'none';
    } else {
        avatarElement.style.display = 'none';
        avatarDefault.style.display = 'flex';
        const initials = getInitials(data.fullName || data.username);
        avatarDefault.innerHTML = `<span style="color: white; font-size: 40px; font-weight: bold;">${initials}</span>`;
    }
}

// ====== LẤY CHỮ CÁI ĐẦU TỪ TÊN ======
function getInitials(name) {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    } else {
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
}

// ====== KIỂM TRA QUYỀN ADMIN ======
function checkAdminRole(role) {
    const adminElements = document.querySelectorAll('.admin-only');
    
    if (role === 'ADMIN' || role === 'STAFF') {
        adminElements.forEach(element => {
            element.style.display = 'block';
        });
    } else {
        adminElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

// ====== ĐĂNG XUẤT ======
function logout() {
    const token = localStorage.getItem('token');
    
    if (token) {
        fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).catch(error => {
            console.error('Logout API error:', error);
        });
    }
    
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// ====== MODAL FUNCTIONS ======

// Mở/đóng modal đổi tên
function openEditNameModal() {
    document.getElementById('newFullName').value = userData.fullName || '';
    document.getElementById('editNameModal').style.display = 'flex';
}

function closeEditNameModal() {
    document.getElementById('editNameModal').style.display = 'none';
    document.getElementById('newFullName').value = '';
}

// Mở/đóng modal đổi số điện thoại
function openEditPhoneModal() {
    document.getElementById('newPhone').value = userData.phone || '';
    document.getElementById('editPhoneModal').style.display = 'flex';
}

function closeEditPhoneModal() {
    document.getElementById('editPhoneModal').style.display = 'none';
    document.getElementById('newPhone').value = '';
}

// Mở/đóng modal đổi mật khẩu
function openChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'flex';
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    updatePasswordStrength();
}

function closeChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'none';
}

// Mở/đóng modal chỉnh sửa thông tin
function openEditProfileModal() {
    document.getElementById('editFullName').value = userData.fullName || '';
    document.getElementById('editPhone').value = userData.phone || '';
    document.getElementById('editProfileModal').style.display = 'flex';
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

// ====== CẬP NHẬT THÔNG TIN ======

// Cập nhật họ tên
async function updateFullName() {
    const newFullName = document.getElementById('newFullName').value.trim();
    
    if (!newFullName) {
        showNotification('Vui lòng nhập họ tên mới', 'error');
        return;
    }
    
    if (newFullName === userData.fullName) {
        closeEditNameModal();
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: newFullName
            })
        });
        
        if (response.ok) {
            const updatedUser = await response.json();
            userData.fullName = updatedUser.fullName;
            document.getElementById('fullName').textContent = updatedUser.fullName;
            closeEditNameModal();
            showNotification('Cập nhật họ tên thành công', 'success');
            updateAvatar(updatedUser);
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Cập nhật thất bại');
        }
    } catch (error) {
        console.error('Error updating full name:', error);
        showNotification('Cập nhật thất bại: ' + error.message, 'error');
    }
}

// Cập nhật số điện thoại
async function updatePhoneNumber() {
    const newPhone = document.getElementById('newPhone').value.trim();
    
    if (!newPhone) {
        showNotification('Vui lòng nhập số điện thoại mới', 'error');
        return;
    }
    
    if (newPhone === userData.phone) {
        closeEditPhoneModal();
        return;
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(newPhone)) {
        showNotification('Số điện thoại phải có 10-15 chữ số', 'error');
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: newPhone
            })
        });
        
        if (response.ok) {
            const updatedUser = await response.json();
            userData.phone = updatedUser.phone;
            document.getElementById('phone').textContent = updatedUser.phone;
            closeEditPhoneModal();
            showNotification('Cập nhật số điện thoại thành công', 'success');
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Cập nhật thất bại');
        }
    } catch (error) {
        console.error('Error updating phone:', error);
        showNotification('Cập nhật thất bại: ' + error.message, 'error');
    }
}

// Cập nhật thông tin cá nhân (tất cả)
async function updateProfile() {
    const newFullName = document.getElementById('editFullName').value.trim();
    const newPhone = document.getElementById('editPhone').value.trim();
    
    if (!newFullName) {
        showNotification('Vui lòng nhập họ tên', 'error');
        return;
    }
    
    if (newPhone && !/^[0-9]{10,15}$/.test(newPhone)) {
        showNotification('Số điện thoại phải có 10-15 chữ số', 'error');
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: newFullName,
                phone: newPhone || null
            })
        });
        
        if (response.ok) {
            const updatedUser = await response.json();
            userData.fullName = updatedUser.fullName;
            userData.phone = updatedUser.phone;
            document.getElementById('fullName').textContent = updatedUser.fullName;
            document.getElementById('phone').textContent = updatedUser.phone || 'Chưa cập nhật';
            closeEditProfileModal();
            showNotification('Cập nhật thông tin thành công', 'success');
            updateAvatar(updatedUser);
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Cập nhật thất bại');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Cập nhật thất bại: ' + error.message, 'error');
    }
}

// Đổi mật khẩu
async function updatePassword() {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Kiểm tra validation
    if (!oldPassword || !newPassword || !confirmPassword) {
        showNotification('Vui lòng nhập đầy đủ thông tin', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Mật khẩu mới và xác nhận không khớp', 'error');
        return;
    }
    
    if (oldPassword === newPassword) {
        showNotification('Mật khẩu mới không được trùng với mật khẩu cũ', 'error');
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userData.id}/change-password`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        });
        
        if (response.ok) {
            closeChangePasswordModal();
            showNotification('Đổi mật khẩu thành công. Vui lòng đăng nhập lại', 'success');
            
            // Đăng xuất sau khi đổi mật khẩu thành công
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Đổi mật khẩu thất bại';
            
            if (response.status === 400) {
                showNotification('Mật khẩu cũ không đúng', 'error');
            } else {
                showNotification(errorMessage, 'error');
            }
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Có lỗi xảy ra. Vui lòng thử lại sau', 'error');
    }
}

// ====== HELPER FUNCTIONS ======

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Toggle hiển thị mật khẩu
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Kiểm tra độ mạnh mật khẩu
function updatePasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '#ddd';
        strengthText.textContent = '';
        return;
    }
    
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    strengthBar.style.width = strength + '%';
    
    if (strength <= 25) {
        strengthBar.style.backgroundColor = '#ff4757';
        strengthText.textContent = 'Yếu';
        strengthText.style.color = '#ff4757';
    } else if (strength <= 50) {
        strengthBar.style.backgroundColor = '#ffa502';
        strengthText.textContent = 'Trung bình';
        strengthText.style.color = '#ffa502';
    } else if (strength <= 75) {
        strengthBar.style.backgroundColor = '#2ed573';
        strengthText.textContent = 'Mạnh';
        strengthText.style.color = '#2ed573';
    } else {
        strengthBar.style.backgroundColor = '#1e90ff';
        strengthText.textContent = 'Rất mạnh';
        strengthText.style.color = '#1e90ff';
    }
}

// Đóng modal khi click bên ngoài
document.addEventListener('click', function(event) {
    const modals = ['editNameModal', 'editPhoneModal', 'changePasswordModal', 'editProfileModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && event.target === modal) {
            switch(modalId) {
                case 'editNameModal':
                    closeEditNameModal();
                    break;
                case 'editPhoneModal':
                    closeEditPhoneModal();
                    break;
                case 'changePasswordModal':
                    closeChangePasswordModal();
                    break;
                case 'editProfileModal':
                    closeEditProfileModal();
                    break;
            }
        }
    });
});

// Đóng modal bằng phím ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditNameModal();
        closeEditPhoneModal();
        closeChangePasswordModal();
        closeEditProfileModal();
    }
});

// ====== XỬ LÝ KHI TRANG ĐƯỢC TẢI ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded');
    
    if (!checkAuth()) return;
    
    loadUserProfile();
    
    // Thêm sự kiện input cho kiểm tra mật khẩu
    document.getElementById('newPassword')?.addEventListener('input', updatePasswordStrength);
    
    // Xác nhận logout
    document.querySelectorAll('.logout-btn, [onclick="logout()"]').forEach(button => {
        button.onclick = function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                logout();
            }
        };
    });
});

// ====== XỬ LÝ LỖI MẠNG ======
window.addEventListener('offline', function() {
    showNotification('Mất kết nối mạng. Vui lòng kiểm tra kết nối của bạn.', 'error');
});

window.addEventListener('online', function() {
    showNotification('Đã khôi phục kết nối mạng.', 'success');
});

// ====== PHÍM TẮT ======
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        logout();
    }
    
    if (e.key === 'F5') {
        e.preventDefault();
        loadUserProfile();
    }
});