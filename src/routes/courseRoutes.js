const express = require('express');
const router = express.Router();

const { COURSE_MODULES } = require('../data/tarotCourse');
const { FENGSHUI_MODULES } = require('../data/fengShuiCourse');
const paymentStore = require('../services/paymentStore');

/**
 * Registro de todos los cursos de pago disponibles en la app.
 * Para añadir un curso nuevo en el futuro: crea su archivo de datos en
 * src/data/, añade su precio en src/services/stripeService.js (PRICES) y
 * regístralo aquí con una entrada nueva.
 */
const COURSES = {
  tarot: { modules: COURSE_MODULES, productId: 'curso_tarot' },
  // Feng Shui retirado temporalmente de la oferta (agosto 2026) mientras se
  // amplía el curso de tarot. Los datos (fengShuiCourse.js) siguen intactos;
  // para reactivarlo, descomenta la línea siguiente.
  // fengshui: { modules: FENGSHUI_MODULES, productId: 'curso_fengshui' },
};

function getCourseOr404(req, res) {
  const course = COURSES[req.params.courseId];
  if (!course) {
    res.status(404).json({ error: `Curso desconocido: ${req.params.courseId}` });
    return null;
  }
  return course;
}

// GET /api/course/:courseId/preview
// Público y gratis: título y resumen de cada módulo, para ver el índice del
// curso antes de comprarlo. courseId: "tarot" | "fengshui"
//
// Los módulos marcados con `free: true` en los datos del curso (de momento,
// el primer módulo de Feng Shui) se devuelven con su CONTENIDO COMPLETO
// (content + exercise) para que se puedan leer sin pagar, a modo de muestra
// gratuita. El resto de módulos solo devuelven título y resumen.
router.get('/:courseId/preview', (req, res) => {
  const course = getCourseOr404(req, res);
  if (!course) return;
  const preview = course.modules.map((m) =>
    m.free
      ? { id: m.id, order: m.order, title: m.title, summary: m.summary, free: true, content: m.content, exercise: m.exercise, exercises: m.exercises }
      : { id: m.id, order: m.order, title: m.title, summary: m.summary, free: false }
  );
  res.json({ modules: preview, totalModules: course.modules.length, productId: course.productId });
});

// POST /api/course/:courseId/unlock
// Comprueba que el PaymentIntent indicado corresponde al producto de ESTE curso
// y está pagado. Si es así, devuelve el contenido COMPLETO de todos los módulos.
// Este pago NO se marca como "consumido": el mismo paymentIntentId puede volver
// a usarse para recuperar el curso más adelante (guárdalo en el dispositivo del
// usuario, por ejemplo con AsyncStorage).
//
// body: { paymentIntentId: string }
router.post('/:courseId/unlock', (req, res) => {
  const course = getCourseOr404(req, res);
  if (!course) return;

  const { paymentIntentId } = req.body;
  if (!paymentIntentId) {
    return res.status(400).json({ error: 'Falta paymentIntentId' });
  }
  if (!paymentStore.isPaid(paymentIntentId, course.productId)) {
    return res.status(402).json({
      error: 'Pago del curso no confirmado',
      detail: 'Completa el pago de este curso y espera la confirmación del webhook antes de desbloquearlo.',
    });
  }
  res.json({ modules: course.modules });
});

module.exports = router;
