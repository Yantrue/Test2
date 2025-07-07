// Fungsi login sederhana
function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const errorEl = document.getElementById('error');

  if(user === 'admin' && pass === 'admin123') {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'index.html';
  } else {
    errorEl.textContent = 'Username atau password salah!';
  }
}

// Fungsi logout
function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'login.html';
}

// Cek akses di halaman dashboard
if(window.location.pathname.endsWith('index.html')) {
  if(localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
  }
}

// Pasang event logout button jika ada
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}


