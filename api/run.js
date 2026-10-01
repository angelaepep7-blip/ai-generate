export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method tidak diizinkan." });
    }

    try {
        const { prompt } = req.body || {};

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ error: "Prompt kosong." });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API key OPENAI_API_KEY belum dipasang di Vercel." });
        }

        // Kirim request ke RumahAI
        const response = await fetch("https://rumahai.net/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Diganti ke model standar yang stabil
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                stream: false,
                temperature: 0.7
            })
        });

        const rawText = await response.text();
        let data;

        try {
            data = JSON.parse(rawText);
        } catch (e) {
            return res.status(500).json({ 
                error: `RumahAI mengembalikan respon non-JSON: ${rawText.substring(0, 100)}` 
            });
        }

        if (!response.ok) {
            return res.status(response.status).json({
                error: data?.error?.message || data?.error || "RumahAI gagal memproses permintaan."
            });
        }

        const output = data?.choices?.[0]?.message?.content || "";

        if (!output) {
            return res.status(500).json({ error: "AI mengembalikan hasil kosong." });
        }

        return res.status(200).json({
            kind: "text",
            data: output
        });

    } catch (error) {
        console.error("RUN API ERROR:", error);
        return res.status(500).json({ error: error.message || "Terjadi kesalahan pada server." });
    }
}
