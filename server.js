const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // ✅ serve frontend

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

app.post('/api/chat', async (req, res) => {
  const { message, model = "mistral-7b-instruct", persona = "You are a helpful assistant." } = req.body;
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: persona },
          { role: "user", content: message }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("TOGETHER API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Together API request failed", details: err.response?.data });
  }
});

// ✅ Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ BloggyBot server running on http://localhost:${PORT}`);
});
