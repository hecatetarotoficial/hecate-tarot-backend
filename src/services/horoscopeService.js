/**
 * Servicio de horóscopo semanal — estilo "horóscopo negro".
 *
 * Igual que el resto de la app, es un motor de reglas propio (sin IA externa):
 * combina bancos de frases originales con una selección "aleatoria" pero
 * DETERMINISTA basada en una semilla (signo + semana ISO en curso). Esto tiene
 * una consecuencia importante y buscada: el horóscopo de cada signo se
 * mantiene igual durante toda la semana (mismo resultado si se pide dos veces
 * el mismo día o dos días distintos de la misma semana), pero en cuanto
 * empieza una semana ISO nueva, la semilla cambia y con ella el horóscopo de
 * los 12 signos — se "actualiza cada semana" solo, sin necesidad de guardar
 * nada en base de datos ni de programar ninguna tarea (cron) que lo regenere.
 *
 * TONO "HORÓSCOPO NEGRO": a diferencia de un horóscopo tradicional (todo
 * optimismo y frases bonitas), este formato es más largo, directo y sin
 * edulcorantes: nombra el patrón de sombra típico de cada signo (la
 * tozudez de Tauro, el ego de Leo, la evasión de Piscis...) en vez de
 * quedarse solo en virtudes. Aun así, se mantiene siempre en el terreno del
 * "tough love" constructivo: nunca insulta a la persona, nunca la define
 * como "mala" por el patrón, y siempre cierra reforzando que el patrón se
 * puede romper — ver `SHADOW_CLOSERS`. No es una herramienta de diagnóstico
 * ni sustituye a terapia profesional.
 */

const { TAROT_DECK } = require('../data/tarotCards');

const SIGNS = [
  { key: 'aries', name: 'Aries', emoji: '♈', dates: '21 de marzo – 19 de abril', element: 'Fuego' },
  { key: 'tauro', name: 'Tauro', emoji: '♉', dates: '20 de abril – 20 de mayo', element: 'Tierra' },
  { key: 'geminis', name: 'Géminis', emoji: '♊', dates: '21 de mayo – 20 de junio', element: 'Aire' },
  { key: 'cancer', name: 'Cáncer', emoji: '♋', dates: '21 de junio – 22 de julio', element: 'Agua' },
  { key: 'leo', name: 'Leo', emoji: '♌', dates: '23 de julio – 22 de agosto', element: 'Fuego' },
  { key: 'virgo', name: 'Virgo', emoji: '♍', dates: '23 de agosto – 22 de septiembre', element: 'Tierra' },
  { key: 'libra', name: 'Libra', emoji: '♎', dates: '23 de septiembre – 22 de octubre', element: 'Aire' },
  { key: 'escorpio', name: 'Escorpio', emoji: '♏', dates: '23 de octubre – 21 de noviembre', element: 'Agua' },
  { key: 'sagitario', name: 'Sagitario', emoji: '♐', dates: '22 de noviembre – 21 de diciembre', element: 'Fuego' },
  { key: 'capricornio', name: 'Capricornio', emoji: '♑', dates: '22 de diciembre – 19 de enero', element: 'Tierra' },
  { key: 'acuario', name: 'Acuario', emoji: '♒', dates: '20 de enero – 18 de febrero', element: 'Aire' },
  { key: 'piscis', name: 'Piscis', emoji: '♓', dates: '19 de febrero – 20 de marzo', element: 'Agua' },
];

const SIGNS_BY_KEY = Object.fromEntries(SIGNS.map((s) => [s.key, s]));

const ELEMENT_HINT = {
  Fuego: 'esa chispa que no se apaga',
  Tierra: 'tu paso firme y constante',
  Aire: 'tu mente inquieta y curiosa',
  Agua: 'tu sensibilidad y tu intuición',
};

/** El patrón de sombra típico de cada signo: lo que un horóscopo negro nombra sin rodeos. */
const SIGN_SHADOW = {
  aries: { flaw: 'la impulsividad', longFlaw: 'lanzarte a por lo que quieres sin medir muy bien a quién te llevas por delante' },
  tauro: { flaw: 'la tozudez', longFlaw: 'aferrarte a lo conocido aunque ya no te sirva, solo por no ser quien lo suelta' },
  geminis: { flaw: 'la dispersión', longFlaw: 'empezar mil cosas y no terminar ninguna, huyendo del compromiso en cuanto aprieta' },
  cancer: { flaw: 'el rencor silencioso', longFlaw: 'guardarte lo que te duele hasta que un día explota sin que nadie lo viera venir' },
  leo: { flaw: 'la necesidad de aplausos', longFlaw: 'medir tu propio valor por cuánta gente te está mirando en cada momento' },
  virgo: { flaw: 'la autoexigencia', longFlaw: 'hablarte peor de lo que le hablarías jamás a cualquier otra persona' },
  libra: { flaw: 'la indecisión', longFlaw: 'decir que sí a todo el mundo menos, precisamente, a lo que de verdad quieres tú' },
  escorpio: { flaw: 'el control', longFlaw: 'necesitar saberlo todo de los demás mientras tú no sueltas prenda de nada' },
  sagitario: { flaw: 'la fuga hacia adelante', longFlaw: 'salir corriendo justo cuando algo empieza a pedir compromiso de verdad' },
  capricornio: { flaw: 'la frialdad calculada', longFlaw: 'medir cada gesto en términos de utilidad y olvidarte de simplemente sentir' },
  acuario: { flaw: 'la distancia emocional', longFlaw: 'poner tanta cabeza entre tú y los demás que casi nadie llega a tocarte' },
  piscis: { flaw: 'la evasión', longFlaw: 'preferir soñar con la solución antes que enfrentarte de una vez al problema real' },
};

const DAY_NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/* ---------- PRNG determinista con semilla (hash de texto -> mulberry32) ---------- */

function hashString(str) {
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

/* ---------- Semana ISO (lunes a domingo) ---------- */

/** Devuelve una clave estable por semana ISO, ej. "2026-W32". Cambia cada lunes. */
function getISOWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // lunes = 0 ... domingo = 6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // jueves de esta semana
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const weekNumber = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return `${d.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

/** Rango lunes-domingo de la semana que contiene `date`, con una etiqueta legible en español. */
function getWeekRange(date) {
  const dayNum = (date.getDay() + 6) % 7; // lunes = 0
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(date.getDate() - dayNum);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
  return {
    start: monday,
    end: sunday,
    label: `${fmt(monday)} – ${fmt(sunday)}`,
  };
}

/* ---------- Bancos de frases (originales, tono místico + guiño psicológico) ---------- */

const OPENING_LINES = [
  (ctx) => `Vamos sin rodeos, ${ctx.name}: esta semana ${ELEMENT_HINT[ctx.element]} pide protagonismo, y esconderla otra vez no te va a salir gratis.`,
  (ctx) => `${ctx.name}, esta semana llega con movimiento de verdad: lo que llevabas tiempo dejando quieto por comodidad empieza a exigir una decisión.`,
  (ctx) => `Semana de contrastes para ${ctx.name}, y de las que no se leen en diagonal: momentos de mucha claridad conviven con ratos de duda, y ambos tienen algo incómodo que enseñarte.`,
  (ctx) => `${ctx.name}, toca bajar el ritmo un poco y mirar hacia dentro antes de la próxima decisión importante — no como castigo, sino porque llevas semanas decidiendo con el piloto automático puesto.`,
  (ctx) => `Esta semana, ${ctx.name}, conviene confiar más en ${ELEMENT_HINT[ctx.element]} y bastante menos en el ruido de fuera que llevas escuchando últimamente.`,
  (ctx) => `Hay sensación de umbral en el ambiente de ${ctx.name} esta semana: algo se está terminando de verdad, aunque tú todavía sigas fingiendo que no.`,
  (ctx) => `Esta semana no viene a darte respuestas rápidas, ${ctx.name}: pide paciencia con los tiempos, y la paciencia nunca ha sido precisamente lo tuyo.`,
  (ctx) => `${ctx.name} nota esta semana un impulso de orden — ganas de poner en su sitio algo que llevaba tiempo desordenado, por dentro y no solo por fuera. Aprovéchalo antes de que se te pase.`,
];

const SHADOW_OPENERS = [
  (ctx) => `Vamos a hablar claro, ${ctx.name}: esta semana ${ctx.flaw} vuelve a asomar, y tú ya sabes exactamente de qué te estoy hablando.`,
  (ctx) => `${ctx.name}, esta semana no te lo voy a suavizar: eso de ${ctx.longFlaw}, y toca mirarlo de frente en vez de mirar hacia otro lado como siempre.`,
  (ctx) => `Aquí no hay filtros, ${ctx.name}: ${ctx.flaw} es tu patrón de siempre, y esta semana el universo te lo va a poner delante otra vez, te guste o no.`,
  (ctx) => `${ctx.name}, si algo se tuerce esta semana, revisa primero si tiene que ver con ${ctx.flaw} — nueve de cada diez veces, la tiene.`,
  (ctx) => `Nadie te lo va a decir tan directo como esto: ${ctx.name}, eso de ${ctx.longFlaw}, y esta semana te va a costar más caro que otras veces seguir fingiendo que no.`,
  (ctx) => `${ctx.name}, esta semana toca el tema incómodo: ${ctx.flaw}. Sí, otra vez. Sí, tú ya sabías que iba a salir tarde o temprano.`,
  (ctx) => `Sin edulcorantes, ${ctx.name}: eso de ${ctx.longFlaw} es la costumbre que te está pasando factura estos días, no la mala suerte.`,
  (ctx) => `${ctx.name}, hoy toca mirarte al espejo sin filtro: ${ctx.flaw} lleva un tiempo mandando más de lo que crees en tus decisiones.`,
];

const SHADOW_CLOSERS = [
  () => `No es un defecto que te defina para siempre — es un patrón, y los patrones se rompen en cuanto decides mirarlos en vez de justificarlos.`,
  () => `Nombrarlo no es castigarte: es la única forma de dejar de repetirlo en piloto automático semana tras semana.`,
  () => `La buena noticia es que lo que se repite se puede desmontar; la mala es que nadie más lo va a hacer por ti.`,
  () => `No hace falta que te odies por esto, solo que dejes de ponerle excusas cada vez más creativas.`,
  () => `Esta semana es una oportunidad, no una condena: se puede elegir distinto en cuanto se ve venir el patrón a tiempo.`,
  () => `Tenerlo identificado ya es medio camino andado; la otra mitad es no salir corriendo cuando de verdad toque actuar diferente.`,
  () => `No es debilidad reconocerlo, es la parte más adulta de todo esto — el resto de la semana depende de qué hagas con lo que acabas de leer.`,
  () => `Esto se escribe sin maldad: se escribe para que la próxima vez que pase lo veas venir antes que los demás.`,
];

const LOVE_LINES = [
  (ctx) => `En el amor, ${ctx.name}, esta semana no hay término medio: o hablas claro de una vez, o el otro se cansa de tener que adivinarte. Los gestos bonitos no tapan lo que llevas semanas sin decir.`,
  (ctx) => `Si sigues confundiendo intensidad con compromiso, ${ctx.name}, esta semana te toca aprenderlo por las malas. La química no sustituye a la constancia, por mucho que te guste creer que sí.`,
  (ctx) => `Hay una conversación pendiente que llevas evitando, ${ctx.name}, y esta semana el silencio deja de ser una opción cómoda: o la tienes tú, o la acaba teniendo el otro por ti, y peor.`,
  (ctx) => `${ctx.name}, tu manera de "proteger" el vínculo esta semana se parece sospechosamente a controlarlo. Suelta un poco antes de que el otro sienta que necesita escaparse para respirar.`,
  (ctx) => `Toca revisar si estás repitiendo el mismo patrón de siempre con otra cara distinta, ${ctx.name}. El tipo de persona que eliges esta semana dice más de ti que de esa persona.`,
  (ctx) => `Antes de exigir amor de fuera, ${ctx.name}, revisa cómo te has estado hablando a ti mismo/a esta semana — vas a dejar que te traten exactamente así, ni un poco mejor.`,
  (ctx) => `Si estás soltero/a, ${ctx.name}, puede aparecer alguien que no busca deslumbrarte, solo ser honesto — y precisamente por eso te va a costar tomártelo en serio.`,
  (ctx) => `${ctx.name}, dejar de interpretar el silencio ajeno como una sentencia sería un buen ejercicio esta semana. Pregunta antes de escribir tú sola/o la peor versión posible de la historia.`,
];

const WORK_LINES = [
  (ctx) => `En lo laboral, ${ctx.name}, esta semana no premia el golpe de suerte: premia a quien no se ha movido de su sitio cuando nadie estaba mirando. Lo tuyo avanza despacio, y está bien así aunque no te lo parezca hoy.`,
  (ctx) => `Puede llegar una propuesta con muy buena pinta, ${ctx.name}, y precisamente por eso conviene no firmarla en caliente. Duerme sobre ella antes de decir que sí solo por el subidón inicial.`,
  (ctx) => `${ctx.name}, llevas semanas diciendo que sí a todo por no quedar mal, y esta semana la cuenta llega junta. Aprender a decir "ahora no" también es una competencia profesional, no una debilidad.`,
  (ctx) => `Pedir ayuda esta semana no te hace menos capaz, ${ctx.name}: te hace menos ingenuo/a. Sostenerlo todo tú solo/a es el mismo error de siempre disfrazado de responsabilidad.`,
  (ctx) => `Si hay una decisión de dinero importante rondando, ${ctx.name}, esta semana pide comparar antes de decidir. La prisa que sientes no es una señal del universo, es solo prisa.`,
  (ctx) => `El reconocimiento que buscas en el trabajo, ${ctx.name}, puede tardar más de lo que te gustaría en llegar de fuera. Mientras tanto, deja de esperar a que otro te lo dé para dártelo tú.`,
  (ctx) => `Poner límites claros esta semana en lo profesional no te va a hacer menos valioso/a, ${ctx.name}, aunque una parte de ti insista en que sí. Decir hasta dónde llegas es información, no debilidad.`,
  (ctx) => `Puede asomar un pequeño cambio de rumbo laboral, ${ctx.name}, y no pasa nada por no tener todavía la respuesta perfecta. Quedarte quieto/a por miedo a equivocarte también es una forma de elegir.`,
];

const WELLNESS_LINES = [
  (ctx) => `A nivel físico, ${ctx.name}, el cuerpo lleva tiempo pidiendo un descanso que no le estás dando, y esta semana te va a pasar factura si sigues ignorándolo. No hace falta llegar al límite para tener permiso de parar.`,
  (ctx) => `La carga mental que llevas acumulada, ${ctx.name}, no se cura solo durmiendo más horas. Parte de ese cansancio es emocional, y esta semana toca nombrarlo en vez de arrastrarlo en silencio otra vez.`,
  (ctx) => `${ctx.name}, hay una rutina que te sentaba bien y que fuiste abandonando sin darte ni cuenta. Retomarla esta semana, aunque sea a medias, te va a devolver más de lo que ahora mismo crees.`,
  (ctx) => `Si últimamente sientes el cuerpo tenso, ${ctx.name}, probablemente llevas guardando cosas que deberían haberse dicho o soltado hace tiempo. Muévete esta semana con algo que disfrutes, no como castigo.`,
  (ctx) => `Puede aflorar algo emocional que llevabas guardado, ${ctx.name}, y no es un retroceso — es la primera vez en semanas que te da la gana de sentirlo en lugar de esquivarlo.`,
  (ctx) => `La autoexigencia esta semana no te está rindiendo más, ${ctx.name}: solo te está cansando más. Se puede avanzar igual siendo bastante menos dura o duro contigo mismo/a por el camino.`,
  (ctx) => `Descansar de verdad esta semana no es solo dormir, ${ctx.name}: es también soltar el móvil y las pendientes un rato sin sentir que le estás fallando a alguien.`,
  (ctx) => `Si hay ansiedad de fondo, ${ctx.name}, esta semana ayuda ponerle nombre exacto a lo que la provoca, en vez de dejarla flotando sin forma haciendo ruido todo el día.`,
];

const ADVICE_LINES = [
  (ctx) => `El consejo de la carta de esta semana, ${ctx.cardName}${ctx.reversed ? ' invertida' : ''}, no es sutil: ${ctx.reversed ? 'toca mirar de frente justo lo que llevas evitando, aunque duela un poco al principio' : 'toca confiar en el proceso y sostener el rumbo ya elegido, sin necesitar aplausos externos para seguir'}.`,
  (ctx) => `${ctx.cardName}${ctx.reversed ? ', invertida,' : ''} no viene a consolarte, ${ctx.name}, viene a empujarte: ${ctx.reversed ? 'suelta el control sobre lo que nunca dependió de ti' : 'da ya el paso que llevas semanas posponiendo con excusas cada vez más creativas'}.`,
  (ctx) => `La carta que acompaña a ${ctx.name} esta semana, ${ctx.cardName}, ${ctx.reversed ? 'pide revisar antes de repetir un patrón que ya conoces de sobra' : 'trae permiso para empezar algo nuevo sin pedir perdón por ello'}.`,
  (ctx) => `Con ${ctx.cardName}${ctx.reversed ? ' invertida' : ''} de fondo, ${ctx.name}, esta semana conviene ${ctx.reversed ? 'dejar de forzar los tiempos y aceptar que algunas cosas maduran cuando maduran, no cuando tú lo decides' : 'actuar con la certeza de que vas en la dirección correcta, aunque nadie más lo confirme todavía'}.`,
];

const CLOSING_LINES = [
  (ctx) => `Y con esto no te pido que me des la razón, ${ctx.name}, solo que le eches un vistazo antes de descartarlo. Feliz semana, con o sin filtro.`,
  (ctx) => `No te lo he escrito para que te sientas mal, ${ctx.name}: te lo he escrito para que no te vuelva a pillar por sorpresa. Suerte esta semana.`,
  (ctx) => `${ctx.name}, esta semana no viene a gustarte, viene a servirte. Haz con ella lo que quieras, pero ya no digas que nadie te avisó.`,
  (ctx) => `Sin dramas ni endulzantes, ${ctx.name}: lo importante ya está dicho. El resto de la semana es cosa tuya.`,
  (ctx) => `${ctx.name}, si algo de esto te ha molestado un poco, probablemente iba precisamente por ahí la cosa. Buena semana, de verdad.`,
  (ctx) => `No hay bola de cristal que decida por ti, ${ctx.name} — solo un empujón sincero para que decidas tú con los ojos un poco más abiertos.`,
  (ctx) => `Eso es todo por esta semana, ${ctx.name}: sin azúcar, pero con cariño de fondo. Nos leemos la semana que viene.`,
  (ctx) => `${ctx.name}, guarda esto para el día que lo necesites recordar. Mientras tanto, buena semana — te la has ganado igual.`,
];

/**
 * Genera el horóscopo semanal de un signo para la semana que contiene `referenceDate`.
 * Determinista: mismo signo + misma semana ISO -> mismo resultado siempre.
 */
function generateWeeklyHoroscope(signKey, referenceDate = new Date()) {
  const sign = SIGNS_BY_KEY[signKey];
  if (!sign) {
    const err = new Error(`Signo no reconocido: "${signKey}". Usa uno de: ${SIGNS.map((s) => s.key).join(', ')}.`);
    err.status = 400;
    throw err;
  }

  const weekKey = getISOWeekKey(referenceDate);
  const weekRange = getWeekRange(referenceDate);
  const rng = mulberry32(hashString(`${sign.key}::${weekKey}`));

  const ctx = { name: sign.name, element: sign.element };
  const shadowCtx = { ...ctx, ...SIGN_SHADOW[sign.key] };

  const opening = pick(OPENING_LINES, rng)(ctx);
  const shadow = `${pick(SHADOW_OPENERS, rng)(shadowCtx)} ${pick(SHADOW_CLOSERS, rng)(shadowCtx)}`;
  const love = pick(LOVE_LINES, rng)(ctx);
  const work = pick(WORK_LINES, rng)(ctx);
  const wellness = pick(WELLNESS_LINES, rng)(ctx);

  const cardIndex = Math.floor(rng() * TAROT_DECK.length);
  const card = TAROT_DECK[cardIndex];
  const reversed = rng() < 0.5;
  const luckyDay = DAY_NAMES[Math.floor(rng() * DAY_NAMES.length)];
  const luckyNumber = 1 + Math.floor(rng() * 99);

  const advice = pick(ADVICE_LINES, rng)({ ...ctx, cardName: card.name, reversed });
  const closing = pick(CLOSING_LINES, rng)(ctx);

  return {
    sign: { key: sign.key, name: sign.name, emoji: sign.emoji, dates: sign.dates, element: sign.element },
    weekKey,
    weekLabel: weekRange.label,
    opening,
    shadow,
    love,
    work,
    wellness,
    advice,
    closing,
    cardOfTheWeek: { name: card.name, reversed },
    luckyDay,
    luckyNumber,
  };
}

function generateAllWeeklyHoroscopes(referenceDate = new Date()) {
  const weekRange = getWeekRange(referenceDate);
  return {
    weekKey: getISOWeekKey(referenceDate),
    weekLabel: weekRange.label,
    signs: SIGNS,
    horoscopes: Object.fromEntries(SIGNS.map((s) => [s.key, generateWeeklyHoroscope(s.key, referenceDate)])),
  };
}

module.exports = {
  SIGNS,
  generateWeeklyHoroscope,
  generateAllWeeklyHoroscopes,
  getISOWeekKey,
  getWeekRange,
};
