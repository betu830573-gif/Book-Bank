/**
 * Global App Controller for Book Bank Management System
 */

// Custom Toast Notification System
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification`;
    if (type === 'danger') {
        notification.style.background = 'linear-gradient(135deg, #e63946 0%, #d62246 100%)';
    } else if (type === 'warning') {
        notification.style.background = 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)';
    }

    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Trigger reflow & show
    setTimeout(() => {
        notification.classList.add('show');
    }, 50);

    // Hide and remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3500);
}

// Navigation Bar Auth Synchronizer
function syncNavBar() {
    const navRight = document.getElementById('nav-right-options');
    if (!navRight) return;

    if (!window.db) return;
    const user = window.db.getCurrentUser();

    if (user) {
        let dashboardUrl = user.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-student.html';
        navRight.innerHTML = `
            <li class="nav-item">
                <a class="nav-link active fw-bold text-primary" href="${dashboardUrl}">
                    <i class="fas fa-th-large me-1"></i> Dashboard
                </a>
            </li>
            <li class="nav-item align-self-center ms-2">
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt me-1"></i> Logout
                </button>
            </li>
        `;
    } else {
        navRight.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html?tab=student"><i class="fas fa-user-grad me-1"></i> Student Portal</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="login.html?tab=admin"><i class="fas fa-user-shield me-1"></i> Admin Portal</a>
            </li>
            <li class="nav-item align-self-center ms-2">
                <a class="btn btn-primary-custom btn-sm text-white" href="login.html">
                    <i class="fas fa-sign-in-alt me-1"></i> Access System
                </a>
            </li>
        `;
    }
}

// Handle User Logout
function handleLogout() {
    if (window.db) {
        window.db.logout();
        showNotification("Logged out successfully. Redirecting...", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    }
}

// Authentication Guards for Dashboards
function guardPage(requiredRole) {
    if (!window.db) return;
    const user = window.db.getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (requiredRole && user.role !== requiredRole) {
        showNotification("Access Denied: Unauthorized role.", "danger");
        setTimeout(() => {
            window.location.href = user.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-student.html';
        }, 1500);
    }
}

// Initialize navbar sync on load
document.addEventListener('DOMContentLoaded', () => {
    syncNavBar();
});
