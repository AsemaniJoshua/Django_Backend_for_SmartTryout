// signup.js
// Handles signup form submission using fetch to backend

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
  const form = document.getElementById('signupForm');
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const placeholder = 'https://ui-avatars.com/api/?name=Avatar&size=80&background=6d28d9&color=fff';
  const signupBtn = form.querySelector('button[type="submit"]');

  // Show preview when user selects an image
  imageInput.addEventListener('change', function(e) {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        preview.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = placeholder;
    }
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Password mismatch', text: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      Swal.fire({ icon: 'error', title: 'Weak password', text: 'Password must be at least 6 characters.' });
      return;
    }
    signupBtn.disabled = true;
    const originalText = signupBtn.textContent;
    signupBtn.textContent = 'Signing up...';
    signupBtn.classList.add('opacity-60', 'cursor-not-allowed');
    const formData = new FormData(form);
    if (imageInput && imageInput.files[0]) {
      formData.append('profile_image', imageInput.files[0]);
    }
    try {
      const response = await fetch('/auth/register/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrftoken
        },
        body: formData
      });
      const data = await response.json();
      if (data.status === 'success') {
        Swal.fire({ icon: 'success', title: 'Account created', text: 'Redirecting to login...' });
        setTimeout(() => { window.location.href = '/auth/login/'; }, 1500);
      } else {
        Swal.fire({ icon: 'error', title: 'Signup failed', text: data.message || 'Please check your input.' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Network error', text: 'Could not connect to server.' });
    } finally {
      signupBtn.disabled = false;
      signupBtn.textContent = originalText;
      signupBtn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  });

  // Ensure placeholder is always visible if no file is selected
  if (!preview.src || preview.src === window.location.href) {
    preview.src = placeholder;
  }
});
