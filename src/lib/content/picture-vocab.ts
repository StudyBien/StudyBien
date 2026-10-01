/**
 * Picture vocabulary for Plumi's lessons, organised by CEFR level (A1–C2).
 *
 * Every word has a picture (an emoji, so it renders everywhere with no image
 * files) and every picture is unique within its unit, so "tap the picture of
 * X" always has exactly one right answer. Units hold eight words: two lessons
 * of four.
 */
export type Cefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type PicWord = readonly [es: string, en: string, pic: string];
export type PicUnit = { id: string; level: Cefr; name: string; nameEn: string; words: readonly PicWord[] };

export const CEFR_LEVELS: ReadonlyArray<{ id: Cefr; name: string; school: string }> = [
  { id: 'A1', name: 'A1 · Beginner', school: 'Spanish 1' },
  { id: 'A2', name: 'A2 · Elementary', school: 'Spanish 2' },
  { id: 'B1', name: 'B1 · Intermediate', school: 'Spanish 3–4' },
  { id: 'B2', name: 'B2 · Upper intermediate', school: 'Spanish 5 / AP' },
  { id: 'C1', name: 'C1 · Advanced', school: 'AP / College' },
  { id: 'C2', name: 'C2 · Mastery', school: 'College and beyond' },
];

const u = (id: string, level: Cefr, name: string, nameEn: string, words: PicWord[]): PicUnit => ({ id, level, name, nameEn, words });

export const PIC_UNITS: readonly PicUnit[] = [
  // ================================================================ A1
  u('a1-animales', 'A1', 'Los animales', 'Animals', [
    ['el perro', 'dog', '🐶'], ['el gato', 'cat', '🐱'], ['el pájaro', 'bird', '🐦'], ['el pez', 'fish', '🐟'],
    ['el caballo', 'horse', '🐴'], ['la vaca', 'cow', '🐮'], ['el conejo', 'rabbit', '🐰'], ['el ratón', 'mouse', '🐭'],
  ]),
  u('a1-comida', 'A1', 'La comida', 'Food', [
    ['el pan', 'bread', '🍞'], ['el queso', 'cheese', '🧀'], ['el huevo', 'egg', '🥚'], ['el pollo', 'chicken', '🍗'],
    ['el arroz', 'rice', '🍚'], ['la pizza', 'pizza', '🍕'], ['la sopa', 'soup', '🍲'], ['la ensalada', 'salad', '🥗'],
  ]),
  u('a1-frutas', 'A1', 'Las frutas', 'Fruit', [
    ['la manzana', 'apple', '🍎'], ['el plátano', 'banana', '🍌'], ['la naranja', 'orange', '🍊'], ['las uvas', 'grapes', '🍇'],
    ['la fresa', 'strawberry', '🍓'], ['la sandía', 'watermelon', '🍉'], ['la piña', 'pineapple', '🍍'], ['el limón', 'lemon', '🍋'],
  ]),
  u('a1-bebidas', 'A1', 'Las bebidas', 'Drinks', [
    ['el agua', 'water', '💧'], ['la leche', 'milk', '🥛'], ['el café', 'coffee', '☕'], ['el té', 'tea', '🍵'],
    ['el jugo', 'juice', '🧃'], ['el refresco', 'soda', '🥤'], ['el vino', 'wine', '🍷'], ['el chocolate caliente', 'hot chocolate', '🍫'],
  ]),
  u('a1-colores', 'A1', 'Los colores', 'Colors', [
    ['rojo', 'red', '🔴'], ['azul', 'blue', '🔵'], ['verde', 'green', '🟢'], ['amarillo', 'yellow', '🟡'],
    ['negro', 'black', '⚫'], ['blanco', 'white', '⚪'], ['morado', 'purple', '🟣'], ['anaranjado', 'orange (color)', '🟠'],
  ]),
  u('a1-numeros', 'A1', 'Los números', 'Numbers', [
    ['uno', 'one', '1️⃣'], ['dos', 'two', '2️⃣'], ['tres', 'three', '3️⃣'], ['cuatro', 'four', '4️⃣'],
    ['cinco', 'five', '5️⃣'], ['seis', 'six', '6️⃣'], ['siete', 'seven', '7️⃣'], ['diez', 'ten', '🔟'],
  ]),
  u('a1-familia', 'A1', 'La familia', 'Family', [
    ['la madre', 'mother', '👩'], ['el padre', 'father', '👨'], ['el bebé', 'baby', '👶'], ['la abuela', 'grandmother', '👵'],
    ['el abuelo', 'grandfather', '👴'], ['la hija', 'daughter', '👧'], ['el hijo', 'son', '👦'], ['la familia', 'family', '👪'],
  ]),
  u('a1-ropa', 'A1', 'La ropa', 'Clothing', [
    ['la camiseta', 'T-shirt', '👕'], ['los pantalones', 'pants', '👖'], ['el vestido', 'dress', '👗'], ['los zapatos', 'shoes', '👟'],
    ['el sombrero', 'hat', '👒'], ['los calcetines', 'socks', '🧦'], ['la bufanda', 'scarf', '🧣'], ['los guantes', 'gloves', '🧤'],
  ]),
  u('a1-cuerpo', 'A1', 'El cuerpo', 'The body', [
    ['el ojo', 'eye', '👁️'], ['la oreja', 'ear', '👂'], ['la nariz', 'nose', '👃'], ['la boca', 'mouth', '👄'],
    ['la mano', 'hand', '✋'], ['el pie', 'foot', '🦶'], ['la pierna', 'leg', '🦵'], ['el brazo', 'arm', '💪'],
  ]),
  u('a1-casa', 'A1', 'La casa', 'The house', [
    ['la casa', 'house', '🏠'], ['la puerta', 'door', '🚪'], ['la cama', 'bed', '🛏️'], ['el sofá', 'sofa', '🛋️'],
    ['la ventana', 'window', '🪟'], ['la silla', 'chair', '🪑'], ['el baño', 'bathroom / toilet', '🚽'], ['la llave', 'key', '🔑'],
  ]),
  u('a1-escuela', 'A1', 'La escuela', 'School', [
    ['el libro', 'book', '📕'], ['el lápiz', 'pencil', '✏️'], ['el cuaderno', 'notebook', '📓'], ['la mochila', 'backpack', '🎒'],
    ['las tijeras', 'scissors', '✂️'], ['la regla', 'ruler', '📏'], ['la computadora', 'computer', '💻'], ['el reloj', 'clock', '🕒'],
  ]),
  u('a1-tiempo', 'A1', 'El tiempo', 'Weather', [
    ['el sol', 'sun', '☀️'], ['la lluvia', 'rain', '🌧️'], ['la nieve', 'snow', '❄️'], ['el viento', 'wind', '💨'],
    ['la nube', 'cloud', '☁️'], ['la tormenta', 'storm', '⛈️'], ['el arcoíris', 'rainbow', '🌈'], ['la luna', 'moon', '🌙'],
  ]),

  // ================================================================ A2
  u('a2-ciudad', 'A2', 'La ciudad', 'The city', [
    ['el hospital', 'hospital', '🏥'], ['el banco', 'bank', '🏦'], ['la escuela', 'school', '🏫'], ['la iglesia', 'church', '⛪'],
    ['el hotel', 'hotel', '🏨'], ['la tienda', 'store', '🏪'], ['el parque', 'park', '🏞️'], ['el museo', 'museum', '🏛️'],
  ]),
  u('a2-transporte', 'A2', 'El transporte', 'Transportation', [
    ['el coche', 'car', '🚗'], ['el autobús', 'bus', '🚌'], ['el tren', 'train', '🚆'], ['el avión', 'airplane', '✈️'],
    ['la bicicleta', 'bicycle', '🚲'], ['el barco', 'boat', '⛵'], ['el taxi', 'taxi', '🚕'], ['la moto', 'motorcycle', '🏍️'],
  ]),
  u('a2-deportes', 'A2', 'Los deportes', 'Sports', [
    ['el fútbol', 'soccer', '⚽'], ['el baloncesto', 'basketball', '🏀'], ['el béisbol', 'baseball', '⚾'], ['el tenis', 'tennis', '🎾'],
    ['la natación', 'swimming', '🏊'], ['el ciclismo', 'cycling', '🚴'], ['el esquí', 'skiing', '⛷️'], ['el boxeo', 'boxing', '🥊'],
  ]),
  u('a2-acciones', 'A2', 'Verbos de acción', 'Action verbs', [
    ['correr', 'to run', '🏃'], ['nadar', 'to swim', '🤽'], ['bailar', 'to dance', '💃'], ['cantar', 'to sing', '🎤'],
    ['leer', 'to read', '📖'], ['escribir', 'to write', '✍️'], ['dormir', 'to sleep', '😴'], ['cocinar', 'to cook', '🍳'],
  ]),
  u('a2-profesiones', 'A2', 'Las profesiones', 'Jobs', [
    ['el médico', 'doctor', '🧑‍⚕️'], ['el profesor', 'teacher', '🧑‍🏫'], ['el cocinero', 'cook', '🧑‍🍳'], ['el bombero', 'firefighter', '🧑‍🚒'],
    ['el policía', 'police officer', '👮'], ['el agricultor', 'farmer', '🧑‍🌾'], ['el piloto', 'pilot', '🧑‍✈️'], ['el artista', 'artist', '🧑‍🎨'],
  ]),
  u('a2-salud', 'A2', 'La salud', 'Health', [
    ['la fiebre', 'fever', '🤒'], ['el resfriado', 'cold (illness)', '🤧'], ['la pastilla', 'pill', '💊'], ['la venda', 'bandage', '🩹'],
    ['el termómetro', 'thermometer', '🌡️'], ['la ambulancia', 'ambulance', '🚑'], ['la inyección', 'injection', '💉'], ['el diente', 'tooth', '🦷'],
  ]),
  u('a2-viajes', 'A2', 'Los viajes', 'Travel', [
    ['la maleta', 'suitcase', '🧳'], ['el pasaporte', 'passport', '🛂'], ['el mapa', 'map', '🗺️'], ['la playa', 'beach', '🏖️'],
    ['la montaña', 'mountain', '⛰️'], ['la tienda de campaña', 'tent', '⛺'], ['la cámara', 'camera', '📷'], ['el boleto', 'ticket', '🎫'],
  ]),
  u('a2-emociones', 'A2', 'Las emociones', 'Feelings', [
    ['feliz', 'happy', '😀'], ['triste', 'sad', '😢'], ['enojado', 'angry', '😠'], ['cansado', 'tired', '😩'],
    ['asustado', 'scared', '😨'], ['sorprendido', 'surprised', '😮'], ['enamorado', 'in love', '😍'], ['aburrido', 'bored', '🥱'],
  ]),

  // ================================================================ B1
  u('b1-naturaleza', 'B1', 'La naturaleza', 'Nature', [
    ['el bosque', 'forest', '🌲'], ['el río', 'river', '🏞'], ['el volcán', 'volcano', '🌋'], ['el desierto', 'desert', '🏜️'],
    ['la isla', 'island', '🏝️'], ['la ola', 'wave', '🌊'], ['la flor', 'flower', '🌸'], ['la hoja', 'leaf', '🍃'],
  ]),
  u('b1-medioambiente', 'B1', 'El medio ambiente', 'The environment', [
    ['reciclar', 'to recycle', '♻️'], ['la basura', 'trash', '🗑️'], ['la energía solar', 'solar energy', '🔆'], ['la contaminación', 'pollution', '🏭'],
    ['el planeta', 'planet', '🌍'], ['el incendio', 'fire (wildfire)', '🔥'], ['la sequía', 'drought', '🥀'], ['la energía eólica', 'wind power', '🌬️'],
  ]),
  u('b1-tecnologia', 'B1', 'La tecnología', 'Technology', [
    ['el teléfono móvil', 'cell phone', '📱'], ['el teclado', 'keyboard', '⌨️'], ['el ratón', 'computer mouse', '🖱️'], ['la impresora', 'printer', '🖨️'],
    ['la batería', 'battery', '🔋'], ['el correo electrónico', 'email', '📧'], ['la contraseña', 'password', '🔒'], ['el robot', 'robot', '🤖'],
  ]),
  u('b1-cocina', 'B1', 'En la cocina', 'In the kitchen', [
    ['la sartén', 'frying pan', '🍳'], ['el cuchillo', 'knife', '🔪'], ['la cuchara', 'spoon', '🥄'], ['el tenedor', 'fork', '🍴'],
    ['el plato', 'plate', '🍽️'], ['la sal', 'salt', '🧂'], ['la olla', 'pot', '🫕'], ['el horno', 'oven', '♨️'],
  ]),
  u('b1-arte', 'B1', 'El arte y la música', 'Art and music', [
    ['la guitarra', 'guitar', '🎸'], ['el piano', 'piano', '🎹'], ['el violín', 'violin', '🎻'], ['el tambor', 'drum', '🥁'],
    ['la pintura', 'painting', '🖼️'], ['el pincel', 'paintbrush', '🖌️'], ['el teatro', 'theater', '🎭'], ['la película', 'movie', '🎬'],
  ]),
  u('b1-fiestas', 'B1', 'Fiestas y celebraciones', 'Celebrations', [
    ['el cumpleaños', 'birthday', '🎂'], ['el regalo', 'gift', '🎁'], ['el globo', 'balloon', '🎈'], ['los fuegos artificiales', 'fireworks', '🎆'],
    ['la boda', 'wedding', '💒'], ['la vela', 'candle', '🕯️'], ['el disfraz', 'costume', '🦸'], ['el brindis', 'toast (drink)', '🥂'],
  ]),

  // ================================================================ B2
  u('b2-medios', 'B2', 'Los medios de comunicación', 'Media', [
    ['el periódico', 'newspaper', '📰'], ['la radio', 'radio', '📻'], ['la televisión', 'television', '📺'], ['el micrófono', 'microphone', '🎙️'],
    ['la noticia', 'news', '🗞️'], ['la entrevista', 'interview', '🗣️'], ['el anuncio', 'advertisement', '📢'], ['la transmisión en vivo', 'live broadcast', '🔴'],
  ]),
  u('b2-ciencia', 'B2', 'La ciencia', 'Science', [
    ['el microscopio', 'microscope', '🔬'], ['el telescopio', 'telescope', '🔭'], ['el experimento', 'experiment', '🧪'], ['el ADN', 'DNA', '🧬'],
    ['el imán', 'magnet', '🧲'], ['el átomo', 'atom', '⚛️'], ['el cohete', 'rocket', '🚀'], ['el satélite', 'satellite', '🛰️'],
  ]),
  u('b2-economia', 'B2', 'La economía', 'The economy', [
    ['el dinero', 'money', '💵'], ['la tarjeta de crédito', 'credit card', '💳'], ['el crecimiento', 'growth', '📈'], ['la crisis', 'downturn / crisis', '📉'],
    ['el presupuesto', 'budget', '🧾'], ['la fábrica', 'factory', '🏗️'], ['el ahorro', 'savings', '🐷'], ['el comercio', 'trade', '🤝'],
  ]),
  u('b2-relaciones', 'B2', 'Las relaciones', 'Relationships', [
    ['la pareja', 'couple', '💑'], ['el matrimonio', 'marriage', '💍'], ['la amistad', 'friendship', '🫂'], ['el divorcio', 'divorce', '💔'],
    ['el abrazo', 'hug', '🤗'], ['el beso', 'kiss', '💋'], ['la discusión', 'argument', '😤'], ['la reconciliación', 'reconciliation', '🕊️'],
  ]),
  u('b2-trabajo', 'B2', 'El mundo laboral', 'The working world', [
    ['la oficina', 'office', '🏢'], ['la reunión', 'meeting', '👥'], ['el maletín', 'briefcase', '💼'], ['el contrato', 'contract', '📝'],
    ['el horario', 'schedule', '📅'], ['la huelga', 'strike', '✊'], ['el sueldo', 'salary', '💰'], ['el currículum', 'résumé', '📄'],
  ]),

  // ================================================================ C1
  u('c1-politica', 'C1', 'La política', 'Politics', [
    ['las elecciones', 'elections', '🗳️'], ['el gobierno', 'government', '🏛'], ['la bandera', 'flag', '🚩'], ['el discurso', 'speech', '🎤'],
    ['la manifestación', 'protest', '📣'], ['la frontera', 'border', '🛃'], ['la corona', 'crown / monarchy', '👑'], ['el mundo', 'world', '🌐'],
  ]),
  u('c1-justicia', 'C1', 'La justicia', 'Justice and law', [
    ['la justicia', 'justice', '⚖️'], ['el juez', 'judge', '🧑‍⚖️'], ['la cárcel', 'prison', '⛓️'], ['la ley', 'law', '📜'],
    ['el delito', 'crime', '🚨'], ['el detective', 'detective', '🕵️'], ['la prueba', 'evidence', '🔍'], ['el robo', 'robbery', '🦹'],
  ]),
  u('c1-medicina', 'C1', 'La medicina', 'Medicine', [
    ['el corazón', 'heart (organ)', '🫀'], ['los pulmones', 'lungs', '🫁'], ['el cerebro', 'brain', '🧠'], ['el hueso', 'bone', '🦴'],
    ['el virus', 'virus', '🦠'], ['el estetoscopio', 'stethoscope', '🩺'], ['la sangre', 'blood', '🩸'], ['la silla de ruedas', 'wheelchair', '🦽'],
  ]),
  u('c1-finanzas', 'C1', 'Las finanzas', 'Finance', [
    ['la bolsa de valores', 'stock market', '💹'], ['la inversión', 'investment', '🪙'], ['la hipoteca', 'mortgage', '🏘️'], ['el impuesto', 'tax', '🏷️'],
    ['la deuda', 'debt', '⛓'], ['el banco central', 'central bank', '🏦'], ['la ganancia', 'profit', '🤑'], ['la subasta', 'auction', '🔨'],
  ]),
  u('c1-sociedad', 'C1', 'Los desafíos sociales', 'Social challenges', [
    ['la pobreza', 'poverty', '🏚️'], ['la inmigración', 'immigration', '🧭'], ['la igualdad', 'equality', '🟰'], ['la vivienda', 'housing', '🏡'],
    ['el hambre', 'hunger', '🍽'], ['la educación', 'education', '🎓'], ['la salud pública', 'public health', '🏥'], ['la diversidad', 'diversity', '🌈'],
  ]),

  // ================================================================ C2
  u('c2-abstractos', 'C2', 'Conceptos abstractos', 'Abstract ideas', [
    ['la libertad', 'freedom', '🕊️'], ['el poder', 'power', '⚡'], ['la memoria', 'memory', '🧠'], ['el paso del tiempo', 'the passage of time', '⏳'],
    ['la verdad', 'truth', '💡'], ['el destino', 'destiny', '🔮'], ['la esperanza', 'hope', '🌅'], ['el equilibrio', 'balance', '☯️'],
  ]),
  u('c2-modismos-1', 'C2', 'Modismos I', 'Idioms I', [
    ['estar en las nubes', 'to be daydreaming', '☁️'], ['ser pan comido', 'to be a piece of cake', '🍞'], ['costar un ojo de la cara', 'to cost an arm and a leg', '👁️'],
    ['meter la pata', 'to put your foot in it', '🦶'], ['llover a cántaros', 'to rain cats and dogs', '🌧️'], ['echar una mano', 'to lend a hand', '🤝'],
    ['tomar el pelo', 'to pull someone’s leg', '💇'], ['estar hecho polvo', 'to be exhausted', '😵'],
  ]),
  u('c2-modismos-2', 'C2', 'Modismos II', 'Idioms II', [
    ['ponerse las pilas', 'to get your act together', '🔋'], ['dar en el clavo', 'to hit the nail on the head', '🔨'], ['quedarse de piedra', 'to be stunned', '🗿'],
    ['no tener pelos en la lengua', 'to speak your mind', '👅'], ['ser uña y carne', 'to be inseparable', '💅'], ['tirar la toalla', 'to throw in the towel', '🏳️'],
    ['estar como pez en el agua', 'to be in your element', '🐠'], ['buscarle tres pies al gato', 'to overcomplicate things', '🐈'],
  ]),
  u('c2-refranes', 'C2', 'Refranes', 'Proverbs', [
    ['Más vale tarde que nunca.', 'Better late than never.', '⌛'], ['A quien madruga, Dios le ayuda.', 'The early bird gets the worm.', '🐓'],
    ['Ojos que no ven, corazón que no siente.', 'Out of sight, out of mind.', '🙈'], ['En boca cerrada no entran moscas.', 'Silence is golden.', '🤐'],
    ['Más vale pájaro en mano que ciento volando.', 'A bird in the hand is worth two in the bush.', '🐦'], ['Del dicho al hecho hay mucho trecho.', 'Easier said than done.', '🛤️'],
    ['No hay mal que por bien no venga.', 'Every cloud has a silver lining.', '🌤️'], ['Camarón que se duerme se lo lleva la corriente.', 'You snooze, you lose.', '🦐'],
  ]),
  u('c2-literatura', 'C2', 'La literatura', 'Literature', [
    ['la novela', 'novel', '📚'], ['el poema', 'poem', '📜'], ['la pluma', 'pen / quill', '🪶'], ['el personaje', 'character', '🎭'],
    ['la tinta', 'ink', '🖋️'], ['la biblioteca', 'library', '🏛️'], ['el manuscrito', 'manuscript', '🗒️'], ['la máscara', 'mask (metaphor)', '👺'],
  ]),
];

export function picUnitsFor(level: Cefr): PicUnit[] {
  return PIC_UNITS.filter((x) => x.level === level);
}
