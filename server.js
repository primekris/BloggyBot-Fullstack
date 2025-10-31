require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

app.get('/', (req, res) => {
    res.send('✅ BloggyBot backend is alive!');
});

app.post('/chat', async (req, res) => {
    const { message, persona = "I AM  helpful assistant from Bloggy.THANK YOU!" } = req.body;

    try {
        const prompt = `${persona}\nUser: ${message}\nAssistant:`;

        const response = await axios.post(
            "https://api.together.xyz/inference",
            {
                model: "mistralai/Mistral-7B-Instruct-v0.2",
                prompt,
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 512,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // ✅ Correct extraction
        const reply = response.data.output?.choices?.[0]?.text || "No response.";

        return res.json({ output: reply }); // ✅ return prevents multiple headers

    } catch (err) {
        console.error("TOGETHER API ERROR:", err.response?.data || err.message);
        return res.status(500).json({
            error: "Together API request failed",
            details: err.response?.data
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ BloggyBot server running on http://localhost:${PORT}`);
});
