const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_MODEL_URL = process.env.HF_MODEL_URL || 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';

// Helper: call HuggingFace Inference API
async function callHuggingFace(prompt) {
  const response = await fetch(HF_MODEL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.3,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace API error: ${response.status} - ${err}`);
  }

  const data = await response.json();

  // HF returns an array: [{ generated_text: "..." }]
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text;
  }

  throw new Error('Unexpected HuggingFace response format');
}

// @route POST /api/ai/match
router.post('/match', protect, async (req, res) => {
  try {
    const { problem, userLocation, workers } = req.body;

    if (!problem || !workers || workers.length === 0) {
      return res.status(400).json({ message: 'Missing problem description or workers list' });
    }

    // Prepare Mistral-compatible instruct prompt
    const workerList = JSON.stringify(
      workers.map(w => ({
        id: w.userId._id,
        name: w.userId.name,
        category: w.category,
        rating: w.rating,
        skills: w.skills,
        rate: w.hourlyRate,
      }))
    );

    const prompt = `<s>[INST] You are an AI assistant matching a customer with local repair workers.
Customer Problem: "${problem}"
Customer Location: "${userLocation}"

Available workers (JSON):
${workerList}

Return ONLY a valid JSON array (no markdown, no explanation) of the best 3 matches in this exact format:
[
  { "workerId": "id_here", "name": "name_here", "reason": "Short reason why they match", "score": 95 }
]
[/INST]`;

    // Only call API if token is configured
    if (HF_API_TOKEN && HF_API_TOKEN.length > 20) {
      try {
        const responseText = await callHuggingFace(prompt);

        // Extract JSON array from the response text
        const jsonStart = responseText.indexOf('[');
        const jsonEnd = responseText.lastIndexOf(']') + 1;

        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          const jsonStr = responseText.substring(jsonStart, jsonEnd);
          const recommendations = JSON.parse(jsonStr);
          return res.json(recommendations);
        }
      } catch (apiError) {
        console.error('HuggingFace API call failed, falling back to mock:', apiError.message);
        // Fall through to mock response
      }
    }

    // Fallback mock output if API token is missing or call fails
    const mockRecommendations = workers.slice(0, 3).map((w, index) => ({
      workerId: w.userId._id,
      name: w.userId.name,
      reason: `${w.userId.name} is highly rated for ${w.category} work.`,
      score: 95 - index * 5,
    }));

    res.json(mockRecommendations);

  } catch (error) {
    console.error('AI Matching Error:', error);
    res.status(500).json({ message: 'Server error during AI matching' });
  }
});

module.exports = router;
