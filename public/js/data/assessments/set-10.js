/* ==========================================================================
   Assessment Set 10: Grand Senior Mock — Barclays / Tesco Bank Comprehensive
   Focus: Coroutine deadlocks, collectAsStateWithLifecycle, Android 15 edge-to-edge,
          Minimum Window Substring, and Complete Production Banking App.
   ========================================================================== */

export const ASSESSMENT_SET_10 = {
  id: 'set-10',
  number: 10,
  title: 'Set 10: Grand Senior Mock Exam (Barclays / Tesco Bank)',
  shortTitle: 'Set 10: Grand Mock Exam',
  focusArea: 'Comprehensive Senior Mobile Lead: Deadlocks, Edge-to-Edge, Minimum Window & Clean Arch',
  hackerEarthTrack: 'Algorithms > Advanced Strings & Sliding Window',
  hackerEarthChallenge: 'Code Monk: Minimum Window Substring & Exact Frequency Window',
  hackerEarthConcepts: ['Exact Matching Window', 'Frequency Hash Map', 'Main-Thread Safety', 'Grand Banking Shell'],
  difficulty: 'Lead Mobile Engineer / AVP',
  durationMinutes: 90,
  badge: 'Grand Final Exam',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'Senior diagnostics: runBlocking deadlocks, collectAsStateWithLifecycle, Android 15 Edge-to-Edge, and InvalidationTracker.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'Comprehensive banking queries: 30-day cumulative net balance, tiered customer categorization, and index coverage.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Minimum Window Substring / Continuous Balance Target in O(N).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: End-to-End Enterprise Banking App with Biometrics, Room, Flow, Hilt, and Compose.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's10-q1-runblocking-main-thread-deadlock',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Concurrency Deadlocks: runBlocking on the Main Thread',
      prompt: `Why does calling <code>runBlocking { withContext(Dispatchers.Main) { updateUi() } }</code> from the Main Thread trigger an immediate application freeze and deadlock?`,
      options: [
        { id: 'opt-a', text: 'Dispatchers.Main cannot be accessed inside runBlocking.' },
        { id: 'opt-b', text: 'runBlocking blocks the Main Thread waiting for the child coroutine to finish; however, the child coroutine requires Dispatchers.Main to execute updateUi(). Since the Main Thread is blocked by runBlocking, the child can never be scheduled, creating an unrecoverable deadlock.' },
        { id: 'opt-c', text: 'The coroutine scheduler shuts down automatically.' },
        { id: 'opt-d', text: 'Android 14 throws a SecurityException.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'runBlocking blocks the thread, preventing Dispatchers.Main from processing messages queued on that same thread.',
        keyConcept: 'Main-Thread Coroutine Deadlocks',
        detailed: `<code>runBlocking</code> blocks the calling thread synchronously until its coroutine tree finishes.
If an inner block attempts to dispatch to <code>Dispatchers.Main</code>, it posts a <code>Runnable</code> onto the Main Looper. But the Main Looper thread is blocked inside <code>runBlocking</code> and cannot process new runnables! Thread A waits for Coroutine B, and Coroutine B waits for Thread A. Deadlock!`,
        realWorldPitfall: 'Using `runBlocking` in Application.onCreate() or Activity lifecycle methods.',
        correctAnswerBreakdown: 'Option B is the precise architectural explanation of main-thread deadlocks.'
      }
    },
    {
      id: 's10-q2-collectasstatewithlifecycle',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: collectAsStateWithLifecycle vs collectAsState',
      prompt: `Why does Google mandate <code>collectAsStateWithLifecycle()</code> over standard <code>collectAsState()</code> when observing ViewModel Flow streams in Android Jetpack Compose?`,
      options: [
        { id: 'opt-a', text: 'collectAsState crashes on tablets.' },
        { id: 'opt-b', text: 'collectAsState continues collecting Flow emissions even when the app is in the background (Activity stopped), wasting CPU, network, and battery. collectAsStateWithLifecycle automatically cancels flow collection when lifecycle drops below STARTED.' },
        { id: 'opt-c', text: 'collectAsState cannot render strings.' },
        { id: 'opt-d', text: 'collectAsStateWithLifecycle runs only in release builds.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'collectAsStateWithLifecycle pauses Flow collection when the app is in background, saving battery and CPU.',
        keyConcept: 'Lifecycle-Aware Flow Collection in Jetpack Compose',
        detailed: `<code>collectAsState()</code> is lifecycle-agnostic: as long as the composable is part of the composition tree, it keeps collecting. When the user presses Home, your app keeps collecting location updates, socket feeds, and database mutations in the background!
<code>collectAsStateWithLifecycle()</code> (from <code>androidx.lifecycle.compose</code>) halts upstream collection while the app is stopped.`,
        realWorldPitfall: 'Background battery drain due to unpaused `collectAsState()` on continuous socket streams.',
        correctAnswerBreakdown: 'Option B accurately explains background lifecycle pausing.'
      }
    },
    {
      id: 's10-q3-android15-edgetoedge',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android 15 (API 35): Mandatory Edge-to-Edge Enforcement & WindowInsets',
      prompt: `In Android 15 (API 35 target), apps are forced into <strong>Edge-to-Edge</strong> mode by default: the system status bar and navigation bar are transparent.
What happens if a Compose screen does not handle <code>WindowInsets</code> (or innerPadding from <code>Scaffold</code>)?`,
      options: [
        { id: 'opt-a', text: 'The OS scales the entire app down by 20%.' },
        { id: 'opt-b', text: 'Top app bars and bottom buttons draw underneath the system status bar and gesture navigation bar, causing UI overlaps and unclickable touch targets.' },
        { id: 'opt-c', text: 'The app is rejected by Google Play Store automatically.' },
        { id: 'opt-d', text: 'Touches are inverted.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Android 15 renders behind system bars; failing to apply WindowInsets causes system UI clipping.',
        keyConcept: 'Android 15 Edge-to-Edge & WindowInsets Handling',
        detailed: `Starting in Android 15, <code>enableEdgeToEdge()</code> is mandatory. Views and Composables render into the entire physical display. Developers must use <code>Scaffold(contentWindowInsets = ...)</code> and pass <code>Modifier.padding(innerPadding)</code> to keep interactive elements within safe view bounds.`,
        realWorldPitfall: 'Placing floating action buttons or bottom nav bars without `windowInsetsPadding(WindowInsets.navigationBars)` results in unclickable buttons behind gesture bars.',
        correctAnswerBreakdown: 'Option B accurately describes system bar overlap.'
      }
    },
    {
      id: 's10-q4-room-invalidation-tracker',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Room Persistence: How Room InvalidationTracker Powers Reactive Flow',
      prompt: `How does Room know when to re-emit fresh data downstream whenever a table is modified?`,
      options: [
        { id: 'opt-a', text: 'Room continuously polls the database every 100 milliseconds.' },
        { id: 'opt-b', text: 'Room installs internal SQLite triggers (room_table_modification_trigger_...) on observed tables; mutations write table IDs into a temporary room_master table, and InvalidationTracker notifies active Flow observers.' },
        { id: 'opt-c', text: 'It intercepts Linux kernel disk write interrupts.' },
        { id: 'opt-d', text: 'It watches file size changes on flash storage.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Room uses SQLite triggers and an InvalidationTracker to dispatch reactive updates only when tables change.',
        keyConcept: 'Room Reactive Flow & InvalidationTracker Architecture',
        detailed: `When a DAO query returns a <code>Flow&lt;List&lt;T&gt;&gt;</code>, Room registers an <code>Observer</code> on the target tables. Room generates SQLite triggers that increment a modification count whenever <code>INSERT</code>, <code>UPDATE</code>, or <code>DELETE</code> occurs, signaling the Flow to re-execute the query and emit new data.`,
        realWorldPitfall: 'Direct raw SQLite database modifications bypassing Room do not fire InvalidationTracker unless triggers are maintained.',
        correctAnswerBreakdown: 'Option B is the precise internal architecture of Room InvalidationTracker.'
      }
    },
    {
      id: 's10-q5-sealed-class-reflection-r8',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Language: Exhaustive when on Sealed Hierarchies after R8 Shrinking',
      prompt: `Why does an exhaustive <code>when (state)</code> statement on a sealed hierarchy not require an <code>else</code> branch, and how does the compiler guarantee safety?`,
      options: [
        { id: 'opt-a', text: 'Because sealed classes are compiled into Java enums.' },
        { id: 'opt-b', text: 'All subclasses of a sealed class/interface are known at compile time within the same module/package; the Kotlin compiler verifies that every subclass branch is handled.' },
        { id: 'opt-c', text: 'The compiler inserts an invisible empty else branch at runtime.' },
        { id: 'opt-d', text: 'It uses reflection on Dalvik VM.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Sealed types restrict inheritance to compile-time known subclasses, enabling exhaustive compile-time verification.',
        keyConcept: 'Exhaustive Pattern Matching & Sealed Hierarchies',
        detailed: `Because all subclasses of a sealed class or interface must be defined in the same package and module, the compiler knows the closed universe of possible types. If a developer adds a new state (e.g. <code>SessionExpired</code>), the compiler breaks compilation across all <code>when</code> blocks, forcing developer resolution.`,
        realWorldPitfall: 'Adding a default `else -> {}` branch defeats this safety net: adding new states will be silently ignored!',
        correctAnswerBreakdown: 'Option B accurately highlights compile-time exhaustive guarantees.'
      }
    },
    {
      id: 's10-q6-coroutine-supervisorscope-vs-supervisorjob',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Coroutines: supervisorScope vs CoroutineScope(SupervisorJob())',
      prompt: `In an Android ViewModel:
<pre><code>fun syncData() {
    viewModelScope.launch {
        supervisorScope {
            launch { taskA() } // Throws exception
            launch { taskB() } // Sibling
        }
    }
}</code></pre>
What happens to <code>taskB()</code> when <code>taskA()</code> throws an unhandled exception inside <code>supervisorScope</code>?`,
      options: [
        { id: 'opt-a', text: 'taskB is cancelled immediately.' },
        { id: 'opt-b', text: 'taskB continues executing to completion because supervisorScope isolates child failures from cancelling siblings.' },
        { id: 'opt-c', text: 'The entire Android process crashes.' },
        { id: 'opt-d', text: 'taskA retries automatically 3 times.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'supervisorScope isolates child failures: failure in taskA does not cancel sibling taskB.',
        keyConcept: 'supervisorScope vs coroutineScope',
        detailed: `In <code>supervisorScope</code>, children are supervised: an exception in child 1 cancels child 1, but does NOT propagate cancellation to the parent or to siblings. Sibling <code>taskB</code> continues undisturbed.`,
        realWorldPitfall: 'Uncaught exceptions inside supervisorScope child `launch` still invoke the uncaught exception handler unless caught inside the child!',
        correctAnswerBreakdown: 'Option B correctly describes supervisorScope sibling isolation.'
      }
    },
    {
      id: 's10-q7-r8-missing-rules-crash',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Security & Build: ProGuard -dontwarn vs -keep Rules',
      prompt: `Why is adding <code>-dontwarn com.bank.sdk.**</code> to ProGuard/R8 configurations considered risky for production banking apps?`,
      options: [
        { id: 'opt-a', text: 'It disables AES encryption.' },
        { id: 'opt-b', text: '-dontwarn silences compiler warnings about missing referenced classes; if those missing classes are actually invoked at runtime, the app will crash with NoClassDefFoundError in production.' },
        { id: 'opt-c', text: 'It increases APK size by 50MB.' },
        { id: 'opt-d', text: 'It prevents app installation on Samsung phones.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '-dontwarn silences compile-time missing dependency warnings, hiding potential NoClassDefFoundError runtime crashes.',
        keyConcept: 'ProGuard/R8 Warning Resolution',
        detailed: `When R8 encounters unresolved references, it warns you because code might crash at runtime. Using <code>-dontwarn</code> tells the compiler "ignore this missing class". If your app executes code that depends on it, users crash with <code>NoClassDefFoundError</code>.`,
        realWorldPitfall: 'Silencing warnings with `-dontwarn` instead of adding the required transitive dependency.',
        correctAnswerBreakdown: 'Option B accurately explains the NoClassDefFoundError danger.'
      }
    },
    {
      id: 's10-q8-hilt-viewmodel-scoping',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Hilt Dependency Injection: Scoping Repositories in ViewModel',
      prompt: `If a repository <code>AccountRepository</code> is annotated with <code>@ActivityRetainedScoped</code>, what happens when it is injected into two different ViewModels in the same Activity?`,
      options: [
        { id: 'opt-a', text: 'Each ViewModel gets a separate new instance of the repository.' },
        { id: 'opt-b', text: 'Both ViewModels share the exact same instance of AccountRepository, and this instance survives screen rotations along with the ActivityRetainedComponent.' },
        { id: 'opt-c', text: 'Hilt throws a DaggerDuplicateBindingsException.' },
        { id: 'opt-d', text: 'The app crashes on rotation.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '@ActivityRetainedScoped creates a shared singleton across the ActivityRetainedComponent lifecycle, shared by all ViewModels in that Activity.',
        keyConcept: 'Hilt Scoping & Shared ViewModel Dependencies',
        detailed: `<code>ActivityRetainedComponent</code> lives as long as the Activity's ViewModelStore. Any binding marked with <code>@ActivityRetainedScoped</code> is a single shared instance across that Activity and all its ViewModels, surviving configuration changes.`,
        realWorldPitfall: 'Using unscoped bindings when you intended shared state across two ViewModels in the same flow.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },

    // DBMS Section
    {
      id: 's10-q9-cumulative-net-balance-30d',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: 30-Day Cumulative Net Balance Ledger',
      prompt: `Write an SQL query to calculate the cumulative net balance progression for each account over time, adding CREDIT amounts and subtracting DEBIT amounts.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>transaction_id</code>, <code>amount</code>, <code>transaction_type</code>, <code>timestamp</code>, and <code>net_balance</code>.
- Order by <code>account_id</code>, <code>timestamp</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp)`,
      expectedColumns: ['account_id', 'transaction_id', 'amount', 'transaction_type', 'timestamp', 'net_balance'],
      validationType: 'cumulative_net_balance',
      sampleSolution: `SELECT 
    account_id,
    transaction_id,
    amount,
    transaction_type,
    timestamp,
    SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE -amount END) OVER (
        PARTITION BY account_id 
        ORDER BY timestamp 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS net_balance
FROM transactions
WHERE status = 'SUCCESS'
ORDER BY account_id, timestamp;`,
      marks: 10,
      explanation: {
        summary: 'Window function SUM(CASE WHEN ... THEN amount ELSE -amount END) computes continuous running net balance.',
        keyConcept: 'Cumulative Net Balance in SQLite Ledgers',
        detailed: `Computes continuous running balance chronologically per account.`,
        realWorldPitfall: 'Failing to include `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` can group identical timestamps.',
        correctAnswerBreakdown: 'Calculates continuous account ledger.'
      }
    },
    {
      id: 's10-q10-customer-spending-tiers',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Categorize Accounts into Platinum, Gold, Silver Tiers',
      prompt: `Write an SQL query to categorize accounts into VIP tiers based on their total debit spend:
- <code>total_spent &gt;= 5000</code>: <code>'PLATINUM'</code>
- <code>total_spent &gt;= 1000</code>: <code>'GOLD'</code>
- Else: <code>'SILVER'</code>
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>total_spent</code>, <code>vip_tier</code>.`,
      schemaContext: `Table: transactions (account_id, amount, transaction_type, status)`,
      expectedColumns: ['account_id', 'total_spent', 'vip_tier'],
      validationType: 'customer_vip_tiers',
      sampleSolution: `SELECT 
    account_id,
    SUM(amount) AS total_spent,
    CASE 
        WHEN SUM(amount) >= 5000 THEN 'PLATINUM'
        WHEN SUM(amount) >= 1000 THEN 'GOLD'
        ELSE 'SILVER'
    END AS vip_tier
FROM transactions
WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
GROUP BY account_id
ORDER BY total_spent DESC;`,
      marks: 10,
      explanation: {
        summary: 'CASE WHEN evaluated on aggregate SUM(amount) classifies customers into tiers.',
        keyConcept: 'Customer Tier Segmentation',
        detailed: `Used for personalized loyalty rewards and VIP customer service routing.`,
        realWorldPitfall: 'Incorrect ordering of CASE conditions: checking >= 1000 before >= 5000 marks 5000 as GOLD!',
        correctAnswerBreakdown: 'ACC-103 is PLATINUM (8,570), ACC-101 is GOLD (2,000).'
      }
    },
    {
      id: 's10-q11-index-coverage-query',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Covering Index Optimization DDL',
      prompt: `Write the SQLite DDL to create a <strong>covering index</strong> named <code>idx_covering_txns</code> on <code>transactions</code> that covers:
<pre><code>SELECT transaction_id, amount, status FROM transactions WHERE account_id = ? AND timestamp > ?;</code></pre>`,
      schemaContext: `Table: transactions (transaction_id, account_id, timestamp, amount, status)`,
      expectedColumns: ['query_status'],
      validationType: 'covering_index_ddl',
      sampleSolution: `CREATE INDEX idx_covering_txns 
ON transactions(account_id, timestamp, amount, status, transaction_id);`,
      marks: 10,
      explanation: {
        summary: 'A covering index includes all query columns, fulfilling the query purely from the B-tree without visiting table rows.',
        keyConcept: 'Covering Indexes in SQLite & Room',
        detailed: `When an index contains all columns requested by a query (filtering + projection), SQLite performs an **Index-Only Scan**. No table heap lookup is required, reducing flash I/O to the absolute minimum.`,
        realWorldPitfall: 'Making indexes too wide can increase insert latency. Balance covering benefits against write volume.',
        correctAnswerBreakdown: 'CREATE INDEX idx_covering_txns ON transactions(account_id, timestamp, amount, status, transaction_id);'
      }
    },
    {
      id: 's10-q12-second-lowest-fee',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Second Lowest Debit Transaction in Manchester Central',
      prompt: `Find the second lowest debit transaction amount among customers whose account branch is <code>'Manchester Central'</code>.
<br/><br/>
<strong>Return:</strong>
- <code>second_lowest_amount</code>.`,
      schemaContext: `Tables: accounts (account_id, branch), transactions (account_id, amount, transaction_type, status)`,
      expectedColumns: ['second_lowest_amount'],
      validationType: 'second_lowest_manchester',
      sampleSolution: `SELECT DISTINCT t.amount AS second_lowest_amount
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
WHERE a.branch = 'Manchester Central' 
  AND t.transaction_type = 'DEBIT' 
  AND t.status = 'SUCCESS'
ORDER BY t.amount ASC
LIMIT 1 OFFSET 1;`,
      marks: 10,
      explanation: {
        summary: 'Orders by amount ASC and offsets by 1 to isolate second lowest transaction.',
        keyConcept: 'Filtered ASC Ranking with Offset',
        detailed: `Finds lower tier activity for branch audits.`,
        realWorldPitfall: 'Forgetting DISTINCT can return duplicate lowest amount instead of second lowest.',
        correctAnswerBreakdown: 'Returns 750.00 as second lowest debit in Manchester.'
      }
    },
    {
      id: 's10-q13-branch-audit-reconciliation',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Branch Reconciliation Audit Summary',
      prompt: `Write an SQL query to calculate for each branch:
- <code>branch</code>
- <code>account_count</code> (number of distinct accounts)
- <code>total_balance</code> (sum of account balances)
<br/>
Order by <code>total_balance DESC</code>.`,
      schemaContext: `Table: accounts (account_id, branch, balance)`,
      expectedColumns: ['branch', 'account_count', 'total_balance'],
      validationType: 'branch_reconciliation',
      sampleSolution: `SELECT 
    branch,
    COUNT(account_id) AS account_count,
    SUM(balance) AS total_balance
FROM accounts
GROUP BY branch
ORDER BY total_balance DESC;`,
      marks: 10,
      explanation: {
        summary: 'Groups accounts by branch and computes account count and aggregate liquidity.',
        keyConcept: 'Branch Ledger Reconciliation',
        detailed: `Summarizes branch banking balances.`,
        realWorldPitfall: 'London Canary Wharf has multiple accounts; GROUP BY ensures consolidation.',
        correctAnswerBreakdown: 'London Canary Wharf leads with 65,450.75.'
      }
    },

    // DSA Problem
    {
      id: 's10-q14-min-window-substring',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Minimum Window Substring (Exact Match Sliding Window)',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Algorithms &gt; Strings &amp; Sliding Window
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Minimum Window Substring
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(M + N) Time | O(Sigma) Space
  </span>
</div>
Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return the <strong>minimum window substring</strong> of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window. If there is no such substring, return the empty string <code>""</code>.
<br/><br/>
Must run in optimal <strong>O(m + n)</strong> runtime complexity.`,
      starterCode: `fun minWindow(s: String, t: String): String {
    if (s.isEmpty() || t.isEmpty() || s.length < t.length) return ""

    // TODO: Implement O(M + N) Sliding Window with character frequency counts

    return ""
}

fun main() {
    val s = "ADOBECODEBANC"
    val t = "ABC"
    println("Min Window: " + minWindow(s, t))
}`,
      solutionCode: `fun minWindow(s: String, t: String): String {
    if (s.isEmpty() || t.isEmpty() || s.length < t.length) return ""

    val targetMap = HashMap<Char, Int>()
    for (c in t) targetMap[c] = targetMap.getOrDefault(c, 0) + 1

    val windowMap = HashMap<Char, Int>()
    var have = 0
    val need = targetMap.size

    var resLen = Int.MAX_VALUE
    var resStart = 0
    var left = 0

    for (right in s.indices) {
        val c = s[right]
        windowMap[c] = windowMap.getOrDefault(c, 0) + 1

        if (targetMap.containsKey(c) && windowMap[c] == targetMap[c]) {
            have++
        }

        while (have == need) {
            // Update smallest window
            if (right - left + 1 < resLen) {
                resLen = right - left + 1
                resStart = left
            }

            // Shrink from the left
            val leftChar = s[left]
            windowMap[leftChar] = windowMap[leftChar]!! - 1
            if (targetMap.containsKey(leftChar) && windowMap[leftChar]! < targetMap[leftChar]!) {
                have--
            }
            left++
        }
    }

    return if (resLen != Int.MAX_VALUE) s.substring(resStart, resStart + resLen) else ""
}

fun main() {
    val s = "ADOBECODEBANC"
    val t = "ABC"
    println(minWindow(s, t))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Standard Search', input: 's = "ADOBECODEBANC", t = "ABC"', expected: 'BANC', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: Exact Match', input: 's = "a", t = "a"', expected: 'a', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: Impossible Target', input: 's = "a", t = "aa"', expected: '', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: Target at Start', input: 's = "abcde", t = "ab"', expected: 'ab', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Expanding right pointer until all characters match, then contracting left pointer solves Minimum Window Substring in O(M + N) time.',
        keyConcept: 'Sliding Window Two-Pointer Contraction with Frequency Counting',
        detailed: `Tracks <code>have == need</code> distinct character requirements. Once satisfied, the left pointer shrinks the window until the condition breaks, recording the minimal length window seen. Each character is visited at most twice (by left and right pointers), guaranteeing $O(M + N)$ time complexity.`,
        realWorldPitfall: 'Using `s.substring()` inside the loop creates garbage allocations: store indices `resStart` and `resLen` and slice once at the end!',
        correctAnswerBreakdown: 'Optimal O(M + N) algorithm.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's10-q15-android-arch-complete-banking-app',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Enterprise Banking App with Biometrics, Room & Compose',
      prompt: `Implement a complete <strong>Enterprise Mobile Banking Solution</strong> uniting Biometric Security (Android Keystore), Room SQLite Single Source of Truth, MVI StateFlow ViewModel, and Jetpack Compose Edge-to-Edge UI.`,
      starterCode: `// Enterprise Banking Architecture
// 1. DATA LAYER (Room Entity + Encrypted Storage)
// 2. DOMAIN LAYER (Result wrapper & UseCase)
// 3. PRESENTATION (ViewModel with StateFlow)
// 4. JETPACK COMPOSE UI (Edge-to-Edge with Scaffold)`,
      fullArchitectureCode: `package com.bank.mastery.complete

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*

sealed interface AppUiState {
    object Idle : AppUiState
    object Authenticated : AppUiState
    data class Error(val message: String) : AppUiState
}

class BankingAppViewModel(private val vault: BiometricVault) : ViewModel() {
    private val _uiState = MutableStateFlow<AppUiState>(AppUiState.Idle)
    val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()

    fun onBiometricSuccess() {
        _uiState.value = AppUiState.Authenticated
    }
}

interface BiometricVault {
    fun isDeviceSecure(): Boolean
}`,
      marks: 40,
      explanation: {
        summary: 'Integrates all four architectural tiers: Security, Persistence, Reactive Flow, and Declarative Compose.',
        keyConcept: 'Grand Senior Android Mobile Architecture',
        detailed: `Demonstrates master-level architectural competency across security, memory management, offline-first reliability, and reactive unidirectional data flow.`,
        realWorldPitfall: 'Failing to unit test the state transitions with Turbine.',
        correctAnswerBreakdown: 'Full production architecture.'
      }
    }
  ]
};
