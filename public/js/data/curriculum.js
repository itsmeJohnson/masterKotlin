/* ==========================================================================
   Curriculum Hierarchy Data
   ========================================================================== */

export const CURRICULUM = [
  {
    id: 'priority-1-fundamentals',
    title: 'Priority 1: Kotlin & DSA Mastery',
    description: 'Core Kotlin language syntax, data structures, and algorithmic assessment preparation.',
    badge: 'Core DSA',
    items: [
      {
        id: 'lesson-kotlin-fundamentals-intro',
        title: 'Variables, Loops, Conditions & Indexes',
        category: 'Kotlin Fundamentals',
        difficulty: 'Beginner',
        duration: '25 min',
        icon: '⚡',
        initialLesson: true,
        summary: 'Master val vs var, string indexing, 0-based indexing, if-conditions, and HashMap value tracking using the string "abcba".'
      },
      {
        id: 'lesson-kotlin-types-null-safety',
        title: 'Null Safety, Smart Casts & Type System',
        category: 'Kotlin Fundamentals',
        difficulty: 'Beginner',
        duration: '20 min',
        icon: '🛡️',
        summary: 'Nullable types (String?), safe call (?.), elvis operator (?:), smart casting (is), and non-null assertion (!!).'
      },
      {
        id: 'lesson-kotlin-oop-data-classes',
        title: 'Classes, Data Classes & Collections',
        category: 'Kotlin Fundamentals',
        difficulty: 'Easy',
        duration: '25 min',
        icon: '📦',
        summary: 'data class copy, componentN, immutable List vs MutableList, Sets, and Map transformations.'
      },
      {
        id: 'lesson-kotlin-stdin-stdout',
        title: 'HackerEarth Stdin/Stdout & I/O Parsing',
        category: 'Kotlin Fundamentals',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '⌨️',
        summary: 'Scanner vs BufferedReader, StringTokenizer, readlnOrNull(), and fast I/O for assessment platforms.'
      },
      {
        id: 'lesson-strings-reverse-palindrome',
        title: 'Strings: Reversal, Palindromes & Anagrams',
        category: 'Strings',
        difficulty: 'Easy',
        duration: '30 min',
        icon: '🔤',
        summary: 'In-place two-pointer string reversal, palindrome checks ignoring case, and anagram verification via frequency maps.'
      },
      {
        id: 'lesson-strings-longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        category: 'Strings',
        difficulty: 'Medium',
        duration: '35 min',
        icon: '🔍',
        summary: 'Sliding window with HashMap tracking character last-seen index. Detailed "abcba" and "pwwkew" traces.'
      },
      {
        id: 'lesson-arrays-kadane-subarray',
        title: 'Arrays: Kadane’s Max Subarray Sum',
        category: 'Arrays & Lists',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '📊',
        summary: 'Optimal O(n) subarray sum, tracking currentSum and maxSum, handling all-negative arrays.'
      },
      {
        id: 'lesson-arrays-stock-buy-sell',
        title: 'Arrays: Best Time to Buy and Sell Stock',
        category: 'Arrays & Lists',
        difficulty: 'Easy',
        duration: '20 min',
        icon: '📈',
        summary: 'Single pass minPrice tracking and maxProfit calculation with edge cases.'
      },
      {
        id: 'lesson-hashmaps-two-sum',
        title: 'HashMaps: Two Sum & Frequency Counting',
        category: 'HashMaps & Sets',
        difficulty: 'Easy',
        duration: '25 min',
        icon: '🗺️',
        summary: 'Complement lookup `target - num`, O(1) average lookup, duplicate handling, and frequency tables.'
      },
      {
        id: 'lesson-hashmaps-group-anagrams',
        title: 'HashMaps: Group Anagrams & Longest Consecutive',
        category: 'HashMaps & Sets',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🗂️',
        summary: 'Sorted string keys vs 26-char frequency tuple keys, and HashSet sequence expansion.'
      },
      {
        id: 'lesson-sorting-algorithms',
        title: 'Sorting: Merge Sort, Quick Sort & Comparators',
        category: 'Sorting',
        difficulty: 'Medium',
        duration: '35 min',
        icon: '🔃',
        summary: 'Divide-and-conquer, partition logic, stability, Kotlin sortedWith and compareBy.'
      },
      {
        id: 'lesson-two-pointers-patterns',
        title: 'Two Pointers: Sorted Pairs, 3-Sum & Cycle Detect',
        category: 'Two Pointers',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '👉👈',
        summary: 'Opposite direction pointers, same direction fast/slow Floyd cycle detection in lists.'
      },
      {
        id: 'lesson-sliding-window-fixed-variable',
        title: 'Sliding Window: Fixed Size vs Dynamic Window',
        category: 'Sliding Window',
        difficulty: 'Medium',
        duration: '35 min',
        icon: '🪟',
        summary: 'Subarray sum of size k, minimum size subarray sum >= target, window expansion and contraction rules.'
      },
      {
        id: 'lesson-binary-search-bounds',
        title: 'Binary Search: Lower/Upper Bounds & Rotated Array',
        category: 'Binary Search',
        difficulty: 'Medium',
        duration: '35 min',
        icon: '🎯',
        summary: 'Search space reduction, mid calculation `left + (right - left) / 2`, inflection point in rotated arrays.'
      },
      {
        id: 'lesson-stacks-queues-parens',
        title: 'Stacks & Queues: Balanced Parens & Monotonic Stack',
        category: 'Stacks, Queues & Lists',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🥞',
        summary: 'LIFO bracket matching, Next Greater Element via Monotonic Decreasing Stack, and queue simulation.'
      },
      {
        id: 'lesson-recursion-subsets',
        title: 'Recursion & Backtracking: Subsets & Permutations',
        category: 'Recursion & Backtracking',
        difficulty: 'Medium',
        duration: '35 min',
        icon: '🌳',
        summary: 'State-space trees, base cases, call stack visualization, choose-explore-unchoose pattern.'
      },
      {
        id: 'lesson-dp-fib-climbing-stairs',
        title: 'Dynamic Programming: Climbing Stairs & House Robber',
        category: 'Dynamic Programming',
        difficulty: 'Medium',
        duration: '40 min',
        icon: '🧩',
        summary: 'Overlapping subproblems, state definition dp[i], recurrence relation, space optimization O(1).'
      },
      {
        id: 'lesson-trees-graphs-traversals',
        title: 'Trees & Graphs: BFS, DFS & Shortest Path',
        category: 'Trees & Graphs',
        difficulty: 'Hard',
        duration: '45 min',
        icon: '🕸️',
        summary: 'Adjacency list, queue-based BFS level order, recursive DFS, cycle detection in directed graphs.'
      }
    ]
  },
  {
    id: 'priority-2-android-internals',
    title: 'Priority 2: Android & Kotlin Internals',
    description: 'Senior Android architecture, coroutines, reactive streams, Compose, and banking-grade networking.',
    badge: 'Mobile Core',
    items: [
      {
        id: 'lesson-android-coroutines-flow',
        title: 'Coroutines, Dispatchers & Flow / StateFlow',
        category: 'Kotlin Concurrency',
        difficulty: 'Advanced',
        duration: '40 min',
        icon: '⚡',
        summary: 'Structured concurrency, SupervisorJob, StateFlow vs SharedFlow, repeatOnLifecycle, and safe cancellation.'
      },
      {
        id: 'lesson-android-architecture-clean',
        title: 'Clean Architecture, MVI/MVVM & UDF State',
        category: 'Android Architecture',
        difficulty: 'Advanced',
        duration: '35 min',
        icon: '🏛️',
        summary: 'Unidirectional Data Flow, sealed interface UiState, UseCase domain layer, Repository pattern in Banking.'
      },
      {
        id: 'lesson-android-jetpack-compose',
        title: 'Jetpack Compose: Recomposition & State Hoisting',
        category: 'Jetpack Compose',
        difficulty: 'Advanced',
        duration: '40 min',
        icon: '🎨',
        summary: 'remember, mutableStateOf, derivedStateOf, LaunchedEffect, LazyColumn key stability, and avoiding unnecessary recompositions.'
      },
      {
        id: 'lesson-android-di-networking',
        title: 'Hilt DI, Retrofit Interceptors & Certificate Pinning',
        category: 'DI & Networking',
        difficulty: 'Advanced',
        duration: '35 min',
        icon: '🔌',
        summary: 'Constructor injection, ViewModelScoped, Auth token refresh authenticator, and OkHttp CertificatePinner.'
      }
    ]
  },
  {
    id: 'priority-3-testing-security-delivery',
    title: 'Priority 3: Testing, Security & Delivery',
    description: 'Banking-grade test automation, Android Keystore, root detection, Gradle Kotlin DSL, and release engineering.',
    badge: 'Production Eng',
    items: [
      {
        id: 'lesson-testing-junit-mockk-turbine',
        title: 'Unit Testing: MockK, Turbine & Compose UI Tests',
        category: 'Testing & QA',
        difficulty: 'Advanced',
        duration: '35 min',
        icon: '🧪',
        summary: 'StandardTestDispatcher, coEvery, Turbine test on Flow emissions, Fake repositories vs Mocks, and Compose test rules.'
      },
      {
        id: 'lesson-security-keystore-pinning',
        title: 'Banking Security: Keystore, Biometrics & Pinning',
        category: 'Security',
        difficulty: 'Advanced',
        duration: '40 min',
        icon: '🔒',
        summary: 'Hardware-backed TEE keys, BiometricPrompt CryptoObject, EncryptedSharedPreferences, root detection, and memory wiping.'
      },
      {
        id: 'lesson-delivery-gradle-cicd',
        title: 'Build Systems: Gradle Kotlin DSL & CI/CD Pipelines',
        category: 'Build & Delivery',
        difficulty: 'Advanced',
        duration: '30 min',
        icon: '🚀',
        summary: 'libs.versions.toml version catalogs, build flavors (uk, retail), GitHub Actions, Detekt quality gates, and staged rollouts.'
      },
      {
        id: 'lesson-monitoring-crashlytics-anr',
        title: 'Production Monitoring: Crashlytics, ANRs & LeakCanary',
        category: 'Observability',
        difficulty: 'Advanced',
        duration: '30 min',
        icon: '🚨',
        summary: 'Non-fatal error logging, Main thread blocking ANR triage, memory leak root-cause analysis, and incident runbooks.'
      }
    ]
  },
  {
    id: 'priority-4-senior-avp-scenarios',
    title: 'Priority 4: Senior / AVP Scenario Assessments',
    description: 'Executive-level engineering trade-offs, architectural governance, technical debt, and incident postmortems.',
    badge: 'AVP Leadership',
    items: [
      {
        id: 'scenario-monolith-to-modular',
        title: 'Scenario: Monolith to Multi-Module Migration',
        category: 'Architecture Leadership',
        difficulty: 'AVP Level',
        duration: '30 min',
        icon: '👔',
        summary: 'Banking app with 60+ engineers suffering 25-minute build times. Architecting domain boundaries and feature modules.'
      },
      {
        id: 'scenario-compose-migration-strategy',
        title: 'Scenario: Jetpack Compose Migration Strategy',
        category: 'Architecture Leadership',
        difficulty: 'AVP Level',
        duration: '25 min',
        icon: '👔',
        summary: 'Incremental migration of 4-year-old banking XML codebase without halting sprint feature delivery.'
      },
      {
        id: 'scenario-offline-balance-resilience',
        title: 'Scenario: Offline-First Balance & Payments Resilience',
        category: 'System Design',
        difficulty: 'AVP Level',
        duration: '30 min',
        icon: '👔',
        summary: 'Handling inconsistent network states during account balance queries and idempotent money transfers.'
      },
      {
        id: 'scenario-p1-production-incident',
        title: 'Scenario: P1 Crash Loop & Release Rollback Postmortem',
        category: 'Production Governance',
        difficulty: 'AVP Level',
        duration: '30 min',
        icon: '👔',
        summary: 'App crash loop affecting 15% of Android 14 users on version 4.2.0. Emergency rollback vs hotfix, RCA, and 5-Whys.'
      },
      {
        id: 'scenario-tech-debt-negotiation',
        title: 'Scenario: Negotiating Tech Debt with Product Leadership',
        category: 'Stakeholder Management',
        difficulty: 'AVP Level',
        duration: '25 min',
        icon: '👔',
        summary: 'Convincing Product Directors to allocate 30% sprint capacity for architectural hardening and test coverage.'
      }
    ]
  }
];
