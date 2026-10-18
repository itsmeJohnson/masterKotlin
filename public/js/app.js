/* ==========================================================================
   Main Application Coordinator
   Kotlin & Android Mastery Lab — Tesco Bank / Barclays GSC Preparation
   ========================================================================== */

import { AppState } from './state.js';
import { ApiClient } from './api.js';
import { SidebarComponent } from './components/sidebar.js';
import { LessonViewComponent } from './components/lesson-view.js';
import { VisualizerViewComponent } from './components/visualizer-view.js';
import { WorkspaceViewComponent } from './components/workspace-view.js';
import { ReviewViewComponent } from './components/review-view.js';
import { ScenarioViewComponent } from './components/scenario-view.js';
import { DashboardViewComponent } from './components/dashboard-view.js';
import { SearchModalComponent } from './components/search-modal.js';

class App {
  static async init() {
    AppState.init();

    // Elements
    const sidebarEl = document.getElementById('sidebar-container');
    const viewportEl = document.getElementById('view-viewport');
    const searchModalOverlay = document.getElementById('search-modal-overlay');

    // Instantiate components
    this.sidebar = new SidebarComponent(sidebarEl, (lessonId) => {
      this.handleLessonSelect(lessonId);
    });

    this.lessonView = new LessonViewComponent(viewportEl);
    this.visualizerView = new VisualizerViewComponent(viewportEl);
    this.workspaceView = new WorkspaceViewComponent(viewportEl);
    this.reviewView = new ReviewViewComponent(viewportEl);
    this.scenarioView = new ScenarioViewComponent(viewportEl);
    this.dashboardView = new DashboardViewComponent(viewportEl);

    this.searchModal = new SearchModalComponent(searchModalOverlay, (lessonId) => {
      this.handleLessonSelect(lessonId);
    });
    this.searchModal.init();

    // Check compiler health
    ApiClient.checkCompilerStatus().then((info) => {
      const bannerBadge = document.getElementById('compiler-status-badge');
      if (bannerBadge) {
        bannerBadge.textContent = info.available ? `✓ ${info.version}` : '⚠️ Static Review Mode';
        bannerBadge.title = info.available ? 'Live kotlinc JVM compilation active' : 'kotlinc host compiler offline';
      }
    });

    this.bindHeaderAndModeEvents();

    // Check URL hash for initial mode
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validModes = ['learn', 'trace', 'practise', 'review', 'interview', 'dashboard', 'revise'];
    if (hash && validModes.includes(hash)) {
      AppState.data.currentMode = hash;
    }

    // State changes subscriber
    AppState.subscribe(() => {
      this.sidebar.render();
      this.renderCurrentView();
    });

    // Boot: Open Initial Lesson required by acceptance criteria:
    // "Kotlin Fundamentals — Variables, Loops, Conditions and Indexes"
    AppState.setLesson('lesson-kotlin-fundamentals-intro');
    this.sidebar.render();
    this.renderCurrentView();
  }

  static handleLessonSelect(lessonId) {
    // Auto-close sidebar drawer on mobile
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
    }

    if (lessonId.startsWith('scenario-')) {
      AppState.setMode('interview');
    } else if (AppState.data.currentMode === 'interview') {
      AppState.setMode('learn');
    }
    this.renderCurrentView();
  }

  static renderCurrentView() {
    const mode = AppState.data.currentMode;
    const lessonId = AppState.data.currentLessonId;

    // Update active mode tab button in top bar
    document.querySelectorAll('.mode-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
      btn.setAttribute('aria-selected', btn.dataset.mode === mode ? 'true' : 'false');
    });

    switch (mode) {
      case 'learn':
        this.lessonView.render(lessonId);
        break;
      case 'trace':
        this.visualizerView.loadForLesson(lessonId);
        break;
      case 'practise':
        this.workspaceView.loadForLesson(lessonId);
        break;
      case 'review':
        this.reviewView.render(lessonId);
        break;
      case 'interview':
        this.scenarioView.loadScenario(lessonId.startsWith('scenario-') ? lessonId : 'scenario-monolith-to-modular');
        break;
      case 'dashboard':
      case 'revise':
        this.dashboardView.render();
        break;
      default:
        this.lessonView.render(lessonId);
    }
  }

  static bindHeaderAndModeEvents() {
    // Mode switcher buttons with global delegation
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-tab-btn');
      if (btn && btn.dataset.mode) {
        AppState.setMode(btn.dataset.mode);
      }
    });

    // Support browser back/forward and hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validModes = ['learn', 'trace', 'practise', 'review', 'interview', 'dashboard', 'revise'];
      if (hash && validModes.includes(hash) && AppState.data.currentMode !== hash) {
        AppState.data.currentMode = hash;
        this.renderCurrentView();
      }
    });

    // Home brand logo click
    const homeLink = document.getElementById('brand-home-link');
    if (homeLink) {
      homeLink.addEventListener('click', () => {
        AppState.setLesson('lesson-kotlin-fundamentals-intro');
        AppState.setMode('learn');
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        AppState.toggleTheme();
        themeBtn.textContent = AppState.data.theme === 'dark' ? '☀️' : '🌙';
      });
    }

    // Search trigger
    const searchTrigger = document.getElementById('btn-open-search');
    if (searchTrigger) {
      searchTrigger.addEventListener('click', () => {
        this.searchModal.open();
      });
    }

    // Mobile sidebar toggle
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (mobileMenuBtn && sidebar && backdrop) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('active');
      });
    }
  }
}

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
