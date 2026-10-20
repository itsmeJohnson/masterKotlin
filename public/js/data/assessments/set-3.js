/* ==========================================================================
   Assessment Set 3: Compose Internals, Side Effects & Window Partitioning
   Focus: LaunchedEffect, rememberUpdatedState, LAG window function,
          Longest Substring Without Repeating, and Debounced Search.
   ========================================================================== */

export const ASSESSMENT_SET_3 = {
  id: 'set-3',
  number: 3,
  title: 'Set 3: Compose Internals, Side Effects & Window Functions',
  shortTitle: 'Set 3: Compose & LAG',
  focusArea: 'Side Effects, rememberUpdatedState, LAG() Window Functions & Sliding Window',
  hackerEarthTrack: 'Algorithms > Strings & Variable Sliding Window',
  hackerEarthChallenge: 'Code Monk: String Manipulation & Variable Sliding Window',
  hackerEarthConcepts: ['Variable Sliding Window', 'Hash Table Frequency', 'Compose Internals', 'LAG() Window Functions'],
  difficulty: 'Senior Mobile Engineer',
  durationMinutes: 60,
  badge: 'Compose Internals',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'LaunchedEffect, DisposableEffect, rememberUpdatedState, shareIn/stateIn, and Custom Dispatchers.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'LAG/LEAD window functions, session gap detection, DENSE_RANK vs RANK, and SQLite JSON1.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Longest Substring Without Repeating Characters (Sliding Window with HashMap).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Build a Reactive Search & Filter with Debounce and Flow.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's3-q1-remember-updated-state',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: rememberUpdatedState for Long-Lived Effects',
      prompt: `Consider this composable that performs a delayed biometric session refresh:
<pre><code>@Composable
fun SessionTimer(onTimeout: () -&gt; Unit) {
    val currentOnTimeout by rememberUpdatedState(onTimeout)
    LaunchedEffect(Unit) {
        delay(30_000)
        currentOnTimeout()
    }
}</code></pre>
Why is <code>rememberUpdatedState</code> required here instead of directly invoking <code>onTimeout()</code> inside <code>LaunchedEffect(Unit)</code>?`,
      options: [
        { id: 'opt-a', text: 'Without rememberUpdatedState, the delay function will throw a ConcurrentModificationException.' },
        { id: 'opt-b', text: 'LaunchedEffect(Unit) does not restart when onTimeout lambda changes in parent recomposition; without rememberUpdatedState, the coroutine would capture and invoke a stale reference of onTimeout.' },
        { id: 'opt-c', text: 'rememberUpdatedState converts onTimeout into a thread-safe AtomicReference.' },
        { id: 'opt-d', text: 'rememberUpdatedState is required only when running in preview mode.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'rememberUpdatedState allows long-running coroutines to call the newest instance of a callback without restarting the effect.',
        keyConcept: 'Compose rememberUpdatedState & Avoiding Stale Lambdas',
        detailed: `<code>LaunchedEffect(Unit)</code> launches once on initial composition and runs for 30 seconds.
If the parent composable recomposes with a new lambda instance for <code>onTimeout</code>, the running coroutine would normally retain the old, stale lambda captured at launch.
<code>rememberUpdatedState</code> maintains a mutable state reference updated on every recomposition, ensuring the 30-second timer always executes the freshest callback.`,
        realWorldPitfall: 'Restarting the effect by passing `onTimeout` as key to `LaunchedEffect(onTimeout)` resets the 30-second timer on every recomposition!',
        correctAnswerBreakdown: 'Option B accurately explains the stale lambda capture problem.'
      }
    },
    {
      id: 's3-q2-disposable-effect',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: DisposableEffect & Teardown Lifecycle',
      prompt: `In an Android app listening to GPS location updates for an ATM locator screen:
<pre><code>@Composable
fun AtmLocationTracker(locationManager: LocationManager) {
    DisposableEffect(locationManager) {
        val listener = LocationListener { ... }
        locationManager.requestLocationUpdates(listener)
        onDispose {
            locationManager.removeUpdates(listener)
        }
    }
}</code></pre>
When is the <code>onDispose</code> block guaranteed to execute?`,
      options: [
        { id: 'opt-a', text: 'Only when the entire Android application process is killed.' },
        { id: 'opt-b', text: 'Whenever the composable leaves the composition (is removed from the UI tree) or when the key (locationManager) changes.' },
        { id: 'opt-c', text: 'Every time any sibling composable recomposes.' },
        { id: 'opt-d', text: 'Only on device screen lock.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'onDispose runs when keys change or when the composable leaves the composition.',
        keyConcept: 'DisposableEffect Resource Teardown',
        detailed: `<code>DisposableEffect</code> is built for side-effects that require clean-up (listeners, observers, camera bindings). The <code>onDispose</code> lambda executes whenever the key changes or the composable is removed from the composition tree, preventing listener leaks.`,
        realWorldPitfall: 'Failing to include `onDispose` in `DisposableEffect` produces a compile-time error in Jetpack Compose.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's3-q3-sharing-started-whilesubscribed',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Flow: SharingStarted.WhileSubscribed(5000) Mechanics',
      prompt: `In modern Android architecture:
<pre><code>val transactions: StateFlow&lt;UiState&gt; = repository.observeTransactions()
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = UiState.Loading
    )</code></pre>
What is the specific purpose of the <code>5000</code> millisecond parameter (stopTimeoutMillis)?`,
      options: [
        { id: 'opt-a', text: 'It sets the network request timeout to 5 seconds.' },
        { id: 'opt-b', text: 'It keeps the upstream Flow active for 5 seconds after the last UI collector unsubscribes, preventing coroutine cancellation and re-fetching during screen rotations.' },
        { id: 'opt-c', text: 'It delays the initial emission of data by 5 seconds.' },
        { id: 'opt-d', text: 'It polls the database every 5 seconds for new changes.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '5000ms delay bridges the gap during Activity recreation on screen rotation before stopping the upstream flow.',
        keyConcept: 'WhileSubscribed Configuration Change Tolerance',
        detailed: `When an Activity rotates, <code>repeatOnLifecycle</code> cancels the UI collector in <code>onStop()</code> and re-subscribes in <code>onStart()</code> of the new Activity (typically taking ~200-500ms).
With <code>SharingStarted.WhileSubscribed(5000)</code>, the upstream coroutine stays alive for 5 seconds, avoiding cancelling in-flight network requests or restarting database streams during rotation.`,
        realWorldPitfall: 'Using `SharingStarted.Eagerly` keeps the database Flow active indefinitely even when the user minimizes the app, draining battery.',
        correctAnswerBreakdown: 'Option B correctly describes rotation tolerance.'
      }
    },
    {
      id: 's3-q4-custom-dispatchers',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Concurrency: Dispatchers.Default vs Dispatchers.IO Thread Sizing',
      prompt: `What is the thread pool sizing difference between <code>Dispatchers.Default</code> and <code>Dispatchers.IO</code> in Kotlin Coroutines?`,
      options: [
        { id: 'opt-a', text: 'Dispatchers.Default is capped at CPU core count (minimum 2); Dispatchers.IO is elastic and can grow up to 64 threads (or core count if greater) for blocking I/O.' },
        { id: 'opt-b', text: 'Both dispatchers share a single fixed thread.' },
        { id: 'opt-c', text: 'Dispatchers.IO is single-threaded while Dispatchers.Default has 1000 threads.' },
        { id: 'opt-d', text: 'Dispatchers.Default uses Android OS Binder threads.' }
      ],
      correctOptionId: 'opt-a',
      marks: 5,
      explanation: {
        summary: 'Dispatchers.Default is sized to CPU cores; Dispatchers.IO expands up to 64 threads for blocking I/O.',
        keyConcept: 'Coroutine Thread Pool Elasticity',
        detailed: `<code>Dispatchers.Default</code> is designed for CPU-intensive work (sorting, JSON parsing, crypto), limited to available CPU cores to prevent thread thrashing. <code>Dispatchers.IO</code> shares threads with Default but allows offloading blocking calls (file I/O, sockets) by expanding up to 64 threads.`,
        realWorldPitfall: 'Running heavy blocking I/O on `Dispatchers.Default` starves CPU compute tasks.',
        correctAnswerBreakdown: 'Option A is the official coroutines thread sizing specification.'
      }
    },
    {
      id: 's3-q5-sealed-interfaces',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Language: Sealed Interfaces vs Sealed Classes',
      prompt: `Why are <code>sealed interface</code> constructs preferred over <code>sealed class</code> in Kotlin 1.5+ for modeling MVI UiState and Domain Results?`,
      options: [
        { id: 'opt-a', text: 'Sealed interfaces can be instantiated directly with reflection.' },
        { id: 'opt-b', text: 'Sealed interfaces allow multiple inheritance (a class or data object can implement multiple sealed interfaces) and have zero constructor overhead.' },
        { id: 'opt-c', text: 'Sealed classes cannot have data class subclasses.' },
        { id: 'opt-d', text: 'Sealed interfaces run faster on the Dalvik VM.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Sealed interfaces allow a type to belong to multiple sealed hierarchies simultaneously.',
        keyConcept: 'Kotlin Sealed Interfaces & Hierarchies',
        detailed: `In complex architectures, a single domain event (e.g. <code>NetworkError</code>) may need to implement both <code>AppError</code> and <code>UiNotification</code>. Because Kotlin classes only support single inheritance, <code>sealed interface</code> allows multi-category classification while maintaining exhaustive <code>when</code> branching.`,
        realWorldPitfall: 'Using enum classes for UI state: enums cannot carry dynamic payloads per branch.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's3-q6-polymorphism-static-vs-dynamic',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'OOPs Polymorphism: Static (Compile-Time) vs Dynamic (Runtime) Method Dispatch',
      prompt: `Which statement accurately contrasts <strong>Static Polymorphism (Compile-time)</strong> and <strong>Dynamic Polymorphism (Runtime)</strong> in object-oriented programming?`,
      options: [
        { id: 'opt-a', text: 'Static polymorphism is resolved at runtime using virtual method tables (vtables); dynamic polymorphism is resolved at compile time via method overloading.' },
        { id: 'opt-b', text: 'Static polymorphism is achieved through Method Overloading where the compiler binds method calls based on argument signature; Dynamic polymorphism is achieved through Method Overriding where the JVM invokes the implementation based on the actual runtime object instance using a vtable.' },
        { id: 'opt-c', text: 'Dynamic polymorphism can only be used with final classes.' },
        { id: 'opt-d', text: 'Static polymorphism requires the open keyword on Kotlin classes.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Static polymorphism (overloading) is resolved at compile-time by method signatures; Dynamic polymorphism (overriding) is resolved at runtime via vtables.',
        keyConcept: 'OOPs Polymorphism: Static vs Dynamic Binding',
        detailed: `Core distinction frequently tested by Barclays:
1. <strong>Static Polymorphism (Early / Compile-time Binding)</strong>:
   - Implemented via <strong>Method Overloading</strong> (same function name, different parameter types/counts).
   - Compiler determines exactly which method to invoke during compilation. Faster execution with no runtime dispatch overhead.
2. <strong>Dynamic Polymorphism (Late / Runtime Binding)</strong>:
   - Implemented via <strong>Method Overriding</strong> (subclass provides specific implementation of parent virtual method).
   - The JVM uses a <strong>vtable (Virtual Method Table)</strong> to look up the target method at runtime based on the actual allocated heap instance, enabling runtime polymorphism (e.g. <code>val payment: Payment = ApplePay(); payment.process()</code>).`,
        realWorldPitfall: 'Confusing overloading with overriding: overloading uses compile-time static types of references, while overriding resolves to the actual runtime heap instance.',
        correctAnswerBreakdown: 'Option B accurately defines the distinction between overloading and vtable-based overriding.'
      }
    },
    {
      id: 's3-q7-abstract-class-vs-interface',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'OOPs Architecture: Abstract Class vs Interface in Modern Kotlin',
      prompt: `When designing a mobile banking SDK, when should you choose an <strong>Abstract Class</strong> over an <strong>Interface</strong> in Kotlin?`,
      options: [
        { id: 'opt-a', text: 'When you need a class to implement multiple contracts simultaneously.' },
        { id: 'opt-b', text: 'When you need to define constructor parameters, manage internal non-static mutable state (backing fields), or enforce access control with protected visibility, whereas interfaces cannot store state with backing fields.' },
        { id: 'opt-c', text: 'Interfaces run on background threads while abstract classes run on Main.' },
        { id: 'opt-d', text: 'Abstract classes can be instantiated directly without subclasses.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Abstract classes can hold state with backing fields and constructors; interfaces define stateless contracts (even with default implementations).',
        keyConcept: 'Abstract Class vs Interface Trade-offs',
        detailed: `In Kotlin:
- <strong>Abstract Class</strong>: Can have constructors with parameters, state with backing fields (<code>var balance: Double = 0.0</code>), and <code>protected</code> members. A class can inherit from only <strong>one</strong> abstract class (single inheritance).
- <strong>Interface</strong>: Cannot have constructors or backing fields (can only have abstract or getter-calculated properties). A class can implement <strong>multiple</strong> interfaces.
Rule of thumb: Use an interface to define a capability/contract (<code>Payable</code>, <code>Auditable</code>); use an abstract class for a common base template sharing internal mutable state and initialization logic.`,
        realWorldPitfall: 'Attempting to declare a property with an initial value in an interface: `val x: Int = 5` is forbidden in interfaces because they have no backing fields.',
        correctAnswerBreakdown: 'Option B accurately identifies constructors, backing fields, and state management.'
      }
    },
    {
      id: 's3-q8-compose-compiler-phases',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: Composition, Layout & Drawing Phases',
      prompt: `When an animated offset changes on every frame (e.g. 60fps card swipe), what is the most performant way to apply the offset in Jetpack Compose to skip both the Composition and Layout phases?`,
      options: [
        { id: 'opt-a', text: 'Modifier.offset(x = offsetState.value.dp)' },
        { id: 'opt-b', text: 'Modifier.offset { IntOffset(offsetState.value.roundToInt(), 0) } (lambda modifier)' },
        { id: 'opt-c', text: 'Modifier.padding(start = offsetState.value.dp)' },
        { id: 'opt-d', text: 'Re-calling the composable function inside a while loop.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Lambda-based modifiers defer state reads to the Layout or Draw phase, completely skipping the Composition phase.',
        keyConcept: 'Compose 3 Phases & Phase Deferral',
        detailed: `Jetpack Compose executes in 3 phases:
1. **Composition** (What to show)
2. **Layout** (Where to place it)
3. **Drawing** (How to render it)
Reading state during Composition (e.g. <code>Modifier.offset(x.dp)</code>) triggers recomposition on every pixel change. Using the lambda version <code>Modifier.offset { ... }</code> defers the read to the Layout phase, achieving smooth 60fps animations with zero recomposition.`,
        realWorldPitfall: 'Reading rapidly changing animation states in the Composition phase causes dropped frames.',
        correctAnswerBreakdown: 'Option B skips composition via lambda phase deferral.'
      }
    },

    // DBMS Section
    {
      id: 's3-q9-lag-transaction-difference',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Difference Between Consecutive Transactions using LAG()',
      prompt: `Write an SQL query using <strong>LAG()</strong> to compute the difference in amount between each transaction and the previous transaction for that account.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>transaction_id</code>, <code>amount</code>, <code>prev_amount</code>, and <code>amount_diff</code>.
- Order by <code>account_id</code>, then <code>timestamp</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status, timestamp)`,
      expectedColumns: ['account_id', 'transaction_id', 'amount', 'prev_amount', 'amount_diff'],
      validationType: 'lag_difference',
      sampleSolution: `SELECT 
    account_id,
    transaction_id,
    amount,
    LAG(amount, 1, 0) OVER (PARTITION BY account_id ORDER BY timestamp) AS prev_amount,
    ROUND(amount - LAG(amount, 1, 0) OVER (PARTITION BY account_id ORDER BY timestamp), 2) AS amount_diff
FROM transactions
ORDER BY account_id, timestamp;`,
      marks: 10,
      explanation: {
        summary: 'LAG(amount, 1, 0) OVER (PARTITION BY account_id ORDER BY timestamp) accesses the preceding row.',
        keyConcept: 'SQLite LAG/LEAD Window Analytics',
        detailed: `<code>LAG(col, offset, default)</code> accesses preceding rows within the partition without self-joins. This is used in fraud detection to spot sudden spikes in transaction amounts compared to immediate history.`,
        realWorldPitfall: 'Forgetting default value 0 leads to NULL results for the first transaction in an account.',
        correctAnswerBreakdown: 'Correctly computes amount_diff against previous transaction.'
      }
    },
    {
      id: 's3-q10-rank-vs-dense-rank',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Rank Accounts by Balance with DENSE_RANK()',
      prompt: `Rank all accounts by their <code>balance</code> in descending order using <strong>DENSE_RANK()</strong> so that there are no gaps in ranking values if accounts have equal balances.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>customer_name</code>, <code>balance</code>, and <code>balance_rank</code>.`,
      schemaContext: `Table: accounts (account_id, customer_name, branch, balance)`,
      expectedColumns: ['account_id', 'customer_name', 'balance', 'balance_rank'],
      validationType: 'dense_rank_accounts',
      sampleSolution: `SELECT 
    account_id,
    customer_name,
    balance,
    DENSE_RANK() OVER (ORDER BY balance DESC) AS balance_rank
FROM accounts
ORDER BY balance_rank;`,
      marks: 10,
      explanation: {
        summary: 'DENSE_RANK() does not skip rank values when duplicate balances occur.',
        keyConcept: 'DENSE_RANK vs RANK',
        detailed: `If two accounts share rank 2:
- <code>RANK()</code> assigns 1, 2, 2, 4 (gaps exist).
- <code>DENSE_RANK()</code> assigns 1, 2, 2, 3 (no gaps).
In financial leaderboards and tier qualifications, DENSE_RANK is standard.`,
        realWorldPitfall: 'Using `RANK()` when consecutive numbering without gaps is required.',
        correctAnswerBreakdown: 'Accounts ranked correctly by balance descending.'
      }
    },
    {
      id: 's3-q11-unbalanced-accounts',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Detect Accounts with Debits Exceeding Balance',
      prompt: `Find accounts whose total debit spending exceeds their current <code>balance</code>.
<br/><br/>
<strong>Return:</strong>
- <code>a.account_id</code>, <code>a.customer_name</code>, <code>a.balance</code>, and <code>total_debits</code>.`,
      schemaContext: `Tables: accounts (account_id, customer_name, balance), transactions (account_id, amount, transaction_type, status)`,
      expectedColumns: ['account_id', 'customer_name', 'balance', 'total_debits'],
      validationType: 'unbalanced_accounts',
      sampleSolution: `SELECT 
    a.account_id,
    a.customer_name,
    a.balance,
    SUM(t.amount) AS total_debits
FROM accounts a
JOIN transactions t ON a.account_id = t.account_id
WHERE t.transaction_type = 'DEBIT' AND t.status = 'SUCCESS'
GROUP BY a.account_id, a.customer_name, a.balance
HAVING SUM(t.amount) > a.balance;`,
      marks: 10,
      explanation: {
        summary: 'HAVING SUM(t.amount) > a.balance compares aggregate sum against column value.',
        keyConcept: 'Aggregates vs Non-Aggregate Comparisons in HAVING',
        detailed: `In SQL, <code>HAVING</code> can compare aggregate functions (<code>SUM(t.amount)</code>) against grouped non-aggregate columns (<code>a.balance</code>) to spot overdraft anomalies.`,
        realWorldPitfall: 'Trying to compare aggregate expressions inside the WHERE clause.',
        correctAnswerBreakdown: 'Isolates accounts with negative net liquidity.'
      }
    },
    {
      id: 's3-q12-sqlite-json-extract',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Query Nested JSON Data in SQLite',
      prompt: `In SQLite, modern Room entities can store metadata as JSON text.
Write an SQL query using <code>json_extract()</code> to extract the device IP from a JSON column named <code>metadata</code>.
<pre><code>SELECT transaction_id, json_extract(metadata, '$.ip_address') AS client_ip FROM transaction_logs;</code></pre>`,
      schemaContext: `Table: transaction_logs (transaction_id, metadata)`,
      expectedColumns: ['transaction_id', 'client_ip'],
      validationType: 'json_extract',
      sampleSolution: `SELECT 
    transaction_id, 
    json_extract(metadata, '$.ip_address') AS client_ip 
FROM transaction_logs;`,
      marks: 10,
      explanation: {
        summary: 'SQLite JSON1 extension allows querying structured JSON properties directly.',
        keyConcept: 'SQLite JSON1 Extension & json_extract',
        detailed: `SQLite 3.38+ bundles JSON1 functions into core. <code>json_extract(column, '$.property')</code> reads nested fields without deserializing the whole object in Kotlin code.`,
        realWorldPitfall: 'Incorrect JSON path syntax: path must start with `$.`.',
        correctAnswerBreakdown: 'json_extract(metadata, "$.ip_address") extracts the field.'
      }
    },
    {
      id: 's3-q13-consecutive-failed-transactions',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Identify Accounts with Multiple Failed Transactions',
      prompt: `Find all <code>account_id</code>s that have recorded <strong>at least 1 FAILED transaction</strong>.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>failed_count</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, status)`,
      expectedColumns: ['account_id', 'failed_count'],
      validationType: 'failed_transactions_count',
      sampleSolution: `SELECT 
    account_id,
    COUNT(*) AS failed_count
FROM transactions
WHERE status = 'FAILED'
GROUP BY account_id
HAVING COUNT(*) >= 1;`,
      marks: 10,
      explanation: {
        summary: 'Filters by status = "FAILED" and counts grouped by account_id.',
        keyConcept: 'Group Filtering on Audit Statuses',
        detailed: `Spotting failed transactions is critical for risk scoring and account suspension.`,
        realWorldPitfall: 'Counting all transactions instead of filtering by status = "FAILED".',
        correctAnswerBreakdown: 'ACC-102 has 1 failed transaction.'
      }
    },

    // DSA Problem
    {
      id: 's3-q14-longest-substring',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Longest Substring Without Repeating Characters',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Algorithms &gt; Strings
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Variable Sliding Window &amp; Hash Map
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(N) Time | O(min(N, Sigma)) Space
  </span>
</div>
Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters in optimal <strong>O(N)</strong> time.`,
      starterCode: `fun lengthOfLongestSubstring(s: String): Int {
    var maxLen = 0
    var left = 0
    val lastSeen = HashMap<Char, Int>()

    // TODO: Implement O(N) Sliding Window with lastSeen HashMap

    return maxLen
}

fun main() {
    val s = "abcba"
    println("Result: " + lengthOfLongestSubstring(s))
}`,
      solutionCode: `fun lengthOfLongestSubstring(s: String): Int {
    var maxLen = 0
    var left = 0
    val lastSeen = HashMap<Char, Int>()

    for (right in s.indices) {
        val ch = s[right]
        if (lastSeen.containsKey(ch)) {
            // Jump left pointer forward past the duplicate's last index
            left = maxOf(left, lastSeen[ch]!! + 1)
        }
        lastSeen[ch] = right
        maxLen = maxOf(maxLen, right - left + 1)
    }

    return maxLen
}

fun main() {
    val s = "abcba"
    println(lengthOfLongestSubstring(s))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: abcba', input: 's = "abcba"', expected: '3', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: All identical characters', input: 's = "bbbbb"', expected: '1', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: pwwkew', input: 's = "pwwkew"', expected: '3', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: Empty string', input: 's = ""', expected: '0', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Sliding window with HashMap tracking character indices solves the problem in O(N) time.',
        keyConcept: 'Sliding Window with Index Mapping',
        detailed: `Using <code>lastSeen[ch] = right</code> maps each character to its most recent index. When a duplicate is seen, <code>left = maxOf(left, lastSeen[ch] + 1)</code> slides the left pointer without rescanning, guaranteeing linear time complexity.`,
        realWorldPitfall: 'Directly assigning `left = lastSeen[ch] + 1` without `maxOf`: if a character was seen prior to the current left pointer, left jumps backwards!',
        correctAnswerBreakdown: 'Optimal O(N) sliding window solution.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's3-q15-android-arch-debounced-search',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Reactive Search with Debounce & Flow',
      prompt: `Implement a production <strong>Payee / Merchant Search Screen</strong> in Jetpack Compose and Kotlin Flow.
<br/><br/>
<strong>Requirements:</strong>
1. 300ms debounce on search text input to prevent flooding the backend API.
2. <code>distinctUntilChanged()</code> to avoid querying identical queries.
3. <code>flatMapLatest</code> to cancel previous in-flight network searches when new text is typed.
4. Compose search bar with loading and empty result states.`,
      starterCode: `// Payee Reactive Search Architecture
// 1. VIEWMODEL with MutableStateFlow query
// 2. FLOW PIPELINE (debounce + distinctUntilChanged + flatMapLatest)
// 3. COMPOSE UI (SearchBar with items)`,
      fullArchitectureCode: `package com.bank.mastery.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items

data class Payee(val id: String, val name: String, val accountNumber: String)

class PayeeSearchViewModel(private val apiService: PayeeApiService) : ViewModel() {
    val searchQuery = MutableStateFlow("")

    val searchResults: StateFlow<List<Payee>> = searchQuery
        .debounce(300)
        .distinctUntilChanged()
        .filter { it.trim().length >= 2 }
        .flatMapLatest { query ->
            flow { emit(apiService.searchPayees(query)) }
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
}

interface PayeeApiService {
    suspend fun searchPayees(query: String): List<Payee>
}`,
      marks: 40,
      explanation: {
        summary: 'Uses debounce(300), distinctUntilChanged(), and flatMapLatest() for optimal search UX.',
        keyConcept: 'Reactive Search Flow Optimization',
        detailed: `Calling an API on every keystroke causes race conditions and server overloading.
- <code>debounce(300)</code> waits until user pauses typing.
- <code>distinctUntilChanged()</code> avoids redundant queries.
- <code>flatMapLatest</code> cancels prior in-flight coroutines if user types again.`,
        realWorldPitfall: 'Using `flatMapMerge` instead of `flatMapLatest`: old slow responses can overwrite newer fast responses (out-of-order response bug).',
        correctAnswerBreakdown: 'Complete reactive search ViewModel with cancellation.'
      }
    }
  ]
};
