/* ==========================================================================
   Workspace View Component
   Interactive Kotlin Coding Workspace with Real Compiler Execution
   ========================================================================== */

import { EXERCISES } from '../data/exercises.js';
import { FUNDAMENTAL_LESSONS } from '../data/lessons-fundamentals.js';
import { CURRICULUM_TOPIC_LESSONS } from '../data/lessons-topics.js';
import { ANDROID_LESSONS } from '../data/lessons-android.js';
import { TESTING_SECURITY_LESSONS } from '../data/lessons-testing-security.js';
import { ApiClient } from '../api.js';
import { AppState } from '../state.js';
import { highlightKotlin } from '../utils/syntax-highlighter.js';

export class WorkspaceViewComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentExerciseId = 'ex-substring-abcba';
    this.activeOutputTab = 'console'; // 'console' | 'testcases' | 'solution'
    this.revealedHintIndex = 0;
    this.isRunning = false;
    this.lastRunResult = null;
    this.testCaseResults = [];
    this.mobileActiveTab = 'problem'; // 'problem' | 'editor'
  }

  loadForLesson(lessonId) {
    const lesson = FUNDAMENTAL_LESSONS[lessonId] ||
                   CURRICULUM_TOPIC_LESSONS[lessonId] ||
                   ANDROID_LESSONS[lessonId] ||
                   TESTING_SECURITY_LESSONS[lessonId];
    if (lesson && lesson.problemId && EXERCISES[lesson.problemId]) {
      this.currentExerciseId = lesson.problemId;
    } else {
      this.currentExerciseId = 'ex-substring-abcba';
    }
    this.revealedHintIndex = 0;
    this.lastRunResult = null;
    this.testCaseResults = [];
    this.render();
  }

  render() {
    const ex = EXERCISES[this.currentExerciseId] || EXERCISES['ex-substring-abcba'];
    const savedCode = AppState.data.codeDrafts[ex.id] || ex.starterCode;

    // Render examples
    let examplesHtml = '';
    ex.examples.forEach((example, idx) => {
      examplesHtml += `
        <div class="example-card">
          <div class="example-label">Example ${idx + 1}</div>
          <div><strong>Input:</strong> <code>${example.input}</code></div>
          <div><strong>Output:</strong> <code>${example.output}</code></div>
          ${example.explanation ? `<div style="margin-top: 4px; color: var(--text-secondary); font-size: 0.8rem;"><strong>Explanation:</strong> ${example.explanation}</div>` : ''}
        </div>
      `;
    });

    // Render constraints
    let constraintsHtml = '';
    ex.constraints.forEach((c) => {
      constraintsHtml += `<li><code>${c}</code></li>`;
    });

    // Render hints
    let hintsHtml = '';
    ex.hints.forEach((hint, idx) => {
      const isRevealed = idx < this.revealedHintIndex;
      hintsHtml += `
        <div class="hint-card">
          <div class="hint-header" data-hint-idx="${idx}">
            <span>💡 Hint ${hint.level}</span>
            <span>${isRevealed ? '▼' : '🔒 Reveal'}</span>
          </div>
          ${isRevealed ? `<div class="hint-body">${hint.text}</div>` : ''}
        </div>
      `;
    });

    // Render line numbers
    const linesCount = savedCode.split('\n').length;
    let lineNumsHtml = '';
    for (let i = 1; i <= Math.max(linesCount, 18); i++) {
      lineNumsHtml += `<div>${i}</div>`;
    }

    // Output Area Tab Content
    let outputContentHtml = '';
    if (this.activeOutputTab === 'console') {
      if (this.isRunning) {
        outputContentHtml = `<div style="color: var(--color-info);">Executing Kotlin compiler (kotlinc 2.1.20 JVM)...</div>`;
      } else if (this.lastRunResult) {
        outputContentHtml = `
          <div style="margin-bottom: 8px; display: flex; gap: 12px; font-size: 0.775rem;">
            <span style="color: ${this.lastRunResult.success ? 'var(--color-success)' : 'var(--color-error)'}; font-weight: 700;">
              ${this.lastRunResult.success ? '✓ Build & Execution Successful' : '✗ Build Failed / Runtime Error'}
            </span>
            <span style="color: var(--text-muted);">⏱️ ${this.lastRunResult.executionTimeMs} ms</span>
            <span style="color: var(--text-muted);">Compiler: ${this.lastRunResult.compiler}</span>
          </div>
          ${this.lastRunResult.stdout ? `<div class="console-output">${this.lastRunResult.stdout}</div>` : ''}
          ${this.lastRunResult.stderr ? `<div class="console-error">${this.lastRunResult.stderr}</div>` : ''}
        `;
      } else {
        outputContentHtml = `<div style="color: var(--text-muted);">Click "Run Code" to compile and execute with the local Kotlin engine.</div>`;
      }
    } else if (this.activeOutputTab === 'testcases') {
      let testListHtml = '';
      ex.testCases.forEach((tc, idx) => {
        const res = this.testCaseResults[idx];
        const statusClass = res ? (res.passed ? 'pass' : 'fail') : '';
        testListHtml += `
          <div class="test-case-item ${statusClass}">
            <div>
              <strong style="color: var(--text-primary); font-size: 0.85rem;">${tc.name}</strong>
              <div style="color: var(--text-muted); font-size: 0.75rem;">Input: <code>${tc.input}</code> | Expected: <code>${tc.expected}</code></div>
              ${res && !res.passed ? `<div style="color: var(--color-error); font-size: 0.75rem;">Actual: <code>${res.actual}</code></div>` : ''}
            </div>
            <div>
              ${res ? `<span class="test-case-badge ${res.passed ? 'pass' : 'fail'}">${res.passed ? 'PASSED' : 'FAILED'}</span>` : '<span style="color: var(--text-muted); font-size: 0.75rem;">Pending Run</span>'}
            </div>
          </div>
        `;
      });
      outputContentHtml = `<div class="test-cases-list">${testListHtml}</div>`;
    } else if (this.activeOutputTab === 'solution') {
      outputContentHtml = `
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          <div class="alert alert-important">
            <div class="alert-icon">🏆</div>
            <div>
              <strong>Reference Solution & Architectural Complexity</strong>
              <p style="margin-top: 4px;">Compare your logic against the optimal standard Kotlin implementation below.</p>
            </div>
          </div>
          <pre><code class="kotlin">${highlightKotlin(ex.solution.code)}</code></pre>
          <div style="font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">
            <p><strong>Time Complexity:</strong> ${ex.solution.timeComplexity}</p>
            <p><strong>Space Complexity:</strong> ${ex.solution.spaceComplexity}</p>
            <p style="margin-top: 8px;"><strong>Common Pitfalls to Avoid:</strong></p>
            <ul>
              ${ex.solution.pitfalls.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    const html = `
      <div class="workspace-container" data-mobile-active="${this.mobileActiveTab}">
        <!-- Mobile Segmented Tab Switcher (Visible on <= 860px) -->
        <div class="mobile-workspace-tabs" role="tablist">
          <button class="mobile-ws-tab ${this.mobileActiveTab === 'problem' ? 'active' : ''}" data-ws-tab="problem" role="tab" aria-selected="${this.mobileActiveTab === 'problem'}">
            📋 Problem Details
          </button>
          <button class="mobile-ws-tab ${this.mobileActiveTab === 'editor' ? 'active' : ''}" data-ws-tab="editor" role="tab" aria-selected="${this.mobileActiveTab === 'editor'}">
            💻 Code & Test Runner
          </button>
        </div>

        <!-- Left: Problem Details -->
        <div class="problem-panel">
          <div class="problem-header">
            <div class="problem-meta-row">
              <span class="badge badge-medium">${ex.difficulty}</span>
              <span class="badge badge-bank">${ex.category}</span>
            </div>
            <h2 class="problem-title">${ex.title}</h2>
          </div>

          <div class="problem-desc-box">
            ${ex.description}
          </div>

          <div class="spec-section">
            <div class="spec-title">Input Format</div>
            <div class="spec-code">${ex.inputFormat}</div>
            <div class="spec-title" style="margin-top: 10px;">Output Format</div>
            <div class="spec-code">${ex.outputFormat}</div>
          </div>

          <!-- Examples -->
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: var(--space-xs);">Examples</h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
              ${examplesHtml}
            </div>
          </div>

          <!-- Constraints -->
          <div class="spec-section">
            <div class="spec-title">Constraints</div>
            <ul style="padding-left: 18px; font-size: 0.825rem; color: var(--text-secondary);">
              ${constraintsHtml}
            </ul>
          </div>

          <!-- Hints Progressive Drawer -->
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: var(--space-xs);">Hints & Progressive Guidance</h3>
            <div class="hints-container">
              ${hintsHtml}
            </div>
          </div>

          <!-- Mobile Jump to Editor CTA -->
          <div class="mobile-only-inline" style="margin-top: var(--space-md); width: 100%;">
            <button class="btn btn-primary" id="btn-mobile-goto-editor" style="width: 100%; min-height: 44px;">
              💻 Ready to Code? Open Editor & Tests →
            </button>
          </div>
        </div>

        <!-- Right: Code Editor & Execution Panel -->
        <div class="editor-panel">
          <div class="editor-top-bar">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-ghost btn-sm mobile-only-inline" id="btn-mobile-goto-problem" title="View Problem Details">
                ← Problem
              </button>
              <div class="editor-file-tab">
                <span>Solution.kt</span>
              </div>
            </div>

            <div class="compiler-status-indicator">
              <span class="status-dot-pulse"></span>
              <span id="compiler-label">kotlinc 2.1.20 JVM Ready</span>
            </div>
          </div>

          <!-- Code Editor Body -->
          <div class="code-editor-wrapper">
            <div class="line-numbers" id="editor-lines">
              ${lineNumsHtml}
            </div>
            <textarea
              id="code-editor-input"
              class="code-textarea"
              spellcheck="false"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
            >${savedCode}</textarea>
          </div>

          <!-- Action Bar -->
          <div class="editor-action-bar">
            <div class="action-bar-left">
              <button class="btn btn-secondary btn-sm" id="btn-reset-code" title="Reset starter code">
                ↺ Reset Starter
              </button>
            </div>
            <div class="action-bar-right">
              <button class="btn btn-primary" id="btn-run-code" ${this.isRunning ? 'disabled' : ''}>
                ▶ ${this.isRunning ? 'Compiling...' : 'Run Code'}
              </button>
              <button class="btn btn-success" id="btn-submit-code" ${this.isRunning ? 'disabled' : ''}>
                ✓ Submit Solution
              </button>
            </div>
          </div>

          <!-- Drawer Output & Test Cases -->
          <div class="output-drawer">
            <div class="output-tabs">
              <button class="output-tab-btn ${this.activeOutputTab === 'console' ? 'active' : ''}" data-tab="console">
                Console Output
              </button>
              <button class="output-tab-btn ${this.activeOutputTab === 'testcases' ? 'active' : ''}" data-tab="testcases">
                Test Cases (${ex.testCases.length})
              </button>
              <button class="output-tab-btn ${this.activeOutputTab === 'solution' ? 'active' : ''}" data-tab="solution">
                Optimal Solution & Pitfalls
              </button>
            </div>
            <div class="output-content-area">
              ${outputContentHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents(ex);
  }

  bindEvents(ex) {
    const editor = this.container.querySelector('#code-editor-input');
    const lineNums = this.container.querySelector('#editor-lines');

    // Auto update line numbers & save draft on input
    if (editor) {
      editor.addEventListener('input', () => {
        const val = editor.value;
        AppState.saveCodeDraft(ex.id, val);

        const linesCount = val.split('\n').length;
        let lineNumsHtml = '';
        for (let i = 1; i <= Math.max(linesCount, 18); i++) {
          lineNumsHtml += `<div>${i}</div>`;
        }
        if (lineNums) lineNums.innerHTML = lineNumsHtml;
      });

      // Tab key support
      editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = editor.selectionStart;
          const end = editor.selectionEnd;
          editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
          editor.selectionStart = editor.selectionEnd = start + 4;
        }
      });
    }

    // Output Tab Switching
    this.container.querySelectorAll('.output-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeOutputTab = btn.dataset.tab;
        this.render();
      });
    });

    // Hints Reveal Click
    this.container.querySelectorAll('.hint-header').forEach((hdr) => {
      hdr.addEventListener('click', () => {
        const idx = parseInt(hdr.dataset.hintIdx, 10);
        if (this.revealedHintIndex <= idx) {
          this.revealedHintIndex = idx + 1;
        }
        this.render();
      });
    });

    // Reset Starter Code
    const resetBtn = this.container.querySelector('#btn-reset-code');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset editor back to original starter code?')) {
          AppState.saveCodeDraft(ex.id, ex.starterCode);
          this.render();
        }
      });
    }

    // Run Code Button
    const runBtn = this.container.querySelector('#btn-run-code');
    if (runBtn) {
      runBtn.addEventListener('click', async () => {
        const code = editor ? editor.value : '';
        this.isRunning = true;
        this.activeOutputTab = 'console';
        this.render();

        const result = await ApiClient.executeKotlin(code);
        this.isRunning = false;
        this.lastRunResult = result;
        this.render();
      });
    }

    // Submit Solution Button (runs all test cases)
    const submitBtn = this.container.querySelector('#btn-submit-code');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const code = editor ? editor.value : '';
        this.isRunning = true;
        this.activeOutputTab = 'testcases';
        this.render();

        this.testCaseResults = [];
        let allPassed = true;

        for (const tc of ex.testCases) {
          // Construct test execution script by appending test case call
          const testScript = `${code}\n\n${tc.testSnippet}`;
          const res = await ApiClient.executeKotlin(testScript);
          const actualOutput = (res.stdout || '').trim();
          const passed = res.success && (actualOutput === tc.expected || actualOutput.endsWith(tc.expected));

          if (!passed) allPassed = false;
          this.testCaseResults.push({
            passed,
            actual: actualOutput || res.stderr || 'No output'
          });
        }

        this.isRunning = false;
        AppState.recordExerciseAttempt(ex.id, allPassed);
        if (allPassed) {
          AppState.setMastery(AppState.data.currentLessonId, 'mastered');
        }
        this.render();
      });
    }

    // Mobile Workspace Tab Switching
    this.container.querySelectorAll('.mobile-ws-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.mobileActiveTab = tab.dataset.wsTab;
        const wsContainer = this.container.querySelector('.workspace-container');
        if (wsContainer) wsContainer.setAttribute('data-mobile-active', this.mobileActiveTab);
        this.container.querySelectorAll('.mobile-ws-tab').forEach((t) => {
          const isActive = t.dataset.wsTab === this.mobileActiveTab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      });
    });

    // Mobile Quick Jump CTA: Problem -> Editor
    const gotoEditorBtn = this.container.querySelector('#btn-mobile-goto-editor');
    if (gotoEditorBtn) {
      gotoEditorBtn.addEventListener('click', () => {
        this.mobileActiveTab = 'editor';
        const wsContainer = this.container.querySelector('.workspace-container');
        if (wsContainer) wsContainer.setAttribute('data-mobile-active', 'editor');
        this.container.querySelectorAll('.mobile-ws-tab').forEach((t) => {
          const isActive = t.dataset.wsTab === 'editor';
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Mobile Quick Jump CTA: Editor -> Problem
    const gotoProblemBtn = this.container.querySelector('#btn-mobile-goto-problem');
    if (gotoProblemBtn) {
      gotoProblemBtn.addEventListener('click', () => {
        this.mobileActiveTab = 'problem';
        const wsContainer = this.container.querySelector('.workspace-container');
        if (wsContainer) wsContainer.setAttribute('data-mobile-active', 'problem');
        this.container.querySelectorAll('.mobile-ws-tab').forEach((t) => {
          const isActive = t.dataset.wsTab === 'problem';
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
}
