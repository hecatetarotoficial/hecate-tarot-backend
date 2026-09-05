const express = require('express');
const router = express.Router();

const paymentStore = require('../services/paymentStore');
const { generateReply } = require('../services/hekateChatService');

// Producto de Stripe para desbloquear la consulta (ver PRICES en stripeService.js).
const PRODUCT_ID = 'consulta_chat';

// POST /api/consulta/message
// Envía un mensaje del usuario y devuelve la respuesta de Hekate.
//
// body: {
//   paymentIntentId: string,        // el PaymentIntent con el que se pagó la consulta
//   message: string,                // el mensaje que escribe el usuario
//   history?: [{ role: 'user'|'hekate', text: string }],  // opcional, para variar el tono
// }
//
// Igual que el desbloqueo de los cursos, este pago NO se consume: una vez
// pagado, el mismo paymentIntentId sirve para seguir chateando en esta y en
// futuras aperturas de la app (guárdalo con AsyncStorage en el dispositivo).
router.post('/message', (req, res) => {
  const { paymentIntentId, message, history } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ error: 'Falta paymentIntentId' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Falta message' });
  }
  if (!paymentStore.isPaid(paymentIntentId, PRODUCT_ID)) {
    return res.status(402).json({
      error: 'Consulta no desbloqueada',
      detail: 'Completa el pago de la consulta y espera la confirmación del webhook antes de chatear con Hekate.',
    });
  }

  const result = generateReply({ message, history: Array.isArray(history) ? history : [] });
  res.json(result);
});

// GET /api/consulta/status/:paymentIntentId
// Comprueba rápidamente si un paymentIntentId ya da acceso a la consulta
// (útil para que la app decida, al abrir, si mostrar el chat o la pantalla de pago).
router.get('/status/:paymentIntentId', (req, res) => {
  const unlocked = paymentStore.isPaid(req.params.paymentIntentId, PRODUCT_ID);
  res.json({ unlocked });
});

module.exports = router;
