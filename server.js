require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const paymentsRoutes = require('./src/routes/payments');
const ttsRoutes = require('./src/routes/tts');
const tarotRoutes = require('./src/routes/tarotRoutes');
const ritualsRoutes = require('./src/routes/ritualsRoutes');
const astralRoutes = require('./src/routes/astralRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const saintsRoutes = require('./src/routes/saintsRoutes');
const consultaRoutes = require('./src/routes/consultaRoutes');
const horoscopeRoutes = require('./src/routes/horoscopeRoutes');
const legalRoutes = require('./src/routes/legalRoutes');
const { stripeWebhookHandler } = require('./src/routes/payments');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));

// El webhook de Stripe necesita el body "raw", por eso se registra ANTES de express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'tarot-app-backend', time: new Date().toISOString() });
});

app.use('/api/payments', paymentsRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/tarot', tarotRoutes);
app.use('/api/rituals', ritualsRoutes);
app.use('/api/astral', astralRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/saints', saintsRoutes);
app.use('/api/consulta', consultaRoutes);
app.use('/api/horoscope', horoscopeRoutes);
app.use('/api/legal', legalRoutes);

// Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor de la app de tarot escuchando en http://localhost:${PORT}`);
});
