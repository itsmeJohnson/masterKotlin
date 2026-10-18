/* ==========================================================================
   Lesson View Component
   Renders the 16-step teaching sequence with rich interactive elements.
   ========================================================================== */

import { FUNDAMENTAL_LESSONS } from '../data/lessons-fundamentals.js';
import { CURRICULUM_TOPIC_LESSONS } from '../data/lessons-topics.js';
import { ANDROID_LESSONS } from '../data/lessons-android.js';
import { TESTING_SECURITY_LESSONS } from '../data/lessons-testing-security.js';
import { SENIOR_SCENARIOS } from '../data/lessons-senior-scenarios.js';
import { CURRICULUM } from '../data/curriculum.js';
import { AppState } from '../state.js';
import { highlightKotlin } from '../utils/syntax-highlighter.js';

export class LessonViewComponent {
  constructor(containerEl) {
    this.container = containerEl;
  }

  getLessonData(lessonId) {
    if (FUNDAMENTAL_LESSONS[lessonId]) return FUNDAMENTAL_LESSONS[lessonId];
    if (CURRICULUM_TOPIC_LESSONS[lessonId]) return CURRICULUM_TOPIC_LESSONS[lessonId];
    if (ANDROID_LESSONS[lessonId]) return ANDROID_LESSONS[lessonId];
    if (TESTING_SECURITY_LESSONS[lessonId]) return TESTING_SECURITY_LESSONS[lessonId];
    if (SENIOR_SCENARIOS[lessonId]) return this.convertScenarioToLesson(SENIOR_SCENARIOS[lessonId]);
    
    // Dynamic generator fallback
    const meta = this.findCurriculumItem(lessonId);
    if (meta) return this.generateDynamicLesson(meta);
    return null;
  }

  convertScenarioToLesson(scenario) {
    return {
      id: scenario.id,
      title: scenario.title,
      category: scenario.category,
      difficulty: scenario.difficulty,
      timeEstimate: '30 min',
      steps: [
        {
          stepNumber: 1,
          title: 'Plain English Context & Business Situation',
          content: `<p>${scenario.situation.businessContext}</p>`
        },
        {
          stepNumber: 2,
          title: 'Technical Challenge & Symptoms',
          content: `<p>${scenario.situation.technicalChallenge}</p>`
        },
        {
          stepNumber: 3,
          title: 'High-Level Architectural Analogy',
          content: `<p>Managing banking architecture transitions is like modernizing a high-speed railway: you cannot halt daily passenger services while laying new tracks; changes must be incremental, backward-compatible, and monitored at every junction.</p>`
        },
        {
          stepNumber: 4,
          title: 'Required Kotlin & Architectural Patterns',
          content: `<pre><code class="kotlin">// Explicit API and module boundaries
// Avoid circular dependencies with Clean Architecture contracts
interface FeatureApi {
    fun openFeature(context: Context, payload: String)
}</code></pre>`
        },
        {
          stepNumber: 5,
          title: 'Working Architecture Example',
          content: `<p>Organize Gradle modules into <code>:core:*</code>, <code>:feature:*</code>, and <code>:app</code>. Use internal visibility and explicit public APIs.</p>`
        },
        {
          stepNumber: 6,
          title: 'Step-by-Step Execution Plan',
          content: `<ol>
            <li>Establish baseline telemetry and quality metrics.</li>
            <li>Extract foundational leaf modules (models, networking).</li>
            <li>Decouple UI and domain use cases with unidirectional data flow.</li>
          </ol>`
        },
        {
          stepNumber: 7,
          title: 'State & Risk Management',
          content: '<p>Track risk factors, regulatory audit trails, rollbacks, and feature flagging via Firebase Remote Config.</p>'
        },
        {
          stepNumber: 8,
          title: 'Production Value Progression',
          content: '<p>Measure build time reduction, crash-free user sessions (&gt;99.95%), and engineer sprint velocity.</p>'
        },
        {
          stepNumber: 9,
          title: 'Architecture Trade-Offs',
          content: `<p><strong>Pros:</strong><br/>${scenario.tradeOffs.pros.map(p => `• ${p}`).join('<br/>')}<br/><br/><strong>Cons & Overhead:</strong><br/>${scenario.tradeOffs.cons.map(c => `• ${c}`).join('<br/>')}</p>`
        },
        {
          stepNumber: 10,
          title: 'Iterative Implementation Trace',
          content: '<p>Run pilots with 1-2 feature squads before rolling out new conventions to all 60+ mobile developers.</p>'
        },
        {
          stepNumber: 11,
          title: 'Target Production State',
          content: '<p>Modular, highly testable banking codebase with zero circular references and sub-5-minute clean builds.</p>'
        },
        {
          stepNumber: 12,
          title: 'Common Architectural Mistakes',
          content: '<p>Avoid creating a monolithic <code>:common</code> module that catches all miscellaneous code and recreates monolith coupling.</p>'
        },
        {
          stepNumber: 13,
          title: 'Complexity & Governance Overhead',
          content: '<p>Higher initial build logic maintenance offset by massive continuous delivery dividends.</p>'
        },
        {
          stepNumber: 14,
          title: 'AVP Interview Challenge Question',
          content: `<div class="alert alert-important"><strong>Interview Prompt:</strong> ${scenario.situation.candidateQuestion}</div>`
        },
        {
          stepNumber: 15,
          title: 'What a Strong Senior / AVP Answer Covers',
          content: `<ul>${scenario.evaluationRubric.idealAnswerCoverages.map(a => `<li>${a}</li>`).join('')}</ul>`
        },
        {
          stepNumber: 16,
          title: 'Follow-Up Probing Question',
          content: `<p><strong>Follow-Up Question:</strong> ${scenario.evaluationRubric.followUpQuestion}</p>`
        }
      ]
    };
  }

  generateDynamicLesson(meta) {
    return {
      id: meta.id,
      title: meta.title,
      category: meta.category,
      difficulty: meta.difficulty,
      timeEstimate: meta.duration || '25 min',
      steps: [
        {
          stepNumber: 1,
          title: 'Plain English Concept',
          content: `<p>${meta.summary}</p>`
        },
        {
          stepNumber: 2,
          title: 'Why Developers Need It',
          content: `<p>Core requirement in ${meta.category} technical assessments at Barclays GSC and Tesco Bank. Evaluates clean code structuring and optimal runtime efficiency.</p>`
        },
        {
          stepNumber: 3,
          title: 'Real-World Analogy',
          content: `<p>Think of ${meta.title} as a specialized operational tool in modern software engineering that prevents bugs and optimizes execution.</p>`
        },
        {
          stepNumber: 4,
          title: 'Required Kotlin Syntax',
          content: `<pre><code class="kotlin">// Standard Kotlin idiom for ${meta.title}
fun execute(): Unit {
    // Implementation following Kotlin best practices
}</code></pre>`
        },
        {
          stepNumber: 5,
          title: 'Smallest Working Example',
          content: `<pre><code class="kotlin">fun main() {
    println("Practicing ${meta.title}")
}</code></pre>`
        },
        {
          stepNumber: 6,
          title: 'Line-by-Line Breakdown',
          content: `<p>Clean separation of concerns with immutable state declarations and type-safe handling.</p>`
        },
        {
          stepNumber: 7,
          title: 'Variable & Memory Tracking',
          content: '<p>Zero unnecessary allocations. Memory usage is kept to optimal bounds on the JVM stack and heap.</p>'
        },
        {
          stepNumber: 8,
          title: 'Runtime Progression',
          content: '<p>Predictable step-by-step state transitions throughout the execution cycle.</p>'
        },
        {
          stepNumber: 9,
          title: 'Conditionals & Loop Mechanics',
          content: '<p>Guaranteed boundary safety with exhaustive conditions and edge-case guards.</p>'
        },
        {
          stepNumber: 10,
          title: 'Sample Input Trace',
          content: '<p>Walks through standard test data inputs to verify invariant safety.</p>'
        },
        {
          stepNumber: 11,
          title: 'Final Output',
          content: '<p>Accurate, predictable return value conforming to banking reliability requirements.</p>'
        },
        {
          stepNumber: 12,
          title: 'Edge Cases & Common Mistakes',
          content: '<p>Handling empty inputs, boundary bounds, and concurrency race conditions.</p>'
        },
        {
          stepNumber: 13,
          title: 'Time & Auxiliary Space Complexity',
          content: '<p>Optimal standard complexity: linear <code>O(n)</code> time and constant <code>O(1)</code> auxiliary space.</p>'
        },
        {
          stepNumber: 14,
          title: 'Independent Coding Exercise',
          content: `<p>Open the <strong>Practise (Coding Workspace)</strong> tab above to implement and run your solution against live test cases.</p>`
        },
        {
          stepNumber: 15,
          title: 'Hints & Solution Review',
          content: '<p>Review progressive hints in the workspace drawer before comparing with optimal solution code.</p>'
        },
        {
          stepNumber: 16,
          title: 'Confirmation Practice Problem',
          content: `<p>Reinforce your understanding of ${meta.title} by testing on rotated and edge-case variations.</p>`
        }
      ]
    };
  }

  findCurriculumItem(lessonId) {
    for (const group of CURRICULUM) {
      for (const item of group.items) {
        if (item.id === lessonId) return item;
      }
    }
    return null;
  }

  findNextLessonId(currentId) {
    let allItems = [];
    CURRICULUM.forEach(g => { allItems = allItems.concat(g.items); });
    const idx = allItems.findIndex(i => i.id === currentId);
    if (idx >= 0 && idx < allItems.length - 1) {
      return allItems[idx + 1].id;
    }
    return null;
  }

  render(lessonId) {
    const lesson = this.getLessonData(lessonId);
    const meta = this.findCurriculumItem(lessonId);
    const isBookmarked = !!AppState.data.bookmarks[lessonId];
    const mastery = AppState.data.masteryMap[lessonId] || 'learning';
    const nextLessonId = this.findNextLessonId(lessonId);

    if (!lesson) {
      this.container.innerHTML = `
        <div style="padding: var(--space-xl); text-align: center;">
          <h2>Lesson details loading or in preparation...</h2>
          <p style="color: var(--text-muted); margin-top: 8px;">Select a lesson from Priority 1, 2, 3, or 4 from the sidebar navigation.</p>
        </div>
      `;
      return;
    }

    let stepsHtml = '';
    lesson.steps.forEach((step) => {
      stepsHtml += `
        <section class="lesson-step-section" id="step-${step.stepNumber}">
          <div class="lesson-step-header" tabindex="0" role="button" aria-expanded="true">
            <div class="lesson-step-title">
              <span class="step-num-pill">${step.stepNumber}</span>
              <span>${step.title}</span>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">▲</span>
          </div>
          <div class="lesson-step-content">
            ${step.content}
          </div>
        </section>
      `;
    });

    const html = `
      <div class="content-container">
        <!-- Lesson Header Banner -->
        <div style="margin-bottom: var(--space-xl);">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-sm);">
            <div style="display: flex; align-items: center; gap: var(--space-xs); flex-wrap: wrap;">
              <span class="badge badge-beginner">${lesson.difficulty || meta?.difficulty || 'Standard'}</span>
              <span class="badge badge-bank">${lesson.category || meta?.category || 'Curriculum'}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">⏱️ ${lesson.timeEstimate || '25 min'}</span>
            </div>

            <div style="display: flex; align-items: center; gap: var(--space-xs);">
              <button class="btn btn-secondary btn-sm" id="btn-bookmark-lesson">
                ${isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
              </button>
              <select id="select-mastery" class="speed-select" style="padding: 4px 10px;">
                <option value="learning" ${mastery === 'learning' ? 'selected' : ''}>Status: Learning</option>
                <option value="practising" ${mastery === 'practising' ? 'selected' : ''}>Status: Practising</option>
                <option value="needs_revision" ${mastery === 'needs_revision' ? 'selected' : ''}>Status: Needs Revision</option>
                <option value="mastered" ${mastery === 'mastered' ? 'selected' : ''}>Status: Mastered</option>
              </select>
            </div>
          </div>

          <h1 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin-bottom: var(--space-xs);">
            ${lesson.title}
          </h1>
          <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6;">
            ${meta?.summary || 'Follow the complete 16-step teaching sequence from plain English explanation to working Kotlin code and edge-case mastery.'}
          </p>

          <!-- Quick Action Bar -->
          <div class="quick-action-bar" style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg); flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-open-trace">
              ▶ Step-by-Step Algorithm Tutor (Trace)
            </button>
            <button class="btn btn-secondary" id="btn-open-practise">
              ✍ Solve Coding Exercise
            </button>
            <button class="btn btn-ghost" id="btn-open-review">
              🔍 Code Review Anti-Patterns
            </button>
          </div>
        </div>

        <!-- 16-Step Lesson Body -->
        <div class="lesson-steps-container">
          ${stepsHtml}
        </div>

        <!-- Bottom Next Lesson Navigation -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-2xl); padding-top: var(--space-lg); border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: var(--space-md);">
          <button class="btn btn-secondary" id="btn-mark-understood">
            ✓ Mark Concept Understood
          </button>
          ${nextLessonId ? `
            <button class="btn btn-primary" id="btn-next-lesson" data-next-id="${nextLessonId}">
              Next Lesson &rarr;
            </button>
          ` : '<span style="color: var(--text-muted); font-size: 0.9rem;">Curriculum Completed!</span>'}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.postProcessSyntax();
    this.bindEvents(lessonId);
  }

  postProcessSyntax() {
    this.container.querySelectorAll('pre code.kotlin').forEach((block) => {
      const raw = block.textContent;
      block.innerHTML = highlightKotlin(raw);
    });
  }

  bindEvents(lessonId) {
    // Accordion toggle on step headers
    this.container.querySelectorAll('.lesson-step-header').forEach((hdr) => {
      hdr.addEventListener('click', () => {
        const section = hdr.closest('.lesson-step-section');
        const content = section.querySelector('.lesson-step-content');
        const arrow = hdr.querySelector('span:last-child');
        if (content.style.display === 'none') {
          content.style.display = 'block';
          arrow.textContent = '▲';
        } else {
          content.style.display = 'none';
          arrow.textContent = '▼';
        }
      });
    });

    // Bookmark toggle
    const bmBtn = this.container.querySelector('#btn-bookmark-lesson');
    if (bmBtn) {
      bmBtn.addEventListener('click', () => {
        AppState.toggleBookmark(lessonId);
      });
    }

    // Mastery selector
    const masterySelect = this.container.querySelector('#select-mastery');
    if (masterySelect) {
      masterySelect.addEventListener('change', (e) => {
        AppState.setMastery(lessonId, e.target.value);
      });
    }

    // Switch mode buttons
    const traceBtn = this.container.querySelector('#btn-open-trace');
    if (traceBtn) traceBtn.addEventListener('click', () => AppState.setMode('trace'));

    const practiseBtn = this.container.querySelector('#btn-open-practise');
    if (practiseBtn) practiseBtn.addEventListener('click', () => AppState.setMode('practise'));

    const reviewBtn = this.container.querySelector('#btn-open-review');
    if (reviewBtn) reviewBtn.addEventListener('click', () => AppState.setMode('review'));

    const markUnderstoodBtn = this.container.querySelector('#btn-mark-understood');
    if (markUnderstoodBtn) {
      markUnderstoodBtn.addEventListener('click', () => {
        AppState.setMastery(lessonId, 'practising');
        AppState.setMode('practise');
      });
    }

    const nextBtn = this.container.querySelector('#btn-next-lesson');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextId = nextBtn.dataset.nextId;
        if (nextId) AppState.setLesson(nextId);
      });
    }
  }
}
