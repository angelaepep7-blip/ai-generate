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
                button: "✨ Generate AI"
            },
            {
                id: "duckai/claude-opus-4.8",
                label: "Claude Opus 4.8",
                button: "✨ Generate AI"
            },
            {
                id: "openai/gpt-6-luna",
                label: "GPT-6 Luna",
                button: "✨ Generate AI"
            },
            {
                id: "deepseek/deepseek-v4-pro-0813",
                label: "DeepSeek V4 Pro",
                button: "✨ Generate AI"
            }
        ]
    });
}


