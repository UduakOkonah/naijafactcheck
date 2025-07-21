export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
  const input = req.body.inputs;

  try {
    const hfRes = await fetch("https://api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-sms-spam-detection", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: input })
    });

    const result = await hfRes.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "API call failed", detail: err.message });
  }
}

