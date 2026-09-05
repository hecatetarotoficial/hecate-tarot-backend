const express = require('express');
const router = express.Router();
const { RITUALS, CATEGORIES } = require('../data/rituals');

// GET /api/rituals -> todos los rituales, opcionalmente filtrados por categoría
// query: ?category=limpieza|abrecaminos|amor|oraciones
router.get('/', (req, res) => {
  const { category } = req.query;
  const rituals = category ? RITUALS.filter((r) => r.category === category) : RITUALS;
  res.json({ categories: CATEGORIES, rituals });
});

// GET /api/rituals/:id
router.get('/:id', (req, res) => {
  const ritual = RITUALS.find((r) => r.id === req.params.id);
  if (!ritual) return res.status(404).json({ error: 'Ritual no encontrado' });
  res.json({ ritual });
});

module.exports = router;
