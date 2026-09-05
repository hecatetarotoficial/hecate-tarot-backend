/**
 * Motor de conversación de "Consulta con Hekate": un chat continuo, tipo
 * ChatGPT, pero generado con reglas propias (sin depender de ninguna IA
 * externa ni de coste por token). Detecta el tema del mensaje del usuario
 * (amor, trabajo, salud, familia, futuro...), saca una carta del tarot para
 * casi cualquier mensaje con sustancia, y construye una respuesta elaborada
 * con la voz de Hekate. Cada respuesta combina la lectura simbólica de la
 * carta con un apunte de psicología accesible (patrones de apego, límites,
 * autoestima, gestión del estrés, dinámicas familiares, tolerancia a la
 * incertidumbre...), sin diagnosticar ni sustituir una terapia profesional:
 * es una capa de autoconocimiento, no un tratamiento.
 *
 * Solo se pide más contexto cuando el mensaje es realmente mínimo (un
 * "sí"/"no"/"vale" suelto, o vacío): para cualquier otra cosa, Hekate
 * responde con una carta en lugar de devolver la pregunta al usuario.
 *
 * Selección de frases sin repetición: no guardamos estado en el servidor
 * (el cliente envía `history` en cada mensaje), así que para evitar que las
 * respuestas se sientan repetitivas NO usamos un índice fijo derivado del
 * turno (eso tenía un bug: `history.length` crece de 2 en 2 en cada ronda —
 * mensaje del usuario + respuesta de Hekate—, así que un índice basado en
 * ese número siempre cae en la misma paridad y deja la mitad de cada banco
 * de frases inalcanzable). En su lugar, cada banco se recorre con una
 * elección aleatoria que excluye las frases ya usadas en los últimos
 * mensajes de Hekate (mirando el propio texto en `history`), así que nunca
 * se repite la misma frase dos veces seguidas y el reparto es mucho más
 * uniforme.
 */

const { drawCards } = require('./tarotEngine');

const RECENT_WINDOW = 4; // cuántos mensajes recientes de Hekate se miran para evitar repetir frase

const GREETING_KEYWORDS = ['hola', 'buenas', 'buenos días', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'ey'];
const THANKS_KEYWORDS = ['gracias', 'genial', 'perfecto', 'te lo agradezco', 'mil gracias'];
const FAREWELL_KEYWORDS = ['adiós', 'adios', 'hasta luego', 'chao', 'chau', 'nos vemos', 'me voy', 'hasta pronto'];

// Mensajes tan mínimos que no dan pie a sacar una carta con sentido.
const VAGUE_FILLERS = new Set([
  'no', 'si', 'sí', 'ok', 'okay', 'vale', 'bien', 'mal', 'quizas', 'quizás', 'tal vez',
  'no se', 'no sé', 'nose', 'ns', 'ns2', 'mmm', 'hm', 'ya', 'claro', 'a ver',
]);

const TOPICS = [
  {
    key: 'amor',
    focus: 'love',
    match: ['amor', 'pareja', 'novio', 'novia', 'relación', 'relacion', 'corazón', 'corazon', ' ex ', 'me quiere', 'enamorad', 'casar', 'boda', 'ruptura', 'separacion', 'separación'],
  },
  {
    key: 'trabajo',
    focus: 'work',
    match: ['trabajo', 'empleo', 'jefe', 'entrevista', 'negocio', 'dinero', 'economía', 'economia', 'proyecto', 'profesional', 'sueldo', 'despido', 'ascenso'],
  },
  {
    key: 'salud',
    focus: 'health',
    match: ['salud', 'enfermedad', 'cuerpo', 'ansiedad', 'estrés', 'estres', 'descanso', 'dormir', 'cansancio', 'agotamiento'],
  },
  {
    key: 'familia',
    focus: null,
    match: ['familia', 'madre', 'padre', 'hijo', 'hija', 'hermano', 'hermana', 'padres'],
  },
  {
    key: 'futuro',
    focus: null,
    match: ['futuro', 'qué me depara', 'que me depara', 'qué pasará', 'que pasara', 'destino', 'qué va a pasar', 'que va a pasar'],
  },
];

const OPENING_PHRASES = [
  'Dejo que la llama de la vela se incline un momento y pido claridad sobre lo que preguntas.',
  'Cierro los ojos, sostengo tu pregunta en la mente y dejo que una carta se presente sola.',
  'La encrucijada siempre tiene algo que mostrar a quien se detiene a preguntar. Vamos a mirar.',
  'Respira conmigo un instante. Voy a dejar que las cartas hablen sobre esto.',
  'Hay preguntas que merecen algo más que intuición: pido a las cartas que se pronuncien.',
  'Tu pregunta pesa lo justo para merecer una carta. Esto es lo que aparece.',
  'Dejo que el humo de la vela dibuje un momento de silencio antes de responder.',
  'Sostengo tu pregunta como quien sostiene una llave sin saber aún qué puerta abre. Vamos a verlo.',
  'Me tomo un instante para escuchar más allá de las palabras. Esto es lo que se revela.',
  'Antes de responder con certezas, dejo que hable el símbolo. Esto es lo que trae.',
];

const CARD_INTRO_PHRASES = [
  'Se presenta',
  'Sale a la luz',
  'Aparece ante nosotras',
  'Se revela',
  'Cruza el umbral',
  'Se asoma entre la niebla',
  'Emerge de la baraja',
  'Se deja ver',
  'Toma forma ante ti',
  'Se abre paso entre las demás',
];

const KEYWORDS_INTROS = [
  'Las palabras que acompañan a esta carta son',
  'Conviene que tengas presentes las energías de',
  'Esta carta viene envuelta en las ideas de',
  'Guarda contigo estas palabras clave:',
  'El eco de esta carta se resume en',
  'Lleva contigo, como brújula, estas palabras:',
];

const REVERSED_ADVICE = [
  { signature: 'te invita a mirar con honestidad', build: (kw) => `Al salir invertida, te invita a mirar con honestidad qué patrones relacionados con ${kw} conviene soltar antes de seguir avanzando.` },
  { signature: 'es una llamada a la calma', build: (kw) => `Invertida, es una llamada a la calma: no fuerces nada relacionado con ${kw} hasta que tengas más claridad.` },
  { signature: 'señala más un bloqueo interno', build: (kw) => `En su forma invertida, señala más un bloqueo interno en torno a ${kw} que un obstáculo externo.` },
  { signature: 'pide paciencia', build: (kw) => `Invertida, pide paciencia: lo que toca ahora con ${kw} es observar, no actuar todavía.` },
  { signature: 'una versión cansada', build: (kw) => `Invertida, muestra una versión cansada de ${kw}: la energía sigue ahí, pero necesita descanso antes de volver a fluir.` },
  { signature: 'no como un castigo', build: (kw) => `Tómate esta inversión como una pausa, no como un castigo: ${kw} volverá a su cauce cuando dejes de forzarlo.` },
];

// Frases que mezclan la lectura simbólica del tarot con un apunte de
// psicología accesible (sin diagnosticar ni sustituir terapia profesional):
// patrones de apego, límites, autoestima, gestión del estrés, dinámicas
// familiares, tolerancia a la incertidumbre... Cada una recibe la primera
// palabra clave de la carta para conectar ambos lenguajes.
const PSYCH_LINES_BY_TOPIC = {
  amor: [
    { signature: 'tu estilo de apego', build: () => 'Y un apunte desde la psicología: esto también puede hablar de tu estilo de apego. ¿Buscas seguridad fuera porque todavía no confías en poder dártela tú misma?' },
    { signature: 'el miedo a estar sola y el deseo real', build: () => 'Psicológicamente, vale la pena distinguir entre el miedo a estar sola y el deseo real de estar con esa persona: se sienten parecidos, pero piden decisiones distintas.' },
    { signature: 'una negociación entre lo que necesitamos', build: () => 'Desde la psicología, muchas veces lo que llamamos amor es una negociación entre lo que necesitamos y lo que tememos pedir. ¿Qué es lo que de verdad estás pidiendo?' },
    { signature: 'cómo reaccionas en un desacuerdo', build: () => 'Desde la psicología, cómo reaccionas en un desacuerdo dice tanto de la relación como el desacuerdo en sí: ¿te alejas, te enfadas, o buscas hablarlo?' },
    { signature: 'la intensidad no siempre es intimidad', build: () => 'Un apunte psicológico: la intensidad no siempre es intimidad. A veces confundimos lo que quema con lo que nutre.' },
    { signature: 'no es un premio de consolación', build: () => 'Un apunte psicológico: el amor propio no es un premio de consolación, es lo que decide, muchas veces sin que te des cuenta, a quién dejas entrar y a quién no.' },
    { signature: 'la autoestima con la que llegas', build: () => 'Desde la psicología, la autoestima con la que llegas a una relación influye tanto como la otra persona: cambia lo que aceptas, lo que pides y lo que perdonas.' },
  ],
  trabajo: [
    { signature: 'los límites que aún no has puesto', build: () => 'Un apunte psicológico: si sientes agotamiento más que ilusión, puede ser señal de que el problema no es la tarea, sino los límites que aún no has puesto.' },
    { signature: 'el síndrome del impostor', build: () => 'Desde la psicología, esto puede conectar con el síndrome del impostor: a veces dudamos más de nosotras justo cuando estamos a punto de conseguir algo.' },
    { signature: 'motivación por miedo', build: () => 'Psicológicamente, conviene diferenciar la motivación por miedo (a fallar, a decepcionar) de la motivación por deseo genuino: cambian mucho cómo se vive el mismo paso.' },
    { signature: 'el "no puedo" del "no quiero"', build: () => 'Desde la psicología, vale la pena diferenciar el "no puedo" del "no quiero": a veces nos protegemos detrás de una excusa que no es del todo cierta.' },
    { signature: 'la procrastinación casi nunca es pereza', build: () => 'Un apunte psicológico: la procrastinación casi nunca es pereza; suele ser miedo disfrazado de cansancio.' },
  ],
  salud: [
    { signature: 'el cuerpo suele avisar antes que la mente', build: () => 'Desde la psicología, el cuerpo suele avisar antes que la mente: si llevas tiempo ignorando el cansancio, esta carta invita a escucharlo antes de que se convierta en algo más serio.' },
    { signature: 'se disfraza de irritabilidad', build: () => 'Un apunte psicológico: el estrés sostenido no siempre se siente como ansiedad; a veces se disfraza de irritabilidad o de desconexión. Vale la pena revisar cómo lo estás llevando.' },
    { signature: 'cuidar de una misma no es egoísmo', build: () => 'Psicológicamente, cuidar de una misma no es egoísmo: es la base desde la que se sostiene todo lo demás.' },
    { signature: 'lo que la mente no ha terminado de procesar', build: () => 'Desde la psicología, el cuerpo guarda lo que la mente no ha terminado de procesar; a veces el malestar físico es la forma que tiene una emoción de pedir atención.' },
    { signature: 'pedir ayuda no es debilidad', build: () => 'Un apunte psicológico: pedir ayuda no es debilidad, es una de las formas más maduras de cuidarte.' },
    { signature: 'lo que no se expresa no desaparece', build: () => 'Un apunte psicológico: lo que no se expresa no desaparece, se transforma; muchas veces en tensión, en cansancio, o en un malestar que no tiene una causa médica clara.' },
  ],
  familia: [
    { signature: 'antes de poder cuestionarlas', build: () => 'Desde la psicología, muchas dinámicas familiares se repiten sin que nos demos cuenta, porque las aprendimos de pequeñas, antes de poder cuestionarlas. Nombrarlas ya es empezar a cambiarlas.' },
    { signature: 'poner un límite con la familia', build: () => 'Un apunte psicológico: poner un límite con la familia no es falta de amor, es una forma de cuidar la relación a largo plazo.' },
    { signature: 'qué papel sueles ocupar en tu familia', build: () => 'Psicológicamente, vale la pena preguntarte qué papel sueles ocupar en tu familia —quien media, quien cuida, quien calla— y si ese papel sigue siéndote útil hoy.' },
    { signature: 'la herencia emocional', build: () => 'Desde la psicología, no elegimos la familia en la que nacemos, pero sí podemos elegir qué parte de esa herencia emocional queremos seguir cargando.' },
    { signature: 'necesitar distancia de esa persona', build: () => 'Un apunte psicológico: querer a alguien y necesitar distancia de esa persona pueden ser ciertos al mismo tiempo.' },
  ],
  futuro: [
    { signature: 'tolerar el proceso', build: () => 'Desde la psicología, la incertidumbre se vive peor cuando intentamos controlar el resultado en vez de tolerar el proceso. Esta carta invita más a lo segundo.' },
    { signature: 'qué puedo hacer yo ahora', build: () => 'Un apunte psicológico: preguntarte "qué va a pasar" a veces esconde una pregunta más honesta, que es "qué puedo hacer yo ahora". Esa sí depende de ti.' },
    { signature: 'las decisiones pequeñas de hoy', build: () => 'Psicológicamente, el futuro se construye con las decisiones pequeñas de hoy, no con una única respuesta definitiva mirando hacia adelante.' },
    { signature: 'empezamos a pedirle un siguiente paso', build: () => 'Desde la psicología, la ansiedad ante el futuro suele bajar cuando dejamos de pedirle certeza y empezamos a pedirle un siguiente paso.' },
    { signature: 'el locus de control', build: () => 'Un apunte psicológico: el locus de control importa: enfócate en lo que sí depende de ti, y suelta lo que no.' },
  ],
};

const PSYCH_LINES_GENERIC = [
  { signature: 'más que a buscar una respuesta cerrada', build: () => 'Y desde la psicología: esta carta puede leerse como una invitación a observar qué necesitas emocionalmente detrás de la pregunta, más que a buscar una respuesta cerrada fuera de ti.' },
  { signature: 'pedirnos permiso a nosotras mismas', build: () => 'Un apunte psicológico: muchas veces lo que preguntamos hacia afuera es, en realidad, una forma de pedirnos permiso a nosotras mismas para actuar.' },
  { signature: 'el patrón lo reconoces tú', build: () => 'Psicológicamente, presta atención a si esta situación repite un patrón que ya conoces de otras veces: el tarot señala el momento, pero el patrón lo reconoces tú.' },
  { signature: 'lo que crees que "deberías" sentir', build: () => 'Desde una mirada más psicológica, esta carta habla de la diferencia entre lo que sientes y lo que crees que "deberías" sentir; ahí suele estar la pista más honesta.' },
  { signature: 'lo que se nombra, se puede empezar a entender', build: () => 'Desde la psicología, ponerle palabras a lo que sientes ya es la mitad del trabajo: lo que se nombra, se puede empezar a entender.' },
  { signature: 'permitirte no saber todavía', build: () => 'Un apunte psicológico: no siempre hace falta tener la respuesta ahora mismo; a veces el primer paso es simplemente permitirte no saber todavía.' },
];

const CLOSING_QUESTIONS = [
  '¿Quieres que profundicemos en cómo se conecta esto con lo que vives ahora?',
  '¿Hay algo concreto de tu situación que quieras que miremos con más detalle?',
  'Cuéntame más si quieres, y seguimos tirando del hilo juntas.',
  '¿Te resuena esta carta con algo que ya intuías?',
  'Si quieres, dime más y afinamos la lectura.',
  '¿Seguimos explorando esta pregunta o prefieres que miremos otra cosa?',
  '¿Qué parte de esto sientes más cierta, aunque no sepas explicar por qué?',
  'Puedes contarme más contexto si quieres que la lectura sea más precisa.',
  '¿Hay algo de esto que ya sospechabas antes de preguntar?',
  'Dime qué parte quieres que miremos con más calma.',
];

const GREETING_REPLIES = [
  'Bienvenida a esta consulta. Soy Hekate: guardiana de los umbrales y de los caminos que aún no tienen nombre. Cuéntame qué te trae hoy.',
  'Te siento llegar como quien cruza un umbral con una vela encendida. Dime, ¿qué pregunta cargas contigo?',
  'Aquí estoy, entre la luna y la encrucijada. ¿Sobre qué quieres que consultemos las cartas?',
  'Hola. Soy Hekate, y estoy aquí para escucharte sin prisa. ¿Qué quieres consultar hoy?',
  'Bienvenida de nuevo al umbral. Cuéntame qué te ronda la cabeza y lo miramos juntas.',
];

const THANKS_REPLIES = [
  'No hay nada que agradecer: las cartas hablan, yo solo sostengo el espejo. ¿Hay algo más que quieras preguntar?',
  'Me alegra que te sirva. La encrucijada sigue abierta si quieres mirar otro camino.',
  'Es un honor acompañarte en esto. Si surge otra pregunta, aquí sigo.',
  'Para eso estoy. Si quieres seguir mirando otra parte de tu vida, aquí sigo.',
  'Me alegra haberte traído algo de claridad. Sigo aquí si quieres preguntar algo más.',
];

const FAREWELL_REPLIES = [
  'Ve con la luz de la luna guiándote. Vuelve cuando quieras consultar de nuevo.',
  'Que el camino se abra con claridad ante ti. Aquí estaré, en el umbral, cuando regreses.',
  'Hasta la próxima consulta. Lleva contigo lo que hoy hemos visto entre las cartas.',
  'Que la encrucijada te trate con amabilidad. Vuelve cuando lo necesites.',
  'Me despido por ahora. Las cartas seguirán aquí esperándote la próxima vez.',
];

// Plantillas para "devolver" un fragmento de lo que la persona acaba de
// escribir, para que la respuesta se sienta dirigida a ELLA y no a un molde
// genérico. Se usan solo a veces (ver ECHO_CHANCE) y solo con mensajes de
// una longitud razonable, para que no resulte forzado.
const ECHO_TEMPLATES = [
  (snippet) => `Cuando dices «${snippet}», eso ya me dice por dónde mirar.`,
  (snippet) => `Me quedo con esto que cuentas: «${snippet}».`,
  (snippet) => `Lo que planteas —«${snippet}»— es justo lo que voy a mirar con la carta.`,
  (snippet) => `«${snippet}». Vale la pena detenerse ahí un momento.`,
];
const ECHO_CHANCE = 0.4;
const ECHO_MIN_LENGTH = 12;
const ECHO_MAX_LENGTH = 70;

const GENERIC_REPLIES = [
  'Cuéntame un poco más: ¿qué situación concreta tienes en mente? Con una frase ya puedo sacar una carta y darte una respuesta de verdad.',
  'Necesito algo más para poder tirar una carta con sentido. ¿Qué es exactamente lo que te preocupa ahora mismo?',
  'Dame un par de palabras más sobre qué te ronda la cabeza y dejo que las cartas se pronuncien.',
  'Con una frase concreta ya tengo suficiente para sacar una carta. ¿Qué es lo que quieres preguntar?',
  'Ayúdame con un poco más de detalle y consulto las cartas ahora mismo.',
];

function normalize(text) {
  return (text || '').trim().toLowerCase();
}

function stripPunctuation(text) {
  return text.replace(/[¿?¡!.,;:]/g, '').trim();
}

// Algunas palabras clave (el elemento de los arcanos menores: "Fuego", "Aire"...)
// vienen capitalizadas en los datos porque también se usan como etiqueta. Aquí
// las interpolamos a media frase, así que las pasamos a minúscula inicial.
function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function detectTopic(lower) {
  return TOPICS.find((topic) => topic.match.some((kw) => lower.includes(kw))) || null;
}

function buildEchoLine(rawMessage) {
  const cleaned = (rawMessage || '').trim().replace(/\s+/g, ' ');
  if (cleaned.length < ECHO_MIN_LENGTH || cleaned.length > ECHO_MAX_LENGTH) return '';
  if (Math.random() > ECHO_CHANCE) return '';
  const template = ECHO_TEMPLATES[Math.floor(Math.random() * ECHO_TEMPLATES.length)];
  return template(cleaned);
}

function recentHekateTexts(history) {
  return history
    .filter((m) => m && m.role === 'hekate' && typeof m.text === 'string')
    .slice(-RECENT_WINDOW)
    .map((m) => m.text);
}

/** Elige una frase de texto plano evitando las que ya aparecen en los últimos mensajes de Hekate. */
function pickText(arr, recentTexts) {
  const fresh = arr.filter((text) => !recentTexts.some((rt) => rt.includes(text)));
  const pool = fresh.length ? fresh : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Igual que pickText, pero para bancos de { signature, build(kw) }. */
function pickItem(bank, recentTexts) {
  const fresh = bank.filter((item) => !recentTexts.some((rt) => rt.includes(item.signature)));
  const pool = fresh.length ? fresh : bank;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Genera la respuesta de Hekate a un mensaje del usuario dentro de una
 * consulta ya pagada.
 *
 * @param {Object} params
 * @param {string} params.message - Mensaje del usuario.
 * @param {Array} [params.history] - Historial previo: [{role: 'user'|'hekate', text}]. Se usa
 *   para variar el tono y evitar repetir la misma frase que en mensajes recientes.
 * @returns {{reply: string, cardDrawn?: {name: string, reversed: boolean, keywords: string[]}}}
 */
function generateReply({ message, history = [] }) {
  const lower = normalize(message);
  const isFirstTurn = history.length === 0;
  const recentTexts = recentHekateTexts(history);

  if (!lower) {
    return { reply: 'Te escucho. Cuéntame qué te ronda la cabeza y consultaré las cartas contigo.' };
  }

  if (FAREWELL_KEYWORDS.some((kw) => lower.includes(kw))) {
    return { reply: pickText(FAREWELL_REPLIES, recentTexts) };
  }

  if (THANKS_KEYWORDS.some((kw) => lower.includes(kw))) {
    return { reply: pickText(THANKS_REPLIES, recentTexts) };
  }

  if (isFirstTurn && GREETING_KEYWORDS.some((kw) => lower.includes(kw)) && lower.length < 40) {
    return { reply: pickText(GREETING_REPLIES, recentTexts) };
  }

  // Solo pedimos más contexto si el mensaje, sin signos de puntuación, es
  // una de las palabras de relleno de la lista (o queda vacío tras limpiarlo).
  // Para CUALQUIER otra cosa —incluso mensajes cortos— sacamos una carta:
  // el usuario ya está pagando por una consulta, no por un cuestionario.
  const stripped = stripPunctuation(lower);
  const tooVague = stripped.length === 0 || VAGUE_FILLERS.has(stripped);

  if (tooVague) {
    return { reply: pickText(GENERIC_REPLIES, recentTexts) };
  }

  const topic = detectTopic(lower);
  const [card] = drawCards(1);
  const orientation = card.reversedDraw ? 'invertida' : 'al derecho';
  const meaning = card.reversedDraw ? card.reversed : card.upright;
  const focusLine = topic && topic.focus && !card.reversedDraw ? ` ${card[topic.focus]}` : '';
  const firstKeyword = lowerFirst(card.keywords[0]);
  const psychBank = (topic && PSYCH_LINES_BY_TOPIC[topic.key]) || PSYCH_LINES_GENERIC;

  // La respuesta se compone en partes, y varias de ellas son OPCIONALES con
  // una probabilidad propia: así, además de variar QUÉ frase concreta sale
  // en cada parte (pickText/pickItem, arriba), también varía la FORMA de la
  // respuesta —cuántas frases tiene, si empieza con una apertura o va
  // directa a la carta, si cierra con pregunta o no—, para que dos
  // respuestas no se sientan como el mismo molde relleno con palabras
  // distintas.
  const parts = [];

  const echoLine = buildEchoLine(message);
  if (echoLine) parts.push(echoLine);

  // Si ya hay un eco del mensaje al principio, la apertura formal es menos
  // necesaria (evita que la respuesta empiece con dos frases de "transición"
  // seguidas); si no hay eco, la apertura sale con más probabilidad.
  const openingChance = echoLine ? 0.35 : 0.8;
  if (Math.random() < openingChance) {
    parts.push(pickText(OPENING_PHRASES, recentTexts));
  }

  // El corazón de la lectura (carta + significado) siempre está presente.
  parts.push(`${pickText(CARD_INTRO_PHRASES, recentTexts)} ${card.name}, ${orientation}.`);
  parts.push(`${meaning}${focusLine}`);

  // Palabras clave y, si sale invertida, el consejo asociado: se muestran
  // casi siempre, pero no el 100% de las veces.
  let extra = '';
  if (Math.random() < 0.75) {
    extra = `${pickText(KEYWORDS_INTROS, recentTexts)} ${card.keywords.join(', ')}.`;
  }
  if (card.reversedDraw) {
    const reversedText = pickItem(REVERSED_ADVICE, recentTexts).build(firstKeyword);
    extra = extra ? `${extra} ${reversedText}` : reversedText;
  }
  if (extra) parts.push(extra);

  // El apunte de psicología es el corazón de "Consulta con Hekate", así que
  // aparece casi siempre.
  if (Math.random() < 0.9) {
    parts.push(pickItem(psychBank, recentTexts).build(firstKeyword));
  }

  if (Math.random() < 0.65) {
    parts.push(pickText(CLOSING_QUESTIONS, recentTexts));
  }

  return {
    reply: parts.join(' '),
    cardDrawn: { name: card.name, reversed: card.reversedDraw, keywords: card.keywords },
  };
}

module.exports = { generateReply, detectTopic };
