/* ==========================================================================
   Three Options Quick Prep Hub View Component
   Provides instant keyword-filtered access to:
   1. 🗄️ DBMS & Queries (Top Priority)
   2. 📝 MCQs & Explanations (All questions with correct answers visible)
   3. 💻 DSA Programs & Solutions
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
  }

  init(tab = 'dbms') {
    this.activeTab = tab;
    this.searchQuery = '';
    this.activeTag = 'All';
    this.render();
  }

  setTab(tab) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.searchQuery = '';
    this.activeTag = 'All';
    this.render();
    
    // Smooth scroll to top of viewport
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
    let toast = document.getElementById('hub-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hub-toast';
      toast.className = 'hub-toast';
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

    this.container.innerHTML = `
      <div class="hub-container">
        <!-- Hero Section with Three Primary Selection Tabs -->
        <header class="hub-hero">
          <div class="hub-hero-title">
            <span>⚡ Tesco Bank & Barclays Assessment Quick Prep</span>
          </div>
          <div class="hub-hero-subtitle">
            Instant keyword lookup across high-frequency assessment questions, answers & runnable code.
          </div>

          <!-- The Three Primary Options -->
          <nav class="hub-segmented-tabs" role="tablist" aria-label="Assessment Quick Prep Modes">
            <button class="hub-tab-btn priority-dbms ${this.activeTab === 'dbms' ? 'active' : ''}" 
                    data-hub-tab="dbms" role="tab" aria-selected="${this.activeTab === 'dbms'}">
              <span class="hub-tab-icon">🗄️</span>
              <span class="hub-tab-label">DBMS & Queries</span>
              <span class="hub-tab-count">${dbmsTotal} Queries</span>
              <span class="hub-priority-pill">★ Most Important</span>
            </button>

            <button class="hub-tab-btn ${this.activeTab === 'mcqs' ? 'active' : ''}" 
                    data-hub-tab="mcqs" role="tab" aria-selected="${this.activeTab === 'mcqs'}">
              <span class="hub-tab-icon">📝</span>
              <span class="hub-tab-label">MCQs & Answers</span>
              <span class="hub-tab-count">${mcqsTotal} MCQs</span>
            </button>

            <button class="hub-tab-btn ${this.activeTab === 'dsa' ? 'active' : ''}" 
                    data-hub-tab="dsa" role="tab" aria-selected="${this.activeTab === 'dsa'}">
              <span class="hub-tab-icon">💻</span>
              <span class="hub-tab-label">DSA Programs</span>
              <span class="hub-tab-count">${dsaTotal} Algos</span>
            </button>
          </nav>
        </header>

        <!-- Sticky Instant Search Bar & Tag Chips -->
        <div class="hub-search-bar-wrap">
          <div class="hub-search-input-box">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              id="hub-search-input"
              class="hub-search-input" 
              placeholder="${this.getSearchPlaceholder()}" 
              value="${this.escapeHtml(this.searchQuery)}"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              aria-label="Search items"
            />
            ${this.searchQuery ? `<button class="hub-search-clear-btn" id="btn-clear-hub-search" title="Clear search">✕</button>` : ''}
          </div>

          <!-- Category Tags Filter Chips -->
          <div class="hub-chips-scroll" role="toolbar" aria-label="Filter category">
            ${this.renderChips()}
          </div>

          <!-- Meta Count Bar -->
          <div class="hub-meta-bar" id="hub-meta-bar">
            ${this.renderMetaCountHtml()}
          </div>
        </div>

        <!-- Cards Feed Container -->
        <div class="hub-cards-feed" id="hub-cards-feed">
          ${this.renderActiveCardsHtml()}
        </div>
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
        <button class="hub-filter-chip ${isSelected ? 'active' : ''} ${isPriority && isSelected ? 'priority-chip' : ''}" 
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
    if (this.activeTab === 'dbms') label = 'DBMS & Room Queries';
    else if (this.activeTab === 'mcqs') label = 'MCQs with Verified Answers';
    else if (this.activeTab === 'dsa') label = 'DSA Programs & Solutions';

    if (this.searchQuery) {
      return `
        <span>Showing <strong class="hub-counter-badge">${count}</strong> ${label} matching "<em>${this.escapeHtml(this.searchQuery)}</em>"</span>
        ${count > 0 ? `<span style="font-size: 0.75rem; color: #10b981;">✓ Live Filter Active</span>` : ''}
      `;
    }

    if (this.activeTag !== 'All') {
      return `
        <span>Showing <strong class="hub-counter-badge">${count}</strong> ${label} in <strong>${this.escapeHtml(this.activeTag)}</strong></span>
      `;
    }

    return `
      <span>Showing all <strong class="hub-counter-badge">${count}</strong> ${label}</span>
      <span style="font-size: 0.75rem; color: var(--text-muted);">Use search bar for instant lookup</span>
    `;
  }

  renderActiveCardsHtml() {
    const items = this.getActiveItems();

    if (items.length === 0) {
      return `
        <div class="hub-empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No matching ${this.activeTab.toUpperCase()} found</h3>
          <p>No results match "<strong>${this.escapeHtml(this.searchQuery)}</strong>" in <strong>${this.escapeHtml(this.activeTag)}</strong>.</p>
          <button class="btn btn-secondary btn-sm" id="btn-reset-filters" style="margin-top: 12px;">
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
  // DBMS CARD RENDERER
  // ==========================================
  renderDbmsCard(q, index) {
    const primarySolution = q.sampleSolution || '';
    const alternatives = q.alternativeSolutions || [];
    const explanation = q.explanation || {};

    return `
      <article class="hub-item-card" id="dbms-card-${q.id}">
        <!-- Header -->
        <div class="hub-card-header">
          <div class="hub-card-title-group">
            <span class="hub-card-set-tag">🗄️ Set ${q.setNumber} • ${this.escapeHtml(q.setName)}</span>
            <h2 class="hub-card-title">${index + 1}. ${this.escapeHtml(q.title)}</h2>
          </div>
          <div class="hub-card-badge-row">
            ${(q.tags || []).map(t => `<span class="badge badge-intermediate">${this.escapeHtml(t)}</span>`).join('')}
          </div>
        </div>

        <!-- Problem Prompt -->
        <div class="hub-card-prompt">
          ${q.prompt}
        </div>

        <!-- Schema Context -->
        ${q.schemaContext ? `
          <div class="hub-schema-box">
            <strong>Table Schema:</strong> ${this.escapeHtml(q.schemaContext)}
          </div>
        ` : ''}

        <!-- SQL Solution Code Box -->
        <div class="hub-code-box">
          <div class="hub-code-header">
            <span>SQL Solution (SQLite / Room Standard)</span>
            <button class="hub-copy-btn" data-copy="${this.escapeAttr(primarySolution)}">
              <span>📋</span> Copy SQL
            </button>
          </div>
          <pre class="hub-code-content"><code>${this.escapeHtml(primarySolution)}</code></pre>
        </div>

        <!-- Alternative Solutions if available -->
        ${alternatives.length > 0 ? `
          <details style="font-size: 0.85rem; color: var(--text-secondary);">
            <summary style="cursor: pointer; font-weight: 600; color: #60a5fa; margin-bottom: 6px;">
              💡 View ${alternatives.length} Alternative Solution${alternatives.length > 1 ? 's' : ''} (Window vs Subquery)
            </summary>
            ${alternatives.map((alt, aIdx) => `
              <div class="hub-code-box" style="margin-top: 6px;">
                <div class="hub-code-header">
                  <span>Alternative Approach ${aIdx + 1}</span>
                  <button class="hub-copy-btn" data-copy="${this.escapeAttr(alt)}">
                    <span>📋</span> Copy
                  </button>
                </div>
                <pre class="hub-code-content"><code>${this.escapeHtml(alt)}</code></pre>
              </div>
            `).join('')}
          </details>
        ` : ''}

        <!-- Concept Breakdown & Interview Pitfall -->
        ${explanation && (explanation.keyConcept || explanation.detailed) ? `
          <div class="hub-explanation-box">
            <div class="hub-explanation-header">
              <span>💡 Concept & Architectural Rationale</span>
            </div>
            <div class="hub-explanation-body">
              ${explanation.keyConcept ? `<p><strong>Key Concept:</strong> ${this.escapeHtml(explanation.keyConcept)}</p>` : ''}
              ${explanation.detailed ? `<div>${explanation.detailed}</div>` : ''}
              ${explanation.realWorldPitfall ? `
                <div class="hub-pitfall-box" style="margin-top: 8px;">
                  <strong>⚠️ Interview Pitfall / Gotcha:</strong> ${this.escapeHtml(explanation.realWorldPitfall)}
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </article>
    `;
  }

  // ==========================================
  // MCQ CARD RENDERER
  // ==========================================
  renderMcqCard(q, index) {
    const explanation = q.explanation || {};

    return `
      <article class="hub-item-card" id="mcq-card-${q.id}">
        <!-- Header -->
        <div class="hub-card-header">
          <div class="hub-card-title-group">
            <span class="hub-card-set-tag">📝 Set ${q.setNumber} • ${this.escapeHtml(q.setName)}</span>
            <h2 class="hub-card-title">${index + 1}. ${this.escapeHtml(q.title)}</h2>
          </div>
          <div class="hub-card-badge-row">
            ${(q.tags || []).map(t => `<span class="badge badge-beginner">${this.escapeHtml(t)}</span>`).join('')}
          </div>
        </div>

        <!-- Question Prompt -->
        <div class="hub-card-prompt">
          ${q.prompt}
        </div>

        <!-- All Options with Correct Answer Highlighted -->
        <div class="hub-mcq-options-list">
          ${(q.options || []).map((opt, oIdx) => {
            const isCorrect = opt.id === q.correctOptionId;
            const letter = String.fromCharCode(65 + oIdx);
            return `
              <div class="hub-mcq-option-item ${isCorrect ? 'is-correct' : ''}">
                <span class="hub-mcq-option-badge">${letter}</span>
                <span style="flex: 1;">${this.escapeHtml(opt.text)}</span>
                ${isCorrect ? `<span class="hub-correct-pill">✓ Correct Answer</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- In-Depth Explanation -->
        ${explanation && (explanation.summary || explanation.detailed) ? `
          <div class="hub-explanation-box">
            <div class="hub-explanation-header">
              <span>💡 Why This Is Correct & Key Concept</span>
            </div>
            <div class="hub-explanation-body">
              ${explanation.keyConcept ? `<p><strong>Core Concept:</strong> ${this.escapeHtml(explanation.keyConcept)}</p>` : ''}
              ${explanation.summary ? `<p>${this.escapeHtml(explanation.summary)}</p>` : ''}
              ${explanation.detailed ? `<div>${explanation.detailed}</div>` : ''}
              ${explanation.realWorldPitfall ? `
                <div class="hub-pitfall-box" style="margin-top: 8px;">
                  <strong>⚠️ Real-World Pitfall:</strong> ${this.escapeHtml(explanation.realWorldPitfall)}
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </article>
    `;
  }

  // ==========================================
  // DSA CARD RENDERER
  // ==========================================
  renderDsaCard(p, index) {
    const solutionCode = p.solutionCode || p.starterCode || '';

    return `
      <article class="hub-item-card" id="dsa-card-${p.id}">
        <!-- Header -->
        <div class="hub-card-header">
          <div class="hub-card-title-group">
            <span class="hub-card-set-tag">💻 ${this.escapeHtml(p.source || 'DSA Bank')} • ${this.escapeHtml(p.category || 'Algorithm')}</span>
            <h2 class="hub-card-title">${index + 1}. ${this.escapeHtml(p.title)}</h2>
          </div>
          <div class="hub-card-badge-row">
            <span class="badge ${p.difficulty === 'Easy' ? 'badge-beginner' : p.difficulty === 'Hard' ? 'badge-advanced' : 'badge-intermediate'}">
              ${this.escapeHtml(p.difficulty || 'Medium')}
            </span>
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">
              ⏱️ ${this.escapeHtml(p.timeComplexity || 'O(N)')}
            </span>
            <span class="badge" style="background: rgba(139, 92, 246, 0.15); color: #a78bfa;">
              📦 ${this.escapeHtml(p.spaceComplexity || 'O(1)')}
            </span>
          </div>
        </div>

        <!-- Problem Description -->
        <div class="hub-card-prompt">
          ${p.description}
        </div>

        <!-- Examples if any -->
        ${p.examples && p.examples.length > 0 ? `
          <div style="background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 6px; font-size: 0.825rem; color: var(--text-secondary);">
            <strong>Example 1:</strong> <code>${this.escapeHtml(p.examples[0].input)}</code> ➔ Output: <code>${this.escapeHtml(p.examples[0].output)}</code>
            ${p.examples[0].explanation ? `<div style="margin-top: 4px; color: var(--text-muted);">${this.escapeHtml(p.examples[0].explanation)}</div>` : ''}
          </div>
        ` : ''}

        <!-- Kotlin Solution Code Box -->
        <div class="hub-code-box">
          <div class="hub-code-header">
            <span>Kotlin Reference Solution</span>
            <button class="hub-copy-btn" data-copy="${this.escapeAttr(solutionCode)}">
              <span>📋</span> Copy Code
            </button>
          </div>
          <pre class="hub-code-content"><code>${this.escapeHtml(solutionCode)}</code></pre>
        </div>

        <!-- Explanation & Algorithmic Logic -->
        ${p.explanation ? `
          <div class="hub-explanation-box">
            <div class="hub-explanation-header">
              <span>💡 Algorithmic Strategy & Complexity</span>
            </div>
            <div class="hub-explanation-body">
              <div>${p.explanation}</div>
            </div>
          </div>
        ` : ''}
      </article>
    `;
  }

  // ==========================================
  // FAST RE-RENDER OF RESULTS & METRICS ONLY
  // ==========================================
  renderResultsOnly() {
    const feedEl = document.getElementById('hub-cards-feed');
    const metaEl = document.getElementById('hub-meta-bar');
    const searchInput = document.getElementById('hub-search-input');

    if (feedEl) {
      feedEl.innerHTML = this.renderActiveCardsHtml();
    }
    if (metaEl) {
      metaEl.innerHTML = this.renderMetaCountHtml();
    }

    // Toggle clear search button visibility
    const searchWrap = this.container.querySelector('.hub-search-input-box');
    let clearBtn = document.getElementById('btn-clear-hub-search');
    if (this.searchQuery && !clearBtn && searchWrap) {
      clearBtn = document.createElement('button');
      clearBtn.className = 'hub-search-clear-btn';
      clearBtn.id = 'btn-clear-hub-search';
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
    // 1. Tab switching
    this.container.querySelectorAll('.hub-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.hubTab;
        if (tab) {
          window.location.hash = `#${tab}`;
          this.setTab(tab);
        }
      });
    });

    // 2. Instant search input with debouncing/live update
    const searchInput = document.getElementById('hub-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.setSearchQuery(e.target.value);
      });
    }

    // 3. Clear search button
    const clearBtn = document.getElementById('btn-clear-hub-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.setSearchQuery('');
        if (searchInput) searchInput.focus();
      });
    }

    // 4. Category filter chips
    this.container.querySelectorAll('.hub-filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const tag = e.currentTarget.dataset.chip;
        this.container.querySelectorAll('.hub-filter-chip').forEach(c => c.classList.remove('active', 'priority-chip'));
        e.currentTarget.classList.add('active');
        if (this.activeTab === 'dbms' && (tag === 'Window Functions' || tag === 'GROUP BY / HAVING')) {
          e.currentTarget.classList.add('priority-chip');
        }
        this.setTag(tag);
      });
    });

    // 5. Global Copy Code/SQL delegation
    this.container.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.hub-copy-btn');
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

  // Utilities
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
