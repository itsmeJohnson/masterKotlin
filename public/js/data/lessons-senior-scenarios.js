/* ==========================================================================
   Priority 4: Senior Engineering & AVP Scenarios
   Scenario-based interviews for Barclays GSC / Tesco Bank Mobile Leadership
   ========================================================================== */

export const SENIOR_SCENARIOS = {
  'scenario-monolith-to-modular': {
    id: 'scenario-monolith-to-modular',
    title: 'Monolith to Multi-Module Migration Under Fast Sprint Delivery',
    category: 'Architecture Leadership',
    difficulty: 'AVP Level',
    timeEstimate: '30 min',
    situation: `
      <p><strong>Business Context:</strong> You have joined as a Senior Android Lead / AVP at Barclays GSC. The retail banking app is a 5-year-old single monolith <code>:app</code> Gradle module with 65 mobile engineers committing across 7 squad teams.</p>
      <p><strong>Technical Pain Points:</strong></p>
      <ul>
        <li>Clean debug build time is 26 minutes; incremental builds take 4 minutes.</li>
        <li>Frequent merge conflicts in Dagger components and Gradle files are blocking releases.</li>
        <li>Code boundaries are blurry: Feature teams (Cards, Transfers, Onboarding) are directly accessing internal classes of each other's ViewModels.</li>
        <li>Product Directors are pushing for 4 new major compliance features next quarter and are skeptical of any work that doesn't deliver immediate customer-facing UI.</li>
      </ul>
    `,
    promptQuestion: 'As the technical lead, how do you architect and execute this modularization strategy while maintaining sprint feature delivery velocity?',
    evaluationRubric: {
      keyThemes: [
        'incremental migration',
        'domain boundaries',
        'core modules',
        'build cache',
        'stakeholder communication',
        'metrics',
        'api/impl separation'
      ],
      idealAnswerCoverages: [
        'Never do a complete "code freeze" rewrite: Product delivery must continue in parallel.',
        'Establish clear module tiers: :core (network, database, design-system), :feature-api (contracts/interfaces), and :feature-impl (private implementations).',
        'Adopt Gradle Configuration Cache, Remote Build Cache, and Convention Plugins to immediately slash build times before full modularization.',
        'Use feature flags to allow squad autonomy without blocking the main branch.',
        'Measure business ROI: Translate engineering hours saved per build into developer velocity dollars to convince Product leadership.'
      ],
      followUpQuestion: 'How would you enforce architectural boundaries programmatically in CI so junior engineers cannot introduce circular dependencies or bypass the :api layer?'
    }
  },

  'scenario-compose-migration-strategy': {
    id: 'scenario-compose-migration-strategy',
    title: 'Jetpack Compose Migration for an Existing XML Banking App',
    category: 'Architecture Leadership',
    difficulty: 'AVP Level',
    timeEstimate: '25 min',
    situation: `
      <p><strong>Business Context:</strong> Your banking app currently has over 200 custom XML layouts, fragments, and data-binding adapters. The team wants to adopt Jetpack Compose to speed up feature development.</p>
      <p><strong>Dilemma:</strong> Junior developers want to rewrite entire screens from scratch immediately. A Staff engineer warns that Compose inside existing Fragments introduces memory overhead, and the custom banking Design System (DS) is currently built entirely on Material 2 XML styles.</p>
    `,
    promptQuestion: 'What is your phased technical strategy for migrating to Jetpack Compose safely, and how do you handle the Design System foundation?',
    evaluationRubric: {
      keyThemes: [
        'bottom-up',
        'design system',
        'composeview',
        'training',
        'interoperability',
        'stability',
        'performance'
      ],
      idealAnswerCoverages: [
        'Start with a bottom-up migration of the Design System: Build atomic Compose primitives (BankingButton, CurrencyInput, AccountCard) that match existing XML styles.',
        'Use ComposeView inside existing Fragments for isolated new UI components before migrating entire screen lifecycles.',
        'Standardize on M3 Theme with custom ColorScheme and Typography tokens.',
        'Conduct internal workshops on recomposition pitfalls and @Immutable state models to prevent performance regressions in release builds.'
      ],
      followUpQuestion: 'How would you measure whether Compose adoption actually improved developer velocity and reduced UI defect rates over a 6-month period?'
    }
  },

  'scenario-p1-production-incident': {
    id: 'scenario-p1-production-incident',
    title: 'P1 Production Crash Loop & Emergency Rollout Governance',
    category: 'Production Governance',
    difficulty: 'AVP Level',
    timeEstimate: '30 min',
    situation: `
      <p><strong>Business Context:</strong> Version 4.2.0 was promoted to 15% staged rollout at 10:00 AM. By 11:30 AM, Crashlytics reports a sudden spike: 1,400 crashes occurring on startup (Crash-Free rate drops from 99.9% to 92.4%), specifically on devices running Android 14.</p>
      <p><strong>Log Snippet:</strong> <code>java.lang.SecurityException: One of RECEIVER_EXPORTED or RECEIVER_NOT_EXPORTED must be specified</code></p>
      <p><strong>Situation:</strong> The Head of Customer Operations is receiving hundreds of customer complaints on Twitter/X, and the Release Manager wants to know whether to halt rollout or push a blind hotfix.</p>
    `,
    promptQuestion: 'Detail your exact minute-by-minute incident response process, stakeholder communication, technical root cause triage, and postmortem remediation.',
    evaluationRubric: {
      keyThemes: [
        'halt staged rollout',
        'blast radius',
        'root cause analysis',
        'reproduction',
        'hotfix verification',
        'postmortem',
        'ci lint check'
      ],
      idealAnswerCoverages: [
        'Immediate Action: Halt the Google Play staged rollout immediately within 2 minutes to cap the blast radius at 15%.',
        'Communication: Post an incident status update in the cross-functional war room (Incident Commander role, Executive summary, technical updates every 30 mins).',
        'Root Cause: Android 14 (API 34) strictly enforces the export flag for dynamic broadcast receivers. A third-party SDK or legacy broadcast registration missed the flag.',
        'Resolution: Create a minimal hotfix (v4.2.1), test on physical Android 14 test devices in Firebase Test Lab, and fast-track expedited review with Google Play.',
        'Governance: Add Android Lint rule as a fatal CI gate to reject any receiver registration missing the export flag.'
      ],
      followUpQuestion: 'What preventative automated smoke tests would you mandate in the CI pipeline to catch OS-version-specific behavior changes before any staged rollout begins?'
    }
  },

  'scenario-tech-debt-negotiation': {
    id: 'scenario-tech-debt-negotiation',
    title: 'Negotiating Technical Debt Allocation with Product Leadership',
    category: 'Stakeholder Management',
    difficulty: 'AVP Level',
    timeEstimate: '25 min',
    situation: `
      <p><strong>Business Context:</strong> Over the last 18 months, your mobile engineering team delivered back-to-back regulatory and marketing features. As a result, unit test coverage dropped to 38%, deprecated libraries are causing sporadic crashes, and simple UI changes take twice as long.</p>
      <p><strong>Conflict:</strong> The Head of Product states: <em>"We cannot slow down. We have to launch the new Savings feature this quarter to meet our annual customer acquisition targets. Tech debt can wait until next year."</em></p>
    `,
    promptQuestion: 'How do you structure the conversation and negotiate a sustainable engineering debt allocation without creating an adversarial relationship with Product?',
    evaluationRubric: {
      keyThemes: [
        'data-driven',
        'lead time',
        'customer impact',
        'boy scout rule',
        'shared ownership',
        'capacity allocation',
        'risk reduction'
      ],
      idealAnswerCoverages: [
        'Frame technical debt in business metrics: Show that cycle time to deliver a feature has increased by 40% due to legacy coupling, and quantify the cost of regression bugs.',
        'Propose an 80/20 capacity allocation model (80% product features, 20% architectural resilience and test automation) rather than asking for a complete freeze.',
        'Tie tech debt reduction directly to Product goals: e.g., "Refactoring the authentication module reduces payment failure rates by 3% and improves onboarding conversion."',
        'Adopt the Boy Scout Rule ("Leave the campground cleaner than you found it") during ongoing feature work.'
      ],
      followUpQuestion: 'If a critical production bug emerges during the sprint, how do you re-balance the agreed 20% tech debt capacity without losing long-term momentum?'
    }
  }
};
