/* ==========================================================================
   Assessment Set 20: Master Assessment & Edge-Case Gauntlet (Barclays AVP Final)
   Focus: Inline Value Classes, crossinline vs noinline, Low Memory Killer (LMK),
          Minimum Window Substring (Exact Frequency O(N) Sliding Window).
   ========================================================================== */

export const ASSESSMENT_SET_20 = {
  id: 'set-20',
  number: 20,
  title: 'Set 20: Master Assessment & Edge-Case Gauntlet (Ultimate Final)',
  shortTitle: 'Set 20: Master Final Exam',
  focusArea: 'Inline Value Classes, crossinline, LMK oom_adj, Bank Reconciliation & Min Window Substring',
  hackerEarthTrack: 'Algorithms > Advanced Sliding Window & Hashes',
  hackerEarthChallenge: 'Code Monk: Minimum Window Substring / Exact Frequency Match',
  hackerEarthConcepts: ['Exact Frequency Window', 'Two Pointers Shrink', 'Value Class Mangling', 'crossinline'],
  difficulty: 'Principal / Lead Mobile Engineer',
  durationMinutes: 90,
  badge: 'Principal Architect Final',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Kotlin & Android Master Edge-Cases',
      shortTitle: 'Master Edge-Cases',
      icon: '🧠',
      description: 'Principal-level internals: @JvmInline value classes, crossinline vs noinline, LMK oom_score_adj, and Compose recomposition loops.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Bank reconciliation ledger matching, compound interest amortization CTE, and multi-table EXPLAIN plans.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Minimum Window Substring in O(N) Time using Exact Frequency Sliding Window.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: High-Frequency Stock & Crypto Order Book with WebSockets, In-Memory Ring Buffer, and Compose.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's20-q1-jvm-inline-value-class',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Language: @JvmInline value class vs typealias and Boxing',
      prompt: `Why is <code>@JvmInline value class AccountId(val value: String)</code> far superior to <code>typealias AccountId = String</code> for domain modeling in banking apps?`,
      options: [
        { id: 'opt-a', text: 'typealias makes the code run 10x slower.' },
        { id: 'opt-b', text: 'typealias provides zero type safety (AccountId and String are interchangeable aliases at compile time, allowing you to pass an AccountId into a CustomerId parameter without compiler error). Value classes enforce strict compile-time type safety while unboxing to a primitive/underlying type at runtime to avoid heap object allocation overhead.' },
        { id: 'opt-c', text: 'Value classes cannot be used in data classes.' },
        { id: 'opt-d', text: 'typealias is banned on Android.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Value classes provide strict compile-time type safety with zero runtime object allocation overhead.',
        keyConcept: 'Inline Value Classes vs Type Aliases',
        detailed: `- <code>typealias AccountId = String</code>: Purely a syntactic alias. <code>fun pay(to: AccountId)</code> will happily accept any arbitrary <code>String</code> without compile errors!
- <code>@JvmInline value class AccountId(val value: String)</code>: Creates a distinct type. Passing a plain String or CustomerId is a <strong>compile-time type error</strong>!
At bytecode level, the Kotlin compiler erases the wrapper and passes the underlying <code>String</code> directly, avoiding heap object allocation (except when used in generic collections where boxing is required).`,
        realWorldPitfall: 'Passing customer ID into account ID arguments when using typealias: value classes prevent this bug completely.',
        correctAnswerBreakdown: 'Option B accurately contrasts compile-time type safety with zero runtime allocation.'
      }
    },
    {
      id: 's20-q2-crossinline-vs-noinline',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Inline Functions: crossinline vs noinline Parameter Modifiers',
      prompt: `In an <code>inline</code> function taking a lambda parameter:
Why does the compiler require <code>crossinline</code> if that lambda is executed inside a local object or passed to another execution context (e.g. <code>runOnUiThread { body() }</code>)?`,
      options: [
        { id: 'opt-a', text: 'crossinline forces the lambda to run on a background thread.' },
        { id: 'opt-b', text: 'Standard inlined lambdas permit "non-local returns" (using "return" to return from the enclosing calling function). If the lambda is executed in another execution context (like an asynchronous callback), a non-local return cannot be executed because the enclosing function may have already finished. crossinline prohibits non-local returns while keeping the lambda inlined.' },
        { id: 'opt-c', text: 'crossinline encrypts the lambda bytecode.' },
        { id: 'opt-d', text: 'noinline and crossinline are identical.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'crossinline prohibits non-local returns for inlined lambdas that are invoked inside nested contexts.',
        keyConcept: 'Non-Local Returns & The crossinline Modifier',
        detailed: `In standard inline functions, a <code>return</code> statement inside a lambda actually returns from the <strong>outer caller function</strong>!
<pre><code>inline fun runLater(crossinline block: () -> Unit) {
    handler.post { block() } // executed later!
}</code></pre>
If <code>block</code> had a non-local <code>return</code>, returning from a function that already finished when the handler runs is impossible!
<code>crossinline</code> tells the compiler: "Inline this lambda for performance, but disallow <code>return</code> statements inside it".
Use <code>noinline</code> if you don't want the lambda inlined at all.`,
        realWorldPitfall: 'Confusing crossinline (still inlined, no non-local returns) with noinline (not inlined, standard object allocated).',
        correctAnswerBreakdown: 'Option B accurately explains non-local return prohibition.'
      }
    },
    {
      id: 's20-q3-low-memory-killer-oom-score',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android OS Architecture: Low Memory Killer Daemon (lmkd) & oom_score_adj',
      prompt: `When the Linux kernel runs critically low on RAM, how does the Android <strong>Low Memory Killer daemon (lmkd)</strong> decide which processes to kill first?`,
      options: [
        { id: 'opt-a', text: 'It kills apps based on their file size on disk.' },
        { id: 'opt-b', text: 'It consults each process\'s "oom_score_adj" (out-of-memory score adjustment, ranging from -1000 to +1000) managed by the ActivityManagerService. Cached background processes (high positive score ~900) are killed first; Foreground Activities (score 0) and Persistent System Services (score -1000) are killed last.' },
        { id: 'opt-c', text: 'It kills the app that has been open the longest.' },
        { id: 'opt-d', text: 'It randomly terminates processes until RAM is free.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'lmkd terminates processes with the highest oom_score_adj first (cached background processes).',
        keyConcept: 'Android Low Memory Killer (LMK) Process Hierarchy',
        detailed: `Process priority hierarchy in Android:
1. <strong>Native/System Daemons:</strong> <code>oom_score_adj = -1000</code> (never killed).
2. <strong>Foreground App (Active Activity):</strong> <code>oom_score_adj = 0</code> (killed only if system is about to panic).
3. <strong>Visible Processes (Dialogs/Pip):</strong> <code>oom_score_adj = 100</code>.
4. <strong>Foreground Services with Notification:</strong> <code>oom_score_adj = 200</code>.
5. <strong>Cached Background Apps:</strong> <code>oom_score_adj = 900+</code> (first victims when RAM is scarce).`,
        realWorldPitfall: 'Assuming background services stay alive without a persistent Foreground Service notification: LMK terminates them under normal memory pressure.',
        correctAnswerBreakdown: 'Option B accurately defines oom_score_adj priority ranking.'
      }
    },
    {
      id: 's20-q4-compose-recomposition-infinite-loop',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Compose Hazards: Mutating State During Composition (Infinite Recomposition)',
      prompt: `What fatal flaw occurs in this Jetpack Compose snippet:
<pre><code>@Composable
fun BalanceScreen(balance: Double) {
    var formatCount by remember { mutableStateOf(0) }
    formatCount++ // Mutating state directly in Composable body!
    Text("Balance: $balance (Formatted $formatCount times)")
}</code></pre>`,
      options: [
        { id: 'opt-a', text: 'It compiles and renders correctly without issues.' },
        { id: 'opt-b', text: 'It creates an Infinite Recomposition Loop! Mutating formatCount during the composition pass immediately invalidates the composable, scheduling another composition on the next frame, which mutates formatCount again, pegging the CPU at 100% and throwing a Compose runtime exception.' },
        { id: 'opt-c', text: 'formatCount is reset to 0 on every frame.' },
        { id: 'opt-d', text: 'Text cannot display variables.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Writing to mutable state directly inside the composition pass triggers an immediate recomposition loop.',
        keyConcept: 'Composition Side-Effect Purity & Recomposition Loops',
        detailed: `The Composition phase must be a <strong>pure function of its inputs</strong>.
Writing to a <code>MutableState</code> variable (<code>formatCount++</code>) during composition signals to the runtime that a state observed by this Composable has mutated.
The runtime immediately invalidates the node and re-executes <code>BalanceScreen</code>, which mutates the state again, infinitely looping until the UI thread crashes with an ANR or OutOfMemoryError.
All state mutations must occur in event callbacks (e.g. <code>onClick</code>) or controlled side-effects (e.g. <code>LaunchedEffect</code>).`,
        realWorldPitfall: 'Mutating state variables directly in the composable body instead of inside callbacks.',
        correctAnswerBreakdown: 'Option B accurately identifies the infinite recomposition loop and 100% CPU lockup.'
      }
    },
    {
      id: 's20-q5-room-invalidation-tracker',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Room Internals: InvalidationTracker and SQLite Temp Triggers',
      prompt: `When an app observes a Room DAO query returning <code>Flow&lt;List&lt;Account&gt;&gt;</code>:
How does Room detect that table rows have changed to automatically re-emit fresh data downstream?`,
      options: [
        { id: 'opt-a', text: 'Room polls the database with a SELECT query every 50ms.' },
        { id: 'opt-b', text: 'Room\'s InvalidationTracker creates SQLite TEMP TRIGGERS on the observed tables. When any INSERT, UPDATE, or DELETE occurs, the triggers write table IDs into an in-memory room_table_modification_log table. An observer thread monitors this log and signals the Flow to re-query.' },
        { id: 'opt-c', text: 'Room reads Android filesystem file modified timestamps.' },
        { id: 'opt-d', text: 'SQLite notifies Room via an Android BroadcastReceiver.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Room InvalidationTracker registers SQLite temp triggers that record mutations in a modification log.',
        keyConcept: 'Room InvalidationTracker & Reactive Flow Triggers',
        detailed: `Room does not poll the database. Instead:
1. When a reactive <code>Flow</code> or <code>LiveData</code> query starts, Room generates <code>TEMP TRIGGER</code> statements for <code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code> on the queried tables.
2. Whenever any DAO method modifies data, the trigger writes the modified table ID to <code>room_table_modification_log</code>.
3. The <code>InvalidationTracker</code> dispatches an event to the active Flow, re-executing the query and emitting the latest snapshot.`,
        realWorldPitfall: 'Modifying SQLite tables using raw ad-hoc SQLiteDatabase commands without notifying Room: Room triggers don\'t fire if triggers were bypassed.',
        correctAnswerBreakdown: 'Option B accurately details Room InvalidationTracker temp triggers.'
      }
    },
    {
      id: 's20-q6-virtual-threads-vs-coroutines',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'JVM Concurrency: Java 21 Virtual Threads (Project Loom) vs Kotlin Coroutines',
      prompt: `What is the fundamental architectural difference between <strong>Java Virtual Threads</strong> (Project Loom) and <strong>Kotlin Coroutines</strong>?`,
      options: [
        { id: 'opt-a', text: 'Virtual threads only work with C++.' },
        { id: 'opt-b', text: 'Java Virtual Threads are managed by the JVM runtime and allow blocking code (Thread.sleep, blocking I/O) to suspend transparently without changing function signatures. Kotlin Coroutines are managed by compiler bytecode transformations (Continuation-Passing Style state machines) and require explicit "suspend" keywords throughout the call hierarchy.' },
        { id: 'opt-c', text: 'Kotlin Coroutines do not support multithreading.' },
        { id: 'opt-d', text: 'Virtual threads run on the Android NDK.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Virtual Threads suspend blocking calls transparently via JVM hooks; Coroutines use compiler-generated CPS state machines requiring suspend modifiers.',
        keyConcept: 'JVM-Level Virtual Threads vs Compiler-Level Coroutines',
        detailed: `- <strong>Java Virtual Threads:</strong> Built into the JVM specification. When a virtual thread calls blocking I/O (like <code>InputStream.read()</code>), the JVM unmounts the virtual thread from its carrier OS thread automatically. No <code>suspend</code> keyword needed! (Currently server-side JVM, not on Android ART).
- <strong>Kotlin Coroutines:</strong> Compiler-driven. <code>kotlinc</code> transforms functions marked <code>suspend</code> into state machines passing a hidden <code>Continuation</code> parameter. Coroutines provide explicit structured concurrency, cancellation scopes, and Flow streams on any JVM (including Android).`,
        realWorldPitfall: 'Assuming Java Virtual Threads are available on Android ART: Android does not run modern OpenJDK with Project Loom.',
        correctAnswerBreakdown: 'Option B accurately contrasts JVM-managed blocking unmounting with Kotlin compiler CPS state machines.'
      }
    },
    {
      id: 's20-q7-predictive-back-edge-to-edge',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android 14/15 Modernization: Predictive Back Animation & Edge-to-Edge Insets',
      prompt: `In Android 15, apps are drawn <strong>Edge-to-Edge by default</strong> (status bar and navigation bars are transparent).
Why does forgetting to handle <code>WindowInsetsCompat</code> or <code>Modifier.safeDrawingPadding()</code> cause severe usability bugs?`,
      options: [
        { id: 'opt-a', text: 'The app crashes on startup.' },
        { id: 'opt-b', text: 'Interactive UI elements (TopAppBar buttons, bottom navigation tabs, input fields) will render directly underneath the system status bar, camera hole-punch cutouts, and bottom navigation gesture pills, making buttons unclickable and covered by the soft keyboard.' },
        { id: 'opt-c', text: 'The display turns black and white.' },
        { id: 'opt-d', text: 'Network calls fail.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Failing to handle WindowInsets causes interactive views to overlap with system bars and cutouts in edge-to-edge mode.',
        keyConcept: 'Edge-to-Edge & WindowInsets Handling in Android 15',
        detailed: `In Android 15, <code>enableEdgeToEdge()</code> is mandatory.
If an app does not apply insets:
- The top header renders beneath the system clock and camera notch.
- Bottom buttons render directly underneath the Android navigation bar pill.
Using <code>Modifier.systemBarsPadding()</code> or <code>Modifier.imePadding()</code> ensures content adjusts smoothly when the software keyboard opens.`,
        realWorldPitfall: 'Hardcoding 24dp top padding: devices have different notch and status bar heights.',
        correctAnswerBreakdown: 'Option B accurately describes system bar overlaps and unclickable elements.'
      }
    },
    {
      id: 's20-q8-jni-direct-byte-buffer-leaks',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android NDK / JNI: Direct ByteBuffer vs Primitive Array Pinning',
      prompt: `When passing large financial cryptographic data or camera frames between Kotlin and C++ (JNI):
Why is <code>ByteBuffer.allocateDirect(size)</code> preferred over passing a <code>ByteArray</code> via <code>GetByteArrayElements()</code>?`,
      options: [
        { id: 'opt-a', text: 'Direct ByteBuffers are encrypted with hardware AES.' },
        { id: 'opt-b', text: 'allocateDirect allocates memory in native C++ heap (outside the JVM garbage collection heap). C++ can access the native memory address directly (env->GetDirectBufferAddress) with zero copying and zero GC pinning; ByteArray often requires copying bytes or pinning memory, stalling the ART Garbage Collector.' },
        { id: 'opt-c', text: 'ByteArray cannot be used in JNI.' },
        { id: 'opt-d', text: 'Direct ByteBuffers are automatically backed up to Google Drive.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Direct ByteBuffers allocate memory in native space, enabling zero-copy access in C++ without GC pinning.',
        keyConcept: 'JNI Zero-Copy Memory & DirectByteBuffers',
        detailed: `Passing a <code>ByteArray</code> to C++ with <code>GetByteArrayElements</code> gives the JVM two choices:
1. Make a full copy of the array in C++ memory (doubles memory usage and wastes CPU).
2. Pin the array in the JVM heap, disabling GC compaction and stalling GC threads.
A <strong>Direct ByteBuffer</strong> allocates native memory (via <code>malloc</code>) accessible to both Java and C++ directly at the same pointer with <strong>Zero-Copy</strong> efficiency!`,
        realWorldPitfall: 'Forgetting that Direct ByteBuffers are not tracked by JVM heap metrics: leaking them causes native OOM crashes without OutOfMemoryError in Java.',
        correctAnswerBreakdown: 'Option B accurately explains native C++ allocation and zero-copy pointer access.'
      }
    },

    // DBMS Section
    {
      id: 's20-q9-bank-reconciliation-statement',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Bank Reconciliation Statement (Unmatched Ledger Entries)',
      prompt: `Perform a bank reconciliation between our <strong>Internal Ledger</strong> and the <strong>External Clearance Clearinghouse</strong>:
Identify all internal transactions that have <strong>NO matching clearance record</strong> (matching on identical <code>amount</code> and <code>account_id</code> within a 48-hour tolerance window).
<br/><br/>
<strong>Return:</strong>
- <code>l.transaction_id</code>, <code>l.account_id</code>, <code>l.amount</code>, <code>l.timestamp</code>.`,
      schemaContext: `Tables: internal_ledger (transaction_id, account_id, amount, timestamp), external_clearance (clearance_id, account_id, amount, timestamp)`,
      expectedColumns: ['transaction_id', 'account_id', 'amount', 'timestamp'],
      validationType: 'reconciliation_unmatched_ledger',
      sampleSolution: `SELECT 
    l.transaction_id,
    l.account_id,
    l.amount,
    l.timestamp
FROM internal_ledger l
LEFT JOIN external_clearance c 
    ON l.account_id = c.account_id
    AND l.amount = c.amount
    AND ABS(strftime('%s', c.timestamp) - strftime('%s', l.timestamp)) <= 172800
WHERE c.clearance_id IS NULL
ORDER BY l.timestamp DESC;`,
      marks: 10,
      explanation: {
        summary: 'Anti-join with multi-predicate matching (account, amount, and 48h tolerance) isolates unreconciled transactions.',
        keyConcept: 'Financial Ledger Reconciliation Anti-Join',
        detailed: `External clearance records (from Fedwire, BACS, or SWIFT) may clear up to 48 hours (172,800 seconds) after internal order placement. A multi-predicate anti-join isolates transactions pending clearance or dropped due to network transmission failures.`,
        realWorldPitfall: 'Using strict timestamp equality: external clearing houses never have the exact same millisecond timestamp as internal systems.',
        correctAnswerBreakdown: 'LEFT JOIN matching account, amount, and time window <= 172800 WHERE clearance_id IS NULL.'
      }
    },
    {
      id: 's20-q10-recursive-amortization-schedule',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Loan Amortization Balance Schedule via Recursive CTE',
      prompt: `Generate a 3-month loan amortization balance schedule for a loan of <code>$1000.00</code> with a monthly payment of <code>$300.00</code> and monthly interest rate of <code>1% (0.01)</code>.
Formula: <code>new_balance = (previous_balance * 1.01) - 300</code>.
<br/><br/>
<strong>Return:</strong>
- <code>month_num</code>, <code>remaining_balance</code> (rounded to 2 decimal places).`,
      schemaContext: `Parameters: Initial Principal = 1000, Monthly Payment = 300, Rate = 0.01`,
      expectedColumns: ['month_num', 'remaining_balance'],
      validationType: 'recursive_amortization_schedule',
      sampleSolution: `WITH RECURSIVE amortization(month_num, remaining_balance) AS (
    -- Initial state: Month 0 with $1000 principal
    VALUES (0, 1000.00)

    UNION ALL

    -- Recursive calculation for months 1, 2, 3
    SELECT 
        month_num + 1,
        ROUND((remaining_balance * 1.01) - 300.00, 2)
    FROM amortization
    WHERE month_num < 3
)
SELECT month_num, remaining_balance
FROM amortization
WHERE month_num > 0
ORDER BY month_num ASC;`,
      marks: 10,
      explanation: {
        summary: 'Recursive CTE iteratively computes compounding interest and principal decrements per term.',
        keyConcept: 'Financial Modeling with Recursive CTEs',
        detailed: `Each iteration of the recursive CTE reads the previous month's remaining balance, applies interest, subtracts the monthly installment, and passes the result to the next term.`,
        realWorldPitfall: 'Forgetting the termination condition `WHERE month_num < 3`: creates an infinite recursive loop.',
        correctAnswerBreakdown: 'WITH RECURSIVE with monthly interest formula and iteration ceiling.'
      }
    },
    {
      id: 's20-q11-longest-active-streak-ranking',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Island & Gaps Problem (Find Longest Contiguous Activity Streak)',
      prompt: `Using the classic <strong>Islands and Gaps</strong> technique, find the single longest contiguous daily transaction streak for account <code>'ACC-101'</code>.
<br/><br/>
<strong>Return:</strong>
- <code>streak_length_days</code>, <code>streak_start_date</code>, <code>streak_end_date</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, timestamp)`,
      expectedColumns: ['streak_length_days', 'streak_start_date', 'streak_end_date'],
      validationType: 'islands_and_gaps_streak',
      sampleSolution: `WITH distinct_dates AS (
    SELECT DISTINCT date(timestamp) AS txn_date
    FROM transactions
    WHERE account_id = 'ACC-101'
),
numbered_dates AS (
    SELECT 
        txn_date,
        ROW_NUMBER() OVER (ORDER BY txn_date) AS rn
    FROM distinct_dates
),
streak_groups AS (
    SELECT 
        txn_date,
        date(txn_date, '-' || rn || ' days') AS streak_island
    FROM numbered_dates
)
SELECT 
    COUNT(*) AS streak_length_days,
    MIN(txn_date) AS streak_start_date,
    MAX(txn_date) AS streak_end_date
FROM streak_groups
GROUP BY streak_island
ORDER BY streak_length_days DESC
LIMIT 1;`,
      marks: 10,
      explanation: {
        summary: 'Subtracting ROW_NUMBER() days from dates produces an invariant grouping key (island) for contiguous sequences.',
        keyConcept: 'Islands and Gaps Problem in Relational SQL',
        detailed: `If dates are contiguous:
<code>2026-01-01 (rn=1) -> 2026-01-01 - 1 day = 2025-12-31</code>
<code>2026-01-02 (rn=2) -> 2026-01-02 - 2 days = 2025-12-31</code>
<code>2026-01-03 (rn=3) -> 2026-01-03 - 3 days = 2025-12-31</code>
The difference produces an identical invariant key! Any gap immediately shifts the key to a new island. Grouping by this island yields exact streak lengths.`,
        realWorldPitfall: 'Not deduplicating multiple transactions on the same day prior to computing row numbers.',
        correctAnswerBreakdown: 'Islands and Gaps via date(txn_date, \'-\' || rn || \' days\').'
      }
    },
    {
      id: 's20-q12-atomic-transfer-trigger-rollback',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: DDL Trigger Enforcing Non-Negative Balance Invariants',
      prompt: `Write SQLite DDL to create a <strong>BEFORE UPDATE Trigger</strong> on <code>accounts</code> that prevents negative account balances, raising <code>'ABORT: Balance cannot be negative'</code> if <code>NEW.balance &lt; 0</code>.`,
      schemaContext: `Table: accounts (account_id, balance)`,
      expectedColumns: ['query_status'],
      validationType: 'non_negative_balance_trigger',
      sampleSolution: `CREATE TRIGGER enforce_non_negative_balance
BEFORE UPDATE OF balance ON accounts
FOR EACH ROW
WHEN NEW.balance < 0
BEGIN
    SELECT RAISE(ABORT, 'ABORT: Balance cannot be negative');
END;`,
      marks: 10,
      explanation: {
        summary: 'WHEN NEW.balance < 0 trigger raises an ABORT exception, preventing overdrafts at the database engine level.',
        keyConcept: 'SQLite Business Invariant Triggers',
        detailed: `Database triggers provide the ultimate backstop against software bugs. Even if an API or race condition attempts to set a balance below $0.00, SQLite rejects the write and rolls back the active transaction.`,
        realWorldPitfall: 'Omitting WHEN clause: running trigger logic unconditionally on every update slows down write performance.',
        correctAnswerBreakdown: 'CREATE TRIGGER ... BEFORE UPDATE OF balance ... WHEN NEW.balance < 0 BEGIN SELECT RAISE(ABORT, ...); END;'
      }
    },
    {
      id: 's20-q13-explain-plan-covering-verification',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Inspect EXPLAIN QUERY PLAN for Index-Only Covering Scans',
      prompt: `Write the SQLite command to inspect the query plan for:
<pre><code>SELECT account_id, balance FROM accounts WHERE balance > 1000;</code></pre>`,
      schemaContext: `Table: accounts (account_id, balance)`,
      expectedColumns: ['id', 'parent', 'notused', 'detail'],
      validationType: 'explain_query_plan_covering',
      sampleSolution: `EXPLAIN QUERY PLAN 
SELECT account_id, balance FROM accounts WHERE balance > 1000;`,
      marks: 10,
      explanation: {
        summary: 'EXPLAIN QUERY PLAN verifies whether SQLite performs an INDEX ONLY scan vs SCAN TABLE.',
        keyConcept: 'EXPLAIN QUERY PLAN Output Analysis',
        detailed: `If detail reads <code>SEARCH TABLE accounts USING COVERING INDEX ...</code>, the query runs at maximum possible speed with zero disk page lookups into table data blocks.`,
        realWorldPitfall: 'Failing to test queries against EXPLAIN QUERY PLAN with production-sized data distributions.',
        correctAnswerBreakdown: 'EXPLAIN QUERY PLAN SELECT ...'
      }
    },

    // DSA Coding Section
    {
      id: 's20-q14-minimum-window-substring',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Master Challenge: Minimum Window Substring in O(N) Time',
      prompt: `Given two strings <code>s</code> and <code>t</code> of lengths $M$ and $N$ respectively, return the <strong>minimum window substring</strong> of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window. If there is no such substring, return the empty string <code>""</code>.
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in <strong>$O(M + N)$ time</strong>.
- $1 \\le M, N \\le 10^5$.
- Characters consist of uppercase and lowercase English letters.
<br/><br/>
<strong>Input Format:</strong>
Line 1: String <code>s</code><br/>
Line 2: String <code>t</code><br/>
<strong>Output Format:</strong>
A single string representing the minimum window.`,
      difficulty: 'Hard',
      marks: 30,
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      starterCode: `import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Solution {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        String t = br.readLine();
        if (s == null || t == null) {
            System.out.println("");
            return;
        }
        
        System.out.println(minWindow(s.trim(), t.trim()));
    }

    public static String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length()) return "";
        
        // Target frequency map for ASCII characters
        int[] targetFreq = new int[128];
        for (char c : t.toCharArray()) {
            targetFreq[c]++;
        }
        
        // Window state
        int[] windowFreq = new int[128];
        int required = 0;
        for (int i = 0; i < 128; i++) {
            if (targetFreq[i] > 0) required++;
        }
        
        int formed = 0;
        int left = 0;
        int minLen = Integer.MAX_VALUE;
        int bestStart = 0;
        
        // Expand right pointer
        for (int right = 0; right < s.length(); right++) {
            char rChar = s.charAt(right);
            windowFreq[rChar]++;
            
            if (targetFreq[rChar] > 0 && windowFreq[rChar] == targetFreq[rChar]) {
                formed++;
            }
            
            // Contract left pointer as long as window is valid
            while (left <= right && formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    bestStart = left;
                }
                
                char lChar = s.charAt(left);
                windowFreq[lChar]--;
                if (targetFreq[lChar] > 0 && windowFreq[lChar] < targetFreq[lChar]) {
                    formed--;
                }
                left++;
            }
        }
        
        return minLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + minLen);
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: 'ADOBECODEBANC\nABC',
          expectedOutput: 'BANC',
          isSample: true
        },
        {
          id: 'tc-2',
          input: 'a\na',
          expectedOutput: 'a',
          isSample: true
        },
        {
          id: 'tc-3',
          input: 'a\naa',
          expectedOutput: '',
          isSample: false
        },
        {
          id: 'tc-4',
          input: 'ab\nb',
          expectedOutput: 'b',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Expand right pointer until all characters in t are matched; contract left pointer to minimize window length in strictly O(M + N) time.',
        keyConcept: 'Exact Frequency Match Sliding Window',
        detailed: `Using primitive 128-element integer arrays for ASCII characters eliminates HashMap boxing and hashing overhead:
1. Count character frequencies of $T$. <code>required</code> tracks the number of unique characters that must reach their target count.
2. Advance <code>right</code>: increment window count. When <code>windowFreq[c] == targetFreq[c]</code>, increment <code>formed</code>.
3. While <code>formed == required</code> (window is valid):
   - Record current window if smaller than <code>minLen</code>.
   - Advance <code>left</code> to shrink the window, decrementing character counts until the window is no longer valid.
Because both <code>left</code> and <code>right</code> traverse the string at most once, the time complexity is strictly $O(M + N)$ with $O(1)$ extra space (128-element int array)!`,
        realWorldPitfall: 'Using HashMap.equals() to compare window maps inside the loop: this adds an O(26) or O(128) factor per character and causes TLE.',
        correctAnswerBreakdown: 'O(M + N) time with O(1) space using primitive frequency arrays and two pointers.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's20-q15-high-frequency-order-book-architecture',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: High-Frequency Stock & Crypto Order Book (60 FPS Compose)',
      prompt: `Architect a real-time, low-latency financial trading order book for Barclays Capital:
1. Connects to a high-frequency WebSocket stream emitting 500 price ticks/sec.
2. Implements an in-memory <strong>Ring Buffer</strong> and Coroutine Flow backpressure management (<code>conflate()</code> or <code>sample(16.milliseconds)</code>) to prevent UI thread lockup.
3. Uses a <code>LazyColumn</code> with custom draw-behind bars rendering buy/sell depth charts at 60/120fps without recomposition churn.`,
      marks: 40,
      evaluationCriteria: [
        'Uses Flow sample(16ms) / conflate() to align with 60 FPS VSYNC',
        'Implements lock-free RingBuffer or atomic state holder',
        'Draws depth bars in Draw Phase (Modifier.drawBehind) to avoid recomposition passes',
        'Demonstrates clean MVI unidirectional data flow'
      ],
      sampleSolution: `@Immutable
data class OrderBookEntry(val price: Double, val volume: Double, val cumulativeVolume: Double)

@Immutable
data class OrderBookUiState(
    val bids: List<OrderBookEntry> = emptyList(),
    val asks: List<OrderBookEntry> = emptyList(),
    val maxCumulative: Double = 1.0
)

class OrderBookViewModel @Inject constructor(
    private val webSocketDataSource: TickerWebSocketDataSource
) : ViewModel() {

    // Throttle 500 ticks/sec to match 60Hz display refresh rate (16.6ms)
    val uiState: StateFlow<OrderBookUiState> = webSocketDataSource.orderBookStream
        .sample(16.milliseconds) // Backpressure filter!
        .map { rawBook -> calculateCumulativeDepths(rawBook) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = OrderBookUiState()
        )
}

@Composable
fun OrderBookRow(entry: OrderBookEntry, isBid: Boolean, maxVolume: Double) {
    val barColor = if (isBid) Color(0x3300C853) else Color(0x33D50000)

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(24.dp)
            // Draw behind the text directly in the DRAW phase! (Skips Composition & Layout)
            .drawBehind {
                val barWidth = size.width * (entry.cumulativeVolume / maxVolume).toFloat()
                drawRect(
                    color = barColor,
                    size = Size(barWidth, size.height)
                )
            },
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = "%.2f".format(entry.price), style = MaterialTheme.typography.bodyMedium)
        Text(text = "%.4f".format(entry.volume), style = MaterialTheme.typography.bodySmall)
    }
}`,
      explanation: {
        summary: 'Backpressure throttling with sample(16ms) and rendering depth bars in Modifier.drawBehind guarantees buttery 60/120fps rendering under 500 ticks/sec.',
        keyConcept: 'High-Frequency Stream Throttling & Draw Phase Optimization',
        detailed: `If a WebSocket emits 500 times per second and the UI attempts to recompose on every tick, the Main thread chokes and crashes.
1. <code>.sample(16.milliseconds)</code> drops intermediate ticks, aligning emissions perfectly with the hardware VSYNC pulse.
2. <code>Modifier.drawBehind { ... }</code> renders the green/red depth bars directly on the GPU Canvas without triggering recomposition or layout remeasurement!`,
        realWorldPitfall: 'Triggering recomposition on every raw WebSocket message causes massive memory churn and immediate ANR.',
        correctAnswerBreakdown: 'Flow sample(16ms) + Modifier.drawBehind depth rendering.'
      }
    }
  ]
};
