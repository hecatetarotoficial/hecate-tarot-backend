const { TAROT_DECK } = require('../data/tarotCards');

/** Baraja un array (Fisher-Yates) sin mutar el original. */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Saca `count` cartas al azar, cada una con una probabilidad del 50% de salir invertida.
 */
function drawCards(count = 3) {
  const shuffled = shuffle(TAROT_DECK).slice(0, count);
  return shuffled.map((card) => ({
    ...card,
    reversedDraw: Math.random() < 0.5,
  }));
}

const SPREAD_POSITIONS = {
  1: ['Mensaje del momento'],
  3: ['Pasado', 'Presente', 'Futuro'],
  5: ['Situación', 'Obstáculo', 'Consejo', 'Influencias externas', 'Resultado probable'],
};

/**
 * Genera un texto de interpretación en lenguaje natural a partir de las cartas
 * salidas, listo para enviarse tal cual al servicio de texto-a-voz.
 */
function buildInterpretation({ cards, question, focus }) {
  const positions = SPREAD_POSITIONS[cards.length] || cards.map((_, i) => `Carta ${i + 1}`);

  const intro = question
    ? `Sobre tu pregunta: "${question}", esto es lo que revelan las cartas. `
    : 'Esto es lo que revelan las cartas en este momento. ';

  const focusKey = ['love', 'work', 'health'].includes(focus) ? focus : null;

  const body = cards
    .map((card, i) => {
      const position = positions[i] || `Carta ${i + 1}`;
      const orientation = card.reversedDraw ? 'invertida' : 'al derecho';
      const meaning = card.reversedDraw ? card.reversed : card.upright;
      // El texto de foco (amor/trabajo/salud) está redactado en sentido "al derecho",
      // así que solo lo añadimos cuando la carta no sale invertida, para no
      // contradecir el significado invertido que ya se acaba de dar.
      const focusLine = focusKey && !card.reversedDraw ? ` ${card[focusKey]}` : '';
      return `En la posición de ${position}, aparece ${card.name}, ${orientation}. ${meaning}${focusLine}`;
    })
    .join(' ');

  const closing = ' Recuerda que el tarot ofrece una guía simbólica: la decisión final siempre está en tus manos.';

  return {
    text: `${intro}${body}${closing}`,
    positions,
  };
}

const FOCUS_CONTEXT = {
  love: 'en el amor y tus vínculos afectivos',
  work: 'en tu vida laboral y profesional',
  health: 'en tu salud y tu bienestar',
};

const FOCUS_NOUN = {
  love: 'sentimental',
  work: 'profesional',
  health: 'de bienestar',
};

/**
 * Construye el desarrollo de una carta con más detalle: significado completo,
 * palabras clave y, si hay un foco (amor/trabajo/salud), una reflexión adicional
 * tanto si sale al derecho como si sale invertida.
 */
function elaborateCard({ card, position, focusKey }) {
  const orientation = card.reversedDraw ? 'invertida' : 'al derecho';
  const meaning = card.reversedDraw ? card.reversed : card.upright;

  let text = `En la posición de ${position} aparece ${card.name}, ${orientation}. ${meaning} `;
  text += `Las palabras clave que acompañan a esta carta son ${card.keywords.join(', ')}, y conviene tenerlas presentes al reflexionar sobre este momento. `;

  if (focusKey) {
    const framing = FOCUS_CONTEXT[focusKey];
    if (!card.reversedDraw) {
      text += `${card[focusKey]} `;
    } else {
      text += `Invertida y pensando especialmente ${framing}, esta carta te invita a observar con honestidad qué patrones relacionados con ${card.keywords
        .slice(0, 2)
        .join(' y ')} conviene soltar o transformar antes de seguir avanzando. `;
    }
  }

  return text;
}

/**
 * Genera una interpretación MÁS LARGA y elaborada, pensada específicamente para
 * la pregunta de pago: incluye una introducción cálida, un desarrollo detallado
 * de cada carta, un párrafo de síntesis que conecta las tres cartas entre sí y
 * un consejo final. Está pensada para acompañar al audio generado por voz.
 */
function buildPaidInterpretation({ cards, question, focus }) {
  const positions = SPREAD_POSITIONS[cards.length] || cards.map((_, i) => `Carta ${i + 1}`);
  const focusKey = ['love', 'work', 'health'].includes(focus) ? focus : null;

  const intro = question
    ? `Gracias por confiar en el tarot con tu pregunta: "${question}". Vamos a explorarla con calma, carta a carta, para que puedas ver con claridad el mensaje que traen. `
    : 'Vamos a explorar juntos el mensaje que traen las cartas en este momento, con calma y con atención a cada detalle. ';

  const body = cards
    .map((card, i) => elaborateCard({ card, position: positions[i] || `Carta ${i + 1}`, focusKey }))
    .join('\n\n');

  let synthesis = '';
  if (cards.length === 3) {
    synthesis =
      `\n\nSi unimos las tres cartas en una sola lectura, se dibuja un recorrido: ` +
      `${cards[0].name} señala el punto de partida y la energía que ha traído hasta aquí; ` +
      `${cards[1].name} describe con precisión cómo se siente y se vive la situación ahora mismo; ` +
      `y ${cards[2].name} apunta hacia la dirección en la que todo esto tiende a resolverse si las cosas siguen su curso natural. ` +
      `Ninguna carta debe leerse de forma aislada: es el diálogo entre las tres el que da la respuesta más completa a tu pregunta. `;
  }

  const lastCard = cards[cards.length - 1];
  const consejoBase = lastCard.reversedDraw
    ? `Como consejo final, ${lastCard.name} invertida sugiere prudencia: antes de dar el siguiente paso${
        focusKey ? ` ${FOCUS_CONTEXT[focusKey]}` : ''
      }, tómate un momento para revisar tus propias emociones y expectativas. No se trata de un mal augurio, sino de una invitación a avanzar con más conciencia.`
    : `Como consejo final, ${lastCard.name} te anima a confiar en el proceso${
        focusKey ? ` ${FOCUS_CONTEXT[focusKey]}` : ''
      }: la energía general es favorable si actúas con coherencia entre lo que sientes, piensas y haces.`;

  const closing = `\n\n${consejoBase} Recuerda siempre que el tarot es una guía simbólica${
    focusKey ? ` para tu situación ${FOCUS_NOUN[focusKey]}` : ''
  }: te ofrece perspectiva, pero la decisión final —y el poder de cambiar el rumbo— siempre está en tus manos.`;

  return {
    text: `${intro}${body}${synthesis}${closing}`,
    positions,
  };
}

/**
 * Clasificación de polaridad de cada carta para la "Tirada de sí o no": una
 * lectura rápida de una sola carta. No es una carta más "buena" o "mala" en
 * términos absolutos (eso ya lo matizan los textos de upright/reversed de
 * cada carta), sino solo su tendencia tradicional a la hora de responder una
 * pregunta cerrada. La mayoría de las 78 cartas son "positiva" a propósito:
 * el objetivo es una respuesta mayoritariamente alentadora, con las cartas
 * de conflicto/bloqueo tradicionales marcadas como "negativa" y las de
 * indecisión/espera como "neutra".
 */
const YES_NO_POLARITY = {
  // Arcanos mayores
  'carta-1': 'positiva', // El Loco
  'carta-2': 'positiva', // El Mago
  'carta-3': 'neutra', // La Sacerdotisa
  'carta-4': 'positiva', // La Emperatriz
  'carta-5': 'positiva', // El Emperador
  'carta-6': 'neutra', // El Sumo Sacerdote
  'carta-7': 'positiva', // Los Enamorados
  'carta-8': 'positiva', // El Carro
  'carta-9': 'positiva', // La Fuerza
  'carta-10': 'neutra', // El Ermitaño
  'carta-11': 'positiva', // La Rueda de la Fortuna
  'carta-12': 'neutra', // La Justicia
  'carta-13': 'negativa', // El Colgado
  'carta-14': 'negativa', // La Muerte
  'carta-15': 'positiva', // La Templanza
  'carta-16': 'negativa', // El Diablo
  'carta-17': 'negativa', // La Torre
  'carta-18': 'positiva', // La Estrella
  'carta-19': 'negativa', // La Luna
  'carta-20': 'positiva', // El Sol
  'carta-21': 'positiva', // El Juicio
  'carta-22': 'positiva', // El Mundo
  // Bastos
  'carta-23': 'positiva', // As de Bastos
  'carta-24': 'positiva', // Dos de Bastos
  'carta-25': 'positiva', // Tres de Bastos
  'carta-26': 'positiva', // Cuatro de Bastos
  'carta-27': 'negativa', // Cinco de Bastos
  'carta-28': 'positiva', // Seis de Bastos
  'carta-29': 'neutra', // Siete de Bastos
  'carta-30': 'positiva', // Ocho de Bastos
  'carta-31': 'neutra', // Nueve de Bastos
  'carta-32': 'negativa', // Diez de Bastos
  'carta-33': 'positiva', // Sota de Bastos
  'carta-34': 'positiva', // Caballero de Bastos
  'carta-35': 'positiva', // Reina de Bastos
  'carta-36': 'positiva', // Rey de Bastos
  // Copas
  'carta-37': 'positiva', // As de Copas
  'carta-38': 'positiva', // Dos de Copas
  'carta-39': 'positiva', // Tres de Copas
  'carta-40': 'neutra', // Cuatro de Copas
  'carta-41': 'negativa', // Cinco de Copas
  'carta-42': 'positiva', // Seis de Copas
  'carta-43': 'neutra', // Siete de Copas
  'carta-44': 'neutra', // Ocho de Copas
  'carta-45': 'positiva', // Nueve de Copas
  'carta-46': 'positiva', // Diez de Copas
  'carta-47': 'positiva', // Sota de Copas
  'carta-48': 'positiva', // Caballero de Copas
  'carta-49': 'positiva', // Reina de Copas
  'carta-50': 'positiva', // Rey de Copas
  // Espadas
  'carta-51': 'positiva', // As de Espadas
  'carta-52': 'neutra', // Dos de Espadas
  'carta-53': 'negativa', // Tres de Espadas
  'carta-54': 'neutra', // Cuatro de Espadas
  'carta-55': 'negativa', // Cinco de Espadas
  'carta-56': 'positiva', // Seis de Espadas
  'carta-57': 'negativa', // Siete de Espadas
  'carta-58': 'negativa', // Ocho de Espadas
  'carta-59': 'negativa', // Nueve de Espadas
  'carta-60': 'negativa', // Diez de Espadas
  'carta-61': 'neutra', // Sota de Espadas
  'carta-62': 'neutra', // Caballero de Espadas
  'carta-63': 'neutra', // Reina de Espadas
  'carta-64': 'neutra', // Rey de Espadas
  // Oros
  'carta-65': 'positiva', // As de Oros
  'carta-66': 'neutra', // Dos de Oros
  'carta-67': 'positiva', // Tres de Oros
  'carta-68': 'neutra', // Cuatro de Oros
  'carta-69': 'negativa', // Cinco de Oros
  'carta-70': 'positiva', // Seis de Oros
  'carta-71': 'neutra', // Siete de Oros
  'carta-72': 'positiva', // Ocho de Oros
  'carta-73': 'positiva', // Nueve de Oros
  'carta-74': 'positiva', // Diez de Oros
  'carta-75': 'positiva', // Sota de Oros
  'carta-76': 'neutra', // Caballero de Oros
  'carta-77': 'positiva', // Reina de Oros
  'carta-78': 'positiva', // Rey de Oros
};

// answer: 'si' | 'no' | 'depende'. La polaridad de la carta decide la
// respuesta (positiva -> sí, negativa -> no, neutra -> depende); que salga
// invertida NO cambia esa respuesta de golpe a la contraria (sería
// contradictorio con su propio significado invertido, que sigue hablando de
// la misma energía de fondo), pero sí resta seguridad y añade matices al
// texto — ver buildYesNoInterpretation.
const YES_NO_ANSWERS = { positiva: 'si', negativa: 'no', neutra: 'depende' };
const YES_NO_LABELS = { si: 'Sí', no: 'No', depende: 'Depende' };

/** Saca una única carta para la "Tirada de sí o no". */
function drawYesNoCard() {
  return drawCards(1)[0];
}

/**
 * A partir de una carta ya sacada (con su `reversedDraw`), calcula la
 * respuesta corta (sí / no / depende) según su polaridad tradicional.
 */
function getYesNoAnswer(card) {
  const polarity = YES_NO_POLARITY[card.id] || 'neutra';
  const answer = YES_NO_ANSWERS[polarity];
  return { answer, label: YES_NO_LABELS[answer] };
}

/**
 * Genera el texto de interpretación de la tirada de sí o no: la carta y su
 * significado habitual, seguidos de la respuesta corta y un cierre que deja
 * claro que el tarot da una tendencia simbólica, no una certeza absoluta.
 */
function buildYesNoInterpretation({ card, question }) {
  const { answer, label } = getYesNoAnswer(card);
  const orientation = card.reversedDraw ? 'invertida' : 'al derecho';
  const meaning = card.reversedDraw ? card.reversed : card.upright;

  const intro = question
    ? `Le has preguntado a las cartas: "${question}". `
    : 'Le has hecho una pregunta de sí o no a las cartas. ';

  const cardLine = `Sale ${card.name}, ${orientation}. ${meaning} `;

  const matiz = card.reversedDraw ? ', aunque al salir invertida conviene leerla con matices y algo de cautela' : '';
  const answerLine =
    answer === 'si'
      ? `La respuesta que trae esta carta es SÍ${matiz}: la energía general apunta a favor. `
      : answer === 'no'
      ? `La respuesta que trae esta carta es NO${matiz}: por ahora las cartas no acompañan en esa dirección. `
      : `La respuesta que trae esta carta es DEPENDE: el resultado no está cerrado del todo y va a depender de las decisiones que tomes a partir de ahora. `;

  const closing =
    'Recuerda que esto es una guía simbólica y orientativa, no una certeza: para una lectura más completa, prueba una tirada de varias cartas o una pregunta con respuesta narrada.';

  return { text: `${intro}${cardLine}${answerLine}${closing}`, answer, answerLabel: label };
}

module.exports = {
  drawCards,
  buildInterpretation,
  buildPaidInterpretation,
  SPREAD_POSITIONS,
  drawYesNoCard,
  getYesNoAnswer,
  buildYesNoInterpretation,
  YES_NO_POLARITY,
};
