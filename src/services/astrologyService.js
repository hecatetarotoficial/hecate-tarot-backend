/**
 * Servicio de cálculo de carta astral.
 *
 * IMPORTANTE SOBRE PRECISIÓN:
 * Este servicio usa fórmulas astronómicas simplificadas (basadas en los algoritmos
 * de baja precisión de Jean Meeus, "Astronomical Algorithms") para calcular:
 *   - Posición del Sol (signo solar) -> muy precisa (error < 0.01°)
 *   - Posición de la Luna (signo lunar) -> aproximada (error de hasta ~0.5°-1°,
 *     lo que en momentos muy cercanos a un cambio de signo podría dar el signo
 *     contiguo)
 *   - Ascendente y Medio Cielo -> precisos si la hora y el lugar de nacimiento
 *     son exactos (son muy sensibles a la hora: un error de 4 minutos puede
 *     mover el Ascendente ~1°)
 *
 * No calcula todavía el resto de planetas (Mercurio, Venus, Marte, etc.) ni las
 * casas astrológicas completas. Para una app comercial de astrología con
 * precisión profesional, se recomienda sustituir este servicio por una
 * efeméride real como "swisseph" (Swiss Ephemeris) o el paquete
 * "astronomy-engine", manteniendo la misma forma de la función
 * calculateNatalChart() para no tener que tocar las rutas ni la app móvil.
 */

const SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
];

const SIGN_TRAITS = {
  Aries: 'Iniciativa, valentía y energía impulsiva.',
  Tauro: 'Estabilidad, sensualidad y determinación.',
  Géminis: 'Curiosidad, comunicación y adaptabilidad.',
  Cáncer: 'Sensibilidad, protección y memoria emocional.',
  Leo: 'Creatividad, generosidad y necesidad de brillar.',
  Virgo: 'Orden, análisis y vocación de servicio.',
  Libra: 'Equilibrio, diplomacia y búsqueda de armonía.',
  Escorpio: 'Intensidad, transformación y profundidad emocional.',
  Sagitario: 'Optimismo, libertad y expansión.',
  Capricornio: 'Disciplina, ambición y sentido de la responsabilidad.',
  Acuario: 'Originalidad, independencia y visión colectiva.',
  Piscis: 'Empatía, imaginación y conexión espiritual.',
};

function normalizeDegrees(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

/** Día juliano (UT) a partir de fecha/hora civil (algoritmo de Meeus). */
function toJulianDay(year, month, day, hour, minute) {
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + (hour + minute / 60) / 24;
  return (
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    dayFrac +
    B -
    1524.5
  );
}

function signFromLongitude(longitude) {
  const lon = normalizeDegrees(longitude);
  const index = Math.floor(lon / 30);
  const degreeInSign = lon - index * 30;
  return {
    sign: SIGNS[index],
    degree: Number(degreeInSign.toFixed(2)),
    longitude: Number(lon.toFixed(2)),
    traits: SIGN_TRAITS[SIGNS[index]],
  };
}

/** Longitud eclíptica del Sol (fórmula de baja precisión de Meeus, muy exacta en la práctica). */
function sunLongitude(n) {
  const L = normalizeDegrees(280.46 + 0.9856474 * n);
  const g = normalizeDegrees(357.528 + 0.9856003 * n);
  const lambda =
    L + 1.915 * Math.sin(toRad(g)) + 0.02 * Math.sin(toRad(2 * g));
  return normalizeDegrees(lambda);
}

/** Longitud eclíptica aproximada de la Luna (fórmula de baja precisión de Meeus). */
function moonLongitude(T) {
  const Lp = normalizeDegrees(218.32 + 481267.881 * T);
  const term =
    6.29 * Math.sin(toRad(normalizeDegrees(134.9 + 477198.85 * T))) -
    1.27 * Math.sin(toRad(normalizeDegrees(259.2 - 413335.38 * T))) +
    0.66 * Math.sin(toRad(normalizeDegrees(235.7 + 890534.23 * T))) +
    0.21 * Math.sin(toRad(normalizeDegrees(269.9 + 954397.7 * T))) -
    0.19 * Math.sin(toRad(normalizeDegrees(357.5 + 35999.05 * T))) -
    0.11 * Math.sin(toRad(normalizeDegrees(186.6 + 966404.05 * T)));
  return normalizeDegrees(Lp + term);
}

/** Oblicuidad de la eclíptica. */
function obliquity(T) {
  return 23.4392911 - 0.0130042 * T;
}

/** Tiempo sidéreo medio de Greenwich, en grados. */
function gmstDegrees(jd, T) {
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return normalizeDegrees(gmst);
}

/**
 * Calcula la carta natal simplificada (Sol, Luna, Ascendente, Medio Cielo).
 *
 * @param {Object} params
 * @param {number} params.year
 * @param {number} params.month  1-12
 * @param {number} params.day
 * @param {number} params.hour   0-23 (hora LOCAL de nacimiento)
 * @param {number} params.minute 0-59
 * @param {number} params.utcOffsetHours  desfase horario respecto a UTC en el lugar/fecha de nacimiento
 *        (por ejemplo, España en horario de verano = 2, en horario de invierno = 1)
 * @param {number} params.latitude   grados decimales, positivo = Norte
 * @param {number} params.longitude  grados decimales, positivo = Este, negativo = Oeste
 */
function calculateNatalChart({
  year,
  month,
  day,
  hour = 12,
  minute = 0,
  utcOffsetHours = 0,
  latitude,
  longitude,
}) {
  if (!year || !month || !day) {
    const err = new Error('Fecha de nacimiento incompleta (year, month, day son obligatorios).');
    err.status = 400;
    throw err;
  }

  const hasExactTime = hour !== null && hour !== undefined;
  const hasLocation = typeof latitude === 'number' && typeof longitude === 'number';

  // Convertimos la hora local a UT restando el desfase horario
  const utHour = (hasExactTime ? hour : 12) - (utcOffsetHours || 0);

  const jd = toJulianDay(year, month, day, utHour, minute || 0);
  const n = jd - 2451545.0; // días desde J2000.0
  const T = n / 36525; // siglos julianos desde J2000.0

  const sunLon = sunLongitude(n);
  const moonLon = moonLongitude(T);

  const result = {
    sol: signFromLongitude(sunLon),
    luna: signFromLongitude(moonLon),
    ascendente: null,
    medioCielo: null,
    avisos: [],
  };

  if (!hasExactTime) {
    result.avisos.push(
      'No indicaste la hora de nacimiento: el signo lunar es orientativo y no se puede calcular el Ascendente.'
    );
  }

  if (hasExactTime && hasLocation) {
    const eps = obliquity(T);
    const gmst = gmstDegrees(jd, T);
    const lst = normalizeDegrees(gmst + longitude); // tiempo sidéreo local en grados
    const ramc = lst; // ascensión recta del medio cielo

    const epsRad = toRad(eps);
    const ramcRad = toRad(ramc);
    const latRad = toRad(latitude);

    const ascY = -Math.cos(ramcRad);
    const ascX = Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
    const ascLon = normalizeDegrees(toDeg(Math.atan2(ascY, ascX)));

    const mcLon = normalizeDegrees(
      toDeg(Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad)))
    );

    result.ascendente = signFromLongitude(ascLon);
    result.medioCielo = signFromLongitude(mcLon);
  } else if (hasExactTime && !hasLocation) {
    result.avisos.push(
      'No indicaste el lugar de nacimiento (latitud/longitud): no se puede calcular el Ascendente ni el Medio Cielo.'
    );
  }

  result.avisos.push(
    'Cálculo aproximado con fines de entretenimiento. Para una carta astral de precisión profesional (con todos los planetas y casas), integra una efeméride real como Swiss Ephemeris.'
  );

  return result;
}

module.exports = { calculateNatalChart, SIGNS, SIGN_TRAITS };
