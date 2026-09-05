const express = require('express');
const router = express.Router();
const { SAINTS } = require('../data/saints');

// GET /api/saints -> listado completo de santos (nombre, patronazgo, oración, etc.)
router.get('/', (req, res) => {
  res.json({ saints: SAINTS });
});

// GET /api/saints/:id
router.get('/:id', (req, res) => {
  const saint = SAINTS.find((s) => s.id === req.params.id);
  if (!saint) return res.status(404).json({ error: 'Santo no encontrado' });
  res.json({ saint });
});

module.exports = router;
