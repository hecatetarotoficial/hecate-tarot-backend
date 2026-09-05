/**
 * Textos legales de la app: Aviso Legal, Política de Privacidad y Términos y
 * Condiciones de Contratación.
 *
 * IMPORTANTE — BORRADOR: este contenido es una plantilla orientativa (agosto
 * de 2026, a petición de Andrea) redactada a partir de la LSSI-CE, el RGPD,
 * la LOPDGDD y el TRLGDCU. Los campos entre corchetes, p.ej. [TU NIF], son
 * placeholders que hay que rellenar con datos reales antes de publicar la
 * app con pagos activados. Además, un abogado o gestor debería revisar todo
 * el contenido antes de publicarlo, en especial la sección "condiciones"
 * (precios, forma de pago y renuncia al derecho de desistimiento).
 *
 * Estructura de cada documento: id, icon, title, summary (se muestra en el
 * listado) y sections (array de { heading, paragraphs, list? }).
 */

const LEGAL_DOCS = [
  {
    id: 'aviso',
    icon: '🪶',
    title: 'Aviso legal',
    summary: 'Quién ofrece esta app y en qué condiciones se puede usar.',
    sections: [
      {
        heading: '1.1 Datos identificativos del titular',
        paragraphs: [
          'Domicilio a efectos de notificaciones: Paseo de Almería 21, 04001 Almería.',
          'Contacto: @hecatetarotoficial (Instagram)',
          'Nombre comercial / app: Hécate — Tarot & Rituals',
        ],
      },
      {
        heading: '1.2 Objeto',
        paragraphs: [
          'Hécate — Tarot & Rituals ("la App") ofrece tiradas de tarot, contenido educativo sobre tarot, horóscopos semanales, rituales, información sobre santos y oraciones, y servicios de consulta de pago (preguntas respondidas por audio, tiradas adicionales, carta astral y cursos de acceso permanente). Se ofrece con fines de entretenimiento, desarrollo personal y autoconocimiento.',
        ],
      },
      {
        heading: '1.3 Condiciones de acceso y uso',
        paragraphs: [
          'El acceso a la App es gratuito, salvo el coste de tu propia conexión a internet. Algunas funciones requieren el pago de un precio, detallado en la sección "Términos y condiciones de contratación". Usar la App implica aceptar este Aviso Legal, la Política de Privacidad y las Condiciones de Contratación.',
          'La App está dirigida a un público adulto. Si eres menor de edad, necesitas la autorización de tu padre, madre o tutor legal para usar las funciones de pago.',
        ],
      },
      {
        heading: '1.4 Propiedad intelectual',
        paragraphs: [
          'Los textos, interpretaciones, marca "Hécate — Tarot & Rituals", diseño y código de la App son propiedad de su titular o se usan bajo licencia/dominio público (como las imágenes del mazo Rider-Waite-Smith, publicado en 1909 y hoy en dominio público). Queda prohibida su reproducción o distribución sin autorización, salvo el uso personal permitido por la ley.',
        ],
      },
      {
        heading: '1.5 Naturaleza del servicio',
        paragraphs: [
          'El contenido de esta App (tiradas, horóscopos, rituales y consultas) tiene una naturaleza puramente artística, recreativa y de entretenimiento. El tarot y la astrología no son una ciencia exacta: las interpretaciones ofrecidas son orientativas y simbólicas, no predicciones garantizadas.',
          'Este contenido no sustituye el diagnóstico, consejo o tratamiento de un profesional médico, psicólogo, abogado o asesor financiero. El titular no garantiza que las interpretaciones se correspondan con hechos futuros reales y no asume responsabilidad por las decisiones que el usuario tome basándose en ellas.',
        ],
      },
      {
        heading: '1.6 Personaje virtual "Hekate" e inteligencia artificial',
        paragraphs: [
          '"Hekate" es un personaje virtual y una marca de la App: no representa a una persona real ni a una vidente profesional. Las respuestas de la "Consulta con Hekate" y las interpretaciones de tarot se generan mediante un motor de reglas propio (no mediante inteligencia artificial generativa), a partir de los significados de las cartas.',
          'Únicamente la narración en audio de algunas respuestas de pago se genera mediante un servicio externo de síntesis de voz por inteligencia artificial (texto a voz). El texto que se lee es siempre el mismo generado por la App, no un contenido creado por la IA.',
        ],
      },
      {
        heading: '1.7 Legislación aplicable',
        paragraphs: [
          'Estas condiciones se rigen por la legislación española. Sin perjuicio de los fueros que puedan corresponder al consumidor por ley, las controversias podrán someterse a los Juzgados y Tribunales del domicilio del usuario cuando este sea consumidor.',
          'Última actualización: 29 de agosto de 2026.',
        ],
      },
    ],
  },
  {
    id: 'privacidad',
    icon: '🔒',
    title: 'Política de privacidad',
    summary: 'Qué datos se recogen, para qué se usan y cómo ejercer tus derechos.',
    sections: [
      {
        heading: '2.1 Responsable del tratamiento',
        paragraphs: [
          'Contacto: @hecatetarotoficial (Instagram)',
        ],
      },
      {
        heading: '2.2 Datos que se recogen',
        paragraphs: ['Según cómo uses la App, podemos tratar:'],
        list: [
          'Datos de contacto que facilites voluntariamente (por ejemplo, tu email).',
          'El contenido de las preguntas que escribas en una consulta de pago, que puede incluir datos personales que tú mismo decidas compartir.',
          'Datos de uso de la App (tiradas realizadas, módulos del curso completados).',
          'Datos técnicos básicos del dispositivo, para el correcto funcionamiento y soporte.',
          'Datos de pago: la App NO almacena números de tarjeta. Los pagos los procesa directamente PayPal y/o Stripe, que actúan como sus propios responsables para esos datos.',
        ],
      },
      {
        heading: '2.3 Finalidad y base jurídica',
        paragraphs: ['Usamos tus datos para:'],
        list: [
          'Prestar el servicio que has contratado (base: ejecución de un contrato).',
          'Gestionar el pago junto con PayPal/Stripe (base: ejecución de un contrato y obligaciones legales).',
          'Responder a tus consultas de soporte (base: interés legítimo y/o consentimiento).',
          'Mejorar la App de forma agregada y anónima (base: interés legítimo).',
        ],
      },
      {
        heading: '2.4 Conservación',
        paragraphs: [
          'Conservamos tus datos mientras mantengas acceso a un servicio contratado y, después, durante los plazos legalmente exigidos (con carácter general, hasta 6 años a efectos mercantiles y fiscales, si aplica).',
        ],
      },
      {
        heading: '2.5 Con quién compartimos datos',
        paragraphs: ['Compartimos datos, solo lo necesario, con:'],
        list: [
          'PayPal (y/o Stripe si se activa en el futuro), para procesar los pagos.',
          'El proveedor de alojamiento del backend de la App.',
          'El proveedor del servicio de voz (texto a audio), si aplica.',
        ],
      },
      {
        heading: '2.6 Tus derechos',
        paragraphs: [
          'Puedes ejercer, de forma gratuita, tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiéndonos por Instagram a @hecatetarotoficial. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es) si consideras que no hemos atendido tu solicitud correctamente.',
        ],
      },
      {
        heading: '2.7 Menores de edad',
        paragraphs: [
          'La App no está dirigida a menores de 14 años. Si tienes entre 14 y 18 años y quieres usar funciones de pago, necesitas la autorización de tu padre, madre o tutor legal.',
          'Última actualización: 29 de agosto de 2026.',
        ],
      },
    ],
  },
  {
    id: 'condiciones',
    icon: '📄',
    title: 'Términos y condiciones de contratación',
    summary: 'Precios, forma de pago y tu derecho de desistimiento.',
    sections: [
      {
        heading: '3.1 Servicios y precios',
        paragraphs: ['Precios vigentes (consulta siempre el precio final mostrado en la App al pagar, que es el único vinculante):'],
        list: [
          'Tirada instantánea (1, 3 o 5 cartas): la primera es gratis; a partir de la segunda, 0,99 € por tirada.',
          'Tirada de sí o no (1 carta): siempre gratuita.',
          'Pregunta al tarot con respuesta narrada por audio: 2,99 € por pregunta.',
          'Carta astral completa: gratuita.',
          'Consulta en chat continuo con Hekate: 2,99 € (desbloqueo permanente).',
          'Curso de iniciación al tarot (10 módulos): 9,99 € (desbloqueo permanente).',
        ],
      },
      {
        heading: '3.2 Proceso de contratación y pago',
        paragraphs: [
          'El pago se realiza a través de PayPal (y, en el futuro, podrá añadirse Stripe u otro proveedor). Al confirmar el pago, declaras ser mayor de edad o contar con autorización de tu tutor legal, y aceptas expresamente estas condiciones.',
        ],
      },
      {
        heading: '3.3 Derecho de desistimiento',
        paragraphs: [
          'Con carácter general, dispones de 14 días naturales para desistir de una compra online sin justificar tu decisión (art. 102 TRLGDCU).',
          'Sin embargo, cuando el contenido digital se entrega sin soporte material y su ejecución ya ha comenzado, la ley permite excluir este derecho si das tu consentimiento expreso antes de pagar (art. 103 TRLGDCU). Como las tiradas, respuestas y el curso se entregan de forma inmediata, antes de cobrar te mostraremos un aviso como este:',
          '“Acepto que el servicio comience de forma inmediata y entiendo que, por tratarse de contenido digital de ejecución inmediata, pierdo mi derecho de desistimiento de 14 días una vez completado el pago.”',
          'Sin ese consentimiento expreso, conservarías tu derecho a pedir la devolución en un plazo de 14 días, incluso si ya recibiste el contenido.',
        ],
      },
      {
        heading: '3.4 Reclamaciones',
        paragraphs: [
          'Para cualquier incidencia con un pago o un servicio, escríbenos por Instagram a @hecatetarotoficial. Como consumidor, también puedes acudir a las Juntas Arbitrales de Consumo o a la plataforma europea de resolución de litigios en línea (ec.europa.eu/consumers/odr).',
          'Última actualización: 29 de agosto de 2026.',
        ],
      },
    ],
  },
];

module.exports = { LEGAL_DOCS };
