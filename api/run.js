export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method tidak diizinkan." });
    }

    try {
        const { prompt, model } = req.body || {};

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ error: "Prompt kosong." });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API key OPENAI_API_KEY belum dipasang di Vercel." });
        }

        // Menggunakan ID model resmi RumahAI
        const selectedModel = (model && model !== "undefined") ? model : "anthropic/claude-sonnet-5";

        const response = await fetch("https://rumahai.net/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: selectedModel,
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
                error: `RumahAI merespons: ${rawText.substring(0, 100)}` 
            });
        }

        if (!response.ok) {
            return res.status(response.status).json({
                error: data?.error?.message || data?.error || `Model '${selectedModel}' gagal diproses oleh RumahAI.`
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

