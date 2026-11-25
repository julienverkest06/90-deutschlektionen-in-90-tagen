import {
  BADGES_CATALOG,
  getLessonData,
  getLessonSeries,
  isAuthenticLesson,
  LESSON_ORDER,
  RANKS,
  SERIES_LABELS,
  SERIES_SIDEBAR_NAMES,
  SYLLABUS_METADATA,
} from '@data/index';
import type { Lesson, SeriesNumber } from '@data/types';
import { ArenaController } from './arena';
import { speakFullLesson, speakGerman, warmupVoices } from './audio';
import {
  isLessonUnlocked,
  loadState,
  resetState,
  saveState,
  state,
  uiState,
} from './state';
import type { SeriesFilter, TabName } from './state';

function animateXpGain(amount: number): void {
  const anchor = document.getElementById('xp-popup-anchor');
  if (!anchor) return;
  const el = document.createElement('div');
  el.className =
    'animate-xp text-xs font-bold text-de-cream bg-de-black border border-de-gold px-2 py-0.5 whitespace-nowrap';
  el.textContent = `+${amount} XP`;
  anchor.appendChild(el);
  window.setTimeout(() => el.remove(), 900);
}

function renderHeaderStats(): void {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];
  for (let i = 0; i < RANKS.length; i++) {
    if (state.xp >= RANKS[i].minXp) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] ?? { minXp: RANKS[i].minXp + 1000, title: RANKS[i].title };
    }
  }

  const progressInLevel = state.xp - currentRank.minXp;
  const levelSpan = nextRank.minXp - currentRank.minXp;
  const pct = Math.min(100, Math.round((progressInLevel / levelSpan) * 100));

  const rankEl = document.getElementById('player-rank');
  const xpTextEl = document.getElementById('player-xp-text');
  const xpBarEl = document.getElementById('player-xp-bar');
  const streakEl = document.getElementById('player-streak');
  const heartsEl = document.getElementById('player-hearts');
  const badgesEl = document.getElementById('badges-count');

  if (rankEl) rankEl.textContent = currentRank.title;
  if (xpTextEl) xpTextEl.textContent = `${state.xp} XP`;
  if (xpBarEl) xpBarEl.style.width = `${pct}%`;
  if (streakEl) streakEl.textContent = String(state.streak);
  if (heartsEl) heartsEl.textContent = String(state.hearts);
  if (badgesEl) badgesEl.textContent = String(state.unlockedBadges.length);
}

function toggleSidebar(): void {
  document.getElementById('sidebar')?.classList.toggle('-translate-x-full');
  document.getElementById('sidebar-overlay')?.classList.toggle('hidden');
}

function toggleFreeMode(): void {
  state.freeMode = !state.freeMode;
  saveState();
  renderSidebar();
  updateRelativeNavButtons(state.currentLessonId);
}

function setSeriesFilter(series: SeriesFilter): void {
  uiState.seriesFilter = series;
  (['all', 1, 2, 3] as const).forEach((key) => {
    const btn = document.getElementById(`filter-${key}`);
    if (!btn) return;
    if (key === series) {
      btn.className = 'py-2 bg-de-black text-white transition cursor-pointer';
    } else {
      btn.className = 'py-2 text-stone-600 hover:bg-stone-100 transition cursor-pointer';
    }
  });
  renderSidebar();
}

function renderSidebar(): void {
  const list = document.getElementById('lessons-list');
  const searchInput = document.getElementById('lesson-search') as HTMLInputElement | null;
  const progressSummary = document.getElementById('progress-summary');
  const modeBtn = document.getElementById('unlock-mode-btn');

  if (!list) return;

  const query = searchInput?.value.trim().toLowerCase() ?? '';
  const completedCount = Object.keys(state.completedLessons).length;
  if (progressSummary) {
    progressSummary.textContent = `${completedCount} / ${LESSON_ORDER.length} complétées`;
  }

  if (modeBtn) {
    if (state.freeMode) {
      modeBtn.className =
        'px-2 py-1 font-semibold border border-stone-300 bg-white text-de-black hover:bg-stone-100 transition flex items-center gap-1.5 cursor-pointer';
      modeBtn.innerHTML = '<span aria-hidden="true">◇</span><span>Accès libre</span>';
    } else {
      modeBtn.className =
        'px-2 py-1 font-semibold border border-de-gold bg-de-gold-light text-de-black transition flex items-center gap-1.5 cursor-pointer';
      modeBtn.innerHTML = '<span aria-hidden="true">◈</span><span>Parcours guidé</span>';
    }
  }

  list.innerHTML = '';
  let currentSeriesHeader: SeriesNumber | null = null;

  LESSON_ORDER.forEach((id) => {
    const meta = SYLLABUS_METADATA[id];
    if (!meta) return;
    const series = getLessonSeries(id);

    if (uiState.seriesFilter !== 'all' && uiState.seriesFilter !== series) return;
    if (
      query &&
      !id.toLowerCase().includes(query) &&
      !meta.de.toLowerCase().includes(query) &&
      !meta.fr.toLowerCase().includes(query)
    ) {
      return;
    }

    if (series !== currentSeriesHeader) {
      currentSeriesHeader = series;
      const header = document.createElement('div');
      header.className =
        'px-2.5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 mb-1';
      header.textContent = SERIES_SIDEBAR_NAMES[series];
      list.appendChild(header);
    }

    const unlocked = isLessonUnlocked(id);
    const stars = state.completedLessons[id] || 0;
    const isActive = state.currentLessonId === id;
    const isAuthentic = isAuthenticLesson(id);

    const item = document.createElement('button');
    item.type = 'button';
    item.disabled = !unlocked;
    item.addEventListener('click', () => {
      selectLesson(id);
      if (window.innerWidth < 1024) toggleSidebar();
    });

    let baseClasses =
      'w-full text-left px-3 py-2.5 transition flex items-center justify-between gap-2 border-l-2 ';
    if (isActive) {
      baseClasses += 'bg-de-black text-de-cream border-l-de-red';
    } else if (!unlocked) {
      baseClasses += 'bg-stone-50/70 text-stone-400 border-l-transparent cursor-not-allowed';
    } else {
      baseClasses += 'bg-white hover:bg-de-cream text-de-black border-l-transparent hover:border-l-stone-400 cursor-pointer';
    }
    item.className = baseClasses;

    const badgeColor = id.includes('bis')
      ? isActive
        ? 'bg-de-gold text-de-black'
        : 'bg-de-gold-light border border-de-gold/40 text-de-black'
      : isActive
        ? 'bg-de-red text-white'
        : 'bg-stone-100 border border-stone-200 text-stone-700';

    const statusHtml = !unlocked
      ? '<span class="text-stone-400" title="Verrouillée">⊗</span>'
      : stars > 0
        ? `<span class="text-de-gold">${'★'.repeat(stars)}</span>`
        : isAuthentic
          ? '<span class="w-1.5 h-1.5 bg-de-red inline-block" title="Leçon intégrale"></span>'
          : '';

    item.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="px-2 py-0.5 text-[11px] font-bold shrink-0 tabular-nums ${badgeColor}">${id}</span>
        <div class="truncate">
          <div class="text-xs font-semibold truncate"></div>
          <div class="text-[11px] truncate ${isActive ? 'text-stone-300' : 'text-stone-500'}"></div>
        </div>
      </div>
      <div class="shrink-0 flex items-center gap-1 text-xs">${statusHtml}</div>
    `;

    const titleDeEl = item.querySelector('.text-xs.font-semibold');
    const titleFrEl = item.querySelector('.text-\\[11px\\].truncate');
    if (titleDeEl) titleDeEl.textContent = meta.de;
    if (titleFrEl) titleFrEl.textContent = meta.fr;

    list.appendChild(item);
  });
}

function renderLessonText(lesson: Lesson): void {
  const container = document.getElementById('lesson-paragraphs');
  if (!container) return;
  container.innerHTML = '';

  lesson.paragraphs.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className =
      'p-4 bg-de-cream/70 hover:bg-de-gold-light/60 border border-stone-200 hover:border-stone-400 transition group';

    const topRow = document.createElement('div');
    topRow.className = 'flex items-start justify-between gap-3';

    const textCol = document.createElement('div');
    textCol.className = 'flex items-start gap-3';

    const numBadge = document.createElement('span');
    numBadge.className =
      'w-6 h-6 bg-de-black text-de-cream text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums';
    numBadge.textContent = String(idx + 1);

    const deText = document.createElement('p');
    deText.className = 'font-serif text-base sm:text-lg font-semibold text-de-black leading-relaxed cursor-pointer';
    deText.textContent = p.de;
    deText.addEventListener('click', () => speakGerman(p.de));

    textCol.append(numBadge, deText);

    const speakBtn = document.createElement('button');
    speakBtn.type = 'button';
    speakBtn.className =
      'px-2.5 py-1.5 bg-white border border-stone-300 hover:border-de-black hover:bg-de-black hover:text-de-cream text-de-black text-sm shrink-0 transition cursor-pointer';
    speakBtn.title = 'Écouter en allemand';
    speakBtn.textContent = '♪';
    speakBtn.addEventListener('click', () => speakGerman(p.de));

    topRow.append(textCol, speakBtn);

    const frText = document.createElement('p');
    frText.className = `fr-translation mt-2.5 pl-9 text-xs sm:text-sm text-stone-600 leading-relaxed${state.showFrench ? '' : ' hidden'}`;
    frText.textContent = p.fr;

    card.append(topRow, frText);
    container.appendChild(card);
  });
}

function syncTranslationToggleButton(): void {
  const btn = document.getElementById('toggle-trans-btn');
  if (btn) {
    btn.textContent = state.showFrench ? 'Masquer français' : 'Afficher français';
  }
}

function toggleTranslationVisibility(): void {
  state.showFrench = !state.showFrench;
  saveState();
  syncTranslationToggleButton();
  document.querySelectorAll('.fr-translation').forEach((el) => {
    el.classList.toggle('hidden', !state.showFrench);
  });
}

function renderVocabAndGrammar(lesson: Lesson): void {
  const countBadge = document.getElementById('vocab-count-badge');
  if (countBadge) countBadge.textContent = `${lesson.vocab.length} termes`;

  const grid = document.getElementById('vocab-cards-grid');
  if (grid) {
    grid.innerHTML = '';
    lesson.vocab.forEach((v) => {
      const card = document.createElement('div');
      card.className =
        'cursor-pointer p-4 border border-stone-300 bg-white hover:border-de-black transition flex flex-col justify-between min-h-[108px] select-none';

      const header = document.createElement('div');
      header.className = 'flex items-center justify-between gap-2';

      const info = document.createElement('span');
      info.className =
        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-stone-200 bg-de-cream text-stone-600';
      info.textContent = v.info;

      const speakBtn = document.createElement('button');
      speakBtn.type = 'button';
      speakBtn.className = 'px-2 py-1 border border-stone-200 hover:border-de-black text-xs transition cursor-pointer';
      speakBtn.title = 'Prononcer';
      speakBtn.textContent = '♪';
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakGerman(v.de.split('(')[0].trim());
      });

      header.append(info, speakBtn);

      const body = document.createElement('div');
      body.className = 'mt-2';

      const deEl = document.createElement('p');
      deEl.className = 'v-de font-serif font-bold text-base';
      deEl.textContent = v.de;

      const frEl = document.createElement('p');
      frEl.className = 'v-fr hidden font-semibold text-sm sm:text-base text-de-gold-light';
      frEl.textContent = v.fr;

      body.append(deEl, frEl);

      const hint = document.createElement('span');
      hint.className = 'text-[10px] text-stone-400 mt-2 uppercase tracking-wider';
      hint.textContent = 'Cliquer pour retourner';

      card.addEventListener('click', () => {
        card.classList.toggle('bg-de-black');
        card.classList.toggle('text-de-cream');
        card.classList.toggle('border-de-black');
        frEl.classList.toggle('hidden');
        deEl.classList.toggle('hidden');
      });

      card.append(header, body, hint);
      grid.appendChild(card);
    });
  }

  const grammarContainer = document.getElementById('lesson-grammar-content');
  if (grammarContainer) {
    grammarContainer.innerHTML = lesson.grammar
      .map(
        (g) => `
        <div class="p-4 bg-de-cream/70 border border-stone-200 border-l-2 border-l-de-red">
          <h4 class="font-bold text-de-black mb-1.5 flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-de-red inline-block"></span>
            <span>${g.title}</span>
          </h4>
          <p class="text-stone-700 leading-relaxed">${g.body}</p>
        </div>
      `,
      )
      .join('');
  }
}

function switchTab(tabName: TabName): void {
  uiState.activeTab = tabName;
  (['text', 'vocab', 'arena'] as const).forEach((t) => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const content = document.getElementById(`tab-content-${t}`);
    if (!btn || !content) return;
    if (t === tabName) {
      btn.className =
        'py-3 px-3 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 bg-white text-de-black border-b-2 border-b-de-red cursor-pointer';
      content.classList.remove('hidden');
    } else {
      btn.className =
        'py-3 px-3 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 text-stone-600 hover:text-de-black hover:bg-stone-50 border-b-2 border-b-transparent cursor-pointer';
      content.classList.add('hidden');
    }
  });
}

function updateRelativeNavButtons(id: string): void {
  const idx = LESSON_ORDER.indexOf(id);
  const prevBtn = document.getElementById('prev-lesson-btn') as HTMLButtonElement | null;
  const nextBtn = document.getElementById('next-lesson-btn') as HTMLButtonElement | null;
  if (prevBtn) prevBtn.disabled = idx <= 0;
  const nextId = LESSON_ORDER[idx + 1];
  if (nextBtn) nextBtn.disabled = !nextId || !isLessonUnlocked(nextId);
}

const arena = new ArenaController({
  onStatsUpdated: renderHeaderStats,
  onSidebarUpdated: () => {
    renderSidebar();
    updateRelativeNavButtons(state.currentLessonId);
  },
  onAnimateXp: animateXpGain,
  onNavigateLesson: (nextId, tab) => {
    selectLesson(nextId);
    switchTab(tab);
  },
});

function selectLesson(id: string): void {
  state.currentLessonId = id;
  saveState();

  const lesson = getLessonData(id);

  const badgeNum = document.getElementById('lesson-badge-num');
  const seriesLabel = document.getElementById('lesson-series-label');
  const titleDe = document.getElementById('lesson-title-de');
  const titleFr = document.getElementById('lesson-title-fr');
  const authBadge = document.getElementById('lesson-authentic-badge');
  const starsDisplay = document.getElementById('lesson-stars-display');
  const proverbDe = document.getElementById('lesson-proverb-de');
  const proverbFr = document.getElementById('lesson-proverb-fr');
  const pronunciationEl = document.getElementById('lesson-pronunciation');

  if (badgeNum) badgeNum.textContent = `LEÇON ${lesson.id.toUpperCase()}`;
  if (seriesLabel) seriesLabel.textContent = SERIES_LABELS[lesson.series];
  if (titleDe) titleDe.textContent = lesson.titleDe;
  if (titleFr) titleFr.textContent = lesson.titleFr;

  if (authBadge) {
    authBadge.classList.toggle('hidden', !lesson.authentic);
  }

  const stars = state.completedLessons[id] || 0;
  if (starsDisplay) {
    starsDisplay.innerHTML = [1, 2, 3]
      .map(
        (s) =>
          `<span class="${s <= stars ? 'text-de-gold' : 'text-stone-300'} text-base">${s <= stars ? '★' : '☆'}</span>`,
      )
      .join('');
  }

  if (proverbDe) proverbDe.textContent = lesson.proverbDe;
  if (proverbFr) proverbFr.textContent = lesson.proverbFr;

  renderLessonText(lesson);
  if (pronunciationEl) pronunciationEl.textContent = lesson.pronunciation;

  renderVocabAndGrammar(lesson);
  arena.init(lesson);

  updateRelativeNavButtons(id);
  renderSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateRelativeLesson(delta: number): void {
  const idx = LESSON_ORDER.indexOf(state.currentLessonId);
  const targetId = LESSON_ORDER[idx + delta];
  if (targetId && isLessonUnlocked(targetId)) {
    selectLesson(targetId);
  }
}

function openBadgesModal(): void {
  const grid = document.getElementById('badges-grid');
  if (grid) {
    grid.innerHTML = BADGES_CATALOG.map((b) => {
      const unlocked = state.unlockedBadges.includes(b.id);
      return `
        <div class="p-3.5 border ${unlocked ? 'border-de-gold bg-de-gold-light' : 'border-stone-200 bg-stone-50 opacity-55'} flex items-start gap-3">
          <div class="text-2xl leading-none ${unlocked ? 'text-de-black' : 'text-stone-400'}">${b.icon}</div>
          <div>
            <div class="text-xs font-bold text-de-black">${b.title}</div>
            <p class="text-[11px] text-stone-600 mt-0.5">${b.desc}</p>
            <span class="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${unlocked ? 'border-de-black bg-de-black text-de-cream' : 'border-stone-300 bg-white text-stone-500'}">
              ${unlocked ? 'Débloqué' : 'Verrouillé'}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  const modal = document.getElementById('badges-modal');
  modal?.classList.remove('hidden');
  modal?.classList.add('flex');
}

function closeBadgesModal(): void {
  const modal = document.getElementById('badges-modal');
  modal?.classList.add('hidden');
  modal?.classList.remove('flex');
}

function closeCustomDialog(): void {
  const dlg = document.getElementById('custom-dialog');
  dlg?.classList.add('hidden');
  dlg?.classList.remove('flex');
}

function confirmResetProgress(): void {
  const dlg = document.getElementById('custom-dialog');
  const titleEl = document.getElementById('dialog-title');
  const msgEl = document.getElementById('dialog-message');
  const actionsEl = document.getElementById('dialog-actions');

  if (titleEl) titleEl.textContent = 'Réinitialiser la progression ?';
  if (msgEl) msgEl.textContent = 'Tous vos points XP, étoiles et trophées seront remis à zéro.';
  if (actionsEl) {
    actionsEl.innerHTML = '';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className =
      'px-4 py-2 border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer';
    cancelBtn.textContent = 'Annuler';
    cancelBtn.addEventListener('click', closeCustomDialog);

    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className =
      'px-4 py-2 bg-de-red text-white text-xs font-bold hover:bg-de-red-dark cursor-pointer';
    confirmBtn.textContent = 'Tout effacer';
    confirmBtn.addEventListener('click', () => {
      resetState();
      closeCustomDialog();
      syncTranslationToggleButton();
      renderHeaderStats();
      selectLesson('1');
    });

    actionsEl.append(cancelBtn, confirmBtn);
  }

  dlg?.classList.remove('hidden');
  dlg?.classList.add('flex');
}

function bindEvents(): void {
  document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay')?.addEventListener('click', toggleSidebar);
  document.getElementById('brand-home-btn')?.addEventListener('click', () => selectLesson('1'));
  document.getElementById('open-badges-btn')?.addEventListener('click', openBadgesModal);

  document.getElementById('lesson-search')?.addEventListener('input', renderSidebar);
  document.getElementById('unlock-mode-btn')?.addEventListener('click', toggleFreeMode);
  document.getElementById('reset-progress-btn')?.addEventListener('click', confirmResetProgress);

  document.querySelectorAll<HTMLButtonElement>('[data-series-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const raw = btn.dataset.seriesFilter;
      const filter: SeriesFilter = raw === '1' || raw === '2' || raw === '3' ? (Number(raw) as 1 | 2 | 3) : 'all';
      setSeriesFilter(filter);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab as TabName | undefined;
      if (tab) switchTab(tab);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-switch-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.switchTab as TabName | undefined;
      if (tab) switchTab(tab);
    });
  });

  document.getElementById('speak-full-lesson-btn')?.addEventListener('click', () => {
    speakFullLesson(getLessonData(state.currentLessonId));
  });

  document.getElementById('toggle-trans-btn')?.addEventListener('click', toggleTranslationVisibility);

  document.getElementById('prev-lesson-btn')?.addEventListener('click', () => navigateRelativeLesson(-1));
  document.getElementById('next-lesson-btn')?.addEventListener('click', () => navigateRelativeLesson(1));

  document.querySelectorAll<HTMLButtonElement>('[data-close-badges]').forEach((btn) => {
    btn.addEventListener('click', closeBadgesModal);
  });

  document.getElementById('badges-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeBadgesModal();
  });

  document.getElementById('custom-dialog')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCustomDialog();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBadgesModal();
      closeCustomDialog();
    }
  });
}

function init(): void {
  loadState();
  bindEvents();
  syncTranslationToggleButton();
  renderHeaderStats();
  selectLesson(state.currentLessonId || '1');
  warmupVoices();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
