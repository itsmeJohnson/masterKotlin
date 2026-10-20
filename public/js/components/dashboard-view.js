/* ==========================================================================
   Dashboard View Component
   Full Progress Metrics, Assessment Readiness, Weak Spots & Revision Queue
   ========================================================================== */

import { AppState } from '../state.js';
import { CURRICULUM } from '../data/curriculum.js';

export class DashboardViewComponent {
  constructor(containerEl) {
    this.container = containerEl;
  }

  getTotalConceptsCount() {
    let count = 0;
    CURRICULUM.forEach(g => { count += g.items.length; });
    return count;
  }

  render() {
    const stats = AppState.data.stats;
    const totalConcepts = this.getTotalConceptsCount();
    const readiness = AppState.getReadinessScore();
    const accuracy = stats.problemsAttempted > 0
      ? Math.round((stats.problemsSolved / stats.problemsAttempted) * 100)
      : 100;
    const timeMinutes = Math.round(stats.timeSpentSeconds / 60);

    // Count mastery states
    let masteredCount = 0;
    let learningCount = 0;
    let revisionCount = 0;
    for (const st of Object.values(AppState.data.masteryMap)) {
      if (st === 'mastered') masteredCount++;
      else if (st === 'learning' || st === 'practising') learningCount++;
      else if (st === 'needs_revision') revisionCount++;
    }

    // Render Weak Topics
    let weakTopicsHtml = '';
    AppState.data.weakTopics.forEach((topic) => {
      weakTopicsHtml += `<span class="badge badge-advanced" style="padding: 4px 10px;">${topic}</span>`;
    });

    // Render Revision Queue
    let revisionQueueHtml = '';
    let hasRevisionItems = false;
    CURRICULUM.forEach((group) => {
      group.items.forEach((item) => {
        const st = AppState.data.masteryMap[item.id];
        if (st === 'needs_revision') {
          hasRevisionItems = true;
          revisionQueueHtml += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-secondary); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 6px;">
              <div>
                <strong style="color: var(--text-primary);">${item.title}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${group.title}</div>
              </div>
              <button class="btn btn-secondary btn-sm btn-revisit" data-lesson-id="${item.id}">
                Revise Now
              </button>
            </div>
          `;
        }
      });
    });

    if (!hasRevisionItems) {
      revisionQueueHtml = `<div style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">No topics currently flagged for revision. Great job!</div>`;
    }

    const html = `
      <div class="content-container">
        <div style="margin-bottom: var(--space-xl); display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-md);">
          <div>
            <div style="display: flex; gap: 8px; margin-bottom: var(--space-xs);">
              <span class="badge badge-bank">Barclays / Tesco Bank Assessment Prep</span>
              <span class="badge badge-beginner">Telemetry Active</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800;">
              Engineering Mastery Dashboard
            </h1>
          </div>

          <div style="display: flex; gap: var(--space-xs);">
            <button class="btn btn-secondary btn-sm" id="btn-export-progress">
              Export Progress JSON
            </button>
            <button class="btn btn-ghost btn-sm" id="btn-reset-progress" style="color: var(--color-error);">
              Reset Data
            </button>
          </div>
        </div>

        <!-- Metric Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-xl);">
          <!-- Readiness Ring Card -->
          <div class="lesson-card" style="padding: var(--space-lg); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-color: var(--border-medium);">
            <div style="font-size: 0.775rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">Assessment Readiness</div>
            <div style="font-size: 2.8rem; font-family: var(--font-display); font-weight: 900; color: var(--accent-android);">
              ${readiness}%
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">
              Target: >= 85% for Senior AVP
            </div>
          </div>

          <!-- Concepts Started / Completed -->
          <div class="lesson-card" style="padding: var(--space-lg);">
            <div style="font-size: 0.775rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Concepts Completed</div>
            <div style="font-size: 2.4rem; font-family: var(--font-display); font-weight: 800; color: var(--text-primary); margin: 6px 0;">
              ${masteredCount} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 500;">/ ${totalConcepts}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">
              In Progress: <strong>${learningCount}</strong>
            </div>
          </div>

          <!-- Problem Solving Accuracy -->
          <div class="lesson-card" style="padding: var(--space-lg);">
            <div style="font-size: 0.775rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Independent Accuracy</div>
            <div style="font-size: 2.4rem; font-family: var(--font-display); font-weight: 800; color: var(--color-info); margin: 6px 0;">
              ${accuracy}%
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">
              Solved: <strong>${stats.problemsSolved}</strong> of <strong>${stats.problemsAttempted}</strong> attempted
            </div>
          </div>

          <!-- Study Time -->
          <div class="lesson-card" style="padding: var(--space-lg);">
            <div style="font-size: 0.775rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Study Time Spent</div>
            <div style="font-size: 2.4rem; font-family: var(--font-display); font-weight: 800; color: var(--color-purple); margin: 6px 0;">
              ${timeMinutes} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 500;">min</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">
              Local Session Recorded
            </div>
          </div>
        </div>

        <!-- HackerEarth Mock Assessment Banner Card -->
        <div class="lesson-card" style="padding: var(--space-lg); margin-bottom: var(--space-xl); background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(59, 130, 246, 0.12)); border: 1px solid rgba(245, 158, 11, 0.35); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
              <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #f59e0b;">HackerEarth Assessment Engine</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Timed 60-Min Mock • Live Diagnostics</span>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
              Tesco Bank & Barclays GSC Mock Assessment
            </h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0; max-width: 620px;">
              Test your readiness across 4 realistic sections: Android & Kotlin engineering diagnostics, DBMS & Room queries with live sandbox, HackerEarth DSA sliding window challenge, and Offline-First Android App Architecture with built-in instant concept explanations.
            </p>
          </div>
          <button class="btn btn-primary" id="btn-dashboard-start-assessment" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; font-weight: 700; padding: 10px 20px;">
            ⚡ Launch Mock Assessment
          </button>
        </div>

        <!-- Two Columns: Weak Topics & Revision Queue -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
          <!-- Weak Topics & Mistake Log -->
          <div class="lesson-card" style="padding: var(--space-lg);">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: var(--space-sm);">
              Identified Focus Areas & Weak Spots
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-md);">
              Topics flagged automatically from missed test cases and code review diagnostic findings.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${weakTopicsHtml}
            </div>

            <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-subtle); padding-top: var(--space-md);">
              <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">Recommended Next Curriculum Step</h4>
              <div style="background: var(--bg-secondary); padding: 10px 14px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="color: var(--accent-primary);">Variables, Loops, Conditions & Indexes</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Priority 1 — Core Foundation</div>
                </div>
                <button class="btn btn-primary btn-sm" id="btn-continue-learning">
                  Continue &rarr;
                </button>
              </div>
            </div>
          </div>

          <!-- Revision Queue -->
          <div class="lesson-card" style="padding: var(--space-lg);">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: var(--space-sm);">
              Revision Queue (${revisionCount})
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-md);">
              Concepts marked for spaced repetition to ensure retention under interview pressure.
            </p>
            <div>
              ${revisionQueueHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents();
  }

  bindEvents() {
    const continueBtn = this.container.querySelector('#btn-continue-learning');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        AppState.setLesson('lesson-kotlin-fundamentals-intro');
        AppState.setMode('learn');
      });
    }

    const startAssessmentBtn = this.container.querySelector('#btn-dashboard-start-assessment');
    if (startAssessmentBtn) {
      startAssessmentBtn.addEventListener('click', () => {
        AppState.setMode('assessment');
      });
    }

    const exportBtn = this.container.querySelector('#btn-export-progress');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const json = AppState.exportProgressJson();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kotlin_mastery_progress_${Date.now()}.json`;
        a.click();
      });
    }

    const resetBtn = this.container.querySelector('#btn-reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all saved progress and test attempts?')) {
          AppState.resetProgress();
        }
      });
    }

    this.container.querySelectorAll('.btn-revisit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.lessonId;
        if (id) {
          AppState.setLesson(id);
          AppState.setMode('learn');
        }
      });
    });
  }
}
