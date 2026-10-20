/* ==========================================================================
   HackerEarth-Exact Three Options View Component
   Matches the HackerEarth Practice Test UI/UX for Tesco Bank & Barclays GSC
   ========================================================================== */

import {
  getAllDbmsQueries,
  getAllMcqs,
  getAllDsaPrograms,
  DBMS_TAGS,
  MCQ_TAGS,
  DSA_TAGS,
  filterItems
} from '../data/three-options-data.js';

export class ThreeOptionsViewComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.activeTab = 'dbms'; // 'dbms' | 'mcqs' | 'dsa'
    this.searchQuery = '';
    this.activeTag = 'All';
    this.toastTimer = null;
    
    // Timer state for HackerEarth test simulation (45:00 countdown)
    this.remainingSeconds = 45 * 60;
    this.timerInterval = null;
    this.isTimerPaused = false;
  }

  init(tab = 'dbms') {
    this.activeTab = tab;
    this.searchQuery = '';
    this.activeTag = 'All';
    this.startTimer();
    this.render();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isTimerPaused && this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const el = document.getElementById('he-timer-display');
    if (el) {
      const mins = Math.floor(this.remainingSeconds / 60);
      const secs = this.remainingSeconds % 60;
      el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  setTab(tab) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.searchQuery = '';
    this.activeTag = 'All';
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setTag(tag) {
    this.activeTag = tag;
    this.renderResultsOnly();
  }

  setSearchQuery(q) {
    this.searchQuery = q;
    this.renderResultsOnly();
  }

  showToast(message = 'Copied to clipboard!') {
    let toast = document.getElementById('he-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'he-toast';
      toast.className = 'he-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  render() {
    const dbmsTotal = getAllDbmsQueries().length;
    const mcqsTotal = getAllMcqs().length;
    const dsaTotal = getAllDsaPrograms().length;

    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const timerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    this.container.innerHTML = `
      <div class="he-hub-wrapper" style="width: 100%; min-height: 100vh; background-color: var(--he-bg-base); display: flex; flex-direction: column;">
        <!-- HackerEarth Top Navigation Header -->
        <header class="he-topbar" role="banner">
          <div class="he-topbar-left">
            <div class="he-logo-square">H</div>
            <div>
              <div class="he-test-title">TESCO Bank mobile development — Barclays GSC</div>
              <div class="he-user-email">Assessment Practice Hub • Online</div>
            </div>
          </div>

          <div class="he-topbar-center">
            <div class="he-timer-box" title="Practice Countdown">
              <span class="timer-icon">⏱️</span>
              <span id="he-timer-display">${timerStr}</span>
            </div>
          </div>
        </header>

        <!-- Main Assessment Container -->
        <main class="he-assessment-container">
          <!-- HackerEarth Mode Switcher Tabs -->
          <nav class="he-tabs-wrap" role="tablist" aria-label="Assessment Sections">
            <button class="he-tab-btn priority-dbms ${this.activeTab === 'dbms' ? 'active' : ''}" 
                    data-hub-tab="dbms" role="tab" aria-selected="${this.activeTab === 'dbms'}">
              <span>🗄️</span>
              <span>DBMS & Queries</span>
              <span class="tab-badge-pill">${dbmsTotal}</span>
              <span class="priority-tag">Priority ★</span>
            </button>

            <button class="he-tab-btn ${this.activeTab === 'mcqs' ? 'active' : ''}" 
                    data-hub-tab="mcqs" role="tab" aria-selected="${this.activeTab === 'mcqs'}">
              <span>📝</span>
              <span>MCQ Questions</span>
              <span class="tab-badge-pill">${mcqsTotal}</span>
            </button>

            <button class="he-tab-btn ${this.activeTab === 'dsa' ? 'active' : ''}" 
                    data-hub-tab="dsa" role="tab" aria-selected="${this.activeTab === 'dsa'}">
              <span>💻</span>
              <span>Programming (DSA)</span>
              <span class="tab-badge-pill">${dsaTotal}</span>
            </button>
          </nav>

          <!-- Sticky Search & Filter Chips Bar -->
          <div class="he-filter-bar">
            <div class="he-search-box">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                id="he-search-input"
                class="he-search-input" 
                placeholder="${this.getSearchPlaceholder()}" 
                value="${this.escapeHtml(this.searchQuery)}"
                autocomplete="off"
                spellcheck="false"
                aria-label="Search problems"
              />
              ${this.searchQuery ? `<button class="he-search-clear" id="btn-clear-he-search" title="Clear">✕</button>` : ''}
            </div>

            <!-- Category Tags Filter Chips -->
            <div class="he-chips-row" role="toolbar" aria-label="Filter category">
              ${this.renderChips()}
            </div>

            <!-- Counter Metadata -->
            <div class="he-meta-counter" id="he-meta-counter">
              ${this.renderMetaCountHtml()}
            </div>
          </div>

          <!-- Problem Cards Feed -->
          <div class="he-cards-feed" id="he-cards-feed">
            ${this.renderActiveCardsHtml()}
          </div>
        </main>
      </div>
    `;

    this.bindEvents();
  }

  getSearchPlaceholder() {
    switch (this.activeTab) {
      case 'dbms':
        return 'Search SQL queries e.g. "second highest", "window", "group by", "index", "orphan"...';
      case 'mcqs':
        return 'Search MCQs e.g. "coroutine", "flow", "compose", "lifecycle", "process death", "leak"...';
      case 'dsa':
        return 'Search DSA e.g. "two pointers", "sliding window", "kadane", "binary search", "monotonic"...';
      default:
        return 'Type keyword to search...';
    }
  }

  renderChips() {
    let tags = [];
    if (this.activeTab === 'dbms') tags = DBMS_TAGS;
    else if (this.activeTab === 'mcqs') tags = MCQ_TAGS;
    else if (this.activeTab === 'dsa') tags = DSA_TAGS;

    return tags.map(tag => {
      const isSelected = this.activeTag === tag;
      const isPriority = this.activeTab === 'dbms' && (tag === 'Window Functions' || tag === 'GROUP BY / HAVING');
      return `
        <button class="he-chip-btn ${isSelected ? 'active' : ''} ${isPriority && isSelected ? 'priority-chip' : ''}" 
                data-chip="${this.escapeHtml(tag)}">
          ${this.escapeHtml(tag)}
        </button>
      `;
    }).join('');
  }

  getActiveItems() {
    let items = [];
    if (this.activeTab === 'dbms') items = getAllDbmsQueries();
    else if (this.activeTab === 'mcqs') items = getAllMcqs();
    else if (this.activeTab === 'dsa') items = getAllDsaPrograms();

    return filterItems(items, this.searchQuery, this.activeTag);
  }

  renderMetaCountHtml() {
    const filtered = this.getActiveItems();
    const count = filtered.length;
    let label = '';
    if (this.activeTab === 'dbms') label = 'DBMS & SQL Queries';
    else if (this.activeTab === 'mcqs') label = 'MCQ Questions';
    else if (this.activeTab === 'dsa') label = 'Programming Challenges';

    if (this.searchQuery) {
      return `
        <span>Showing <strong style="color: #ffffff;">${count}</strong> ${label} matching "<em>${this.escapeHtml(this.searchQuery)}</em>"</span>
      `;
    }

    if (this.activeTag !== 'All') {
      return `
        <span>Showing <strong style="color: #ffffff;">${count}</strong> in <strong>${this.escapeHtml(this.activeTag)}</strong></span>
      `;
    }

    return `
      <span>Total Available: <strong style="color: #ffffff;">${count}</strong> ${label}</span>
      <span style="color: var(--he-text-muted);">HackerEarth Testing Format</span>
    `;
  }

  renderActiveCardsHtml() {
    const items = this.getActiveItems();

    if (items.length === 0) {
      return `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--he-text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="color: #ffffff; margin-bottom: 0.5rem;">No questions match your filter</h3>
          <p>No results match "<strong>${this.escapeHtml(this.searchQuery)}</strong>" in <strong>${this.escapeHtml(this.activeTag)}</strong>.</p>
          <button class="he-chip-btn" id="btn-reset-filters" style="margin-top: 12px; background: #2b70f0; color: #fff;">
            Reset All Filters
          </button>
        </div>
      `;
    }

    if (this.activeTab === 'dbms') {
      return items.map((q, idx) => this.renderDbmsCard(q, idx)).join('');
    } else if (this.activeTab === 'mcqs') {
      return items.map((q, idx) => this.renderMcqCard(q, idx)).join('');
    } else if (this.activeTab === 'dsa') {
      return items.map((p, idx) => this.renderDsaCard(p, idx)).join('');
    }

    return '';
  }

  // ==========================================
  // HACKEREARTH DBMS SPLIT CARD
  // ==========================================
  renderDbmsCard(q, index) {
    const primarySolution = q.sampleSolution || '';
    const alternatives = q.alternativeSolutions || [];
    const explanation = q.explanation || {};

    return `
      <article class="he-problem-card" id="dbms-problem-${q.id}">
        <!-- HackerEarth Header -->
        <div class="he-problem-header">
          <div class="he-problem-header-left">
            <div class="he-problem-number-badge">${index + 1}</div>
            <div>
              <div class="he-problem-title-text">${this.escapeHtml(q.title)}</div>
              <div style="font-size: 0.775rem; color: var(--he-text-muted);">Set ${q.setNumber} • ${this.escapeHtml(q.setName)}</div>
            </div>
          </div>
          <div class="he-problem-header-right">
            <span class="he-badge-tag">SQL Query</span>
            <span class="he-marks-badge">💎 10.00</span>
          </div>
        </div>

        <!-- HackerEarth Split View -->
        <div class="he-split-body">
          <!-- Left: Question & Schema -->
          <div class="he-left-pane">
            <div class="he-section-label">Problem Statement</div>
            <div class="he-prompt-content">
              ${q.prompt}
            </div>

            ${q.schemaContext ? `
              <div class="he-section-label" style="margin-top: 8px;">Database Schema</div>
              <div class="he-schema-card">
                <strong>Table:</strong> ${this.escapeHtml(q.schemaContext)}
              </div>
            ` : ''}

            <!-- Explanation & Rationale -->
            ${explanation && (explanation.keyConcept || explanation.detailed) ? `
              <div class="he-explanation-card" style="margin-top: 10px;">
                <div class="he-explanation-title">💡 Concept & Strategy</div>
                <div class="he-explanation-text">
                  ${explanation.keyConcept ? `<p><strong>Key Concept:</strong> ${this.escapeHtml(explanation.keyConcept)}</p>` : ''}
                  ${explanation.detailed ? `<div>${explanation.detailed}</div>` : ''}
                  ${explanation.realWorldPitfall ? `
                    <div class="he-pitfall-alert" style="margin-top: 6px;">
                      <strong>⚠️ Interview Pitfall:</strong> ${this.escapeHtml(explanation.realWorldPitfall)}
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right: Code Editor Box -->
          <div class="he-right-pane">
            <div class="he-editor-window">
              <div class="he-editor-topbar">
                <span class="he-lang-tag">SQLite (3.25+) / Android Room</span>
                <button class="he-copy-action-btn" data-copy="${this.escapeAttr(primarySolution)}">
                  <span>📋</span> Copy SQL
                </button>
              </div>
              <pre class="he-code-display"><code>${this.escapeHtml(primarySolution)}</code></pre>
            </div>

            <!-- Alternative Solutions -->
            ${alternatives.length > 0 ? `
              <details style="font-size: 0.85rem; color: var(--he-text-muted);">
                <summary style="cursor: pointer; font-weight: 700; color: #60a5fa; margin-bottom: 6px;">
                  💡 View ${alternatives.length} Alternative Solution${alternatives.length > 1 ? 's' : ''} (Window vs Subquery)
                </summary>
                ${alternatives.map((alt, aIdx) => `
                  <div class="he-editor-window" style="margin-top: 6px;">
                    <div class="he-editor-topbar">
                      <span>Approach ${aIdx + 1}</span>
                      <button class="he-copy-action-btn" data-copy="${this.escapeAttr(alt)}">
                        <span>📋</span> Copy
                      </button>
                    </div>
                    <pre class="he-code-display"><code>${this.escapeHtml(alt)}</code></pre>
                  </div>
                `).join('')}
              </details>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }

  // ==========================================
  // HACKEREARTH MCQ SPLIT CARD
  // ==========================================
  renderMcqCard(q, index) {
    const explanation = q.explanation || {};

    return `
      <article class="he-problem-card" id="mcq-problem-${q.id}">
        <!-- Header -->
        <div class="he-problem-header">
          <div class="he-problem-header-left">
            <div class="he-problem-number-badge">${index + 1}</div>
            <div>
              <div class="he-problem-title-text">${this.escapeHtml(q.title)}</div>
              <div style="font-size: 0.775rem; color: var(--he-text-muted);">Set ${q.setNumber} • ${this.escapeHtml(q.setName)}</div>
            </div>
          </div>
          <div class="he-problem-header-right">
            <span class="he-badge-tag">MCQ</span>
            <span class="he-marks-badge">💎 2.00</span>
          </div>
        </div>

        <!-- HackerEarth Split View -->
        <div class="he-split-body">
          <!-- Left: Problem Prompt -->
          <div class="he-left-pane">
            <div class="he-section-label">Question</div>
            <div class="he-prompt-content">
              ${q.prompt}
            </div>

            <!-- In-Depth Explanation -->
            ${explanation && (explanation.summary || explanation.detailed) ? `
              <div class="he-explanation-card" style="margin-top: auto;">
                <div class="he-explanation-title">💡 Why This Answer Is Correct</div>
                <div class="he-explanation-text">
                  ${explanation.keyConcept ? `<p><strong>Core Concept:</strong> ${this.escapeHtml(explanation.keyConcept)}</p>` : ''}
                  ${explanation.summary ? `<p>${this.escapeHtml(explanation.summary)}</p>` : ''}
                  ${explanation.detailed ? `<div>${explanation.detailed}</div>` : ''}
                  ${explanation.realWorldPitfall ? `
                    <div class="he-pitfall-alert" style="margin-top: 6px;">
                      <strong>⚠️ Real-World Pitfall:</strong> ${this.escapeHtml(explanation.realWorldPitfall)}
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right: Radio Options matching HackerEarth -->
          <div class="he-right-pane">
            <div class="he-mcq-instruction">Select your answer to the problem below</div>
            <div class="he-mcq-options-container">
              ${(q.options || []).map((opt) => {
                const isCorrect = opt.id === q.correctOptionId;
                return `
                  <div class="he-mcq-option-card ${isCorrect ? 'is-correct' : ''}">
                    <div class="he-mcq-radio-circle"></div>
                    <span style="flex: 1;">${this.escapeHtml(opt.text)}</span>
                    ${isCorrect ? `<span class="he-correct-badge">✓ Correct Answer</span>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // ==========================================
  // HACKEREARTH PROGRAMMING (DSA) CARD
  // ==========================================
  renderDsaCard(p, index) {
    const solutionCode = p.solutionCode || p.starterCode || '';

    return `
      <article class="he-problem-card" id="dsa-problem-${p.id}">
        <!-- Header -->
        <div class="he-problem-header">
          <div class="he-problem-header-left">
            <div class="he-problem-number-badge">${index + 1}</div>
            <div>
              <div class="he-problem-title-text">${this.escapeHtml(p.title)}</div>
              <div style="font-size: 0.775rem; color: var(--he-text-muted);">${this.escapeHtml(p.source || 'HackerEarth')} • ${this.escapeHtml(p.category || 'Algorithm')}</div>
            </div>
          </div>
          <div class="he-problem-header-right">
            <span class="he-badge-tag">${this.escapeHtml(p.difficulty || 'Medium')}</span>
            <span class="he-marks-badge">💎 20.00</span>
          </div>
        </div>

        <!-- HackerEarth Split View -->
        <div class="he-split-body">
          <!-- Left: Description, Constraints, Examples -->
          <div class="he-left-pane">
            <div class="he-section-label">Problem Statement</div>
            <div class="he-prompt-content">
              ${p.description}
            </div>

            ${p.constraints && p.constraints.length > 0 ? `
              <div class="he-section-label" style="margin-top: 8px;">Constraints</div>
              <div style="background: #131417; border: 1px solid var(--he-border); border-radius: 6px; padding: 8px 12px; font-family: var(--he-font-mono); font-size: 0.8rem; color: #94a3b8;">
                ${p.constraints.map(c => `<div>• ${this.escapeHtml(c)}</div>`).join('')}
              </div>
            ` : ''}

            ${p.examples && p.examples.length > 0 ? `
              <div class="he-section-label" style="margin-top: 8px;">Sample Input & Output</div>
              <div style="background: #131417; border: 1px solid var(--he-border); border-radius: 6px; padding: 8px 12px; font-size: 0.825rem; color: #d1d5db;">
                <div><strong>Sample Input:</strong> <code>${this.escapeHtml(p.examples[0].input)}</code></div>
                <div style="margin-top: 4px;"><strong>Sample Output:</strong> <code>${this.escapeHtml(p.examples[0].output)}</code></div>
              </div>
            ` : ''}

            <!-- Complexity -->
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <span class="he-badge-tag" style="color: #34d399; border-color: rgba(16, 185, 129, 0.3);">⏱️ ${this.escapeHtml(p.timeComplexity || 'O(N)')}</span>
              <span class="he-badge-tag" style="color: #a78bfa; border-color: rgba(139, 92, 246, 0.3);">📦 ${this.escapeHtml(p.spaceComplexity || 'O(1)')}</span>
            </div>
          </div>

          <!-- Right: Kotlin Code Editor -->
          <div class="he-right-pane">
            <div class="he-editor-window">
              <div class="he-editor-topbar">
                <span class="he-lang-tag">Kotlin (1.5.21)</span>
                <button class="he-copy-action-btn" data-copy="${this.escapeAttr(solutionCode)}">
                  <span>📋</span> Copy Code
                </button>
              </div>
              <pre class="he-code-display"><code>${this.escapeHtml(solutionCode)}</code></pre>
            </div>

            <!-- Algorithm Strategy -->
            ${p.explanation ? `
              <div class="he-explanation-card">
                <div class="he-explanation-title">💡 Algorithmic Logic & Walkthrough</div>
                <div class="he-explanation-text">
                  <div>${p.explanation}</div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }

  // ==========================================
  // FAST RE-RENDER OF RESULTS & METRICS ONLY
  // ==========================================
  renderResultsOnly() {
    const feedEl = document.getElementById('he-cards-feed');
    const metaEl = document.getElementById('he-meta-counter');
    const searchInput = document.getElementById('he-search-input');

    if (feedEl) {
      feedEl.innerHTML = this.renderActiveCardsHtml();
    }
    if (metaEl) {
      metaEl.innerHTML = this.renderMetaCountHtml();
    }

    const searchWrap = this.container.querySelector('.he-search-box');
    let clearBtn = document.getElementById('btn-clear-he-search');
    if (this.searchQuery && !clearBtn && searchWrap) {
      clearBtn = document.createElement('button');
      clearBtn.className = 'he-search-clear';
      clearBtn.id = 'btn-clear-he-search';
      clearBtn.title = 'Clear search';
      clearBtn.textContent = '✕';
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.setSearchQuery('');
        if (searchInput) searchInput.focus();
      });
      searchWrap.appendChild(clearBtn);
    } else if (!this.searchQuery && clearBtn) {
      clearBtn.remove();
    }
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  bindEvents() {
    // 1. Tab buttons
    this.container.querySelectorAll('.he-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.hubTab;
        if (tab) {
          window.location.hash = `#${tab}`;
          this.setTab(tab);
        }
      });
    });

    // 2. Search input
    const searchInput = document.getElementById('he-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.setSearchQuery(e.target.value);
      });
    }

    // 3. Clear button
    const clearBtn = document.getElementById('btn-clear-he-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.setSearchQuery('');
        if (searchInput) searchInput.focus();
      });
    }

    // 4. Filter chips
    this.container.querySelectorAll('.he-chip-btn').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const tag = e.currentTarget.dataset.chip;
        this.container.querySelectorAll('.he-chip-btn').forEach(c => c.classList.remove('active', 'priority-chip'));
        e.currentTarget.classList.add('active');
        if (this.activeTab === 'dbms' && (tag === 'Window Functions' || tag === 'GROUP BY / HAVING')) {
          e.currentTarget.classList.add('priority-chip');
        }
        this.setTag(tag);
      });
    });

    // 5. Copy Buttons
    this.container.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.he-copy-action-btn');
      if (copyBtn) {
        const textToCopy = copyBtn.dataset.copy;
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = `<span>✓</span> Copied!`;
            this.showToast('Copied to clipboard!');
            setTimeout(() => {
              copyBtn.innerHTML = originalHtml;
            }, 1800);
          }).catch(() => {
            this.showToast('Select text to copy manually');
          });
        }
      }

      // Reset filters button
      const resetBtn = e.target.closest('#btn-reset-filters');
      if (resetBtn) {
        this.searchQuery = '';
        this.activeTag = 'All';
        this.render();
      }
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
