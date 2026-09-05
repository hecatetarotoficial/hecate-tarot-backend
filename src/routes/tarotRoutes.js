const express = require('express');
const router = express.Router();

const { TAROT_DECK } = require('../data/tarotCards');
const {
  drawCards,
  buildInterpretation,
  buildPaidInterpretation,
  drawYesNoCard,
  buildYesNoInterpretation,
} = require('../services/tarotEngine');
const { generateSpeech } = require('../services/ttsService');
const paymentStore = require('../services/paymentStore');

// GET /api/tarot/cards -> listado completo de las 78 cartas (para el apartado de significados)
router.get('/cards', (req, res) => {
  res.json({ cards: TAROT_DECK });
});

// GET /api/tarot/cards/:id -> detalle de una carta
router.get('/cards/:id', (req, res) => {
  const card = TAROT_DECK.find((c) => c.id === req.params.id);
  if (!card) return res.status(404).json({ error: 'Carta no encontrada' });
  res.json({ card });
});

// POST /api/tarot/instant-reading
// Tirada instantánea para el apartado "Tirada de cartas en el momento".
// La PRIMERA tirada de cada usuario es gratis; a partir de la segunda hay que pagar
// (producto "tirada_extra", ver src/services/stripeService.js).
//
// body: {
//   count?: 1|3|5,
//   focus?: "love"|"work"|"health",
//   isFreeDraw?: boolean,       -> true SOLO en la primera tirada del usuario
//   paymentIntentId?: string,   -> obligatorio si isFreeDraw no es true
// }
//
// AVISO DE SEGURIDAD: como esta app no tiene cuentas de usuario, "ya usó su tirada
// gratis" se controla desde el propio cliente (la app recuerda con AsyncStorage si
// ya usaste tu tirada gratuita). Alguien que manipule la app podría forzar
// isFreeDraw=true varias veces. Para impedirlo del todo, añade autenticación de
// usuarios y controla el conteo de tiradas gratis en el servidor.
router.post('/instant-reading', (req, res) => {
  const count = [1, 3, 5].includes(req.body.count) ? req.body.count : 3;
  const { isFreeDraw, paymentIntentId } = req.body;

  if (!isFreeDraw) {
    if (!paymentIntentId) {
      return res.status(402).json({
        error: 'Esta tirada requiere pago',
        detail: 'Crea un PaymentIntent para el producto "tirada_extra" y complétalo antes de pedir la tirada.',
      });
    }
    const entry = paymentStore.getEntry(paymentIntentId);
    if (!entry || entry.productId !== 'tirada_extra' || !paymentStore.isPaidAndUnconsumed(paymentIntentId)) {
      return res.status(402).json({
        error: 'Pago no confirmado o ya utilizado',
        detail: 'Completa el pago de la tirada extra y espera la confirmación antes de solicitarla.',
      });
    }
    paymentStore.consume(paymentIntentId);
  }

  const cards = drawCards(count);
  const interpretation = buildInterpretation({ cards, focus: req.body.focus });
  res.json({ cards, interpretation: interpretation.text, positions: interpretation.positions });
});

// POST /api/tarot/paid-reading
// Tirada de pago con respuesta narrada por audio a una pregunta concreta.
// Requiere un paymentIntentId ya confirmado como pagado (vía webhook de Stripe).
// body: { question: string, paymentIntentId: string, focus?: "love"|"work"|"health", voice?: string }
router.post('/paid-reading', async (req, res, next) => {
  try {
    const { question, paymentIntentId, focus, voice } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Falta la pregunta' });
    }
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Falta paymentIntentId' });
    }
    if (!paymentStore.isPaidAndUnconsumed(paymentIntentId)) {
      return res.status(402).json({
        error: 'Pago no confirmado o ya utilizado',
        detail: 'Completa el pago y espera la confirmación antes de solicitar la tirada.',
      });
    }

    const cards = drawCards(3); // pasado / presente / futuro para la pregunta
    const interpretation = buildPaidInterpretation({ cards, question, focus });

    let audioBase64 = null;
    let audioError = null;
    try {
      const audioBuffer = await generateSpeech(interpretation.text, { voice });
      audioBase64 = audioBuffer.toString('base64');
    } catch (err) {
      // No bloqueamos la respuesta si el TTS falla: devolvemos el texto igualmente
      // para que la app pueda mostrarlo o usar una voz nativa como alternativa.
      audioError = err.message;
    }

    paymentStore.consume(paymentIntentId);

    res.json({
      cards,
      question,
      interpretation: interpretation.text,
      positions: interpretation.positions,
      audioBase64, // mp3 en base64, o null si el TTS falló
      audioMimeType: 'audio/mpeg',
      audioError,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tarot/yes-no
// Tirada de sí o no: una sola carta, siempre gratis (sin pago ni límite de
// usos), pensada como gancho rápido y muy compartible (p. ej. para clips de
// TikTok). body: { question?: string }
router.post('/yes-no', (req, res) => {
  const { question } = req.body || {};
  const card = drawYesNoCard();
  const interpretation = buildYesNoInterpretation({ card, question });
  res.json({
    card,
    question: question || null,
    interpretation: interpretation.text,
    answer: interpretation.answer,
    answerLabel: interpretation.answerLabel,
  });
});

module.exports = router;
