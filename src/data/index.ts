import type { Lesson } from './types';
import { buildFallbackLesson } from './fallback';

export * from './types';
export * from './syllabus';
export * from './gamification';

/**
 * Charge automatiquement toutes les leçons détaillées au format JSON depuis `src/data/lessons/`.
 * Pour enrichir une nouvelle leçon, il suffit d'ajouter son fichier JSON dans ce dossier.
 */
const lessonModules = import.meta.glob<{ default: Lesson }>('./lessons/*.json', {
  eager: true,
});

export const DETAILED_LESSONS: Record<string, Lesson> = {};

for (const mod of Object.values(lessonModules)) {
  const lesson = mod.default;
  if (lesson?.id) {
    DETAILED_LESSONS[lesson.id] = lesson;
  }
}

export function isAuthenticLesson(id: string): boolean {
  return Boolean(DETAILED_LESSONS[id]);
}

export function getLessonData(id: string): Lesson {
  return DETAILED_LESSONS[id] ?? buildFallbackLesson(id);
}
