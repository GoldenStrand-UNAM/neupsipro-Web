function openLogoutModal () {
  document.getElementById('logoutModal').classList.remove('hidden');
}

function closeLogoutModal () {
  document.getElementById('logoutModal').classList.add('hidden');
}

async function logout () {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('No hay sesión activa');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.removeItem('token');
      alert('Sesión cerrada correctamente');
      window.location.href = 'login.ejs';
    } else {
      alert(data.error || 'Error al cerrar sesión');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    alert('Error de conexión con el servidor');
  }
}

window.openLogoutModal = openLogoutModal;
window.closeLogoutModal = closeLogoutModal;
window.logout = logout;

//Show & hide password in login
document.addEventListener('DOMContentLoaded', () => {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type',isPassword ? 'text' : 'password');
      if (isPassword) {
        this.innerHTML =  '<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />';
      } else {
        this.innerHTML = `
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                `;
      }
    });
  }
});

//Show pop up to recover password
document.addEventListener('DOMContentLoaded', () => {
  const recoverPassword = document.getElementById('recoverPassword');
  const popUp = document.getElementById('popUp');
  const closePopUp = document.getElementById('closePopUp');
  if (!recoverPassword || !popUp || !closePopUp) return;
  recoverPassword.addEventListener('click', () => {
    popUp.showModal();
  });
  if (popUp && closePopUp) {
    closePopUp.addEventListener('click', () => {
      popUp.close();
    });
  }
});

//Show message when character length has reached 30 in username field
document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('username');
  const usernameMessage = document.getElementById('usernameMessage');
  if (!userInput || !usernameMessage) return;
  const maxLimit = 30;
  userInput.addEventListener('input', () => {
    const actualLength = userInput.value.length;
    if (actualLength >= maxLimit) {
      usernameMessage.removeAttribute('hidden');
    } else {
      usernameMessage.setAttribute('hidden', '');
    }

  });
});

//Show message when character length has reached 30 in password field
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const passwordMessage = document.getElementById('passwordMessage');
  if (!passwordInput || !passwordMessage) return;
  const maxLimit = 30;
  passwordInput.addEventListener('input', () => {
    const actualLength = passwordInput.value.length;
    if (actualLength >= maxLimit) {
      passwordMessage.removeAttribute('hidden');
    } else {
      passwordMessage.setAttribute('hidden', '');
    }

  });
});

// Show message when input fields are empty
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;
  const errorMessage = document.getElementById('errorMessage');

  form.addEventListener('submit', (event) => {
    const userValue = document.getElementById('username').value.trim();
    const passValue = document.getElementById('password').value.trim();

    if (userValue === '' || passValue === '') {
      event.preventDefault();
      errorMessage.style.display = 'block';
    } else {
      errorMessage.style.display = 'none';
    }
  });
});

// Function to prevent XSS inyections
function escapeHtml (str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast (message, type = 'success') {
  document.getElementById('toast')?.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            ${type === 'success'
    ? '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>'
    : '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>'}
        </svg>
        <span class="toast-msg">${escapeHtml(message)}</span>
    `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function formatDate(dateInput) {
  return new Date(dateInput).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
window.formatDate = formatDate;
document.addEventListener('DOMContentLoaded', () => {
  const pending = sessionStorage.getItem('pendingToast');
  if (!pending) return;
  try {
    const { message, type } = JSON.parse(pending);
    sessionStorage.removeItem('pendingToast');
    showToast(message, type);
  } catch {
    sessionStorage.removeItem('pendingToast');
  }
});
