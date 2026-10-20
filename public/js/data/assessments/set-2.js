/* ==========================================================================
   Assessment Set 2: Memory Profiling, Leaks & Subquery Ranking
   Focus: LeakCanary GC roots, Bitmap inSampleSize, suspendCancellableCoroutine,
          derivedStateOf vs remember, ROW_NUMBER() ranking, and Two Pointers.
   ========================================================================== */

export const ASSESSMENT_SET_2 = {
  id: 'set-2',
  number: 2,
  title: 'Set 2: Memory Profiling, Leaks & Ranking Queries',
  shortTitle: 'Set 2: Memory & Ranking',
  focusArea: 'Memory Optimization, LeakCanary, derivedStateOf, Window Ranking & Two Pointers',
  hackerEarthTrack: 'Algorithms > Searching & Two Pointers',
  hackerEarthChallenge: 'Code Monk: Searching & In-Place Two Pointers',
  hackerEarthConcepts: ['Two Pointers', 'Sorted Arrays', 'In-place Pointers', 'Memory Leaks', 'ROW_NUMBER Ranking'],
  difficulty: 'Senior Mobile Engineer',
  durationMinutes: 60,
  badge: 'Memory & Performance',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'GC roots, Bitmaps, Cancellable Coroutines, derivedStateOf, and Inline Value Classes.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'ROW_NUMBER ranking, Date strftime aggregations, NOT EXISTS subqueries, and Partial Indexes.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Two Pointers target matching on sorted banking transactions (O(N) time, O(1) space).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Build a Memory-Safe Infinite Image & Receipt Gallery with Coroutines.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's2-q1-leakcanary-gc-root',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Memory Leaks: Static Handlers & GC Root Reference Chains',
      prompt: `A banking developer implements an idle auto-logout countdown timer inside an Activity:
<pre><code>class HomeActivity : AppCompatActivity() {
    private val handler = Handler(Looper.getMainLooper())
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handler.postDelayed({ performAutoLogout() }, 15 * 60 * 1000)
    }
}</code></pre>
If the user navigates away and presses the Back button immediately, what is the exact cause of the memory leak reported by LeakCanary?`,
      options: [
        { id: 'opt-a', text: 'The Handler class creates an open native Linux file descriptor that the OS cannot close.' },
        { id: 'opt-b', text: 'The anonymous Runnable lambda holds an implicit reference to HomeActivity. The Runnable is queued inside MessageQueue on the Main Looper thread, which is a GC Root.' },
        { id: 'opt-c', text: 'Looper.getMainLooper() allocates thread-local memory that exceeds the Android heap limit.' },
        { id: 'opt-d', text: 'Android Garbage Collector stops running whenever Handler.postDelayed is called.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Delayed messages in the main Looper MessageQueue act as GC roots retaining the Runnable and its outer Activity.',
        keyConcept: 'Garbage Collection Roots & Handler Memory Leaks',
        detailed: `In Android, the main Looper thread is active for the entire application lifespan and is a **GC Root**.
- When you call <code>handler.postDelayed(runnable, delay)</code>, the <code>Message</code> and <code>Runnable</code> are stored in the main thread's <code>MessageQueue</code>.
- Non-static inner classes and lambdas hold an implicit outer reference to <code>HomeActivity</code>.
- Until the 15 minutes elapse or <code>handler.removeCallbacksAndMessages(null)</code> is invoked, the entire Activity, its Views, and Bitmap drawables cannot be garbage-collected!`,
        realWorldPitfall: 'Failing to cancel delayed Handlers or coroutine timers in `onDestroy()`.',
        correctAnswerBreakdown: 'Option B accurately identifies the MessageQueue GC Root chain.'
      }
    },
    {
      id: 's2-q2-bitmap-injustdecodebounds',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Bitmap Memory Optimization: Subsampling & inJustDecodeBounds',
      prompt: `When decoding user-uploaded cheque photos (4032 x 3024 pixels, ~48MB uncompressed in ARGB_8888) to display in a 200x200 thumbnail view, how do you prevent an <code>OutOfMemoryError</code> (OOM)?`,
      options: [
        { id: 'opt-a', text: 'Call Bitmap.compress() before calling BitmapFactory.decodeStream().' },
        { id: 'opt-b', text: 'Set BitmapFactory.Options.inJustDecodeBounds = true to read dimensions without allocating pixel memory, calculate inSampleSize, and decode with subsampling.' },
        { id: 'opt-c', text: 'Wrap the decode call in a try-catch block and catch OutOfMemoryError.' },
        { id: 'opt-d', text: 'Increase the app heap size by setting android:largeHeap="true" in AndroidManifest.xml.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'inJustDecodeBounds queries dimensions without pixel allocation, enabling power-of-two inSampleSize downsampling.',
        keyConcept: 'Efficient Bitmap Decoding in Android',
        detailed: `Decoding an image directly allocates <code>width * height * 4 bytes</code> in RAM. Setting <code>inJustDecodeBounds = true</code> reads image headers (<code>outWidth</code>, <code>outHeight</code>) without pixel buffer allocation. You then compute <code>inSampleSize</code> (e.g. 4 or 8) and decode the downsampled image, reducing memory by $16\\times$ or $64\\times$.`,
        realWorldPitfall: 'Catching `OutOfMemoryError`: Once the JVM runs out of heap, subsequent allocations fail anyway.',
        correctAnswerBreakdown: 'Option B is the official Android recommended pattern.'
      }
    },
    {
      id: 's2-q3-suspendcancellablecoroutine',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Coroutines: Bridging Callback APIs with suspendCancellableCoroutine',
      prompt: `When wrapping an asynchronous callback-based SDK (e.g. Google Pay or Biometric hardware sensor) into a Kotlin suspend function, why should you use <code>suspendCancellableCoroutine</code> instead of <code>suspendCoroutine</code>?`,
      options: [
        { id: 'opt-a', text: 'suspendCancellableCoroutine runs on Dispatchers.IO by default while suspendCoroutine runs on Main.' },
        { id: 'opt-b', text: 'suspendCancellableCoroutine provides continuation.invokeOnCancellation { ... } to unregister listeners, cancel hardware sensors, and clean up resources when the caller coroutine is cancelled.' },
        { id: 'opt-c', text: 'suspendCoroutine cannot return nullable types.' },
        { id: 'opt-d', text: 'suspendCancellableCoroutine catches and ignores all runtime exceptions automatically.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'suspendCancellableCoroutine supports cooperative cancellation via invokeOnCancellation.',
        keyConcept: 'Cooperative Cancellation & Resource Cleanup',
        detailed: `If a caller cancels their coroutine (e.g. screen navigation), a standard <code>suspendCoroutine</code> will ignore cancellation and keep waiting. <code>suspendCancellableCoroutine</code> creates a <code>CancellableContinuation</code>, allowing you to attach <code>invokeOnCancellation</code> to tear down listeners, release camera/biometric locks, and abort network sockets.`,
        realWorldPitfall: 'Leaking hardware sensors or network listeners when a coroutine job is cancelled before callback completes.',
        correctAnswerBreakdown: 'Option B correctly explains cancellation hooks.'
      }
    },
    {
      id: 's2-q4-derived-state-of',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: derivedStateOf vs remember(keys)',
      prompt: `In a banking transaction feed with a "Scroll to Top" button:
<pre><code>val listState = rememberLazyListState()
val showScrollToTop = remember { derivedStateOf { listState.firstVisibleItemIndex > 0 } }</code></pre>
Why is <code>derivedStateOf</code> necessary here instead of <code>val showScrollToTop = remember(listState.firstVisibleItemIndex) { listState.firstVisibleItemIndex > 0 }</code>?`,
      options: [
        { id: 'opt-a', text: 'remember cannot accept parameters of type Int.' },
        { id: 'opt-b', text: 'listState.firstVisibleItemIndex changes on every single pixel scroll; using remember(key) would trigger full composable recomposition on every scroll change, whereas derivedStateOf only triggers recomposition when the boolean result flips.' },
        { id: 'opt-c', text: 'derivedStateOf runs the calculation on a background thread.' },
        { id: 'opt-d', text: 'LazyColumn crashes if listState is passed as a key to remember.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'derivedStateOf buffers high-frequency state updates and only recomposes when the derived output changes.',
        keyConcept: 'Reducing Compose Recomposition Frequency with derivedStateOf',
        detailed: `<code>listState.firstVisibleItemIndex</code> updates frequently during user scrolling.
- If you use <code>remember(listState.firstVisibleItemIndex)</code>, the enclosing composable recomposes on **every index increment** (1, 2, 3, 4...).
- With <code>derivedStateOf</code>, Compose monitors the inner read, but only triggers recomposition when the resulting boolean changes from <code>false</code> to <code>true</code> or vice versa.`,
        realWorldPitfall: 'Using `derivedStateOf` for simple static math calculations where inputs rarely change; it has overhead and should only be used when inputs change more frequently than outputs.',
        correctAnswerBreakdown: 'Option B accurately highlights recomposition frequency optimization.'
      }
    },
    {
      id: 's2-q5-lateinit-vs-lazy',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Core: lateinit var vs by lazy Initialization & Thread Safety',
      prompt: `In an Android banking codebase, you need to initialize dependencies. Which statement correctly differentiates <code>lateinit var</code> and <code>by lazy { ... }</code>?`,
      options: [
        { id: 'opt-a', text: 'lateinit can only be used with immutable val properties and primitive types like Int and Double.' },
        { id: 'opt-b', text: 'lateinit is used with mutable var and cannot be used with primitive types; by lazy is used with read-only val, is thread-safe by default (SYNCHRONIZED), and initializes the variable upon first access.' },
        { id: 'opt-c', text: 'by lazy creates a new instance on every property access.' },
        { id: 'opt-d', text: 'lateinit properties are automatically initialized to null by the JVM compiler.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'lateinit is for mutable non-primitive vars initialized before use; lazy is for read-only vals computed on first access with thread-safety.',
        keyConcept: 'Kotlin Property Initialization: lateinit vs by lazy',
        detailed: `Key differences tested in banking interviews:
1. <strong>lateinit var</strong>: Used with mutable <code>var</code> for dependency injection (e.g. Dagger/Hilt fields in Android Activities). Cannot be used on primitive types (Int, Boolean) because it relies on nullability checks (throws <code>UninitializedPropertyAccessException</code>). Not thread-safe by default.
2. <strong>by lazy { ... }</strong>: Used strictly with read-only <code>val</code>. Computes the value once upon first read and caches it. Uses <code>LazyThreadSafetyMode.SYNCHRONIZED</code> by default, ensuring thread-safe singleton initialization.`,
        realWorldPitfall: 'Using `lateinit` on a multithreaded background worker without synchronization can lead to race conditions.',
        correctAnswerBreakdown: 'Option B accurately distinguishes mutability, primitive support, and thread safety.'
      }
    },
    {
      id: 's2-q6-inheritance-vs-composition',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'OOPs Fundamentals: Inheritance vs Composition (Favor Composition over Inheritance)',
      prompt: `Why does modern enterprise Android architecture strongly favor <strong>Composition over Inheritance</strong> (e.g., using interface delegation or injecting UseCases instead of creating deep <code>BaseActivity</code> / <code>BaseViewModel</code> hierarchies)?`,
      options: [
        { id: 'opt-a', text: 'Inheritance is not supported by the Kotlin compiler on Android.' },
        { id: 'opt-b', text: 'Deep inheritance creates tight coupling (Fragile Base Class problem): changes to base classes unintentionally affect all subclasses, whereas composition enables flexible, modular, and easily unit-testable components.' },
        { id: 'opt-c', text: 'Composition compiles into C++ machine code while inheritance runs in an interpreted VM.' },
        { id: 'opt-d', text: 'Inheritance causes OutOfMemoryError on devices with less than 4GB RAM.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Composition decouples components, prevents fragile base class hierarchy bugs, and simplifies isolated unit testing.',
        keyConcept: 'OOPs Design Principle: Favor Composition over Inheritance',
        detailed: `In enterprise mobile development:
- <strong>Inheritance (is-a)</strong> binds subclasses tightly to parent implementation details. Over time, <code>BaseViewModel</code> accumulates analytics, navigation, error dialogs, and logging, becoming an unmaintainable "God Object".
- <strong>Composition (has-a)</strong> delegates specific responsibilities to specialized objects (e.g., <code>AnalyticsTracker</code>, <code>NetworkErrorHandler</code>). Each component can be modified, replaced, or mocked in unit tests without risking regressions across the entire app.`,
        realWorldPitfall: 'Creating monolithic `BaseActivity` classes that all screens must inherit, leading to high regression risks when base logic changes.',
        correctAnswerBreakdown: 'Option B correctly articulates the fragile base class problem and modularity benefits.'
      }
    },
    {
      id: 's2-q7-room-transaction-atomic',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Room Database: @Transaction Annotation & Atomic Operations',
      prompt: `In an account transfer feature:
<pre><code>@Dao
interface AccountDao {
    @Transaction
    suspend fun transferFunds(fromId: String, toId: String, amount: Double) {
        debit(fromId, amount)
        credit(toId, amount)
    }
}</code></pre>
Why is the <code>@Transaction</code> annotation strictly necessary here?`,
      options: [
        { id: 'opt-a', text: 'Without @Transaction, Room cannot execute suspend functions.' },
        { id: 'opt-b', text: 'It wraps both SQL statements in a SQLite BEGIN TRANSACTION ... COMMIT block; if debit succeeds but credit throws an exception, debit is rolled back, preventing funds loss.' },
        { id: 'opt-c', text: 'It forces SQLite to write directly to flash NAND storage bypassing disk cache.' },
        { id: 'opt-d', text: 'It makes the method accessible from Android background services.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '@Transaction enforces ACID atomicity, rolling back partial operations if an error occurs.',
        keyConcept: 'SQLite Transaction Atomicity in Room',
        detailed: `Financial ledger mutations must adhere to **Atomicity**: either all operations succeed, or none do. Without <code>@Transaction</code>, if a power failure, database constraint, or runtime exception occurs after <code>debit()</code>, the sender loses funds without the recipient receiving them.`,
        realWorldPitfall: 'Calling multiple DAO methods from a repository without `@Transaction`, risking inconsistent state on failure.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's2-q8-delegated-properties',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Language: Property Delegation Thread Safety',
      prompt: `By default, what is the thread-safety mode of <code>val client by lazy { HttpClient() }</code> in Kotlin?`,
      options: [
        { id: 'opt-a', text: 'LazyThreadSafetyMode.NONE (no synchronization for maximum single-threaded performance).' },
        { id: 'opt-b', text: 'LazyThreadSafetyMode.SYNCHRONIZED (uses an internal lock to ensure only one thread can initialize the instance).' },
        { id: 'opt-c', text: 'LazyThreadSafetyMode.PUBLICATION (multiple threads can compute the initializer, but only the first returns).' },
        { id: 'opt-d', text: 'It uses a Java volatile atomic reference with CAS (Compare-And-Swap).' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Kotlin by lazy defaults to LazyThreadSafetyMode.SYNCHRONIZED.',
        keyConcept: 'Kotlin Property Delegation & Lazy Modes',
        detailed: `In Kotlin, <code>by lazy</code> defaults to <code>LazyThreadSafetyMode.SYNCHRONIZED</code>, using a synchronized lock. If an object is guaranteed to be accessed only from a single thread (e.g. Main thread in UI components), you can optimize performance by passing <code>LazyThreadSafetyMode.NONE</code>.`,
        realWorldPitfall: 'Using `LazyThreadSafetyMode.NONE` across multiple coroutine background threads causes duplicate initializations or race conditions.',
        correctAnswerBreakdown: 'Option B is the default mode in Kotlin.'
      }
    },

    // DBMS Section
    {
      id: 's2-q9-top-spending-categories',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Top 2 Spending Categories per Account using ROW_NUMBER()',
      prompt: `Write an SQL query using <strong>ROW_NUMBER()</strong> to find the top 2 highest debit transactions for each account.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>transaction_id</code>, <code>amount</code>, <code>merchant_category</code>, and <code>category_rank</code>.
- Filter for <code>category_rank &lt;= 2</code>, ordered by <code>account_id</code>, then <code>amount DESC</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
      expectedColumns: ['account_id', 'transaction_id', 'amount', 'merchant_category', 'category_rank'],
      validationType: 'top_categories_ranking',
      sampleSolution: `WITH RankedTxns AS (
    SELECT 
        account_id,
        transaction_id,
        amount,
        merchant_category,
        ROW_NUMBER() OVER (
            PARTITION BY account_id 
            ORDER BY amount DESC
        ) AS category_rank
    FROM transactions
    WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
)
SELECT account_id, transaction_id, amount, merchant_category, category_rank
FROM RankedTxns
WHERE category_rank <= 2
ORDER BY account_id, amount DESC;`,
      marks: 10,
      explanation: {
        summary: 'Solved using CTE or subquery with ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY amount DESC).',
        keyConcept: 'Partition Ranking with Window Functions',
        detailed: `<code>ROW_NUMBER()</code> assigns a sequential integer to rows within a partition. Wrapping the window expression inside a CTE (Common Table Expression) allows filtering by <code>category_rank &lt;= 2</code> in the outer query, because window functions cannot be used directly inside WHERE clauses.`,
        realWorldPitfall: 'Attempting to put `WHERE ROW_NUMBER() <= 2` in the same query block (triggers SQL syntax error).',
        correctAnswerBreakdown: 'Returns top 2 transactions per account.'
      }
    },
    {
      id: 's2-q10-monthly-active-customers',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Monthly Active Accounts with strftime()',
      prompt: `Write an SQL query to calculate the number of distinct accounts that conducted at least one successful transaction per month.
<br/><br/>
<strong>Return:</strong>
- <code>month_year</code> formatted as <code>'YYYY-MM'</code> (e.g. <code>'2024-01'</code>)
- <code>active_accounts_count</code>
<br/>
Order chronologically by <code>month_year</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status, timestamp)`,
      expectedColumns: ['month_year', 'active_accounts_count'],
      validationType: 'monthly_active',
      sampleSolution: `SELECT 
    strftime('%Y-%m', timestamp) AS month_year,
    COUNT(DISTINCT account_id) AS active_accounts_count
FROM transactions
WHERE status = 'SUCCESS'
GROUP BY strftime('%Y-%m', timestamp)
ORDER BY month_year;`,
      marks: 10,
      explanation: {
        summary: 'SQLite strftime("%Y-%m", timestamp) groups datetime strings by month.',
        keyConcept: 'SQLite Date/Time Aggregation',
        detailed: `In SQLite, timestamps are stored as ISO-8601 strings. <code>strftime('%Y-%m', timestamp)</code> extracts the 4-digit year and 2-digit month. <code>COUNT(DISTINCT account_id)</code> ensures multiple transactions by the same customer count as a single active account for that month.`,
        realWorldPitfall: 'Using `COUNT(account_id)` instead of `COUNT(DISTINCT account_id)` which counts transaction volume rather than unique active customers.',
        correctAnswerBreakdown: 'Accurately groups and counts distinct accounts per month.'
      }
    },
    {
      id: 's2-q11-dormant-accounts',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Identify Inactive Accounts with NOT EXISTS',
      prompt: `Find all accounts that have <strong>no transactions recorded</strong> in the <code>transactions</code> table.
<br/><br/>
Write the query using <code>NOT EXISTS</code>.
<br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>customer_name</code>, <code>balance</code>`,
      schemaContext: `Tables: accounts (account_id, customer_name, branch, balance), transactions (transaction_id, account_id, amount)`,
      expectedColumns: ['account_id', 'customer_name', 'balance'],
      validationType: 'dormant_not_exists',
      sampleSolution: `SELECT 
    a.account_id,
    a.customer_name,
    a.balance
FROM accounts a
WHERE NOT EXISTS (
    SELECT 1 FROM transactions t 
    WHERE t.account_id = a.account_id
);`,
      marks: 10,
      explanation: {
        summary: 'NOT EXISTS returns true when the correlated subquery produces zero matching rows.',
        keyConcept: 'Correlated Subqueries & NOT EXISTS',
        detailed: `<code>NOT EXISTS</code> terminates scanning as soon as the first matching row is found (short-circuit evaluation). It is NULL-safe, unlike <code>NOT IN</code>, and executes efficiently using existing SQLite indexes on <code>transactions(account_id)</code>.`,
        realWorldPitfall: 'Using `NOT IN` with subqueries containing NULLs returns an empty result set.',
        correctAnswerBreakdown: 'Accounts ACC-104 and ACC-105 have no transaction records.'
      }
    },
    {
      id: 's2-q12-percentage-contribution',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Percentage Contribution to Account Spending',
      prompt: `Calculate what percentage of each account's total debit spending is represented by each transaction.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>transaction_id</code>, <code>amount</code>, and <code>spend_percentage</code> rounded to 2 decimal places.
- Filter for <code>status = 'SUCCESS' AND transaction_type = 'DEBIT'</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp)`,
      expectedColumns: ['account_id', 'transaction_id', 'amount', 'spend_percentage'],
      validationType: 'percentage_contribution',
      sampleSolution: `SELECT 
    account_id,
    transaction_id,
    amount,
    ROUND(amount * 100.0 / SUM(amount) OVER (PARTITION BY account_id), 2) AS spend_percentage
FROM transactions
WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
ORDER BY account_id, amount DESC;`,
      marks: 10,
      explanation: {
        summary: 'Window function SUM(amount) OVER (PARTITION BY account_id) computes the denominator per row.',
        keyConcept: 'Analytical Ratios using Window Functions',
        detailed: `Without window functions, computing percentages requires a separate GROUP BY query joined back to the table. With <code>SUM(amount) OVER (PARTITION BY account_id)</code>, each row has direct access to its partition's total spend in a single pass.`,
        realWorldPitfall: 'Integer division in SQL: using `100` instead of `100.0` truncates decimal values to 0 in SQLite.',
        correctAnswerBreakdown: 'Computes spend_percentage correctly per transaction.'
      }
    },
    {
      id: 's2-q13-partial-index',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Partial Index DDL for Completed Transactions',
      prompt: `In SQLite, 90% of transactions are historical and successful. Write the DDL statement to create a <strong>Partial Index</strong> named <code>idx_successful_txns</code> on <code>transactions(account_id, timestamp)</code> indexing <strong>only</strong> rows where <code>status = 'SUCCESS'</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status, timestamp)`,
      expectedColumns: ['query_status'],
      validationType: 'partial_index_ddl',
      sampleSolution: `CREATE INDEX idx_successful_txns 
ON transactions(account_id, timestamp) 
WHERE status = 'SUCCESS';`,
      marks: 10,
      explanation: {
        summary: 'Partial indexes use a WHERE clause to index only a subset of rows, reducing B-tree size and flash write wear.',
        keyConcept: 'SQLite Partial Indexing & Storage Efficiency',
        detailed: `On mobile devices with constrained flash storage, a **Partial Index** (<code>CREATE INDEX ... WHERE ...</code>) avoids indexing failed, pending, or archived rows. The index file is much smaller, stays in RAM cache, and accelerates common queries.`,
        realWorldPitfall: 'Queries that do not include `WHERE status = "SUCCESS"` cannot utilize this partial index.',
        correctAnswerBreakdown: 'CREATE INDEX idx_successful_txns ON transactions(account_id, timestamp) WHERE status = "SUCCESS";'
      }
    },

    // DSA Problem
    {
      id: 's2-q14-dsa-sorted-twosum',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Reconcile Two Target Transactions (Two Pointers)',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Algorithms &gt; Searching &amp; Two Pointers
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: In-Place Two Pointers
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(N) Time | O(1) Space
  </span>
</div>
Given an array of integer transaction amounts <code>numbers</code> that is already <strong>sorted in non-decreasing order</strong>, find two numbers such that they add up to a specific <code>target</code> transaction sum.
<br/><br/>
Return the 1-based indices <code>[index1, index2]</code> of the two numbers.
<br/><br/>
<strong>Constraints:</strong>
- <code>2 &lt;= numbers.size &lt;= 3 * 10^4</code>
- <code>-1000 &lt;= numbers[i] &lt;= 1000</code>
- <strong>Time Complexity:</strong> Must run in <code>O(N)</code>.
- <strong>Auxiliary Space:</strong> Must run in <code>O(1)</code> space (HashMap is NOT allowed).`,
      starterCode: `fun twoSumSorted(numbers: IntArray, target: Int): IntArray {
    var left = 0
    var right = numbers.size - 1

    // TODO: Implement O(N) Two-Pointer convergence with O(1) space

    return intArrayOf(-1, -1)
}

fun main() {
    val arr = intArrayOf(20, 70, 110, 150)
    val target = 90
    val res = twoSumSorted(arr, target)
    println("Indices: \${res[0]} \${res[1]}")
}`,
      solutionCode: `fun twoSumSorted(numbers: IntArray, target: Int): IntArray {
    var left = 0
    var right = numbers.size - 1

    while (left < right) {
        val sum = numbers[left] + numbers[right]
        when {
            sum == target -> return intArrayOf(left + 1, right + 1)
            sum < target -> left++
            else -> right--
        }
    }

    return intArrayOf(-1, -1)
}

fun main() {
    val arr = intArrayOf(20, 70, 110, 150)
    val target = 90
    val res = twoSumSorted(arr, target)
    println("\${res[0]} \${res[1]}")
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Standard Pair', input: 'numbers = [20, 70, 110, 150], target = 90', expected: '1 2', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: Negative Numbers', input: 'numbers = [-30, -10, 0, 40], target = -40', expected: '1 2', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: Outer Extremes', input: 'numbers = [10, 20, 30, 40, 50], target = 60', expected: '1 5', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: Adjacent Elements', input: 'numbers = [5, 25, 75], target = 100', expected: '2 3', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Converging Two-Pointer technique solves sorted two sum in O(N) time with O(1) space.',
        keyConcept: 'Two-Pointer Technique on Monotonic Sorted Sequences',
        detailed: `Because the array is sorted:
- If <code>sum &lt; target</code>, the only way to increase the sum is to increment <code>left</code>.
- If <code>sum &gt; target</code>, the only way to decrease the sum is to decrement <code>right</code>.
- Each comparison eliminates one candidate element, guaranteeing at most $N$ comparisons. Memory is strictly $O(1)$.`,
        realWorldPitfall: 'Using a HashMap for sorted arrays: while $O(N)$ time, it incurs $O(N)$ heap allocations and garbage collection overhead.',
        correctAnswerBreakdown: 'Indices are returned in 1-based format as required.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's2-q15-android-arch-image-gallery',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Memory-Safe Receipt Image Gallery',
      prompt: `Design and implement an <strong>Infinite Banking Receipt Gallery App</strong> optimized to prevent OutOfMemory errors when loading hundreds of high-resolution cheque and transaction receipts in Jetpack Compose with Kotlin Coroutines.`,
      starterCode: `// Memory-Safe Receipt Gallery
// 1. DATA MODEL (ReceiptItem with thumbnail vs full-size URLs)
// 2. IMAGE LOADER ENGINE (Downsampling & inSampleSize cache)
// 3. COMPOSE UI (LazyVerticalGrid with keying and rememberAsyncImage)`,
      fullArchitectureCode: `package com.bank.mastery.gallery

import androidx.compose.runtime.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class ReceiptItem(
    val id: String,
    val merchant: String,
    val amount: Double,
    val thumbnailUrl: String,
    val date: String
)

sealed interface GalleryUiState {
    object Loading : GalleryUiState
    data class Success(val items: List<ReceiptItem>) : GalleryUiState
    data class Error(val message: String) : GalleryUiState
}

class ReceiptGalleryViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<GalleryUiState>(GalleryUiState.Loading)
    val uiState: StateFlow<GalleryUiState> = _uiState.asStateFlow()

    init {
        loadReceipts()
    }

    fun loadReceipts() {
        viewModelScope.launch {
            // Memory safe receipt list
            val sampleReceipts = (1..50).map { i ->
                ReceiptItem(
                    id = "REC-$i",
                    merchant = if (i % 2 == 0) "Tesco Superstore" else "Barclays ATM",
                    amount = i * 15.50,
                    thumbnailUrl = "https://bank.secure/thumb_$i.webp",
                    date = "2024-02-15"
                )
            }
            _uiState.value = GalleryUiState.Success(sampleReceipts)
        }
    }
}

@Composable
fun ReceiptGalleryScreen(viewModel: ReceiptGalleryViewModel) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(topBar = { TopAppBar(title = { Text("Transaction Receipts") }) }) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            when (val s = state) {
                is GalleryUiState.Loading -> CircularProgressIndicator()
                is GalleryUiState.Error -> Text(text = s.message)
                is GalleryUiState.Success -> {
                    LazyVerticalGrid(
                        columns = GridCells.Adaptive(150.dp),
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(8.dp)
                    ) {
                        items(items = s.items, key = { it.id }) { receipt ->
                            Card(modifier = Modifier.padding(6.dp)) {
                                Column(modifier = Modifier.padding(8.dp)) {
                                    Text(receipt.merchant, style = MaterialTheme.typography.titleSmall)
                                    Text("£\${receipt.amount}", style = MaterialTheme.typography.bodyMedium)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`,
      marks: 40,
      explanation: {
        summary: 'Implements LazyVerticalGrid with stable item keys, thumbnail downsampling, and Flow-based state.',
        keyConcept: 'Compose Memory-Safe Grids & Thumbnail Caching',
        detailed: `Loading hundreds of uncompressed images in a grid quickly exhausts the 192MB/256MB Android app heap. Providing lightweight thumbnail URLs, using stable keys for LazyVerticalGrid, and binding ViewModel StateFlow ensures zero heap bloat and smooth 60fps scrolling.`,
        realWorldPitfall: 'Loading raw 4K camera photos directly into LazyColumn cells without downsampling.',
        correctAnswerBreakdown: 'Full architecture with ViewModel, StateFlow, and LazyVerticalGrid.'
      }
    }
  ]
};
