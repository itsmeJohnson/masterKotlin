/* ==========================================================================
   Assessment Set 8: Multi-Module Clean Architecture & Binary Search
   Focus: Multi-module Gradle boundaries, Type-safe Navigation Compose,
          Correlated subqueries, and Search in Rotated Sorted Array.
   ========================================================================== */

export const ASSESSMENT_SET_8 = {
  id: 'set-8',
  number: 8,
  title: 'Set 8: Multi-Module Architecture & Binary Search',
  shortTitle: 'Set 8: Multi-Module & Search',
  focusArea: 'Multi-Module Boundaries, Type-Safe Navigation, Correlated Subqueries & Rotated Binary Search',
  hackerEarthTrack: 'Algorithms > Searching (Code Monk: Binary Search)',
  hackerEarthChallenge: 'Code Monk: Modified Binary Search in Rotated Array',
  hackerEarthConcepts: ['Modified Binary Search', 'Pivot Detection', 'Multi-Module Clean Architecture', 'Correlated Subqueries'],
  difficulty: 'Senior Mobile Engineer / Architect',
  durationMinutes: 60,
  badge: 'Modular Architecture',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'Multi-module Gradle architecture, Navigation Compose 2.8+, Variance, and Profiling.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'Correlated subqueries, self-joins, SQLite CHECK constraints, and table VACUUM.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Search in Rotated Sorted Array (Modified Binary Search in O(log N)).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Multi-Module Feature Flow with Clean Architecture and Hilt.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's8-q1-multimodule-circular-dependency',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Modular Architecture: Circular Dependency Resolution in Multi-Module Apps',
      prompt: `In a multi-module Android project:
- <code>:feature:accounts</code> needs to launch <code>:feature:transfer</code>.
- <code>:feature:transfer</code> needs to display account summary from <code>:feature:accounts</code>.
How do you prevent a circular Gradle build dependency between these two feature modules?`,
      options: [
        { id: 'opt-a', text: 'Merge both modules back into a single monolithic :app module.' },
        { id: 'opt-b', text: 'Introduce a core navigation contract module (:core:navigation) or API/Implementation split (:feature:accounts:api and :feature:transfer:api) that feature modules depend on.' },
        { id: 'opt-c', text: 'Use Java reflection to invoke Activities by string name.' },
        { id: 'opt-d', text: 'Set allowCircularDependencies = true in gradle.properties.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'API/Impl pattern or a shared :core:navigation contract module decouples feature modules.',
        keyConcept: 'Dependency Inversion in Multi-Module Android',
        detailed: `Circular dependencies break Gradle incremental builds.
By applying the **Dependency Inversion Principle**, both modules depend downward on an abstraction (e.g. <code>:core:navigation-api</code> or <code>:feature:accounts-api</code>). The <code>:app</code> module orchestrates the implementations at compile time.`,
        realWorldPitfall: 'Using hardcoded class name reflection (`Class.forName("...")`) breaks compile-time safety and obfuscation.',
        correctAnswerBreakdown: 'Option B is the industry Clean Architecture solution.'
      }
    },
    {
      id: 's8-q2-typesafe-navigation-compose',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Navigation Compose 2.8+: Type-Safe Kotlin Serialization Routes',
      prompt: `Starting in Navigation Compose 2.8+, how are routes defined type-safely without manual URL string concatenation (e.g. <code>"account/{id}"</code>)?`,
      options: [
        { id: 'opt-a', text: 'Using XML Navigation graphs with SafeArgs.' },
        { id: 'opt-b', text: 'Using @Serializable Kotlin objects and data classes directly as route destinations: navController.navigate(AccountDetails(id = "ACC-101")).' },
        { id: 'opt-c', text: 'Using Android Manifest intent-filters.' },
        { id: 'opt-d', text: 'Using static integer IDs like R.id.account_details.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Navigation 2.8+ supports @Serializable objects and data classes for type-safe route parameters.',
        keyConcept: 'Type-Safe Navigation Compose',
        detailed: `Previously, passing arguments in Compose required string parsing: <code>"details/\$id"</code> and bundle unpacking. Navigation Compose 2.8+ integrates with <code>kotlinx.serialization</code>, allowing you to pass <code>@Serializable data class Screen(val id: String)</code> with full compile-time type safety.`,
        realWorldPitfall: 'Runtime crashes due to missing or misspelled query parameter names in URL strings.',
        correctAnswerBreakdown: 'Option B is the modern Navigation Compose standard.'
      }
    },
    {
      id: 's8-q3-kotlin-generic-variance',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Language: Declaration-Site Variance (out vs in)',
      prompt: `In a banking transaction processor:
<pre><code>interface ReadOnlyLedger&lt;out T : Transaction&gt; {
    fun get(id: String): T
}</code></pre>
What does the <code>out</code> variance modifier enforce?`,
      options: [
        { id: 'opt-a', text: 'It means T can only be consumed as method arguments.' },
        { id: 'opt-b', text: 'It designates covariance: T can only be produced (returned from methods), allowing ReadOnlyLedger&lt;DebitTransaction&gt; to be safely assigned to ReadOnlyLedger&lt;Transaction&gt;.' },
        { id: 'opt-c', text: 'It marks the class for garbage collection.' },
        { id: 'opt-d', text: 'It makes T thread-safe.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'out marks covariance (producers), allowing subtype polymorphism (PECS: Producer-Extends, Consumer-Super).',
        keyConcept: 'Kotlin Declaration-Site Variance (out vs in)',
        detailed: `In Java, generics are invariant: <code>List&lt;String&gt;</code> is NOT a subtype of <code>List&lt;Object&gt;</code>.
In Kotlin, <code>out T</code> guarantees that <code>T</code> is only produced (returned), never consumed as input. This makes <code>ReadOnlyLedger&lt;DebitTransaction&gt;</code> a valid subtype of <code>ReadOnlyLedger&lt;Transaction&gt;</code>.`,
        realWorldPitfall: 'Trying to pass an `out T` type as a function parameter triggers a compile-time variance violation.',
        correctAnswerBreakdown: 'Option B accurately defines covariance.'
      }
    },
    {
      id: 's8-q4-coroutine-exception-handler-scope',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Coroutines: CoroutineExceptionHandler Placement Rules',
      prompt: `Why does installing a <code>CoroutineExceptionHandler</code> on a child coroutine launched with <code>async { ... }</code> have <strong>no effect</strong>?`,
      options: [
        { id: 'opt-a', text: 'CoroutineExceptionHandler does not work on Android.' },
        { id: 'opt-b', text: 'async encapsulates exceptions inside the returned Deferred object; the exception is re-thrown only when await() is invoked, bypassing CoroutineExceptionHandler.' },
        { id: 'opt-c', text: 'async can only throw CancellationException.' },
        { id: 'opt-d', text: 'CoroutineExceptionHandler can only be used with Dispatchers.Main.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'async deferreds encapsulate exceptions until await() is called, ignoring CoroutineExceptionHandler.',
        keyConcept: 'Exception Handling in async vs launch',
        detailed: `<code>CoroutineExceptionHandler</code> is only invoked for **uncaught root exceptions** in <code>launch</code>. With <code>async</code>, the exception is captured in the <code>Deferred</code> result. When the caller invokes <code>deferred.await()</code>, the exception is re-thrown directly at the call site.`,
        realWorldPitfall: 'Placing CoroutineExceptionHandler inside child `launch` or `async` calls instead of the root scope.',
        correctAnswerBreakdown: 'Option B accurately explains Deferred exception encapsulation.'
      }
    },
    {
      id: 's8-q5-android-profiler-allocations',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Performance Diagnostics: Android Studio Profiler Memory Allocation Tracking',
      prompt: `When investigating severe frame rate drops (jank) during list scrolling in a banking app, the Memory Profiler shows a saw-tooth allocation graph with thousands of short-lived temporary object allocations.
What is the primary cause of UI stutter here?`,
      options: [
        { id: 'opt-a', text: 'The CPU clock frequency was throttled down.' },
        { id: 'opt-b', text: 'Frequent Garbage Collection (GC pauses) triggered to reclaim temporary objects allocated inside onBindViewHolder() or Composable item render blocks.' },
        { id: 'opt-c', text: 'The screen refresh rate changed from 120Hz to 60Hz.' },
        { id: 'opt-d', text: 'The Linux kernel ran out of virtual memory.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Rapid object allocation in scroll loops causes frequent GC pauses (Stop-The-World) causing jank.',
        keyConcept: 'Memory Churn & Garbage Collection Jitter',
        detailed: `Allocating temporary objects (string builders, date formatters, new lambda instances) inside every cell render causes **Memory Churn**. The JVM heap fills up in milliseconds, triggering the Android ART Garbage Collector to pause UI threads to reclaim memory, missing the 16.6ms (60fps) or 8.3ms (120fps) frame budget.`,
        realWorldPitfall: 'Allocating `SimpleDateFormat()` inside item composables instead of remembering a static formatter.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's8-q6-custom-lint-rules',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Code Quality: Android Custom Lint Rules with UAST (Universal AST)',
      prompt: `Why do enterprise mobile banking teams write custom Android Lint checks using the <strong>UAST (Universal Abstract Syntax Tree)</strong> API?`,
      options: [
        { id: 'opt-a', text: 'To rewrite Kotlin bytecode into C++.' },
        { id: 'opt-b', text: 'To statically detect architectural violations (e.g. preventing direct SharedPreferences usage, enforcing design system components, or blocking plain HTTP) during PR builds.' },
        { id: 'opt-c', text: 'To encrypt code before compilation.' },
        { id: 'opt-d', text: 'To speed up Gradle sync.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Custom Lint rules statically enforce architecture and security policies across multi-module codebases.',
        keyConcept: 'Static Analysis & Custom Lint Rules',
        detailed: `UAST provides a unified syntax tree for both Kotlin and Java. Teams write Lint detectors (e.g. <code>IssueRegistry</code>) to flag security anti-patterns (e.g. logging PII, using <code>java.util.Date</code> instead of <code>java.time</code>) directly inside Android Studio.`,
        realWorldPitfall: 'Relying purely on code reviews to catch security violations that can be automated with Lint.',
        correctAnswerBreakdown: 'Option B accurately highlights static architectural enforcement.'
      }
    },
    {
      id: 's8-q7-r8-full-mode',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Build System: R8 Full Mode vs Compat Mode',
      prompt: `What additional aggressive optimizations does <strong>R8 Full Mode</strong> (<code>android.enableR8.fullMode=true</code>) perform compared to Compat mode?`,
      options: [
        { id: 'opt-a', text: 'It compiles the app into a web assembly bundle.' },
        { id: 'opt-b', text: 'It performs aggressive call-site inlining, class merging, and removes unused arguments/attributes, strictly enforcing ProGuard rules without assuming reflection-friendly defaults.' },
        { id: 'opt-c', text: 'It disables all code shrinking.' },
        { id: 'opt-d', text: 'It runs the compiler in parallel on all CPU cores.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'R8 full mode performs aggressive inlining and class merging, significantly reducing DEX method count.',
        keyConcept: 'R8 Full Mode Optimization',
        detailed: `While R8 Compat mode retains legacy ProGuard permissive behaviors, Full Mode inlines small methods aggressively, merges single-implementation interfaces, and strips unused generic metadata, shrinking APK size by an extra 5-10%.`,
        realWorldPitfall: 'Enabling full mode without testing can break reflection libraries that relied on default ProGuard looseness.',
        correctAnswerBreakdown: 'Option B accurately highlights aggressive compiler inlining.'
      }
    },
    {
      id: 's8-q8-dependency-inversion-principle',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Clean Architecture: Dependency Inversion Principle (DIP) in Mobile',
      prompt: `According to Uncle Bob's Clean Architecture, what direction do source code dependencies point across the Domain, Data, and Presentation layers?`,
      options: [
        { id: 'opt-a', text: 'Domain points to Data, and Data points to Presentation.' },
        { id: 'opt-b', text: 'Both Presentation and Data layers point inward toward the Domain layer; the Domain layer contains business logic and repository interfaces with ZERO external dependencies.' },
        { id: 'opt-c', text: 'All layers depend on the Android Framework SDK.' },
        { id: 'opt-d', text: 'Presentation layer points directly to the SQLite database.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Clean Architecture dependencies point inward toward Domain. Domain is pure Kotlin without Android dependencies.',
        keyConcept: 'Clean Architecture Dependency Rule',
        detailed: `The **Dependency Rule** dictates that inner circles know nothing of outer circles.
- **Domain**: Entities and UseCases (Pure Kotlin). Defines repository interfaces.
- **Data**: Implements repository interfaces using Room, Retrofit.
- **Presentation**: ViewModel and Jetpack Compose.
This ensures business logic can be unit-tested without mocks or Android emulators.`,
        realWorldPitfall: 'Importing `android.content.Context` or Room annotations inside the Domain layer violates Clean Architecture.',
        correctAnswerBreakdown: 'Option B is the core foundation of Clean Architecture.'
      }
    },

    // DBMS Section
    {
      id: 's8-q9-correlated-subquery-above-average',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Find Transactions Above Account Average (Correlated Subquery)',
      prompt: `Find all transactions whose <code>amount</code> is strictly greater than the <strong>average transaction amount for that specific account</strong>.
<br/><br/>
<strong>Return:</strong>
- <code>t1.account_id</code>, <code>t1.transaction_id</code>, <code>t1.amount</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status)`,
      expectedColumns: ['account_id', 'transaction_id', 'amount'],
      validationType: 'above_account_avg',
      sampleSolution: `SELECT 
    t1.account_id,
    t1.transaction_id,
    t1.amount
FROM transactions t1
WHERE t1.status = 'SUCCESS'
  AND t1.amount > (
      SELECT AVG(t2.amount) 
      FROM transactions t2 
      WHERE t2.account_id = t1.account_id 
        AND t2.status = 'SUCCESS'
  )
ORDER BY t1.account_id, t1.amount DESC;`,
      marks: 10,
      explanation: {
        summary: 'Correlated subquery evaluates AVG(amount) for each account row.',
        keyConcept: 'Correlated Subqueries in SQLite',
        detailed: `The inner query references <code>t1.account_id</code> from the outer query. It computes the individual account average to isolate disproportionately large transactions.`,
        realWorldPitfall: 'Comparing against global `AVG(amount)` instead of correlating per account.',
        correctAnswerBreakdown: 'Filters transactions higher than their account baseline.'
      }
    },
    {
      id: 's8-q10-sqlite-check-constraints',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: SQLite Table DDL with CHECK Constraints',
      prompt: `Write SQLite DDL to create an <code>audit_logs</code> table with:
- <code>log_id TEXT PRIMARY KEY</code>
- <code>severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))</code>
- <code>retry_count INTEGER CHECK (retry_count >= 0)</code>`,
      schemaContext: `Target: Audit logs table`,
      expectedColumns: ['query_status'],
      validationType: 'check_constraint_ddl',
      sampleSolution: `CREATE TABLE audit_logs (
    log_id TEXT PRIMARY KEY,
    severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    retry_count INTEGER CHECK (retry_count >= 0)
);`,
      marks: 10,
      explanation: {
        summary: 'CHECK constraints reject invalid domain values at the database engine level.',
        keyConcept: 'SQLite Table Integrity with CHECK Constraints',
        detailed: `Prevents invalid status strings from entering the database regardless of bugs in application code.`,
        realWorldPitfall: 'Relying purely on application-level enums without DB CHECK constraints allows corrupted database files.',
        correctAnswerBreakdown: 'CREATE TABLE audit_logs ... CHECK ...'
      }
    },
    {
      id: 's8-q11-vacuum-database',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Rebuild Database and Reclaim Space with VACUUM',
      prompt: `After deleting 100,000 old cached transaction records, what SQLite command rebuilds the entire database file to reclaim unused disk pages?`,
      schemaContext: `Database Maintenance`,
      expectedColumns: ['query_status'],
      validationType: 'vacuum_command',
      sampleSolution: `VACUUM;`,
      marks: 10,
      explanation: {
        summary: 'VACUUM rebuilds database file, defragmenting B-trees and reclaiming disk space.',
        keyConcept: 'SQLite VACUUM & Disk Defragmentation',
        detailed: `In SQLite, deleting rows leaves empty pages inside the database file (freelist). The file size on disk does not shrink. Running <code>VACUUM</code> copies content into a new contiguous file, shrinking the database size on the user's phone.`,
        realWorldPitfall: 'VACUUM requires free disk space equal to the original database file size to execute.',
        correctAnswerBreakdown: 'VACUUM;'
      }
    },
    {
      id: 's8-q12-self-join-duplicate-names',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Self-Join to Identify Matching Customer Names',
      prompt: `Write an SQL query to identify pairs of distinct accounts that share the same <code>customer_name</code> across different branches.
<br/><br/>
<strong>Return:</strong>
- <code>a1.account_id AS account_1</code>, <code>a2.account_id AS account_2</code>, <code>a1.customer_name</code>.`,
      schemaContext: `Table: accounts (account_id, customer_name, branch)`,
      expectedColumns: ['account_1', 'account_2', 'customer_name'],
      validationType: 'matching_customer_names',
      sampleSolution: `SELECT 
    a1.account_id AS account_1,
    a2.account_id AS account_2,
    a1.customer_name
FROM accounts a1
JOIN accounts a2 ON a1.customer_name = a2.customer_name 
    AND a1.account_id < a2.account_id;`,
      marks: 10,
      explanation: {
        summary: 'Self-join on customer_name with a1.account_id < a2.account_id isolates duplicate identity pairs.',
        keyConcept: 'Self-Joins for Identity Reconciliation',
        detailed: `Banks use this to merge duplicate customer profiles created at different branches.`,
        realWorldPitfall: 'Using `!=` returns both (A, B) and (B, A). `<` returns unique pairs.',
        correctAnswerBreakdown: 'Self-join with < condition.'
      }
    },
    {
      id: 's8-q13-category-pivot-counts',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Pivot Category Spending per Account',
      prompt: `Write an SQL query to display each account with two distinct columns: <code>groceries_spend</code> and <code>dining_spend</code> using conditional SUM.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>groceries_spend</code>, <code>dining_spend</code>.`,
      schemaContext: `Table: transactions (account_id, amount, merchant_category, status)`,
      expectedColumns: ['account_id', 'groceries_spend', 'dining_spend'],
      validationType: 'category_pivot_spending',
      sampleSolution: `SELECT 
    account_id,
    SUM(CASE WHEN merchant_category = 'Groceries' THEN amount ELSE 0 END) AS groceries_spend,
    SUM(CASE WHEN merchant_category = 'Dining' THEN amount ELSE 0 END) AS dining_spend
FROM transactions
WHERE status = 'SUCCESS'
GROUP BY account_id;`,
      marks: 10,
      explanation: {
        summary: 'Pivots category amounts into custom column headers per account.',
        keyConcept: 'SQL Matrix Pivoting',
        detailed: `Allows the UI to render structured category cards in a single database read.`,
        realWorldPitfall: 'Omitting status filter includes cancelled orders.',
        correctAnswerBreakdown: 'Produces clean grocery and dining totals per account.'
      }
    },

    // DSA Problem
    {
      id: 's8-q14-search-rotated-array',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Search in Rotated Ledger Index (Modified Binary Search)',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Algorithms &gt; Searching
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Modified Binary Search
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(log N) Time | O(1) Space
  </span>
</div>
There is an integer array <code>nums</code> sorted in ascending order (with distinct values) that has been rotated at an unknown pivot index.
<br/><br/>
Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not in <code>nums</code>.
<br/><br/>
You must write an algorithm with <strong>O(log N)</strong> runtime complexity.`,
      starterCode: `fun searchRotated(nums: IntArray, target: Int): Int {
    var left = 0
    var right = nums.size - 1

    // TODO: Implement O(log N) Modified Binary Search

    return -1
}

fun main() {
    val arr = intArrayOf(4, 5, 6, 7, 0, 1, 2)
    val target = 0
    println("Index: " + searchRotated(arr, target))
}`,
      solutionCode: `fun searchRotated(nums: IntArray, target: Int): Int {
    var left = 0
    var right = nums.size - 1

    while (left <= right) {
        val mid = left + (right - left) / 2
        if (nums[mid] == target) return mid

        // Check if the left half is sorted
        if (nums[left] <= nums[mid]) {
            if (target >= nums[left] && target < nums[mid]) {
                right = mid - 1 // Target lies in the left half
            } else {
                left = mid + 1  // Target lies in the right half
            }
        } else {
            // Right half must be sorted
            if (target > nums[mid] && target <= nums[right]) {
                left = mid + 1  // Target lies in the right half
            } else {
                right = mid - 1 // Target lies in the left half
            }
        }
    }

    return -1
}

fun main() {
    val arr = intArrayOf(4, 5, 6, 7, 0, 1, 2)
    println(searchRotated(arr, 0))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Target in Rotated Portion', input: 'nums = [4,5,6,7,0,1,2], target = 0', expected: '4', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: Target Not Found', input: 'nums = [4,5,6,7,0,1,2], target = 3', expected: '-1', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: Single Element Match', input: 'nums = [1], target = 1', expected: '0', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: Pivot at Center', input: 'nums = [5,1,3], target = 5', expected: '0', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'At least one half of the array is always sorted. We check which half is sorted and determine if target lies within its bounds in O(log N) time.',
        keyConcept: 'Modified Binary Search with Rotated Invariant',
        detailed: `In any rotated sorted array, dividing at <code>mid</code> guarantees that at least one half (left or right) is strictly ordered.
1. If <code>nums[left] &lt;= nums[mid]</code>, the left half is normally sorted. We check if <code>target &gt;= nums[left] &amp;&amp; target &lt; nums[mid]</code>.
2. Otherwise, the right half must be sorted.
This discards half the array on every step: $O(\log N)$ time, $O(1)$ space.`,
        realWorldPitfall: 'Using integer overflow `(left + right) / 2`: always use `left + (right - left) / 2`.',
        correctAnswerBreakdown: 'Finds target index 4 in O(log N) steps.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's8-q15-android-arch-multimodule',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Multi-Module Clean Architecture Navigation',
      prompt: `Implement a production <strong>Multi-Module Clean Architecture structure</strong> separating <code>:core:network</code>, <code>:core:database</code>, and <code>:feature:accounts</code> with Hilt dependency injection.`,
      starterCode: `// Multi-Module Architecture
// 1. :core:network (Retrofit client module)
// 2. :core:database (Room database module)
// 3. :feature:accounts (ViewModel & UI)`,
      fullArchitectureCode: `package com.bank.mastery.modular

import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

// ==========================================
// Module: :core:network
// ==========================================
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideBankApi(): BankApi = RetrofitClient.create()
}

interface BankApi

object RetrofitClient {
    fun create(): BankApi = object : BankApi {}
}

// ==========================================
// Module: :feature:accounts
// ==========================================
class AccountsRepository(private val api: BankApi)`,
      marks: 40,
      explanation: {
        summary: 'Modularizes network and database into core libraries with Hilt SingletonComponent bindings.',
        keyConcept: 'Enterprise Android Modularization',
        detailed: `Isolating core infrastructure (:core:network, :core:database) accelerates Gradle build cache hits and allows feature teams to work independently without merge conflicts.`,
        realWorldPitfall: 'Putting everything in the :app module leads to 10+ minute Gradle build times.',
        correctAnswerBreakdown: 'Full modular Hilt setup.'
      }
    }
  ]
};
