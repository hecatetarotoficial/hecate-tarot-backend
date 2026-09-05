/**
 * Integración con la API REST de PayPal (Orders v2) para cobros reales.
 *
 * Flujo: la app crea un "pedido" (createOrder) -> el usuario lo aprueba en
 * PayPal (abriendo la URL de aprobación que devuelve createOrder) -> la app
 * confirma el cobro (captureOrder) cuando el usuario vuelve ya aprobado.
 *
 * No usamos el SDK oficial de Node de PayPal (está en modo mantenimiento);
 * llamamos directamente a la API REST con fetch, que ya viene incluido en
 * Node 18+.
 */

const PAYPAL_MODE = process.env.PAYPAL_MODE === 'sandbox' ? 'sandbox' : 'live';
const BASE_URL =
  PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID.includes('xxxx')) {
  console.warn(
    '[paypalService] AVISO: PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET no configurados. ' +
    'Los pagos reales con PayPal no funcionarán hasta rellenar el .env.'
  );
}

const CURRENCY = (process.env.CURRENCY || 'eur').toUpperCase();

// Reutilizamos la misma tabla de precios que ya usa Stripe, para no duplicar
// la configuración de precios en dos sitios.
const { PRICES } = require('./stripeService');

let cachedToken = null; // { accessToken, expiresAt }

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.accessToken;
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`No se pudo autenticar con PayPal (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.accessToken;
}

/**
 * Crea un pedido de PayPal para un producto de la tienda.
 * Devuelve el id del pedido y el enlace de aprobación que el usuario debe abrir.
 */
async function createOrder({ productId, metadata = {} }) {
  const amountCents = PRICES[productId];
  if (!amountCents) {
    const err = new Error(`Producto desconocido: ${productId}`);
    err.status = 400;
    throw err;
  }

  const accessToken = await getAccessToken();
  const value = (amountCents / 100).toFixed(2);

  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: productId,
          custom_id: JSON.stringify({ productId, ...metadata }).slice(0, 255),
          amount: { currency_code: CURRENCY, value },
        },
      ],
      application_context: {
        brand_name: 'Hécate — Tarot & Rituals',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        // Esquema propio de la app (definido en mobile/app.json -> "scheme"),
        // para que el sistema operativo devuelva el control a la app en cuanto
        // el usuario aprueba o cancela el pago en el navegador de PayPal.
        return_url: 'hekatetarot://paypal-return',
        cancel_url: 'hekatetarot://paypal-cancel',
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`No se pudo crear el pedido de PayPal (${res.status}): ${text}`);
  }

  const order = await res.json();
  const approveLink = (order.links || []).find((l) => l.rel === 'approve');

  return {
    orderId: order.id,
    approveUrl: approveLink ? approveLink.href : null,
    amount: amountCents,
    currency: CURRENCY.toLowerCase(),
  };
}

/**
 * Confirma (captura) el cobro de un pedido ya aprobado por el usuario.
 */
async function captureOrder(orderId) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`No se pudo capturar el pago de PayPal (${res.status}): ${JSON.stringify(data)}`);
  }

  const completed = data.status === 'COMPLETED';
  let productId = null;
  let metadata = {};
  try {
    const purchaseUnit = data.purchase_units && data.purchase_units[0];
    if (purchaseUnit && purchaseUnit.custom_id) {
      const parsed = JSON.parse(purchaseUnit.custom_id);
      productId = parsed.productId;
      metadata = parsed;
    }
  } catch (e) {
    // custom_id no parseable; seguimos sin productId
  }

  return { completed, status: data.status, productId, metadata };
}

module.exports = { PRICES, getAccessToken, createOrder, captureOrder };
