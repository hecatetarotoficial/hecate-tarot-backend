const express = require('express');
const router = express.Router();
const { generateAllWeeklyHoroscopes, generateWeeklyHoroscope } = require('../services/horoscopeService');

// GET /api/horoscope -> horóscopo semanal de los 12 signos (gratis, se actualiza solo cada semana)
router.get('/', (req, res) => {
  res.json(generateAllWeeklyHoroscopes(new Date()));
});

// GET /api/horoscope/:signo -> horóscopo semanal de un signo concreto
router.get('/:signo', (req, res) => {
  try {
    const horoscope = generateWeeklyHoroscope(req.params.signo, new Date());
    res.json({ horoscope });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    throw err;
  }
});

module.exports = router;
