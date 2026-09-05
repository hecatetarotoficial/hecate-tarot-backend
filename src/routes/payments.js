const express = require('express');
const router = express.Router();

const { createPaymentIntent, constructWebhookEvent, PRICES } = require('../services/stripeService');
const paypalService = require('../services/paypalService');
const paymentStore = require('../services/paymentStore');

// GET /api/payments/prices -> para que la app muestre los precios actuales
router.get('/prices', (req, res) => {
  res.json({ prices: PRICES, currency: process.env.CURRENCY || 'eur' });
});

// POST /api/payments/paypal/create-order
// body: { productId: "pregunta_tarot" | "carta_astral" | "tirada_premium", metadata?: {} }
// El cliente (app móvil) abre `approveUrl` para que el usuario apruebe el pago en PayPal.
router.post('/paypal/create-order', async (req, res, next) => {
  try {
    const { productId, metadata } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Falta productId' });
    }
    const result = await paypalService.createOrder({ productId, metadata });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/paypal/capture-order
// body: { orderId }
// Se llama cuando el usuario vuelve a la app tras aprobar el pago en PayPal.
router.post('/paypal/capture-order', async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Falta orderId' });
    }
    const result = await paypalService.captureOrder(orderId);
    if (result.completed) {
      paymentStore.markAsPaid(orderId, {
        productId: result.productId,
        metadata: result.metadata,
      });
    }
    res.json({ status: result.status, paid: result.completed, paymentId: orderId });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/create-intent
// body: { productId: "pregunta_tarot" | "carta_astral" | "tirada_premium", metadata?: {} }
router.post('/create-intent', async (req, res, next) => {
  try {
    const { productId, metadata } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Falta productId' });
    }
    const result = await createPaymentIntent({ productId, metadata });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Este handler se registra en server.js con express.raw() ANTES del middleware
// express.json(), porque Stripe necesita el cuerpo sin parsear para verificar la firma.
async function stripeWebhookHandler(req, res) {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = constructWebhookEvent(req.body, signature);
  } catch (err) {
    console.error('Firma de webhook de Stripe inválida:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    paymentStore.markAsPaid(intent.id, {
      productId: intent.metadata && intent.metadata.productId,
      metadata: intent.metadata,
    });
    console.log(`Pago confirmado por webhook: ${intent.id}`);
  }

  res.json({ received: true });
}

module.exports = router;
module.exports.stripeWebhookHandler = stripeWebhookHandler;
