import type { SeriesNumber, SyllabusEntry } from './types';

/**
 * Ordre exact des leçons selon la table des matières d'Alphonse Jenny
 * (90 leçons + 7 leçons de révision "bis").
 */
export const LESSON_ORDER: readonly string[] = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10 bis',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '20 bis',
  '21', '22', '23', '24', '25',
  '26', '27', '28', '29', '30', '30 bis',
  '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '40 bis',
  '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '50 bis',
  '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '60 bis',
  '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '70 bis',
  '71', '72', '73', '74', '75',
  '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90',
];

export const SERIES_LABELS: Record<SeriesNumber, string> = {
  1: 'Série 1 • Éléments de base',
  2: 'Série 2 • Situations pratiques',
  3: 'Série 3 • Choix de textes',
};

export const SERIES_SIDEBAR_NAMES: Record<SeriesNumber, string> = {
  1: 'Série 1 (1–25) • Éléments de base',
  2: 'Série 2 (26–75) • Situations pratiques',
  3: 'Série 3 (76–90) • Choix de textes',
};

export function getLessonSeries(id: string): SeriesNumber {
  const num = parseInt(id, 10) || 50;
  if (id.includes('bis')) {
    return num <= 20 ? 1 : 2;
  }
  if (num <= 25) return 1;
  if (num <= 75) return 2;
  return 3;
}

/**
 * Catalogue complet des titres authentiques des 97 leçons (90 leçons + 7 bis),
 * synchronisé avec la Méthode 90 d'Alphonse Jenny (1970).
 */
export const SYLLABUS_METADATA: Record<string, SyllabusEntry> = {
  "1": { de: "Er lernt im Park", fr: "Il apprend dans le parc" },
  "2": { de: "Der Kongreß in Köln", fr: "Le congrès à Cologne" },
  "3": { de: "Das Hotel", fr: "L'Hôtel" },
  "4": { de: "Briefe an die Freunde", fr: "Des lettres aux amis" },
  "5": { de: "Herr Beckmann, der Dolmetscher", fr: "Monsieur Beckmann, l'interprète" },
  "6": { de: "Diese Sprache ist international", fr: "Ce langage est international" },
  "7": { de: "Im Kongreßsaal", fr: "Dans la salle de congrès" },
  "8": { de: "Ein Tag in Köln", fr: "Une journée à Cologne" },
  "9": { de: "Bei der Familie Müller (1)", fr: "Dans la famille Müller (1)" },
  "10": { de: "Bei der Familie Müller (2)", fr: "Chez la famille Müller (2)" },
  "10 bis": { de: "Contrôle et révisions (Leçons 1 à 10)", fr: "Pluriel, formes avec du et ihr, possessifs, présent, interrogatifs et traduction" },
  "11": { de: "Notizen aus dem Kongreß", fr: "Notes du congrès" },
  "12": { de: "Das Warenhaus", fr: "Le grand magasin" },
  "13": { de: "Am Morgen im Hotel", fr: "Le matin à l'hôtel" },
  "14": { de: "Ein kleiner Ausflug (1)", fr: "Une petite excursion (1)" },
  "15": { de: "Ein kleiner Ausflug (2)", fr: "Une petite excursion (2)" },
  "16": { de: "Ein Verkehrsunfall", fr: "Un accident de la circulation" },
  "17": { de: "Ein Gewitter", fr: "Un orage" },
  "18": { de: "Camping", fr: "Le camping" },
  "19": { de: "Besichtigung einer Spinnerei", fr: "La visite d'une filature" },
  "20": { de: "Handwerk und Industrie", fr: "L'artisanat et l'industrie" },
  "20 bis": { de: "Contrôle et révisions (Leçons 11 à 20)", fr: "Verbes de position, prétérit, passé composé, pronoms et auxiliaires de mode" },
  "21": { de: "Erholung zwischen Blumen und Gemüse", fr: "Délassement entre les fleurs et les légumes" },
  "22": { de: "Das große Herbstfest", fr: "La grande fête d'automne" },
  "23": { de: "Das Fernsehen", fr: "La télévision" },
  "24": { de: "Kurznachrichten", fr: "Nouvelles brèves" },
  "25": { de: "Eine angenehme Überraschung", fr: "Une surprise agréable" },
  "26": { de: "Der Wagen", fr: "La voiture" },
  "27": { de: "An der Tankstelle", fr: "Au poste à essence" },
  "28": { de: "Das Flugzeug", fr: "L'avion" },
  "29": { de: "Wir reisen mit dem Flugzeug", fr: "Nous voyageons par avion" },
  "30": { de: "Die Eisenbahn", fr: "Le chemin de fer" },
  "30 bis": { de: "Contrôle et révisions (Leçons 21 à 30)", fr: "Révision : weil et denn, déclinaison de l'adjectif, subordonnées (ob, daß, wenn)" },
  "31": { de: "Sie wollen mit der Eisenbahn fahren", fr: "Vous allez prendre le train" },
  "32": { de: "Das Schiff", fr: "Le bateau" },
  "33": { de: "Ankunft auf dem Schiff", fr: "L'arrivée à bord" },
  "34": { de: "Der Paß", fr: "Le passeport" },
  "35": { de: "Zoll und Wechselgeschäft", fr: "Douane et change" },
  "36": { de: "Der Gasthof", fr: "L'Hôtel" },
  "37": { de: "Wir reservieren ein Zimmer im Hotel", fr: "Nous réservons une chambre à l'hôtel" },
  "38": { de: "Ankunft im Hotel", fr: "Arrivée à l'hôtel" },
  "39": { de: "Die Mahlzeiten", fr: "Les repas" },
  "40": { de: "Das Frühstück", fr: "Le petit déjeuner" },
  "40 bis": { de: "Contrôle et révisions (Leçons 31 à 40)", fr: "Pronom relatif, suppression de wenn/daß et voix passive" },
  "41": { de: "Mittagessen in aller Eile", fr: "Un déjeuner expédié" },
  "42": { de: "Das Abendessen", fr: "Le dîner" },
  "43": { de: "Der Stadtverkehr", fr: "Circulation en ville" },
  "44": { de: "Wie man nach dem Weg fragt", fr: "Comment demander son chemin" },
  "45": { de: "Die Bank; die Post", fr: "La banque ; la poste" },
  "46": { de: "Auf der Bank", fr: "A la banque" },
  "47": { de: "Auf der Post", fr: "A la poste" },
  "48": { de: "Der Fernsprecher", fr: "Le téléphone" },
  "49": { de: "Der Arzt", fr: "Le médecin" },
  "50": { de: "Beim Arzt – Beim Zahnarzt", fr: "Chez le médecin – Chez le dentiste" },
  "50 bis": { de: "Contrôle et révisions (Leçons 41 à 50)", fr: "« Il y a » (es stehen / es gibt / es sind), conditionnel avec wenn, comparatif, lecture et humour" },
  "51": { de: "Die Denkmäler", fr: "Les monuments" },
  "52": { de: "Im Museum", fr: "Au musée" },
  "53": { de: "Im Theater", fr: "Au théâtre" },
  "54": { de: "Münchner Oktoberfest und Rheinischer Karneval", fr: "La Fête d'Octobre à Munich et le carnaval rhénan" },
  "55": { de: "Höflichkeit", fr: "Politesse" },
  "56": { de: "Wir besuchen gemeinsame Freunde", fr: "Nous rendons visite à des amis communs" },
  "57": { de: "Auf dem Land", fr: "À la campagne" },
  "58": { de: "Ausflüge", fr: "Excursions" },
  "59": { de: "Wir kaufen den Freunden Reiseandenken", fr: "Nous achetons des souvenirs pour nos amis" },
  "60": { de: "Ein Bummel durch das Geschäftsviertel", fr: "En flânant dans le quartier des affaires" },
  "60 bis": { de: "Contrôle et révisions (Leçons 51 à 60)", fr: "Double infinitif au passé composé, propositions concessives (obwohl), propositions qualificatives et lecture « Signal aus San Diego »" },
  "61": { de: "Einkäufe in einem Lebensmittelgeschäft", fr: "Achats dans un magasin d'alimentation" },
  "62": { de: "Bücher, Papierwaren, Zeitungen", fr: "Livres, papiers, journaux" },
  "63": { de: "Herrenkleidung", fr: "Vêtements d'homme" },
  "64": { de: "Damenkleidung", fr: "Vêtements de femme" },
  "65": { de: "Im Schuhgeschäft und beim Schuster", fr: "Dans le magasin de chaussures et chez le cordonnier" },
  "66": { de: "Beim Frisör", fr: "Chez le coiffeur" },
  "67": { de: "Unterhalt, Sauberkeit", fr: "Entretien, propreté" },
  "68": { de: "Das Landhaus", fr: "La maison de campagne" },
  "69": { de: "Die Wohnung", fr: "L'appartement" },
  "70": { de: "Freunde stellen Ihnen die Wohnung zur Verfügung", fr: "Des amis mettent leur appartement à votre disposition" },
  "70 bis": { de: "Contrôle et révisions (Leçons 61 à 70)", fr: "Révision : verbes forts (passé composé et prétérit), « ziemlich » et « genug », style indirect" },
  "71": { de: "Die Familie", fr: "La Famille" },
  "72": { de: "Kinder und Schule", fr: "Les enfants et l'école" },
  "73": { de: "Der menschliche Körper", fr: "Le corps humain" },
  "74": { de: "Was lesen Sie gerne?", fr: "Qu'aimez-vous lire?" },
  "75": { de: "Was sehen Sie gerne? Was hören Sie gerne?", fr: "Qu'aimez-vous voir ? Qu'aimez-vous entendre ?" },
  "76": { de: "Urlaub in Deutschland (M. Schiff)", fr: "Vacances en Allemagne (M. Schiff)" },
  "77": { de: "Stadt und Land (M. Schiff)", fr: "La ville et la campagne (M. Schiff)" },
  "78": { de: "Der Gevatter Tod (Brüder Grimm)", fr: "La Mort marraine (Brüder Grimm)" },
  "79": { de: "Der Gevatter Tod — Fortsetzung und Schluß (Brüder Grimm)", fr: "La Mort marraine — suite et fin (Brüder Grimm)" },
  "80": { de: "Ein Held, ein ganz großer Held (Eva Rechlin)", fr: "Un héros, un très grand héros (Eva Rechlin)" },
  "81": { de: "Die Zwillingstaufe in Köln (Heinrich Spoerl)", fr: "Le baptême des jumeaux à Cologne (Heinrich Spoerl)" },
  "82": { de: "Aus den Memoiren des Herrn von Schnabelewopski (Heinrich Heine)", fr: "Extrait des Mémoires de Monsieur de Schnabelewopski (Heinrich Heine)" },
  "83": { de: "Ein Städtchen namens Lugano (Peter Westphal)", fr: "Une petite ville du nom de Lugano (Peter Westphal)" },
  "84": { de: "Gespräch bei der Fondue (Werner Bergengruen)", fr: "Tête-à-tête auprès de la Fondue (Werner Bergengruen)" },
  "85": { de: "Stilmöbel dringen weiter vor (H. Rieker)", fr: "Les meubles de style continuent à progresser (H. Rieker)" },
  "86": { de: "Eine Stunde Aufenthalt (Heinrich Böll)", fr: "Une heure d'attente (Heinrich Böll)" },
  "87": { de: "Ratschläge für Totschläger (Joseph Wechsberg)", fr: "Conseils pour tueurs [de temps] (Joseph Wechsberg)" },
  "88": { de: "Beispiel (Herbert Kranz)", fr: "L'exemple (Herbert Kranz)" },
  "89": { de: "Sterne über der Ruinenwelt (Theodor Plievier)", fr: "Des étoiles sur le monde en ruines (Theodor Plievier)" },
  "90": { de: "Eine neue Welt bringst du uns... (Ernst Wiechert)", fr: "Tu nous apportes un monde nouveau... (Ernst Wiechert)" },
};
