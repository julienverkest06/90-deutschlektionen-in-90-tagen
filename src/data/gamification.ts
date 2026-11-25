import type { Badge, Rank } from './types';

export const BADGES_CATALOG: readonly Badge[] = [
  { id: 'first_step', icon: '❧', title: 'Premier pas à Cologne', desc: 'Terminer votre toute première leçon.' },
  { id: 'streak_3', icon: '✺', title: 'Assidu du Rhin', desc: "Atteindre une série de 3 bonnes réponses d'affilée." },
  { id: 'perfect_score', icon: '✦', title: 'Sans-faute éditorial', desc: 'Obtenir 3 étoiles sur une leçon.' },
  { id: 'dative_master', icon: '◎', title: 'Maître du Datif', desc: 'Compléter la Leçon 9 (Dans la famille Müller).' },
  { id: 'series_1_half', icon: '✠', title: 'Cap des 10 leçons', desc: 'Compléter au moins 10 leçons.' },
  { id: 'arena_warrior', icon: '❖', title: "Champion de l'Arène", desc: 'Cumuler 500 XP au total.' },
  { id: 'series_2_start', icon: '⟐', title: 'Voyageur Pratique', desc: 'Compléter une leçon de la Série 2 (Leçons 26-75).' },
  { id: 'method_90_master', icon: '♛', title: 'Maître de la Méthode 90', desc: 'Terminer la 90e et dernière leçon !' },
];

export const RANKS: readonly Rank[] = [
  { minXp: 0, title: 'Débutant à Cologne' },
  { minXp: 250, title: 'Promeneur du Rhin' },
  { minXp: 600, title: 'Apprenti Grammairien' },
  { minXp: 1200, title: 'Voyageur en Allemagne' },
  { minXp: 2500, title: 'Lecteur de la Presse' },
  { minXp: 5000, title: 'Maître de la Méthode 90' },
];
