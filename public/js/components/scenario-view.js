/* ==========================================================================
   Scenario View Component
   Senior Android Developer & AVP Leadership Interactive Assessment
   ========================================================================== */

import { SENIOR_SCENARIOS } from '../data/lessons-senior-scenarios.js';
import { AppState } from '../state.js';

export class ScenarioViewComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentScenarioId = 'scenario-monolith-to-modular';
    this.evaluationResult = null;
  }

  loadScenario(scenarioId) {
    this.currentScenarioId = scenarioId || 'scenario-monolith-to-modular';
    this.evaluationResult = null;
    this.render();
  }

  render() {
    const sc = SENIOR_SCENARIOS[this.currentScenarioId] || SENIOR_SCENARIOS['scenario-monolith-to-modular'];
    const savedScore = AppState.data.scenarioScores[sc.id];

    let evalHtml = '';
    if (this.evaluationResult) {
      evalHtml = `
        <div style="margin-top: var(--space-xl); background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: var(--space-xl); animation: slideUp 250ms ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md); flex-wrap: wrap; gap: 8px;">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">
              Senior Evaluation: Score ${this.evaluationResult.score}/100
            </h3>
            <span class="badge ${this.evaluationResult.score >= 70 ? 'badge-beginner' : 'badge-medium'}">
              ${this.evaluationResult.verdict}
            </span>
          </div>

          <div style="color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-md);">
            ${this.evaluationResult.feedback}
          </div>

          <!-- Model Senior Answer -->
          <div class="alert alert-tip" style="flex-direction: column; align-items: flex-start; margin-top: var(--space-md);">
            <div style="font-weight: 700; margin-bottom: 4px;">🎯 What a Strong Senior / AVP Answer Covers:</div>
            <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.7;">
              ${sc.evaluationRubric.idealAnswerCoverages.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>

          <!-- Follow-up Question -->
          <div style="margin-top: var(--space-lg); background: var(--bg-secondary); border-radius: var(--radius-md); padding: 14px 18px; border-left: 4px solid var(--color-purple);">
            <strong style="color: var(--color-purple); font-size: 0.85rem; text-transform: uppercase;">Follow-Up Probing Question:</strong>
            <p style="margin-top: 6px; font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">
              ${sc.evaluationRubric.followUpQuestion}
            </p>
          </div>
        </div>
      `;
    }

    const html = `
      <div class="content-container">
        <!-- Scenario Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div style="display: flex; gap: 8px; margin-bottom: var(--space-xs);">
            <span class="badge badge-avp">Senior & AVP Assessment</span>
            <span class="badge badge-bank">${sc.category}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: auto;">⏱️ ${sc.timeEstimate}</span>
          </div>
          <h1 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 800; color: var(--text-primary);">
            ${sc.title}
          </h1>
        </div>

        <!-- Situation Briefing -->
        <div class="lesson-card">
          <h2 style="font-size: 1rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-sm);">
            Business & Technical Context
          </h2>
          <div style="color: var(--text-secondary); line-height: 1.7;">
            ${sc.situation}
          </div>
        </div>

        <!-- Prompt Question & User Response -->
        <div style="margin-top: var(--space-lg);">
          <label for="scenario-user-answer" style="display: block; font-weight: 700; font-size: 1rem; color: var(--text-primary); margin-bottom: var(--space-xs);">
            ${sc.promptQuestion}
          </label>
          <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: var(--space-sm);">
            Detail your architectural reasoning, stakeholder communication plan, technical trade-offs, and risk controls.
          </p>

          <textarea
            id="scenario-user-answer"
            class="code-textarea"
            style="width: 100%; height: 220px; background: var(--bg-secondary); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 16px; font-family: var(--font-sans); font-size: 0.925rem; line-height: 1.6; color: var(--text-primary);"
            placeholder="Structure your answer: 1. Immediate actions, 2. Architectural strategy, 3. Stakeholder & Product management, 4. Metrics & Guardrails..."
          >${savedScore ? savedScore.userAnswer || '' : ''}</textarea>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-md); flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              Evaluates: Architecture, Team Scalability, Governance & Financial Risk
            </span>
            <button class="btn btn-primary" id="btn-eval-scenario">
              Evaluate My Reasoning
            </button>
          </div>
        </div>

        <!-- Evaluation Results -->
        ${evalHtml}
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents(sc);
  }

  bindEvents(sc) {
    const evalBtn = this.container.querySelector('#btn-eval-scenario');
    const answerInput = this.container.querySelector('#scenario-user-answer');

    if (evalBtn && answerInput) {
      evalBtn.addEventListener('click', () => {
        const text = answerInput.value.trim().toLowerCase();
        if (text.length < 30) {
          alert('Please provide a substantive response (at least 3-4 sentences explaining your approach) before evaluation.');
          return;
        }

        // Evaluate matching against rubric key themes
        let matches = 0;
        const matchedThemes = [];
        sc.evaluationRubric.keyThemes.forEach((theme) => {
          if (text.includes(theme.toLowerCase())) {
            matches++;
            matchedThemes.push(theme);
          }
        });

        const totalThemes = sc.evaluationRubric.keyThemes.length;
        const score = Math.min(95, Math.round(50 + (matches / totalThemes) * 45));

        let verdict = 'Strong Senior Reasoning';
        let feedback = `You addressed key architectural considerations (${matchedThemes.join(', ')}). `;
        if (score < 65) {
          verdict = 'Needs More Senior Depth';
          feedback = 'Your answer addresses the immediate problem but misses broader organizational impacts like stakeholder negotiation, remote build caches, and programmatic boundary enforcement. ';
        }

        this.evaluationResult = { score, verdict, feedback };
        AppState.data.scenarioScores[sc.id] = {
          score,
          userAnswer: answerInput.value,
          timestamp: Date.now()
        };
        AppState.save();
        this.render();
      });
    }
  }
}
