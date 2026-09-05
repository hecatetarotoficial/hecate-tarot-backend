/**
 * Listado de rituales de magia blanca, organizados por categoría.
 * Contenido con fines espirituales/de entretenimiento.
 */

const RITUALS = [
  // ---------- LIMPIEZA DE HOGAR ----------
  {
    id: 'limpieza-1',
    category: 'limpieza',
    title: 'Limpieza con humo de salvia blanca (sahumado)',
    intention: 'Eliminar energías densas o estancadas del hogar.',
    materials: ['Un manojo de salvia blanca (o palo santo)', 'Un plato o concha resistente al calor', 'Una ventana que se pueda abrir'],
    bestMoment: 'Luna menguante, o cualquier día después de una discusión, mudanza o enfermedad.',
    steps: [
      'Abre puertas y ventanas para que el aire circule.',
      'Enciende la salvia hasta que humee (sin llama activa).',
      'Recorre cada habitación en sentido de las agujas del reloj, llevando el humo hacia rincones y detrás de las puertas.',
      'Mientras avanzas, repite mentalmente o en voz alta: "Que se vaya lo que no sirve, que entre solo lo que sana."',
      'Termina cerca de la puerta principal, dejando salir el humo hacia el exterior.',
    ],
  },
  {
    id: 'limpieza-2',
    category: 'limpieza',
    title: 'Agua de sal y romero para pisos',
    intention: 'Purificar el suelo del hogar y cortar energías negativas acumuladas.',
    materials: ['Un cubo de agua', 'Un puñado de sal gruesa', 'Un manojo de romero fresco'],
    bestMoment: 'Viernes, preferiblemente en luna menguante.',
    steps: [
      'Hierve el romero en agua durante 10 minutos y deja enfriar.',
      'Cuela el agua y añádele la sal, disolviéndola bien.',
      'Añade esta agua al cubo de fregado y limpia los suelos de la puerta hacia adentro, o de adentro hacia la puerta si buscas expulsar algo concreto.',
      'Visualiza una luz blanca limpiando cada rincón mientras friegas.',
    ],
  },
  {
    id: 'limpieza-3',
    category: 'limpieza',
    title: 'Sal en las esquinas',
    intention: 'Absorber energías negativas de forma continua.',
    materials: ['Sal gruesa', '4 cuencos pequeños'],
    bestMoment: 'Luna nueva, para renovarlo cada mes.',
    steps: [
      'Coloca un cuenco con sal gruesa en cada esquina de la habitación principal de la casa.',
      'Deja reposar durante 7 días.',
      'Desecha la sal tirándola por el inodoro (no la reutilices ni la dejes en la tierra del jardín).',
      'Repite el proceso cada luna nueva.',
    ],
  },

  // ---------- ABRECAMINOS ----------
  {
    id: 'abrecaminos-1',
    category: 'abrecaminos',
    title: 'Ritual de la vela verde para abrir caminos',
    intention: 'Desbloquear oportunidades laborales o económicas estancadas.',
    materials: ['Una vela verde', 'Aceite de oliva', 'Canela en polvo', 'Un papel y un bolígrafo'],
    bestMoment: 'Luna creciente, idealmente en martes o jueves.',
    steps: [
      'Escribe en el papel la situación que quieres desbloquear, en presente y en positivo.',
      'Unge la vela con aceite de oliva de arriba hacia abajo y espolvorea un poco de canela.',
      'Coloca la vela sobre el papel doblado en cuatro.',
      'Enciéndela y visualiza el camino abriéndose ante ti mientras dices: "Se abre el camino, fluye la abundancia, todo obstáculo se disuelve."',
      'Deja que la vela se consuma por completo en un lugar seguro.',
    ],
  },
  {
    id: 'abrecaminos-2',
    category: 'abrecaminos',
    title: 'Baño de abrecaminos con hierbas',
    intention: 'Limpiar el aura personal y atraer nuevas oportunidades.',
    materials: ['Albahaca fresca', 'Pétalos de caléndula', 'Miel', 'Agua'],
    bestMoment: 'Al amanecer, en luna creciente.',
    steps: [
      'Prepara una infusión con la albahaca y la caléndula, cuela y deja templar.',
      'Añade una cucharada de miel al agua de la ducha o báñate con ella de cuello hacia abajo tras tu ducha habitual.',
      'Mientras te la aplicas, agradece por los caminos que ya se han abierto y pide claridad para los nuevos.',
      'No te seques con toalla en las zonas rociadas; deja que se seque al aire.',
    ],
  },
  {
    id: 'abrecaminos-3',
    category: 'abrecaminos',
    title: 'Planta abrecaminos en la entrada',
    intention: 'Mantener un flujo constante de oportunidades entrando al hogar o negocio.',
    materials: ['Una planta de albahaca o siete machos', 'Una maceta', 'Un papel con tu intención escrita'],
    bestMoment: 'Luna nueva.',
    steps: [
      'Escribe tu intención principal en un papel pequeño y colócalo en el fondo de la maceta antes de plantar.',
      'Planta la hierba y colócala cerca de la puerta de entrada.',
      'Riégala cada semana repitiendo tu intención en voz baja.',
      'Cuida de que la planta se mantenga sana; una planta marchita se reemplaza cuanto antes.',
    ],
  },

  // ---------- AMOR ----------
  {
    id: 'amor-1',
    category: 'amor',
    title: 'Ritual de la vela rosa para el autoamor',
    intention: 'Fortalecer el amor propio antes de abrirte a una nueva relación.',
    materials: ['Una vela rosa', 'Un espejo pequeño', 'Pétalos de rosa'],
    bestMoment: 'Viernes en luna creciente.',
    steps: [
      'Coloca el espejo frente a ti y rodéalo con los pétalos de rosa.',
      'Enciende la vela y mírate al espejo con calma.',
      'Repite: "Me acepto, me valoro y merezco un amor que me sume."',
      'Deja arder la vela unos 20-30 minutos mientras reflexionas, y apágala (no la soples, usa un apagavelas o los dedos húmedos).',
    ],
  },
  {
    id: 'amor-2',
    category: 'amor',
    title: 'Frasco de la miel para endulzar una relación',
    intention: 'Suavizar tensiones y traer dulzura a una relación existente.',
    materials: ['Un frasco pequeño con tapa', 'Miel', 'Un papel con el nombre de ambas personas', 'Canela'],
    bestMoment: 'Luna creciente.',
    steps: [
      'Escribe ambos nombres en el papel, uno cruzado con el otro.',
      'Introduce el papel en el frasco y cúbrelo con miel.',
      'Añade una pizca de canela.',
      'Cierra el frasco y colócalo en un lugar tranquilo de tu casa, repitiendo tu intención de armonía.',
    ],
  },
  {
    id: 'amor-3',
    category: 'amor',
    title: 'Ritual de luna llena para atraer el amor',
    intention: 'Abrir el corazón a una nueva relación alineada con lo que deseas.',
    materials: ['Una hoja de papel', 'Un cuenco con agua', 'Un cuarzo rosa'],
    bestMoment: 'Noche de luna llena.',
    steps: [
      'Escribe en el papel las cualidades que deseas en una relación (no nombres de personas concretas).',
      'Coloca el papel bajo el cuenco con agua, de forma que quede bajo la luz de la luna si es posible.',
      'Deja el cuarzo rosa dentro del agua durante toda la noche.',
      'Por la mañana, retira el cuarzo, sécalo y llévalo contigo como recordatorio de tu intención.',
    ],
  },

  // ---------- ORACIONES ----------
  {
    id: 'oracion-1',
    category: 'oraciones',
    title: 'Oración de protección diaria',
    intention: 'Pedir protección y claridad para el día.',
    materials: ['Ninguno (puede acompañarse de una vela blanca)'],
    bestMoment: 'Cada mañana, al despertar.',
    steps: [
      'Respira profundamente tres veces.',
      'Recita: "Que la luz me acompañe hoy, que la protección me envuelva, que la claridad guíe cada paso que doy. Así sea."',
      'Visualiza una luz blanca envolviendo todo tu cuerpo antes de comenzar el día.',
    ],
  },
  {
    id: 'oracion-2',
    category: 'oraciones',
    title: 'Oración para pedir claridad en una decisión',
    intention: 'Recibir guía interior antes de tomar una decisión importante.',
    materials: ['Una vela blanca o azul'],
    bestMoment: 'Antes de dormir, cuando necesites decidir algo importante.',
    steps: [
      'Enciende la vela y respira con calma durante un minuto.',
      'Recita: "Pido claridad para ver con el corazón y la mente en calma. Que se me muestre el camino correcto para mí."',
      'Anota cualquier idea o sensación que surja tras el ritual, sin juzgarla.',
    ],
  },
  {
    id: 'oracion-3',
    category: 'oraciones',
    title: 'Oración de gratitud y abundancia',
    intention: 'Reforzar una mentalidad de abundancia y atraer bienestar.',
    materials: ['Ninguno'],
    bestMoment: 'Antes de dormir.',
    steps: [
      'Piensa en tres cosas buenas que ocurrieron hoy, por pequeñas que sean.',
      'Recita: "Gracias por lo que tengo, gracias por lo que viene. Abro mi vida a la abundancia y la recibo con humildad."',
      'Termina con una respiración profunda y una sonrisa antes de dormir.',
    ],
  },
];

const CATEGORIES = [
  { id: 'limpieza', label: 'Limpieza de hogar' },
  { id: 'abrecaminos', label: 'Abrecaminos' },
  { id: 'amor', label: 'Amor' },
  { id: 'oraciones', label: 'Oraciones' },
];

module.exports = { RITUALS, CATEGORIES };
