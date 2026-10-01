export default function handler(req, res) {
    return res.status(200).json({
        apis: [
            {
                id: "gpt-3.5-turbo",
                label: "GPT-3.5 Turbo",
                button: "✨ Generate AI"
            },
            {
                id: "gpt-4o",
                label: "GPT-4o",
                button: "✨ Generate AI"
            }
        ]
    });
}

