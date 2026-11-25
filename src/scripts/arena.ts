import { getLessonData, LESSON_ORDER } from '@data/index';
import type { Exercise, Lesson } from '@data/types';
import { playTone, speakGerman } from './audio';
import { checkAndUnlockBadges, saveState, state, uiState } from './state';
import type { TabName } from './state';

export interface ArenaCallbacks {
  onStatsUpdated: () => void;
  onSidebarUpdated: () => void;
  onAnimateXp: (amount: number) => void;
  onNavigateLesson: (id: string, tab: TabName) => void;
}

const SPECIAL_CHARS = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß'];

function normalizeAnswer(str: string): string {
  return str.trim().replace(/\s+/g, ' ').replace(/[.?!]+$/, '').toLowerCase();
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export class ArenaController {
  private callbacks: ArenaCallbacks;

  constructor(callbacks: ArenaCallbacks) {
    this.callbacks = callbacks;
  }

  public init(_lesson: Lesson): void {
    uiState.qIndex = 0;
    uiState.sessionXp = 0;
    uiState.combo = 0;
    uiState.maxCombo = 0;
    uiState.mistakes = 0;
    this.renderCurrentQuestion();
  }

  private renderCurrentQuestion(): void {
    const lesson = getLessonData(state.currentLessonId);
    const exercises = lesson.exercises;
    const total = exercises.length;

    if (uiState.qIndex >= total) {
      this.renderVictory(lesson);
      return;
    }

    const q = exercises[uiState.qIndex];
    uiState.hintUsed = false;
    uiState.answeredCurrent = false;
    uiState.selectedOrderWords = [];

    const qCounter = document.getElementById('arena-q-counter');
    const progressBar = document.getElementById('arena-progress-bar');
    const sessionXpEl = document.getElementById('arena-session-xp');
    const comboBadge = document.getElementById('arena-combo-badge');
    const stage = document.getElementById('arena-question-stage');

    if (!stage) return;

    if (qCounter) qCounter.textContent = `Question ${uiState.qIndex + 1} / ${total}`;
    if (progressBar) progressBar.style.width = `${Math.round((uiState.qIndex / total) * 100)}%`;
    if (sessionXpEl) sessionXpEl.textContent = `+${uiState.sessionXp} XP`;

    if (comboBadge) {
      if (uiState.combo >= 2) {
        comboBadge.classList.remove('hidden');
        comboBadge.textContent = `✶ Combo ×${uiState.combo}`;
      } else {
        comboBadge.classList.add('hidden');
      }
    }

    const typeLabel =
      q.type === 'choice'
        ? 'Choix multiple'
        : q.type === 'fill'
          ? 'Expression écrite'
          : 'Construction de phrase';

    stage.innerHTML = `
      <div class="animate-pop">
        <div class="flex items-start justify-between gap-3">
          <span class="inline-block px-2.5 py-1 border border-de-red/30 bg-[#FAF3F2] text-de-red text-[11px] font-bold uppercase tracking-widest">
            ${typeLabel}
          </span>
          <button id="hint-btn" type="button" class="text-xs font-semibold text-de-black bg-de-gold-light hover:bg-stone-200/70 border border-stone-300 px-3 py-1.5 transition flex items-center gap-1.5 cursor-pointer">
            <span class="text-de-gold" aria-hidden="true">✧</span>
            <span>Indice grammatical (-5 XP)</span>
          </button>
        </div>

        <h4 class="font-serif text-lg sm:text-xl font-bold text-de-black mt-4 leading-snug">${escapeHtml(q.prompt)}</h4>

        <div id="hint-box" class="hidden mt-3 p-3 border border-stone-300 border-l-2 border-l-de-gold bg-de-gold-light text-xs text-stone-800 font-medium">
          <span class="text-de-gold mr-1" aria-hidden="true">✧</span><strong>Rappel :</strong> ${escapeHtml(q.hint)}
        </div>

        <div id="arena-interaction-slot"></div>

        <div id="feedback-banner" class="hidden mt-6 p-4 border"></div>
      </div>
    `;

    document.getElementById('hint-btn')?.addEventListener('click', () => this.revealHint());

    const slot = document.getElementById('arena-interaction-slot');
    if (!slot) return;

    if (q.type === 'choice') {
      this.renderChoiceInteraction(slot, q);
    } else if (q.type === 'fill') {
      this.renderFillInteraction(slot, q);
    } else if (q.type === 'order') {
      this.renderOrderInteraction(slot, q);
    }
  }

  private renderChoiceInteraction(slot: HTMLElement, q: Extract<Exercise, { type: 'choice' }>): void {
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.option = opt;
      btn.className =
        'choice-opt text-left p-4 border border-stone-300 hover:border-de-black bg-white hover:bg-de-cream font-semibold text-sm sm:text-base transition flex items-center gap-3 cursor-pointer';
      btn.innerHTML = `
        <span class="w-7 h-7 border border-stone-300 bg-de-cream text-stone-700 text-xs font-bold flex items-center justify-center shrink-0">${String.fromCharCode(65 + idx)}</span>
        <span>${escapeHtml(opt)}</span>
      `;
      btn.addEventListener('click', () => this.submitChoiceAnswer(btn, opt, q));
      grid.appendChild(btn);
    });

    slot.appendChild(grid);
  }

  private renderFillInteraction(slot: HTMLElement, q: Extract<Exercise, { type: 'fill' }>): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'mt-5 space-y-3';

    const charBar = document.createElement('div');
    charBar.className = 'flex flex-wrap gap-1.5 mb-2';
    const label = document.createElement('span');
    label.className = 'text-[11px] text-stone-500 self-center mr-1';
    label.textContent = 'Caractères spéciaux :';
    charBar.appendChild(label);

    SPECIAL_CHARS.forEach((ch) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'px-2.5 py-1 border border-stone-300 bg-de-cream hover:bg-stone-200 text-xs font-bold text-de-black transition cursor-pointer';
      btn.textContent = ch;
      btn.addEventListener('click', () => this.insertSpecialChar(ch));
      charBar.appendChild(btn);
    });

    const formRow = document.createElement('div');
    formRow.className = 'flex flex-col sm:flex-row gap-2';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'fill-input';
    input.placeholder = 'Tapez votre réponse ici...';
    input.className =
      'flex-1 px-4 py-3 border border-stone-400 focus:border-de-black focus:outline-none text-base font-medium bg-white';
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.submitFillAnswer(q);
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.id = 'submit-fill-btn';
    submitBtn.className =
      'px-6 py-3 bg-de-black hover:bg-stone-800 text-de-cream font-semibold text-sm transition cursor-pointer';
    submitBtn.textContent = 'Valider';
    submitBtn.addEventListener('click', () => this.submitFillAnswer(q));

    formRow.append(input, submitBtn);
    wrapper.append(charBar, formRow);
    slot.appendChild(wrapper);
  }

  private renderOrderInteraction(slot: HTMLElement, q: Extract<Exercise, { type: 'order' }>): void {
    const shuffled = [...q.words].sort(() => Math.random() - 0.5);

    const wrapper = document.createElement('div');
    wrapper.className = 'mt-5 space-y-4';

    const dropzone = document.createElement('div');
    dropzone.id = 'order-dropzone';
    dropzone.className =
      'min-h-[56px] p-3 bg-de-cream border border-dashed border-stone-400 flex flex-wrap gap-2 items-center';
    dropzone.innerHTML =
      '<span class="text-xs text-stone-400 italic">Cliquez sur les mots ci-dessous dans le bon ordre...</span>';

    const wordbank = document.createElement('div');
    wordbank.id = 'order-wordbank';
    wordbank.className = 'flex flex-wrap gap-2';

    shuffled.forEach((word, tokenId) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'px-3.5 py-2 bg-white border border-stone-300 hover:border-de-black font-semibold text-sm text-de-black transition cursor-pointer';
      btn.textContent = word;
      btn.addEventListener('click', () => this.toggleOrderWord(btn, tokenId, word));
      wordbank.appendChild(btn);
    });

    const actionRow = document.createElement('div');
    actionRow.className = 'flex justify-end';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.id = 'submit-order-btn';
    submitBtn.className =
      'px-6 py-2.5 bg-de-black hover:bg-stone-800 text-de-cream font-semibold text-sm transition cursor-pointer';
    submitBtn.textContent = "Vérifier l'ordre";
    submitBtn.addEventListener('click', () => this.submitOrderAnswer(q));

    actionRow.appendChild(submitBtn);
    wrapper.append(dropzone, wordbank, actionRow);
    slot.appendChild(wrapper);
  }

  private revealHint(): void {
    if (uiState.hintUsed || uiState.answeredCurrent) return;
    uiState.hintUsed = true;
    document.getElementById('hint-box')?.classList.remove('hidden');
    document.getElementById('hint-btn')?.classList.add('opacity-50', 'cursor-not-allowed');
  }

  private insertSpecialChar(ch: string): void {
    const inp = document.getElementById('fill-input') as HTMLInputElement | null;
    if (!inp || inp.disabled) return;
    const start = inp.selectionStart ?? inp.value.length;
    inp.value = inp.value.slice(0, start) + ch + inp.value.slice(start);
    inp.focus();
    inp.setSelectionRange(start + ch.length, start + ch.length);
  }

  private toggleOrderWord(btn: HTMLButtonElement, tokenId: number, word: string): void {
    if (uiState.answeredCurrent) return;
    const dropzone = document.getElementById('order-dropzone');
    if (!dropzone) return;

    if (btn.dataset.selected === 'true') {
      btn.dataset.selected = 'false';
      btn.classList.remove('opacity-30');
      const idx = uiState.selectedOrderWords.findIndex((item) => item.tokenId === tokenId);
      if (idx > -1) uiState.selectedOrderWords.splice(idx, 1);
    } else {
      btn.dataset.selected = 'true';
      btn.classList.add('opacity-30');
      uiState.selectedOrderWords.push({ tokenId, word });
    }

    if (uiState.selectedOrderWords.length === 0) {
      dropzone.innerHTML =
        '<span class="text-xs text-stone-400 italic">Cliquez sur les mots ci-dessous dans le bon ordre...</span>';
    } else {
      dropzone.innerHTML = uiState.selectedOrderWords
        .map(
          (item) =>
            `<span class="px-3 py-1.5 bg-de-black text-de-cream font-semibold text-sm">${escapeHtml(item.word)}</span>`,
        )
        .join('');
    }
  }

  private submitChoiceAnswer(
    btn: HTMLButtonElement,
    chosen: string,
    q: Extract<Exercise, { type: 'choice' }>,
  ): void {
    if (uiState.answeredCurrent) return;
    const isCorrect = chosen === q.answer;

    document.querySelectorAll<HTMLButtonElement>('.choice-opt').forEach((b) => {
      b.disabled = true;
      if (b.dataset.option === q.answer) {
        b.classList.add('border-[#2D5A43]', 'bg-[#F2F6F4]');
      }
    });

    if (!isCorrect) {
      btn.classList.add('border-de-red', 'bg-[#FAF3F2]', 'animate-shake');
    }

    this.handleResult(isCorrect, q);
  }

  private submitFillAnswer(q: Extract<Exercise, { type: 'fill' }>): void {
    if (uiState.answeredCurrent) return;
    const inp = document.getElementById('fill-input') as HTMLInputElement | null;
    if (!inp || !inp.value.trim()) return;

    const isCorrect = normalizeAnswer(inp.value) === normalizeAnswer(q.answer);
    inp.disabled = true;
    const submitBtn = document.getElementById('submit-fill-btn') as HTMLButtonElement | null;
    if (submitBtn) submitBtn.disabled = true;

    inp.classList.add(isCorrect ? 'border-[#2D5A43]' : 'border-de-red');
    if (!isCorrect) inp.classList.add('animate-shake');

    this.handleResult(isCorrect, q);
  }

  private submitOrderAnswer(q: Extract<Exercise, { type: 'order' }>): void {
    if (uiState.answeredCurrent || uiState.selectedOrderWords.length === 0) return;
    const constructed = uiState.selectedOrderWords.map((item) => item.word).join(' ');
    const isCorrect = normalizeAnswer(constructed) === normalizeAnswer(q.answer);

    const submitBtn = document.getElementById('submit-order-btn') as HTMLButtonElement | null;
    if (submitBtn) submitBtn.disabled = true;

    this.handleResult(isCorrect, q);
  }

  private handleResult(isCorrect: boolean, q: Exercise): void {
    uiState.answeredCurrent = true;
    const banner = document.getElementById('feedback-banner');
    if (!banner) return;
    banner.classList.remove('hidden');

    if (isCorrect) {
      playTone('success');
      uiState.combo += 1;
      if (uiState.combo > uiState.maxCombo) uiState.maxCombo = uiState.combo;

      const basePoints = uiState.hintUsed ? 15 : 20;
      const comboBonus = uiState.combo >= 2 ? 5 : 0;
      const earned = basePoints + comboBonus;

      uiState.sessionXp += earned;
      state.xp += earned;
      this.callbacks.onAnimateXp(earned);

      if (/[äöüß]|der |die |das |ich |er |sie |wir |ist |hat |sind /i.test(q.answer)) {
        speakGerman(q.answer.replace(/\.\.\./g, ' '));
      }

      banner.className =
        'mt-6 p-4 border border-[#2D5A43] border-l-2 bg-[#F2F6F4] text-[#1A3829] animate-pop';
      banner.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="font-bold text-sm flex items-center gap-2">
              <span>✓ Ausgezeichnet ! (+${earned} XP)</span>
              ${uiState.combo >= 2 ? `<span class="px-2 py-0.5 border border-de-gold bg-de-gold-light text-de-black text-[11px]">✶ Combo ×${uiState.combo}</span>` : ''}
            </div>
            <p class="text-xs sm:text-sm mt-1 text-[#234836]">${escapeHtml(q.explanation)}</p>
          </div>
          <button id="arena-next-btn" type="button" class="px-5 py-2.5 bg-[#2D5A43] hover:bg-[#224533] text-white font-semibold text-xs sm:text-sm shrink-0 transition cursor-pointer">
            Continuer →
          </button>
        </div>
      `;
    } else {
      playTone('error');
      uiState.combo = 0;
      uiState.mistakes += 1;
      state.hearts = Math.max(1, state.hearts - 1);

      banner.className =
        'mt-6 p-4 border border-de-red border-l-2 bg-[#FAF3F2] text-de-black animate-pop';
      banner.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="font-bold text-sm text-de-red">✕ Pas tout à fait...</div>
            <p class="text-xs sm:text-sm mt-1"><strong>Réponse attendue :</strong> ${escapeHtml(q.answer)}</p>
            <p class="text-xs text-stone-700 mt-0.5">${escapeHtml(q.explanation)}</p>
          </div>
          <button id="arena-next-btn" type="button" class="px-5 py-2.5 bg-de-red hover:bg-de-red-dark text-white font-semibold text-xs sm:text-sm shrink-0 transition cursor-pointer">
            Question suivante →
          </button>
        </div>
      `;
    }

    document.getElementById('arena-next-btn')?.addEventListener('click', () => {
      uiState.qIndex += 1;
      this.renderCurrentQuestion();
    });

    checkAndUnlockBadges();
    saveState();
    this.callbacks.onStatsUpdated();
  }

  private renderVictory(lesson: Lesson): void {
    playTone('victory');
    const progressBar = document.getElementById('arena-progress-bar');
    if (progressBar) progressBar.style.width = '100%';

    const stars = uiState.mistakes === 0 ? 3 : uiState.mistakes === 1 ? 2 : 1;
    const prevStars = state.completedLessons[lesson.id] || 0;
    if (stars > prevStars) {
      state.completedLessons[lesson.id] = stars;
    }

    const completionBonus = 30;
    state.xp += completionBonus;
    uiState.sessionXp += completionBonus;
    this.callbacks.onAnimateXp(completionBonus);

    checkAndUnlockBadges();
    saveState();
    this.callbacks.onStatsUpdated();
    this.callbacks.onSidebarUpdated();

    const idx = LESSON_ORDER.indexOf(lesson.id);
    const nextId = LESSON_ORDER[idx + 1];
    const accuracy = Math.max(
      0,
      Math.round(((lesson.exercises.length - uiState.mistakes) / lesson.exercises.length) * 100),
    );

    const stage = document.getElementById('arena-question-stage');
    if (!stage) return;

    stage.innerHTML = `
      <div class="text-center py-6 space-y-5 animate-pop">
        <div class="inline-flex items-center justify-center gap-2 text-3xl sm:text-4xl">
          ${[1, 2, 3]
            .map(
              (s) =>
                `<span class="${s <= stars ? 'text-de-gold' : 'text-stone-300'}">${s <= stars ? '★' : '☆'}</span>`,
            )
            .join('')}
        </div>

        <div>
          <h3 class="font-serif text-2xl sm:text-3xl font-bold text-de-black">Leçon ${escapeHtml(lesson.id)} maîtrisée !</h3>
          <p class="text-sm text-stone-600 mt-1">${escapeHtml(lesson.proverbDe)} — <em>${escapeHtml(lesson.proverbFr)}</em></p>
        </div>

        <div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div class="p-3 bg-de-cream border border-stone-300">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-stone-500">XP gagnés</div>
            <div class="text-lg font-extrabold text-de-red tabular-nums">+${uiState.sessionXp}</div>
          </div>
          <div class="p-3 bg-de-cream border border-stone-300">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Meilleur Combo</div>
            <div class="text-lg font-extrabold text-de-black tabular-nums">×${Math.max(1, uiState.maxCombo)}</div>
          </div>
          <div class="p-3 bg-de-cream border border-stone-300">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Précision</div>
            <div class="text-lg font-extrabold text-[#2D5A43] tabular-nums">${accuracy}%</div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button id="arena-replay-btn" type="button" class="px-5 py-3 border border-stone-400 hover:bg-stone-100 font-semibold text-sm text-de-black transition cursor-pointer">
            ↺ Rejouer les exercices
          </button>
          ${
            nextId
              ? `<button id="arena-next-lesson-btn" type="button" class="px-6 py-3 bg-de-black hover:bg-stone-800 text-de-cream font-semibold text-sm transition cursor-pointer">
                  Passer à la Leçon ${escapeHtml(nextId)} →
                </button>`
              : ''
          }
        </div>
      </div>
    `;

    document.getElementById('arena-replay-btn')?.addEventListener('click', () => {
      this.init(getLessonData(lesson.id));
    });

    if (nextId) {
      document.getElementById('arena-next-lesson-btn')?.addEventListener('click', () => {
        this.callbacks.onNavigateLesson(nextId, 'text');
      });
    }
  }
}
