export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method tidak diizinkan." });
    }

    try {
        const { prompt, model, image } = req.body || {};

        if (!prompt && !image) {
            return res.status(400).json({ error: "Prompt atau gambar kosong." });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API key OPENAI_API_KEY belum dipasang di Vercel." });
        }

                // =========================================================
        // KHUSUS MODEL GEMINI 3.6 FLASH
        // =========================================================
        if (model && model.includes("gemini-3.6-flash")) {
            const geminiKey = process.env.GEMINI_API_KEY;
            if (!geminiKey) {
                return res.status(500).json({ error: "API key GEMINI_API_KEY belum dipasang di Vercel." });
            }

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`;
            
            const parts = [];
            if (prompt) parts.push({ text: prompt });

            if (image) {
                const base64Data = image.split(',')[1] || image;
                const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
                parts.push({
                    inline_data: {
                        mime_type: mimeType,
                        data: base64Data
                    }
                });
            }

            const geminiRes = await fetch(geminiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts }] })
            });

            const geminiData = await geminiRes.json();

            if (!geminiRes.ok) {
                return res.status(geminiRes.status).json({
                    error: geminiData?.error?.message || "Gagal memproses ke Gemini API."
                });
            }

            const outputText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respon dari Gemini.";

            return res.status(200).json({
                kind: "text",
                data: outputText
            });
        }
        

        const selectedModel = (model && model !== "undefined") ? model : "anthropic/claude-sonnet-5";

        // Susun konten pesan (teks & gambar)
        const userContent = [];

        if (prompt) {
            userContent.push({
                type: "text",
                text: prompt
            });
        }

        if (image) {
            userContent.push({
                type: "image_url",
                image_url: {
                    url: image
                }
            });
        }

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
                        content: userContent
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
                error: data?.error?.message || data?.error || `Gagal memproses gambar/prompt.`
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


