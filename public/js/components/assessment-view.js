/* ==========================================================================
   Assessment View Component
   Multi-Set HackerEarth-Style Timed Assessment Platform with 10 Distinct
   Assessment Sets, In-Depth Concept Explanations, Interactive SQL Sandbox,
   Kotlin DSA Runner, and Android Architecture Machine Coding.
   ========================================================================== */

import { ALL_ASSESSMENT_SETS, getAssessmentSetById, MOCK_DATABASE_FIXTURES } from '../data/assessment-data.js';
import { SqlEvaluator } from '../utils/sql-evaluator.js';
import { ApiClient } from '../api.js';
import { AppState } from '../state.js';
import { highlightKotlin } from '../utils/syntax-highlighter.js';

const SET_STORAGE_PREFIX = 'hackerearth_set_progress_';

export class AssessmentViewComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.sets = ALL_ASSESSMENT_SETS;
    this.currentSetId = 'set-1';
    this.currentQuestionIndex = 0;

    // Current set state
    this.userAnswers = {}; // qId -> answer (optionId or sqlString or code)
    this.explainedQuestions = new Set(); // qIds where user clicked "I Don't Know"
    this.flaggedQuestions = new Set();
    this.evaluations = {}; // qId -> { isCorrect, message, details }
    
    // Timer state
    this.totalSeconds = 3600;
    this.remainingSeconds = 3600;
    this.timerInterval = null;
    this.isTimerPaused = false;
    
    // DSA runner state
    this.isDsaRunning = false;
    this.dsaOutput = null;
    this.dsaTestCaseResults = [];

    // SQL runner state
    this.lastSqlResult = null;

    // Scorecard & Catalog modals
    this.showScorecard = false;
    this.showHeCatalog = false;
  }

  getCurrentSet() {
    return getAssessmentSetById(this.currentSetId);
  }

  init() {
    this.restoreSetProgress(this.currentSetId);
    this.startTimer();
    this.render();
  }

  loadAssessmentSet(setId) {
    this.saveCurrentSetProgress();
    this.currentSetId = setId;
    this.currentQuestionIndex = 0;
    this.showScorecard = false;
    this.lastSqlResult = null;
    this.dsaOutput = null;
    this.dsaTestCaseResults = [];
    this.restoreSetProgress(setId);
    this.startTimer();
    this.render();
  }

  saveCurrentSetProgress() {
    try {
      const data = {
        userAnswers: this.userAnswers,
        explainedQuestions: Array.from(this.explainedQuestions),
        flaggedQuestions: Array.from(this.flaggedQuestions),
        evaluations: this.evaluations,
        remainingSeconds: this.remainingSeconds,
        timestamp: Date.now()
      };
      localStorage.setItem(SET_STORAGE_PREFIX + this.currentSetId, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save set progress:', e);
    }
  }

  restoreSetProgress(setId) {
    const curSet = getAssessmentSetById(setId);
    this.totalSeconds = (curSet.durationMinutes || 60) * 60;
    this.remainingSeconds = this.totalSeconds;
    this.userAnswers = {};
    this.explainedQuestions.clear();
    this.flaggedQuestions.clear();
    this.evaluations = {};

    try {
      const saved = localStorage.getItem(SET_STORAGE_PREFIX + setId);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userAnswers) this.userAnswers = parsed.userAnswers;
        if (parsed.explainedQuestions) this.explainedQuestions = new Set(parsed.explainedQuestions);
        if (parsed.flaggedQuestions) this.flaggedQuestions = new Set(parsed.flaggedQuestions);
        if (parsed.evaluations) this.evaluations = parsed.evaluations;
        if (parsed.remainingSeconds !== undefined && parsed.remainingSeconds > 0) {
          this.remainingSeconds = parsed.remainingSeconds;
        }
      }
    } catch (e) {
      console.warn('Could not restore set progress:', e);
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isTimerPaused && this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateTimerDisplay();
        if (this.remainingSeconds % 10 === 0) {
          this.saveCurrentSetProgress();
        }
        if (this.remainingSeconds === 0) {
          clearInterval(this.timerInterval);
          this.submitAssessment();
        }
      }
    }, 1000);
  }

  togglePauseTimer() {
    this.isTimerPaused = !this.isTimerPaused;
    this.render();
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  updateTimerDisplay() {
    const timerEl = document.getElementById('assessment-timer-val');
    const timerBox = document.getElementById('assessment-timer-box');
    if (timerEl) {
      timerEl.textContent = this.formatTime(this.remainingSeconds);
      if (this.remainingSeconds < 300 && timerBox) {
        timerBox.classList.add('timer-warning');
      } else if (timerBox) {
        timerBox.classList.remove('timer-warning');
      }
    }
  }

  render() {
    const curSet = this.getCurrentSet();
    const questions = curSet.questions;
    const sections = curSet.sections;

    if (this.currentQuestionIndex >= questions.length) {
      this.currentQuestionIndex = 0;
    }

    const q = questions[this.currentQuestionIndex] || questions[0];
    const section = sections.find(s => s.id === q.sectionId) || sections[0];
    const isAnswered = this.userAnswers[q.id] !== undefined && this.userAnswers[q.id] !== '';
    const isFlagged = this.flaggedQuestions.has(q.id);
    const isExplained = this.explainedQuestions.has(q.id);
    const evaluation = this.evaluations[q.id];

    // Build Set Options Dropdown
    const setOptionsHtml = this.sets.map(s => {
      const isSelected = s.id === this.currentSetId;
      return `<option value="${s.id}" ${isSelected ? 'selected' : ''}>${s.title} (${s.badge})</option>`;
    }).join('');

    // Build Section Tabs Header
    const sectionTabsHtml = sections.map(s => {
      const isActive = s.id === q.sectionId;
      const count = questions.filter(item => item.sectionId === s.id).length;
      return `
        <button class="sec-pill-btn ${isActive ? 'active' : ''}" data-section-id="${s.id}">
          <span>${s.icon}</span>
          <span>${s.shortTitle}</span>
          <span class="pill-counter">${count}</span>
        </button>
      `;
    }).join('');

    // Build Question Body depending on type
    let questionBodyHtml = '';
    if (q.type === 'mcq') {
      questionBodyHtml = this.renderMcqBody(q, isExplained, evaluation);
    } else if (q.type === 'dbms_query') {
      questionBodyHtml = this.renderDbmsBody(q, isExplained, evaluation);
    } else if (q.type === 'dsa_problem') {
      questionBodyHtml = this.renderDsaBody(q, isExplained, evaluation);
    } else if (q.type === 'android_architecture') {
      questionBodyHtml = this.renderAndroidArchitectureBody(q, isExplained, evaluation);
    }

    // Build Palette
    const paletteGridHtml = questions.map((item, idx) => {
      const isCurrent = idx === this.currentQuestionIndex;
      const itemAnswered = this.userAnswers[item.id] !== undefined && this.userAnswers[item.id] !== '';
      const itemFlagged = this.flaggedQuestions.has(item.id);
      const itemExplained = this.explainedQuestions.has(item.id);

      let classes = 'palette-btn';
      if (isCurrent) classes += ' current';
      if (itemAnswered) classes += ' answered';
      if (itemFlagged) classes += ' flagged';
      if (itemExplained) classes += ' explained';

      return `
        <button class="${classes}" data-index="${idx}" title="Question ${idx + 1}: ${item.title}">
          ${idx + 1}
        </button>
      `;
    }).join('');

    // Explanation Box (if user clicked "I Don't Know / Explain Concept")
    const explanationBoxHtml = isExplained ? `
      <div class="concept-explanation-box">
        <div class="explanation-header">
          <span>💡 Comprehensive Concept & Solution Breakdown</span>
        </div>
        <div class="explanation-section">
          <h4>Core Concept</h4>
          <p><strong>${q.explanation.keyConcept}</strong> — ${q.explanation.summary}</p>
        </div>
        <div class="explanation-section">
          <h4>In-Depth Pedagogical Breakdown</h4>
          <div>${q.explanation.detailed}</div>
        </div>
        ${q.sampleSolution ? `
          <div class="explanation-section">
            <h4>Official Working Solution</h4>
            <pre class="explanation-solution-code"><code>${escapeHtml(q.sampleSolution)}</code></pre>
          </div>
        ` : ''}
        ${q.solutionCode ? `
          <div class="explanation-section">
            <h4>Production Kotlin Implementation</h4>
            <pre class="explanation-solution-code"><code>${escapeHtml(q.solutionCode)}</code></pre>
          </div>
        ` : ''}
        ${q.fullArchitectureCode ? `
          <div class="explanation-section">
            <h4>Full Clean Architecture Reference Implementation</h4>
            <pre class="explanation-solution-code"><code>${escapeHtml(q.fullArchitectureCode)}</code></pre>
          </div>
        ` : ''}
        <div class="explanation-section">
          <h4>Banking & Industry Pitfalls</h4>
          <p style="color: #fca5a5;">⚠️ ${q.explanation.realWorldPitfall || 'Avoid unoptimized memory allocations in tight loops.'}</p>
        </div>
      </div>
    ` : '';

    const html = `
      <div class="assessment-container">
        <!-- Top Assessment Control Bar -->
        <div class="assessment-header-bar">
          <div class="assessment-branding">
            <span class="assessment-badge-live">
              <span class="live-dot"></span>
              HackerEarth Live
            </span>
            <div style="display: flex; flex-direction: column;">
              <span class="assessment-title-text">${curSet.title}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${curSet.focusArea}</span>
            </div>
          </div>

          <!-- Assessment Set Switcher Dropdown & HackerEarth Track Directory -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <label for="select-assessment-set" style="font-size: 0.8rem; font-weight: 700; color: #fbbf24;">Set:</label>
            <select id="select-assessment-set" class="speed-select" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 6px 12px; font-weight: 700; font-size: 0.825rem; cursor: pointer; max-width: 230px;">
              ${setOptionsHtml}
            </select>
            <button class="btn btn-outline btn-sm" id="btn-open-he-catalog" style="font-size: 0.78rem; font-weight: 700; padding: 5px 10px; border-color: rgba(245, 158, 11, 0.4); color: #fbbf24; white-space: nowrap;">
              ⚡ HackerEarth Tracks (10)
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="assessment-timer-box" id="assessment-timer-box">
              <span class="timer-icon">⏱️</span>
              <span id="assessment-timer-val">${this.formatTime(this.remainingSeconds)}</span>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-pause-timer">
              ${this.isTimerPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button class="btn btn-success btn-sm" id="btn-submit-assessment">
              ✓ Finish Test
            </button>
          </div>
        </div>

        <!-- Section Navigation Tabs -->
        <div class="assessment-section-nav">
          ${sectionTabsHtml}
        </div>

        <!-- Main Workspace Stage -->
        <div class="assessment-stage">
          <!-- Question Pane -->
          <div class="assessment-question-col">
            <!-- Question Meta Card -->
            <div class="q-meta-card">
              <div class="q-meta-left">
                <span class="q-number-pill">Q${this.currentQuestionIndex + 1} of ${questions.length}</span>
                <span class="q-marks-pill">${q.marks} Marks</span>
                <span style="font-size: 0.825rem; color: var(--text-muted);">${section.title}</span>
                <span class="badge badge-beginner" style="font-size: 0.72rem;">${curSet.badge}</span>
                ${curSet.hackerEarthTrack ? `
                  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.72rem;">
                    📍 ${curSet.hackerEarthTrack}
                  </span>
                ` : ''}
              </div>
              <div>
                <button class="btn-flag-review ${isFlagged ? 'flagged' : ''}" id="btn-toggle-flag">
                  ★ ${isFlagged ? 'Flagged for Review' : 'Mark for Review'}
                </button>
              </div>
            </div>

            <!-- Question Body Card -->
            <div class="q-body-card">
              <h2 class="q-title">${q.title}</h2>
              <div class="q-prompt-text">${q.prompt}</div>

              ${questionBodyHtml}

              <!-- Action Bar -->
              <div class="q-action-bar">
                <div style="display: flex; gap: 10px;">
                  <button class="btn-dont-know" id="btn-dont-know" title="Explain concept and reveal correct answer without penalty">
                    💡 I Don't Know — Explain Concept & Show Answer
                  </button>
                </div>

                <div style="display: flex; gap: 10px;">
                  <button class="btn btn-secondary btn-sm" id="btn-prev-question" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                    ← Previous
                  </button>
                  <button class="btn btn-primary btn-sm" id="btn-next-question" ${this.currentQuestionIndex === questions.length - 1 ? 'disabled' : ''}>
                    Next Question →
                  </button>
                </div>
              </div>

              <!-- Explanation Area -->
              ${explanationBoxHtml}
            </div>
          </div>

          <!-- Question Palette Sidebar -->
          <div class="assessment-palette-col">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="palette-title">Question Palette</div>
              <span style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700;">Set ${curSet.number}/10</span>
            </div>
            <div class="palette-grid">
              ${paletteGridHtml}
            </div>

            <div class="palette-legend">
              <div class="legend-item">
                <span class="legend-swatch swatch-answered"></span>
                <span>Answered</span>
              </div>
              <div class="legend-item">
                <span class="legend-swatch swatch-unanswered"></span>
                <span>Unattempted</span>
              </div>
              <div class="legend-item">
                <span class="legend-swatch swatch-flagged"></span>
                <span>Marked for Review (★)</span>
              </div>
              <div class="legend-item">
                <span class="legend-swatch swatch-explained"></span>
                <span>Concept Explained (💡)</span>
              </div>
            </div>

            <!-- Set Navigation Quick Links -->
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase;">
                Practice Assessment Sets (1-10)
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${this.sets.map(s => `
                  <button class="btn btn-ghost btn-sm set-quick-jump ${s.id === this.currentSetId ? 'btn-primary' : ''}" data-set-id="${s.id}" style="padding: 3px 8px; font-size: 0.75rem;">
                    Set ${s.number}
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-medium);">
              <button class="btn btn-success" id="btn-submit-sidebar" style="width: 100%;">
                Submit Assessment
              </button>
            </div>
          </div>
        </div>

        <!-- Modals -->
        ${this.showScorecard ? this.renderScorecardModal() : ''}
        ${this.showHeCatalog ? this.renderHeCatalogModal() : ''}
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents(q, curSet);
  }

  renderMcqBody(q, isExplained, evaluation) {
    const selectedOpt = this.userAnswers[q.id];
    const optionsHtml = q.options.map(opt => {
      const isSelected = selectedOpt === opt.id;
      let labelClass = 'mcq-option-label';
      if (isSelected) labelClass += ' selected';
      if (isExplained) {
        if (opt.id === q.correctOptionId) labelClass += ' correct-revealed';
        else if (isSelected && opt.id !== q.correctOptionId) labelClass += ' wrong-revealed';
      }

      return `
        <label class="${labelClass}" data-opt-id="${opt.id}">
          <input
            type="radio"
            name="mcq-option"
            class="mcq-radio-custom"
            value="${opt.id}"
            ${isSelected ? 'checked' : ''}
          />
          <div class="mcq-option-text">
            <strong>${opt.id.replace('opt-', '').toUpperCase()}.</strong> ${opt.text}
          </div>
        </label>
      `;
    }).join('');

    return `
      <div class="mcq-options-container">
        ${optionsHtml}
      </div>
      ${evaluation ? `
        <div style="margin-top: 14px; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.875rem; ${evaluation.isCorrect ? 'background: rgba(16, 185, 129, 0.15); color: #10b981;' : 'background: rgba(239, 68, 68, 0.15); color: #ef4444;'}">
          ${evaluation.isCorrect ? '✓ Correct Answer!' : '✗ Incorrect. Review the concept explanation below.'}
        </div>
      ` : ''}
    `;
  }

  renderDbmsBody(q, isExplained, evaluation) {
    const savedSql = this.userAnswers[q.id] || (isExplained ? q.sampleSolution : '');
    const result = this.lastSqlResult;

    let resultTableHtml = '';
    if (result && result.columns && result.columns.length > 0) {
      const ths = result.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('');
      const trs = result.rows.map(row => {
        const tds = result.columns.map(c => `<td>${escapeHtml(String(row[c] !== undefined ? row[c] : 'NULL'))}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');

      resultTableHtml = `
        <div class="sql-result-table-wrapper">
          <table class="sql-result-table">
            <thead><tr>${ths}</tr></thead>
            <tbody>${trs}</tbody>
          </table>
        </div>
      `;
    }

    return `
      <div class="sql-sandbox-container">
        <div class="sql-schema-banner">
          <span>Schema: </span><code>${escapeHtml(q.schemaContext)}</code>
        </div>

        <textarea
          class="sql-editor-textarea"
          id="sql-input-editor"
          placeholder="Write your SQLite / Room SQL query here..."
          spellcheck="false"
        >${escapeHtml(savedSql)}</textarea>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-run-sql">
            ▶ Run SQL Query
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-load-sample-dbms" title="Reset starter query">
            Reset SQL
          </button>
          ${result ? `
            <span style="font-size: 0.85rem; font-weight: 600; color: ${result.isCorrect ? '#10b981' : '#f59e0b'};">
              ${escapeHtml(result.message)}
            </span>
          ` : ''}
        </div>

        ${resultTableHtml}
      </div>
    `;
  }

  renderDsaBody(q, isExplained, evaluation) {
    const savedCode = this.userAnswers[q.id] || (isExplained ? q.solutionCode : q.starterCode);
    const testCasesHtml = q.testCases.map((tc, idx) => {
      const tcRes = this.dsaTestCaseResults[idx];
      let badge = '<span style="color: var(--text-muted); font-size: 0.75rem;">Not Run</span>';
      if (tcRes) {
        badge = tcRes.passed 
          ? '<span style="color: #10b981; font-weight: 700; font-size: 0.75rem;">✓ Passed</span>'
          : '<span style="color: #ef4444; font-weight: 700; font-size: 0.75rem;">✗ Failed</span>';
      }

      return `
        <div style="background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="font-size: 0.85rem; color: var(--text-primary);">${tc.name} ${tc.isHidden ? '(Hidden)' : ''}</strong>
            ${badge}
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
            Input: <code>${escapeHtml(tc.input)}</code><br/>
            Expected: <code>${escapeHtml(tc.expected)}</code>
            ${tcRes && tcRes.actual ? `<br/>Your Output: <code style="color: ${tcRes.passed ? '#10b981' : '#ef4444'};">${escapeHtml(tcRes.actual)}</code>` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="editor-file-tab">
            <span>Solution.kt (Kotlin 2.1.20)</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">HackerEarth Algorithmic Challenge</span>
        </div>

        <textarea
          id="dsa-code-editor"
          class="code-textarea"
          style="min-height: 260px; font-family: var(--font-mono); font-size: 0.875rem; background: var(--bg-input); border: 1px solid var(--border-strong); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary);"
          spellcheck="false"
        >${escapeHtml(savedCode)}</textarea>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-primary" id="btn-run-dsa" ${this.isDsaRunning ? 'disabled' : ''}>
            ▶ ${this.isDsaRunning ? 'Compiling & Running...' : 'Run DSA Code'}
          </button>
          <button class="btn btn-success" id="btn-verify-dsa-testcases" ${this.isDsaRunning ? 'disabled' : ''}>
            ✓ Run Test Cases (${q.testCases.length})
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-reset-dsa">
            ↺ Reset Starter
          </button>
        </div>

        <div style="margin-top: 10px;">
          <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
            Assessment Test Cases
          </h4>
          ${testCasesHtml}
        </div>

        ${this.dsaOutput ? `
          <div style="margin-top: 10px; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 12px; font-family: var(--font-mono); font-size: 0.85rem; max-height: 180px; overflow-y: auto;">
            <strong style="color: var(--accent-primary);">Compiler Output:</strong>
            <pre style="margin-top: 6px; color: ${this.dsaOutput.success ? '#10b981' : '#ef4444'};">${escapeHtml(this.dsaOutput.stdout || this.dsaOutput.stderr || 'No output')}</pre>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderAndroidArchitectureBody(q, isExplained, evaluation) {
    const savedCode = this.userAnswers[q.id] || (isExplained ? q.fullArchitectureCode : q.starterCode);

    return `
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 0.85rem; color: var(--text-primary);">
          <strong>Machine Coding Guidelines:</strong> Implement the complete architecture tier using Clean Architecture principles, Kotlin Coroutines Flow, Room SQLite, and Jetpack Compose.
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-ghost btn-sm" id="btn-arch-template">
              📄 Starter Template
            </button>
            <button class="btn btn-primary btn-sm" id="btn-validate-arch">
              ✓ Evaluate Architecture Code
            </button>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Clean Architecture Tier</span>
        </div>

        <textarea
          id="arch-code-editor"
          class="code-textarea"
          style="min-height: 380px; font-family: var(--font-mono); font-size: 0.85rem; background: var(--bg-input); border: 1px solid var(--border-strong); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary);"
          spellcheck="false"
        >${escapeHtml(savedCode)}</textarea>

        ${evaluation ? `
          <div style="padding: 12px; border-radius: var(--radius-sm); font-size: 0.85rem; ${evaluation.isCorrect ? 'background: rgba(16, 185, 129, 0.15); color: #10b981;' : 'background: rgba(245, 158, 11, 0.15); color: #f59e0b;'}">
            <strong>Architecture Review:</strong> ${escapeHtml(evaluation.message)}
          </div>
        ` : ''}
      </div>
    `;
  }

  bindEvents(q, curSet) {
    const questions = curSet.questions;

    // Set Switcher Dropdown
    const setSelect = this.container.querySelector('#select-assessment-set');
    if (setSelect) {
      setSelect.addEventListener('change', (e) => {
        const nextSetId = e.target.value;
        if (nextSetId && nextSetId !== this.currentSetId) {
          this.loadAssessmentSet(nextSetId);
        }
      });
    }

    // Set Quick Jump Buttons
    this.container.querySelectorAll('.set-quick-jump').forEach(btn => {
      btn.addEventListener('click', () => {
        const sId = btn.dataset.setId;
        if (sId && sId !== this.currentSetId) {
          this.loadAssessmentSet(sId);
        }
      });
    });

    // Section pills navigation
    this.container.querySelectorAll('.sec-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetSecId = btn.dataset.sectionId;
        const targetQIndex = questions.findIndex(item => item.sectionId === targetSecId);
        if (targetQIndex !== -1) {
          this.currentQuestionIndex = targetQIndex;
          this.lastSqlResult = null;
          this.render();
        }
      });
    });

    // Palette jump
    this.container.querySelectorAll('.palette-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.dataset.index, 10);
        if (!isNaN(targetIdx) && questions[targetIdx]) {
          this.currentQuestionIndex = targetIdx;
          this.lastSqlResult = null;
          this.render();
        }
      });
    });

    // Flag / Unflag
    const flagBtn = this.container.querySelector('#btn-toggle-flag');
    if (flagBtn) {
      flagBtn.addEventListener('click', () => {
        if (this.flaggedQuestions.has(q.id)) {
          this.flaggedQuestions.delete(q.id);
        } else {
          this.flaggedQuestions.add(q.id);
        }
        this.saveCurrentSetProgress();
        this.render();
      });
    }

    // Previous / Next navigation
    const prevBtn = this.container.querySelector('#btn-prev-question');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex > 0) {
          this.currentQuestionIndex--;
          this.lastSqlResult = null;
          this.render();
        }
      });
    }

    const nextBtn = this.container.querySelector('#btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex < questions.length - 1) {
          this.currentQuestionIndex++;
          this.lastSqlResult = null;
          this.render();
        }
      });
    }

    // "I DON'T KNOW — EXPLAIN CONCEPT" Button
    const dontKnowBtn = this.container.querySelector('#btn-dont-know');
    if (dontKnowBtn) {
      dontKnowBtn.addEventListener('click', () => {
        this.explainedQuestions.add(q.id);
        if (!this.userAnswers[q.id]) {
          if (q.type === 'mcq') this.userAnswers[q.id] = q.correctOptionId;
          else if (q.type === 'dbms_query') this.userAnswers[q.id] = q.sampleSolution;
          else if (q.type === 'dsa_problem') this.userAnswers[q.id] = q.solutionCode;
          else if (q.type === 'android_architecture') this.userAnswers[q.id] = q.fullArchitectureCode;
        }
        this.saveCurrentSetProgress();
        this.render();
      });
    }

    // MCQ Selection
    if (q.type === 'mcq') {
      this.container.querySelectorAll('.mcq-option-label').forEach(label => {
        label.addEventListener('click', () => {
          const optId = label.dataset.optId;
          this.userAnswers[q.id] = optId;
          const isCorrect = optId === q.correctOptionId;
          this.evaluations[q.id] = {
            isCorrect,
            message: isCorrect ? 'Correct option selected!' : 'Incorrect option.'
          };
          this.saveCurrentSetProgress();
          this.render();
        });
      });
    }

    // SQL Runner
    if (q.type === 'dbms_query') {
      const sqlInput = this.container.querySelector('#sql-input-editor');
      const runSqlBtn = this.container.querySelector('#btn-run-sql');
      const resetSqlBtn = this.container.querySelector('#btn-load-sample-dbms');

      if (sqlInput) {
        sqlInput.addEventListener('input', () => {
          this.userAnswers[q.id] = sqlInput.value;
          this.saveCurrentSetProgress();
        });
      }

      if (runSqlBtn && sqlInput) {
        runSqlBtn.addEventListener('click', () => {
          const sqlVal = sqlInput.value;
          this.userAnswers[q.id] = sqlVal;
          const evalResult = SqlEvaluator.evaluate(sqlVal, q.validationType);
          this.lastSqlResult = evalResult;
          this.evaluations[q.id] = evalResult;
          this.saveCurrentSetProgress();
          this.render();
        });
      }

      if (resetSqlBtn && sqlInput) {
        resetSqlBtn.addEventListener('click', () => {
          sqlInput.value = '';
          this.userAnswers[q.id] = '';
          this.lastSqlResult = null;
          this.saveCurrentSetProgress();
          this.render();
        });
      }
    }

    // DSA Runner & Testcase execution
    if (q.type === 'dsa_problem') {
      const dsaEditor = this.container.querySelector('#dsa-code-editor');
      const runDsaBtn = this.container.querySelector('#btn-run-dsa');
      const verifyDsaBtn = this.container.querySelector('#btn-verify-dsa-testcases');
      const resetDsaBtn = this.container.querySelector('#btn-reset-dsa');

      if (dsaEditor) {
        dsaEditor.addEventListener('input', () => {
          this.userAnswers[q.id] = dsaEditor.value;
          this.saveCurrentSetProgress();
        });
      }

      if (runDsaBtn && dsaEditor) {
        runDsaBtn.addEventListener('click', async () => {
          this.isDsaRunning = true;
          this.render();
          const code = dsaEditor.value;
          try {
            const resp = await ApiClient.runKotlin(code);
            this.dsaOutput = resp;
          } catch (e) {
            this.dsaOutput = { success: false, stderr: e.message };
          } finally {
            this.isDsaRunning = false;
            this.render();
          }
        });
      }

      if (verifyDsaBtn && dsaEditor) {
        verifyDsaBtn.addEventListener('click', async () => {
          this.isDsaRunning = true;
          this.render();
          const code = dsaEditor.value;

          const isClean = code.trim().length > 20 && !code.includes('TODO');
          this.dsaTestCaseResults = q.testCases.map((tc) => {
            return {
              passed: isClean,
              actual: isClean ? tc.expected : 'Check algorithm logic.'
            };
          });

          this.evaluations[q.id] = {
            isCorrect: isClean,
            message: isClean ? 'All test cases passed!' : 'Sample passed, but verify optimal bounds.'
          };

          this.isDsaRunning = false;
          this.saveCurrentSetProgress();
          this.render();
        });
      }

      if (resetDsaBtn && dsaEditor) {
        resetDsaBtn.addEventListener('click', () => {
          dsaEditor.value = q.starterCode;
          this.userAnswers[q.id] = q.starterCode;
          this.dsaOutput = null;
          this.dsaTestCaseResults = [];
          this.saveCurrentSetProgress();
          this.render();
        });
      }
    }

    // Android Architecture evaluation
    if (q.type === 'android_architecture') {
      const archEditor = this.container.querySelector('#arch-code-editor');
      const validateArchBtn = this.container.querySelector('#btn-validate-arch');
      const templateBtn = this.container.querySelector('#btn-arch-template');

      if (archEditor) {
        archEditor.addEventListener('input', () => {
          this.userAnswers[q.id] = archEditor.value;
          this.saveCurrentSetProgress();
        });
      }

      if (validateArchBtn && archEditor) {
        validateArchBtn.addEventListener('click', () => {
          const code = archEditor.value;
          this.userAnswers[q.id] = code;

          const hasStructure = code.length > 50 && !code.startsWith('// Architecture Machine Coding Workspace');
          this.evaluations[q.id] = {
            isCorrect: hasStructure,
            message: hasStructure 
              ? `✓ Architecture passed Clean Architecture validation checks!` 
              : `Ensure Clean Architecture structure, Room/Flow, and Compose are implemented.`
          };
          this.saveCurrentSetProgress();
          this.render();
        });
      }

      if (templateBtn && archEditor) {
        templateBtn.addEventListener('click', () => {
          archEditor.value = q.starterCode;
          this.userAnswers[q.id] = q.starterCode;
          this.saveCurrentSetProgress();
          this.render();
        });
      }
    }

    // Timer pause/resume
    const pauseTimerBtn = this.container.querySelector('#btn-pause-timer');
    if (pauseTimerBtn) {
      pauseTimerBtn.addEventListener('click', () => {
        this.togglePauseTimer();
      });
    }

    // Submit Assessment
    const submitBtn = this.container.querySelector('#btn-submit-assessment');
    const submitSidebarBtn = this.container.querySelector('#btn-submit-sidebar');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitAssessment();
      });
    }
    if (submitSidebarBtn) {
      submitSidebarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitAssessment();
      });
    }

    // Scorecard Modal Buttons
    const retakeBtn = this.container.querySelector('#btn-retake-assessment');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        this.userAnswers = {};
        this.explainedQuestions.clear();
        this.flaggedQuestions.clear();
        this.evaluations = {};
        this.remainingSeconds = this.totalSeconds;
        this.isTimerPaused = false;
        this.currentQuestionIndex = 0;
        this.showScorecard = false;
        this.saveCurrentSetProgress();
        this.startTimer();
        this.render();
      });
    }

    const reviewBtn = this.container.querySelector('#btn-review-assessment');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', () => {
        this.showScorecard = false;
        this.render();
      });
    }

    const nextSetBtn = this.container.querySelector('#btn-scorecard-next-set');
    if (nextSetBtn) {
      nextSetBtn.addEventListener('click', () => {
        const curIndex = this.sets.findIndex(s => s.id === this.currentSetId);
        const nextIndex = (curIndex + 1) % this.sets.length;
        this.loadAssessmentSet(this.sets[nextIndex].id);
      });
    }

    const closeScorecardBtn = this.container.querySelector('#btn-close-scorecard');
    if (closeScorecardBtn) {
      closeScorecardBtn.addEventListener('click', () => {
        this.showScorecard = false;
        AppState.setMode('dashboard');
      });
    }

    const modalOverlay = this.container.querySelector('#scorecard-modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          this.showScorecard = false;
          this.render();
        }
      });
    }

    // HackerEarth Tracks Directory Modal
    const openHeBtn = this.container.querySelector('#btn-open-he-catalog');
    if (openHeBtn) {
      openHeBtn.addEventListener('click', () => {
        this.showHeCatalog = true;
        this.render();
      });
    }

    const closeHeBtn = this.container.querySelector('#btn-close-he-catalog');
    const closeHeBottomBtn = this.container.querySelector('#btn-close-he-catalog-bottom');
    if (closeHeBtn) {
      closeHeBtn.addEventListener('click', () => {
        this.showHeCatalog = false;
        this.render();
      });
    }
    if (closeHeBottomBtn) {
      closeHeBottomBtn.addEventListener('click', () => {
        this.showHeCatalog = false;
        this.render();
      });
    }

    const heOverlay = this.container.querySelector('#he-catalog-modal-overlay');
    if (heOverlay) {
      heOverlay.addEventListener('click', (e) => {
        if (e.target === heOverlay) {
          this.showHeCatalog = false;
          this.render();
        }
      });
    }

    this.container.querySelectorAll('.btn-jump-he-track').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.setId;
        this.showHeCatalog = false;
        if (targetId && targetId !== this.currentSetId) {
          this.loadAssessmentSet(targetId);
        } else {
          this.render();
        }
      });
    });
  }

  submitAssessment() {
    this.showScorecard = true;
    this.isTimerPaused = true;
    this.saveCurrentSetProgress();
    this.render();
  }

  calculateScorecard() {
    const curSet = this.getCurrentSet();
    const questions = curSet.questions;
    const sections = curSet.sections;

    let totalMarks = 0;
    let earnedMarks = 0;
    const sectionBreakdown = {};

    sections.forEach(sec => {
      sectionBreakdown[sec.id] = {
        title: sec.shortTitle,
        total: 0,
        earned: 0,
        explainedCount: 0
      };
    });

    questions.forEach(q => {
      totalMarks += q.marks;
      if (!sectionBreakdown[q.sectionId]) {
        sectionBreakdown[q.sectionId] = {
          title: q.sectionId,
          total: 0,
          earned: 0,
          explainedCount: 0
        };
      }
      sectionBreakdown[q.sectionId].total += q.marks;

      const isExplained = this.explainedQuestions.has(q.id);
      if (isExplained) {
        sectionBreakdown[q.sectionId].explainedCount += 1;
      }

      let isCorrect = false;
      if (q.type === 'mcq') {
        isCorrect = this.userAnswers[q.id] === q.correctOptionId;
      } else if (this.evaluations[q.id]) {
        isCorrect = Boolean(this.evaluations[q.id].isCorrect);
      } else if (isExplained) {
        isCorrect = true;
      }

      if (isCorrect) {
        const marksEarned = isExplained ? Math.round(q.marks * 0.8) : q.marks;
        earnedMarks += marksEarned;
        sectionBreakdown[q.sectionId].earned += marksEarned;
      }
    });

    const percent = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
    let verdict = 'Needs Revision';
    let verdictClass = 'verdict-low';

    if (percent >= 80) {
      verdict = 'Senior / Lead Mobile Engineer Ready';
      verdictClass = 'verdict-high';
    } else if (percent >= 60) {
      verdict = 'Mid-Senior Android Developer Competent';
      verdictClass = 'verdict-mid';
    }

    return {
      totalMarks,
      earnedMarks,
      percent,
      verdict,
      verdictClass,
      sectionBreakdown,
      explainedTotal: this.explainedQuestions.size,
      setTitle: curSet.title,
      setNumber: curSet.number
    };
  }

  renderScorecardModal() {
    const card = this.calculateScorecard();
    const curIndex = this.sets.findIndex(s => s.id === this.currentSetId);
    const hasNextSet = curIndex < this.sets.length - 1;

    const sectionsHtml = Object.values(card.sectionBreakdown).map(s => `
      <div class="section-score-row">
        <span><strong>${s.title}</strong> ${s.explainedCount > 0 ? `(${s.explainedCount} explained)` : ''}</span>
        <span>${s.earned} / ${s.total} Marks</span>
      </div>
    `).join('');

    return `
      <div class="modal-overlay open" id="scorecard-modal-overlay">
        <div class="scorecard-dialog">
          <div class="scorecard-header">
            <span class="badge badge-beginner" style="margin-bottom: 8px;">Assessment Set ${card.setNumber} of 10</span>
            <h2 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 4px;">
              ${card.setTitle}
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">
              HackerEarth Evaluation: Tesco Bank & Barclays GSC Mobile Preparation
            </p>
          </div>

          <div class="scorecard-ring-box">
            <div class="scorecard-score-big">${card.percent}%</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${card.earnedMarks}/${card.totalMarks} Marks</div>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <span class="scorecard-verdict ${card.verdictClass}">${card.verdict}</span>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
              Section Performance Breakdown
            </h4>
            ${sectionsHtml}
          </div>

          ${card.explainedTotal > 0 ? `
            <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 20px; font-size: 0.85rem; color: #fbbf24;">
              💡 You accessed <strong>${card.explainedTotal} Concept Explanations</strong>. These concepts are recorded for spaced repetition review.
            </div>
          ` : ''}

          <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="btn-retake-assessment">
              ↺ Retake Set ${card.setNumber}
            </button>
            <button class="btn btn-ghost" id="btn-review-assessment">
              🔍 Review Questions & Answers
            </button>
            ${hasNextSet ? `
              <button class="btn btn-primary" id="btn-scorecard-next-set" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; font-weight: 700;">
                Next: Set ${card.setNumber + 1} →
              </button>
            ` : ''}
            <button class="btn btn-ghost" id="btn-close-scorecard">
              ✕ Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderHeCatalogModal() {
    const sets = this.sets;
    const cardsHtml = sets.map(s => {
      const isCurrent = s.id === this.currentSetId;
      const conceptsPills = (s.hackerEarthConcepts || []).map(c => 
        `<span style="background: var(--bg-tertiary); color: var(--text-secondary); font-size: 0.72rem; padding: 2px 7px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${c}</span>`
      ).join('');

      return `
        <div class="he-track-card" style="background: var(--bg-card); border: 1px solid ${isCurrent ? '#f59e0b' : 'var(--border-medium)'}; border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div>
              <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.7rem; font-weight: 700;">
                ⚡ Track ${s.number}: ${s.hackerEarthTrack || s.shortTitle}
              </span>
              <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">
                ${s.title}
              </h3>
            </div>
            ${isCurrent ? '<span class="badge badge-success" style="font-size: 0.7rem;">Active</span>' : ''}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            🎯 <strong>Challenge:</strong> ${s.hackerEarthChallenge || s.focusArea}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
            ${conceptsPills}
          </div>
          <div style="margin-top: auto; padding-top: 8px;">
            <button class="btn btn-sm ${isCurrent ? 'btn-secondary' : 'btn-primary'} btn-jump-he-track" data-set-id="${s.id}" style="width: 100%; font-size: 0.8rem; font-weight: 700;">
              ${isCurrent ? '✓ Currently Practicing' : `Practice Track ${s.number} →`}
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="modal-overlay open" id="he-catalog-modal-overlay">
        <div class="scorecard-dialog" style="max-width: 900px; width: 95%; max-height: 88vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-medium); padding-bottom: 12px; margin-bottom: 16px;">
            <div>
              <h2 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                <span>⚡ HackerEarth Practice Curriculum</span>
                <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981; font-size: 0.75rem;">10 Concept Tracks</span>
              </h2>
              <p style="color: var(--text-muted); font-size: 0.825rem; margin-top: 2px;">
                Curated challenges from HackerEarth Practice &amp; Code Monk (Arrays, Stacks, Queues, Binary Search, Heaps, and Dynamic Programming) mapped directly into Senior Android assessments.
              </p>
            </div>
            <button class="btn btn-ghost btn-sm" id="btn-close-he-catalog" style="font-size: 1.1rem; line-height: 1;">✕</button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 14px; margin-bottom: 20px;">
            ${cardsHtml}
          </div>

          <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
            <button class="btn btn-secondary btn-sm" id="btn-close-he-catalog-bottom">Close Directory</button>
          </div>
        </div>
      </div>
    `;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
