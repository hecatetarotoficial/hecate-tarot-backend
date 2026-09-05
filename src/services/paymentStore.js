/**
 * Almacén muy simple en memoria para registrar qué PaymentIntents de Stripe
 * se han confirmado como pagados (vía webhook) y si ya se han "consumido"
 * (es decir, si ya se generó la tirada/respuesta de audio para ese pago).
 *
 * IMPORTANTE: esto es solo para desarrollo/demo. En producción debes sustituirlo
 * por una base de datos real (Postgres, MongoDB, etc.) para no perder el estado
 * al reiniciar el servidor y para poder escalar a varias instancias.
 */

const paidIntents = new Map(); // paymentIntentId -> { productId, metadata, consumed, paidAt }

function markAsPaid(paymentIntentId, { productId, metadata }) {
  paidIntents.set(paymentIntentId, {
    productId,
    metadata,
    consumed: false,
    paidAt: new Date().toISOString(),
  });
}

function isPaidAndUnconsumed(paymentIntentId) {
  const entry = paidIntents.get(paymentIntentId);
  return !!entry && !entry.consumed;
}

/**
 * Comprueba que un pago se ha confirmado, SIN marcarlo como consumido.
 * Se usa para productos de "desbloqueo permanente" (como el curso de tarot),
 * donde el mismo pago debe seguir dando acceso la próxima vez que se abra la app.
 */
function isPaid(paymentIntentId, productId) {
  const entry = paidIntents.get(paymentIntentId);
  if (!entry) return false;
  if (productId && entry.productId !== productId) return false;
  return true;
}

function consume(paymentIntentId) {
  const entry = paidIntents.get(paymentIntentId);
  if (entry) entry.consumed = true;
}

function getEntry(paymentIntentId) {
  return paidIntents.get(paymentIntentId);
}

module.exports = { markAsPaid, isPaidAndUnconsumed, isPaid, consume, getEntry };
