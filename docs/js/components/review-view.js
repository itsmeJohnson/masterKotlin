/* ==========================================================================
   Review View Component
   Automated Code Reviewer & Mistake Triage Tutor
   ========================================================================== */

import { KotlinEvaluator } from '../utils/kotlin-evaluator.js';
import { AppState } from '../state.js';
import { EXERCISES } from '../data/exercises.js';

export class ReviewViewComponent {
  constructor(containerEl) {
    this.container = containerEl;
  }

  render(lessonId) {
    const exerciseId = 'ex-substring-abcba';
    const ex = EXERCISES[exerciseId];
    const code = AppState.data.codeDrafts[exerciseId] || ex.starterCode;
    const feedbackList = KotlinEvaluator.analyzeCode(code, exerciseId);

    let feedbackCardsHtml = '';
    feedbackList.forEach((fb) => {
      let alertClass = 'alert-note';
      let icon = 'ℹ️';
      if (fb.type === 'error') { alertClass = 'alert-warning'; icon = '🚨'; }
      else if (fb.type === 'warning') { alertClass = 'alert-important'; icon = '⚠️'; }
      else if (fb.type === 'success') { alertClass = 'alert-tip'; icon = '✅'; }

      feedbackCardsHtml += `
        <div class="alert ${alertClass}" style="margin-bottom: var(--space-md); flex-direction: column; align-items: flex-start;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 700;">
            <span>${icon}</span>
            <span>${fb.title}</span>
            ${fb.line ? `<span class="badge badge-medium" style="margin-left: auto;">Line ${fb.line}</span>` : ''}
          </div>
          <div style="margin-top: 6px; font-size: 0.875rem; color: var(--text-secondary);">
            ${fb.message}
          </div>
        </div>
      `;
    });

    const html = `
      <div class="content-container">
        <div style="margin-bottom: var(--space-xl);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-xs);">
            <span class="badge badge-bank">Tutor Mode</span>
            <span class="badge badge-beginner">Static Logic & AST Analysis</span>
          </div>
          <h1 style="font-family: var(--font-display); font-size: 1.75rem; font-weight: 800;">
            Code Review & Anti-Pattern Diagnostic
          </h1>
          <p style="color: var(--text-secondary); margin-top: 6px;">
            The review engine identifies off-by-one errors, pointer regressions, and performance hazards before your code reaches interview assessors.
          </p>
        </div>

        <!-- Diagnostic Feedback Cards -->
        <div>
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-md);">
            Diagnostic Findings for Current Code Draft:
          </h2>
          ${feedbackCardsHtml}
        </div>

        <!-- Repeated Mistakes Register -->
        <div style="margin-top: var(--space-2xl); background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: var(--space-lg);">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: var(--space-sm);">
            Common Pitfall Checklist for This Problem
          </h3>
          <ul style="padding-left: 20px; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.8;">
            <li><strong>Inclusive Length Rule:</strong> Substring length between <code>left</code> and <code>right</code> is always <code>right - left + 1</code>.</li>
            <li><strong>Monotonic Left Pointer:</strong> Never assign <code>left = map[ch] + 1</code> directly; wrap with <code>maxOf(left, ...)</code>.</li>
            <li><strong>Garbage Collection Overhead:</strong> Avoid allocating temporary string objects inside loops on high-throughput banking feeds.</li>
            <li><strong>Immutable Val Preferred:</strong> Favor <code>val</code> for loop variables and collection references.</li>
          </ul>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
}
