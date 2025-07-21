export async function analyzeWithHuggingFace(message) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: message })
    });

    const result = await response.json();
    console.log("🔍 Hugging Face raw result:", result);

    let topResult;

    if (Array.isArray(result) && Array.isArray(result[0])) {
      topResult = result[0].sort((a, b) => b.score - a.score)[0];
    } else if (Array.isArray(result)) {
      topResult = result.sort((a, b) => b.score - a.score)[0];
    } else {
      throw new Error("Unexpected response format from Hugging Face");
    }

    return {
      top: topResult,
      raw: result
    };

  } catch (error) {
    console.error("❌ Hugging Face proxy error:", error);
    throw error;
  }
}
