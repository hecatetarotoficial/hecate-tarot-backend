const express = require('express');
const router = express.Router();
const { generateSpeech } = require('../services/ttsService');

// POST /api/tts/speak
// body: { text: "..." , voice?: "nova", model?: "tts-1" }
// Devuelve audio/mpeg en el cuerpo de la respuesta (streaming directo a la app).
router.post('/speak', async (req, res, next) => {
  try {
    const { text, voice, model } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Falta el texto a convertir en audio' });
    }
    const audioBuffer = await generateSpeech(text, { voice, model });
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
    });
    res.send(audioBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
