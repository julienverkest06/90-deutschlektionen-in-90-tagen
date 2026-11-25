import type { Lesson, SeriesNumber, VocabItem } from './types';
import { SYLLABUS_METADATA, getLessonSeries } from './syllabus';

interface SeriesTemplate {
  grammarTitle: string;
  grammarBody: string;
  pron: string;
  vocab: VocabItem[];
  pDe: (titleDe: string) => string;
  pFr: (titleFr: string) => string;
}

const SERIES_TEMPLATES: Record<SeriesNumber, SeriesTemplate> = {
  1: {
    grammarTitle: 'Consolidation des structures de base et ordre des mots',
    grammarBody:
      "En allemand, le verbe conjugué occupe toujours la <strong>2e position</strong> dans la proposition déclarative principale, et la <strong>1re position</strong> dans l'interrogation directe sans mot interrogatif. N'oubliez pas d'apprendre chaque nom avec son article défini et son pluriel.",
    pron: 'Articulation nette des voyelles longues et brèves. Accent tonique généralement sur la première syllabe du radical.',
    vocab: [
      { de: 'der Bahnhof (¨-e)', fr: 'la gare', info: 'Masculin' },
      { de: 'die Fahrkarte (-n)', fr: 'le billet', info: 'Féminin' },
      { de: 'das Gepäck', fr: 'les bagages', info: 'Neutre singulier' },
      { de: 'abfahren (ä, u, a)', fr: 'partir (en véhicule)', info: 'Particule séparable : ab' },
      { de: 'einsteigen (ie, ie)', fr: 'monter (dans un train)', info: 'Particule séparable : ein' },
    ],
    pDe: (titleDe) =>
      `Im Rahmen der Lektion « ${titleDe} » üben wir den Wortschatz und die Satzstellung. Der Zug fährt pünktlich um acht Uhr ab, und die Reisenden steigen schnell ein.`,
    pFr: (titleFr) =>
      `Dans le cadre de la leçon « ${titleFr} », nous pratiquons le vocabulaire et la construction de la phrase. Le train part ponctuellement à huit heures, et les voyageurs montent rapidement.`,
  },
  2: {
    grammarTitle: 'Subordination, prépositions et nuances idiomatiques',
    grammarBody:
      "Dans les situations pratiques de la vie quotidienne, l'allemand utilise fréquemment les propositions subordonnées (<em>daß, weil, wenn, obwohl</em>) avec rejet du verbe conjugué en fin de proposition, ainsi que des composés nominaux précis.",
    pron: "Dans les mots composés allemands, l'accent principal porte sur le premier élément déterminant, tandis que le genre grammatical est donné par le dernier élément.",
    vocab: [
      { de: 'die Erfahrung (-en)', fr: "l'expérience", info: 'Féminin' },
      { de: 'die Möglichkeit (-en)', fr: 'la possibilité', info: 'Féminin' },
      { de: 'sich entscheiden (ie, ie)', fr: 'se décider', info: 'Verbe réfléchi' },
      { de: 'empfehlen (a, o, ie)', fr: 'recommander', info: 'Verbe fort' },
      { de: 'ausgezeichnet', fr: 'excellent', info: 'Adjectif' },
    ],
    pDe: (titleDe) =>
      `Heute beschäftigen wir uns mit dem Thema « ${titleDe} ». Wenn man eine Fremdsprache lernt, muß man regelmäßig üben und neue Ausdrücke im Alltag anwenden.`,
    pFr: (titleFr) =>
      `Aujourd'hui nous abordons le thème « ${titleFr} ». Lorsqu'on apprend une langue étrangère, il faut pratiquer régulièrement et employer de nouvelles expressions au quotidien.`,
  },
  3: {
    grammarTitle: 'Analyse littéraire, style soutenu et syntaxe complexe',
    grammarBody:
      "La Série 3 présente des textes authentiques d'écrivains et journalistes germanophones. On y observe le prétérit narratif, le participe épithète développé (<em>der auf der Spitze stehende Stein</em>) et le discours indirect au Subjonctif 1.",
    pron: 'Lecture expressive : respectez le rythme de la phrase allemande et les pauses marquées par les virgules avant chaque subordonnée.',
    vocab: [
      { de: 'die Dichtung (-en)', fr: "la poésie, l'œuvre littéraire", info: 'Féminin' },
      { de: 'die Wirklichkeit', fr: 'la réalité', info: 'Féminin' },
      { de: 'der Gedanke (-ns, -n)', fr: 'la pensée', info: 'Masculin' },
      { de: 'betrachten', fr: 'contempler, considérer', info: 'Verbe inséparable' },
      { de: 'ewig', fr: 'éternel', info: 'Adjectif' },
    ],
    pDe: (titleDe) =>
      `Aus der deutschen Literatur (${titleDe}): Die Sprache öffnet uns das Tor zu einer reichen Kultur. Wer die Klassiker liest, versteht die Tiefe der deutschen Gedankenwelt.`,
    pFr: (titleFr) =>
      `Extrait de la littérature allemande (${titleFr}) : La langue nous ouvre la porte d'une riche culture. Celui qui lit les classiques comprend la profondeur de la pensée allemande.`,
  },
};

/**
 * Génère un contenu pédagogique cohérent pour les leçons qui ne disposent pas
 * encore d'un fichier JSON détaillé dans `src/data/lessons/`.
 */
export function buildFallbackLesson(id: string): Lesson {
  const meta = SYLLABUS_METADATA[id] ?? { de: `Lektion ${id}`, fr: `Leçon ${id}` };
  const series = getLessonSeries(id);
  const tpl = SERIES_TEMPLATES[series];

  return {
    id,
    series,
    authentic: false,
    isReview: id.includes('bis'),
    titleDe: meta.de,
    titleFr: meta.fr,
    proverbDe: 'Übung macht den Meister.',
    proverbFr: "C'est en forgeant qu'on devient forgeron.",
    paragraphs: [
      { de: tpl.pDe(meta.de), fr: tpl.pFr(meta.fr) },
      {
        de: 'Wir wiederholen die wichtigsten Regeln und sprechen die Sätze laut aus.',
        fr: 'Nous répétons les règles les plus importantes et prononçons les phrases à voix haute.',
      },
    ],
    pronunciation: tpl.pron,
    vocab: tpl.vocab,
    grammar: [{ title: tpl.grammarTitle, body: tpl.grammarBody }],
    exercises: [
      {
        type: 'choice',
        prompt: `Vocabulaire de la leçon : Que signifie « ${tpl.vocab[0].de} » ?`,
        options: [tpl.vocab[0].fr, tpl.vocab[1].fr, tpl.vocab[2].fr, 'la fenêtre'],
        answer: tpl.vocab[0].fr,
        hint: `Genre/Info : ${tpl.vocab[0].info}`,
        explanation: `${tpl.vocab[0].de} = ${tpl.vocab[0].fr}.`,
      },
      {
        type: 'choice',
        prompt: `Quel est le sens de « ${tpl.vocab[2].de} » ?`,
        options: [tpl.vocab[2].fr, tpl.vocab[0].fr, tpl.vocab[3].fr, 'le jardin'],
        answer: tpl.vocab[2].fr,
        hint: `Indice : ${tpl.vocab[2].info}`,
        explanation: `${tpl.vocab[2].de} signifie « ${tpl.vocab[2].fr} ».`,
      },
      {
        type: 'order',
        prompt: 'Reconstituez cette phrase allemande en respectant la place du verbe :',
        words: ['Wenn', 'man', 'jeden', 'Tag', 'übt,', 'lernt', 'man', 'schnell.'],
        answer: 'Wenn man jeden Tag übt, lernt man schnell.',
        hint: "« Wenn » rejette « übt » avant la virgule, suivie de l'inversion « lernt man ».",
        explanation: 'Wenn man jeden Tag übt, lernt man schnell.',
      },
      {
        type: 'fill',
        prompt: 'Complétez la conjugaison du verbe « sein » au présent : « Wir ___ auf dem richtigen Weg. »',
        answer: 'sind',
        hint: '1re personne du pluriel de sein (nous sommes).',
        explanation: 'Wir sind auf dem richtigen Weg. (Nous sommes sur la bonne voie).',
      },
    ],
  };
}
