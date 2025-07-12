// api/index.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/api/describe', async (req, res) => {
  const { prompt } = req.body;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `Describe this with casual hate: ${prompt}` }
      ],
      max_tokens: 60
    })
  });

  const data = await response.json();
  res.json(data);
});

app.post('/api/image', async (req, res) => {
  const { prompt } = req.body;
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      n: 1,
      size: '256x256'
    })
  });

  const data = await response.json();
  res.json(data);
});

module.exports = app;
