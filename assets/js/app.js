/**
 * Global App Controller for Book Bank Management System (IMPROVED)
 */

// ========================
// Toast Notification (SAFE)
// ========================
function showNotification(message, type = 'success') {
    if (!message) return;

    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';

    const icons = {
        success: 'fa-check-circle',
        danger: 'fa-exclamation-circle',
        warning: 'fa-triangle-exclamation',
        info: 'fa-info-circle'
    };

    const colors = {
        success: 'linear-gradient(135deg, #2a9d8f, #21867a)',
        danger: 'linear-gradient(135deg, #e63946, #d62246)',
        warning: 'linear-gradient(135deg, #f4a261, #e76f51)',
        info: 'linear-gradient(135deg, #457b9d, #1d3557)'
    };

    notification.style.background = colors[type] || colors.success;

    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.success}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================
// Navbar Sync (SAFE + FAST)
// ========================
function syncNavBar() {
    const navRight = document.getElementById('nav-right-options');
    if (!navRight) return;

    if (!window.db || typeof window.db.getCurrentUser !== 'function') return;

    const user = window.db.getCurrentUser();

    // Clear first (avoid flicker duplicates)
    navRight.innerHTML = '';

    if (user && user.role) {
        const dashboardUrl =
            user.role === 'admin'
                ? 'dashboard-admin.html'
                : 'dashboard-student.html';

        navRight.innerHTML = `
            <li class="nav-item">
                <a class="nav-link fw-bold text-primary" href="${dashboardUrl}">
                    <i class="fas fa-th-large me-1"></i> Dashboard
                </a>
            </li>
            <li class="nav-item ms-2">
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3" id="logoutBtn">
                    <i class="fas fa-sign-out-alt me-1"></i> Logout
                </button>
            </li>
        `;

        // safer event binding (no inline onclick)
        const btn = document.getElementById('logoutBtn');
        if (btn) {
            btn.addEventListener('click', handleLogout);
        }

    } else {
        navRight.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html?tab=student">
                    <i class="fas fa-user me-1"></i> Student Portal
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="login.html?tab=admin">
                    <i class="fas fa-user-shield me-1"></i> Admin Portal
                </a>
            </li>
            <li class="nav-item ms-2">
                <a class="btn btn-primary btn-sm text-white" href="login.html">
                    <i class="fas fa-sign-in-alt me-1"></i> Login
                </a>
            </li>
        `;
    }
}

// ========================
// Logout (SAFE)
// ========================
function handleLogout() {
    if (!window.db) return;

    try {
        window.db.logout();
        showNotification("Logged out successfully", "success");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (err) {
        console.error("Logout error:", err);
    }
}

// ========================
// Route Protection (SAFE)
// ========================
function guardPage(requiredRole) {
    if (!window.db) return;

    const user = window.db.getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (requiredRole && user.role !== requiredRole) {
        showNotification("Access denied", "danger");

        setTimeout(() => {
            window.location.href =
                user.role === 'admin'
                    ? 'dashboard-admin.html'
                    : 'dashboard-student.html';
        }, 1200);
    }
}

// ========================
// Init (SAFE LOAD)
// ========================
document.addEventListener('DOMContentLoaded', () => {
    try {
        syncNavBar();
    } catch (e) {
        console.error("Navbar init failed:", e);
    }
});
