/**
 * Hand-written grammar questions, three topics per level, ten each.
 *
 * Authored as (prompt, correct, [wrong x3], why). The correct answer is always
 * written first here and shuffled deterministically when a quiz is built, so a
 * reviewer can check a question by reading one line.
 */
import type { LevelId } from './levels.ts';

export type GrammarQ = {
  prompt: string;
  correct: string;
  wrong: readonly [string, string, string];
  why: string;
};

export type GrammarTopic = {
  id: string;
  level: LevelId;
  title: string;
  titleEn: string;
  questions: readonly GrammarQ[];
};

const q = (prompt: string, correct: string, wrong: [string, string, string], why: string): GrammarQ =>
  ({ prompt, correct, wrong, why });

export const GRAMMAR: readonly GrammarTopic[] = [
  // ================================================================ Spanish 1
  { id: 'ser-estar-1', level: 'spanish-1', title: 'Ser y estar', titleEn: 'Ser vs. estar', questions: [
    q('Mi hermana ___ alta.', 'es', ['está', 'son', 'estoy'], 'Physical description is a characteristic: ser.'),
    q('Nosotros ___ en la clase de español.', 'estamos', ['somos', 'están', 'son'], 'Location of people and things uses estar.'),
    q('Yo ___ de México.', 'soy', ['estoy', 'es', 'está'], 'Origin uses ser.'),
    q('¿Cómo ___ tú hoy?', 'estás', ['eres', 'es', 'está'], 'How someone feels today is a condition: estar.'),
    q('Ellos ___ estudiantes.', 'son', ['están', 'es', 'somos'], 'Profession or identity uses ser.'),
    q('La sopa ___ fría.', 'está', ['es', 'son', 'estoy'], 'A temporary state of the soup: estar.'),
    q('Hoy ___ lunes.', 'es', ['está', 'son', 'estamos'], 'Days and dates use ser.'),
    q('Mis padres ___ cansados.', 'están', ['son', 'es', 'estamos'], 'Tired is a condition: estar.'),
    q('La fiesta ___ a las ocho.', 'es', ['está', 'son', 'estás'], 'The time of an event uses ser.'),
    q('¿Dónde ___ el baño?', 'está', ['es', 'son', 'estoy'], 'Location of a thing uses estar.'),
  ] },
  { id: 'articulos-1', level: 'spanish-1', title: 'Artículos y género', titleEn: 'Articles, gender and number', questions: [
    q('___ libro es interesante.', 'El', ['La', 'Los', 'Las'], 'Libro is masculine singular.'),
    q('___ mesas son grandes.', 'Las', ['Los', 'La', 'El'], 'Mesas is feminine plural.'),
    q('Tengo ___ gato negro.', 'un', ['una', 'unos', 'unas'], 'Gato is masculine singular: un.'),
    q('Necesito ___ manzanas.', 'unas', ['unos', 'una', 'un'], 'Manzanas is feminine plural: unas.'),
    q('___ agua está fría.', 'El', ['La', 'Los', 'Las'], 'Agua is feminine but takes el because it begins with a stressed a-.'),
    q('The plural of "el lápiz" is…', 'los lápices', ['los lápizes', 'las lápices', 'los lápiz'], 'Z changes to c before -es.'),
    q('___ problema es difícil.', 'El', ['La', 'Los', 'Las'], 'Problema is masculine despite ending in -a.'),
    q('___ mano derecha.', 'La', ['El', 'Los', 'Las'], 'Mano is feminine despite ending in -o.'),
    q('The plural of "la ciudad" is…', 'las ciudades', ['las ciudads', 'los ciudades', 'las ciudaes'], 'Nouns ending in a consonant add -es.'),
    q('___ días son largos.', 'Los', ['Las', 'El', 'La'], 'Día is masculine.'),
  ] },
  { id: 'adjetivos-gustar-1', level: 'spanish-1', title: 'Adjetivos y gustar', titleEn: 'Adjective agreement and gustar', questions: [
    q('Las casas son ___.', 'blancas', ['blanco', 'blancos', 'blanca'], 'Adjectives agree in gender and number: feminine plural.'),
    q('Los chicos son ___.', 'simpáticos', ['simpática', 'simpático', 'simpáticas'], 'Masculine plural.'),
    q('Mi amiga es muy ___.', 'inteligente', ['inteligentes', 'inteligenta', 'inteligentos'], 'Adjectives ending in -e only change for number.'),
    q('A mí me ___ el chocolate.', 'gusta', ['gustan', 'gusto', 'gustas'], 'One thing liked: gusta.'),
    q('A ella le ___ los perros.', 'gustan', ['gusta', 'gusto', 'gustamos'], 'Plural thing liked: gustan.'),
    q('¿A ti te gusta ___?', 'bailar', ['bailas', 'baila', 'bailo'], 'Gustar + infinitive.'),
    q('A nosotros ___ gusta la música.', 'nos', ['les', 'me', 'os'], 'Nosotros takes nos.'),
    q('A mis padres ___ gustan las películas.', 'les', ['le', 'nos', 'se'], 'Ellos/ellas takes les.'),
    q('Tengo dos camisas ___.', 'azules', ['azul', 'azula', 'azulos'], 'Azul adds -es in the plural.'),
    q('Es una ___ idea.', 'buena', ['bueno', 'buen', 'buenas'], 'Idea is feminine singular.'),
  ] },

  // ================================================================ Spanish 2
  { id: 'reflexivos-2', level: 'spanish-2', title: 'Verbos reflexivos', titleEn: 'Reflexive verbs', questions: [
    q('Yo ___ levanto a las siete.', 'me', ['te', 'se', 'nos'], 'Yo takes me.'),
    q('Mis hermanos ___ acuestan tarde.', 'se', ['me', 'nos', 'te'], 'Ellos takes se.'),
    q('¿A qué hora ___ duchas tú?', 'te', ['se', 'me', 'os'], 'Tú takes te.'),
    q('Nosotros ___ vestimos rápido.', 'nos', ['se', 'os', 'me'], 'Nosotros takes nos.'),
    q('Ella se ___ el pelo.', 'lava', ['lavo', 'lavas', 'lavan'], 'Ella: third person singular.'),
    q('Voy a ___ ahora.', 'ducharme', ['me duchar', 'ducharse me', 'duchar'], 'The pronoun attaches to the infinitive.'),
    q('Los niños ___ despiertan temprano.', 'se', ['nos', 'le', 'los'], 'Ellos takes se.'),
    q('Choose the correct sentence.', 'Me cepillo los dientes.', ['Me cepillo mis dientes.', 'Cepillo me los dientes.', 'Se cepillo los dientes.'], 'Spanish uses the article, not a possessive, with body parts.'),
    q('Tú ___ muy elegante hoy. (vestirse)', 'te vistes', ['te vestes', 'se viste', 'te visten'], 'Vestir is e>i in the present: te vistes.'),
    q('Ayer yo ___ a las diez. (acostarse)', 'me acosté', ['me acostó', 'me acuesto', 'se acostó'], 'Preterite yo form.'),
  ] },
  { id: 'pronombres-2', level: 'spanish-2', title: 'Pronombres de objeto', titleEn: 'Object pronouns', questions: [
    q('¿Tienes el libro? Sí, ___ tengo.', 'lo', ['la', 'le', 'los'], 'El libro: masculine singular direct object.'),
    q('¿Compraste las flores? Sí, ___ compré.', 'las', ['los', 'la', 'les'], 'Las flores: feminine plural.'),
    q('___ escribo una carta a mi abuela.', 'Le', ['La', 'Lo', 'Les'], 'Indirect object (to her): le.'),
    q('¿Me das el lápiz? Sí, ___ doy.', 'te lo', ['le lo', 'se lo', 'me lo'], 'Indirect te + direct lo.'),
    q('Le di el regalo a Juan. → ___ di.', 'Se lo', ['Le lo', 'Lo le', 'Se la'], 'Le becomes se before lo.'),
    q('Voy a comprar ___. (the shoes)', 'los', ['las', 'les', 'lo'], 'Los zapatos: masculine plural.'),
    q('Nuestros padres ___ dan dinero. (to us)', 'nos', ['les', 'os', 'se'], 'To us: nos.'),
    q('¡Cómpra___! (buy it — la camisa)', 'la', ['lo', 'le', 'las'], 'Pronouns attach to affirmative commands.'),
    q('¿Quién ___ llamó a ti?', 'te', ['le', 'me', 'se'], 'A ti: te.'),
    q('Ella ___ explicó la lección a los estudiantes.', 'les', ['los', 'le', 'las'], 'To them (indirect): les.'),
  ] },
  { id: 'pret-imp-2', level: 'spanish-2', title: 'Pretérito e imperfecto', titleEn: 'Preterite vs. imperfect', questions: [
    q('Cuando era niño, ___ al parque todos los días.', 'iba', ['fui', 'voy', 'iré'], 'Habitual past action: imperfect.'),
    q('Ayer ___ una película muy buena.', 'vi', ['veía', 'veo', 'vería'], 'A completed action at a specific time: preterite.'),
    q('___ las tres de la tarde cuando llegaste.', 'Eran', ['Fueron', 'Son', 'Serán'], 'Telling time in the past: imperfect.'),
    q('Mientras yo estudiaba, mi hermano ___ la televisión.', 'miraba', ['miró', 'mira', 'mirará'], 'Two ongoing actions: imperfect.'),
    q('Yo leía cuando el teléfono ___.', 'sonó', ['sonaba', 'suena', 'sonará'], 'An interrupting action: preterite.'),
    q('La casa ___ grande y bonita.', 'era', ['fue', 'es', 'sería'], 'Description in the past: imperfect.'),
    q('El año pasado ___ a España.', 'viajamos', ['viajábamos', 'viajaremos', 'viajaríamos'], 'A single completed trip: preterite.'),
    q('De niña, mi madre siempre ___ canciones.', 'cantaba', ['cantó', 'canta', 'cantaría'], '"Siempre" signals a habit: imperfect.'),
    q('De repente, ___ a llover.', 'empezó', ['empezaba', 'empieza', 'empezará'], '"De repente" marks a sudden event: preterite.'),
    q('Yo ___ diez años cuando nos mudamos.', 'tenía', ['tuve', 'tengo', 'tendré'], 'Age in the past: imperfect.'),
  ] },

  // ================================================================ Spanish 3
  { id: 'por-para-3', level: 'spanish-3', title: 'Por y para', titleEn: 'Por vs. para', questions: [
    q('Este regalo es ___ ti.', 'para', ['por', 'de', 'con'], 'Recipient: para.'),
    q('Caminamos ___ el parque.', 'por', ['para', 'a', 'en'], 'Movement through a place: por.'),
    q('Estudio ___ ser médico.', 'para', ['por', 'a', 'de'], 'Purpose or goal: para.'),
    q('Gracias ___ tu ayuda.', 'por', ['para', 'a', 'de'], 'Gracias por: in exchange for.'),
    q('Salimos ___ Madrid mañana.', 'para', ['por', 'en', 'de'], 'Destination: para.'),
    q('Pagué veinte dólares ___ la camisa.', 'por', ['para', 'a', 'en'], 'Exchange: por.'),
    q('La tarea es ___ el lunes.', 'para', ['por', 'en', 'a'], 'Deadline: para.'),
    q('Hablé con ella ___ teléfono.', 'por', ['para', 'en', 'con'], 'Means of communication: por.'),
    q('Estuve en Chile ___ tres semanas.', 'por', ['para', 'en', 'desde'], 'Duration: por (or no preposition).'),
    q('___ una niña de seis años, lee muy bien.', 'Para', ['Por', 'Con', 'De'], 'Comparison against a standard: para.'),
  ] },
  { id: 'mandatos-3', level: 'spanish-3', title: 'Los mandatos', titleEn: 'Commands', questions: [
    q('(tú, hablar) ¡___ más despacio!', 'Habla', ['Hablas', 'Hable', 'Hablad'], 'Affirmative tú command = 3rd person present.'),
    q('(tú, poner) ¡___ la mesa!', 'Pon', ['Pone', 'Pongas', 'Ponga'], 'Poner has the irregular tú command pon.'),
    q('(tú, no correr) ¡No ___!', 'corras', ['corre', 'corra', 'corres'], 'Negative tú commands use the subjunctive.'),
    q('(usted, escribir) ___ su nombre aquí.', 'Escriba', ['Escribe', 'Escribas', 'Escribir'], 'Usted commands use the subjunctive.'),
    q('(tú, hacer) ¡___ la tarea!', 'Haz', ['Hace', 'Hagas', 'Haga'], 'Hacer: haz.'),
    q('(tú, ir) ¡___ a tu cuarto!', 'Ve', ['Va', 'Vayas', 'Vaya'], 'Ir: ve.'),
    q('(tú, decir) ¡___ la verdad!', 'Di', ['Dice', 'Digas', 'Diga'], 'Decir: di.'),
    q('(ustedes, venir) ¡___ temprano!', 'Vengan', ['Vienen', 'Venid', 'Venga'], 'Ustedes commands use the subjunctive.'),
    q('(tú, levantarse) ¡___!', 'Levántate', ['Te levanta', 'Levantate', 'Levántese'], 'The pronoun attaches and an accent keeps the stress.'),
    q('(tú, no tocar) ¡No lo ___!', 'toques', ['tocas', 'toca', 'toque'], 'Negative tú: subjunctive, with c>qu.'),
  ] },
  { id: 'subjuntivo-3', level: 'spanish-3', title: 'Introducción al subjuntivo', titleEn: 'Introduction to the subjunctive', questions: [
    q('Quiero que tú ___ conmigo.', 'vengas', ['vienes', 'venir', 'vendrás'], 'A wish about someone else triggers the subjunctive.'),
    q('Es importante que nosotros ___.', 'estudiemos', ['estudiamos', 'estudiar', 'estudiaremos'], 'An impersonal expression of importance triggers the subjunctive.'),
    q('Mis padres esperan que yo ___ buenas notas.', 'saque', ['saco', 'sacar', 'saqué'], 'Hope triggers the subjunctive; c>qu.'),
    q('Me alegro de que ustedes ___ aquí.', 'estén', ['están', 'estar', 'estarán'], 'Emotion triggers the subjunctive.'),
    q('Quiero ___ al cine.', 'ir', ['vaya', 'voy', 'vayas'], 'Same subject: use the infinitive.'),
    q('El médico recomienda que él ___ más agua.', 'beba', ['bebe', 'beber', 'bebió'], 'A recommendation triggers the subjunctive.'),
    q('Ojalá que ___ sol mañana.', 'haga', ['hace', 'hará', 'hizo'], 'Ojalá always takes the subjunctive.'),
    q('Es necesario que tú ___ la verdad.', 'digas', ['dices', 'decir', 'dirás'], 'Decir: digas.'),
    q('Sé que ella ___ inteligente.', 'es', ['sea', 'ser', 'fuera'], 'Knowledge/certainty takes the indicative.'),
    q('Te pido que no ___ tarde.', 'llegues', ['llegas', 'llegar', 'llegarás'], 'A request triggers the subjunctive; g>gu.'),
  ] },

  // ================================================================ Spanish 4
  { id: 'duda-4', level: 'spanish-4', title: 'Duda y negación', titleEn: 'Subjunctive of doubt and denial', questions: [
    q('Dudo que él ___ la respuesta.', 'sepa', ['sabe', 'saber', 'sabrá'], 'Doubt triggers the subjunctive.'),
    q('No creo que ___ mañana.', 'llueva', ['llueve', 'lloverá', 'llover'], 'Negated belief triggers the subjunctive.'),
    q('Creo que ___ mañana.', 'lloverá', ['llueva', 'lloviera', 'llover'], 'Affirmed belief takes the indicative.'),
    q('Es posible que ellos ___ tarde.', 'lleguen', ['llegan', 'llegarán', 'llegar'], 'Possibility triggers the subjunctive.'),
    q('Es verdad que nosotros ___ mucho.', 'trabajamos', ['trabajemos', 'trabajar', 'trabajáramos'], 'Certainty takes the indicative.'),
    q('No es cierto que el examen ___ fácil.', 'sea', ['es', 'será', 'ser'], 'Denial triggers the subjunctive.'),
    q('Niego que mi hermano ___ mi dinero.', 'tenga', ['tiene', 'tener', 'tendrá'], 'Negar triggers the subjunctive.'),
    q('No cabe duda de que tú ___ razón.', 'tienes', ['tengas', 'tener', 'tuvieras'], 'No cabe duda expresses certainty: indicative.'),
    q('Quizás ella ___ en casa.', 'esté', ['estar', 'estando', 'estado'], 'Quizás with uncertainty takes the subjunctive.'),
    q('Estoy seguro de que ___ el tren.', 'perdimos', ['perdamos', 'perder', 'perdiéramos'], 'Certainty takes the indicative.'),
  ] },
  { id: 'perfecto-4', level: 'spanish-4', title: 'El presente perfecto', titleEn: 'Present perfect and participles', questions: [
    q('Yo ___ comido paella.', 'he', ['ha', 'has', 'hemos'], 'Yo: he.'),
    q('¿___ visto la película?', 'Has', ['Ha', 'He', 'Han'], 'Tú: has.'),
    q('Ellos han ___ la carta. (escribir)', 'escrito', ['escribido', 'escrita', 'escribiendo'], 'Escribir has an irregular participle.'),
    q('Nosotros hemos ___ la ventana. (abrir)', 'abierto', ['abrido', 'abierta', 'abriendo'], 'Abrir: abierto.'),
    q('¿Qué has ___? (hacer)', 'hecho', ['hacido', 'hacho', 'haciendo'], 'Hacer: hecho.'),
    q('Ella ha ___ del viaje. (volver)', 'vuelto', ['volvido', 'vuelta', 'volviendo'], 'Volver: vuelto.'),
    q('La puerta está ___. (cerrar)', 'cerrada', ['cerrado', 'cerradas', 'cerrando'], 'As an adjective, the participle agrees: la puerta → cerrada.'),
    q('Todavía no he ___ nada. (decir)', 'dicho', ['decido', 'dicido', 'diciendo'], 'Decir: dicho.'),
    q('Los platos están ___. (romper)', 'rotos', ['rompidos', 'roto', 'rompiendo'], 'Romper: roto, agreeing as rotos.'),
    q('Usted ___ puesto la mesa.', 'ha', ['he', 'has', 'han'], 'Usted takes third-person singular: ha.'),
  ] },
  { id: 'relativos-4', level: 'spanish-4', title: 'Pronombres relativos', titleEn: 'Relative pronouns', questions: [
    q('El libro ___ leo es fascinante.', 'que', ['quien', 'cual', 'donde'], 'Que is the default relative pronoun.'),
    q('La mujer con ___ hablé es doctora.', 'quien', ['que', 'cual', 'cuyo'], 'After a preposition, quien refers to people.'),
    q('No entiendo ___ dices.', 'lo que', ['que', 'el que', 'cual'], 'Lo que = what (an idea, not a noun).'),
    q('La ciudad ___ nací es pequeña.', 'donde', ['que', 'quien', 'cuando'], 'Donde refers to a place.'),
    q('Mis amigos, ___ viven en Lima, me visitan.', 'quienes', ['quien', 'lo que', 'cuyo'], 'Plural people in a nonrestrictive clause: quienes.'),
    q('Es el chico ___ padre es piloto.', 'cuyo', ['que', 'quien', 'cuya'], 'Cuyo = whose, agreeing with padre.'),
    q('Es la profesora ___ clase me encanta.', 'cuya', ['cuyo', 'que', 'quien'], 'Cuya agrees with clase.'),
    q('___ más me gusta es la playa.', 'Lo que', ['Que', 'El que es', 'Cual'], 'Lo que = what (the thing that).'),
    q('La razón por la ___ vine es importante.', 'cual', ['que cual', 'quien', 'cuyo'], 'After a preposition: la cual (or la que).'),
    q('El señor ___ trabaja aquí es mi tío.', 'que', ['quien que', 'cual', 'lo que'], 'Restrictive clause about a person: que.'),
  ] },

  // ================================================================ Spanish 5
  { id: 'imp-subj-5', level: 'spanish-5', title: 'El imperfecto del subjuntivo', titleEn: 'Imperfect subjunctive', questions: [
    q('Quería que tú ___ conmigo.', 'vinieras', ['vengas', 'venías', 'vendrías'], 'A past wish takes the imperfect subjunctive.'),
    q('Era importante que nosotros ___.', 'estudiáramos', ['estudiemos', 'estudiábamos', 'estudiaríamos'], 'Past impersonal expression: imperfect subjunctive.'),
    q('Mis padres me pidieron que ___ la verdad.', 'dijera', ['diga', 'decía', 'dije'], 'Decir: dijera.'),
    q('Buscaba a alguien que ___ francés.', 'hablara', ['hable', 'hablaba', 'habló'], 'An unknown person in the past: imperfect subjunctive.'),
    q('Me alegré de que ellos ___.', 'ganaran', ['ganen', 'ganaron', 'ganaban'], 'Past emotion: imperfect subjunctive.'),
    q('Dudaba que ella ___ razón.', 'tuviera', ['tenga', 'tenía', 'tuvo'], 'Tener: tuviera.'),
    q('The imperfect subjunctive is formed from the ___.', 'ellos form of the preterite', ['yo form of the present', 'infinitive', 'imperfect indicative'], 'Drop -ron from the ellos preterite and add -ra endings.'),
    q('Ser → que yo ___', 'fuera', ['sea', 'era', 'fui'], 'Ser and ir share fuera.'),
    q('Nos sugirió que ___ temprano.', 'saliéramos', ['salgamos', 'salíamos', 'salimos'], 'Nosotros forms carry a written accent: saliéramos.'),
    q('Ojalá ___ más tiempo. (unlikely wish)', 'tuviera', ['tenga', 'tengo', 'tendré'], 'Ojalá + imperfect subjunctive = contrary-to-fact wish.'),
  ] },
  { id: 'si-5', level: 'spanish-5', title: 'Las cláusulas con si', titleEn: 'Si clauses', questions: [
    q('Si tengo tiempo, te ___.', 'llamaré', ['llamaría', 'llamara', 'llamé'], 'Real condition: si + present, future.'),
    q('Si tuviera dinero, ___ un coche.', 'compraría', ['compraré', 'compro', 'compre'], 'Hypothetical: si + imperfect subjunctive, conditional.'),
    q('Si ___ tú, no lo haría.', 'fuera', ['soy', 'sería', 'sea'], 'Si + imperfect subjunctive for contrary-to-fact.'),
    q('Si llueve, ___ en casa.', 'nos quedamos', ['nos quedaríamos', 'nos quedáramos', 'nos quedemos'], 'Real condition: present + present is fine.'),
    q('Si hubiera estudiado, ___ el examen.', 'habría aprobado', ['aprobaría', 'aprobaré', 'haya aprobado'], 'Past contrary-to-fact: pluperfect subjunctive + conditional perfect.'),
    q('Which is NEVER used right after "si"?', 'the present subjunctive', ['the present indicative', 'the imperfect subjunctive', 'the pluperfect subjunctive'], 'Si is never followed by the present subjunctive.'),
    q('Si ___ más temprano, no llegarías tarde.', 'te levantaras', ['te levantas', 'te levantarías', 'te levantes'], 'Hypothetical: imperfect subjunctive.'),
    q('Viajaría por el mundo si ___ rico.', 'fuera', ['sería', 'soy', 'sea'], 'The si clause takes the subjunctive, not the conditional.'),
    q('Si me ___, te habría ayudado.', 'hubieras llamado', ['llamaras', 'llamabas', 'has llamado'], 'Past contrary-to-fact.'),
    q('Como si ___ un rey, él da órdenes.', 'fuera', ['es', 'sea', 'sería'], 'Como si always takes the imperfect (or pluperfect) subjunctive.'),
  ] },
  { id: 'se-5', level: 'spanish-5', title: 'Se pasiva e impersonal', titleEn: 'Passive and impersonal se', questions: [
    q('Aquí ___ español.', 'se habla', ['se hablan', 'se hablo', 'habla se'], 'Passive se with a singular subject.'),
    q('___ casas en esta calle.', 'Se venden', ['Se vende', 'Venden se', 'Se vendo'], 'Plural subject: se venden.'),
    q('¿Cómo ___ "apple" en español?', 'se dice', ['se dicen', 'dice se', 'se decir'], 'Impersonal se.'),
    q('___ prohíbe fumar.', 'Se', ['Le', 'Lo', 'Nos'], 'Impersonal se with an infinitive subject: singular verb.'),
    q('Se me ___ las llaves.', 'olvidaron', ['olvidó', 'olvidé', 'olvidaste'], 'Accidental se: the verb agrees with las llaves.'),
    q('Se le ___ el vaso a Pedro.', 'rompió', ['rompieron', 'rompí', 'rompe él'], 'The verb agrees with el vaso.'),
    q('En esta tienda ___ inglés.', 'se habla', ['se hablan', 'hablan se', 'se hablamos'], 'Idiom language is singular.'),
    q('Se nos ___ el autobús.', 'fue', ['fuimos', 'fueron', 'fui'], 'The bus got away from us: agrees with el autobús.'),
    q('___ buscan meseros.', 'Se', ['Le', 'Les', 'Los'], 'Passive se: meseros are sought.'),
    q('La tienda ___ a las nueve.', 'se abre', ['se abren', 'abre se', 'se abro'], 'Singular subject: se abre.'),
  ] },

  // ================================================================ Spanish 6
  { id: 'pluscuamperfecto-6', level: 'spanish-6', title: 'Tiempos compuestos', titleEn: 'Compound tenses', questions: [
    q('Cuando llegué, la película ya ___.', 'había empezado', ['ha empezado', 'empezó', 'habrá empezado'], 'Pluperfect: an action before another past action.'),
    q('Para el año 2030, ___ la carrera.', 'habré terminado', ['había terminado', 'he terminado', 'terminé'], 'Future perfect: completed before a future point.'),
    q('Yo ___ ido, pero estaba enfermo.', 'habría', ['habré', 'había', 'haya'], 'Conditional perfect: would have.'),
    q('Espero que ya ___ la tarea.', 'hayas hecho', ['has hecho', 'hubieras hecho', 'habías hecho'], 'Present perfect subjunctive after a present trigger.'),
    q('Nunca ___ tanto antes de ese día.', 'había llorado', ['he llorado', 'habré llorado', 'haya llorado'], 'Pluperfect for "had never…".'),
    q('Me alegró que tú ___.', 'hubieras venido', ['hayas venido', 'habías venido', 'habrás venido'], 'Pluperfect subjunctive after a past trigger.'),
    q('¿Dónde estará Luis? ___ perdido.', 'Se habrá', ['Se había', 'Se habría', 'Se haya'], 'Future perfect of probability: he has probably gotten lost.'),
    q('Dudo que ellos ___ antes de las cinco.', 'hayan llegado', ['han llegado', 'habían llegado', 'habrán llegado'], 'Doubt + present perfect subjunctive.'),
    q('Si lo hubiera sabido, te lo ___.', 'habría dicho', ['habré dicho', 'había dicho', 'he dicho'], 'Conditional perfect in the result clause.'),
    q('Ella dijo que ya ___ la cena.', 'había preparado', ['ha preparado', 'habrá preparado', 'haya preparado'], 'Reported past: pluperfect.'),
  ] },
  { id: 'adverbiales-6', level: 'spanish-6', title: 'El subjuntivo en cláusulas adverbiales', titleEn: 'Subjunctive in adverbial clauses', questions: [
    q('Te llamo cuando ___ a casa.', 'llegue', ['llego', 'llegaré', 'llegué'], 'Cuando + a future event: subjunctive.'),
    q('Siempre me llama cuando ___ a casa.', 'llega', ['llegue', 'llegara', 'llegará'], 'Cuando + a habitual event: indicative.'),
    q('Estudio para que mis padres ___ orgullosos.', 'estén', ['están', 'estarán', 'estar'], 'Para que always takes the subjunctive.'),
    q('Salimos antes de que ___.', 'llueva', ['llueve', 'lloverá', 'llovió'], 'Antes de que always takes the subjunctive.'),
    q('Iré con tal de que tú ___ también.', 'vayas', ['vas', 'irás', 'fuiste'], 'Con tal de que always takes the subjunctive.'),
    q('Aunque ___ mucho dinero, no es feliz. (fact)', 'tiene', ['tenga', 'tuviera', 'tendría'], 'Aunque + a known fact: indicative.'),
    q('Aunque ___ mañana, iremos. (it may rain)', 'llueva', ['llueve', 'lloverá', 'llovió'], 'Aunque + an uncertain possibility: subjunctive.'),
    q('Lo haré en cuanto ___ tiempo.', 'tenga', ['tengo', 'tendré', 'tuve'], 'En cuanto + future: subjunctive.'),
    q('No saldrás sin que yo lo ___.', 'sepa', ['sé', 'sabré', 'supe'], 'Sin que always takes the subjunctive.'),
    q('Me fui después de que ___ la clase.', 'terminó', ['termine', 'terminará', 'terminaría'], 'Después de que + a completed past event: indicative.'),
  ] },
  { id: 'estilo-indirecto-6', level: 'spanish-6', title: 'Estilo indirecto', titleEn: 'Reported speech and sequence of tenses', questions: [
    q('"Estoy cansado." → Dijo que ___ cansado.', 'estaba', ['está', 'estuvo', 'estará'], 'Present becomes imperfect in reported past speech.'),
    q('"Iré mañana." → Dijo que ___ al día siguiente.', 'iría', ['irá', 'fue', 'iba a ir mañana'], 'Future becomes conditional.'),
    q('"Compré un coche." → Dijo que ___ un coche.', 'había comprado', ['compra', 'compraría', 'ha comprado'], 'Preterite becomes pluperfect.'),
    q('"Cierra la puerta." → Me pidió que ___ la puerta.', 'cerrara', ['cierre', 'cerraba', 'cerraré'], 'A reported command becomes imperfect subjunctive.'),
    q('"¿Vienes?" → Me preguntó si ___.', 'venía', ['vengo', 'venga', 'vendré'], 'Present becomes imperfect in a reported question.'),
    q('"Aquí vivo." → Dijo que ___ vivía.', 'allí', ['aquí', 'acá', 'aquel'], 'Place words shift: aquí → allí.'),
    q('"Mañana es mi cumpleaños." → Dijo que ___ era su cumpleaños.', 'al día siguiente', ['mañana siempre', 'ayer', 'hoy'], 'Time words shift: mañana → al día siguiente.'),
    q('Le sugiero que ___ más. (present)', 'lea', ['leyera', 'lee', 'leerá'], 'Present trigger: present subjunctive.'),
    q('Le sugerí que ___ más. (past)', 'leyera', ['lea', 'lee', 'leía'], 'Past trigger: imperfect subjunctive.'),
    q('"He terminado." → Dijo que ___.', 'había terminado', ['ha terminado', 'terminara', 'terminará'], 'Present perfect becomes pluperfect.'),
  ] },

  // ================================================================ AP Spanish
  { id: 'ap-registro', level: 'ap-spanish', title: 'Transiciones y registro formal', titleEn: 'Transitions and formal register', questions: [
    q('Best formal opening for a persuasive essay:', 'Hoy en día, uno de los temas más debatidos es…', ['Bueno, pues, hay un tema…', 'Oye, ¿sabías que…?', 'Te voy a contar algo…'], 'Formal essays avoid conversational fillers.'),
    q('Choose the connector: "Estudió mucho; ___, no aprobó."', 'sin embargo', ['por lo tanto', 'además', 'es decir'], 'Contrast: sin embargo.'),
    q('Choose the connector: "Llovía mucho; ___, cancelaron el partido."', 'por consiguiente', ['sin embargo', 'aunque', 'a pesar de'], 'Consequence: por consiguiente.'),
    q('Formal closing for a letter to a stranger:', 'Atentamente,', ['Besos,', 'Chao,', 'Un abrazo fuerte,'], 'Atentamente is the standard formal closing.'),
    q('Formal greeting for an email to a director:', 'Estimado señor director:', ['¡Hola, jefe!', 'Querido amigo:', 'Qué onda:'], 'Estimado + title is formal.'),
    q('To introduce a counterargument:', 'Si bien es cierto que…, también…', ['Total que…', 'Y ya está.', 'O sea, nada.'], 'Si bien… concedes a point before arguing against it.'),
    q('To conclude an argumentative essay:', 'En conclusión,', ['Para empezar,', 'Por otro lado,', 'Primero,'], 'En conclusión signals the ending.'),
    q('"Ustedes" vs. "vosotros": in formal writing for a Latin American audience you use…', 'ustedes', ['vosotros', 'vos', 'tú'], 'Latin America uses ustedes for all plural "you".'),
    q('Which sentence is most formal?', 'Le agradecería que me enviara la información.', ['Mándame la info.', '¿Me pasas los datos?', 'Envíamelo ya.'], 'Conditional + usted + subjunctive is polite and formal.'),
    q('To cite a source in an AP essay:', 'Según la fuente 2, …', ['Yo creo que la fuente…', 'La fuente dice cosas.', 'No sé qué dice…'], 'Según + source is the standard attribution.'),
  ] },
  { id: 'ap-subjuntivo', level: 'ap-spanish', title: 'Subjuntivo avanzado', titleEn: 'Advanced subjunctive', questions: [
    q('No hay nadie que ___ todas las respuestas.', 'sepa', ['sabe', 'sabrá', 'supo'], 'Nonexistent antecedent: subjunctive.'),
    q('Tengo un amigo que ___ cinco idiomas.', 'habla', ['hable', 'hablara', 'hablaría'], 'Known antecedent: indicative.'),
    q('Es una lástima que la contaminación ___ tanto.', 'aumente', ['aumenta', 'aumentará', 'aumentó'], 'Emotional judgment: subjunctive.'),
    q('Por mucho que ___, no lo convencerás.', 'insistas', ['insistes', 'insistirás', 'insististe'], 'Por mucho que + hypothetical: subjunctive.'),
    q('El gobierno exigió que las empresas ___ sus emisiones.', 'redujeran', ['reduzcan', 'reducían', 'redujeron'], 'Past demand: imperfect subjunctive; reducir → redujeran.'),
    q('Me sorprendió que no ___ nadie.', 'hubiera', ['haya', 'había', 'hay'], 'Past emotion + haber: hubiera.'),
    q('Lo que ___, apoyaré tu decisión.', 'decidas', ['decides', 'decidirás', 'decidiste'], 'Indefinite "whatever": subjunctive.'),
    q('A menos que ___ medidas, la situación empeorará.', 'se tomen', ['se toman', 'se tomarán', 'se tomaron'], 'A menos que always takes the subjunctive.'),
    q('Era imprescindible que todos ___ a votar.', 'fueran', ['vayan', 'iban', 'fueron'], 'Past necessity: imperfect subjunctive.'),
    q('Es evidente que el clima ___ cambiando.', 'está', ['esté', 'estuviera', 'estar'], 'Evidence and certainty: indicative.'),
  ] },
  { id: 'ap-interpretacion', level: 'ap-spanish', title: 'Interpretación de textos', titleEn: 'Interpretive skills', questions: [
    q('"Más vale tarde que nunca" means…', 'It is better to do something late than not at all.', ['Being late is never acceptable.', 'Time is more valuable than money.', 'Never arrive late.'], 'A common proverb.'),
    q('An article ends: "Queda mucho por hacer." The author implies the problem is…', 'still unresolved', ['completely solved', 'unimportant', 'exaggerated'], 'Queda mucho por hacer = much remains to be done.'),
    q('"A raíz de la crisis" introduces…', 'a cause', ['a contrast', 'a conclusion', 'an example'], 'A raíz de = as a result of.'),
    q('A chart titled "Evolución del teletrabajo 2019–2023" most likely shows…', 'changes in remote work over time', ['the history of telephones', 'office furniture prices', 'traffic accidents'], 'Evolución + a time range = a trend.'),
    q('"Cabe destacar que…" is used to…', 'emphasize a point', ['change the topic', 'ask a question', 'end a letter'], 'Cabe destacar = it is worth highlighting.'),
    q('The tone of "¡Qué vergüenza que nadie haga nada!" is…', 'indignant', ['neutral', 'grateful', 'joyful'], 'Qué vergüenza expresses outrage.'),
    q('In an interview, "Me alegra que me lo pregunte" signals the speaker is…', 'pleased by the question', ['annoyed', 'confused', 'refusing to answer'], 'Literal: it pleases me that you ask me.'),
    q('"Los expertos advierten que…" introduces…', 'a warning', ['a joke', 'a personal story', 'an advertisement'], 'Advertir = to warn.'),
    q('The main purpose of a text titled "Cinco consejos para ahorrar agua" is to…', 'give advice', ['tell a story', 'criticize a person', 'sell a product'], 'Consejos = advice.'),
    q('"No solo… sino también…" expresses…', 'addition', ['contrast', 'cause', 'time'], 'Not only… but also.'),
  ] },

  // ================================================================ College
  { id: 'col-relativos', level: 'college-spanish', title: 'Sintaxis avanzada', titleEn: 'Advanced syntax', questions: [
    q('La casa, ___ ventanas dan al mar, es de mi tía.', 'cuyas', ['cuyos', 'que sus', 'las cuales sus'], 'Cuyo agrees with the possessed noun: ventanas → cuyas.'),
    q('El proyecto en el ___ trabajo es arriesgado.', 'cual', ['que cual', 'quien', 'cuyo'], 'En el cual (or en el que) after a preposition.'),
    q('Fue ella ___ lo descubrió.', 'quien', ['cual', 'lo que', 'cuya'], 'Cleft sentence with a person: fue ella quien.'),
    q('___ quiera participar, que se inscriba.', 'Quien', ['Que', 'Cual', 'Cuyo'], 'Quien without an antecedent = whoever.'),
    q('Los estudiantes, ___ habían estudiado, aprobaron.', 'los cuales', ['cuyos', 'lo cual', 'que los'], 'Nonrestrictive: all the students had studied.'),
    q('Llegó tarde, ___ molestó al profesor.', 'lo cual', ['el cual', 'la cual', 'cuyo'], 'Lo cual refers to the whole preceding clause.'),
    q('Difference: "Los alumnos que estudiaron aprobaron."', 'Only some students studied.', ['All the students studied.', 'No student studied.', 'The sentence is ungrammatical.'], 'A restrictive clause picks out a subset.'),
    q('Es la razón por ___ renuncié.', 'la que', ['que', 'lo que', 'quien'], 'Por la que / por la cual after a preposition.'),
    q('Choose the correct sentence.', 'Es a ti a quien busco.', ['Es a ti que a quien busco.', 'Es ti a quien busco.', 'Es a ti quien busco a.'], 'Cleft sentences repeat the preposition.'),
    q('"El que avisa no es traidor" uses "el que" to mean…', 'whoever / the one who', ['which', 'whose', 'what'], 'El que without an antecedent = the one who.'),
  ] },
  { id: 'col-ser-estar', level: 'college-spanish', title: 'Matices de ser y estar', titleEn: 'Meaning shifts with ser and estar', questions: [
    q('"Es listo" means…', 'He is clever.', ['He is ready.', 'He is sick.', 'He is bored.'], 'Ser listo = clever; estar listo = ready.'),
    q('"Está listo" means…', 'He is ready.', ['He is clever.', 'He is rich.', 'He is boring.'], 'Estar listo = ready.'),
    q('"Es aburrido" means…', 'He is boring.', ['He is bored.', 'He is tired.', 'He is new.'], 'Ser aburrido = boring.'),
    q('"La fruta está verde" means…', 'The fruit is unripe.', ['The fruit is a green variety.', 'The fruit is rotten.', 'The fruit is expensive.'], 'Estar verde = unripe.'),
    q('"Es malo" vs. "Está malo": "Está malo" usually means…', 'He is sick.', ['He is evil.', 'He is bad at sports.', 'He is poor.'], 'Estar malo = to be ill.'),
    q('"La sopa está rica" means…', 'The soup tastes delicious.', ['The soup is expensive.', 'The soup is wealthy.', 'The soup is hot.'], 'Estar rico (food) = delicious.'),
    q('"Es un hombre vivo" means…', 'He is a sharp / quick-witted man.', ['He is a living man.', 'He is a lively party.', 'He is dead.'], 'Ser vivo = sharp, clever.'),
    q('"Estar atento" means…', 'to be paying attention', ['to be courteous', 'to be tired', 'to be absent'], 'Ser atento = courteous; estar atento = attentive.'),
    q('"La boda es en la catedral" uses ser because…', 'it is the location of an event', ['it is permanent', 'it is a feeling', 'it is an origin'], 'Events take ser for location.'),
    q('"Está muerto" uses estar because…', 'death is treated as a resulting state', ['death is temporary', 'it is an origin', 'it is a profession'], 'Estar with the result of a change.'),
  ] },
  { id: 'col-perifrasis', level: 'college-spanish', title: 'Perífrasis verbales', titleEn: 'Verbal periphrases and aspect', questions: [
    q('"Llevo tres años estudiando español" means…', 'I have been studying Spanish for three years.', ['I studied Spanish three years ago.', 'I will study Spanish for three years.', 'I carry three Spanish books.'], 'Llevar + time + gerund = have been doing.'),
    q('"Acabo de llegar" means…', 'I have just arrived.', ['I finished arriving.', 'I will arrive at the end.', 'I never arrive.'], 'Acabar de + infinitive = to have just.'),
    q('"Volvió a llamar" means…', 'He called again.', ['He returned to call.', 'He stopped calling.', 'He called back later.'], 'Volver a + infinitive = to do again.'),
    q('"Suelo levantarme temprano" means…', 'I usually get up early.', ['I got up early once.', 'I must get up early.', 'I want to get up early.'], 'Soler + infinitive = to usually do.'),
    q('"Dejó de fumar" means…', 'He quit smoking.', ['He let someone smoke.', 'He started smoking.', 'He smoked again.'], 'Dejar de = to stop doing.'),
    q('"Estoy por salir" means…', 'I am about to leave.', ['I am leaving because of it.', 'I left already.', 'I am against leaving.'], 'Estar por + infinitive = about to.'),
    q('"Tengo que estudiar" vs. "Hay que estudiar": "hay que" is…', 'impersonal (one must)', ['first person only', 'past tense', 'a question form'], 'Hay que = one must.'),
    q('"Va mejorando poco a poco" emphasizes…', 'gradual progress', ['a sudden change', 'a completed action', 'a future plan'], 'Ir + gerund = gradual development.'),
    q('"Se echó a reír" means…', 'She burst out laughing.', ['She threw a laugh away.', 'She stopped laughing.', 'She laughed at someone.'], 'Echarse a + infinitive = to suddenly start.'),
    q('"Debe de estar en casa" expresses…', 'probability', ['obligation', 'permission', 'a past habit'], 'Deber de + infinitive = must be (probably).'),
  ] },
];

export function grammarForLevel(level: LevelId): GrammarTopic[] {
  return GRAMMAR.filter((g) => g.level === level);
}
