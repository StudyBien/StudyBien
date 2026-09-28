/**
 * Reading comprehension: three original passages per level, each with
 * multiple-choice questions and a writing task. Passages grow in length and
 * register from Spanish 1 to college.
 */
import type { LevelId } from './levels.ts';
import type { GrammarQ } from './grammar.ts';

export type Reading = {
  id: string;
  level: LevelId;
  title: string;
  titleEn: string;
  genre: string;
  paragraphs: readonly string[];
  questions: readonly GrammarQ[];
  writing: { prompt: string; minWords: number };
};

const q = (prompt: string, correct: string, wrong: [string, string, string], why: string): GrammarQ =>
  ({ prompt, correct, wrong, why });

export const READINGS: readonly Reading[] = [
  // ================================================================ Spanish 1
  {
    id: 'mi-familia', level: 'spanish-1', title: 'Mi familia', titleEn: 'My family', genre: 'Descripción personal',
    paragraphs: [
      'Hola. Me llamo Sofía y tengo quince años. Soy de Guadalajara, México. Vivo en una casa grande con mi familia.',
      'Mi madre se llama Elena. Es profesora de matemáticas y es muy simpática. Mi padre se llama Jorge. Es cocinero en un restaurante. Tengo un hermano, Mateo. Él tiene diez años y es muy cómico.',
      'También tenemos un perro. Se llama Chispa y es pequeño y blanco. Los sábados, mi familia y yo caminamos en el parque con Chispa. ¡Me gusta mucho mi familia!',
    ],
    questions: [
      q('¿Cuántos años tiene Sofía?', 'quince', ['diez', 'doce', 'cincuenta'], '"Tengo quince años."'),
      q('¿De dónde es Sofía?', 'de México', ['de España', 'de Chile', 'de Colombia'], 'She is from Guadalajara, México.'),
      q('¿Cuál es la profesión de su padre?', 'cocinero', ['profesor', 'médico', 'estudiante'], '"Es cocinero en un restaurante."'),
      q('¿Cómo es Mateo?', 'cómico', ['serio', 'alto', 'tímido'], '"Es muy cómico."'),
      q('¿Qué hace la familia los sábados?', 'Caminan en el parque.', ['Cocinan en un restaurante.', 'Estudian matemáticas.', 'Miran la televisión.'], '"Caminamos en el parque con Chispa."'),
    ],
    writing: { prompt: 'Describe a tu familia. ¿Cómo se llaman? ¿Cuántos años tienen? ¿Cómo son?', minWords: 40 },
  },
  {
    id: 'un-dia-escuela', level: 'spanish-1', title: 'Un día en la escuela', titleEn: 'A day at school', genre: 'Narración',
    paragraphs: [
      'Me llamo Daniel. Estudio en una escuela secundaria en Madrid. Las clases empiezan a las ocho y media de la mañana.',
      'Mi clase favorita es la ciencia porque es interesante. No me gusta la clase de historia porque es difícil. A las once, como un sándwich y bebo un jugo de naranja en la cafetería con mis amigos.',
      'Por la tarde, juego al fútbol con el equipo de la escuela. Llego a casa a las cinco. Después, hago la tarea y leo un libro.',
    ],
    questions: [
      q('¿Dónde estudia Daniel?', 'en Madrid', ['en México', 'en Lima', 'en Buenos Aires'], '"Estudio en una escuela secundaria en Madrid."'),
      q('¿A qué hora empiezan las clases?', 'a las ocho y media', ['a las once', 'a las cinco', 'a las siete'], '"Las clases empiezan a las ocho y media."'),
      q('¿Por qué le gusta la ciencia?', 'Es interesante.', ['Es fácil.', 'Es difícil.', 'Es aburrida.'], '"Porque es interesante."'),
      q('¿Qué bebe en la cafetería?', 'un jugo de naranja', ['leche', 'agua', 'café'], '"Bebo un jugo de naranja."'),
      q('¿Qué hace Daniel por la tarde?', 'Juega al fútbol.', ['Come en la cafetería.', 'Estudia historia.', 'Trabaja en una tienda.'], '"Juego al fútbol con el equipo."'),
    ],
    writing: { prompt: 'Describe un día típico en tu escuela. ¿Cuál es tu clase favorita y por qué?', minWords: 40 },
  },
  {
    id: 'el-mercado', level: 'spanish-1', title: 'En el mercado', titleEn: 'At the market', genre: 'Diálogo',
    paragraphs: [
      'Vendedor: ¡Buenos días, señora! ¿Qué necesita hoy?',
      'Señora Ruiz: Buenos días. Necesito manzanas y queso. ¿Cuánto cuestan las manzanas?',
      'Vendedor: Cuestan dos dólares el kilo. Son muy frescas.',
      'Señora Ruiz: Perfecto. Quiero dos kilos, por favor. ¿Y el queso?',
      'Vendedor: El queso cuesta cinco dólares. En total son nueve dólares.',
      'Señora Ruiz: Aquí tiene. ¡Muchas gracias y hasta luego!',
    ],
    questions: [
      q('¿Qué necesita la señora Ruiz?', 'manzanas y queso', ['pan y leche', 'pollo y arroz', 'naranjas y jugo'], '"Necesito manzanas y queso."'),
      q('¿Cuánto cuesta un kilo de manzanas?', 'dos dólares', ['cinco dólares', 'nueve dólares', 'un dólar'], '"Cuestan dos dólares el kilo."'),
      q('¿Cuántos kilos compra?', 'dos', ['uno', 'tres', 'cinco'], '"Quiero dos kilos."'),
      q('¿Cuánto paga en total?', 'nueve dólares', ['siete dólares', 'cinco dólares', 'diez dólares'], '2 × 2 + 5 = 9.'),
      q('¿Cuándo ocurre la conversación?', 'por la mañana', ['por la noche', 'a medianoche', 'por la tarde'], '"Buenos días" is a morning greeting.'),
    ],
    writing: { prompt: 'Escribe un diálogo corto entre tú y un vendedor en una tienda de ropa.', minWords: 40 },
  },

  // ================================================================ Spanish 2
  {
    id: 'viaje-cusco', level: 'spanish-2', title: 'Mi viaje a Cusco', titleEn: 'My trip to Cusco', genre: 'Diario de viaje',
    paragraphs: [
      'El verano pasado, mi familia y yo viajamos a Perú. Llegamos a Lima en avión y luego tomamos otro vuelo a Cusco, una ciudad antigua en las montañas.',
      'El primer día, me sentí un poco mal porque Cusco está a más de tres mil metros de altura. Mi madre me dio un té de coca y descansé en el hotel toda la tarde.',
      'El tercer día, subimos en tren a Machu Picchu. Cuando llegamos, había mucha niebla y no podíamos ver nada. Pero después de una hora, salió el sol y vimos las ruinas. ¡Fue increíble! Saqué más de cien fotos.',
      'Cuando era niño, mi abuelo siempre me contaba historias de los incas. Por fin entendí por qué le gustaba tanto este lugar.',
    ],
    questions: [
      q('¿Cómo llegaron a Cusco?', 'en avión', ['en tren', 'en autobús', 'en coche'], 'They took another flight from Lima to Cusco.'),
      q('¿Por qué se sintió mal el narrador el primer día?', 'por la altura', ['por la comida', 'por el frío', 'por el viaje en tren'], 'Cusco is over 3,000 meters high.'),
      q('¿Qué pasó cuando llegaron a Machu Picchu?', 'Había niebla y no veían nada.', ['Hacía mucho sol.', 'Estaba cerrado.', 'Llovía a cántaros.'], '"Había mucha niebla."'),
      q('¿Quién le contaba historias de los incas?', 'su abuelo', ['su madre', 'un guía', 'su profesor'], '"Mi abuelo siempre me contaba historias."'),
      q('"Saqué más de cien fotos" means he…', 'took more than 100 photos', ['bought 100 photos', 'lost 100 photos', 'saw 100 photos'], 'Sacar fotos = to take photos.'),
    ],
    writing: { prompt: 'Escribe sobre un viaje que hiciste. ¿Adónde fuiste? ¿Qué hiciste? ¿Cómo era el lugar? Usa el pretérito y el imperfecto.', minWords: 80 },
  },
  {
    id: 'rutina-atleta', level: 'spanish-2', title: 'La rutina de una atleta', titleEn: 'An athlete’s routine', genre: 'Entrevista',
    paragraphs: [
      'Periodista: Camila, eres nadadora profesional. ¿Cómo es tu rutina diaria?',
      'Camila: Me despierto a las cinco de la mañana. Me levanto, me lavo la cara y desayuno avena con fruta. A las seis, ya estoy en la piscina.',
      'Periodista: ¿Cuántas horas entrenas?',
      'Camila: Entreno cuatro horas por la mañana y dos por la tarde. Entre los entrenamientos, estudio porque estoy en la universidad.',
      'Periodista: ¿Siempre quisiste ser nadadora?',
      'Camila: No. De niña, tenía miedo del agua. Mi padre me enseñó a nadar cuando tenía ocho años, y desde ese día me encantó. Me acuesto a las nueve porque el cuerpo necesita descansar.',
    ],
    questions: [
      q('¿A qué hora se despierta Camila?', 'a las cinco', ['a las seis', 'a las nueve', 'a las ocho'], '"Me despierto a las cinco."'),
      q('¿Cuántas horas entrena en total al día?', 'seis', ['cuatro', 'dos', 'ocho'], '4 + 2 = 6.'),
      q('¿Qué hace entre los entrenamientos?', 'Estudia.', ['Duerme.', 'Trabaja en un café.', 'Mira la tele.'], '"Estudio porque estoy en la universidad."'),
      q('¿Cómo se sentía Camila en el agua de niña?', 'Tenía miedo.', ['Estaba feliz.', 'Era la mejor.', 'Estaba aburrida.'], '"Tenía miedo del agua."'),
      q('¿Por qué se acuesta temprano?', 'El cuerpo necesita descansar.', ['Tiene clase a las nueve.', 'No le gusta la noche.', 'Su padre lo manda.'], 'She says the body needs rest.'),
    ],
    writing: { prompt: 'Describe tu rutina diaria usando al menos seis verbos reflexivos.', minWords: 80 },
  },
  {
    id: 'la-leyenda-maiz', level: 'spanish-2', title: 'La leyenda del maíz', titleEn: 'The legend of corn', genre: 'Leyenda',
    paragraphs: [
      'Hace muchos años, los aztecas solo comían raíces y animales pequeños. El maíz existía, pero estaba escondido detrás de una gran montaña y nadie podía llegar allí.',
      'Los dioses intentaron mover la montaña con su fuerza, pero no pudieron. Entonces, el dios Quetzalcóatl tuvo una idea: se transformó en una hormiga negra.',
      'Como hormiga, caminó por un camino muy estrecho durante días. Por fin llegó al otro lado, tomó un grano de maíz y regresó con él. Los aztecas plantaron el grano y, desde entonces, cultivaron maíz y fueron un pueblo fuerte y rico.',
    ],
    questions: [
      q('¿Qué comían los aztecas al principio?', 'raíces y animales pequeños', ['maíz y frijoles', 'pescado', 'frutas tropicales'], 'Stated in the first sentence.'),
      q('¿Dónde estaba el maíz?', 'detrás de una montaña', ['debajo del mar', 'en el cielo', 'en una cueva'], '"Detrás de una gran montaña."'),
      q('¿En qué se transformó Quetzalcóatl?', 'en una hormiga', ['en un pájaro', 'en una serpiente', 'en un hombre'], '"Se transformó en una hormiga negra."'),
      q('¿Por qué no pudieron mover la montaña?', 'Era demasiado grande y fuerte.', ['No querían.', 'Estaban dormidos.', 'No sabían dónde estaba.'], 'They tried with their strength and failed.'),
      q('What is the moral of the legend?', 'Cleverness can succeed where force fails.', ['Mountains are sacred.', 'Ants are dangerous.', 'Corn is expensive.'], 'Quetzalcóatl used wit, not strength.'),
    ],
    writing: { prompt: 'Cuenta una leyenda o un cuento de tu cultura. Usa el pretérito para las acciones y el imperfecto para las descripciones.', minWords: 80 },
  },

  // ================================================================ Spanish 3
  {
    id: 'ciudad-futuro', level: 'spanish-3', title: 'La ciudad del futuro', titleEn: 'The city of the future', genre: 'Artículo de opinión',
    paragraphs: [
      '¿Cómo serán las ciudades dentro de cincuenta años? Muchos expertos creen que serán más verdes y más inteligentes. Habrá menos coches en las calles, y la gente usará bicicletas, trenes eléctricos y vehículos autónomos.',
      'Los edificios producirán su propia energía con paneles solares, y los techos tendrán jardines para limpiar el aire. Además, los sensores controlarán el tráfico y el consumo de agua.',
      'Sin embargo, no todos están de acuerdo. Algunos críticos dicen que esta tecnología costará demasiado y que solo las ciudades ricas podrán pagarla. Para ellos, es importante que los gobiernos piensen también en los barrios pobres.',
      'En mi opinión, la ciudad del futuro debería ser, sobre todo, una ciudad para todos.',
    ],
    questions: [
      q('Según los expertos, ¿cómo serán las ciudades?', 'más verdes e inteligentes', ['más grandes y ruidosas', 'iguales que hoy', 'más peligrosas'], 'First paragraph.'),
      q('¿Para qué servirán los jardines en los techos?', 'para limpiar el aire', ['para cultivar comida', 'para jugar', 'para producir energía'], '"Para limpiar el aire."'),
      q('¿Qué critican algunas personas?', 'el costo de la tecnología', ['los jardines', 'las bicicletas', 'los trenes'], '"Costará demasiado."'),
      q('¿Qué tiempo verbal predomina en el primer párrafo?', 'el futuro', ['el pretérito', 'el imperfecto', 'el presente perfecto'], 'Serán, habrá, usará.'),
      q('¿Cuál es la opinión del autor?', 'La ciudad debe ser para todos.', ['La tecnología es mala.', 'Los coches son necesarios.', 'Solo importan las ciudades ricas.'], 'Final sentence.'),
    ],
    writing: { prompt: '¿Cómo será tu ciudad en el año 2075? Escribe un párrafo con al menos ocho verbos en futuro y da tu opinión.', minWords: 120 },
  },
  {
    id: 'carta-consejo', level: 'spanish-3', title: 'Querida consejera', titleEn: 'Dear advice columnist', genre: 'Carta y respuesta',
    paragraphs: [
      'Querida consejera: Tengo diecisiete años y mis padres quieren que estudie medicina, como ellos. Pero a mí me encanta el diseño gráfico. Cuando dibujo, me siento feliz. No quiero decepcionarlos. ¿Qué hago? — Confundido en Bogotá',
      'Querido Confundido: Es normal que te sientas así. Primero, te recomiendo que hables con tus padres con calma y que les muestres tu trabajo. Es importante que ellos vean tu pasión.',
      'También te sugiero que investigues las carreras de diseño y que les expliques las oportunidades de trabajo que existen. Ojalá que ellos entiendan que tu felicidad es lo más importante. Y recuerda: tu vida es tuya. — La consejera',
    ],
    questions: [
      q('¿Qué quieren los padres del chico?', 'que estudie medicina', ['que sea diseñador', 'que trabaje con ellos', 'que viva en Bogotá'], 'First sentence.'),
      q('¿Cómo se siente el chico cuando dibuja?', 'feliz', ['confundido', 'triste', 'nervioso'], '"Me siento feliz."'),
      q('¿Qué le recomienda la consejera primero?', 'hablar con sus padres', ['cambiar de ciudad', 'estudiar medicina', 'dejar de dibujar'], '"Te recomiendo que hables con tus padres."'),
      q('Why is "hables" in the subjunctive?', 'It follows a recommendation (te recomiendo que).', ['It is a past action.', 'It is a command to the parents.', 'It follows "ser".'], 'Recommendations trigger the subjunctive.'),
      q('¿Cuál es el mensaje final de la consejera?', 'Tu vida es tuya.', ['Obedece a tus padres.', 'Estudia las dos carreras.', 'No hables del tema.'], '"Tu vida es tuya."'),
    ],
    writing: { prompt: 'Escribe una carta a una consejera sobre un problema (real o inventado) y luego escribe su respuesta con al menos cinco verbos en subjuntivo.', minWords: 120 },
  },
  {
    id: 'selva-amazonica', level: 'spanish-3', title: 'La selva amazónica en peligro', titleEn: 'The Amazon in danger', genre: 'Texto informativo',
    paragraphs: [
      'La selva amazónica es el bosque tropical más grande del mundo. Se extiende por nueve países, entre ellos Brasil, Perú y Colombia, y alberga aproximadamente el diez por ciento de todas las especies conocidas del planeta.',
      'Sin embargo, cada año se pierden miles de kilómetros cuadrados de selva. Las causas principales son la ganadería, la agricultura y la minería ilegal. Cuando se cortan los árboles, muchos animales pierden su hogar y se libera dióxido de carbono a la atmósfera.',
      'Hay esperanza: varias comunidades indígenas protegen sus territorios, y en algunas zonas la deforestación ha disminuido gracias a nuevas leyes y a la vigilancia por satélite. Los científicos dicen que, si actuamos ahora, todavía podremos salvar gran parte de la selva.',
    ],
    questions: [
      q('¿Por cuántos países se extiende la selva?', 'nueve', ['tres', 'diez', 'cinco'], 'First paragraph.'),
      q('¿Qué porcentaje de las especies conocidas vive allí?', 'aproximadamente el diez por ciento', ['la mitad', 'el uno por ciento', 'el noventa por ciento'], 'First paragraph.'),
      q('¿Cuál NO es una causa de la deforestación mencionada?', 'el turismo', ['la ganadería', 'la minería ilegal', 'la agricultura'], 'Tourism is not mentioned.'),
      q('¿Quiénes protegen sus territorios?', 'las comunidades indígenas', ['los mineros', 'los turistas', 'los ganaderos'], 'Third paragraph.'),
      q('¿Cuál es el tono del último párrafo?', 'esperanzador', ['desesperado', 'cómico', 'indiferente'], '"Hay esperanza."'),
    ],
    writing: { prompt: 'Escribe un artículo corto sobre un problema ambiental de tu región. Explica las causas y propón tres soluciones.', minWords: 120 },
  },

  // ================================================================ Spanish 4
  {
    id: 'redes-sociales', level: 'spanish-4', title: '¿Nos conectan o nos separan?', titleEn: 'Do they connect us or separate us?', genre: 'Ensayo',
    paragraphs: [
      'Hoy en día, es difícil encontrar a un adolescente que no tenga al menos una cuenta en las redes sociales. Estas plataformas nos permiten mantener el contacto con amigos que viven lejos, descubrir noticias al instante y compartir nuestras ideas con el mundo.',
      'No obstante, varios estudios han demostrado que el uso excesivo de las redes puede provocar ansiedad y problemas de autoestima. Muchos jóvenes comparan su vida real con las imágenes perfectas que ven en línea, y dudan que su propia vida sea suficientemente interesante.',
      'Además, los expertos advierten que no todo lo que se publica es verdad. Es fundamental que aprendamos a verificar las fuentes antes de compartir una noticia.',
      'En conclusión, no creo que las redes sociales sean buenas ni malas por sí mismas; todo depende de cómo las usemos. La clave está en el equilibrio.',
    ],
    questions: [
      q('¿Qué ventaja de las redes se menciona?', 'mantener el contacto con amigos lejanos', ['dormir mejor', 'ganar dinero fácil', 'reducir la ansiedad'], 'First paragraph.'),
      q('Según los estudios, ¿qué puede causar el uso excesivo?', 'ansiedad y problemas de autoestima', ['mejores notas', 'más amigos reales', 'menos estrés'], 'Second paragraph.'),
      q('¿Qué recomiendan los expertos?', 'verificar las fuentes', ['cerrar las cuentas', 'publicar más fotos', 'usar solo una red'], 'Third paragraph.'),
      q('¿Por qué se usa el subjuntivo en "no tenga"?', 'El antecedente es indefinido o inexistente.', ['Es una acción pasada.', 'Es un mandato.', 'Expresa certeza.'], '"Difícil encontrar a un adolescente que no tenga…"'),
      q('¿Cuál es la conclusión del autor?', 'Todo depende del uso; la clave es el equilibrio.', ['Las redes son peligrosas.', 'Las redes son perfectas.', 'Hay que prohibirlas a los jóvenes.'], 'Final paragraph.'),
    ],
    writing: { prompt: 'Ensayo argumentativo: ¿Deberían las escuelas prohibir los teléfonos celulares en clase? Presenta tu tesis, dos argumentos y un contraargumento.', minWords: 180 },
  },
  {
    id: 'dia-muertos', level: 'spanish-4', title: 'El Día de los Muertos', titleEn: 'Day of the Dead', genre: 'Texto cultural',
    paragraphs: [
      'El Día de los Muertos se celebra en México el 1 y el 2 de noviembre. Aunque su nombre pueda parecer triste, es una fiesta llena de color, música y alegría en la que las familias recuerdan a sus seres queridos que han muerto.',
      'Las familias preparan altares, llamados ofrendas, con fotos de los difuntos, velas, flores de cempasúchil y la comida favorita de cada persona. Se cree que el aroma de las flores y la luz de las velas guían a las almas de vuelta a casa.',
      'Uno de los símbolos más conocidos es la Catrina, una calavera elegante creada por el artista José Guadalupe Posada a principios del siglo XX. Con ella, Posada criticaba a las personas que imitaban la moda europea y se olvidaban de sus raíces.',
      'En 2008, la UNESCO declaró esta tradición Patrimonio Cultural Inmaterial de la Humanidad.',
    ],
    questions: [
      q('¿Cuándo se celebra el Día de los Muertos?', 'el 1 y el 2 de noviembre', ['el 31 de octubre', 'el 25 de diciembre', 'el 16 de septiembre'], 'First sentence.'),
      q('¿Cuál es el propósito de la fiesta?', 'recordar a los seres queridos que han muerto', ['asustar a los niños', 'celebrar la cosecha', 'honrar a los reyes'], 'First paragraph.'),
      q('¿Para qué sirven las flores y las velas?', 'para guiar a las almas', ['para decorar la calle', 'para vender en el mercado', 'para alejar a los espíritus'], 'Second paragraph.'),
      q('¿Qué criticaba Posada con la Catrina?', 'a quienes imitaban la moda europea', ['a los políticos corruptos', 'a los artistas extranjeros', 'la religión'], 'Third paragraph.'),
      q('¿Qué hizo la UNESCO en 2008?', 'la declaró Patrimonio Cultural Inmaterial', ['la prohibió', 'creó la Catrina', 'cambió la fecha'], 'Final sentence.'),
    ],
    writing: { prompt: 'Compara una celebración de tu cultura con el Día de los Muertos. ¿Qué tienen en común? ¿En qué se diferencian?', minWords: 180 },
  },
  {
    id: 'noticia-rescate', level: 'spanish-4', title: 'Rescatan a un perro atrapado en un pozo', titleEn: 'Dog rescued from a well', genre: 'Noticia',
    paragraphs: [
      'VALPARAÍSO, Chile — Un grupo de bomberos rescató ayer a un perro que había caído en un pozo de doce metros de profundidad en las afueras de la ciudad.',
      'Según los vecinos, el animal, llamado Toby, llevaba dos días desaparecido. Una niña de nueve años oyó los ladridos mientras jugaba cerca del pozo y avisó a sus padres, quienes llamaron inmediatamente a los bomberos.',
      'El rescate duró casi tres horas. "Ha sido una operación complicada porque el pozo es muy estrecho", explicó el capitán Rodrigo Fuentes. Finalmente, un bombero bajó con una cuerda y subió al perro en brazos.',
      'Toby está deshidratado pero sano. Su dueña, emocionada, dijo que nunca olvidaría a la niña que lo había encontrado.',
    ],
    questions: [
      q('¿Dónde ocurrió la noticia?', 'cerca de Valparaíso', ['en Santiago', 'en Lima', 'en Madrid'], 'Dateline.'),
      q('¿Cuánto tiempo llevaba Toby desaparecido?', 'dos días', ['tres horas', 'doce días', 'una semana'], 'Second paragraph.'),
      q('¿Quién encontró al perro?', 'una niña de nueve años', ['el capitán', 'la dueña', 'un vecino anciano'], 'Second paragraph.'),
      q('¿Por qué fue complicado el rescate?', 'El pozo era muy estrecho.', ['Llovía mucho.', 'El perro era agresivo.', 'Era de noche.'], 'The captain explains it.'),
      q('"Nunca olvidaría" is in which tense?', 'conditional', ['future', 'imperfect', 'preterite'], 'Reported speech: future → conditional.'),
    ],
    writing: { prompt: 'Escribe una noticia sobre un evento de tu comunidad. Responde a las preguntas ¿qué?, ¿quién?, ¿cuándo?, ¿dónde? y ¿por qué?, e incluye una cita.', minWords: 180 },
  },

  // ================================================================ Spanish 5
  {
    id: 'frida', level: 'spanish-5', title: 'Frida Kahlo: el dolor hecho arte', titleEn: 'Frida Kahlo: pain made into art', genre: 'Biografía',
    paragraphs: [
      'Frida Kahlo nació en 1907 en Coyoacán, en la Ciudad de México. A los seis años contrajo poliomielitis, lo que le dejó una pierna más delgada que la otra. Sin embargo, el acontecimiento que cambiaría su vida para siempre ocurrió en 1925, cuando el autobús en el que viajaba chocó contra un tranvía.',
      'Frida sufrió graves heridas y tuvo que permanecer en cama durante meses. Fue entonces cuando empezó a pintar. Su madre le instaló un espejo encima de la cama para que pudiera verse y usarse a sí misma como modelo. Por eso, muchos de sus cuadros son autorretratos.',
      '"Pinto autorretratos porque estoy mucho tiempo sola y porque soy el motivo que mejor conozco", escribió. En sus obras aparecen el dolor físico, su identidad mexicana, la naturaleza y su tormentosa relación con el muralista Diego Rivera.',
      'Aunque en vida fue conocida sobre todo como la esposa de Rivera, hoy Frida es un icono mundial. Si viviera, probablemente se sorprendería de ver su rostro en camisetas y tazas de todo el planeta.',
    ],
    questions: [
      q('¿Qué acontecimiento cambió la vida de Frida en 1925?', 'un accidente de autobús', ['su matrimonio', 'la poliomielitis', 'un viaje a París'], 'First paragraph.'),
      q('¿Por qué le instaló su madre un espejo?', 'para que pudiera pintarse a sí misma', ['para decorar el cuarto', 'para que se maquillara', 'para vigilarla'], 'Second paragraph.'),
      q('¿Por qué pintaba autorretratos, según ella?', 'Estaba sola y se conocía bien.', ['Era más barato.', 'Diego se lo pidió.', 'Quería ser famosa.'], 'The quotation.'),
      q('"Si viviera, se sorprendería" expresses…', 'a hypothetical situation', ['a past fact', 'a command', 'a certainty'], 'Si + imperfect subjunctive + conditional.'),
      q('¿Cómo ha cambiado la fama de Frida?', 'Hoy es más famosa que en vida.', ['Hoy la han olvidado.', 'Siempre fue más famosa que Rivera.', 'Solo es famosa en México.'], 'Final paragraph.'),
    ],
    writing: { prompt: 'Escribe la biografía breve de un artista, músico o escritor hispano. Incluye al menos tres verbos en imperfecto del subjuntivo o cláusulas con si.', minWords: 220 },
  },
  {
    id: 'teletrabajo', level: 'spanish-5', title: 'El teletrabajo llegó para quedarse', titleEn: 'Remote work is here to stay', genre: 'Artículo económico',
    paragraphs: [
      'Antes de 2020, pocas empresas latinoamericanas permitían que sus empleados trabajaran desde casa. La pandemia lo cambió todo: de un día para otro, millones de personas convirtieron la cocina o el dormitorio en su oficina.',
      'Para muchos trabajadores, las ventajas son claras: se ahorra el tiempo del transporte, se gasta menos dinero y se puede pasar más tiempo con la familia. Algunas empresas, además, han reducido sus gastos en alquiler de oficinas.',
      'Pero el teletrabajo también tiene su lado oscuro. Muchos empleados dicen que trabajan más horas que antes, porque resulta difícil separar la vida laboral de la personal. Otros echan de menos el contacto con sus compañeros.',
      'Por eso, varios países han aprobado leyes que garantizan el "derecho a la desconexión": fuera del horario laboral, el jefe no puede exigir que el empleado conteste mensajes. Para los expertos, el futuro será híbrido.',
    ],
    questions: [
      q('¿Qué cambió en 2020?', 'Millones empezaron a trabajar desde casa.', ['Se cerraron las empresas.', 'Bajaron los sueldos.', 'Se prohibió el teletrabajo.'], 'First paragraph.'),
      q('¿Qué ventaja NO se menciona?', 'un sueldo más alto', ['ahorrar tiempo de transporte', 'gastar menos dinero', 'más tiempo con la familia'], 'Salary is not mentioned.'),
      q('¿Cuál es un problema del teletrabajo?', 'Es difícil separar el trabajo de la vida personal.', ['No hay internet.', 'Las casas son pequeñas.', 'Los jefes no pagan.'], 'Third paragraph.'),
      q('¿Qué garantiza el "derecho a la desconexión"?', 'no contestar mensajes fuera del horario', ['trabajar desde cualquier país', 'vacaciones pagadas', 'internet gratis'], 'Fourth paragraph.'),
      q('"Echar de menos" means…', 'to miss', ['to throw away', 'to reduce', 'to forget'], 'Echar de menos = to miss someone.'),
    ],
    writing: { prompt: 'Si fueras presidente de una empresa, ¿permitirías el teletrabajo? Justifica tu respuesta usando cláusulas con si y el condicional.', minWords: 220 },
  },
  {
    id: 'microcuento', level: 'spanish-5', title: 'El último pasajero', titleEn: 'The last passenger', genre: 'Cuento breve',
    paragraphs: [
      'Era el último tren de la noche. Marta se sentó junto a la ventana y cerró los ojos; había sido un día interminable en la oficina. Cuando los abrió, el vagón estaba vacío, salvo por un anciano sentado frente a ella que la miraba con una sonrisa tranquila.',
      '—Usted se parece mucho a mi hija —le dijo—. Ella también volvía siempre tan cansada.',
      'Marta sonrió por cortesía. Hablaron de cosas sin importancia: el clima, la ciudad, los trenes que ya no eran como antes. En la estación siguiente, el anciano se levantó, se puso el sombrero y le dijo: —Cuide a su padre, señorita. Uno nunca sabe cuánto tiempo le queda.',
      'Esa noche, por primera vez en meses, Marta llamó a su padre. Nunca supo quién era aquel hombre, ni por qué, cuando le preguntó al conductor, este le aseguró que nadie más había subido al tren.',
    ],
    questions: [
      q('¿Cómo se sentía Marta al subir al tren?', 'agotada', ['emocionada', 'asustada', 'enojada'], '"Había sido un día interminable."'),
      q('¿A quién se parecía Marta, según el anciano?', 'a su hija', ['a su esposa', 'a su madre', 'a una actriz'], 'He says so directly.'),
      q('¿Qué consejo le dio el anciano?', 'que cuidara a su padre', ['que cambiara de trabajo', 'que durmiera más', 'que tomara otro tren'], 'His final words.'),
      q('¿Qué efecto tiene el final del cuento?', 'Sugiere que el anciano no era real.', ['Explica quién era el anciano.', 'Es cómico.', 'Revela que Marta soñaba con un viaje.'], 'The conductor says no one else boarded.'),
      q('What literary technique ends the story?', 'an ambiguous twist', ['a flashback', 'a moral stated directly', 'a happy wedding'], 'The ending is open and surprising.'),
    ],
    writing: { prompt: 'Escribe un microcuento (máximo 300 palabras) con un final sorprendente. Usa el pretérito, el imperfecto y el pluscuamperfecto.', minWords: 200 },
  },

  // ================================================================ Spanish 6
  {
    id: 'independencias', level: 'spanish-6', title: 'Las independencias latinoamericanas', titleEn: 'Latin American independence', genre: 'Texto histórico',
    paragraphs: [
      'A comienzos del siglo XIX, la mayor parte de América Latina seguía bajo el dominio de España. Sin embargo, las ideas de la Ilustración, el ejemplo de la independencia de los Estados Unidos y la Revolución francesa habían sembrado el deseo de libertad entre los criollos, los descendientes de españoles nacidos en América.',
      'La ocasión llegó en 1808, cuando Napoleón invadió España y obligó al rey Fernando VII a abdicar. Sin un rey legítimo, muchas ciudades americanas formaron juntas de gobierno que, con el tiempo, proclamaron la independencia.',
      'Líderes como Simón Bolívar en el norte y José de San Martín en el sur encabezaron largas guerras. Para 1825, casi toda la América continental española se había independizado. Solo Cuba y Puerto Rico permanecerían bajo el control español hasta 1898.',
      'No obstante, la independencia no trajo la igualdad que muchos habían soñado. Las élites criollas sustituyeron a las españolas, y los pueblos indígenas y afrodescendientes siguieron marginados durante generaciones.',
    ],
    questions: [
      q('¿Quiénes eran los criollos?', 'descendientes de españoles nacidos en América', ['indígenas', 'soldados franceses', 'esclavos africanos'], 'Defined in the first paragraph.'),
      q('¿Qué acontecimiento de 1808 fue decisivo?', 'la invasión de España por Napoleón', ['la muerte de Bolívar', 'la independencia de Cuba', 'la Revolución francesa'], 'Second paragraph.'),
      q('¿Qué territorios siguieron siendo españoles hasta 1898?', 'Cuba y Puerto Rico', ['México y Perú', 'Chile y Argentina', 'Venezuela y Colombia'], 'Third paragraph.'),
      q('"Se había independizado" is in the…', 'pluperfect', ['preterite', 'present perfect', 'future perfect'], 'Había + participle.'),
      q('¿Cuál es la crítica del último párrafo?', 'La independencia no trajo igualdad para todos.', ['Las guerras fueron cortas.', 'España era un buen gobierno.', 'Bolívar fracasó.'], 'Final paragraph.'),
    ],
    writing: { prompt: '¿Crees que la independencia política basta para que un país sea libre? Escribe un ensayo con ejemplos históricos, usando tiempos compuestos y conectores.', minWords: 250 },
  },
  {
    id: 'democracia-joven', level: 'spanish-6', title: '¿Votar a los dieciséis?', titleEn: 'Voting at sixteen?', genre: 'Debate',
    paragraphs: [
      'En países como Argentina, Brasil y Ecuador, los jóvenes pueden votar a partir de los dieciséis años. En otros, el debate sigue abierto. ¿Deberían los adolescentes participar en las elecciones?',
      'Los defensores sostienen que muchas decisiones políticas, como las relacionadas con la educación o el cambio climático, afectan directamente a los jóvenes, y que es injusto que no puedan opinar. Añaden que, cuanto antes se empiece a votar, más probable es que se mantenga ese hábito durante toda la vida.',
      'Los críticos, en cambio, argumentan que a esa edad muchos jóvenes todavía no tienen la madurez necesaria y que podrían ser fácilmente influenciados por sus padres o por las redes sociales.',
      'Los estudios realizados en Austria, donde se aprobó el voto a los dieciséis en 2007, sugieren que los jóvenes votantes no toman decisiones menos informadas que los adultos. Aun así, la participación depende mucho de que la escuela ofrezca una buena educación cívica.',
    ],
    questions: [
      q('¿En qué país NO se menciona el voto a los dieciséis?', 'México', ['Argentina', 'Brasil', 'Ecuador'], 'Mexico is not listed.'),
      q('¿Qué argumento dan los defensores?', 'Las decisiones políticas afectan a los jóvenes.', ['Los jóvenes saben más que los adultos.', 'Votar es obligatorio.', 'Los padres lo prefieren.'], 'Second paragraph.'),
      q('¿Qué temen los críticos?', 'que los jóvenes sean influenciados fácilmente', ['que voten demasiado', 'que las elecciones sean caras', 'que no haya candidatos'], 'Third paragraph.'),
      q('¿Qué sugieren los estudios de Austria?', 'Los jóvenes no deciden peor que los adultos.', ['Los jóvenes no votan.', 'El experimento fracasó.', 'Los adultos votan menos.'], 'Fourth paragraph.'),
      q('"Cuanto antes se empiece, más probable es…" expresses…', 'a proportional relationship', ['a condition contrary to fact', 'a command', 'a concession'], 'Cuanto… más = the sooner… the more.'),
    ],
    writing: { prompt: 'Escribe un discurso a favor o en contra del voto a los dieciséis años. Incluye una introducción, tres argumentos, una refutación y una conclusión.', minWords: 250 },
  },
  {
    id: 'ciencia-etica', level: 'spanish-6', title: 'Editar genes: ¿curar o diseñar?', titleEn: 'Editing genes: cure or design?', genre: 'Divulgación científica',
    paragraphs: [
      'La técnica CRISPR permite modificar el ADN con una precisión que hace solo veinte años habría parecido ciencia ficción. Gracias a ella, los investigadores han logrado corregir en el laboratorio mutaciones responsables de enfermedades como la anemia falciforme.',
      'Los beneficios potenciales son enormes. No obstante, la misma herramienta que podría curar enfermedades hereditarias también podría utilizarse para elegir rasgos como la estatura o el color de ojos de un bebé.',
      'Muchos bioéticos temen que, si no se establecen límites claros, surja una sociedad dividida entre quienes puedan pagar "mejoras" genéticas y quienes no. Otros señalan que las modificaciones en embriones se heredarían a las generaciones futuras, que no han dado su consentimiento.',
      'Por ahora, la mayoría de los países prohíbe editar embriones con fines reproductivos. La pregunta, sin embargo, ya no es si la tecnología es posible, sino cómo decidiremos usarla.',
    ],
    questions: [
      q('¿Qué permite la técnica CRISPR?', 'modificar el ADN con precisión', ['clonar animales', 'leer la mente', 'fabricar vacunas'], 'First sentence.'),
      q('¿Qué enfermedad se menciona como ejemplo?', 'la anemia falciforme', ['la diabetes', 'el cáncer de piel', 'la gripe'], 'First paragraph.'),
      q('¿Qué temen muchos bioéticos?', 'una sociedad dividida por el dinero', ['que la técnica no funcione', 'que sea demasiado barata', 'que la prohíban'], 'Third paragraph.'),
      q('¿Por qué la edición de embriones plantea un problema de consentimiento?', 'Los cambios se heredan a generaciones futuras.', ['Los médicos no lo saben hacer.', 'Es ilegal en todos los países.', 'Es muy dolorosa.'], 'Third paragraph.'),
      q('¿Cuál es la idea central de la conclusión?', 'La cuestión ya es cómo usar la tecnología.', ['La tecnología es imposible.', 'Hay que prohibir la ciencia.', 'CRISPR es peligroso siempre.'], 'Final sentence.'),
    ],
    writing: { prompt: '¿Dónde pondrías tú el límite de la edición genética? Escribe un ensayo argumentativo con al menos dos fuentes o ejemplos.', minWords: 250 },
  },

  // ================================================================ AP Spanish
  {
    id: 'ap-bilinguismo', level: 'ap-spanish', title: 'Crecer entre dos lenguas', titleEn: 'Growing up between two languages', genre: 'Artículo (Tema: Identidades personales y públicas)',
    paragraphs: [
      'Según datos recientes, más de cuarenta millones de personas en Estados Unidos hablan español en casa. Para muchos hijos de inmigrantes, crecer entre dos lenguas es a la vez un privilegio y un desafío.',
      'Numerosas investigaciones indican que el bilingüismo ofrece ventajas cognitivas: las personas bilingües suelen tener más facilidad para concentrarse, resolver problemas y cambiar de una tarea a otra. Además, dominar dos idiomas amplía las oportunidades laborales.',
      'Sin embargo, muchos jóvenes cuentan que se sienten "ni de aquí ni de allá": en la escuela los consideran extranjeros y, cuando visitan el país de sus padres, los critican por su acento o por mezclar palabras en inglés. Este fenómeno, conocido como inseguridad lingüística, lleva a algunos a abandonar el español.',
      'Para contrarrestarlo, cada vez más escuelas ofrecen programas de inmersión dual, en los que los estudiantes aprenden en ambos idiomas. Sus defensores afirman que, lejos de ser un obstáculo, la lengua materna es un puente entre generaciones.',
    ],
    questions: [
      q('¿Cuál es el propósito principal del artículo?', 'presentar las ventajas y los desafíos del bilingüismo', ['convencer a los inmigrantes de no hablar español', 'explicar la gramática española', 'criticar las escuelas'], 'The article balances benefits and challenges.'),
      q('Según el texto, ¿qué ventaja cognitiva tienen los bilingües?', 'facilidad para cambiar de tarea', ['mejor memoria visual', 'más fuerza física', 'mejor oído musical'], 'Second paragraph.'),
      q('¿Qué significa "ni de aquí ni de allá"?', 'no sentirse parte de ninguna de las dos culturas', ['viajar mucho', 'no tener casa', 'hablar tres idiomas'], 'Third paragraph.'),
      q('¿Qué es la inseguridad lingüística, según el contexto?', 'la falta de confianza al usar una lengua', ['un examen de idiomas', 'una ley escolar', 'un acento regional'], 'It leads some to abandon Spanish.'),
      q('¿Qué función tiene la última frase?', 'presentar la lengua materna como un valor', ['introducir un nuevo problema', 'contradecir el resto del texto', 'dar una estadística'], '"Un puente entre generaciones."'),
    ],
    writing: { prompt: 'Ensayo persuasivo (AP): ¿Deberían todas las escuelas ofrecer programas de inmersión dual? Usa información del texto y tu propia experiencia. Escribe en un registro formal.', minWords: 300 },
  },
  {
    id: 'ap-agua', level: 'ap-spanish', title: 'La crisis del agua en Ciudad de México', titleEn: 'Mexico City’s water crisis', genre: 'Reportaje (Tema: Desafíos mundiales)',
    paragraphs: [
      'Resulta paradójico: Ciudad de México se construyó sobre un antiguo lago y, sin embargo, hoy sufre una grave escasez de agua. En algunos barrios, los vecinos reciben agua por la tubería solo unas horas a la semana y dependen de camiones cisterna, conocidos como "pipas".',
      'Las causas son múltiples. La ciudad extrae del subsuelo más agua de la que se recarga naturalmente, lo cual provoca que el suelo se hunda hasta veinte centímetros al año en algunas zonas. A esto se suma que casi el cuarenta por ciento del agua se pierde por fugas en una red de tuberías envejecida.',
      'El cambio climático agrava la situación: las sequías son más largas y las lluvias, cuando llegan, caen de forma torrencial y provocan inundaciones en lugar de recargar los acuíferos.',
      'Algunas iniciativas ofrecen esperanza. Varias organizaciones instalan sistemas de captación de agua de lluvia en viviendas y escuelas, y el gobierno ha prometido invertir en reparar las fugas. Los expertos coinciden, no obstante, en que ninguna solución funcionará a menos que los ciudadanos también reduzcan su consumo.',
    ],
    questions: [
      q('¿Por qué la situación es "paradójica"?', 'La ciudad se construyó sobre un lago pero le falta agua.', ['Llueve poco pero hay mucha agua.', 'El agua es gratis pero nadie la usa.', 'Hay muchos ríos pero no hay tuberías.'], 'First paragraph.'),
      q('¿Qué consecuencia tiene la extracción excesiva de agua?', 'El suelo se hunde.', ['Aumentan las lluvias.', 'Se crean nuevos lagos.', 'Mejora la calidad del agua.'], 'Second paragraph.'),
      q('¿Qué porcentaje del agua se pierde por fugas?', 'casi el cuarenta por ciento', ['el veinte por ciento', 'la mitad', 'el diez por ciento'], 'Second paragraph.'),
      q('Según el texto, ¿cómo afecta el cambio climático?', 'Sequías más largas y lluvias torrenciales', ['Temperaturas más bajas', 'Menos inundaciones', 'Más nieve'], 'Third paragraph.'),
      q('La frase "a menos que los ciudadanos también reduzcan su consumo" sugiere que…', 'la responsabilidad es compartida', ['el gobierno no debe hacer nada', 'el problema ya está resuelto', 'los ciudadanos no tienen culpa'], 'Final sentence.'),
    ],
    writing: { prompt: 'Presentación escrita (AP): Compara la situación del agua en Ciudad de México con la de tu comunidad. ¿Qué medidas propondrías? Organiza tu respuesta con una introducción, un desarrollo y una conclusión.', minWords: 300 },
  },
  {
    id: 'ap-arte-urbano', level: 'ap-spanish', title: 'El arte urbano: ¿vandalismo o patrimonio?', titleEn: 'Street art: vandalism or heritage?', genre: 'Columna de opinión (Tema: La belleza y la estética)',
    paragraphs: [
      'Hace veinte años, los grafitis que cubrían las paredes de Valparaíso eran vistos por muchos como un problema de vandalismo. Hoy, esos mismos murales atraen a miles de turistas y aparecen en las guías de viaje como una de las principales atracciones de la ciudad.',
      'Esta transformación no es exclusiva de Chile. En Bogotá, Buenos Aires o Ciudad de México, el arte urbano se ha convertido en una forma de expresión política y social que da voz a comunidades que rara vez aparecen en los museos.',
      'No obstante, el éxito ha traído nuevos dilemas. En algunos barrios, los murales han aumentado el valor de las propiedades, y los vecinos de toda la vida ya no pueden pagar el alquiler. ¿Es justo que el arte creado por una comunidad termine expulsándola?',
      'Personalmente, considero que el arte urbano merece protección, pero también que las ciudades deberían garantizar que sus beneficios lleguen a quienes lo hicieron posible.',
    ],
    questions: [
      q('¿Cómo ha cambiado la percepción de los grafitis en Valparaíso?', 'De vandalismo a atracción turística', ['De arte a vandalismo', 'No ha cambiado', 'Ahora están prohibidos'], 'First paragraph.'),
      q('Según el autor, ¿qué función social tiene el arte urbano?', 'dar voz a comunidades poco representadas', ['decorar los museos', 'vender propiedades', 'atraer inversiones extranjeras'], 'Second paragraph.'),
      q('¿Qué dilema ha surgido?', 'la subida de los alquileres expulsa a los vecinos', ['los turistas destruyen los murales', 'los artistas no quieren pintar', 'la policía borra los murales'], 'Third paragraph.'),
      q('¿Qué recurso usa el autor en "¿Es justo que…?"', 'una pregunta retórica', ['una estadística', 'una cita', 'una definición'], 'It invites reflection, not an answer.'),
      q('¿Cuál es la postura final del autor?', 'Proteger el arte y que beneficie a la comunidad', ['Prohibir el arte urbano', 'Convertir los barrios en museos', 'Cobrar a los turistas'], 'Final paragraph.'),
    ],
    writing: { prompt: 'Respuesta a un correo (AP): Un concejal de tu ciudad te escribe preguntando si la ciudad debería financiar murales en las escuelas. Responde con un saludo formal, contesta sus preguntas, pide más detalles y despídete.', minWords: 200 },
  },

  // ================================================================ College
  {
    id: 'col-borges', level: 'college-spanish', title: 'El laberinto como metáfora en Borges', titleEn: 'The labyrinth as metaphor in Borges', genre: 'Ensayo crítico',
    paragraphs: [
      'Pocos símbolos recorren la obra de Jorge Luis Borges con tanta insistencia como el laberinto. En cuentos como "El jardín de senderos que se bifurcan" o "La casa de Asterión", el laberinto deja de ser un mero espacio físico para convertirse en una representación del universo, del tiempo y de la propia mente humana.',
      'En "La casa de Asterión", Borges reescribe el mito del Minotauro desde la perspectiva del monstruo. El lector descubre, casi al final, que el narrador solitario que describe su casa infinita es la criatura a la que Teseo dará muerte. El efecto es doble: por un lado, humaniza al monstruo; por otro, obliga al lector a cuestionar la fiabilidad de todo narrador.',
      '"El jardín de senderos que se bifurcan", en cambio, propone un laberinto temporal: una novela en la que todas las posibilidades ocurren simultáneamente. Se ha señalado a menudo que esta idea anticipa, de manera intuitiva, ciertas interpretaciones de la física cuántica sobre los mundos posibles.',
      'Cabe preguntarse, pues, si el laberinto borgiano es una prisión o una forma de libertad. Quizá la respuesta resida en la ambigüedad misma: perderse en el laberinto es, para Borges, la condición inevitable de quien piensa.',
    ],
    questions: [
      q('Según el ensayo, ¿qué representa el laberinto en Borges?', 'el universo, el tiempo y la mente', ['la ciudad de Buenos Aires', 'la violencia política', 'la naturaleza'], 'First paragraph.'),
      q('¿Qué recurso narrativo emplea "La casa de Asterión"?', 'la revelación tardía de la identidad del narrador', ['la narración en segunda persona', 'el diálogo teatral', 'la estructura epistolar'], 'Second paragraph.'),
      q('¿Qué doble efecto se atribuye a ese recurso?', 'humanizar al monstruo y cuestionar al narrador', ['divertir y enseñar', 'criticar a Teseo y a Grecia', 'anticipar la física cuántica'], 'Second paragraph.'),
      q('¿Qué tipo de laberinto propone "El jardín de senderos que se bifurcan"?', 'temporal', ['físico', 'político', 'religioso'], 'Third paragraph.'),
      q('¿Cuál es la conclusión del ensayista?', 'La ambigüedad del laberinto es la respuesta.', ['El laberinto es solo una prisión.', 'Borges no sabía qué significaba.', 'El laberinto es un tema menor.'], 'Final paragraph.'),
    ],
    writing: { prompt: 'Ensayo crítico: Analiza un símbolo recurrente en la obra de un autor hispano que conozcas. Plantea una tesis, apóyala con citas o ejemplos y matiza tu argumento con un contraargumento.', minWords: 400 },
  },
  {
    id: 'col-lenguas-indigenas', level: 'college-spanish', title: 'Lenguas originarias y políticas lingüísticas', titleEn: 'Indigenous languages and language policy', genre: 'Artículo académico',
    paragraphs: [
      'América Latina alberga más de quinientas lenguas originarias, muchas de ellas en peligro de extinción. Aunque varias constituciones, como la de Bolivia (2009), reconocen oficialmente decenas de idiomas indígenas, la brecha entre el reconocimiento legal y la vitalidad real de estas lenguas sigue siendo considerable.',
      'Los sociolingüistas coinciden en que la transmisión intergeneracional constituye el factor decisivo: una lengua que deja de enseñarse a los niños en el hogar tiene, por lo general, sus días contados. Dicha interrupción suele obedecer a la discriminación histórica, que llevó a numerosas familias a percibir el español como la única vía de movilidad social.',
      'Frente a esta situación, han surgido iniciativas de revitalización de diversa índole: la educación intercultural bilingüe, la producción de contenidos digitales —desde diccionarios en línea hasta música urbana en quechua o mapudungun— y la formación de docentes hablantes.',
      'Ahora bien, algunos investigadores advierten que ninguna política será eficaz a menos que se aborden las condiciones materiales de las comunidades. Dicho de otro modo, la revitalización lingüística no puede desligarse de la justicia social.',
    ],
    questions: [
      q('¿Qué contraste señala el primer párrafo?', 'entre el reconocimiento legal y la vitalidad real', ['entre Bolivia y Perú', 'entre el español y el inglés', 'entre lo oral y lo escrito'], 'First paragraph.'),
      q('Según los sociolingüistas, ¿cuál es el factor decisivo para la supervivencia de una lengua?', 'la transmisión intergeneracional', ['el reconocimiento constitucional', 'la cantidad de diccionarios', 'el turismo cultural'], 'Second paragraph.'),
      q('¿Qué causa se atribuye a la interrupción de la transmisión?', 'la discriminación histórica', ['la falta de gramáticas', 'la migración a Europa', 'el cambio climático'], 'Second paragraph.'),
      q('¿Qué función cumple "Dicho de otro modo" en el último párrafo?', 'reformular una idea', ['introducir un ejemplo', 'expresar contraste', 'indicar causa'], 'Reformulation marker.'),
      q('¿Cuál es la tesis final del artículo?', 'La revitalización lingüística está ligada a la justicia social.', ['Las lenguas indígenas desaparecerán inevitablemente.', 'Basta con la educación bilingüe.', 'Las constituciones resuelven el problema.'], 'Final sentence.'),
    ],
    writing: { prompt: 'Redacta un ensayo académico sobre una política lingüística (de cualquier país). Evalúa sus logros y limitaciones, emplea conectores del discurso y cita al menos una fuente.', minWords: 400 },
  },
  {
    id: 'col-cronica', level: 'college-spanish', title: 'Crónica de un mercado que se niega a morir', titleEn: 'Chronicle of a market that refuses to die', genre: 'Crónica periodística',
    paragraphs: [
      'A las cinco de la mañana, cuando la ciudad todavía bosteza, el mercado de San Telmo ya huele a pan recién horneado y a café quemado. Doña Aurora, ochenta y dos años y las manos curtidas por el frío, acomoda sus tomates en pirámides perfectas, como lo ha hecho desde que Perón era presidente.',
      '—Antes esto se llenaba —me dice sin dejar de trabajar—. Ahora la gente compra todo por el teléfono.',
      'Y, sin embargo, el mercado resiste. Entre los puestos de toda la vida han aparecido cafeterías de especialidad, una librería de viejo y un puesto de comida peruana que atrae a los jóvenes del barrio. La convivencia no siempre es armoniosa: algunos vendedores veteranos se quejan de que los recién llegados "vienen a vender la foto, no la fruta".',
      'Cuando me despido, doña Aurora me regala un tomate. "Para que no te olvides de que el sabor no se descarga", me dice, y se ríe con los ojos. Salgo pensando que quizá la supervivencia del mercado no dependa de la nostalgia, sino de su capacidad —tan humana— de transformarse sin dejar de ser el mismo.',
    ],
    questions: [
      q('¿Qué recurso predomina en el primer párrafo?', 'la descripción sensorial', ['la estadística', 'el diálogo', 'la argumentación'], 'Smells, textures, images.'),
      q('¿Qué indica "desde que Perón era presidente"?', 'que doña Aurora lleva décadas en el mercado', ['que es política', 'que el mercado es nuevo', 'que vende en el gobierno'], 'It marks a long time span.'),
      q('¿Qué critican los vendedores veteranos?', 'que los nuevos priorizan la imagen sobre el producto', ['los precios bajos', 'la comida peruana', 'la falta de clientes jóvenes'], '"Vender la foto, no la fruta."'),
      q('¿Qué significa "el sabor no se descarga"?', 'Algunas experiencias no pueden digitalizarse.', ['Los tomates son caros.', 'No hay internet en el mercado.', 'La fruta se echa a perder.'], 'A contrast with online shopping.'),
      q('¿Qué rasgo del género crónica muestra el texto?', 'la mezcla de información y voz personal del autor', ['la ausencia total del narrador', 'el lenguaje exclusivamente técnico', 'la estructura de carta formal'], 'The chronicler narrates in first person.'),
    ],
    writing: { prompt: 'Escribe una crónica sobre un lugar de tu comunidad (un mercado, una plaza, un café). Combina descripción sensorial, diálogo y reflexión personal.', minWords: 400 },
  },
];

export function readingById(id: string): Reading | undefined {
  return READINGS.find((r) => r.id === id);
}

export function readingsForLevel(level: LevelId): Reading[] {
  return READINGS.filter((r) => r.level === level);
}
