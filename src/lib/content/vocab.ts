/**
 * Themed vocabulary. Feeds vocabulary quizzes, worksheets and the games.
 *
 * Every English gloss within a theme is unique, so any other word in the same
 * theme is a safe wrong answer for a multiple-choice question. Nouns carry
 * their article; games strip it.
 */
import type { LevelId } from './levels.ts';

export type Word = readonly [es: string, en: string];

export type Theme = {
  id: string;
  level: LevelId;
  name: string;      // Spanish
  nameEn: string;
  words: readonly Word[];
};

export const THEMES: readonly Theme[] = [
  // ------------------------------------------------------------ Spanish 1
  { id: 'colores', level: 'spanish-1', name: 'Los colores', nameEn: 'Colors', words: [
    ['rojo', 'red'], ['azul', 'blue'], ['verde', 'green'], ['amarillo', 'yellow'],
    ['negro', 'black'], ['blanco', 'white'], ['morado', 'purple'], ['anaranjado', 'orange'],
    ['rosado', 'pink'], ['gris', 'gray'], ['marrón', 'brown'], ['celeste', 'light blue'],
  ] },
  { id: 'numeros', level: 'spanish-1', name: 'Los números', nameEn: 'Numbers', words: [
    ['uno', 'one'], ['dos', 'two'], ['tres', 'three'], ['cuatro', 'four'], ['cinco', 'five'],
    ['seis', 'six'], ['siete', 'seven'], ['ocho', 'eight'], ['nueve', 'nine'], ['diez', 'ten'],
    ['once', 'eleven'], ['doce', 'twelve'], ['quince', 'fifteen'], ['veinte', 'twenty'],
    ['cincuenta', 'fifty'], ['cien', 'one hundred'],
  ] },
  { id: 'familia', level: 'spanish-1', name: 'La familia', nameEn: 'Family', words: [
    ['la madre', 'mother'], ['el padre', 'father'], ['el hermano', 'brother'], ['la hermana', 'sister'],
    ['el abuelo', 'grandfather'], ['la abuela', 'grandmother'], ['el tío', 'uncle'], ['la tía', 'aunt'],
    ['el primo', 'cousin (male)'], ['la prima', 'cousin (female)'], ['el hijo', 'son'], ['la hija', 'daughter'],
    ['el esposo', 'husband'], ['la esposa', 'wife'],
  ] },
  { id: 'comida', level: 'spanish-1', name: 'La comida', nameEn: 'Food', words: [
    ['la manzana', 'apple'], ['el pan', 'bread'], ['el queso', 'cheese'], ['el pollo', 'chicken'],
    ['el arroz', 'rice'], ['la leche', 'milk'], ['el agua', 'water'], ['el huevo', 'egg'],
    ['la naranja', 'orange (fruit)'], ['la ensalada', 'salad'], ['el pescado', 'fish (food)'],
    ['la sopa', 'soup'], ['el jugo', 'juice'], ['la carne', 'meat'],
  ] },
  { id: 'animales', level: 'spanish-1', name: 'Los animales', nameEn: 'Animals', words: [
    ['el perro', 'dog'], ['el gato', 'cat'], ['el caballo', 'horse'], ['la vaca', 'cow'],
    ['el pájaro', 'bird'], ['el pez', 'fish'], ['el ratón', 'mouse'], ['el conejo', 'rabbit'],
    ['el cerdo', 'pig'], ['la oveja', 'sheep'], ['el león', 'lion'], ['el oso', 'bear'],
    ['el mono', 'monkey'], ['la tortuga', 'turtle'],
  ] },
  { id: 'escuela', level: 'spanish-1', name: 'La escuela', nameEn: 'School', words: [
    ['el lápiz', 'pencil'], ['el libro', 'book'], ['el cuaderno', 'notebook'], ['la mochila', 'backpack'],
    ['la mesa', 'table'], ['la silla', 'chair'], ['la pizarra', 'board'], ['el bolígrafo', 'pen'],
    ['la regla', 'ruler'], ['el maestro', 'teacher'], ['el estudiante', 'student'], ['la clase', 'class'],
    ['el examen', 'exam'], ['la tarea', 'homework'],
  ] },
  { id: 'dias-meses', level: 'spanish-1', name: 'Los días y los meses', nameEn: 'Days and months', words: [
    ['lunes', 'Monday'], ['martes', 'Tuesday'], ['miércoles', 'Wednesday'], ['jueves', 'Thursday'],
    ['viernes', 'Friday'], ['sábado', 'Saturday'], ['domingo', 'Sunday'], ['enero', 'January'],
    ['febrero', 'February'], ['marzo', 'March'], ['abril', 'April'], ['mayo', 'May'],
    ['junio', 'June'], ['julio', 'July'], ['agosto', 'August'], ['septiembre', 'September'],
    ['octubre', 'October'], ['noviembre', 'November'], ['diciembre', 'December'],
  ] },
  { id: 'ropa', level: 'spanish-1', name: 'La ropa', nameEn: 'Clothing', words: [
    ['la camisa', 'shirt'], ['los pantalones', 'pants'], ['el vestido', 'dress'], ['la falda', 'skirt'],
    ['los zapatos', 'shoes'], ['el sombrero', 'hat'], ['la chaqueta', 'jacket'], ['los calcetines', 'socks'],
    ['la camiseta', 'T-shirt'], ['el abrigo', 'coat'], ['la bufanda', 'scarf'], ['los guantes', 'gloves'],
  ] },
  { id: 'cuerpo', level: 'spanish-1', name: 'El cuerpo', nameEn: 'The body', words: [
    ['la cabeza', 'head'], ['el brazo', 'arm'], ['la mano', 'hand'], ['la pierna', 'leg'],
    ['el pie', 'foot'], ['el ojo', 'eye'], ['la nariz', 'nose'], ['la boca', 'mouth'],
    ['la oreja', 'ear'], ['el pelo', 'hair'], ['el dedo', 'finger'], ['la espalda', 'back'],
    ['el estómago', 'stomach'], ['el corazón', 'heart'],
  ] },
  { id: 'tiempo', level: 'spanish-1', name: 'El tiempo', nameEn: 'Weather', words: [
    ['el sol', 'sun'], ['la lluvia', 'rain'], ['la nieve', 'snow'], ['el viento', 'wind'],
    ['la nube', 'cloud'], ['el calor', 'heat'], ['el frío', 'cold'], ['la tormenta', 'storm'],
    ['el invierno', 'winter'], ['la primavera', 'spring'], ['el verano', 'summer'], ['el otoño', 'autumn'],
  ] },
  { id: 'casa', level: 'spanish-1', name: 'La casa', nameEn: 'The house', words: [
    ['la cocina', 'kitchen'], ['el baño', 'bathroom'], ['el dormitorio', 'bedroom'], ['la sala', 'living room'],
    ['la puerta', 'door'], ['la ventana', 'window'], ['la cama', 'bed'], ['el sofá', 'sofa'],
    ['el jardín', 'garden'], ['la escalera', 'stairs'], ['el techo', 'roof'], ['la lámpara', 'lamp'],
  ] },
  { id: 'verbos', level: 'spanish-1', name: 'Verbos comunes', nameEn: 'Common verbs', words: [
    ['hablar', 'to speak'], ['comer', 'to eat'], ['vivir', 'to live'], ['beber', 'to drink'],
    ['escribir', 'to write'], ['leer', 'to read'], ['correr', 'to run'], ['bailar', 'to dance'],
    ['cantar', 'to sing'], ['estudiar', 'to study'], ['trabajar', 'to work'], ['nadar', 'to swim'],
    ['dormir', 'to sleep'], ['jugar', 'to play (a game)'], ['caminar', 'to walk'], ['escuchar', 'to listen'],
    ['abrir', 'to open'], ['aprender', 'to learn'],
  ] },

  // ------------------------------------------------------------ Spanish 2
  { id: 'deportes', level: 'spanish-2', name: 'Los deportes', nameEn: 'Sports', words: [
    ['el fútbol', 'soccer'], ['el béisbol', 'baseball'], ['el baloncesto', 'basketball'], ['la natación', 'swimming'],
    ['el tenis', 'tennis'], ['el equipo', 'team'], ['el partido', 'game / match'], ['el jugador', 'player'],
    ['la pelota', 'ball'], ['ganar', 'to win'], ['perder', 'to lose'], ['el entrenador', 'coach'],
    ['el campeonato', 'championship'], ['el estadio', 'stadium'],
  ] },
  { id: 'ciudad', level: 'spanish-2', name: 'La ciudad', nameEn: 'The city', words: [
    ['el banco', 'bank'], ['la biblioteca', 'library'], ['el hospital', 'hospital'], ['la iglesia', 'church'],
    ['el mercado', 'market'], ['el museo', 'museum'], ['el parque', 'park'], ['la plaza', 'town square'],
    ['el correo', 'post office'], ['la calle', 'street'], ['el semáforo', 'traffic light'], ['la esquina', 'corner'],
    ['el puente', 'bridge'], ['el edificio', 'building'],
  ] },
  { id: 'viajes', level: 'spanish-2', name: 'Los viajes', nameEn: 'Travel', words: [
    ['el aeropuerto', 'airport'], ['el avión', 'airplane'], ['el boleto', 'ticket'], ['la maleta', 'suitcase'],
    ['el pasaporte', 'passport'], ['el hotel', 'hotel'], ['la playa', 'beach'], ['el tren', 'train'],
    ['la estación', 'station'], ['el vuelo', 'flight'], ['la aduana', 'customs'], ['el equipaje', 'luggage'],
    ['el turista', 'tourist'], ['la reserva', 'reservation'],
  ] },
  { id: 'rutina', level: 'spanish-2', name: 'La rutina diaria', nameEn: 'Daily routine', words: [
    ['despertarse', 'to wake up'], ['levantarse', 'to get up'], ['ducharse', 'to shower'], ['vestirse', 'to get dressed'],
    ['peinarse', 'to comb one’s hair'], ['cepillarse los dientes', 'to brush one’s teeth'], ['acostarse', 'to go to bed'],
    ['afeitarse', 'to shave'], ['maquillarse', 'to put on makeup'], ['lavarse', 'to wash oneself'],
    ['dormirse', 'to fall asleep'], ['bañarse', 'to take a bath'],
  ] },
  { id: 'salud', level: 'spanish-2', name: 'La salud', nameEn: 'Health', words: [
    ['el médico', 'doctor'], ['la enfermera', 'nurse'], ['la fiebre', 'fever'], ['la tos', 'cough'],
    ['el resfriado', 'cold (illness)'], ['la receta', 'prescription'], ['la pastilla', 'pill'],
    ['el dolor', 'pain'], ['la farmacia', 'pharmacy'], ['la herida', 'wound'], ['la gripe', 'flu'],
    ['estornudar', 'to sneeze'], ['la sangre', 'blood'], ['la alergia', 'allergy'],
  ] },
  { id: 'tienda', level: 'spanish-2', name: 'De compras', nameEn: 'Shopping', words: [
    ['el precio', 'price'], ['barato', 'cheap'], ['caro', 'expensive'], ['la tienda', 'store'],
    ['el dinero', 'money'], ['la tarjeta de crédito', 'credit card'], ['el recibo', 'receipt'],
    ['la talla', 'size (clothing)'], ['el descuento', 'discount'], ['el dependiente', 'store clerk'],
    ['el probador', 'fitting room'], ['la rebaja', 'sale'], ['gastar', 'to spend'], ['pagar', 'to pay'],
  ] },

  // ------------------------------------------------------------ Spanish 3
  { id: 'profesiones', level: 'spanish-3', name: 'Las profesiones', nameEn: 'Professions', words: [
    ['el abogado', 'lawyer'], ['el bombero', 'firefighter'], ['el cocinero', 'cook'], ['el ingeniero', 'engineer'],
    ['el periodista', 'journalist'], ['el policía', 'police officer'], ['el arquitecto', 'architect'],
    ['el contador', 'accountant'], ['el científico', 'scientist'], ['el veterinario', 'veterinarian'],
    ['el carpintero', 'carpenter'], ['el piloto', 'pilot'], ['el dentista', 'dentist'], ['el agricultor', 'farmer'],
  ] },
  { id: 'medio-ambiente', level: 'spanish-3', name: 'El medio ambiente', nameEn: 'The environment', words: [
    ['la contaminación', 'pollution'], ['reciclar', 'to recycle'], ['la basura', 'trash'], ['el bosque', 'forest'],
    ['la selva', 'jungle'], ['el recurso natural', 'natural resource'], ['la energía solar', 'solar energy'],
    ['proteger', 'to protect'], ['la especie', 'species'], ['el calentamiento global', 'global warming'],
    ['la sequía', 'drought'], ['desperdiciar', 'to waste'], ['el petróleo', 'oil (petroleum)'], ['la capa de ozono', 'ozone layer'],
  ] },
  { id: 'emociones', level: 'spanish-3', name: 'Las emociones', nameEn: 'Emotions', words: [
    ['alegre', 'cheerful'], ['triste', 'sad'], ['enojado', 'angry'], ['nervioso', 'nervous'],
    ['orgulloso', 'proud'], ['avergonzado', 'embarrassed'], ['celoso', 'jealous'], ['asustado', 'scared'],
    ['preocupado', 'worried'], ['aburrido', 'bored'], ['sorprendido', 'surprised'], ['tranquilo', 'calm'],
    ['agradecido', 'grateful'], ['decepcionado', 'disappointed'],
  ] },
  { id: 'tecnologia', level: 'spanish-3', name: 'La tecnología', nameEn: 'Technology', words: [
    ['la computadora', 'computer'], ['el teclado', 'keyboard'], ['la pantalla', 'screen'], ['el ratón', 'mouse (computer)'],
    ['la contraseña', 'password'], ['descargar', 'to download'], ['subir', 'to upload'], ['el correo electrónico', 'email'],
    ['el archivo', 'file'], ['la aplicación', 'app'], ['guardar', 'to save'], ['borrar', 'to delete'],
    ['el enlace', 'link'], ['la red social', 'social network'],
  ] },
  { id: 'naturaleza', level: 'spanish-3', name: 'La naturaleza', nameEn: 'Nature', words: [
    ['la montaña', 'mountain'], ['el río', 'river'], ['el lago', 'lake'], ['el desierto', 'desert'],
    ['la isla', 'island'], ['el valle', 'valley'], ['la costa', 'coast'], ['el volcán', 'volcano'],
    ['la cascada', 'waterfall'], ['la colina', 'hill'], ['la cueva', 'cave'], ['el mar', 'sea'],
  ] },

  // ------------------------------------------------------------ Spanish 4
  { id: 'relaciones', level: 'spanish-4', name: 'Las relaciones personales', nameEn: 'Relationships', words: [
    ['la amistad', 'friendship'], ['el noviazgo', 'courtship / dating'], ['casarse', 'to get married'],
    ['divorciarse', 'to get divorced'], ['la pareja', 'couple / partner'], ['confiar', 'to trust'],
    ['pelearse', 'to fight'], ['hacer las paces', 'to make up'], ['el compromiso', 'engagement / commitment'],
    ['el apoyo', 'support'], ['llevarse bien', 'to get along'], ['el cariño', 'affection'],
    ['la soledad', 'loneliness'], ['la confianza', 'trust'],
  ] },
  { id: 'medios', level: 'spanish-4', name: 'Los medios de comunicación', nameEn: 'Media', words: [
    ['el periódico', 'newspaper'], ['la noticia', 'news item'], ['el titular', 'headline'], ['la revista', 'magazine'],
    ['el locutor', 'announcer'], ['la emisora', 'radio station'], ['el anuncio', 'advertisement'],
    ['la prensa', 'the press'], ['el reportaje', 'news report'], ['la encuesta', 'survey / poll'],
    ['el televidente', 'TV viewer'], ['transmitir', 'to broadcast'], ['la censura', 'censorship'], ['el oyente', 'listener'],
  ] },
  { id: 'fiestas', level: 'spanish-4', name: 'Fiestas y tradiciones', nameEn: 'Celebrations and traditions', words: [
    ['el desfile', 'parade'], ['los fuegos artificiales', 'fireworks'], ['el disfraz', 'costume'],
    ['la costumbre', 'custom'], ['el antepasado', 'ancestor'], ['la ofrenda', 'offering'],
    ['celebrar', 'to celebrate'], ['el aniversario', 'anniversary'], ['la procesión', 'procession'],
    ['el día feriado', 'holiday'], ['la vela', 'candle'], ['el brindis', 'toast (drink)'],
  ] },
  { id: 'cocina', level: 'spanish-4', name: 'En la cocina', nameEn: 'Cooking', words: [
    ['hervir', 'to boil'], ['freír', 'to fry'], ['hornear', 'to bake'], ['mezclar', 'to mix'],
    ['picar', 'to chop'], ['la olla', 'pot'], ['la sartén', 'frying pan'], ['el horno', 'oven'],
    ['la receta', 'recipe'], ['el ingrediente', 'ingredient'], ['agregar', 'to add'], ['probar', 'to taste'],
    ['la cucharada', 'tablespoon'], ['pelar', 'to peel'],
  ] },

  // ------------------------------------------------------------ Spanish 5
  { id: 'arte-literatura', level: 'spanish-5', name: 'El arte y la literatura', nameEn: 'Art and literature', words: [
    ['el cuadro', 'painting'], ['la escultura', 'sculpture'], ['el pincel', 'paintbrush'], ['el autorretrato', 'self-portrait'],
    ['la novela', 'novel'], ['el cuento', 'short story'], ['el poema', 'poem'], ['la estrofa', 'stanza'],
    ['el personaje', 'character'], ['la trama', 'plot'], ['el narrador', 'narrator'], ['la obra maestra', 'masterpiece'],
    ['el ensayo', 'essay'], ['la rima', 'rhyme'],
  ] },
  { id: 'trabajo', level: 'spanish-5', name: 'El trabajo y la economía', nameEn: 'Work and the economy', words: [
    ['el sueldo', 'salary'], ['la entrevista', 'interview'], ['el currículum', 'résumé'], ['contratar', 'to hire'],
    ['despedir', 'to fire'], ['el desempleo', 'unemployment'], ['la empresa', 'company'], ['el gerente', 'manager'],
    ['el ascenso', 'promotion'], ['la huelga', 'strike'], ['el impuesto', 'tax'], ['el presupuesto', 'budget'],
    ['ahorrar', 'to save (money)'], ['la deuda', 'debt'],
  ] },
  { id: 'ciencia', level: 'spanish-5', name: 'La ciencia', nameEn: 'Science', words: [
    ['el experimento', 'experiment'], ['la hipótesis', 'hypothesis'], ['el laboratorio', 'laboratory'],
    ['el descubrimiento', 'discovery'], ['la investigación', 'research'], ['la célula', 'cell'],
    ['el gen', 'gene'], ['la vacuna', 'vaccine'], ['el invento', 'invention'], ['comprobar', 'to verify'],
    ['el microscopio', 'microscope'], ['el planeta', 'planet'], ['la estrella', 'star'], ['el átomo', 'atom'],
  ] },
  { id: 'cine-musica', level: 'spanish-5', name: 'El cine y la música', nameEn: 'Film and music', words: [
    ['la película', 'movie'], ['el guion', 'script'], ['el director', 'director'], ['el estreno', 'premiere'],
    ['los subtítulos', 'subtitles'], ['la banda sonora', 'soundtrack'], ['el escenario', 'stage'],
    ['la gira', 'tour'], ['el público', 'audience'], ['la letra', 'lyrics'], ['el ensayo general', 'dress rehearsal'],
    ['el papel', 'role'], ['aplaudir', 'to applaud'], ['el doblaje', 'dubbing'],
  ] },

  // ------------------------------------------------------------ Spanish 6
  { id: 'politica', level: 'spanish-6', name: 'La política y la sociedad', nameEn: 'Politics and society', words: [
    ['el gobierno', 'government'], ['las elecciones', 'elections'], ['el ciudadano', 'citizen'], ['votar', 'to vote'],
    ['la ley', 'law'], ['el derecho', 'right (legal)'], ['la democracia', 'democracy'], ['el partido político', 'political party'],
    ['la manifestación', 'demonstration / protest'], ['el alcalde', 'mayor'], ['la corrupción', 'corruption'],
    ['la igualdad', 'equality'], ['el discurso', 'speech'], ['la campaña', 'campaign'],
  ] },
  { id: 'historia', level: 'spanish-6', name: 'La historia', nameEn: 'History', words: [
    ['el siglo', 'century'], ['la época', 'era'], ['el imperio', 'empire'], ['la conquista', 'conquest'],
    ['la independencia', 'independence'], ['la guerra', 'war'], ['la paz', 'peace'], ['el rey', 'king'],
    ['la reina', 'queen'], ['la colonia', 'colony'], ['el tratado', 'treaty'], ['la revolución', 'revolution'],
    ['el ejército', 'army'], ['la batalla', 'battle'],
  ] },
  { id: 'negocios', level: 'spanish-6', name: 'Los negocios', nameEn: 'Business', words: [
    ['la reunión', 'meeting'], ['el cliente', 'client'], ['el contrato', 'contract'], ['la ganancia', 'profit'],
    ['la pérdida', 'loss'], ['invertir', 'to invest'], ['la bolsa de valores', 'stock market'],
    ['el socio', 'business partner'], ['la sucursal', 'branch office'], ['el mercado laboral', 'job market'],
    ['la mercancía', 'merchandise'], ['exportar', 'to export'], ['el plazo', 'deadline / term'], ['la factura', 'invoice'],
  ] },

  // ------------------------------------------------------------ AP Spanish
  { id: 'ap-familias', level: 'ap-spanish', name: 'Las familias y las comunidades', nameEn: 'Families and communities', words: [
    ['la crianza', 'upbringing'], ['el vecindario', 'neighborhood'], ['la convivencia', 'coexistence'],
    ['el voluntariado', 'volunteering'], ['la generación', 'generation'], ['los lazos', 'bonds / ties'],
    ['la ciudadanía', 'citizenship'], ['el compromiso cívico', 'civic engagement'], ['la tercera edad', 'old age'],
    ['el hogar', 'home'], ['la brecha generacional', 'generation gap'], ['la solidaridad', 'solidarity'],
  ] },
  { id: 'ap-ciencia', level: 'ap-spanish', name: 'La ciencia y la tecnología', nameEn: 'Science and technology', words: [
    ['la inteligencia artificial', 'artificial intelligence'], ['el avance', 'advance'], ['la privacidad', 'privacy'],
    ['la brecha digital', 'digital divide'], ['la ética', 'ethics'], ['el algoritmo', 'algorithm'],
    ['la innovación', 'innovation'], ['el desarrollo sostenible', 'sustainable development'],
    ['la clonación', 'cloning'], ['el ciberacoso', 'cyberbullying'], ['los datos', 'data'], ['el alcance', 'reach / scope'],
  ] },
  { id: 'ap-belleza', level: 'ap-spanish', name: 'La belleza y la estética', nameEn: 'Beauty and aesthetics', words: [
    ['la arquitectura', 'architecture'], ['el patrimonio', 'heritage'], ['la moda', 'fashion'],
    ['la artesanía', 'handicrafts'], ['el canon de belleza', 'beauty standard'], ['la vanguardia', 'avant-garde'],
    ['el mural', 'mural'], ['la creatividad', 'creativity'], ['el diseño', 'design'], ['la apariencia', 'appearance'],
    ['el lienzo', 'canvas'], ['la belleza', 'beauty'],
  ] },
  { id: 'ap-identidades', level: 'ap-spanish', name: 'Las identidades personales y públicas', nameEn: 'Personal and public identities', words: [
    ['la herencia cultural', 'cultural heritage'], ['el bilingüismo', 'bilingualism'], ['la autoestima', 'self-esteem'],
    ['la inmigración', 'immigration'], ['la pertenencia', 'belonging'], ['el estereotipo', 'stereotype'],
    ['la diversidad', 'diversity'], ['la asimilación', 'assimilation'], ['los valores', 'values'],
    ['la nacionalidad', 'nationality'], ['el prejuicio', 'prejudice'], ['la lengua materna', 'native language'],
  ] },
  { id: 'ap-vida', level: 'ap-spanish', name: 'La vida contemporánea', nameEn: 'Contemporary life', words: [
    ['el ocio', 'leisure'], ['el bienestar', 'well-being'], ['el consumismo', 'consumerism'],
    ['la calidad de vida', 'quality of life'], ['el estrés', 'stress'], ['la jornada laboral', 'workday'],
    ['el teletrabajo', 'remote work'], ['la vivienda', 'housing'], ['el estilo de vida', 'lifestyle'],
    ['las redes sociales', 'social media'], ['el tiempo libre', 'free time'], ['la publicidad', 'advertising'],
  ] },
  { id: 'ap-desafios', level: 'ap-spanish', name: 'Los desafíos mundiales', nameEn: 'Global challenges', words: [
    ['la pobreza', 'poverty'], ['el hambre', 'hunger'], ['los derechos humanos', 'human rights'],
    ['el cambio climático', 'climate change'], ['la desigualdad', 'inequality'], ['el refugiado', 'refugee'],
    ['la deforestación', 'deforestation'], ['la escasez', 'shortage'], ['el desarrollo', 'development'],
    ['la salud pública', 'public health'], ['la globalización', 'globalization'], ['la sostenibilidad', 'sustainability'],
  ] },

  // ------------------------------------------------------------ College
  { id: 'falsos-amigos', level: 'college-spanish', name: 'Falsos amigos', nameEn: 'False cognates', words: [
    ['embarazada', 'pregnant'], ['actual', 'current'], ['realizar', 'to carry out'], ['éxito', 'success'],
    ['carpeta', 'folder'], ['librería', 'bookstore'], ['sensible', 'sensitive'], ['molestar', 'to bother'],
    ['asistir', 'to attend'], ['recordar', 'to remember'], ['largo', 'long'], ['ropa', 'clothes'],
    ['constipado', 'congested (with a cold)'], ['decepción', 'disappointment'],
  ] },
  { id: 'conectores', level: 'college-spanish', name: 'Conectores del discurso', nameEn: 'Discourse connectors', words: [
    ['sin embargo', 'however'], ['por lo tanto', 'therefore'], ['además', 'furthermore'], ['en cambio', 'on the other hand'],
    ['a pesar de', 'despite'], ['es decir', 'that is to say'], ['por consiguiente', 'consequently'],
    ['no obstante', 'nevertheless'], ['en cuanto a', 'as for / regarding'], ['a fin de que', 'so that'],
    ['dado que', 'given that'], ['en resumen', 'in summary'], ['asimismo', 'likewise'], ['aunque', 'although'],
  ] },
  { id: 'modismos', level: 'college-spanish', name: 'Expresiones idiomáticas', nameEn: 'Idioms', words: [
    ['estar en las nubes', 'to be daydreaming'], ['tomar el pelo', 'to pull someone’s leg'],
    ['costar un ojo de la cara', 'to cost an arm and a leg'], ['meter la pata', 'to put one’s foot in it'],
    ['no tener pelos en la lengua', 'to speak one’s mind'], ['ser pan comido', 'to be a piece of cake'],
    ['echar una mano', 'to lend a hand'], ['estar hecho polvo', 'to be exhausted'],
    ['dar en el clavo', 'to hit the nail on the head'], ['llover a cántaros', 'to rain cats and dogs'],
    ['ponerse las pilas', 'to get one’s act together'], ['quedarse de piedra', 'to be stunned'],
  ] },
  { id: 'academico', level: 'college-spanish', name: 'Vocabulario académico', nameEn: 'Academic vocabulary', words: [
    ['el planteamiento', 'approach / framing'], ['la tesis', 'thesis'], ['el argumento', 'argument'],
    ['la fuente', 'source'], ['la cita', 'quotation'], ['el análisis', 'analysis'], ['la bibliografía', 'bibliography'],
    ['el marco teórico', 'theoretical framework'], ['la conclusión', 'conclusion'], ['matizar', 'to nuance / qualify'],
    ['plantear', 'to raise (a question)'], ['el enfoque', 'focus / approach'], ['el hallazgo', 'finding'],
    ['la reseña', 'review (critical)'],
  ] },
];

export function themeById(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id);
}

export function themesForLevel(level: LevelId): Theme[] {
  return THEMES.filter((t) => t.level === level);
}

/** 'el perro' -> 'perro'. For games, where the article is noise. */
export function stripArticle(es: string): string {
  return es.replace(/^(el|la|los|las)\s+/i, '');
}
