const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('xxxx')) {
  console.warn(
    '[stripeService] AVISO: STRIPE_SECRET_KEY no está configurada (o sigue siendo el valor de ejemplo). ' +
    'Los pagos reales no funcionarán hasta que configures tu .env con tus claves de Stripe.'
  );
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const CURRENCY = process.env.CURRENCY || 'eur';
const PRICE_PER_QUESTION_CENTS = parseInt(process.env.PRICE_PER_QUESTION_CENTS || '299', 10);
const PRICE_PER_EXTRA_DRAW_CENTS = parseInt(process.env.PRICE_PER_EXTRA_DRAW_CENTS || '99', 10);
const PRICE_COURSE_CENTS = parseInt(process.env.PRICE_COURSE_CENTS || '999', 10);
const PRICE_FENGSHUI_COURSE_CENTS = parseInt(process.env.PRICE_FENGSHUI_COURSE_CENTS || '1499', 10);
const PRICE_CONSULTA_CENTS = parseInt(process.env.PRICE_CONSULTA_CENTS || '299', 10);

/**
 * Precios de los distintos productos de la app.
 * Ajusta estos valores (en céntimos) a tu modelo de negocio real.
 */
const PRICES = {
  pregunta_tarot: PRICE_PER_QUESTION_CENTS, // una pregunta respondida por audio
  carta_astral: 0, // carta astral completa: GRATUITA (no requiere pago; ver astralRoutes.js)
  tirada_extra: PRICE_PER_EXTRA_DRAW_CENTS, // 2ª tirada instantánea en adelante (la 1ª es gratis)
  curso_tarot: PRICE_COURSE_CENTS, // curso de iniciación al tarot (desbloqueo permanente)
  curso_fengshui: PRICE_FENGSHUI_COURSE_CENTS, // curso de feng shui en el hogar (desbloqueo permanente, independiente del de tarot)
  consulta_chat: PRICE_CONSULTA_CENTS, // consulta en chat continuo con Hekate (pago único, desbloqueo permanente)
};

/**
 * Crea un PaymentIntent de Stripe para un producto concreto.
 * El cliente (app móvil) usa el client_secret devuelto para completar el pago
 * con el Payment Sheet de @stripe/stripe-react-native.
 */
async function createPaymentIntent({ productId, metadata = {} }) {
  const amount = PRICES[productId];
  if (!amount) {
    const err = new Error(`Producto desconocido: ${productId}`);
    err.status = 400;
    throw err;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: CURRENCY,
    automatic_payment_methods: { enabled: true },
    metadata: { productId, ...metadata },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount,
    currency: CURRENCY,
  };
}

function constructWebhookEvent(rawBody, signature) {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

module.exports = {
  stripe,
  PRICES,
  createPaymentIntent,
  constructWebhookEvent,
};
