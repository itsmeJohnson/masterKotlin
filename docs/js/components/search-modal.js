/* ==========================================================================
   Search Modal Component
   Fast, accessible search with keyboard shortcuts and instant filtering.
   ========================================================================== */

import { CURRICULUM } from '../data/curriculum.js';
import { AppState } from '../state.js';

export class SearchModalComponent {
  constructor(overlayEl, onSelectResult) {
    this.overlay = overlayEl;
    this.onSelectResult = onSelectResult;
    this.selectedIndex = 0;
    this.filteredItems = [];
    this.allItems = [];

    // Collect all searchable items
    CURRICULUM.forEach((group) => {
      group.items.forEach((item) => {
        this.allItems.push({
          ...item,
          groupTitle: group.title
        });
      });
    });
  }

  init() {
    this.bindGlobalShortcuts();
  }

  open() {
    this.overlay.classList.add('open');
    const input = this.overlay.querySelector('.modal-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    this.search('');
  }

  close() {
    this.overlay.classList.remove('open');
  }

  search(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      this.filteredItems = this.allItems.slice(0, 8);
    } else {
      this.filteredItems = this.allItems.filter((item) => {
        return item.title.toLowerCase().includes(q) ||
               (item.summary && item.summary.toLowerCase().includes(q)) ||
               (item.category && item.category.toLowerCase().includes(q)) ||
               (item.groupTitle && item.groupTitle.toLowerCase().includes(q));
      }).slice(0, 10);
    }
    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    const listEl = this.overlay.querySelector('.search-results-list');
    if (!listEl) return;

    if (this.filteredItems.length === 0) {
      listEl.innerHTML = `<li style="padding: 16px; color: var(--text-muted); text-align: center;">No matching lessons or scenarios found.</li>`;
      return;
    }

    let html = '';
    this.filteredItems.forEach((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      html += `
        <li class="search-result-item ${isSelected ? 'highlighted' : ''}" data-idx="${idx}" data-lesson-id="${item.id}">
          <div>
            <div style="font-weight: 600; font-size: 0.9rem;">${item.title}</div>
            <div class="search-result-sub">${item.category || item.groupTitle} • ${item.difficulty}</div>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${item.duration || ''}</span>
        </li>
      `;
    });

    listEl.innerHTML = html;

    // Click selection
    listEl.querySelectorAll('.search-result-item').forEach((li) => {
      li.addEventListener('click', () => {
        const lessonId = li.dataset.lessonId;
        if (lessonId) {
          this.close();
          AppState.setLesson(lessonId);
          if (this.onSelectResult) this.onSelectResult(lessonId);
        }
      });
    });
  }

  bindGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K or bare / when not inside an input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
        this.close();
      }
    });

    const closeBtn = this.overlay.querySelector('#btn-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    const searchInput = this.overlay.querySelector('.modal-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.search(e.target.value);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.selectedIndex < this.filteredItems.length - 1) {
            this.selectedIndex++;
            this.renderResults();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
            this.renderResults();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const item = this.filteredItems[this.selectedIndex];
          if (item) {
            this.close();
            AppState.setLesson(item.id);
            if (this.onSelectResult) this.onSelectResult(item.id);
          }
        }
      });
    }
  }
}
