/* ==========================================================================
   Assessment Set 1: Concurrency, Coroutines & Financial Ledger Queries
   Focus: Structured concurrency, Compose stability, SavedStateHandle,
          SQLite window functions, Monotonic Deque, and Offline-First SSOT.
   ========================================================================== */


export const ASSESSMENT_SET_1 = {
  id: 'set-1',
  number: 1,
  title: 'Set 1: Concurrency, Coroutines & Financial Ledgers',
  shortTitle: 'Set 1: Concurrency & Ledgers',
  focusArea: 'Coroutines Concurrency, Compose Stability, Window Functions & Monotonic Deque',
  hackerEarthTrack: 'Data Structures > Queues & Monotonic Deque',
  hackerEarthChallenge: 'Code Monk: Monotonic Queue & Sliding Window Maximum',
  hackerEarthConcepts: ['Monotonic Deque', 'Sliding Window', 'Amortized O(1)', 'Coroutines Concurrency', 'Window Functions'],
  difficulty: 'Senior / Lead',
  durationMinutes: 60,
  badge: 'Core Senior Diagnostic',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'Core concepts including Coroutines, Jetpack Compose, Lifecycle, Flow, Hilt DI, and Memory Leaks.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'High-performance SQL queries, Window Functions, Group By / Having, Joins, and Room Schema Migrations.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'HackerEarth algorithmic challenge with sample testcases, hidden testcases, and Kotlinc JVM runner.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding challenge: Build an Offline-First Banking Account & Transaction Feed with Clean Architecture.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's1-q1-coroutines-exceptions',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Coroutines: Structured Concurrency & Failure Propagation',
      prompt: `In a banking app, an account sync operation launches two parallel child coroutines inside a scope:
<pre><code>val scope = CoroutineScope(Dispatchers.IO + Job())
scope.launch {
    launch { fetchAccountBalances() } // Throws IllegalArgumentException
    launch { fetchPendingStatements() } // In-flight network request
}</code></pre>
What is the exact runtime behavior when <code>fetchAccountBalances()</code> throws an unhandled <code>IllegalArgumentException</code>?`,
      options: [
        { id: 'opt-a', text: 'Only fetchAccountBalances() terminates. fetchPendingStatements() continues running to completion because coroutines are lightweight asynchronous threads.' },
        { id: 'opt-b', text: 'The exception cancels the parent scope and immediately cancels sibling coroutine fetchPendingStatements(), because a standard Job adheres to two-way failure propagation.' },
        { id: 'opt-c', text: 'fetchPendingStatements() will finish, but the exception is silently swallowed unless a CoroutineExceptionHandler is installed on the child launch.' },
        { id: 'opt-d', text: 'The entire Android process crashes immediately with a fatal crash before cancelling any sibling jobs.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Standard Job propagates failures upward to the parent, which cancels all other children.',
        keyConcept: 'Structured Concurrency & Job vs SupervisorJob',
        detailed: `In Kotlin Structured Concurrency, a standard <code>Job()</code> employs **bidirectional cancellation propagation**. When a child coroutine fails with an unhandled exception:
1. The child cancels itself.
2. It propagates the exception upward to its parent.
3. The parent cancels all its other children (including parallel jobs).
4. The parent re-throws or passes the exception to the thread's uncaught exception handler.

If siblings should run independently, use <code>SupervisorJob</code> or wrap the block in <code>supervisorScope { ... }</code>.`,
        realWorldPitfall: 'Using `CoroutineScope(Dispatchers.IO + SupervisorJob())` vs `supervisorScope`: inner `launch` still creates a regular child `Job` unless wrapped in `supervisorScope`.',
        correctAnswerBreakdown: 'Option B is correct. Option A describes SupervisorJob behavior, not a standard Job.'
      }
    },
    {
      id: 's1-q2-compose-recomposition',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: Stability & Skipping Recomposition',
      prompt: `Consider this Jetpack Compose item row displayed inside a banking transaction list:
<pre><code>data class Transaction(val id: String, val tags: List&lt;String&gt;)

@Composable
fun TransactionRow(txn: Transaction, onSelect: () -&gt; Unit) {
    Text(text = txn.id)
}</code></pre>
Even when <code>TransactionRow</code> recomposes, the inputs appear unchanged. Why might Compose fail to <strong>skip</strong> recomposition for this composable?`,
      options: [
        { id: 'opt-a', text: 'Compose cannot skip functions that accept lambda callbacks like onSelect.' },
        { id: 'opt-b', text: 'Standard Kotlin `List<String>` is an interface; the Compose compiler treats it as Unstable because it could be backed by a mutable implementation (e.g. ArrayList).' },
        { id: 'opt-c', text: 'Composables that render standard Text components can never be marked as skippable.' },
        { id: 'opt-d', text: 'Data classes in Kotlin are automatically marked as Non-Skippable by default.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Collections from kotlin.collections (List, Set, Map) are treated as Unstable by the Compose compiler unless using Kotlinx Immutable Collections or @Immutable/@Stable.',
        keyConcept: 'Compose Stability System (Stable vs Unstable parameters)',
        detailed: `The Compose compiler classifies every parameter as either **Stable** or **Unstable**.
- For a composable function to be **skippable**, all its parameters must be Stable.
- <code>List&lt;String&gt;</code> is an interface. At runtime, an instance could be a mutable <code>java.util.ArrayList</code>. Because Compose cannot guarantee immutability across recompositions, it marks <code>List</code> as **Unstable**.
- Any class containing a <code>List&lt;T&gt;</code> is inferred as **Unstable**, causing recomposition.

**Fix:** Annotate data class with <code>@Immutable</code> or use <code>ImmutableList</code> from kotlinx.collections.immutable.`,
        realWorldPitfall: 'Assuming Kotlin read-only `List` is immutable. Under the hood on JVM, it is just `java.util.List`.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's1-q3-process-death',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android Lifecycle: Process Death vs Configuration Change',
      prompt: `A user enters a 16-digit payment card number into an <code>EditText</code> and switches to their banking authenticator app. Due to heavy background memory pressure, the Android OS kills the app process.
When the user switches back, what component preserves the form state across this <strong>System Process Death</strong>?`,
      options: [
        { id: 'opt-a', text: 'Standard ViewModel in-memory properties, because ViewModel is scoped to the Activity lifecycle.' },
        { id: 'opt-b', text: 'SavedStateHandle injected into the ViewModel (or onSaveInstanceState Bundle), which is serialized and retained by the Android ActivityManagerService.' },
        { id: 'opt-c', text: 'Static companion object variables inside the Application class.' },
        { id: 'opt-d', text: 'Android Jetpack Navigation backstack cache, which resides in the Linux kernel shared memory.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'ViewModel only survives configuration changes; SavedStateHandle / onSaveInstanceState survives OS Process Death.',
        keyConcept: 'ViewModel Memory Lifespan vs System Process Kill',
        detailed: `When the operating system kills an app process to reclaim RAM:
- All in-memory allocations, singletons, Application objects, and standard <code>ViewModel</code> instances are completely wiped out.
- The OS retains the <code>Bundle</code> written during <code>onSaveInstanceState()</code> in system server memory (via <code>ActivityManagerService</code>).
- Android Jetpack provides <code>SavedStateHandle</code> directly into your ViewModel via constructor injection.`,
        realWorldPitfall: 'Assuming standard ViewModels survive background process death. They only survive configuration changes.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's1-q4-flow-state-vs-shared',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Flow: StateFlow vs SharedFlow for One-Time Events',
      prompt: `In an MVI/MVVM Android architecture, you need to trigger a one-time <code>ShowBiometricErrorSnackbar</code> or <code>NavigateToDashboard</code> event.
Why is <code>StateFlow</code> <strong>unsuitable</strong> for one-time events?`,
      options: [
        { id: 'opt-a', text: 'StateFlow cannot be collected on Dispatchers.Main.' },
        { id: 'opt-b', text: 'StateFlow is conflated and requires an initial value; new collectors will re-receive the last emitted event upon screen rotation or recomposition (event replay bug).' },
        { id: 'opt-c', text: 'StateFlow does not support structured concurrency.' },
        { id: 'opt-d', text: 'StateFlow throws an IllegalStateException if collected by more than one observer.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'StateFlow is conflated and always holds a current value, causing re-emission of one-time events when views re-subscribe.',
        keyConcept: 'StateFlow (Continuous State) vs Channel / SharedFlow (Discrete Events)',
        detailed: `<code>StateFlow</code> represents a state holder:
1. It always requires an initial value.
2. It is conflated (intermediate values can be dropped).
3. Any new collector immediately receives the latest value. If device rotates, snackbar/dialog triggers again!
Use <code>Channel&lt;UiEvent&gt;().receiveAsFlow()</code> or <code>SharedFlow(replay = 0)</code> for one-shot events.`,
        realWorldPitfall: 'Re-triggering payment confirmation screens on screen rotation due to StateFlow event replay.',
        correctAnswerBreakdown: 'Option B correctly identifies the event replay bug.'
      }
    },
    {
      id: 's1-q5-hilt-scoping',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Dagger / Hilt: Component Scopes & Retained Hierarchy',
      prompt: `In a modular Hilt Android banking application, what is the key lifecycle difference between:
<code>@ActivityScoped</code> and <code>@ActivityRetainedScoped</code>?`,
      options: [
        { id: 'opt-a', text: '@ActivityScoped survives configuration changes (device rotations), while @ActivityRetainedScoped is destroyed on every rotation.' },
        { id: 'opt-b', text: '@ActivityRetainedScoped survives configuration changes (similar to a ViewModel), whereas @ActivityScoped is destroyed and recreated whenever the Activity is recreated.' },
        { id: 'opt-c', text: '@ActivityRetainedScoped lives for the lifetime of the entire Application process.' },
        { id: 'opt-d', text: 'Both scopes are identical; @ActivityRetainedScoped is just an obsolete annotation alias.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '@ActivityRetainedScoped is bound to ActivityRetainedComponent and survives screen rotations like ViewModel.',
        keyConcept: 'Hilt Component Hierarchy & Lifespans',
        detailed: `Hilt structures dependencies in a hierarchy:
- <code>SingletonComponent</code>: Lives with Application.
- <code>ActivityRetainedComponent</code>: Lives across screen rotations, mirroring ViewModel.
- <code>ActivityComponent</code>: Tied to individual Activity window.`,
        realWorldPitfall: 'Injecting `@ActivityScoped` into a `ViewModel` causes compile error because a shorter-lived dependency cannot be placed into a longer-lived scope.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's1-q6-memory-leak-viewbinding',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Memory Leaks: Fragment ViewBinding & GC Root Retaining',
      prompt: `In an Android Fragment using Android ViewBinding:
<pre><code>class AccountDetailsFragment : Fragment(R.layout.fragment_account) {
    private var binding: FragmentAccountBinding? = null
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentAccountBinding.bind(view)
    }
}</code></pre>
Why does failing to set <code>binding = null</code> in <code>onDestroyView()</code> produce a critical memory leak detected by LeakCanary?`,
      options: [
        { id: 'opt-a', text: 'Because Fragments are destroyed before their View hierarchy, causing a native C++ thread hang.' },
        { id: 'opt-b', text: 'Because a Fragment instance often outlives its View hierarchy (e.g. when placed on the FragmentManager backstack); retaining the binding retains the entire View tree and Activity Context.' },
        { id: 'opt-c', text: 'ViewBinding creates an open socket connection to Android Studio Layout Inspector.' },
        { id: 'opt-d', text: 'The Android garbage collector cannot reclaim classes that implement ViewBinding.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Fragment views are destroyed when placed on the backstack, but the Fragment instance remains in memory.',
        keyConcept: 'Fragment Lifecycle vs View Lifecycle disparity',
        detailed: `When a Fragment is pushed to the backstack, its View is destroyed via <code>onDestroyView()</code>, but the Fragment instance remains cached. If <code>binding</code> is not cleared, the entire View hierarchy and Activity Context remain rooted in memory.`,
        realWorldPitfall: 'Leaking megabytes of Bitmaps through retained ViewBinding in backstack fragments.',
        correctAnswerBreakdown: 'Option B accurately explains the lifecycle difference.'
      }
    },
    {
      id: 's1-q7-room-threading',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Room Persistence: Suspend Functions & Flow Threading Model',
      prompt: `When calling a Room DAO query defined as:
<pre><code>@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions WHERE account_id = :accId")
    suspend fun getTransactions(accId: String): List&lt;TransactionEntity&gt;
}</code></pre>
Which statement regarding thread execution is correct?`,
      options: [
        { id: 'opt-a', text: 'Calling it from Dispatchers.Main will cause an immediate NetworkOnMainThreadException or IllegalStateException.' },
        { id: 'opt-b', text: 'Room automatically switches the execution off the main thread to its internal query background dispatcher; it is completely main-safe to invoke from Dispatchers.Main.' },
        { id: 'opt-c', text: 'The developer must wrap every Room suspend call with withContext(Dispatchers.IO) or the query will block UI rendering.' },
        { id: 'opt-d', text: 'Room suspend queries always run on the Android Binder IPC thread pool.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Room DAO suspend functions and Flow queries are inherently main-safe.',
        keyConcept: 'Room Architecture & Main-Safety Principle',
        detailed: `Room generates code that delegates suspend functions to Room's own background query executor. Callers can safely invoke <code>dao.getTransactions()</code> from the main thread without manual <code>withContext(Dispatchers.IO)</code>.`,
        realWorldPitfall: 'Wrapping Room suspend functions in redundant `withContext(Dispatchers.IO)` causes extra coroutine context switches.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's1-q8-workmanager-vs-fgs',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Modern Background Processing: WorkManager vs Foreground Service',
      prompt: `In an enterprise banking app, you need to sync encrypted offline transaction logs to the server once every 6 hours, even if the app is killed or the phone reboots, only when connected to an unmetered Wi-Fi network.
What is the recommended modern Android architecture component for this task?`,
      options: [
        { id: 'opt-a', text: 'WorkManager with PeriodicWorkRequestBuilder and NetworkType.UNMETERED constraint.' },
        { id: 'opt-b', text: 'A Foreground Service with a sticky notification running a continuous Thread.sleep() loop.' },
        { id: 'opt-c', text: 'AlarmManager setting an exact repeating RTC_WAKEUP alarm.' },
        { id: 'opt-d', text: 'A long-running Kotlin Coroutine started in GlobalScope.' }
      ],
      correctOptionId: 'opt-a',
      marks: 5,
      explanation: {
        summary: 'WorkManager is the standard for deferrable, guaranteed background work with hardware constraints.',
        keyConcept: 'WorkManager vs Services vs AlarmManager',
        detailed: `WorkManager handles deferrable, guaranteed work surviving reboots and app termination, with network and battery constraints. Foreground services on Android 14+ are strictly regulated for active user-facing tasks only.`,
        realWorldPitfall: 'Launching foreground services from background on Android 12+ throws `ForegroundServiceStartNotAllowedException`.',
        correctAnswerBreakdown: 'Option A is the official modern Android solution.'
      }
    },

    // DBMS Queries
    {
      id: 's1-q9-second-highest',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Find Second Highest Transaction Amount',
      prompt: `Write a standard SQL query to find the <strong>second highest transaction amount</strong> from the <code>transactions</code> table.
<br/><br/>
<strong>Requirements:</strong>
- Return a single column named <code>second_highest_amount</code>.
- If there are duplicate highest values, the query must correctly return the distinct second highest amount.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
      expectedColumns: ['second_highest_amount'],
      validationType: 'second_highest',
      sampleSolution: `SELECT MAX(amount) AS second_highest_amount
FROM transactions
WHERE amount < (SELECT MAX(amount) FROM transactions);`,
      marks: 10,
      explanation: {
        summary: 'Can be solved using a subquery with MAX, LIMIT/OFFSET with DISTINCT, or DENSE_RANK().',
        keyConcept: 'Subqueries & Duplicate-Safe Ranking',
        detailed: `Using <code>SELECT MAX(amount) FROM transactions WHERE amount &lt; (SELECT MAX(amount) FROM transactions)</code> guarantees safety against duplicate maximum values without relying on dialect-specific limits.`,
        realWorldPitfall: 'Using `LIMIT 1 OFFSET 1` without `DISTINCT` breaks when duplicate highest records exist.',
        correctAnswerBreakdown: 'Returns 2500.00 as the 2nd highest transaction amount.'
      }
    },
    {
      id: 's1-q10-running-balance',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Running Balance / Cumulative Spending per Account',
      prompt: `Write an SQL query using <strong>Window Functions</strong> to calculate the running total of debit spending for each account over time.
<br/><br/>
<strong>Requirements:</strong>
- Select <code>account_id</code>, <code>transaction_id</code>, <code>timestamp</code>, <code>amount</code>, and calculate <code>running_total</code>.
- Only consider transactions where <code>transaction_type = 'DEBIT'</code> and <code>status = 'SUCCESS'</code>.
- The running balance must be partitioned by <code>account_id</code> and ordered chronologically by <code>timestamp</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
      expectedColumns: ['account_id', 'transaction_id', 'timestamp', 'amount', 'running_total'],
      validationType: 'running_balance',
      sampleSolution: `SELECT 
    account_id,
    transaction_id,
    timestamp,
    amount,
    SUM(amount) OVER (
        PARTITION BY account_id 
        ORDER BY timestamp 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM transactions
WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
ORDER BY account_id, timestamp;`,
      marks: 10,
      explanation: {
        summary: 'Calculated using SUM() OVER (PARTITION BY account_id ORDER BY timestamp).',
        keyConcept: 'SQLite Window Functions in Android Room (API 29+)',
        detailed: `SQLite 3.25+ introduced window functions. <code>SUM(amount) OVER (PARTITION BY account_id ORDER BY timestamp)</code> computes cumulative sum in $O(N \log N)$ without expensive $O(N^2)$ self-joins.`,
        realWorldPitfall: 'Using self-joins for running totals degrades mobile query latency on large tables.',
        correctAnswerBreakdown: 'Returns accounts ACC-101 and ACC-103 with cumulative running debit totals.'
      }
    },
    {
      id: 's1-q11-high-value-segmentation',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: High-Value Customer Spending with HAVING Filter',
      prompt: `Write an SQL query to retrieve:
- <code>account_id</code>
- Total debit transactions count as <code>total_count</code>
- Total debit sum as <code>total_spent</code>
<br/>
<strong>Conditions:</strong>
- Only consider transactions where <code>transaction_type = 'DEBIT'</code> and <code>status = 'SUCCESS'</code>.
- Filter for accounts that have made <strong>more than 3 successful debit transactions</strong> AND where <code>total_spent > 1500.00</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
      expectedColumns: ['account_id', 'total_count', 'total_spent'],
      validationType: 'having_filter',
      sampleSolution: `SELECT 
    account_id,
    COUNT(*) AS total_count,
    SUM(amount) AS total_spent
FROM transactions
WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
GROUP BY account_id
HAVING COUNT(*) > 3 AND SUM(amount) > 1500.00;`,
      marks: 10,
      explanation: {
        summary: 'Requires WHERE for row filtering, GROUP BY, and HAVING for aggregate filtering.',
        keyConcept: 'WHERE vs HAVING Execution Lifecycle',
        detailed: `<code>WHERE</code> filters before grouping; <code>HAVING</code> filters after aggregation. Placing aggregates in WHERE causes a syntax error.`,
        realWorldPitfall: 'Placing `HAVING` conditions inside `WHERE`.',
        correctAnswerBreakdown: 'ACC-101 and ACC-103 qualify with > 3 debits and > 1500 spent.'
      }
    },
    {
      id: 's1-q12-composite-index',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Index Optimization & Room Database DDL',
      prompt: `Write the SQLite DDL statement to create a <strong>composite index</strong> named <code>idx_transactions_account_timestamp</code> on the <code>transactions</code> table covering:
<pre><code>SELECT * FROM transactions WHERE account_id = 'ACC-101' ORDER BY timestamp DESC LIMIT 20;</code></pre>`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
      expectedColumns: ['query_status'],
      validationType: 'index_ddl',
      sampleSolution: `CREATE INDEX idx_transactions_account_timestamp 
ON transactions(account_id, timestamp DESC);`,
      marks: 10,
      explanation: {
        summary: 'Composite B-Tree index on (account_id, timestamp DESC) allows index seek and eliminates temp sorting.',
        keyConcept: 'Compound Indexing & Leftmost Prefix Rule in SQLite',
        detailed: `A composite index on <code>(account_id, timestamp DESC)</code> lets SQLite seek directly to the matching account and scan in timestamp order without in-memory sorting.`,
        realWorldPitfall: 'Placing timestamp first in index violates the leftmost prefix rule when filtering by account_id.',
        correctAnswerBreakdown: 'CREATE INDEX idx_transactions_account_timestamp ON transactions(account_id, timestamp DESC);'
      }
    },
    {
      id: 's1-q13-unreconciled-orphans',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Detect Orphan Transactions via Anti-Join',
      prompt: `Write an SQL query using a <strong>LEFT JOIN</strong> (Anti-Join) to find all transactions whose <code>account_id</code> does not exist in the <code>accounts</code> table.`,
      schemaContext: `Tables: accounts (account_id, customer_name, branch, balance), transactions (transaction_id, account_id, amount, status)`,
      expectedColumns: ['transaction_id', 'account_id', 'amount', 'status'],
      validationType: 'orphan_antijoin',
      sampleSolution: `SELECT 
    t.transaction_id,
    t.account_id,
    t.amount,
    t.status
FROM transactions t
LEFT JOIN accounts a ON t.account_id = a.account_id
WHERE a.account_id IS NULL;`,
      marks: 10,
      explanation: {
        summary: 'LEFT JOIN with WHERE right_table.key IS NULL finds records with no matching parent.',
        keyConcept: 'SQL Anti-Join Patterns & Foreign Key Integrity',
        detailed: `An Anti-Join retains left rows that have no match on the right. <code>WHERE a.account_id IS NULL</code> filters out all matched accounts, isolating orphan records.`,
        realWorldPitfall: 'Using `NOT IN (SELECT account_id ...)` fails when the subquery contains NULL values.',
        correctAnswerBreakdown: 'TXN-911 with account ACC-999 is isolated.'
      }
    },

    // DSA Problem
    {
      id: 's1-q14-dsa-fraud-sliding-window',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: High-Frequency Transaction Fraud Alert (Sliding Window Maximum)',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Data Structures &gt; Queues &amp; Deque
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Monotonic Queue &amp; Sliding Window
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(N) Time | O(K) Space
  </span>
</div>
Given an array of integer transaction amounts <code>nums</code> and a sliding window size <code>k</code>, return an array of the maximum amounts in each sliding window from left to right in optimal <strong>O(N)</strong> time.`,
      starterCode: `import java.util.ArrayDeque

fun maxSlidingWindow(nums: IntArray, k: Int): IntArray {
    if (nums.isEmpty() || k <= 0) return IntArray(0)
    val n = nums.size
    val result = IntArray(n - k + 1)
    var resultIndex = 0

    // TODO: Implement O(N) Monotonic Queue / ArrayDeque
    return result
}

fun main() {
    val sampleInput = intArrayOf(100, 300, -100, -300, 500, 300, 600, 700)
    val k = 3
    val result = maxSlidingWindow(sampleInput, k)
    println("Window Maxima: " + result.joinToString(" "))
}`,
      solutionCode: `import java.util.ArrayDeque

fun maxSlidingWindow(nums: IntArray, k: Int): IntArray {
    if (nums.isEmpty() || k <= 0) return IntArray(0)
    val n = nums.size
    val result = IntArray(n - k + 1)
    var resultIndex = 0
    val deque = ArrayDeque<Int>()

    for (i in 0 until n) {
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst()
        }
        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
            deque.pollLast()
        }
        deque.offerLast(i)
        if (i >= k - 1) {
            result[resultIndex++] = nums[deque.peekFirst()]
        }
    }
    return result
}

fun main() {
    val nums = intArrayOf(100, 300, -100, -300, 500, 300, 600, 700)
    val k = 3
    val res = maxSlidingWindow(nums, k)
    println(res.joinToString(" "))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Standard Banking Ledger', input: 'nums = [100, 300, -100, -300, 500, 300, 600, 700], k = 3', expected: '300 300 500 500 600 700', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: Window size = 1', input: 'nums = [1, -1], k = 1', expected: '1 -1', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: Strictly Decreasing Sequence', input: 'nums = [9, 8, 7, 6, 5, 4, 3], k = 3', expected: '9 8 7 6 5', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: Window equals Array Size (k = N)', input: 'nums = [4, 2, 12, 3], k = 4', expected: '12', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Optimal O(N) time complexity achieved using a Monotonic Decreasing Deque storing array indices.',
        keyConcept: 'Monotonic Queue & Amortized O(1) Sliding Window',
        detailed: `An ArrayDeque storing indices maintains elements in decreasing order of value. When advancing the right pointer, smaller preceding elements are popped from the back, and out-of-boundary indices are popped from the front. Total operations = $2N \\implies O(N)$.`,
        realWorldPitfall: 'Storing values instead of indices prevents boundary check on duplicate numbers.',
        correctAnswerBreakdown: 'Optimal Kotlin solution processes all windows in a single linear pass.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's1-q15-android-arch-machine-coding',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Offline-First Transaction Feed',
      prompt: `Design and implement a production-ready, <strong>Offline-First Banking Transaction Feed App</strong> according to modern Android Clean Architecture guidelines (MVI/MVVM + Jetpack Compose + Room + Kotlin Flow).`,
      starterCode: `// Architecture Machine Coding Workspace
// 1. DATA LAYER (Room Entity & DAO)
// 2. REPOSITORY (Offline-First Single Source of Truth)
// 3. VIEWMODEL (StateFlow & MVI / MVVM)
// 4. JETPACK COMPOSE UI`,
      fullArchitectureCode: `package com.bank.mastery.transactions

import androidx.room.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Entity(tableName = "transactions", indices = [Index(value = ["account_id", "timestamp"])])
data class TransactionEntity(
    @PrimaryKey val transactionId: String,
    @ColumnInfo(name = "account_id") val accountId: String,
    val amount: Double,
    val type: String,
    val status: String,
    val timestamp: Long,
    val merchant: String
)

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions WHERE account_id = :accId ORDER BY timestamp DESC")
    fun observeTransactions(accId: String): Flow<List<TransactionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(transactions: List<TransactionEntity>)
}

interface TransactionRepository {
    fun getTransactionsStream(accountId: String): Flow<List<TransactionEntity>>
    suspend fun refreshTransactions(accountId: String): Result<Unit>
}

class TransactionRepositoryImpl(
    private val dao: TransactionDao,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : TransactionRepository {
    override fun getTransactionsStream(accountId: String): Flow<List<TransactionEntity>> =
        dao.observeTransactions(accountId).flowOn(dispatcher)

    override suspend fun refreshTransactions(accountId: String): Result<Unit> = withContext(dispatcher) {
        Result.success(Unit)
    }
}

sealed interface TransactionUiState {
    object Loading : TransactionUiState
    data class Success(val transactions: List<TransactionEntity>, val isRefreshing: Boolean = false) : TransactionUiState
    data class Error(val message: String) : TransactionUiState
}

class TransactionFeedViewModel(
    private val repository: TransactionRepository,
    private val accountId: String = "ACC-101"
) : ViewModel() {
    val uiState: StateFlow<TransactionUiState> = repository.getTransactionsStream(accountId)
        .map { TransactionUiState.Success(it) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), TransactionUiState.Loading)
}`,
      marks: 40,
      explanation: {
        summary: 'Production Android Clean Architecture with Offline-First Single Source of Truth (SSOT), MVI StateFlow, and Compose.',
        keyConcept: 'Offline-First Single Source of Truth & Unidirectional Data Flow',
        detailed: `Room database acts as the Single Source of Truth. The repository exposes Flow directly from Room DAO. The ViewModel transforms Room Flow into immutable StateFlow using WhileSubscribed(5000). Compose renders UI without network latency.`,
        realWorldPitfall: 'Bypassing local database cache and returning raw network response to the ViewModel.',
        correctAnswerBreakdown: 'Demonstrates Room Entity/DAO, Offline-First Repository, and StateFlow ViewModel.'
      }
    }
  ]
};
