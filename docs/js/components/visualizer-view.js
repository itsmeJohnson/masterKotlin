/* ==========================================================================
   Visualizer View Component
   Step-by-step visual algorithm tutor with dynamic execution trace.
   ========================================================================== */

import { VisualizerEngine } from '../visualizer-engine.js';
import { FUNDAMENTAL_LESSONS } from '../data/lessons-fundamentals.js';
import { CURRICULUM_TOPIC_LESSONS } from '../data/lessons-topics.js';
import { AppState } from '../state.js';

export class VisualizerViewComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentInput = 'abcba';
    this.currentTrace = [];
    this.currentStepIdx = 0;
    this.isPlaying = false;
    this.playInterval = null;
    this.playbackSpeed = 1000; // ms
  }

  loadForLesson(lessonId) {
    const lesson = FUNDAMENTAL_LESSONS[lessonId] || CURRICULUM_TOPIC_LESSONS[lessonId];
    if (lesson && lesson.visualizerSample) {
      this.currentInput = lesson.visualizerSample;
    } else {
      this.currentInput = 'abcba';
    }
    this.generateTrace();
    this.render();
  }

  generateTrace() {
    this.currentStepIdx = 0;
    this.stopPlayback();

    // Check if input is array format or string
    if (this.currentInput.startsWith('[') && this.currentInput.endsWith(']')) {
      try {
        const parsed = JSON.parse(this.currentInput);
        this.currentTrace = VisualizerEngine.generateKadaneTrace(parsed);
      } catch (e) {
        this.currentTrace = VisualizerEngine.generateSubstringTrace(this.currentInput);
      }
    } else {
      this.currentTrace = VisualizerEngine.generateSubstringTrace(this.currentInput);
    }
  }

  render() {
    if (!this.currentTrace || this.currentTrace.length === 0) {
      this.container.innerHTML = '<div style="padding: var(--space-xl);">No trace generated.</div>';
      return;
    }

    const step = this.currentTrace[this.currentStepIdx];
    const totalSteps = this.currentTrace.length - 1;
    const progressPercent = totalSteps > 0 ? (this.currentStepIdx / totalSteps) * 100 : 0;

    // Render cells & pointers
    let pointerSlotsHtml = '';
    let cellsHtml = '';
    let indexSlotsHtml = '';

    step.chars.forEach((char, idx) => {
      // Determine pointers present at this index
      const isLeft = step.pointers && step.pointers.left === idx;
      const isRight = step.pointers && step.pointers.right === idx;
      const isMid = step.pointers && step.pointers.mid === idx;

      let pointerBadges = '';
      if (isLeft && isRight) {
        pointerBadges = `<span class="pointer-badge pointer-left" style="font-size: 0.65rem;">L&R</span>`;
      } else if (isLeft) {
        pointerBadges = `<span class="pointer-badge pointer-left">L</span>`;
      } else if (isRight) {
        pointerBadges = `<span class="pointer-badge pointer-right">R</span>`;
      } else if (isMid) {
        pointerBadges = `<span class="pointer-badge pointer-mid">M</span>`;
      }

      pointerSlotsHtml += `
        <div class="pointer-slot">
          ${pointerBadges}
        </div>
      `;

      // Determine cell styling
      const inWindow = step.windowRange && idx >= step.windowRange[0] && idx <= step.windowRange[1];
      const isCurrentInspect = step.activeIndices && step.activeIndices.includes(idx);
      const isMatched = step.matchedIndices && step.matchedIndices.includes(idx);

      let cellClasses = 'array-cell';
      if (isMatched) cellClasses += ' matched-duplicate';
      else if (isCurrentInspect) cellClasses += ' current-inspect';
      else if (inWindow) cellClasses += ' in-window';

      cellsHtml += `
        <div class="${cellClasses}" title="Index ${idx}: '${char}'">
          ${char}
        </div>
      `;

      indexSlotsHtml += `
        <div class="index-slot">[${idx}]</div>
      `;
    });

    // Render Variables Watch Grid
    let variablesHtml = '';
    if (step.variables) {
      for (const [k, v] of Object.entries(step.variables)) {
        variablesHtml += `
          <div class="var-chip">
            <span class="var-name">${k}</span>
            <span class="var-val">${v}</span>
          </div>
        `;
      }
    }

    // Render HashMap State Table
    let hashmapRowsHtml = '';
    const mapKeys = Object.keys(step.hashmap || {});
    if (mapKeys.length === 0) {
      hashmapRowsHtml = `<tr><td colspan="2" class="hashmap-empty">HashMap is currently empty</td></tr>`;
    } else {
      mapKeys.forEach((key) => {
        const isJustUpdated = step.updatedMapKey === key;
        hashmapRowsHtml += `
          <tr class="hashmap-row ${isJustUpdated ? 'just-updated' : ''}">
            <td><strong>'${key}'</strong></td>
            <td>Index <strong>${step.hashmap[key]}</strong></td>
          </tr>
        `;
      });
    }

    const html = `
      <div class="visualizer-container">
        <!-- Top Toolbar -->
        <div class="visualizer-top-bar">
          <div class="visualizer-input-group">
            <label class="visualizer-input-label" for="vis-input">Input String / Array:</label>
            <input type="text" id="vis-input" class="visualizer-input" value="${this.currentInput}" />
            <button class="btn btn-secondary btn-sm" id="btn-vis-run">Trace Input</button>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap;">
            <span class="visualizer-badge-engine">✓ Active Algorithm Simulation</span>
            
            <div class="playback-controls">
              <button class="btn btn-icon btn-sm" id="btn-vis-prev" title="Step Back" ${this.currentStepIdx === 0 ? 'disabled' : ''}>⏮</button>
              <button class="btn btn-primary btn-sm" id="btn-vis-play" style="min-width: 80px;">
                ${this.isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button class="btn btn-icon btn-sm" id="btn-vis-next" title="Step Next" ${this.currentStepIdx === totalSteps ? 'disabled' : ''}>⏭</button>
              <button class="btn btn-ghost btn-sm" id="btn-vis-reset" title="Reset to Start">↺ Reset</button>

              <select id="vis-speed" class="speed-select" title="Playback Speed">
                <option value="1500">0.7x (Slow)</option>
                <option value="1000" selected>1.0x (Normal)</option>
                <option value="500">2.0x (Fast)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step Progress Bar -->
        <div class="step-progress-wrapper">
          <div class="step-progress-bar">
            <div class="step-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <span class="step-counter-text">Step <strong>${this.currentStepIdx}</strong> of <strong>${totalSteps}</strong></span>
        </div>

        <!-- Visual Stage Canvas -->
        <div class="visualizer-stage">
          <div class="array-container">
            <div class="pointer-lane">${pointerSlotsHtml}</div>
            <div class="cells-lane">${cellsHtml}</div>
            <div class="index-lane">${indexSlotsHtml}</div>
          </div>
        </div>

        <!-- Detailed Inspection Grid -->
        <div class="visualizer-inspect-grid">
          <!-- Left: Step Explanation & Reasoning -->
          <div class="step-card">
            <div class="step-card-header">
              <span class="step-phase-badge">${step.phase || 'STEP'}</span>
              <strong style="color: var(--text-primary); font-size: 0.95rem;">${step.title}</strong>
            </div>

            <!-- Condition Evaluated -->
            <div class="condition-box ${step.conditionResult === true ? 'true-cond' : step.conditionResult === false ? 'false-cond' : ''}">
              <div style="font-weight: 700; font-size: 0.775rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px;">Condition Evaluated:</div>
              <div>
                <code>${step.conditionText}</code>
                ${step.conditionResult !== null ? `<span class="condition-eval-badge ${step.conditionResult ? 'true' : 'false'}">${step.conditionResult ? 'TRUE' : 'FALSE'}</span>` : ''}
              </div>
            </div>

            <!-- Action Executed -->
            <div class="action-box">
              <div style="font-weight: 700; font-size: 0.775rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px;">Action Executed:</div>
              <div>${step.actionText}</div>
            </div>

            <!-- Why this step happens -->
            <div class="pedagogy-box">
              <div class="pedagogy-title">
                <span>💡</span> Why This Step Happens
              </div>
              <div>${step.pedagogy}</div>
            </div>

            <!-- Current Answer -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-tertiary); padding: 10px 14px; border-radius: var(--radius-md);">
              <span style="font-size: 0.85rem; color: var(--text-muted);">Current State / Result:</span>
              <strong style="color: var(--accent-android); font-family: var(--font-mono); font-size: 1rem;">${step.currentAnswer}</strong>
            </div>
          </div>

          <!-- Right: Variable Watch & HashMap State -->
          <div class="inspector-panel">
            <!-- Variables Watch -->
            <div class="inspector-card">
              <div class="inspector-title">
                <span>Variables Watch List</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">Live Memory</span>
              </div>
              <div class="variables-watch-grid">
                ${variablesHtml}
              </div>
            </div>

            <!-- HashMap Key-Value Entries -->
            <div class="inspector-card">
              <div class="inspector-title">
                <span>HashMap&lt;Char, Int&gt; (Last Seen)</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${mapKeys.length} entries</span>
              </div>
              <div class="data-table-wrapper" style="margin: 0; max-height: 220px; overflow-y: auto;">
                <table class="hashmap-table">
                  <thead>
                    <tr>
                      <th>Character (Key)</th>
                      <th>Last Seen Index (Value)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${hashmapRowsHtml}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents();
  }

  bindEvents() {
    // Input change and Run
    const runBtn = this.container.querySelector('#btn-vis-run');
    const inputField = this.container.querySelector('#vis-input');
    if (runBtn && inputField) {
      runBtn.addEventListener('click', () => {
        const val = inputField.value.trim();
        if (val) {
          this.currentInput = val;
          this.generateTrace();
          this.render();
        }
      });
      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runBtn.click();
      });
    }

    // Playback Controls
    const prevBtn = this.container.querySelector('#btn-vis-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.stopPlayback();
        if (this.currentStepIdx > 0) {
          this.currentStepIdx--;
          this.render();
        }
      });
    }

    const nextBtn = this.container.querySelector('#btn-vis-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.stopPlayback();
        if (this.currentStepIdx < this.currentTrace.length - 1) {
          this.currentStepIdx++;
          this.render();
        }
      });
    }

    const playBtn = this.container.querySelector('#btn-vis-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.stopPlayback();
          this.render();
        } else {
          this.startPlayback();
        }
      });
    }

    const resetBtn = this.container.querySelector('#btn-vis-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.stopPlayback();
        this.currentStepIdx = 0;
        this.render();
      });
    }

    const speedSelect = this.container.querySelector('#vis-speed');
    if (speedSelect) {
      speedSelect.value = String(this.playbackSpeed);
      speedSelect.addEventListener('change', (e) => {
        this.playbackSpeed = parseInt(e.target.value, 10);
        if (this.isPlaying) {
          this.stopPlayback();
          this.startPlayback();
        }
      });
    }
  }

  startPlayback() {
    this.isPlaying = true;
    this.render();

    this.playInterval = setInterval(() => {
      if (this.currentStepIdx < this.currentTrace.length - 1) {
        this.currentStepIdx++;
        this.render();
      } else {
        this.stopPlayback();
        this.render();
      }
    }, this.playbackSpeed);
  }

  stopPlayback() {
    this.isPlaying = false;
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }
}
