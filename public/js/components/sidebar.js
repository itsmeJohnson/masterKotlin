/* ==========================================================================
   Sidebar Component
   Renders curriculum tree, mastery badges, bookmarks, and search trigger.
   ========================================================================== */

import { CURRICULUM } from '../data/curriculum.js';
import { AppState } from '../state.js';

export class SidebarComponent {
  constructor(containerEl, onSelectLesson) {
    this.container = containerEl;
    this.onSelectLesson = onSelectLesson;
  }

  render() {
    const stats = AppState.data.stats;
    const masteryMap = AppState.data.masteryMap;
    const currentLessonId = AppState.data.currentLessonId;
    const bookmarks = AppState.data.bookmarks;
    const readiness = AppState.getReadinessScore();

    let html = `
      <div class="sidebar-header">
        <div class="sidebar-stats-compact">
          <span>Readiness Score: <strong class="sidebar-stats-val">${readiness}%</strong></span>
          <span>Solved: <strong class="sidebar-stats-val">${stats.problemsSolved}</strong></span>
        </div>
      </div>
      <ul class="curriculum-list">
    `;

    CURRICULUM.forEach((section) => {
      html += `
        <li class="curriculum-group" data-section-id="${section.id}">
          <div class="group-header" tabindex="0" role="button" aria-expanded="true">
            <span>${section.title}</span>
            <span class="group-toggle-icon">▼</span>
          </div>
          <ul class="group-items" style="list-style: none;">
      `;

      section.items.forEach((item) => {
        const isActive = item.id === currentLessonId;
        const isBookmarked = !!bookmarks[item.id];
        const mastery = masteryMap[item.id] || 'not_started';

        html += `
          <li class="lesson-nav-item ${isActive ? 'active' : ''}" data-lesson-id="${item.id}" tabindex="0" role="link">
            <div class="nav-item-left">
              <span class="nav-item-icon">${item.icon || '📄'}</span>
              <span class="nav-item-title">${item.title}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              ${isBookmarked ? '<span style="color: #f59e0b; font-size: 0.8rem;" title="Bookmarked">★</span>' : ''}
              <span class="mastery-dot ${mastery.replace('_', '-')}" title="Status: ${mastery}"></span>
            </div>
          </li>
        `;
      });

      html += `
          </ul>
        </li>
      `;
    });

    html += `</ul>`;
    this.container.innerHTML = html;
    this.bindEvents();
  }

  bindEvents() {
    // Collapsible group headers
    this.container.querySelectorAll('.group-header').forEach((header) => {
      header.addEventListener('click', () => {
        const group = header.closest('.curriculum-group');
        group.classList.toggle('collapsed');
      });
    });

    // Lesson selection clicks
    this.container.querySelectorAll('.lesson-nav-item').forEach((item) => {
      item.addEventListener('click', () => {
        const lessonId = item.dataset.lessonId;
        if (lessonId) {
          AppState.setLesson(lessonId);
          if (this.onSelectLesson) this.onSelectLesson(lessonId);
        }
      });
    });
  }
}
