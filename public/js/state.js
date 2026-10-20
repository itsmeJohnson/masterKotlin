/* ==========================================================================
   State Management & Progress Persistence
   Tracks lesson progress, exercise mastery, readiness score, and mistakes.
   ========================================================================== */

const STORAGE_KEY = 'kotlin_android_mastery_lab_v1';

export class AppState {
  static listeners = [];

  static data = {
    theme: 'dark',
    currentLessonId: 'lesson-kotlin-fundamentals-intro',
    currentMode: 'dbms', // 'dbms', 'mcqs', 'dsa', 'assessment', 'learn', 'trace', 'practise', 'review', 'interview'
    bookmarks: {},
    masteryMap: {}, // lessonId -> 'not_started' | 'learning' | 'practising' | 'needs_revision' | 'mastered'
    stats: {
      conceptsStarted: 0,
      conceptsCompleted: 0,
      problemsAttempted: 0,
      problemsSolved: 0,
      totalExecutionRuns: 0,
      timeSpentSeconds: 0,
      startTime: Date.now()
    },
    codeDrafts: {}, // exerciseId -> string
    weakTopics: ['Sliding Window Edge Bounds', 'Off-by-one Index Calculations'],
    repeatedMistakes: [],
    scenarioScores: {} // scenarioId -> { score, reasoning, timestamp }
  };

  /**
   * Initializes state from LocalStorage or defaults
   */
  static init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = { ...this.data, ...parsed };
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }

    // Ensure initial lesson has at least 'learning' status if unset
    if (!this.data.masteryMap['lesson-kotlin-fundamentals-intro']) {
      this.data.masteryMap['lesson-kotlin-fundamentals-intro'] = 'learning';
    }

    // Apply theme
    document.documentElement.setAttribute('data-theme', this.data.theme);

    // Start timer for time spent
    setInterval(() => {
      this.data.stats.timeSpentSeconds += 5;
      this.save();
    }, 5000);
  }

  static subscribe(fn) {
    this.listeners.push(fn);
  }

  static notify() {
    for (const listener of this.listeners) {
      listener(this.data);
    }
    this.save();
  }

  static save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  static toggleTheme() {
    this.data.theme = this.data.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.data.theme);
    this.notify();
  }

  static setLesson(lessonId) {
    this.data.currentLessonId = lessonId;
    if (!this.data.masteryMap[lessonId] || this.data.masteryMap[lessonId] === 'not_started') {
      this.data.masteryMap[lessonId] = 'learning';
      this.data.stats.conceptsStarted++;
    }
    this.notify();
  }

  static setMode(mode) {
    if (!mode) return;
    this.data.currentMode = mode;
    try {
      if (window.location.hash !== `#${mode}`) {
        window.history.replaceState(null, '', `#${mode}`);
      }
    } catch (e) {}
    this.notify();
  }

  static toggleBookmark(lessonId) {
    if (this.data.bookmarks[lessonId]) {
      delete this.data.bookmarks[lessonId];
    } else {
      this.data.bookmarks[lessonId] = true;
    }
    this.notify();
  }

  static setMastery(lessonId, status) {
    this.data.masteryMap[lessonId] = status;
    if (status === 'mastered') {
      this.data.stats.conceptsCompleted++;
    }
    this.notify();
  }

  static recordExerciseAttempt(exerciseId, passed) {
    this.data.stats.problemsAttempted++;
    if (passed) {
      this.data.stats.problemsSolved++;
    }
    this.notify();
  }

  static recordMistake(tag, explanation) {
    this.data.repeatedMistakes.unshift({
      tag,
      explanation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (this.data.repeatedMistakes.length > 20) {
      this.data.repeatedMistakes.pop();
    }
    if (!this.data.weakTopics.includes(tag)) {
      this.data.weakTopics.push(tag);
    }
    this.notify();
  }

  static saveCodeDraft(exerciseId, code) {
    this.data.codeDrafts[exerciseId] = code;
    this.save();
  }

  static getReadinessScore() {
    const solved = this.data.stats.problemsSolved || 0;
    const completed = this.data.stats.conceptsCompleted || 0;
    const attempted = this.data.stats.problemsAttempted || 0;
    const accuracy = attempted > 0 ? (solved / attempted) : 0;

    // Weighted readiness index
    const score = Math.min(100, Math.round((completed * 5) + (solved * 10) + (accuracy * 20)));
    return Math.max(12, score); // Base readiness baseline
  }

  static resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  static exportProgressJson() {
    return JSON.stringify(this.data, null, 2);
  }
}
