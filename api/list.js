export default function handler(req, res) {
    return res.status(200).json({
        apis: [
            {
                id: "anthropic/claude-sonnet-5",
                label: "Claude Sonnet 5",
                button: "✨ Generate AI"
            },
            {
                id: "duckai/gpt-5.6-luna",
                label: "GPT-5.6 Luna",
                button: "⭐ Generate AI"
            },
            {
                id: "openai/gpt-6-luna",
                label: "GPT-6 Luna",
                button: "🌟 Generate promt"
            },
            {
                id: "openai/gemini-3.6-flash (maintenance)",
                label: "Gemini 3.6 flash",
                button: "⚡ generate promt"
            }
        ]
    });
}


