const express = require('express');
const router = express.Router();
const { LEGAL_DOCS } = require('../data/legalTexts');

// GET /api/legal -> listado de los 3 documentos (id, icon, title, summary),
// sin el contenido completo, para pintar la pantalla de índice.
router.get('/', (req, res) => {
  const list = LEGAL_DOCS.map(({ id, icon, title, summary }) => ({ id, icon, title, summary }));
  res.json({ docs: list });
});

// GET /api/legal/:id -> documento completo (con "sections")
router.get('/:id', (req, res) => {
  const doc = LEGAL_DOCS.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Documento legal no encontrado' });
  res.json({ doc });
});

module.exports = router;
