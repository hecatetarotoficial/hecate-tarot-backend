/**
 * Curso de iniciación al tarot (contenido real, no de relleno).
 * Pensado para alguien que nunca ha leído el tarot y quiere aprender desde cero
 * hasta ser capaz de hacer e interpretar sus propias tiradas con criterio propio.
 * Precio: 9,99 € (ver PRICE_COURSE_CENTS en stripeService.js).
 *
 * Cada módulo tiene: id, orden, título, resumen corto (se muestra aunque el
 * curso esté bloqueado, a modo de vista previa) y el contenido completo
 * (array de párrafos, con ejemplos concretos y pasos aplicables, no solo
 * teoría) + varios ejercicios prácticos (`exercises`, array), que solo se
 * entregan si el usuario ha pagado el curso.
 *
 * Ampliado en agosto de 2026: cada módulo pasa de ~3 párrafos y 1 ejercicio a
 * 6-7 párrafos con ejemplos trabajados y 3 ejercicios progresivos (uno de
 * observación, uno de práctica guiada y uno de práctica libre), a petición
 * de Andrea, para que el curso sea más largo y sobre todo más práctico.
 *
 * Segunda ampliación (agosto de 2026, mismo mes): el módulo 1 se alarga con
 * contenido histórico real y verificable (mazo Visconti-Sforza, la teoría
 * egipcia de Court de Gébelin, la cábala de Éliphas Lévi, la Golden Dawn y
 * el Tarot de Marsella), también a petición de Andrea, para dar más
 * contexto histórico y hacer el curso aún más largo.
 */

const COURSE_MODULES = [
  {
    id: 'modulo-1',
    order: 1,
    title: 'De dónde viene el tarot y qué es realmente',
    summary: 'Los orígenes del tarot, cómo pasó de ser un juego de cartas a una herramienta de introspección, y qué puedes esperar (y qué no) de una lectura.',
    content: [
      'El tarot tal y como lo conocemos hoy tiene sus raíces en los mazos de "trionfi" que se jugaban en las cortes italianas del siglo XV, como simples cartas para un juego similar al bridge. No fue hasta el siglo XVIII, con el ocultismo francés, cuando empezó a asociarse con el simbolismo esotérico, la cábala y la astrología, y se convirtió en la herramienta de introspección y guía que se usa en la actualidad.',
      'Los mazos más antiguos que se conservan son de mediados del siglo XV, encargados por familias nobles italianas como los Visconti y los Sforza en Milán: el llamado "Visconti-Sforza" es hoy el ejemplo más citado, pintado a mano como objeto de lujo, con pan de oro en el fondo de cada carta. En aquella época el tarot no tenía ninguna connotación mística: era simplemente un juego de cartas con triunfos (de ahí "trionfi"), parecido a otros juegos de mesa de la nobleza renacentista, y así se jugó en Italia, Francia y otras cortes europeas durante casi tres siglos, sin ningún significado esotérico.',
      'El giro llegó en 1781, cuando el clérigo y erudito francés Antoine Court de Gébelin publicó un ensayo afirmando que el tarot escondía la sabiduría perdida del antiguo Egipto, disfrazada de simple juego de cartas para sobrevivir a la persecución religiosa. Hoy se sabe que esta teoría es históricamente falsa —el tarot es europeo, no egipcio—, pero fue enormemente influyente: a partir de ese momento, el tarot dejó de ser solo un juego y empezó a leerse como un sistema de símbolos con un significado oculto por descubrir.',
      'Durante el siglo XIX, el ocultista francés Éliphas Lévi conectó formalmente el tarot con la cábala judía, asignando cada uno de los 22 arcanos mayores a una letra del alefato hebreo, una asociación que todavía hoy usan muchas escuelas de tarot. Ya a finales de siglo, la Hermetic Order of the Golden Dawn —una sociedad esotérica británica a la que pertenecieron tanto Arthur Edward Waite como Pamela Colman Smith— sistematizó y amplió estas correspondencias, sentando las bases del tarot moderno tal y como se enseña hoy en día.',
      'También es útil conocer el otro gran mazo histórico, el Tarot de Marsella: nacido en Francia en el siglo XVII a partir de los diseños italianos, es el que verás en muchas barajas europeas tradicionales, con arcanos menores dibujados de forma geométrica (bastos, copas, espadas y oros repetidos, sin escenas ilustradas) en vez de las escenas narrativas del Rider-Waite-Smith. Por eso el Rider-Waite-Smith, con una escena completa en cada una de sus 78 cartas, resulta mucho más fácil de aprender para quien empieza: no hace falta memorizar significados abstractos, basta con leer lo que la imagen está contando.',
      'El mazo más extendido, el Rider-Waite-Smith (publicado en 1909), es el que usa esta app como referencia para los significados de las cartas, y es también el más recomendable para aprender, porque cada una de sus 78 cartas tiene una escena ilustrada completa (no solo símbolos abstractos), lo que facilita mucho memorizar e interpretar. Su ilustradora, Pamela Colman Smith, incluyó en cada carta detalles muy concretos —posturas, colores, animales, objetos— que no están ahí por casualidad: aprender a fijarte en esos detalles, y no solo en el nombre de la carta, es una de las habilidades que este curso quiere darte.',
      'Es importante empezar con las expectativas correctas: el tarot no predice el futuro de forma fija e inevitable, como si fuera una bola de cristal. Funciona mejor entendido como un espejo simbólico: te muestra energías, patrones y posibilidades presentes en una situación, para que tú puedas tomar decisiones más conscientes. La carta no decide por ti; te da información para decidir tú.',
      'En la práctica, esto se traduce en cómo formulas la pregunta antes de tirar. "¿Me va a ir bien en la entrevista de trabajo?" es una pregunta cerrada que invita a una respuesta de bola de cristal. "¿Qué necesito saber o tener en cuenta antes de la entrevista?" es una pregunta abierta que invita a una respuesta útil, orientada a la acción. Reformular así tus preguntas, desde el primer día, es el hábito más importante que puedes adquirir en este curso.',
      'Otra expectativa que conviene ajustar desde ya: una carta "difícil" no es un mal augurio que haya que temer, y una carta "bonita" no es una promesa garantizada. Los significados de este curso y de esta app están redactados precisamente para evitar esa lectura fatalista —te vas a encontrar matices, no sentencias— porque así es como se lee el tarot de forma útil y responsable.',
      'Por último, ten paciencia contigo misma/o durante las primeras semanas: es normal no "conectar" con una tirada, olvidar significados, o sentir que estás leyendo al revés. Es una habilidad, como aprender un idioma nuevo, y se afina con repetición, no con talento innato.',
    ],
    exercises: [
      'Antes de continuar, escribe en una libreta (o en las notas de tu móvil) qué esperas obtener del tarot: ¿claridad en decisiones concretas? ¿autoconocimiento? ¿acompañar a otras personas? Guarda esta respuesta y vuelve a leerla cuando termines el curso, para ver cuánto ha cambiado tu forma de entenderlo.',
      'Coge una pregunta real que tengas ahora mismo en formato cerrado ("¿va a pasar X?") y reescríbela tres veces distintas en formato abierto, orientado a la acción o a la comprensión. Quédate con la versión que más te sirva.',
      'Abre el apartado "Tirada instantánea" de esta app, saca 1 carta y, antes de leer su significado, describe en voz alta o por escrito lo que ves en la imagen: colores, personajes, objetos, posturas. Después compara tu propia descripción con el significado real de la carta.',
    ],
  },
  {
    id: 'modulo-2',
    order: 2,
    title: 'Los arcanos mayores: el gran viaje',
    summary: 'Las 22 cartas más importantes del mazo representan un recorrido vital completo, del Loco al Mundo. Aprende su lógica interna.',
    content: [
      'Los 22 arcanos mayores (numerados del 0 —El Loco— al 21 —El Mundo—) representan grandes fuerzas arquetípicas y etapas vitales, no situaciones cotidianas pequeñas. Cuando uno de estos aparece en una tirada, suele señalar algo importante: una lección de vida, un punto de inflexión, un tema que trasciende lo puramente circunstancial.',
      'Se suelen leer como "el viaje del Loco", dividido en tres bloques de siete cartas (más El Mundo como cierre). El primer bloque (Mago a Carro, cartas 1-7) es el aprendizaje del "yo": las herramientas propias, la intuición, la feminidad y masculinidad interiores, los valores, las decisiones y la voluntad de avanzar. El segundo bloque (Justicia a Templanza, cartas 8-14) es el bloque más introspectivo: pausas, pérdidas, sombras y la búsqueda de equilibrio tras la crisis. El tercer bloque (Diablo a Sol, cartas 15-19) enfrenta las ataduras propias, la ruptura de estructuras que ya no sirven, y la culminación en claridad y vitalidad. El Juicio y El Mundo cierran el ciclo con un renacer y una sensación de totalidad.',
      'No necesitas memorizar este orden número por número para leer el tarot, pero entenderlo te da una intuición muy útil: si sabes que una carta pertenece al "bloque de crisis" (Torre, Diablo, Muerte), ya sabes que su energía es intensa y transformadora antes incluso de recordar su significado exacto.',
      'Un consejo práctico y muy fiable: cuando en una tirada salen varios arcanos mayores juntos (por ejemplo, 2 de 3 cartas, o 3 de 5), es una señal de que la consulta trata sobre algo verdaderamente significativo para la persona, no un asunto trivial del día a día. En cambio, una tirada con puros arcanos menores suele hablar de la gestión práctica y cotidiana de una situación, sin una gran lección de fondo.',
      'Ejemplo trabajado: imagina una tirada de 3 cartas sobre "qué necesito saber sobre mi situación laboral" en la que salen La Torre, El Ermitaño y El Sol. Antes de mirar el significado exacto de cada una, ya puedes intuir un relato: una ruptura o cambio brusco (Torre), seguido de un periodo de reflexión en soledad (Ermitaño), que desemboca en claridad y buen momento (Sol). Esa es la forma de leer arcanos mayores en conjunto: como capítulos de una misma historia, no como frases sueltas.',
      'Cuando solo aparece un arcano mayor entre varios menores, trátalo como el "titular" de la tirada: es el tema central alrededor del cual giran los matices más pequeños que aportan las otras cartas.',
    ],
    exercises: [
      'Elige 5 arcanos mayores al azar (puedes usar el apartado "Significado de las cartas" de la app) y escribe, con tus propias palabras, en qué etapa del "viaje del Loco" (aprendizaje del yo, introspección, ruptura de ataduras, o culminación) encajaría cada una y por qué.',
      'Coge las 22 cartas de los arcanos mayores (en la app, filtra por "mayor" en la búsqueda) y sepáralas mentalmente o por escrito en los 4 bloques descritos en este módulo. No mires ninguna chuleta: hazlo primero por intuición según lo que ya sabes de cada una, y corrige después con la app.',
      'Haz una tirada de 3 cartas en la app sobre una pregunta real. Si sale al menos un arcano mayor, escribe un párrafo tratándolo como "el titular" de la tirada y explicando cómo las otras cartas (mayores o menores) matizan o desarrollan ese tema central.',
    ],
  },
  {
    id: 'modulo-3',
    order: 3,
    title: 'Los arcanos menores y los cuatro palos',
    summary: 'Las otras 56 cartas del mazo, organizadas en cuatro palos que representan distintas áreas de la vida cotidiana.',
    content: [
      'Los arcanos menores se dividen en cuatro palos —Bastos, Copas, Espadas y Oros— cada uno asociado a un elemento y a un área de la vida: Bastos (Fuego) habla de acción, pasión, creatividad y proyectos; Copas (Agua) habla de emociones, vínculos y vida afectiva; Espadas (Aire) habla de pensamiento, comunicación y también de conflictos; y Oros (Tierra) habla de dinero, trabajo y estabilidad material.',
      'Dentro de cada palo hay diez cartas numeradas (As al Diez) y cuatro figuras de la corte (Sota, Caballero, Reina y Rey). Los números también tienen una lógica compartida entre los cuatro palos, que es una de las formas más rápidas de aprender a intuir un significado aunque no lo recuerdes de memoria: los Ases son semillas y comienzos puros de la energía de su palo; el 2 trae una primera decisión o un equilibrio a sostener; el 3 es crecimiento y primeros resultados visibles; el 4 es estabilidad, a veces estancamiento; el 5 es conflicto o pérdida; el 6 es armonía o ayuda tras el 5; el 7 es evaluación o un desafío que exige estrategia; el 8 es acción intensa y avance; el 9 es un punto álgido, tanto para bien (satisfacción) como para mal (ansiedad, según el palo); y el 10 marca la culminación completa de ese ciclo, para bien o para mal según el contexto de la tirada.',
      'Ejemplo trabajado de esta lógica numérica: el 5 de Copas (conflicto + emociones) habla de duelo o decepción sentimental; el 5 de Espadas (conflicto + mente/comunicación) habla de una discusión o una "victoria" que sale cara; el 5 de Oros (conflicto + material) habla de dificultades económicas o sentirse excluido; y el 5 de Bastos (conflicto + acción) habla de competencia o fricciones por afirmarse. Es la misma "familia numérica" del 5, coloreada por cuatro áreas distintas de la vida. Practicar esta lógica te permite intuir el significado de una carta que no recuerdas con solo mirar el número y el palo.',
      'Las figuras de la corte suelen representar personas (tú mismo, alguien de tu entorno, o una energía que necesitas encarnar) o estilos de actuar: la Sota trae un mensaje o una energía joven y en aprendizaje, casi siempre relacionada con una noticia o el inicio de algo en esa área; el Caballero, acción y movimiento decidido (a veces impulsivo) en la dirección de su palo; la Reina, dominio maduro y receptivo de las cualidades de su palo, alguien (o una parte de ti) que ya domina esa energía desde dentro; y el Rey, maestría y liderazgo hacia fuera en esa misma área, alguien que ya la ha convertido en autoridad o estructura.',
      'Un truco práctico para identificar si una figura de la corte representa a otra persona o a ti misma/o en una tirada: si la pregunta era sobre una relación con alguien concreto y la carta encaja con su forma de ser, probablemente la representa a esa persona; si la pregunta era sobre tu propio camino o no hay nadie más implicado, casi siempre representa una energía que tú misma/o necesitas desarrollar o ya estás encarnando.',
      'No hace falta memorizar las 56 cartas una por una desde el primer día: si dominas la lógica de los 4 palos y la lógica de los 10 números, puedes deducir con bastante acierto el significado aproximado de cualquier arcano menor incluso antes de haberlo estudiado específicamente, y usar la app como confirmación en vez de como única fuente.',
    ],
    exercises: [
      'Piensa en un área de tu vida que quieras mejorar (dinero, relaciones, proyectos, salud) e identifica a qué palo pertenecería principalmente. Luego repasa en la app las 14 cartas de ese palo para familiarizarte con su energía general.',
      'Sin mirar la app, intenta adivinar el significado aproximado del 7 de Bastos y del 9 de Oros usando solo la lógica de número + palo explicada en este módulo (7 = evaluación/desafío estratégico, 9 = punto álgido; Bastos = acción, Oros = material). Después comprueba en la app cuánto te has acercado.',
      'Saca una figura de la corte al azar en el apartado "Significado de las cartas" (Sota, Caballero, Reina o Rey de cualquier palo) y escribe un ejemplo real de tu vida —una persona concreta o una faceta tuya— que encaje con esa descripción.',
    ],
  },
  {
    id: 'modulo-4',
    order: 4,
    title: 'Preparar tu mazo y tu espacio de lectura',
    summary: 'Rituales sencillos (opcionales, pero muy recomendables) para conectar con tu mazo antes de empezar a leer.',
    content: [
      'No necesitas ningún objeto mágico especial para empezar: basta con un mazo (físico o, mientras aprendes, el de esta misma app) y un momento tranquilo, sin prisas ni interrupciones. Dicho esto, muchas personas que leen tarot encuentran útil crear un pequeño ritual que marque la transición entre "el día a día" y "el momento de consulta", porque ayuda a la mente a enfocarse, de la misma forma en que lavarte los dientes antes de dormir le indica al cuerpo que toca descansar.',
      'Un ritual sencillo y completo, paso a paso: primero, elige un espacio despejado (una mesa, el suelo con un paño) y, si puedes, apaga notificaciones del móvil durante los próximos minutos. Segundo, enciende una vela si te apetece (blanca funciona para cualquier propósito; según el tema de la consulta puedes elegir otro color, como se explica en el apartado de Rituales de esta app). Tercero, respira profundamente tres veces, soltando el aire despacio. Cuarto, sostén el mazo unos segundos entre las manos formulando mentalmente tu intención o tu pregunta con claridad. Quinto, cuando sientas que la pregunta está clara en tu mente, empieza a barajar.',
      'Cuanto más concreta sea la pregunta, más útil y precisa será la respuesta —"¿qué necesito saber sobre mi relación con X ahora mismo?" funciona mucho mejor que un genérico "¿qué me depara el futuro?". Si te cuesta concretar la pregunta, un truco es completar la frase "Lo que de verdad quiero saber es...' + ' " en voz alta antes de barajar: muchas veces la pregunta real es distinta (y más honesta) que la primera que se te ocurre.',
      'Si usas un mazo físico, es recomendable "limpiarlo" energéticamente de vez en cuando —sobre todo si es nuevo, si lo ha tocado mucha gente, o tras una tirada especialmente intensa o dolorosa. Formas habituales de limpiarlo: pasar el humo de salvia blanca por encima (ver el apartado de Rituales de esta app para el paso a paso), dejarlo una noche bajo la luz de la luna, dar unos golpecitos secos contra la mesa mientras visualizas que se "resetea", o simplemente barajarlo varias veces seguidas con la intención clara de limpiarlo.',
      'También conviene decidir tus propias normas sobre quién puede tocar tu mazo. Muchas personas que leen tarot prefieren que nadie más lo toque sin permiso, sobre todo al principio, mientras están estableciendo su propia relación con él; otras no le dan importancia a esto. No hay una regla universal correcta: elige lo que te haga sentir que el mazo es "tuyo" de verdad.',
      'Por último, piensa también en la cadencia: leer tarot todos los días sobre preguntas triviales puede saturarte y hacer que pierdas la capacidad de distinguir una señal importante del ruido de fondo. Muchas personas con experiencia se ponen un límite propio (por ejemplo, una tirada "seria" a la semana, más alguna tirada de mensaje diario) para mantener el tarot como una herramienta significativa y no un hábito compulsivo de mirar el móvil.',
    ],
    exercises: [
      'Diseña tu propio pequeño ritual de apertura (3-4 pasos) que puedas repetir cada vez que vayas a hacer una tirada, física o en la app. Escríbelo en algún sitio para no tener que improvisarlo cada vez.',
      'Practica hoy mismo la frase "Lo que de verdad quiero saber es..." con una pregunta que tengas rondando la cabeza. Complétala en voz alta o por escrito y compárala con la primera versión de la pregunta que se te había ocurrido.',
      'Si tienes mazo físico, elige y aplica un método de limpieza de los descritos en este módulo. Si solo usas la app, decide igualmente tu propia "cadencia" personal (cuántas tiradas serias a la semana te parece razonable) y anótala.',
    ],
  },
  {
    id: 'modulo-5',
    order: 5,
    title: 'La técnica: barajar, cortar y extraer cartas',
    summary: 'El "cómo" físico de una lectura: distintas formas de barajar y qué hacer si sale una carta boca abajo sin querer.',
    content: [
      'Con un mazo físico, baraja mientras piensas en tu pregunta, con el estilo que te resulte más cómodo. Las dos técnicas más habituales son: a la manera de cartas de juego (dividiendo el mazo en dos mitades y entrelazándolas), o mezclando el mazo entero sobre la mesa en círculos con ambas manos, el llamado "método del pastel". Un tercer estilo, más lento pero muy usado por lectoras experimentadas, es ir pasando cartas de un montón a otro cortando en puntos aleatorios varias veces seguidas. No hay una técnica "correcta" única: lo importante es que mientras barajas mantengas la mente puesta en tu pregunta, no en la mecánica de barajar.',
      'Cuando sientas que es suficiente (no hay un número mágico de veces; algunas personas barajan hasta "sentir" que ya está, otras cuentan mentalmente hasta un número que les resulte simbólico), corta el mazo en dos o tres montones —algunas personas cortan con la mano no dominante, por intuición— y vuelve a juntarlos, en el orden que prefieras.',
      'A partir de ahí, extrae las cartas necesarias para tu tirada. Hay dos formas principales: desde arriba del mazo ya barajado y cortado, en orden, o extendiendo el mazo en abanico boca abajo sobre la mesa y eligiendo las cartas al tacto o a la vista de sus reversos, sin mirar cuál es cuál. Esta segunda forma es la que usa el selector de cartas de esta app: eliges tú, de un mazo extendido, en lugar de que se revelen automáticamente — y muchas lectoras la prefieren precisamente porque involucra más a la intuición en el propio gesto de elegir.',
      'Si trabajas con cartas invertidas (como hace esta app: cada carta tiene un 50% de probabilidad de salir "del revés"), respeta la orientación en la que sale la carta: no la enderece. La orientación forma parte del mensaje, y "corregirla" sin querer es, con diferencia, el error técnico más común entre quien empieza a leer con mazo físico.',
      'Situaciones que te vas a encontrar tarde o temprano, y cómo resolverlas: si al barajar se te cae una carta al suelo, muchas lectoras la interpretan como una señal añadida —algo que "quiere ser visto" aunque no la hayas elegido— y la incluyen como carta extra de contexto; otras simplemente la recolocan y siguen. Si te sale una carta repetida en la misma sesión (poco común pero posible si mezclas mazos o hay algún fallo), tómalo como un énfasis: ese tema insiste en aparecer. Si dudas de si una carta salió realmente invertida o se giró sin querer al manipular el mazo, sé honesta contigo misma: con la práctica notarás la diferencia entre una duda real y una carta que simplemente prefieres leer "del derecho" porque te incomoda su significado invertido.',
      'Con el selector de esta app pasa algo parecido a nivel de intención, aunque no haya manipulación física: tómate un segundo real antes de tocar cada carta, en vez de elegir las tres primeras que veas por pura rapidez. La calidad de la lectura empieza en la calidad de la atención que le pones al elegir, no solo al interpretar después.',
    ],
    exercises: [
      'Si tienes un mazo físico, practica barajarlo con dos técnicas distintas de las descritas (el estilo "cartas de juego" y el "método del pastel") y quédate con la que te resulte más natural. Extrae 3 cartas al azar, prestando atención a si alguna sale invertida sin que la hayas girado tú.',
      'Haz una tirada de 1 carta en la app, pero esta vez cronométrate: tómate al menos 10 segundos reales de pausa e intención antes de tocar la carta que vas a elegir. Compara cómo se siente esa tirada frente a una que hagas después eligiendo rápido, casi sin pensar.',
      'Si te ocurre alguna vez una de las situaciones "raras" descritas (carta caída, duda sobre si estaba invertida, repetición), escribe cómo decidiste interpretarla y por qué. Ir documentando tus propias decisiones técnicas es parte de construir tu criterio propio.',
    ],
  },
  {
    id: 'modulo-6',
    order: 6,
    title: 'Tiradas fundamentales',
    summary: 'De la tirada de una sola carta a la Cruz Celta: cuándo usar cada estructura según lo que necesites saber.',
    content: [
      'Tirada de una carta: perfecta para preguntas simples, para el "mensaje del día", o cuando quieres una respuesta rápida y concentrada sin más contexto. Es la que usa esta app en el apartado de "Tirada instantánea" cuando eliges 1 carta. Es también la mejor tirada para practicar a diario sin saturarte, porque obliga a leer una sola carta a fondo en vez de diluir la atención entre varias.',
      'Tirada de tres cartas (Pasado-Presente-Futuro): la más versátil y la que usa esta app tanto para la tirada instantánea de 3 cartas como para la pregunta de pago. También se puede reinterpretar según lo que necesites: Situación-Acción-Resultado (para preguntas de "qué hago con esto"), o Tú-La otra persona-La relación (para preguntas vinculares), manteniendo siempre la misma estructura de tres posiciones.',
      'Ejemplo trabajado con Pasado-Presente-Futuro: pregunta "¿cómo evoluciona mi situación con un proyecto que acabo de empezar?", y salen Ocho de Bastos (pasado), Cuatro de Oros (presente) y Rueda de la Fortuna (futuro). Lectura posible: el proyecto arrancó con mucha rapidez y buena energía (Ocho de Bastos), ahora mismo hay una fase de consolidar y no soltar lo conseguido, quizás con algo de miedo a arriesgar más (Cuatro de Oros), y el futuro trae un giro significativo fuera de tu control total, para bien (Rueda de la Fortuna). Fíjate en que la lectura conecta las tres posiciones en una frase con sentido, no en tres frases sueltas.',
      'Tirada de cinco cartas: añade más matices —por ejemplo Situación, Obstáculo, Consejo, Influencias externas y Resultado probable (la que usa esta app)—, útil cuando la pregunta de tres cartas se te queda corta y necesitas entender mejor qué está bloqueando o influyendo en la situación. Es especialmente buena para preguntas del tipo "¿por qué no avanzo en esto?", porque dedica una posición entera solo al obstáculo.',
      'La Cruz Celta (10 cartas) es la tirada "clásica" más completa, habitual entre quien ya tiene experiencia: cubre la situación actual, el obstáculo inmediato, la base de la situación, el pasado reciente, las metas conscientes, el futuro cercano, tu propia actitud, las influencias externas, tus esperanzas o miedos, y el resultado final. Es mucho para procesar al principio: te recomendamos dominar bien la tirada de tres y cinco cartas antes de dar el salto a la Cruz Celta, y cuando lo hagas, léela por bloques (primero las 6 cartas centrales que forman la "cruz", después las 4 de la "columna" lateral) en vez de intentar abarcar las 10 a la vez.',
      'Cómo elegir la tirada correcta en la práctica: si dudas entre tamaños, empieza siempre por la más pequeña que pueda responder a tu pregunta. Una pregunta pequeña con una tirada de 10 cartas suele generar más ruido e interpretaciones forzadas que claridad; en cambio, una pregunta compleja con solo 1 carta se queda corta. La regla general: 1 carta para mensajes o preguntas de sí/no orientativas, 3 para la mayoría de preguntas cotidianas, 5 cuando hay un bloqueo que entender, y Cruz Celta para procesos vitales grandes (un cambio de vida, una relación de fondo, una decisión que llevas meses posponiendo).',
    ],
    exercises: [
      'Elige una pregunta real que tengas ahora mismo y decide qué tirada (1, 3 o 5 cartas) encaja mejor con ella, y por qué, usando la regla de "empieza por la más pequeña que pueda responder".',
      'Haz tú mismo/a el ejercicio del ejemplo trabajado de este módulo: haz una tirada de 3 cartas en la app sobre una situación real y escribe una sola frase que conecte las tres posiciones (pasado, presente, futuro) en un relato con sentido, tal como se hizo con el Ocho de Bastos, el Cuatro de Oros y la Rueda de la Fortuna.',
      'Si te sientes con confianza, prueba una tirada de 5 cartas (Situación, Obstáculo, Consejo, Influencias externas, Resultado probable) sobre algo que sientas estancado. Presta especial atención a la carta de "Obstáculo": suele ser la más reveladora de las cinco.',
    ],
  },
  {
    id: 'modulo-7',
    order: 7,
    title: 'Leer combinaciones, no cartas sueltas',
    summary: 'La diferencia entre memorizar 78 significados y saber leer tarot de verdad está en cómo conectas las cartas entre sí.',
    content: [
      'El error más común al empezar es leer cada carta como si fuera un mensaje aislado, como una especie de horóscopo independiente. La verdadera habilidad de lectura está en ver cómo las cartas conversan entre sí dentro de una misma tirada.',
      'Fíjate en repeticiones: si salen varias cartas del mismo palo, esa área de la vida (emocional, material, mental o de acción, según el palo) está especialmente activa. Si salen varios números iguales (por ejemplo, varios Cuatros), ese número aporta un matiz común a distintas áreas de tu vida a la vez —siguiendo la lógica numérica del módulo 3, varios Cuatros hablarían de estabilidad (o estancamiento) repitiéndose en varios frentes.',
      'Fíjate también en el contraste entre cartas cercanas: una carta de conflicto (por ejemplo, un Cinco) seguida de una carta de armonía (un Seis) sugiere una resolución en camino. Una carta muy positiva seguida de una invertida puede matizar o poner en duda ese optimismo inicial.',
      'Ejemplo trabajado completo: tirada de 3 cartas sobre "qué necesito saber sobre mi vida amorosa ahora mismo", y salen Tres de Espadas, Cuatro de Copas y El Sol. Leídas por separado: dolor/ruptura, apatía emocional, y alegría/vitalidad —parecen contradictorias. Leídas como conversación: hay un dolor del pasado (Tres de Espadas) que ha dejado cierta desconexión o desgana ante lo nuevo (Cuatro de Copas, una carta que habla de estar tan metida en la propia introspección que no ves lo que te están ofreciendo), pero el desenlace apunta a una claridad y alegría genuina (El Sol) en cuanto salgas de ese estado de apatía. La historia completa: "estás procesando algo doloroso y por eso no ves con claridad lo bueno que ya tienes cerca; en cuanto salgas de ahí, la situación se va a sentir mucho más luminosa".',
      'Otro patrón útil: cuando dos cartas parecen decir lo mismo desde ángulos distintos (por ejemplo, un arcano mayor y un arcano menor con temática parecida), tómalo como una confirmación reforzada del mensaje, no como redundancia sin más. Y cuando dos cartas se contradicen abiertamente, no fuerces una reconciliación artificial: a veces el mensaje real de la tirada es precisamente esa tensión —una parte de ti quiere una cosa, y la situación real pide otra— y nombrar esa tensión con honestidad es más útil que inventar una armonía que no está ahí.',
      'Con la práctica, dejarás de "traducir carta por carta" y empezarás a ver la tirada completa como una escena, casi como una pequeña historia con principio, nudo y desenlace. Ese es el salto real de nivel en la lectura de tarot, y es exactamente lo que distingue a alguien que "sabe los significados de memoria" de alguien que sabe leer tarot de verdad.',
    ],
    exercises: [
      'Haz una tirada de 3 cartas en la app y, antes de leer la interpretación automática, intenta escribir tú una frase que conecte las tres cartas en una sola idea coherente. Después compara tu lectura con la de la app.',
      'Reproduce el ejercicio del ejemplo trabajado de este módulo con tus propias cartas: haz una tirada real sobre tu vida amorosa o cualquier otro tema, y si aparecen cartas que a primera vista parecen contradictorias, escribe explícitamente cómo se conectan en una sola historia, igual que se hizo con el Tres de Espadas, el Cuatro de Copas y El Sol.',
      'La próxima vez que hagas una tirada y dos cartas se contradigan sin que encuentres una reconciliación natural, resístete a forzarla: escribe en cambio, en dos frases, cuál es la tensión real que están señalando esas dos cartas.',
    ],
  },
  {
    id: 'modulo-8',
    order: 8,
    title: 'Las cartas invertidas',
    summary: 'Qué significa (y qué no significa) que una carta salga del revés, y cómo interpretarlo sin caer en el miedo.',
    content: [
      'Una carta invertida NO significa automáticamente "algo malo va a pasar". Es un matiz, no una sentencia. Las interpretaciones más habituales son: la energía de la carta está bloqueada o no se expresa plenamente; la energía está presente pero dirigida hacia adentro (introspección en vez de acción externa); hay una versión "en la sombra" o excesiva de esa energía; o simplemente que ese tema requiere más tiempo, paciencia o trabajo interno antes de resolverse.',
      'Ejemplo trabajado con una misma carta en sus dos orientaciones: La Emperatriz al derecho habla de abundancia, creatividad fértil y cuidado de una misma y de los demás con generosidad. Invertida, esa misma energía puede leerse como bloqueo creativo, autoexigencia que impide disfrutar, o un cuidado hacia los demás tan volcado hacia fuera que te olvidas de cuidarte a ti. No es "lo contrario" de la Emperatriz al derecho —es la misma energía, atascada o desviada de su cauce natural.',
      'Otro ejemplo, con una carta que suele generar más miedo: La Torre al derecho habla de una ruptura repentina que, aunque dolorosa, libera algo que ya no sostenía nada real. Invertida, no significa "se libra de la ruptura" —al contrario, suele señalar que el derrumbe se está retrasando o negando (evitas ver una situación insostenible), lo cual casi siempre lo hace más doloroso cuando finalmente llega, en vez de menos.',
      'Algunas personas que leen tarot optan por no usar cartas invertidas en absoluto (leen todo "al derecho" y confían en la posición y el contexto para matizar). Es una elección totalmente válida, sobre todo al principio: si te resulta abrumador, puedes simplificar así tu propia práctica. Esta app, por defecto, sí usa cartas invertidas, para dar lecturas más ricas y matizadas.',
      'Con el tiempo notarás que las cartas invertidas suelen ser las más útiles para el autoconocimiento: señalan justo aquello que no queremos ver a simple vista, y por eso merece la pena no evitarlas. Un patrón habitual: si en una misma tirada salen dos o más cartas invertidas, suele indicar que la persona (o tú misma) está en una fase de procesamiento interno más que de acción visible hacia fuera —y forzar una lectura de "acción inmediata" en ese contexto suele encajar mal con lo que la tirada está diciendo de verdad.',
      'Una forma sencilla de generar tu propio significado invertido cuando no lo recuerdes: coge el significado al derecho y pregúntate "¿cómo se ve esta misma energía si está bloqueada?", "¿cómo se ve si está vuelta hacia adentro en vez de hacia fuera?", y "¿cómo se ve una versión exagerada o en la sombra de esto?". Casi siempre, una de esas tres preguntas te da una interpretación razonable incluso sin haber memorizado el significado invertido exacto.',
    ],
    exercises: [
      'Busca en el apartado "Significado de las cartas" tres cartas que te generen curiosidad y compara su significado al derecho con su significado invertido. Anota qué diferencia principal encuentras en cada una.',
      'Elige una carta cualquiera y aplica tú misma/o el método de las tres preguntas de este módulo (bloqueo, hacia adentro, versión en la sombra) para deducir un significado invertido razonable antes de comprobarlo en la app.',
      'La próxima vez que te salga una carta invertida en una tirada real, resiste el impulso de "arreglarla" mentalmente hacia un significado más agradable. Escribe honestamente qué crees que señala esa inversión concreta en tu situación.',
    ],
  },
  {
    id: 'modulo-9',
    order: 9,
    title: 'Ética y buenas prácticas al leer el tarot',
    summary: 'Cómo leer tarot —para ti o para otras personas— de forma responsable, honesta y respetuosa.',
    content: [
      'Si empiezas a leer tarot para otras personas (amigos, familia, o incluso de forma profesional), ten en cuenta algunos principios básicos: nunca uses el tarot para predecir enfermedades graves, muertes, o para sustituir consejo médico, legal o financiero profesional. El tarot ofrece perspectiva simbólica, no diagnósticos ni garantías.',
      'Sé especialmente cuidadoso con el lenguaje que usas cuando alguien está pasando por un momento vulnerable: enmarca siempre las cartas más difíciles (como La Torre o La Muerte) en su sentido de transformación y aprendizaje, no como catástrofes inevitables. El objetivo de una lectura debe ser dar claridad y empoderar a la persona para decidir, nunca generarle miedo o dependencia hacia ti o hacia las cartas.',
      'Frases concretas que ayudan a mantener este enfoque: en vez de "vas a perder tu trabajo" (afirmación fatalista), prueba "esta carta habla de un cambio importante en lo laboral; puede ser una pérdida, pero también un giro que no ves venir todavía — ¿hay algo en tu trabajo actual que ya sientas que no encaja?". En vez de "esta persona no te quiere" (juicio sobre un tercero ausente), prueba "la carta que sale para su energía sugiere distancia o confusión; ¿qué sabes tú de primera mano sobre cómo se está comportando contigo?". La diferencia es sutil pero importante: devuelves la interpretación final a la persona, en vez de dictarle una verdad cerrada.',
      'Evita leer sobre terceras personas que no están presentes ni han dado su consentimiento (por ejemplo, "qué siente por mí" una persona concreta) como si fuera un hecho objetivo: es más honesto reformular la pregunta hacia lo que sí puedes ver con más fundamento —tu propia situación, tus propios patrones y tus propias opciones—, tal como se explicó en el módulo 1 sobre reformular preguntas cerradas en preguntas abiertas.',
      'Y, muy importante: si notas que alguien depende del tarot para tomar cualquier decisión, por pequeña que sea, o que evita responsabilizarse de su propia vida escondiéndose detrás de "lo que dicen las cartas", es tu responsabilidad animarle (con cariño) a recuperar su propio criterio. Una señal de alarma concreta: si alguien te pide una tirada sobre la misma pregunta varias veces seguidas porque "no le gustó" la respuesta anterior, es el momento de decirlo abiertamente en vez de complacer, porque repetir la tirada hasta obtener la respuesta que se quiere oír no es lectura de tarot, es autoengaño con pasos extra.',
      'Si algún día decides cobrar por leer tarot a otras personas, súmale a todo lo anterior una norma más: sé transparente sobre qué es esto y qué no es. Una frase honesta de apertura, del estilo "esto es una herramienta de reflexión simbólica, no una ciencia exacta ni un sustituto de ayuda profesional", protege tanto a la persona que consulta como a ti misma/o.',
    ],
    exercises: [
      'Escribe con tus propias palabras una pequeña "carta de bienvenida" de 3-4 frases que le dirías a alguien antes de leerle el tarot por primera vez, dejando claro qué puede esperar y qué no.',
      'Coge dos de las frases fatalistas de ejemplo de este módulo ("vas a perder tu trabajo", "esta persona no te quiere") y practica reescribirlas tú, con tus propias palabras, siguiendo el modelo de devolver la interpretación final a la persona.',
      'Piensa en una situación (real o hipotética) en la que alguien te pidiera repetir la misma tirada porque no le gustó la respuesta. Escribe, tal cual se lo dirías en voz alta, cómo abordarías esa conversación con cariño pero con honestidad.',
    ],
  },
  {
    id: 'modulo-10',
    order: 10,
    title: 'Cómo desarrollar tu propia intuición',
    summary: 'Los libros y las apps te dan la base; la verdadera lectura de tarot se afina con práctica constante y confianza en ti mismo.',
    content: [
      'Los significados "de libro" (como los que encontrarás en el apartado de esta app) son un punto de partida imprescindible, pero con el tiempo notarás que, al mirar una carta, te vienen a la mente asociaciones propias, más allá del significado estándar. Eso no es que "lo estés haciendo mal": es la señal de que tu propia intuición está empezando a dialogar con el simbolismo de las cartas. Confía en ella, sin descartar del todo el significado de base.',
      'Una práctica muy recomendable para acelerar este aprendizaje es llevar un diario de tarot. Plantilla concreta que puedes copiar tal cual: fecha, pregunta formulada, carta(s) que salieron, tu interpretación en el momento (en 2-3 frases, antes de mirar ningún libro ni la app), y un espacio en blanco para volver unos días o semanas después y anotar cómo se relacionó realmente con lo que pasó. Con el tiempo, este diario se convierte en tu propio "libro de significados personalizado", muchas veces más útil que cualquier manual, porque está calibrado con tus propias tiradas y tu propia vida.',
      'Un plan concreto de 30 días para quien quiere afianzar lo aprendido en este curso: los primeros 7 días, una tirada de 1 carta cada mañana sobre "qué energía conviene que tenga presente hoy", anotándola en el diario. Los días 8 a 20, alterna tiradas de 1 y 3 cartas sobre preguntas reales que te importen, revisando cada domingo las de la semana para ver qué se cumplió y cómo. Los días 21 a 30, atrévete con al menos una tirada de 5 cartas sobre algo que sientas estancado, aplicando explícitamente lo aprendido en los módulos 6 y 7 (elegir bien la tirada, leerla como una historia conectada). Al terminar el mes, relee tu primera respuesta del módulo 1 sobre qué esperabas del tarot, y compárala con lo que sientes ahora.',
      'Por último: la mejor forma de aprender tarot es tirarlo con frecuencia, sobre preguntas reales que te importen de verdad. No hace falta que sean preguntas grandes: puedes preguntar cada mañana "¿qué energía conviene que tenga presente hoy?" y usar esa carta como un pequeño foco de atención para el día. La constancia, mucho más que la memorización, es lo que hace bien a un buen lector o lectora de tarot.',
      'Una última distinción importante entre intuición y deseo: cuando te venga una interpretación "intuitiva" de una carta, pregúntate honestamente si esa lectura te llegó de forma espontánea, o si es simplemente la interpretación que más te conviene o más te tranquiliza oír. La intuición real suele sentirse como una certeza tranquila, casi neutra; el deseo disfrazado de intuición suele sentirse más como un alivio o una necesidad urgente de que algo sea cierto. Distinguir esto es, probablemente, la habilidad más avanzada de todo este curso.',
      'Con esto termina el curso completo: has pasado de no saber nada de tarot a tener las herramientas para elegir tirada, barajar y extraer con intención, leer arcanos mayores y menores por separado y en conjunto, interpretar cartas invertidas sin miedo, leer con ética si lo haces para otras personas, y empezar a construir tu propia intuición sobre esa base. Lo único que falta ahora es práctica real y constante — el resto ya lo tienes.',
    ],
    exercises: [
      'Empieza hoy mismo tu diario de tarot usando la plantilla de este módulo: haz una tirada de 1 carta en el apartado "Tirada instantánea", y anota fecha, pregunta, carta, tu interpretación personal, y deja una casilla en blanco para revisar dentro de una semana cómo se relacionó con tu día a día.',
      'Escribe en un calendario (físico o del móvil) el plan de 30 días descrito en este módulo, adaptado a tus propios horarios, y márcate el primer recordatorio para empezarlo.',
      'La próxima vez que sientas una interpretación "intuitiva" muy fuerte sobre una carta, párate un momento y aplica la distinción de este módulo: pregúntate si es una certeza tranquila o un alivio que necesitabas sentir. Escribe cuál de las dos crees que fue, con honestidad.',
    ],
  },
];

module.exports = { COURSE_MODULES };
