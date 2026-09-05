/**
 * Santos populares de la devoción católica tradicional, con su patronazgo
 * (qué representan / para qué se les invoca habitualmente) y una oración
 * corta para cada uno. Contenido con fines devocionales/espirituales,
 * en la línea de la tradición oral y de estampas populares — no son citas
 * textuales de ningún misal oficial.
 */

const SAINTS = [
  {
    id: 'san-judas-tadeo',
    name: 'San Judas Tadeo',
    patronage: 'Patrono de las causas difíciles y las situaciones que parecen no tener salida.',
    feastDay: '28 de octubre',
    candleColor: 'Vela verde o blanca',
    prayer:
      'Glorioso San Judas Tadeo, pariente cercano de Nuestro Señor Jesucristo, a ti acudo en este momento de dificultad, cuando siento que ya he agotado mis propias fuerzas. Tú que eres invocado en lo que parece imposible, intercede por mí y abre un camino donde hoy solo veo un muro. Dame la paciencia para sostenerme mientras llega la respuesta, y la fe para reconocerla cuando llegue. Amén.',
  },
  {
    id: 'santa-barbara',
    name: 'Santa Bárbara',
    patronage: 'Protección ante peligros repentinos, tormentas y momentos de gran vulnerabilidad; también se le pide fuerza y valentía.',
    feastDay: '4 de diciembre',
    candleColor: 'Vela roja',
    prayer:
      'Santa Bárbara bendita, que con firmeza sostuviste tu fe incluso en la adversidad, cúbreme hoy con tu protección. Aleja de mi hogar y de los míos todo peligro repentino, toda tormenta que se anuncie de forma inesperada en mi vida. Dame tu misma fortaleza para no quebrarme ante lo que no puedo controlar, y tu valentía para enfrentar lo que sí está en mis manos. Amén.',
  },
  {
    id: 'san-cipriano',
    name: 'San Cipriano',
    patronage: 'Protección frente a envidias, malas energías y brujería; también se le asocia con la conversión y la liberación de ataduras del pasado.',
    feastDay: '26 de septiembre',
    candleColor: 'Vela morada',
    prayer:
      'San Cipriano, que conociste tanto la oscuridad como la luz y elegiste volver hacia el bien, te pido que me ayudes a soltar todo lo que me ata sin que yo lo sepa: envidias ajenas, palabras cargadas de mala intención, energías que no me pertenecen. Rodéame de un manto de protección y devuélveme la claridad para reconocer, en adelante, lo que verdaderamente viene de la luz. Amén.',
  },
  {
    id: 'santa-marta',
    name: 'Santa Marta',
    patronage: 'Se le invoca para dominar situaciones difíciles del hogar, la pareja o la familia, y para restaurar la armonía doméstica.',
    feastDay: '29 de julio',
    candleColor: 'Vela amarilla o naranja',
    prayer:
      'Santa Marta, tú que recibiste al Señor en tu propia casa y supiste sostenerla incluso en momentos de tensión, ayúdame a traer orden y paz a mi hogar. Dame la serenidad para dominar lo que hoy se siente descontrolado en mi vida doméstica o familiar, y la claridad para actuar con firmeza y con amor a la vez. Amén.',
  },
  {
    id: 'san-antonio-de-padua',
    name: 'San Antonio de Padua',
    patronage: 'Patrono de lo que se ha perdido: objetos, personas, oportunidades, y también del amor sincero cuando tarda en llegar.',
    feastDay: '13 de junio',
    candleColor: 'Vela blanca',
    prayer:
      'San Antonio bendito, tú que ayudas a encontrar lo que parece perdido, ayúdame a reencontrar lo que hoy necesito en mi camino: sea un objeto, sea una persona, sea la confianza en que el amor verdadero también me pertenece. Si algo o alguien no debe volver, dame la paz para aceptarlo; si debe volver, dame la fe para esperarlo sin desesperar. Amén.',
  },
  {
    id: 'san-miguel-arcangel',
    name: 'San Miguel Arcángel',
    patronage: 'Protección espiritual, fuerza frente a la envidia y las malas intenciones ajenas, y defensa en momentos de confrontación.',
    feastDay: '29 de septiembre',
    candleColor: 'Vela azul o blanca',
    prayer:
      'San Miguel Arcángel, defiéndeme en el día de la batalla; sé mi amparo contra la maldad y las asechanzas del mal. Te pido protección para mí y para los míos frente a envidias, malas intenciones y energías que buscan hacernos daño. Dame la fuerza para actuar con justicia y sin miedo, sabiendo que no estoy solo o sola en lo que enfrento. Amén.',
  },
  {
    id: 'santa-rita-de-casia',
    name: 'Santa Rita de Casia',
    patronage: 'Conocida como la santa de las causas imposibles y de la paciencia en la adversidad; también se le pide paz en el hogar.',
    feastDay: '22 de mayo',
    candleColor: 'Vela rosa o blanca',
    prayer:
      'Santa Rita, abogada de los casos imposibles, tú que atravesaste el dolor y el sufrimiento sin perder la fe, acompáñame en lo que hoy siento que no tiene solución. Dame la paciencia para sostenerme un día más, la fortaleza para no rendirme, y la certeza de que ninguna situación, por difícil que parezca, está fuera del alcance de un milagro. Amén.',
  },
  {
    id: 'san-expedito',
    name: 'San Expedito',
    patronage: 'Se le invoca para las urgencias, para resolver con rapidez asuntos pendientes y para vencer la procrastinación.',
    feastDay: '19 de abril',
    candleColor: 'Vela roja',
    prayer:
      'San Expedito, santo de las causas urgentes, te pido rapidez para resolver lo que hoy no puede esperar más. Aleja de mí la excusa y la postergación, y dame la claridad para actuar ahora, con decisión, sobre aquello que llevo tiempo posponiendo. Que lo que hoy es urgencia se convierta pronto en un asunto resuelto. Amén.',
  },
];

module.exports = { SAINTS };
