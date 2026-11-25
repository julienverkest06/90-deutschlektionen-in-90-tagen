import { LESSON_ORDER } from '@data/syllabus';

export type SeriesFilter = 'all' | 1 | 2 | 3;
export type TabName = 'text' | 'vocab' | 'arena';

export interface PlayerState {
  currentLessonId: string;
  xp: number;
  streak: number;
  lastActiveDate: string;
  hearts: number;
  completedLessons: Record<string, number>;
  unlockedBadges: string[];
  freeMode: boolean;
  showFrench: boolean;
}

export interface SelectedWord {
  tokenId: number;
  word: string;
}

export interface UIState {
  seriesFilter: SeriesFilter;
  activeTab: TabName;
  qIndex: number;
  sessionXp: number;
  combo: number;
  maxCombo: number;
  mistakes: number;
  hintUsed: boolean;
  answeredCurrent: boolean;
  selectedOrderWords: SelectedWord[];
}

export const STORAGE_KEY = 'methode90_allemand_state_v1';

export function createDefaultState(): PlayerState {
  return {
    currentLessonId: '1',
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toDateString(),
    hearts: 5,
    completedLessons: {},
    unlockedBadges: [],
    freeMode: true,
    showFrench: true,
  };
}

export let state: PlayerState = createDefaultState();

export const uiState: UIState = {
  seriesFilter: 'all',
  activeTab: 'text',
  qIndex: 0,
  sessionXp: 0,
  combo: 0,
  maxCombo: 0,
  mistakes: 0,
  hintUsed: false,
  answeredCurrent: false,
  selectedOrderWords: [],
};

export function loadState(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved) as Partial<PlayerState>;
    state = { ...createDefaultState(), ...parsed };

    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      state.streak = (state.streak || 0) + 1;
      state.lastActiveDate = today;
      state.hearts = 5;
      saveState();
    }
  } catch (err) {
    console.warn('Erreur de lecture localStorage', err);
  }
}

export function saveState(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Erreur d'écriture localStorage", err);
  }
}

export function resetState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Erreur de suppression localStorage', err);
  }
  state = createDefaultState();
}

export function isLessonUnlocked(id: string): boolean {
  if (state.freeMode) return true;
  const idx = LESSON_ORDER.indexOf(id);
  if (idx <= 0) return true;
  const prevId = LESSON_ORDER[idx - 1];
  return Boolean(state.completedLessons[prevId]);
}

export function checkAndUnlockBadges(): void {
  const completedIds = Object.keys(state.completedLessons);
  const unlock = (badgeId: string) => {
    if (!state.unlockedBadges.includes(badgeId)) {
      state.unlockedBadges.push(badgeId);
    }
  };

  if (completedIds.length >= 1) unlock('first_step');
  if (uiState.maxCombo >= 3) unlock('streak_3');
  if (Object.values(state.completedLessons).includes(3)) unlock('perfect_score');
  if (state.completedLessons['9']) unlock('dative_master');
  if (completedIds.length >= 10) unlock('series_1_half');
  if (state.xp >= 500) unlock('arena_warrior');
  if (completedIds.some((id) => parseInt(id, 10) >= 26 && parseInt(id, 10) <= 75)) {
    unlock('series_2_start');
  }
  if (state.completedLessons['90']) unlock('method_90_master');
}
