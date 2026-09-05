const express = require('express');
const router = express.Router();
const { calculateNatalChart } = require('../services/astrologyService');

// POST /api/astral/chart
// body: {
//   year, month (1-12), day, hour (0-23, opcional), minute (opcional),
//   utcOffsetHours (opcional, ej. 1 o 2 para España), latitude (opcional), longitude (opcional)
// }
router.post('/chart', (req, res, next) => {
  try {
    const chart = calculateNatalChart(req.body);
    res.json({ chart });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
});

module.exports = router;
