document.addEventListener('DOMContentLoaded', () => {
  // === FAKE NEWS ANALYZER ===
  const checkBtn = document.getElementById("checkBtn");
  if (checkBtn) {
    checkBtn.addEventListener("click", analyzeMessage);

    function analyzeMessage() {
      const message = document.getElementById("messageInput").value.toLowerCase();
      const resultBox = document.getElementById("resultBox");
      const resultBadge = document.getElementById("resultBadge");
      const explanation = document.getElementById("resultExplanation");

      const fakeWords = ["click here", "urgent", "free", "giveaway", "palliative", "share to", "cash prize"];
      const spamLinks = ["bit.ly", "tinyurl", "whatsappstatus"];

      let score = 0;

      fakeWords.forEach(word => {
        if (message.includes(word)) score += 2;
      });

      spamLinks.forEach(link => {
        if (message.includes(link)) score += 3;
      });

      let label = "✅ Credible";
      let explanationText = "Message appears neutral and safe.";
      let colorClass = "result-green";

      if (score >= 6) {
        label = "❌ Likely Fake";
        explanationText = "Message contains scammy keywords and suspicious links.";
        colorClass = "result-red";
      } else if (score >= 3) {
        label = "⚠️ Suspicious";
        explanationText = "Message has warning signs. Verify before sharing.";
        colorClass = "result-yellow";
      }

      resultBadge.textContent = label;
      resultBadge.className = colorClass;
      explanation.textContent = explanationText;
      resultBox.classList.remove("hidden");
    }
  }

  // === MOBILE NAVIGATION ===
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  if (menuToggle && navLinks && navBackdrop) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      navBackdrop.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    navBackdrop.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }

  // === LOGGED-IN USER UI ===
  const greetUser = document.getElementById('greetUser');
  const currentUser = localStorage.getItem('naijaUsername');

  if (!currentUser && window.location.pathname !== '/login.html') {
    window.location.href = 'login.html';
  }

  if (greetUser && currentUser) {
    greetUser.textContent = `👋 Hello, ${currentUser}`;
  }

  // === LOGOUT BUTTON ===
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('naijaUsername');
      window.location.href = 'login.html';
    });
  }
});
