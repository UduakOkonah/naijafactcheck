// share.js
document.addEventListener('DOMContentLoaded', () => {
  const shareBtn = document.getElementById("shareButton");

  if (shareBtn) {
    shareBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const shareData = {
        title: "NaijaFactCheck",
        text: "🕵️‍♀️ Help stop scam messages in Nigeria! Use this tool to verify suspicious messages.",
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          console.log("✅ Shared successfully");
        } catch (err) {
          console.error("❌ Share failed:", err);
        }
      } else {
        // Fallback: copy URL to clipboard
        const fullMessage = `${shareData.text} ${shareData.url}`;
        try {
          await navigator.clipboard.writeText(fullMessage);
          alert("🔗 Link copied to clipboard. You can now paste it anywhere to share.");
        } catch (err) {
          console.error("Clipboard copy failed:", err);
          alert("❌ Copy to clipboard failed. Please copy the link manually.");
        }
      }
    });
  }
});
