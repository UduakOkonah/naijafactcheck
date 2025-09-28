import { simulateAIAnalysis } from './ai-sim.js';
import { analyzeWithHuggingFace } from './huggingface.js';

let scamPhrases = [];
const checkBtn = document.getElementById("checkBtn");
const loadingMsg = document.getElementById("loadingMsg");

if (checkBtn) checkBtn.disabled = true;

// Load scam phrases
if (checkBtn && loadingMsg) {
  fetch('/data/scam_phrases_nigeria_2000.json')
    .then(response => response.json())
    .then(data => {
      scamPhrases = data.phrases || [];
      checkBtn.disabled = false;
      loadingMsg.style.display = 'none';
    })
    .catch(err => {
      console.error("❌ Error loading scam phrases:", err);
      scamPhrases = [];
    });
}



  fetch('/data/scam_messages_nigeria.json')
  .then(res => res.json())
  .then(messages => {
    messages.forEach(msg => {
      const result = simulateAIAnalysis(msg);
      // console.log("📩 Message:", msg);
      // console.log("🧠 AI Suggestion:", result.suggestion);
      // console.log("🔎 Confidence:", result.confidence);
      // console.log("===========");
    });
  })
  .catch(err => console.error("Failed to load messages:", err));

function mapLabel(label) {
  const tag = label.toUpperCase();

  // Handle Hugging Face labels
  if (tag === "LABEL_1") return "❌ Scam or Spam";
  if (tag === "LABEL_0") return "✅ Legitimate";

  // For other models or label types
  const lowerTag = label.toLowerCase();
  if (["spam", "toxic", "offensive", "inappropriate"].includes(lowerTag)) {
    return "❌ Scam or Spam";
  }

  if (["ham", "legit", "neutral"].includes(lowerTag)) {
    return "✅ Legitimate";
  }

  return "⚠️ Unknown";
}


document.addEventListener('DOMContentLoaded', () => {
  if (!checkBtn) return;

  checkBtn.addEventListener("click", async () => {
    const message = document.getElementById("messageInput").value.toLowerCase();
    const resultBox = document.getElementById("resultBox");
    const resultBadge = document.getElementById("resultBadge");
    const explanation = document.getElementById("resultExplanation");
    const aiBox = document.getElementById("aiSuggestionBox");


    aiBox.innerHTML = ""; // Clear previous AI results

    const spamLinks = [
      "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "shorte.st", "adf.ly",
      "rebrand.ly", "lnkd.in", "linktr.ee", "whatsappstatus", "wa.me", "myaccounthere.com",
      "grabreward.ng", "govtcredit.site", "nairapromo.xyz", "claimgift.org", "rechargeoffer.me",
      "promohub.ng", "winreward.site", "nairawin.org", "appgiveaway.com", "tiktokrewards.xyz",
      "federalgrant.info", "easyalert.org", "quickcash.site", "cbnpromo.ng", "govupdates.today",
      "urgentfund.site", "freeairtime.me", "ngcashhub.com", "9jarewards.info", "loandash.xyz",
      "scam-checker.com", "gbapps.download", "rewardclaim.net", "t.me/updates", "telegramgroup.xyz",
      "freegift.ng", "cashlink.site", "xbit.ly", "creditlink.org", "govhelpdesk.site",
      "airtimevoucher.net", "dashrewards.xyz", "whatsappbonus.com", "claimpage.site",
      "redirectlink.xyz", "mobilereward.org", "alerts.ng", "grantclaim.org", "fundalert.me",
      "scamdealz.com", "getdatabundle.ng", "fakeupdate.site", "flashrewardz.xyz",
      "reward.ng", "quicklink.click", "joinnow.site", "promo.win", "fakeclaim.net"
    ];

      // Score-based detection
  let score = 0;
  const cleanMsg = message.replace(/[^\w\s₦]/gi, '').toLowerCase();

  scamPhrases.forEach(word => {
    if (cleanMsg.includes(word.toLowerCase())) {
      console.log("✅ Matched scam phrase:", word);
      score += 2;
    }
  });

  score += spamLinks.some(link => cleanMsg.includes(link)) ? 3 : 0;

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

  // Try Hugging Face First
  try {
    const hfAnalysis = await analyzeWithHuggingFace(message);
    const rawLabel = hfAnalysis.top.label;
    const mappedLabel = mapLabel(rawLabel);
    const hfConfidence = hfAnalysis.top.score;
    const hfIsScam = rawLabel.toLowerCase() === "label_1" || ["scam", "spam", "toxic"].includes(rawLabel.toLowerCase());

    console.log("📥 Hugging Face raw:", hfAnalysis);

    aiBox.innerHTML += `
      <h4>🤖 Hugging Face AI</h4>
      <p><strong>Label:</strong> ${mappedLabel}</p>
      <p><strong>Confidence:</strong> ${(hfConfidence * 100).toFixed(2)}%</p>
      <p style="font-size: 0.85em; color: gray;">Raw label: ${rawLabel}</p>
    `;

    if (hfIsScam && hfConfidence >= 0.7) {
      label = "❌ Likely Fake";
      explanationText = "Hugging Face AI flagged this as scam/spam with high confidence.";
      colorClass = "result-red";
    }

  } catch (error) {
    console.error("⚠️ Hugging Face API error. Falling back to local AI...", error);

    const aiResult = simulateAIAnalysis(message);

    aiBox.innerHTML += `
      <h4>🧠 Local AI (Simulated)</h4>
      <p><strong>Confidence:</strong> ${aiResult.confidence || "N/A"}</p>
      <p>${aiResult.suggestion}</p>
    `;

    if (aiResult.flag && label === "✅ Credible") {
      label = "⚠️ AI-Flagged";
      explanationText = "Simulated AI flagged this as potentially misleading. Review carefully.";
      colorClass = "result-yellow";
    }
  }

  // Update final UI
  resultBadge.textContent = label;
  resultBadge.className = colorClass;
  explanation.textContent = explanationText;
  resultBox.classList.remove("hidden");
  aiBox.classList.remove("hidden");

    // Show Local AI (Simulated)
    aiBox.innerHTML += `
      <h4>🧠 Local AI (Simulated)</h4>
      <p><strong>Confidence:</strong> ${aiResult.confidence || "N/A"}</p>
      <p>${aiResult.suggestion}</p>
    `;

    // Hugging Face Analysis
    try {
      const hfAnalysis = await analyzeWithHuggingFace(message);
      const rawLabel = hfAnalysis.top.label;
      const mappedLabel = mapLabel(rawLabel);

      console.log("📥 Hugging Face raw:", hfAnalysis);
      console.log("📌 Top Label:", rawLabel);

      aiBox.innerHTML += `
        <h4>🤖 Hugging Face AI</h4>
        <p><strong>Label:</strong> ${mappedLabel}</p>
        <p><strong>Confidence:</strong> ${(hfAnalysis.top.score * 100).toFixed(2)}%</p>
        <p style="font-size: 0.85em; color: gray;">Raw label: ${rawLabel}</p>
      `;

  const hfConfidence = hfAnalysis.top.score;
  const hfIsScam = rawLabel.toLowerCase() === "label_1" || ["scam", "spam", "toxic"].includes(rawLabel.toLowerCase());

  if (hfIsScam && hfConfidence >= 0.7) {
    label = "❌ Likely Fake";
    explanationText = "Hugging Face AI flagged this as scam/spam with high confidence.";
    colorClass = "result-red";

    // Override UI
    resultBadge.textContent = label;
    resultBadge.className = colorClass;
    explanation.textContent = explanationText;
  }

    } catch (error) {
      console.error("Hugging Face API error:", error);
      aiBox.innerHTML += `<p>❌ Hugging Face API error</p>`;
    }
    aiBox.classList.remove("hidden");
  });
});


  // === MOBILE NAV ===
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

  // === USER UI ===
  const greetUser = document.getElementById('greetUser');
  const currentUser = localStorage.getItem('naijaUsername');

  if (!currentUser && window.location.pathname !== '/login.html') {
    window.location.href = 'login.html';
  }

  if (greetUser && currentUser) {
    greetUser.textContent = `👋 Hello, ${currentUser}`;
  }

  // === LOGOUT ===
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('naijaUsername');
      window.location.href = 'login.html';
    });
  }
  const showHistoryBtn = document.getElementById("showHistoryBtn");
  if (showHistoryBtn) {
    showHistoryBtn.addEventListener("click", renderHistory);
  }

  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearHistory);
  }
