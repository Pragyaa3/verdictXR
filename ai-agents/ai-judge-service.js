const express = require('express');
// const fetch = require('node-fetch'); // Not needed in Node.js v24+
const cors = require('cors');
const fs = require('fs');
console.log('Does .env exist?', fs.existsSync('./prompts/.env'));
require('dotenv').config({ path: './prompts/.env' });

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('Loaded GEMINI_API_KEY:', GEMINI_API_KEY);

app.post('/ai-judge', async (req, res) => {
  try {
    const { trial } = req.body;
    console.log('Received trial:', trial);
    if (!trial) {
      return res.status(400).json({ error: 'Missing trial data' });
    }
    const prompt = `You are an impartial AI judge. Here is the trial data:\n${JSON.stringify(trial, null, 2)}\nBased on the evidence and arguments, provide a clear and concise verdict and reasoning.`;

    // Call Gemini API
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });
    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', geminiData);
    const verdict = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No verdict returned.';

    res.json({ verdict });
  } catch (err) {
    console.error('AI Judge error:', err);
    res.status(500).json({ error: 'AI Judge service error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AI Judge service running on port ${PORT}`)); 