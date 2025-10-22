// login.js
// Handles login form submission using fetch to backend

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const loginBtn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    loginBtn.disabled = true;
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Logging in...';
    loginBtn.classList.add('opacity-60', 'cursor-not-allowed');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try {
      const response = await fetch('/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.status === 'success' && data.token) {
        localStorage.setItem('jwt_token', data.token);
        Swal.fire({ icon: 'success', title: 'Login successful', text: 'Redirecting to details...' });
        setTimeout(() => { window.location.href = `/user/details/${data.user.id}`; }, 1500);
      } else {
        Swal.fire({ icon: 'error', title: 'Login failed', text: data.message || 'Invalid credentials.' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Network error', text: err.message || 'Could not connect to server.' });
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = originalText;
      loginBtn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  });
});
