// details.js
// Handles logout button for details page

console.log('details.js loaded');
document.addEventListener('DOMContentLoaded', async function() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('jwt_token');
      Swal.fire({
        icon: 'success',
        title: 'Logged out',
        text: 'You have been logged out successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.href = '/auth/login/';
      }, 1200);
    });
  }

  // JWT verification and user details fetch
  const token = localStorage.getItem('jwt_token');
  let id = null;
  const match = window.location.pathname.match(/details\/(\d+)/);
  if (match) id = match[1];
  if (!token || !id) {
    window.location.href = '/auth/login/';
    return;
  }
  const loadingSpinner = document.getElementById('loadingSpinner');
  const profileContent = document.getElementById('profileContent');
  let failed = false;
  let errorMsg = '';
  try {
    const response = await fetch(`/user/details/verify/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, treat as error
      failed = true;
      errorMsg = 'Invalid server response.';
    }
    // If response is not ok (not 2xx), treat as error
    if (!response.ok) {
      failed = true;
      // Try to get error from data, else use status
      errorMsg = (data && data.error) ? data.error : `Error ${response.status}: ${response.statusText}`;
    }
    // If data.error exists, treat as error
    if (data && data.error) {
      failed = true;
      errorMsg = data.error;
    }
    if (failed) {
      localStorage.removeItem('jwt_token');
      if (loadingSpinner) loadingSpinner.style.display = 'none';
      if (profileContent) profileContent.style.display = 'none';
      console.log('Triggering SweetAlert with error:', errorMsg);
      // Show native alert and wait for user acknowledgement before redirecting.
      try {
        window.alert(errorMsg || 'Access denied. Click OK to go to login.');
      } catch (e) {
        // If alert is not available for some reason, log and proceed
        console.log('Alert unavailable, proceeding to redirect');
      }
      window.location.href = '/auth/login/';
      return;
    }
    if (data && data.user) {
      if (loadingSpinner) loadingSpinner.style.display = 'none';
      if (profileContent) profileContent.style.display = '';
      document.getElementById('profileImage').src = data.user.profile_image || 'https://ui-avatars.com/api/?name=Avatar&size=160&background=6d28d9&color=fff';
      document.getElementById('profileName').textContent = data.user.full_name || '-';
      document.getElementById('profileEmail').textContent = data.user.email || '-';
      document.getElementById('profileBio').textContent = data.user.bio || 'No bio provided.';
      document.getElementById('profileCreated').textContent = data.user.created_at || '';
      document.getElementById('profileContact').textContent = data.user.email || '-';
    }
  } catch (err) {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (profileContent) profileContent.style.display = 'none';
    let errMsg = (err && err.message) ? err.message : 'Network error. Please log in again.';
    console.log('Triggering SweetAlert: Network error', errMsg);
    // Show native alert and wait for user acknowledgement before redirecting.
    try {
      window.alert(errMsg || 'Network error. Please log in again.');
    } catch (e) {
      console.log('Alert unavailable, proceeding to redirect');
    }
    window.location.href = '/auth/login/';
  }
});
