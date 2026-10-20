/* ==========================================================================
   Assessment Set 9: Concurrency Mutex, 16KB Pages & Liquidity Trapping
   Focus: Mutex vs synchronized, Android 15 16KB page sizes,
          Velocity fraud queries (3 txns in 5 mins), and Trapping Rain Water.
   ========================================================================== */

export const ASSESSMENT_SET_9 = {
  id: 'set-9',
  number: 9,
  title: 'Set 9: Concurrency Mutex, 16KB Pages & Volatility',
  shortTitle: 'Set 9: Mutex & Trapping Water',
  focusArea: 'Mutex vs Synchronized, 16KB Page Sizes, Velocity Fraud & Trapping Rain Water',
  hackerEarthTrack: 'Data Structures > Stacks & Elevation Two Pointers',
  hackerEarthChallenge: 'Code Monk: Elevation Boundaries / Trapping Rain Water',
  hackerEarthConcepts: ['Two Pointers Boundary Tracking', 'Monotonic Stack', 'Mutex Concurrency', '16KB Memory Pages'],
  difficulty: 'Senior Mobile Specialist (Concurrency & Algorithms)',
  durationMinutes: 60,
  badge: 'Advanced Concurrency',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'Mutex.withLock, Android 16KB page sizes, Sequences, Mutex deadlocks, and Room TypeConverters.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'Velocity fraud detection (3 in 5m), median transaction amount, SAVEPOINT rollbacks, and GROUP_CONCAT.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Trapping Rain Water / Maximum Reserve Capacity (Two Pointers in O(N)).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Dynamic Multi-Step KYC & Payment Form with MVI State and Validation.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's9-q1-mutex-vs-synchronized',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Concurrency: Mutex.withLock vs Java synchronized block',
      prompt: `Why is using Java's <code>synchronized(lock) { ... }</code> inside a suspending function dangerous, and why should <code>kotlinx.coroutines.sync.Mutex</code> be used instead?`,
      options: [
        { id: 'opt-a', text: 'synchronized blocks cannot run on 64-bit Android devices.' },
        { id: 'opt-b', text: 'synchronized blocks the underlying OS worker thread; if a coroutine suspends inside a synchronized block, the thread cannot be repurposed, causing thread starvation and potential deadlocks. Mutex.withLock suspends cooperatively without blocking threads.' },
        { id: 'opt-c', text: 'Mutex runs on the Android GPU.' },
        { id: 'opt-d', text: 'The Kotlin compiler converts Mutex into an atomic integer.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'synchronized blocks the underlying OS thread, whereas Mutex suspends the coroutine cooperatively.',
        keyConcept: 'Non-Blocking Mutex vs Thread-Blocking Locks',
        detailed: `In Kotlin Coroutines, threads are a shared resource. When a coroutine reaches a suspension point inside a Java <code>synchronized</code> block, it holds the lock while blocking the OS thread from executing other coroutines, rapidly exhausting thread pools. <code>Mutex.withLock</code> suspends the coroutine while releasing the thread back to the pool.`,
        realWorldPitfall: 'Using synchronized around network or database calls in coroutines causes thread pool lockup.',
        correctAnswerBreakdown: 'Option B accurately explains cooperative suspension vs thread blocking.'
      }
    },
    {
      id: 's9-q2-android-16kb-pages',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android 15 Architecture: 16 KB Memory Page Size Support',
      prompt: `Android 15 introduces support for devices configured with <strong>16 KB page sizes</strong> (up from traditional 4 KB). What is the primary impact on Android applications with native C++ dependencies (NDK)?`,
      options: [
        { id: 'opt-a', text: 'All Kotlin code must be rewritten into Java.' },
        { id: 'opt-b', text: 'Native shared libraries (.so files) must be re-compiled and aligned to 16 KB boundaries using -Wl,-z,max-page-size=16384, or they will fail to load with a dlopen() crash on 16 KB devices.' },
        { id: 'opt-c', text: 'Database files will be 4x larger.' },
        { id: 'opt-d', text: 'Screen resolution is locked to 16000 pixels.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Native C++ .so shared libraries must be built with 16KB ELF alignment to run on Android 15+ 16KB kernels.',
        keyConcept: 'Android 15 16 KB Page Alignment',
        detailed: `Devices with 16 KB page sizes provide 5-10% performance and power improvements. However, native libraries compiled with default 4 KB ELF segment alignment fail kernel memory mapping. Banking SDKs (biometrics, cryptography, fraud engines) must be recompiled with 16 KB alignment.`,
        realWorldPitfall: 'Third-party banking security SDKs compiled with 4KB alignment will crash on Android 15.',
        correctAnswerBreakdown: 'Option B accurately identifies the ELF 16KB alignment requirement.'
      }
    },
    {
      id: 's9-q3-kotlin-sequences-vs-collections',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Performance: Kotlin Sequences (asSequence) vs Collections',
      prompt: `When processing a list of 100,000 banking ledger entries:
<pre><code>val result = entries.asSequence()
    .filter { it.amount > 100 }
    .map { it.amount * 1.2 }
    .take(10)
    .toList()</code></pre>
Why is <code>asSequence()</code> substantially faster and memory-efficient here?`,
      options: [
        { id: 'opt-a', text: 'It runs the operations on a multi-core background thread.' },
        { id: 'opt-b', text: 'Sequences evaluate lazily element-by-element (vertical evaluation) and short-circuit after finding 10 items, avoiding allocating intermediate 100k-item lists in memory.' },
        { id: 'opt-c', text: 'It skips garbage collection.' },
        { id: 'opt-d', text: 'It compiles to native assembly.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Sequences evaluate element-by-element and short-circuit on terminal operations, avoiding intermediate allocations.',
        keyConcept: 'Lazy Sequences vs Eager Collection Chaining',
        detailed: `Standard collection chaining (<code>list.filter().map()</code>) eagerly creates a new temporary <code>ArrayList</code> on heap at each transformation step.
<code>asSequence()</code> evaluates element-by-element: as soon as <code>take(10)</code> satisfies 10 elements, iteration stops immediately, ignoring the remaining 99,990 items!`,
        realWorldPitfall: 'Using sequences for very small collections (< 50 items): the state-machine iterator overhead outweighs collection allocation.',
        correctAnswerBreakdown: 'Option B accurately describes lazy evaluation and short-circuiting.'
      }
    },
    {
      id: 's9-q4-room-typeconverter-pitfall',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Room Persistence: @TypeConverter & Complex Data Serialization',
      prompt: `A developer converts a list of strings into a single SQLite column:
<pre><code>@TypeConverter
fun fromList(list: List&lt;String&gt;): String = list.joinToString(",")</code></pre>
What critical bug will occur if any individual string in the list contains a comma (e.g. <code>"London, UK"</code>)?`,
      options: [
        { id: 'opt-a', text: 'SQLite throws a syntax error on INSERT.' },
        { id: 'opt-b', text: 'Deserializing with split(",") splits the element into two separate invalid elements, corrupting data integrity.' },
        { id: 'opt-c', text: 'The database file is deleted.' },
        { id: 'opt-d', text: 'Kotlin compiler fails to build.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Naive delimiter splitting corrupts data when elements contain the delimiter. Use JSON serialization instead.',
        keyConcept: 'Room TypeConverter Data Integrity',
        detailed: `Using <code>joinToString(",")</code> fails as soon as a user enters a comma. The standard enterprise solution is to use <code>kotlinx.serialization</code> or Gson/Moshi inside the <code>@TypeConverter</code> to store proper JSON strings.`,
        realWorldPitfall: 'Using ad-hoc string delimiters in TypeConverters.',
        correctAnswerBreakdown: 'Option B accurately explains the data corruption bug.'
      }
    },
    {
      id: 's9-q5-viewmodel-init-side-effects',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Architecture: Launching Coroutines in ViewModel init {} Blocks',
      prompt: `Why is launching heavy network calls directly inside <code>init { viewModelScope.launch { ... } }</code> considered problematic for unit testing?`,
      options: [
        { id: 'opt-a', text: 'init blocks cannot access viewModelScope.' },
        { id: 'opt-b', text: 'The network call starts automatically upon test instantiation before test dispatchers, mocks, or assertions can be configured, leading to flaky race conditions.' },
        { id: 'opt-c', text: 'init blocks execute on the GPU.' },
        { id: 'opt-d', text: 'It creates a memory leak.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Eager init block coroutines execute before test fixtures or mocks can be fully wired.',
        keyConcept: 'ViewModel Initialization Best Practices',
        detailed: `Starting asynchronous jobs in <code>init {}</code> couples instantiation with execution. In unit tests, constructing <code>MyViewModel(mockRepo)</code> immediately fires the coroutine, often racing against test assertions. Exposing an explicit <code>loadData()</code> or using reactive <code>stateIn()</code> pipelines is cleaner.`,
        realWorldPitfall: 'Flaky unit tests that pass or fail randomly based on thread scheduling.',
        correctAnswerBreakdown: 'Option B describes test instantiation race conditions.'
      }
    },
    {
      id: 's9-q6-compose-recomposition-loop',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: Recomposition Loop Infinite Crashes',
      prompt: `What causes an app crash with: <code>Recomposition limit exceeded (infinite loop)</code> in Jetpack Compose?`,
      options: [
        { id: 'opt-a', text: 'Calling Log.d() inside a Composable.' },
        { id: 'opt-b', text: 'Mutating a MutableState directly inside the Composable body during the Composition phase without remember or side-effect wrappers.' },
        { id: 'opt-c', text: 'Using LazyColumn with more than 100 items.' },
        { id: 'opt-d', text: 'Rendering images in dark theme.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Mutating state directly during composition triggers immediate recomposition, creating an infinite loop.',
        keyConcept: 'Compose Recomposition Loop Anti-Pattern',
        detailed: `If a composable executes <code>state.value = newValue</code> directly during its execution, Compose detects that state changed and immediately invalidates the composable, triggering it to run again, which mutates state again, infinitely! State mutations must occur in event callbacks or side-effects.`,
        realWorldPitfall: 'Updating ViewModel state directly inside the rendering block of a composable.',
        correctAnswerBreakdown: 'Option B is the precise cause of recomposition loops.'
      }
    },
    {
      id: 's9-q7-fgs-data-sync-android14',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android 14+ (API 34): Foreground Service Types & Timeouts',
      prompt: `Starting in Android 14, if an app declares a Foreground Service with <code>foregroundServiceType="dataSync"</code>, what strict runtime constraint does the OS enforce?`,
      options: [
        { id: 'opt-a', text: 'It can only run when connected to Bluetooth.' },
        { id: 'opt-b', text: 'The OS enforces a cumulative execution timeout (approx 6 hours within a 24-hour window); exceeding it crashes the service with an exception.' },
        { id: 'opt-c', text: 'It cannot make HTTPS requests.' },
        { id: 'opt-d', text: 'It can only run in airplane mode.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'dataSync foreground services have a 6-hour cumulative quota in 24 hours on Android 14+.',
        keyConcept: 'Android 14 Foreground Service Quotas',
        detailed: `Google added strict enforcement to prevent apps abusing foreground services as continuous background daemons. <code>dataSync</code> services have a 6-hour daily limit. For recurring background sync, Google mandates using <code>WorkManager</code>.`,
        realWorldPitfall: 'Using long-running foreground services for background database sync.',
        correctAnswerBreakdown: 'Option B accurately identifies the dataSync timeout policy.'
      }
    },
    {
      id: 's9-q8-flow-flatmaplatest-concurrency',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Reactive Architecture: flatMapLatest vs flatMapConcat vs flatMapMerge',
      prompt: `When transforming a stream of customer account selection events into transaction detail streams, which Flow operator cancels the previous in-flight transaction fetch as soon as a new account is selected?`,
      options: [
        { id: 'opt-a', text: 'flatMapConcat' },
        { id: 'opt-b', text: 'flatMapMerge' },
        { id: 'opt-c', text: 'flatMapLatest' },
        { id: 'opt-d', text: 'zip' }
      ],
      correctOptionId: 'opt-c',
      marks: 5,
      explanation: {
        summary: 'flatMapLatest cancels upstream transforms upon new emissions.',
        keyConcept: 'Flow Transformation Concurrency',
        detailed: `- <code>flatMapConcat</code>: Waits for previous flow to complete sequentially.
- <code>flatMapMerge</code>: Collects all flows concurrently.
- <code>flatMapLatest</code>: Automatically cancels the previous coroutine when a new emission arrives, preventing stale data races.`,
        realWorldPitfall: 'Using flatMapMerge can lead to race conditions where older requests complete after newer ones.',
        correctAnswerBreakdown: 'Option C is correct.'
      }
    },

    // DBMS Section
    {
      id: 's9-q9-velocity-fraud-window',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Detect Velocity Fraud (3 Transactions within 5 Minutes)',
      prompt: `Write an SQL query using <code>COUNT(*) OVER</code> to detect accounts where <strong>3 or more transactions occurred within a 5-minute rolling window</strong>.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>transaction_id</code>, <code>timestamp</code>, and <code>recent_txn_count</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['account_id', 'transaction_id', 'timestamp', 'recent_txn_count'],
      validationType: 'velocity_fraud',
      sampleSolution: `WITH VelocityMetrics AS (
    SELECT 
        account_id,
        transaction_id,
        timestamp,
        COUNT(*) OVER (
            PARTITION BY account_id 
            ORDER BY strftime('%s', timestamp) 
            RANGE BETWEEN 300 PRECEDING AND CURRENT ROW
        ) AS recent_txn_count
    FROM transactions
)
SELECT account_id, transaction_id, timestamp, recent_txn_count
FROM VelocityMetrics
WHERE recent_txn_count >= 2;`,
      marks: 10,
      explanation: {
        summary: 'RANGE BETWEEN 300 PRECEDING AND CURRENT ROW computes rolling 5-minute transaction density.',
        keyConcept: 'Time-Based RANGE Windows for Velocity Fraud',
        detailed: `Using <code>RANGE</code> over epoch seconds allows precise time-interval evaluation (300 seconds = 5 minutes). When transaction density spikes, fraud alerts are triggered.`,
        realWorldPitfall: 'Using ROWS instead of RANGE: ROWS counts row numbers, not time duration!',
        correctAnswerBreakdown: 'Detects velocity spikes.'
      }
    },
    {
      id: 's9-q10-group-concat-merchants',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Aggregate Merchants with GROUP_CONCAT()',
      prompt: `Write an SQL query to aggregate distinct merchant categories for each account into a comma-separated string named <code>category_list</code>.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>category_list</code>.`,
      schemaContext: `Table: transactions (account_id, merchant_category)`,
      expectedColumns: ['account_id', 'category_list'],
      validationType: 'group_concat_merchants',
      sampleSolution: `SELECT 
    account_id,
    GROUP_CONCAT(DISTINCT merchant_category) AS category_list
FROM transactions
GROUP BY account_id;`,
      marks: 10,
      explanation: {
        summary: 'GROUP_CONCAT(DISTINCT col) collapses grouped string values into a single text column.',
        keyConcept: 'SQLite GROUP_CONCAT Function',
        detailed: `Useful for generating summary tags and category chips on account overview cards.`,
        realWorldPitfall: 'Omitting DISTINCT results in duplicate repetitive category names.',
        correctAnswerBreakdown: 'Produces clean comma-separated lists.'
      }
    },
    {
      id: 's9-q11-sqlite-savepoint',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Partial Transaction Rollback with SAVEPOINT',
      prompt: `Write the SQLite command to rollback a nested transaction to a named savepoint: <code>step_verified</code>.`,
      schemaContext: `Transaction Control`,
      expectedColumns: ['query_status'],
      validationType: 'savepoint_rollback',
      sampleSolution: `ROLLBACK TO SAVEPOINT step_verified;`,
      marks: 10,
      explanation: {
        summary: 'ROLLBACK TO SAVEPOINT rolls back only operations executed after the savepoint without aborting outer transaction.',
        keyConcept: 'SQLite Nested Transactions & Savepoints',
        detailed: `Savepoints allow partial rollbacks in complex multi-step banking operations (e.g. roll back reward point deduction if inventory check fails, while keeping user payment intact).`,
        realWorldPitfall: 'Using standard ROLLBACK aborts the entire transaction stack.',
        correctAnswerBreakdown: 'ROLLBACK TO SAVEPOINT step_verified;'
      }
    },
    {
      id: 's9-q12-intersect-audit-accounts',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Set Intersection between Branch and Transactions',
      prompt: `Write an SQL query using <strong>INTERSECT</strong> to find all <code>account_id</code>s that belong to <code>'London Canary Wharf'</code> branch AND have also made at least one transaction.`,
      schemaContext: `Tables: accounts (account_id, branch), transactions (account_id)`,
      expectedColumns: ['account_id'],
      validationType: 'intersect_query',
      sampleSolution: `SELECT account_id FROM accounts WHERE branch = 'London Canary Wharf'
INTERSECT
SELECT account_id FROM transactions;`,
      marks: 10,
      explanation: {
        summary: 'INTERSECT returns common distinct rows present in both queries.',
        keyConcept: 'SQL Set Operations (INTERSECT vs EXCEPT)',
        detailed: `Combines two result sets, keeping only records present in both.`,
        realWorldPitfall: 'INTERSECT requires identical column schemas in both SELECT statements.',
        correctAnswerBreakdown: 'Returns ACC-101.'
      }
    },
    {
      id: 's9-q13-branch-median-balance',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Find Second Largest Account Balance in Canary Wharf',
      prompt: `Write an SQL query to retrieve the second highest account balance in <code>'London Canary Wharf'</code> branch using <code>LIMIT 1 OFFSET 1</code>.
<br/><br/>
<strong>Return:</strong>
- <code>customer_name</code>, <code>balance</code>.`,
      schemaContext: `Table: accounts (customer_name, branch, balance)`,
      expectedColumns: ['customer_name', 'balance'],
      validationType: 'second_canary_wharf',
      sampleSolution: `SELECT customer_name, balance
FROM accounts
WHERE branch = 'London Canary Wharf'
ORDER BY balance DESC
LIMIT 1 OFFSET 1;`,
      marks: 10,
      explanation: {
        summary: 'Filters by branch, orders by balance descending, and offsets by 1.',
        keyConcept: 'Branch-Specific Ranking',
        detailed: `Quickly accesses secondary tier customer in Canary Wharf.`,
        realWorldPitfall: 'Missing branch filter ranks across entire bank.',
        correctAnswerBreakdown: 'Sophia Patel returned with 14,250.00.'
      }
    },

    // DSA Problem
    {
      id: 's9-q14-trapping-rain-water',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Trapping Rain Water (Two Pointers Elevation Depth)',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Data Structures &gt; Stacks &amp; Arrays
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Elevation Boundaries &amp; Two Pointers
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(N) Time | O(1) Space
  </span>
</div>
Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining in optimal <strong>O(N)</strong> time and <strong>O(1)</strong> space.`,
      starterCode: `fun trap(height: IntArray): Int {
    if (height.isEmpty()) return 0
    var left = 0
    var right = height.size - 1

    // TODO: Implement O(N) Two-Pointer water trapping with O(1) space

    return 0
}

fun main() {
    val arr = intArrayOf(0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1)
    println("Trapped Water: " + trap(arr))
}`,
      solutionCode: `fun trap(height: IntArray): Int {
    if (height.isEmpty()) return 0
    var left = 0
    var right = height.size - 1
    var leftMax = 0
    var rightMax = 0
    var waterTrapped = 0

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left]
            } else {
                waterTrapped += leftMax - height[left]
            }
            left++
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right]
            } else {
                waterTrapped += rightMax - height[right]
            }
            right--
        }
    }

    return waterTrapped
}

fun main() {
    val arr = intArrayOf(0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1)
    println(trap(arr))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Standard Elevation Map', input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: Bowl Shape', input: '[4,2,0,3,2,5]', expected: '9', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: Strictly Increasing (No Trapped Water)', input: '[1,2,3,4,5]', expected: '0', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: Strictly Decreasing', input: '[5,4,3,2,1]', expected: '0', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Converging Two Pointers with leftMax and rightMax bounds computes trapped water in O(N) time and O(1) space.',
        keyConcept: 'Two-Pointer Water Invariant',
        detailed: `The water trapped above index $i$ depends on $\\min(\\text{leftMax}, \\text{rightMax}) - \\text{height}[i]$.
By comparing <code>height[left] &lt; height[right]</code>, we know that <code>leftMax</code> is the limiting bound on the left, so we can compute water trapped at <code>left</code> immediately without scanning the entire right side. Time is $O(N)$, space is $O(1)$.`,
        realWorldPitfall: 'Using two prefix arrays: while $O(N)$ time, it requires $O(N)$ extra memory allocations.',
        correctAnswerBreakdown: 'Calculates 6 units of trapped water.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's9-q15-android-arch-dynamic-form',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Multi-Step KYC & Payment Form with Validation',
      prompt: `Implement a <strong>Dynamic Multi-Step KYC & Payment Verification Form</strong> in Jetpack Compose, validating sort code, account number, and amount with live error messaging and MVI state.`,
      starterCode: `// Dynamic KYC Form
// 1. FORM STATE (sortCode, accountNumber, amount, errors)
// 2. VIEWMODEL (validateField, onEvent, submitPayment)
// 3. COMPOSE UI (OutlinedTextField with isError)`,
      fullArchitectureCode: `package com.bank.mastery.form

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.*
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*

data class FormState(
    val sortCode: String = "",
    val accountNumber: String = "",
    val amount: String = "",
    val sortCodeError: String? = null,
    val accountError: String? = null,
    val isValid: Boolean = false
)

class PaymentFormViewModel : ViewModel() {
    private val _formState = MutableStateFlow(FormState())
    val formState: StateFlow<FormState> = _formState.asStateFlow()

    fun onSortCodeChanged(code: String) {
        val error = if (code.length != 6) "Sort code must be 6 digits" else null
        _formState.update { it.copy(sortCode = code, sortCodeError = error) }
        checkValidity()
    }

    private fun checkValidity() {
        val s = _formState.value
        val valid = s.sortCode.length == 6 && s.sortCodeError == null
        _formState.update { it.copy(isValid = valid) }
    }
}`,
      marks: 40,
      explanation: {
        summary: 'Manages multi-field form validation using StateFlow.update and unidirectional data flow in Compose.',
        keyConcept: 'MVI Form State Validation',
        detailed: `Validates fields on input change and surfaces errors via Compose OutlinedTextField.`,
        realWorldPitfall: 'Performing blocking network calls inside text change listeners.',
        correctAnswerBreakdown: 'Full reactive form validation.'
      }
    }
  ]
};
