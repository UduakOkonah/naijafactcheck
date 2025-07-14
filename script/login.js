document.addEventListener('DOMContentLoaded', () => {
  const showLoginBtn = document.getElementById('showLoginBtn');
  const showSignupBtn = document.getElementById('showSignupBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginError = document.getElementById('loginError');
  const signupError = document.getElementById('signupError');

  // Exit early if we're not on the login/signup page
  if (!loginForm || !signupForm) return;

  // === TOGGLE BUTTONS ===
  showLoginBtn?.addEventListener('click', () => {
    loginForm.hidden = false;
    signupForm.hidden = true;
    showLoginBtn.classList.add('active');
    showSignupBtn.classList.remove('active');
    loginError.textContent = '';
    signupError.textContent = '';
  });

  showSignupBtn?.addEventListener('click', () => {
    loginForm.hidden = true;
    signupForm.hidden = false;
    showSignupBtn.classList.add('active');
    showLoginBtn.classList.remove('active');
    loginError.textContent = '';
    signupError.textContent = '';
  });

  // === LOGIN ===
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    loginError.textContent = '';

    const username = loginForm.loginUsername.value.trim();
    const password = loginForm.loginPassword.value;

    if (!username || !password) {
      loginError.textContent = 'Please enter both username and password.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('naijaUsers')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      loginError.textContent = 'Invalid username or password';
    } else {
      localStorage.setItem('naijaUsername', user.username);
      window.location.href = 'index.html'; // redirect
    }
  });

  // === SIGNUP ===
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    signupError.textContent = '';

    const username = signupForm.signupUsername.value.trim();
    const email = signupForm.signupEmail.value.trim();
    const password = signupForm.signupPassword.value;
    const confirmPassword = signupForm.signupConfirmPassword.value;

    if (!username || !email || !password || !confirmPassword) {
      signupError.textContent = 'Please fill in all fields.';
      return;
    }

    if (password !== confirmPassword) {
      signupError.textContent = 'Passwords do not match.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('naijaUsers')) || [];

    if (users.some(u => u.username === username)) {
      signupError.textContent = 'Username already exists.';
      return;
    }

    if (users.some(u => u.email === email)) {
      signupError.textContent = 'Email already registered.';
      return;
    }

    // Save new user
    users.push({ username, email, password });
    localStorage.setItem('naijaUsers', JSON.stringify(users));
    localStorage.setItem('naijaUsername', username);

    window.location.href = 'index.html';
  });
});
