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
  },
  {
    id: 'priority-5-algorithms-two-pointers',
    title: 'Algorithms: Arrays & Two Pointers',
    description: 'Two Pointers technique for sorted arrays, area maximization, triplet sums, and in-place manipulations.',
    badge: 'Two Pointers (5)',
    items: [
      {
        id: 'algo-twosum-sorted',
        title: 'Two Sum II — Sorted Array',
        category: 'Arrays & Two Pointers',
        difficulty: 'Easy',
        duration: '20 min',
        icon: '👉',
        summary: 'Find two numbers adding up to target in non-decreasing array using two opposite-end pointers in O(1) space.'
      },
      {
        id: 'algo-container-water',
        title: 'Container With Most Water',
        category: 'Arrays & Two Pointers',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🚰',
        summary: 'Maximize water capacity by converging pointers from outer boundaries inward based on shorter height.'
      },
      {
        id: 'algo-3sum',
        title: '3Sum — Triplets Summing to Zero',
        category: 'Arrays & Two Pointers',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '3️⃣',
        summary: 'Sort array, fix first element, and run two pointers to discover unique non-duplicate triplets summing to 0.'
      },
      {
        id: 'algo-trapping-rain-water',
        title: 'Trapping Rain Water',
        category: 'Arrays & Two Pointers',
        difficulty: 'Hard',
        duration: '35 min',
        icon: '🌧️',
        summary: 'Calculate trapped rain water in O(n) time and O(1) space using leftMax and rightMax elevation bounds.'
      },
      {
        id: 'algo-remove-duplicates',
        title: 'Remove Duplicates from Sorted Array',
        category: 'Arrays & Two Pointers',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '✂️',
        summary: 'In-place array compaction using slow-fast read/write pointer mechanics.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-sliding-window',
    title: 'Algorithms: Sliding Window',
    description: 'Fixed and dynamic sliding window algorithms for substring search, maximum subarrays, and frequency tracking.',
    badge: 'Sliding Window (5)',
    items: [
      {
        id: 'ex-substring-abcba',
        title: 'Longest Substring Without Repeating Chars',
        category: 'Sliding Window',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🪟',
        summary: 'Dynamic sliding window with HashMap tracking last-seen character indices and monotonic left pointer jumps.'
      },
      {
        id: 'algo-max-subarray-k',
        title: 'Maximum Sum Subarray of Size K',
        category: 'Sliding Window',
        difficulty: 'Easy',
        duration: '20 min',
        icon: '➕',
        summary: 'Fixed-size sliding window: add incoming element and subtract outgoing element in O(1) step time.'
      },
      {
        id: 'algo-min-window-substring',
        title: 'Minimum Window Substring',
        category: 'Sliding Window',
        difficulty: 'Hard',
        duration: '35 min',
        icon: '🎯',
        summary: 'Dynamic expansion and contraction window to find smallest substring containing all characters of pattern t.'
      },
      {
        id: 'algo-longest-repeating-char',
        title: 'Longest Repeating Character Replacement',
        category: 'Sliding Window',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🔄',
        summary: 'Sliding window tracking most frequent character count: window size minus maxFreq must not exceed k.'
      },
      {
        id: 'algo-fruit-baskets',
        title: 'Fruit Into Baskets (At Most 2 Types)',
        category: 'Sliding Window',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🍎',
        summary: 'Longest contiguous subarray with at most two distinct elements using frequency map sliding window.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-prefix-kadane',
    title: 'Algorithms: Prefix Sum & Kadane’s',
    description: 'Subarray accumulation, running products, and maximum subarray dynamic programming.',
    badge: 'Prefix / Kadane (5)',
    items: [
      {
        id: 'ex-kadane-array',
        title: 'Kadane’s Algorithm — Max Subarray Sum',
        category: 'Prefix Sum & Kadane',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '📈',
        summary: 'Optimal single-pass subarray sum deciding whether to extend previous subarray or start afresh at each index.'
      },
      {
        id: 'algo-subarray-sum-k',
        title: 'Subarray Sum Equals K',
        category: 'Prefix Sum & Kadane',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🎯',
        summary: 'Prefix sum hash map: counting occurrences of (currentSum - k) in O(n) time.'
      },
      {
        id: 'algo-product-except-self',
        title: 'Product of Array Except Self',
        category: 'Prefix Sum & Kadane',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '✖️',
        summary: 'Two-pass prefix and suffix product accumulation without using division.'
      },
      {
        id: 'algo-max-product-subarray',
        title: 'Maximum Product Subarray',
        category: 'Prefix Sum & Kadane',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '⚡',
        summary: 'Tracking both min and max running products to handle negative number flips.'
      },
      {
        id: 'algo-range-sum-query',
        title: 'Range Sum Query — Immutable',
        category: 'Prefix Sum & Kadane',
        difficulty: 'Easy',
        duration: '20 min',
        icon: '📋',
        summary: 'Precomputed 1-indexed prefix sum array enabling O(1) range sum queries.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-binary-search',
    title: 'Algorithms: Binary Search',
    description: 'Logarithmic searching in sorted spaces, rotated arrays, boundary bounds, and peak element detection.',
    badge: 'Binary Search (5)',
    items: [
      {
        id: 'algo-binary-search-std',
        title: 'Standard Binary Search',
        category: 'Binary Search',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '🔎',
        summary: 'Exact value logarithmic search with overflow-safe mid calculation.'
      },
      {
        id: 'algo-search-rotated-array',
        title: 'Search in Rotated Sorted Array',
        category: 'Binary Search',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🔄',
        summary: 'Identify sorted half of rotated array and route search boundaries in O(log n) time.'
      },
      {
        id: 'algo-find-first-last-pos',
        title: 'Find First & Last Position of Element',
        category: 'Binary Search',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '↔️',
        summary: 'Dual binary search with left and right bias to locate first and last matching indices.'
      },
      {
        id: 'algo-find-min-rotated',
        title: 'Find Minimum in Rotated Sorted Array',
        category: 'Binary Search',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '📉',
        summary: 'Locate pivot inflection point by comparing mid with right boundary.'
      },
      {
        id: 'algo-peak-element',
        title: 'Find Peak Element',
        category: 'Binary Search',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '⛰️',
        summary: 'Binary search over unsorted array by traversing along ascending slope.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-linked-lists',
    title: 'Algorithms: Linked Lists & Fast-Slow Pointers',
    category: 'Linked Lists & Pointers',
    description: 'Pointer manipulation, Floyd cycle finding, list reversal, and dummy node techniques.',
    badge: 'Linked Lists (5)',
    items: [
      {
        id: 'algo-linked-list-cycle',
        title: 'Linked List Cycle Detection',
        category: 'Linked Lists & Pointers',
        difficulty: 'Easy',
        duration: '20 min',
        icon: '🔁',
        summary: "Floyd's Tortoise and Hare algorithm to detect infinite pointer loops in O(1) space."
      },
      {
        id: 'algo-middle-linked-list',
        title: 'Middle of the Linked List',
        category: 'Linked Lists & Pointers',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '📍',
        summary: 'Single pass middle element retrieval using 1x and 2x speed pointers.'
      },
      {
        id: 'algo-reverse-linked-list',
        title: 'Reverse Linked List',
        category: 'Linked Lists & Pointers',
        difficulty: 'Easy',
        duration: '20 min',
        icon: '↩️',
        summary: 'Iterative 3-pointer in-place reversal: prev, curr, nextNode.'
      },
      {
        id: 'algo-merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        category: 'Linked Lists & Pointers',
        difficulty: 'Easy',
        duration: '20 min',
        icon: '🔗',
        summary: 'Splicing sorted nodes using a dummy sentinel node to simplify head initialization.'
      },
      {
        id: 'algo-remove-nth-from-end',
        title: 'Remove N-th Node From End of List',
        category: 'Linked Lists & Pointers',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🗑️',
        summary: 'Single pass deletion by setting up a fixed n-step gap between two pointers.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-stacks',
    title: 'Algorithms: Stacks & Monotonic Stacks',
    category: 'Stacks & Queues',
    description: 'LIFO evaluation, monotonic stacks for next greater elements, and O(1) min stack design.',
    badge: 'Stacks (5)',
    items: [
      {
        id: 'algo-valid-parentheses',
        title: 'Valid Parentheses',
        category: 'Stacks & Queues',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '🧱',
        summary: 'Matching brackets evaluation using ArrayDeque stack.'
      },
      {
        id: 'algo-next-greater-element',
        title: 'Next Greater Element',
        category: 'Stacks & Queues',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '⏩',
        summary: 'Decreasing monotonic stack resolving next greater element in O(n) time.'
      },
      {
        id: 'algo-daily-temperatures',
        title: 'Daily Temperatures — Wait Days',
        category: 'Stacks & Queues',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🌡️',
        summary: 'Monotonic index stack measuring distance to the next warmer temperature day.'
      },
      {
        id: 'algo-min-stack',
        title: 'Min Stack with O(1) Minimum',
        category: 'Stacks & Queues',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '📦',
        summary: 'Auxiliary minimum stack tracking min element at each stack depth in O(1) time.'
      },
      {
        id: 'algo-asteroid-collision',
        title: 'Asteroid Collision Simulation',
        category: 'Stacks & Queues',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '☄️',
        summary: 'Stack collision simulation for opposing velocity particles.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-hashmaps',
    title: 'Algorithms: HashMaps & Sets',
    category: 'HashMaps & Sets',
    description: 'O(1) complement lookup, grouping by anagram signature, and frequency bucket sorting.',
    badge: 'HashMaps (5)',
    items: [
      {
        id: 'ex-two-sum',
        title: 'Two Sum — Complement Hash Table',
        category: 'HashMaps & Sets',
        difficulty: 'Easy',
        duration: '20 min',
        icon: '🤝',
        summary: 'Single pass complement lookup target - nums[i] in O(n) time.'
      },
      {
        id: 'algo-group-anagrams',
        title: 'Group Anagrams',
        category: 'HashMaps & Sets',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🗂️',
        summary: 'Group strings by canonical sorted letter signature in HashMap.'
      },
      {
        id: 'algo-top-k-frequent',
        title: 'Top K Frequent Elements',
        category: 'HashMaps & Sets',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🔝',
        summary: 'Linear O(n) bucket sort by frequency or O(n log k) PriorityQueue.'
      },
      {
        id: 'algo-longest-consecutive',
        title: 'Longest Consecutive Sequence',
        category: 'HashMaps & Sets',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '📏',
        summary: 'HashSet streak detection starting only from sequence head in O(n) time.'
      },
      {
        id: 'algo-valid-anagram',
        title: 'Valid Anagram',
        category: 'HashMaps & Sets',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '🔤',
        summary: 'Frequency array comparison for 26 lowercase English letters in O(n) time.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-trees',
    title: 'Algorithms: Binary Trees & BST',
    category: 'Binary Trees & BST',
    description: 'Depth-first search recursion, breadth-first level order traversal, BST validation, and LCA.',
    badge: 'Trees & BST (5)',
    items: [
      {
        id: 'algo-max-depth-tree',
        title: 'Maximum Depth of Binary Tree',
        category: 'Binary Trees & BST',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '🌲',
        summary: 'DFS recursion finding longest path from root to furthest leaf.'
      },
      {
        id: 'algo-invert-binary-tree',
        title: 'Invert / Mirror Binary Tree',
        category: 'Binary Trees & BST',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '🪞',
        summary: 'Recursive child swapping mirroring all tree branches.'
      },
      {
        id: 'algo-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        category: 'Binary Trees & BST',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '📊',
        summary: 'Breadth-first search queue capturing nodes level-by-level.'
      },
      {
        id: 'algo-validate-bst',
        title: 'Validate Binary Search Tree',
        category: 'Binary Trees & BST',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '✅',
        summary: 'Subtree bound validation passing (min..max) constraints to prevent ancestor violations.'
      },
      {
        id: 'algo-lowest-common-ancestor',
        title: 'Lowest Common Ancestor (LCA)',
        category: 'Binary Trees & BST',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '👪',
        summary: 'Find lowest common ancestor node in arbitrary binary tree.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-dp',
    title: 'Algorithms: Dynamic Programming',
    category: 'Dynamic Programming',
    description: 'Overlapping subproblems, state memoization, tabular bottom-up DP, and optimization.',
    badge: 'Dynamic Prog (5)',
    items: [
      {
        id: 'algo-climbing-stairs',
        title: 'Climbing Stairs',
        category: 'Dynamic Programming',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '🪜',
        summary: 'Fibonacci state recurrence: ways(n) = ways(n-1) + ways(n-2) in O(1) space.'
      },
      {
        id: 'algo-coin-change',
        title: 'Coin Change — Minimum Coins',
        category: 'Dynamic Programming',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🪙',
        summary: 'Unbounded knapsack style DP computing minimum coins for any target amount.'
      },
      {
        id: 'algo-house-robber',
        title: 'House Robber — Non-Adjacent Sum',
        category: 'Dynamic Programming',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🏠',
        summary: 'Maximize sum without taking adjacent elements using 2 state variables.'
      },
      {
        id: 'algo-longest-increasing-subseq',
        title: 'Longest Increasing Subsequence (LIS)',
        category: 'Dynamic Programming',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '📈',
        summary: 'Classic O(n^2) DP or O(n log n) patience binary search for longest strictly increasing subsequence.'
      },
      {
        id: 'algo-knapsack-01',
        title: '0/1 Knapsack Problem',
        category: 'Dynamic Programming',
        difficulty: 'Medium',
        duration: '35 min',
        icon: '🎒',
        summary: 'Classic 0/1 knapsack with reverse 1D array space optimization in O(W) space.'
      }
    ]
  },
  {
    id: 'priority-5-algorithms-graphs',
    title: 'Algorithms: Graphs, BFS & DFS',
    category: 'Graphs & BFS/DFS',
    description: 'Grid traversal, multi-source BFS, topological sort cycle detection, and graph cloning.',
    badge: 'Graphs & BFS (5)',
    items: [
      {
        id: 'algo-number-of-islands',
        title: 'Number of Islands — Grid DFS',
        category: 'Graphs & BFS/DFS',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🏝️',
        summary: 'Connected components on 2D grid with in-place cell sinking.'
      },
      {
        id: 'algo-rotting-oranges',
        title: 'Rotting Oranges — Multi-Source BFS',
        category: 'Graphs & BFS/DFS',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🍊',
        summary: 'Simultaneous multi-source BFS tracking elapsed time until all infection spreads.'
      },
      {
        id: 'algo-course-schedule',
        title: 'Course Schedule — Cycle Detection',
        category: 'Graphs & BFS/DFS',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🎓',
        summary: "Kahn's in-degree topological sort detecting directed graph cycles."
      },
      {
        id: 'algo-clone-graph',
        title: 'Clone Graph — Deep Copy',
        category: 'Graphs & BFS/DFS',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🕸️',
        summary: 'Deep copying an undirected graph using DFS and an original-to-clone HashMap.'
      },
      {
        id: 'algo-flood-fill',
        title: 'Flood Fill Algorithm',
        category: 'Graphs & BFS/DFS',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '🎨',
        summary: 'Matrix color flooding with 4-directional connected component traversal.'
      }
    ]
  }
];
