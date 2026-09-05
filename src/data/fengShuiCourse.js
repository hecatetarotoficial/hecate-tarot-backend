/**
 * Curso "Feng Shui en el hogar" — contenido real, independiente del curso de tarot.
 * 5 módulos: de los principios básicos a aplicaciones prácticas habitación por
 * habitación, pensado para alguien sin conocimientos previos.
 */

const FENGSHUI_MODULES = [
  {
    id: 'fs-modulo-1',
    order: 1,
    title: 'Qué es el feng shui y el concepto de chi',
    summary: 'Los fundamentos: qué busca realmente el feng shui y por qué la energía (chi) es el hilo conductor de todo lo demás.',
    free: true, // lección gratuita de muestra: se puede leer entera sin comprar el curso
    content: [
      'El feng shui ("viento y agua" en chino) es un sistema tradicional que estudia cómo el entorno —la disposición de los espacios, los objetos y los elementos naturales— influye en el bienestar, la salud y la prosperidad de quienes lo habitan. No es una religión ni sustituye a ninguna disciplina: es, sobre todo, una forma de observar y ordenar el espacio con intención.',
      'El concepto central es el "chi": la energía vital que, según esta tradición, circula por todos los espacios igual que circula el aire o el agua. Un hogar con buen feng shui es aquel donde el chi fluye con suavidad —ni estancado en rincones olvidados y llenos de trastos, ni disparado en línea recta y perdido por pasillos o ventanas enfrentadas a la puerta principal—.',
      'Antes de aplicar ninguna técnica concreta, el primer paso siempre es el mismo: caminar por tu casa con atención plena y preguntarte, habitación por habitación, "¿cómo me siento aquí?". Esa sensación —de calma, de agobio, de estancamiento— suele ser la pista más honesta de por dónde empezar.',
    ],
    exercise: 'Recorre tu casa habitación por habitación y anota, en una palabra, cómo te sientes en cada una. Guarda esa lista: la usarás en el módulo 5 para priorizar por dónde empezar.',
  },
  {
    id: 'fs-modulo-2',
    order: 2,
    title: 'El mapa Bagua: las nueve áreas de tu hogar',
    summary: 'La herramienta central del feng shui: cómo dividir cualquier vivienda en nueve áreas asociadas a distintos ámbitos de la vida.',
    content: [
      'El Bagua es un mapa energético de ocho áreas alrededor de un centro (nueve en total) que se superpone sobre la planta de tu casa o de una habitación. Cada área se asocia tradicionalmente a un ámbito vital: Riqueza (zona trasera izquierda), Fama y reconocimiento (fondo central), Relaciones y amor (trasera derecha), Familia (lateral izquierdo central), Centro/Salud (el corazón de la vivienda), Creatividad e hijos (lateral derecho central), Conocimiento y sabiduría (delantera izquierda), Carrera profesional (frente central, junto a la puerta principal) y Viajes y personas que ayudan (delantera derecha).',
      'Para aplicar el mapa, coloca la pared donde está tu puerta principal en la parte inferior del mapa y superpón el resto de la vivienda proporcionalmente. No hace falta precisión milimétrica: basta con identificar, a grandes rasgos, en qué zona de tu casa cae cada área.',
      'Este mapa no busca que "cambies de casa" ni que muevas paredes: es una guía para saber, cuando quieras trabajar sobre un tema concreto de tu vida (por ejemplo, tu economía), en qué rincón físico de tu hogar conviene poner más atención, luz y cuidado.',
    ],
    exercise: 'Dibuja un plano sencillo de tu vivienda (a mano basta) y superpón las nueve áreas del Bagua. Marca con una estrella el área correspondiente a lo que más te gustaría mejorar ahora mismo en tu vida.',
  },
  {
    id: 'fs-modulo-3',
    order: 3,
    title: 'Los cinco elementos y sus colores',
    summary: 'Madera, Fuego, Tierra, Metal y Agua: cómo se relacionan entre sí y cómo usarlos para equilibrar cualquier espacio.',
    content: [
      'El feng shui trabaja con cinco elementos que se generan y se controlan entre sí en un ciclo: Madera (alimenta al Fuego), Fuego (genera Tierra, en forma de cenizas), Tierra (da origen al Metal), Metal (enriquece el Agua) y Agua (nutre a la Madera, cerrando el ciclo). Entender este ciclo te permite reforzar un elemento débil o suavizar uno excesivo con su elemento "amigo".',
      'Cada elemento tiene colores, formas y materiales asociados: Madera (verdes y marrones, formas rectangulares y columnas, plantas y muebles de madera), Fuego (rojos, naranjas y morados intensos, formas triangulares, velas e iluminación), Tierra (tonos tierra, amarillos y beige, formas cuadradas, cerámica y piedra), Metal (blancos, grises y dorados/plateados, formas circulares, objetos metálicos) y Agua (azules oscuros y negros, formas ondulantes, espejos y fuentes de agua).',
      'No se trata de llenar tu casa de los cinco elementos por igual, sino de observar qué elemento predomina en exceso (por ejemplo, un salón todo en blanco y metal puede sentirse frío) y cuál falta casi por completo, para reequilibrar con pequeños toques: un cojín, una planta, un cuadro, no hace falta reformar nada.',
    ],
    exercise: 'Elige la habitación donde pasas más tiempo y anota qué elemento predomina claramente en su decoración actual (colores, materiales, formas) y cuál está prácticamente ausente. Piensa un objeto pequeño que podrías añadir para introducir ese elemento que falta.',
  },
  {
    id: 'fs-modulo-4',
    order: 4,
    title: 'Despejar y ordenar: la base de cualquier buen feng shui',
    summary: 'Antes de "activar" nada, hay que despejar. Por qué el desorden es, en feng shui, el obstáculo número uno para el buen chi.',
    content: [
      'Si tuvieras que quedarte con una sola enseñanza de todo el feng shui, sería esta: el desorden bloquea el chi antes que cualquier otra cosa. Un armario abarrotado, un cajón que no se puede cerrar, montones de papeles "para luego"... todo eso son, energéticamente, obstáculos físicos que impiden que la energía —y contigo, las oportunidades— circule con libertad.',
      'Una forma sencilla de empezar es la "regla de la caja": elige una zona pequeña (un cajón, una balda) y saca todo su contenido. Divide en tres montones: lo que usas y amas de verdad, lo que no usas desde hace más de un año, y lo que está roto o incompleto. Los dos últimos montones, por norma general, deben salir de casa (donar, reciclar o tirar).',
      'Presta especial atención a la entrada de tu casa (la "boca del chi", por donde entra toda la energía nueva) y a debajo de la cama (un clásico acumulador de trastos que, según el feng shui, afecta directamente a la calidad del descanso). Mantener estas dos zonas despejadas suele notarse rápido en cómo se siente el hogar.',
    ],
    exercise: 'Aplica la "regla de la caja" a un solo cajón o balda esta semana. Antes de empezar, haz una foto; después de terminar, haz otra. Compara cómo cambia la sensación al abrir ese espacio.',
  },
  {
    id: 'fs-modulo-5',
    order: 5,
    title: 'Feng shui práctico, habitación por habitación',
    summary: 'Consejos concretos y aplicables hoy mismo para entrada, salón, dormitorio, cocina y baño.',
    content: [
      'Entrada: debe estar bien iluminada, despejada y ser fácil de abrir del todo (nada de zapatos o cajas bloqueando la puerta). Un espejo cerca de la entrada, siempre que no refleje la puerta directamente de frente, ayuda a ampliar y airear la energía de este punto tan importante.',
      'Salón: es el corazón social de la casa. Coloca el sofá principal contra una pared sólida (no bajo una ventana grande sin protección) y desde donde se vea la puerta de entrada, si es posible: esa posición transmite seguridad. Evita pasillos de energía en línea recta entre dos puertas opuestas; si los tienes, suaviza con una planta o una alfombra que "corte" el paso directo.',
      'Dormitorio: la cama es lo más importante de toda la casa en feng shui, porque ahí pasas la parte más vulnerable del día (durmiendo). Colócala en la llamada "posición de mando": lo más lejos posible de la puerta, pero viéndola desde la cama sin estar alineado directamente con ella, y con un cabecero sólido pegado a la pared. Retira televisores, escritorios de trabajo y espejos que reflejen la cama si buscas mejorar el descanso.',
      'Cocina: representa la abundancia y la salud familiar. Mantén los fogones limpios y en buen estado (tradicionalmente, se asocian con la prosperidad del hogar) y evita que estén justo enfrentados a la puerta de la cocina o alineados con el fregadero (el "choque" entre fuego y agua se considera desequilibrante).',
      'Baño: al estar asociado al elemento Agua, un baño descuidado se considera una "fuga" de la buena energía y, simbólicamente, de la prosperidad. Mantén la tapa del inodoro bajada cuando no se use, la puerta cerrada, y cuida especialmente que no haya grifos que goteen.',
    ],
    exercise: 'Elige UNA sola habitación de las descritas en este módulo y aplica un solo cambio esta semana (mover un mueble, despejar una superficie, reparar un grifo que gotea). Anota cómo te sientes en ese espacio antes y después del cambio.',
  },
];

module.exports = { FENGSHUI_MODULES };
