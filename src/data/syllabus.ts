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
 * Catalogue complet des titres et thèmes des 97 leçons (90 leçons + 7 bis).
 */
export const SYLLABUS_METADATA: Record<string, SyllabusEntry> = {
  '1': { de: 'Er lernt im Park', fr: 'Il apprend dans le parc (Genres, sein)' },
  '2': { de: 'Er wohnt in Köln', fr: 'Il habite Cologne (Article indéfini, présent)' },
  '3': { de: 'Das Hotel', fr: "L'hôtel (Accusatif, négation kein)" },
  '4': { de: 'Im Restaurant', fr: 'Au restaurant (Pluriel des noms)' },
  '5': { de: 'Ein Spaziergang', fr: 'Une promenade (Verbes forts au présent)' },
  '6': { de: 'Im Büro', fr: 'Au bureau (Masculin faible, impératif)' },
  '7': { de: 'Im Kongreßsaal', fr: 'Dans la salle de congrès (Particules séparables, possessifs)' },
  '8': { de: 'Der Brief', fr: 'La lettre (Le génitif, démonstratifs)' },
  '9': { de: 'Bei der Familie Müller (1)', fr: 'Dans la famille Müller (1) (Le datif)' },
  '10': { de: 'Bei der Familie Müller (2)', fr: 'Dans la famille Müller (2) (Futur, prépositions)' },
  '10 bis': { de: 'Contrôle et révisions', fr: 'Révisions des leçons 1 à 10' },
  '11': { de: 'Ein Besuch', fr: 'Une visite (Verbes factitifs, denn)' },
  '12': { de: 'Das Warenhaus', fr: 'Le grand magasin (Position, prépositions mixtes)' },
  '13': { de: 'Auf der Post', fr: 'À la poste (Pronoms personnels accusatif)' },
  '14': { de: 'Ein kleiner Ausflug (1)', fr: 'Une petite excursion (1) (Prétérit régulier, pronom datif)' },
  '15': { de: 'Ein kleiner Ausflug (2)', fr: 'Une petite excursion (2) (Prétérit fort, comparatif)' },
  '16': { de: 'Ein Unfall', fr: 'Un accident (Prétérit auxiliaires, superlatif)' },
  '17': { de: 'Ein Gewitter', fr: 'Un orage (Place des pronoms, impersonnels)' },
  '18': { de: 'Camping', fr: 'Camping (Modaux wollen/mögen, dizaines)' },
  '19': { de: 'Besichtigung einer Spinnerei', fr: "Visite d'une filature (Passé composé, müssen/sollen)" },
  '20': { de: 'Handwerk und Industrie', fr: "L'artisanat et l'industrie (Plus-que-parfait, können/dürfen)" },
  '20 bis': { de: 'Contrôle et révisions', fr: 'Révisions des leçons 11 à 20' },
  '21': { de: 'Erholung zwischen Blumen und Gemüse', fr: 'Délassement entre fleurs et légumes (Déclinaison faible)' },
  '22': { de: 'Das Volksfest', fr: 'La fête populaire (Subordonnée weil, ordinaux, date)' },
  '23': { de: 'Rundfunk und Fernsehen', fr: 'Radio et télévision (Déclinaison forte, daß)' },
  '24': { de: 'Ein Einbruch', fr: "Un cambriolage (L'heure, savoir wissen, wie)" },
  '25': { de: 'Eine neue Stelle', fr: 'Un nouveau poste (Déclinaison mixte, ob/wenn)' },
  '26': { de: 'Im Großstadtverkehr', fr: 'Dans la circulation urbaine (Pronom relatif)' },
  '27': { de: 'Auf dem Bahnhof', fr: 'À la gare (Prépositions avec le génitif)' },
  '28': { de: 'Im Reisebüro', fr: "À l'agence de voyages (Infinitif avec zu)" },
  '29': { de: 'Am Flughafen', fr: "À l'aéroport (bevor/nachdem, noms adjectivaux)" },
  '30': { de: 'Frühstück im Sonderzug', fr: 'Le petit déjeuner en train spécial (Interrogation indirecte)' },
  '30 bis': { de: 'Contrôle et révisions', fr: 'Révisions des leçons 21 à 30' },
  '31': { de: 'Auf der Autobahn', fr: "Sur l'autoroute (Adverbes pronominaux darin, damit)" },
  '32': { de: 'Eine Kreuzfahrt', fr: 'Une croisière (Pronom relatif au génitif)' },
  '33': { de: 'Im Hafen von Hamburg', fr: 'Dans le port de Hambourg (Participe présent)' },
  '34': { de: 'Tips für den Umgang mit Zöllnern', fr: 'Conseils avec les douaniers (Complément de temps)' },
  '35': { de: 'An der Grenze', fr: 'À la frontière (Verbes pronominaux)' },
  '36': { de: 'Eine Umfrage', fr: 'Une enquête (La voix passive)' },
  '37': { de: 'Die Zimmerbestellung', fr: "La réservation d'une chambre (Présent à valeur de futur)" },
  '38': { de: 'Im Hotel (2)', fr: "À l'hôtel (Suppression de wenn, nuances de sollen)" },
  '39': { de: 'Das Frühstück', fr: "Le petit déjeuner (Passif d'état avec sein)" },
  '40': { de: 'Reklamationen', fr: 'Réclamations (Subjonctif 1 et Subjonctif 2)' },
  '40 bis': { de: 'Contrôle et révisions', fr: 'Révisions des leçons 31 à 40' },
  '41': { de: 'Nach dem Weg fragen', fr: 'Demander son chemin (Adverbes de direction hin/her)' },
  '42': { de: 'Mit der Straßenbahn', fr: 'En tramway (Nombres fractionnaires)' },
  '43': { de: 'Für den französischen Autofahrer', fr: "Pour l'automobiliste en Allemagne (Postpositions, ß/ss)" },
  '44': { de: 'Eine Autopanne', fr: 'Une panne de voiture (Verbes mixtes kennen, denken)' },
  '45': { de: 'In der Werkstatt', fr: 'Au garage (Infinitif sans zu)' },
  '46': { de: 'Auf der Bank', fr: 'À la banque (Vocabulaire financier)' },
  '47': { de: 'Geldwechsel', fr: 'Le change (Comparatifs irréguliers)' },
  '48': { de: 'Am Telefon', fr: 'Au téléphone (welcher et was für ein)' },
  '49': { de: 'Ein Ferngespräch', fr: 'Une communication interurbaine (um... zu, ohne... zu)' },
  '50': { de: 'Beim Arzt', fr: 'Chez le médecin (Déclinaison des noms, das Herz)' },
  '50 bis': { de: 'Contrôle et révisions', fr: 'Révisions des leçons 41 à 50' },
  '51': { de: 'In der Apotheke', fr: 'À la pharmacie (Formation des mots composés)' },
  '52': { de: 'Im Museum', fr: 'Au musée (Double infinitif, complément von)' },
  '53': { de: 'Im Theater', fr: 'Au théâtre (obwohl, bis, nur/erst)' },
  '54': { de: 'Im Konzert', fr: 'Au concert (Adjectifs invariables)' },
  '55': { de: 'Höflichkeit', fr: 'Politesse (Correspondance et vœux)' },
  '56': { de: 'Ein Festessen', fr: 'Un banquet (Gastronomie allemande)' },
  '57': { de: 'Im Café', fr: 'Au café (Expressions idiomatiques)' },
  '58': { de: 'Sport und Freizeit', fr: 'Sport et loisirs (Verbes de mouvement)' },
  '59': { de: 'Im Gebirge', fr: 'À la montagne (Prépositions avec accusatif)' },
  '60': { de: 'Am Meer', fr: 'À la mer (Verbes forts en i - a - u)' },
  '60 bis': { de: 'Contrôle et révisions', fr: 'Révisions des leçons 51 à 60' },
  '61': { de: 'Beim Friseur', fr: 'Chez le coiffeur (Faire faire : lassen)' },
  '62': { de: 'Einkäufe', fr: 'Achats (Mesures et poids)' },
  '63': { de: 'Im Schuhgeschäft', fr: 'Au magasin de chaussures (Verbes forts ei - i - i)' },
  '64': { de: 'Beim Schneider', fr: 'Chez le tailleur (genug vs ziemlich, suffixe -los)' },
  '65': { de: 'Beim Schuhmacher', fr: 'Chez le cordonnier (sehr vs viel, noms composés)' },
  '66': { de: 'Die Wohnungssuche', fr: "La recherche d'un logement (Petites annonces)" },
  '67': { de: 'Unterhalt, Sauberkeit', fr: 'Entretien, propreté (Parfumerie, droguerie)' },
  '68': { de: 'Im Haushalt', fr: 'Dans le ménage (Ustensiles et vie quotidienne)' },
  '69': { de: 'Landwirtschaft', fr: "L'agriculture (La vie rurale)" },
  '70': { de: 'Wirtschaft und Handel', fr: 'Économie et commerce (Exportation)' },
  '70 bis': { de: 'Contrôle et révisions', fr: 'Révisions des leçons 61 à 70' },
  '71': { de: 'Auf der Messe', fr: 'À la foire-exposition (Foires commerciales)' },
  '72': { de: 'Schule und Universität', fr: 'École et université (Système éducatif)' },
  '73': { de: 'Wissenschaft und Forschung', fr: 'Science et recherche (Participe épithète)' },
  '74': { de: 'Presse und Literatur', fr: 'Presse et littérature (Verbes avec le génitif)' },
  '75': { de: 'Was sehen Sie gerne? Was hören Sie gerne?', fr: 'Architecture, peinture et musique (weder... noch)' },
  '76': { de: 'Aus der deutschen Presse (1)', fr: 'Extrait de presse : Vie moderne en Allemagne' },
  '77': { de: 'Aus der deutschen Presse (2)', fr: "Extrait de presse : L'environnement et les villes" },
  '78': { de: 'Die deutsche Geschichte im Überblick', fr: "Aperçu de l'histoire allemande" },
  '79': { de: 'Deutsche Städte und Landschaften', fr: "Villes et paysages d'Allemagne (Le Rhin, Munich)" },
  '80': { de: 'Wien und Österreich', fr: "Vienne et l'Autriche (Culture danubienne)" },
  '81': { de: 'Die Schweiz', fr: 'La Suisse alémanique' },
  '82': { de: 'Johann Wolfgang von Goethe', fr: 'Texte classique : Goethe et Weimar' },
  '83': { de: 'Friedrich Schiller', fr: 'Texte classique : Schiller (Théâtre)' },
  '84': { de: 'Heinrich Heine', fr: 'Poésie et prose : Heinrich Heine (Die Lorelei)' },
  '85': { de: 'Brüder Grimm — Ein Märchen', fr: 'Conte des frères Grimm' },
  '86': { de: 'Theodor Storm', fr: 'Nouvelle littéraire : Theodor Storm' },
  '87': { de: 'Thomas Mann', fr: 'Prose moderne : Thomas Mann' },
  '88': { de: 'Hermann Hesse', fr: 'Prose moderne : Hermann Hesse' },
  '89': { de: 'Bertolt Brecht', fr: 'Théâtre contemporain : Bertolt Brecht' },
  '90': { de: 'Eine neue Welt bringst du uns... (Ernst Wiechert)', fr: 'Texte final : Les Enfants Jeromin (Ernst Wiechert)' },
};
