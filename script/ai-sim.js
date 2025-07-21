export function simulateAIAnalysis(message) {
  const response = {
    suggestion: "",
    confidence: "Medium",
    flag: false
  };

  const lowerMsg = message.toLowerCase();

  // Expanded scam phrases (Nigerian context)
  const scamPhrases = [
    "palliative", "cash prize", "giveaway", "fg grant", "you won", "congratulations you’ve won",
    "urgent help needed", "claim your reward", "send your account details", "lottery winner",
    "win ₦50,000", "get paid instantly", "free airtime", "approved grant", "cbn empowerment fund",
    "fg empowerment", "free recharge card", "just pay delivery", "your bvn is blocked", "update your kyc",
    "miracle center", "airdrop alert", "btc investment", "make money fast", "referral bonus"
  ];

  // Suspicious link domains
  const suspiciousLinks = [
    "bit.ly", "tinyurl", "t.co", "goo.gl", "ow.ly", "is.gd", "shorte.st", "adf.ly", "rebrand.ly",
    "grabreward", "nairapromo", "govtcredit", "cbnpromo", "freegift", "rewardclaim", "redirectlink",
    "fakeupdate", "mobilereward", "flashreward", "urgentfund", "claimpage", "dashreward", "linktr.ee"
  ];

  const hasScamPhrase = scamPhrases.some(p => lowerMsg.includes(p));
  const hasSuspiciousLink = suspiciousLinks.some(link => lowerMsg.includes(link));

  // === High Risk: Scam + Link
  if (hasScamPhrase && hasSuspiciousLink) {
    response.suggestion = `🚨 This message contains **both scam phrases and suspicious links**. Do NOT click or forward. Verify on [Dubawa](https://dubawa.org) or scan the link via [CheckShortURL](https://checkshorturl.com).`;
    response.confidence = "High";
    response.flag = true;

  // === Medium Risk: Only Link
  } else if (hasSuspiciousLink) {
    response.suggestion = `⚠️ This message includes a **shortened or disguised link**, which is often used to hide scam sites. Use [CheckShortURL](https://checkshorturl.com) to inspect it before clicking.`;
    response.confidence = "Medium";
    response.flag = true;

  // === Medium–High Risk: Only Scam Phrases
  } else if (hasScamPhrase) {
    response.suggestion = `🚩 This message contains **phrases linked to common scams in Nigeria**. Cross-check the claims via [AfricaCheck](https://africacheck.org) or trusted news sources.`;
    response.confidence = "High";
    response.flag = true;

  // === Low Risk
  } else {
    response.suggestion = "✅ No strong signs of fake news detected. Still, verify anything that seems too good to be true.";
    response.confidence = "Low";
    response.flag = false;
  }

  return response;
}
