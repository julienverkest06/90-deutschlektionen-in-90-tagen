export type SeriesNumber = 1 | 2 | 3;

export interface Paragraph {
  de: string;
  fr: string;
}

export interface VocabItem {
  de: string;
  fr: string;
  info: string;
}

export interface GrammarRule {
  title: string;
  body: string;
}

export interface ChoiceExercise {
  type: 'choice';
  prompt: string;
  options: string[];
  answer: string;
  hint: string;
  explanation: string;
}

export interface FillExercise {
  type: 'fill';
  prompt: string;
  answer: string;
  hint: string;
  explanation: string;
}

export interface OrderExercise {
  type: 'order';
  prompt: string;
  words: string[];
  answer: string;
  hint: string;
  explanation: string;
}

export type Exercise = ChoiceExercise | FillExercise | OrderExercise;

export interface Lesson {
  id: string;
  series: SeriesNumber;
  authentic: boolean;
  isReview?: boolean;
  titleDe: string;
  titleFr: string;
  proverbDe: string;
  proverbFr: string;
  paragraphs: Paragraph[];
  pronunciation: string;
  vocab: VocabItem[];
  grammar: GrammarRule[];
  exercises: Exercise[];
}

export interface SyllabusEntry {
  de: string;
  fr: string;
}

export interface Badge {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface Rank {
  minXp: number;
  title: string;
}
