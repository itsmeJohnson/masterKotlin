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
import { AssessmentViewComponent } from './components/assessment-view.js';
import { ThreeOptionsViewComponent } from './components/three-options-view.js';

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

    this.threeOptionsView = new ThreeOptionsViewComponent(viewportEl);
    this.lessonView = new LessonViewComponent(viewportEl);
    this.visualizerView = new VisualizerViewComponent(viewportEl);
    this.workspaceView = new WorkspaceViewComponent(viewportEl);
    this.reviewView = new ReviewViewComponent(viewportEl);
    this.scenarioView = new ScenarioViewComponent(viewportEl);
    this.dashboardView = new DashboardViewComponent(viewportEl);
    this.assessmentView = new AssessmentViewComponent(viewportEl);

    this.searchModal = new SearchModalComponent(searchModalOverlay, (lessonId) => {
      this.handleLessonSelect(lessonId);
    });
    this.searchModal.init();

    // Check compiler health and allow custom backend endpoint configuration
    const bannerBadge = document.getElementById('compiler-status-badge');
    if (bannerBadge) {
      const updateBadge = (info) => {
        const shortVer = (info.version || 'kotlinc').replace(/^info:\s*/, '');
        bannerBadge.textContent = info.available ? `✓ ${shortVer}` : '⚠️ Static Review Mode';
        bannerBadge.title = info.available 
          ? `Live JVM compilation active at: ${info.endpoint || 'same-origin'}. Click to configure backend.` 
          : 'Static mode (compiler offline). Click to configure live backend runner URL.';
      };

      ApiClient.checkCompilerStatus().then(updateBadge);

      bannerBadge.addEventListener('click', async () => {
        const current = ApiClient.getBaseUrl();
        const next = window.prompt(
          'Configure Backend Compiler API Endpoint:\n\n' +
          '• Leave empty for default same-origin / local server\n' +
          '• Or enter your live Tunnel or Cloud URL (e.g. https://your-server.loca.lt or https://app.onrender.com):',
          current
        );
        if (next !== null) {
          ApiClient.setBaseUrl(next);
          bannerBadge.textContent = 'Probing...';
          const info = await ApiClient.checkCompilerStatus();
          updateBadge(info);
        }
      });
    }

    this.bindHeaderAndModeEvents();

    // Check URL hash for initial mode
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validModes = ['dbms', 'mcqs', 'dsa', 'assessment', 'learn', 'trace', 'practise', 'review', 'interview', 'dashboard', 'revise'];
    if (hash && validModes.includes(hash)) {
      AppState.data.currentMode = hash;
    } else {
      AppState.data.currentMode = 'dbms';
    }

    // State changes subscriber
    AppState.subscribe(() => {
      this.sidebar.render();
      this.renderCurrentView();
    });

    // Boot: Start directly with DBMS & Queries (Top Priority)
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

    // The Three Primary Quick Prep Modes
    if (mode === 'dbms' || mode === 'mcqs' || mode === 'dsa') {
      document.body.classList.add('three-options-active');
      this.threeOptionsView.init(mode);
      return;
    } else {
      document.body.classList.remove('three-options-active');
    }

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
      case 'assessment':
        this.assessmentView.init();
        break;
      default:
        this.threeOptionsView.init('dbms');
    }
  }

  static bindHeaderAndModeEvents() {
    // Mode switcher buttons with global delegation
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-tab-btn');
      if (btn && btn.dataset.mode) {
        window.location.hash = `#${btn.dataset.mode}`;
        AppState.setMode(btn.dataset.mode);
      }
    });

    // Support browser back/forward and hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validModes = ['dbms', 'mcqs', 'dsa', 'assessment', 'learn', 'trace', 'practise', 'review', 'interview', 'dashboard', 'revise'];
      if (hash && validModes.includes(hash) && AppState.data.currentMode !== hash) {
        AppState.data.currentMode = hash;
        this.renderCurrentView();
      }
    });

    // Home brand logo click
    const homeLink = document.getElementById('brand-home-link');
    if (homeLink) {
      homeLink.addEventListener('click', () => {
        window.location.hash = '#dbms';
        AppState.setMode('dbms');
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

// Start app on DOM ready or immediately if already loaded
function bootApp() {
  try {
    App.init();
  } catch (err) {
    console.error('[App Boot Error]:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}
