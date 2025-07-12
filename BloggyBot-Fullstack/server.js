const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || 'tgp_v1_UDj9FvOUFoGo8r5DILfuH1Ic2vV3DB4URirwmd4Mmmw';

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ BloggyBot backend is alive!');
});

// ✅ Main chat handler using Together inference endpoint
app.post('/chat', async (req, res) => {
  const { message, persona = "You are a helpful assistant from Bloggy." } = req.body;

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

    const reply = response.data.output || "No response.";
    res.json({ output: reply }); // Send response in frontend-compatible format
  } catch (err) {
    console.error("TOGETHER API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Together API request failed", details: err.response?.data });
  }
});

app.listen(PORT, () => {
  console.log(`✅ BloggyBot server running on http://localhost:${PORT}`);
});
