/* ==========================================================================
   Assessment Set 5: Flow Backpressure, Testing & Moving Averages
   Focus: buffer/conflate, runTest with Turbine, 7-day moving averages,
          Kadane's algorithm, and WebSocket Real-Time Stream architecture.
   ========================================================================== */

export const ASSESSMENT_SET_5 = {
  id: 'set-5',
  number: 5,
  title: 'Set 5: Flow Backpressure, Channels & Moving Averages',
  shortTitle: 'Set 5: Flow Backpressure',
  focusArea: 'Flow Backpressure, Turbine Testing, Moving Averages & Kadane Algorithm',
  hackerEarthTrack: 'Data Structures > Arrays (Code Monk: Arrays)',
  hackerEarthChallenge: 'Code Monk: Maximum Subarray Sum (Kadane\'s Algorithm)',
  hackerEarthConcepts: ['Kadane\'s Algorithm', 'Dynamic Programming', 'Moving Average', 'Flow Backpressure', 'Channels'],
  difficulty: 'Senior Mobile Engineer',
  durationMinutes: 60,
  badge: 'Reactive Streams & Flow',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'Flow backpressure, buffer vs conflate, runTest, Turbine, and Kotlin Contracts.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: '7-day moving averages, weekend activity filters, SQLite Triggers, and branch maxima.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Kadane’s Maximum Subarray Sum for Net Ledger Volatility (O(N) time, O(1) space).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Real-Time Currency Exchange Stream with WebSockets and Flow.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's5-q1-flow-buffer-conflate',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Flow: Backpressure Handling with buffer() vs conflate()',
      prompt: `A market ticker emits 100 stock price updates per second. The UI collector takes 50ms to render each frame:
<pre><code>tickerFlow
    .conflate()
    .collect { renderFrame(it) }</code></pre>
What is the exact behavior of <code>conflate()</code> under this backpressure condition?`,
      options: [
        { id: 'opt-a', text: 'It suspends the emitter until the collector finishes rendering each frame.' },
        { id: 'opt-b', text: 'It skips intermediate emissions while the collector is busy, delivering only the most up-to-date emission when the collector is ready.' },
        { id: 'opt-c', text: 'It throws a BufferOverflowException.' },
        { id: 'opt-d', text: 'It spawns 100 background threads to process all emissions concurrently.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'conflate() drops intermediate values when downstream is slower than upstream, keeping only latest.',
        keyConcept: 'Flow Backpressure & Conflation',
        detailed: `In standard cold Flow, emissions are synchronous: the emitter suspends until the collector finishes. With <code>conflate()</code>, the emitter never suspends; if the collector is busy rendering frame $N$, intermediate emissions $N+1, N+2$ are dropped, and the collector jumps straight to $N+3$.`,
        realWorldPitfall: 'Using unbounded `buffer()` on fast streams: causes memory consumption to swell until OutOfMemoryError.',
        correctAnswerBreakdown: 'Option B accurately defines conflate.'
      }
    },
    {
      id: 's5-q2-runtest-standardtestdispatcher',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Coroutine Testing: StandardTestDispatcher vs UnconfinedTestDispatcher',
      prompt: `When unit testing a ViewModel with <code>kotlinx.coroutines.test.runTest</code>, what is the key difference between:
<code>StandardTestDispatcher</code> and <code>UnconfinedTestDispatcher</code>?`,
      options: [
        { id: 'opt-a', text: 'StandardTestDispatcher queues coroutines on a virtual scheduler and requires advanceUntilIdle() or runCurrent() to progress, while UnconfinedTestDispatcher executes eagerly.' },
        { id: 'opt-b', text: 'UnconfinedTestDispatcher only works on Android devices, not on the JVM.' },
        { id: 'opt-c', text: 'StandardTestDispatcher uses real wall-clock time delays.' },
        { id: 'opt-d', text: 'There is no difference; they are interchangeable aliases.' }
      ],
      correctOptionId: 'opt-a',
      marks: 5,
      explanation: {
        summary: 'StandardTestDispatcher queues coroutines until manually advanced; UnconfinedTestDispatcher executes eagerly.',
        keyConcept: 'Virtual Time & Test Dispatchers in Coroutines 1.6+',
        detailed: `<code>StandardTestDispatcher</code> provides deterministic control: calling <code>viewModel.load()</code> queues the coroutine. You explicitly control time with <code>testScheduler.advanceUntilIdle()</code> to assert state progression (e.g. Loading -> Success). <code>UnconfinedTestDispatcher</code> executes immediately until the first suspension point.`,
        realWorldPitfall: 'Using real Thread.sleep() in unit tests instead of virtual time control.',
        correctAnswerBreakdown: 'Option A is the official coroutines test specification.'
      }
    },
    {
      id: 's5-q3-turbine-flow-testing',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Testing Flow: CashApp Turbine Library for StateFlow Emissions',
      prompt: `In a unit test asserting ViewModel StateFlow emissions using Turbine:
<pre><code>viewModel.uiState.test {
    assertEquals(UiState.Loading, awaitItem())
    viewModel.onRefresh()
    assertEquals(UiState.Success(data), awaitItem())
}</code></pre>
What happens if <code>viewModel.onRefresh()</code> fails to emit any item within the Turbine timeout?`,
      options: [
        { id: 'opt-a', text: 'The test hangs forever until manually terminated.' },
        { id: 'opt-b', text: 'Turbine throws an AssertionError indicating no item was received within the timeout window.' },
        { id: 'opt-c', text: 'The assertion returns null.' },
        { id: 'opt-d', text: 'The test passes with a warning.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Turbine enforces timeouts and fails tests with clear assertion errors when expected emissions do not arrive.',
        keyConcept: 'Turbine Testing Framework for Kotlin Flow',
        detailed: `Turbine intercepts Flow events (values, errors, completion). If an expected <code>awaitItem()</code> does not emit within the configured timeout (default 3 seconds), Turbine fails the test immediately with an <code>AssertionError: No value produced in 3s</code>.`,
        realWorldPitfall: 'Collecting Flow manually in unit tests with `launch` without cancelling the scope causes test leaks.',
        correctAnswerBreakdown: 'Option B accurately explains Turbine assertion failure.'
      }
    },
    {
      id: 's5-q4-kotlin-contracts',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Language: Smart Casting & Kotlin Contracts',
      prompt: `Why can the compiler smart-cast <code>s</code> to non-null after <code>requireNotNull(s)</code> or <code>s.isNullOrEmpty()</code>?`,
      options: [
        { id: 'opt-a', text: 'Kotlin uses runtime bytecode bytecode inspection.' },
        { id: 'opt-b', text: 'The standard library uses Kotlin Contracts (contract { returns(...) implies ... }) informing the compiler about conditions that hold true when the function returns.' },
        { id: 'opt-c', text: 'All Kotlin functions perform automatic smart casts.' },
        { id: 'opt-d', text: 'It relies on Java annotations.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Kotlin Contracts communicate function behavior and effects back to the compiler type checker.',
        keyConcept: 'Kotlin Contracts & Compiler Guarantees',
        detailed: `A contract declaration like:
<pre><code>contract { returns(false) implies (this != null) }</code></pre>
allows the compiler frontend to prove that if <code>s.isNullOrBlank()</code> evaluates to <code>false</code>, <code>s</code> cannot be null, enabling safe smart-casting without explicit null checks.`,
        realWorldPitfall: 'Writing custom validation utility functions without contracts prevents the compiler from smart casting.',
        correctAnswerBreakdown: 'Option B accurately identifies Kotlin Contracts.'
      }
    },
    {
      id: 's5-q5-cold-vs-hot-flow',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Reactive Streams: Cold Flow vs Hot Flow Execution',
      prompt: `What is the fundamental difference between a <strong>Cold Flow</strong> (e.g. <code>flow { ... }</code>) and a <strong>Hot Flow</strong> (e.g. <code>SharedFlow</code>)?`,
      options: [
        { id: 'opt-a', text: 'Cold Flow emits items regardless of subscribers; Hot Flow only starts emitting when collected.' },
        { id: 'opt-b', text: 'Cold Flow executes its producer block independently for each new collector; Hot Flow produces values independently of whether there are any collectors present.' },
        { id: 'opt-c', text: 'Hot Flow runs only on the GPU.' },
        { id: 'opt-d', text: 'Cold Flow cannot be converted to StateFlow.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Cold flows start on-demand per subscriber; hot flows emit continuously regardless of active collectors.',
        keyConcept: 'Cold vs Hot Reactive Stream Semantics',
        detailed: `A cold flow (like an HTTP call wrapped in <code>flow { emit(api.getData()) }</code>) does nothing until <code>collect()</code> is invoked, and re-executes for every subscriber. A hot flow (like a SharedFlow connected to a WebSocket) broadcasts data continuously to all current listeners.`,
        realWorldPitfall: 'Connecting multiple UI observers to a Cold Flow triggers duplicate network calls for each observer.',
        correctAnswerBreakdown: 'Option B correctly contrasts Cold and Hot flows.'
      }
    },
    {
      id: 's5-q6-solid-design-principles',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'OOPs Architecture: The SOLID Design Principles',
      prompt: `A developer defines:
<pre><code>interface PaymentProcessor {
    fun processCardPayment(card: Card)
    fun processCryptoPayment(wallet: CryptoWallet)
    fun processUpiPayment(vpa: String)
}</code></pre>
A <code>CreditCardGateway</code> class implements this interface but throws <code>UnsupportedOperationException</code> for <code>processCryptoPayment</code> and <code>processUpiPayment</code>.
Which <strong>SOLID</strong> design principles are directly violated here?`,
      options: [
        { id: 'opt-a', text: 'Single Responsibility Principle (SRP) only.' },
        { id: 'opt-b', text: 'Interface Segregation Principle (ISP) and Liskov Substitution Principle (LSP).' },
        { id: 'opt-c', text: 'Dependency Inversion Principle (DIP) only.' },
        { id: 'opt-d', text: 'Open-Closed Principle (OCP) only.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Fat interfaces forcing dummy/throwing method implementations violate Interface Segregation (ISP) and Liskov Substitution (LSP).',
        keyConcept: 'SOLID Principles in Clean Architecture',
        detailed: `1. <strong>Interface Segregation Principle (ISP):</strong> Clients should not be forced to depend upon interfaces they do not use. <code>PaymentProcessor</code> is a "fat" interface. Breaking it into <code>CardPaymentProcessor</code>, <code>UpiPaymentProcessor</code> adheres to ISP.
2. <strong>Liskov Substitution Principle (LSP):</strong> Subtypes must be substitutable for their base types without altering correctness. Throwing <code>UnsupportedOperationException</code> breaks callers expecting any <code>PaymentProcessor</code> to execute payments.
3. <strong>Other SOLID principles:</strong>
- <strong>SRP:</strong> A class should have one, and only one, reason to change.
- <strong>OCP:</strong> Open for extension, closed for modification (use abstractions/strategy pattern).
- <strong>DIP:</strong> High-level modules should not depend on low-level modules; both depend on abstractions.`,
        realWorldPitfall: 'Creating monolithic "God" interfaces in Android view contracts where Activities implement 20 empty listener callbacks.',
        correctAnswerBreakdown: 'Option B correctly identifies both ISP and LSP violations.'
      }
    },
    {
      id: 's5-q7-os-process-vs-thread',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Operating Systems & Concurrency: Process vs Thread Architecture',
      prompt: `What is the fundamental architectural difference between an <strong>Operating System Process</strong> and a <strong>Thread</strong> in modern Linux/Android kernels?`,
      options: [
        { id: 'opt-a', text: 'Processes share the same virtual memory space and file descriptors, whereas threads have isolated memory spaces.' },
        { id: 'opt-b', text: 'A Process has its own independent virtual address space, memory pages, and system resources; Threads within the same process share the heap, code segment, and file descriptors, but maintain their own private stack and program counter (PC).' },
        { id: 'opt-c', text: 'Threads require IPC (Inter-Process Communication) like AIDL or Unix domain sockets to communicate with each other.' },
        { id: 'opt-d', text: 'A process crash only terminates one thread, leaving the rest of the application active.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Processes have isolated virtual memory spaces; threads within the same process share heap memory but have private stacks.',
        keyConcept: 'OS Process vs Thread Execution Models',
        detailed: `In Linux/Android (where threads are lightweight processes scheduled by the kernel via <code>clone()</code>):
- <strong>Process:</strong> Unit of resource allocation (isolated virtual address space, page tables, PID, file descriptors, security sandboxing). Communicating across processes requires IPC (Binder/AIDL, Sockets, Pipes) and incurs heavy context-switch penalties (TLB invalidation).
- <strong>Thread:</strong> Unit of CPU execution within a process. Threads share the heap, globals, and open files, enabling fast memory sharing (with race condition risks requiring Mutex/Locks) while retaining their own register state, Program Counter, and call stack.`,
        realWorldPitfall: 'Assuming multi-threading isolates crashes: an unhandled exception or SIGSEGV on any background thread terminates the entire process.',
        correctAnswerBreakdown: 'Option B is the precise OS architectural distinction.'
      }
    },
    {
      id: 's5-q8-custom-compose-layout',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: Custom Layout Measure & Placement Pass',
      prompt: `When building a custom layout using <code>Layout(content) { measurables, constraints -&gt; ... }</code> in Compose, why must <code>placeable.placeRelative()</code> be called inside <code>layout(width, height) { ... }</code>?`,
      options: [
        { id: 'opt-a', text: 'To ensure children are drawn with hardware acceleration.' },
        { id: 'opt-b', text: 'placeRelative automatically supports Right-to-Left (RTL) locales like Arabic and Hebrew without manual coordinate inversion.' },
        { id: 'opt-c', text: 'It compiles to an Android View ViewGroup.' },
        { id: 'opt-d', text: 'It prevents the child from recomposing.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'placeRelative respects RTL layout direction, mirroring X coordinates automatically.',
        keyConcept: 'Custom Compose Layouts & RTL Internationalization',
        detailed: `In Jetpack Compose custom layouts, <code>placeable.place()</code> uses absolute coordinates. Calling <code>placeable.placeRelative()</code> automatically mirrors X coordinates in Right-to-Left (RTL) locales (such as Arabic or Hebrew), ensuring global banking compliance without extra code.`,
        realWorldPitfall: 'Using `place()` instead of `placeRelative()` breaks RTL layouts.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },

    // DBMS Section
    {
      id: 's5-q9-moving-average',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: 3-Transaction Rolling Average per Account',
      prompt: `Calculate the 3-transaction moving average of debit amounts for each account over time.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>transaction_id</code>, <code>amount</code>, and <code>moving_avg</code> rounded to 2 decimal places.
- Use <code>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp)`,
      expectedColumns: ['account_id', 'transaction_id', 'amount', 'moving_avg'],
      validationType: 'moving_average',
      sampleSolution: `SELECT 
    account_id,
    transaction_id,
    amount,
    ROUND(AVG(amount) OVER (
        PARTITION BY account_id 
        ORDER BY timestamp 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ), 2) AS moving_avg
FROM transactions
WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
ORDER BY account_id, timestamp;`,
      marks: 10,
      explanation: {
        summary: 'AVG(amount) OVER (PARTITION BY ... ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) calculates moving average.',
        keyConcept: 'Rolling Window Frames in SQLite 3.25+',
        detailed: `Specifying <code>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code> explicitly bounds the window frame to at most 3 rows (current + previous 2), smoothing out spending volatility.`,
        realWorldPitfall: 'Omitting frame specification defaults to unbounded preceding, computing cumulative average instead of moving average.',
        correctAnswerBreakdown: 'Correctly computes rolling average.'
      }
    },
    {
      id: 's5-q10-weekend-activity',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Filter Weekend Transactions with strftime(%w)',
      prompt: `Write an SQL query to retrieve all transactions that occurred on a weekend (Sunday = 0, Saturday = 6).
<br/><br/>
<strong>Return:</strong>
- <code>transaction_id</code>, <code>account_id</code>, <code>amount</code>, <code>timestamp</code>, and <code>day_of_week</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['transaction_id', 'account_id', 'amount', 'timestamp', 'day_of_week'],
      validationType: 'weekend_filter',
      sampleSolution: `SELECT 
    transaction_id,
    account_id,
    amount,
    timestamp,
    strftime('%w', timestamp) AS day_of_week
FROM transactions
WHERE strftime('%w', timestamp) IN ('0', '6');`,
      marks: 10,
      explanation: {
        summary: 'strftime("%w", timestamp) returns day of week (0 = Sunday, 6 = Saturday).',
        keyConcept: 'SQLite Date/Time Functions (%w)',
        detailed: `Banks monitor weekend transactions for automated settlement and higher fraud probability.`,
        realWorldPitfall: 'strftime returns strings, so compare with string literals ("0", "6") not numbers.',
        correctAnswerBreakdown: 'Filters weekend rows correctly.'
      }
    },
    {
      id: 's5-q11-branch-maxima',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Account with Highest Balance in Each Branch',
      prompt: `Find the account with the highest balance in each branch using <code>ROW_NUMBER()</code>.
<br/><br/>
<strong>Return:</strong>
- <code>branch</code>, <code>customer_name</code>, <code>balance</code>.`,
      schemaContext: `Table: accounts (account_id, customer_name, branch, balance)`,
      expectedColumns: ['branch', 'customer_name', 'balance'],
      validationType: 'branch_maxima',
      sampleSolution: `WITH BranchRanked AS (
    SELECT 
        branch,
        customer_name,
        balance,
        ROW_NUMBER() OVER (PARTITION BY branch ORDER BY balance DESC) as rnk
    FROM accounts
)
SELECT branch, customer_name, balance
FROM BranchRanked
WHERE rnk = 1;`,
      marks: 10,
      explanation: {
        summary: 'ROW_NUMBER() OVER (PARTITION BY branch ORDER BY balance DESC) isolates branch leader.',
        keyConcept: 'Partition Maxima with Window Functions',
        detailed: `Partitions by branch and orders by balance descending. Selecting rnk = 1 yields the richest customer in each branch.`,
        realWorldPitfall: 'Using GROUP BY branch, balance without window functions can produce indeterminate names in SQLite.',
        correctAnswerBreakdown: 'Isolates top customer per branch.'
      }
    },
    {
      id: 's5-q12-sqlite-trigger',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Create SQLite Trigger for Balance Deduction',
      prompt: `Write SQLite DDL to create an automatic trigger named <code>trg_deduct_debit</code> that decrements <code>accounts.balance</code> by <code>NEW.amount</code> whenever a new transaction with <code>transaction_type = 'DEBIT'</code> is inserted.`,
      schemaContext: `Tables: accounts (account_id, balance), transactions (account_id, amount, transaction_type)`,
      expectedColumns: ['query_status'],
      validationType: 'trigger_ddl',
      sampleSolution: `CREATE TRIGGER trg_deduct_debit 
AFTER INSERT ON transactions
WHEN NEW.transaction_type = 'DEBIT'
BEGIN
    UPDATE accounts 
    SET balance = balance - NEW.amount 
    WHERE account_id = NEW.account_id;
END;`,
      marks: 10,
      explanation: {
        summary: 'SQLite AFTER INSERT triggers execute atomic updates on dependent tables.',
        keyConcept: 'SQLite Triggers for Ledger Integrity',
        detailed: `Triggers enforce business rules directly at the SQLite engine layer, ensuring balance updates occur even if application code bypasses repository logic.`,
        realWorldPitfall: 'Forgetting the WHEN condition triggers deductions on CREDIT transactions too!',
        correctAnswerBreakdown: 'CREATE TRIGGER trg_deduct_debit ...'
      }
    },
    {
      id: 's5-q13-anti-join-not-exists',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Unreferenced Accounts with NOT EXISTS',
      prompt: `Write an SQL query to retrieve all accounts that have made zero DEBIT transactions using <code>NOT EXISTS</code>.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>customer_name</code>.`,
      schemaContext: `Tables: accounts (account_id, customer_name), transactions (account_id, transaction_type, status)`,
      expectedColumns: ['account_id', 'customer_name'],
      validationType: 'zero_debits_not_exists',
      sampleSolution: `SELECT 
    a.account_id,
    a.customer_name
FROM accounts a
WHERE NOT EXISTS (
    SELECT 1 FROM transactions t 
    WHERE t.account_id = a.account_id 
      AND t.transaction_type = 'DEBIT'
);`,
      marks: 10,
      explanation: {
        summary: 'NOT EXISTS with correlated filter isolates accounts with no debit activity.',
        keyConcept: 'Targeted Anti-Join Subqueries',
        detailed: `Correlates accounts with transactions to identify credit-only or dormant accounts.`,
        realWorldPitfall: 'Using NOT IN can fail with NULL transaction records.',
        correctAnswerBreakdown: 'Accounts ACC-104 and ACC-105 returned.'
      }
    },

    // DSA Problem
    {
      id: 's5-q14-kadane-subarray',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Maximum Subarray Sum (Kadane’s Algorithm)',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Data Structures &gt; Arrays
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Kadane's Maximum Subarray
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(N) Time | O(1) Space
  </span>
</div>
Given an integer array <code>nums</code> of daily net ledger profit/loss amounts, find the contiguous subarray (containing at least one number) which has the <strong>largest sum</strong> and return its sum in optimal <strong>O(N)</strong> time and <strong>O(1)</strong> space.`,
      starterCode: `fun maxSubArray(nums: IntArray): Int {
    if (nums.isEmpty()) return 0

    // TODO: Implement Kadane's Algorithm in O(N) time and O(1) space

    return 0
}

fun main() {
    val arr = intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)
    println("Max Sum: " + maxSubArray(arr))
}`,
      solutionCode: `fun maxSubArray(nums: IntArray): Int {
    if (nums.isEmpty()) return 0
    var currentSum = nums[0]
    var maxSum = nums[0]

    for (i in 1 until nums.size) {
        val num = nums[i]
        // Either extend the existing subarray or start a new subarray at current element
        currentSum = maxOf(num, currentSum + num)
        maxSum = maxOf(maxSum, currentSum)
    }

    return maxSum
}

fun main() {
    val arr = intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)
    println(maxSubArray(arr))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Standard Mixed Sequence', input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: Single Element', input: '[1]', expected: '1', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: All Negative Numbers', input: '[-5,-2,-8,-1]', expected: '-1', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: All Positive Numbers', input: '[5,4,1,7,8]', expected: '25', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Kadane’s algorithm computes maximum subarray sum in a single pass O(N) with O(1) space.',
        keyConcept: 'Dynamic Programming / Kadane’s Greedy Invariant',
        detailed: `At each step $i$, <code>currentSum = maxOf(nums[i], currentSum + nums[i])</code> decides whether continuing the prior sequence is advantageous or whether starting fresh at index $i$ gives a higher sum. Space is strictly $O(1)$.`,
        realWorldPitfall: 'Initializing `maxSum = 0`: if all numbers are negative, the answer should be the least negative number (e.g. -1), not 0!',
        correctAnswerBreakdown: 'Subarray [4, -1, 2, 1] gives maximum sum 6.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's5-q15-android-arch-trade-stream',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Real-Time Currency Exchange Stream',
      prompt: `Implement a <strong>Real-Time Currency Exchange Stream Screen</strong> in Jetpack Compose, consuming continuous price tick Flow from a WebSocket, applying conflate() to prevent UI dropped frames, and handling lifecycle pauses.`,
      starterCode: `// Real-Time Currency Stream
// 1. WEBSOCKET CLIENT EMITTING Flow<FxTick>
// 2. VIEWMODEL WITH conflate() and stateIn()
// 3. COMPOSE TICKER SCREEN`,
      fullArchitectureCode: `package com.bank.mastery.trade

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*

data class FxTick(val pair: String, val price: Double, val timestamp: Long)

class CurrencyTickerViewModel(private val repository: FxRepository) : ViewModel() {
    val liveRates: StateFlow<FxTick?> = repository.observeRates()
        .conflate()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)
}

interface FxRepository {
    fun observeRates(): Flow<FxTick>
}`,
      marks: 40,
      explanation: {
        summary: 'Uses Flow.conflate() and WhileSubscribed(5000) for high-frequency real-time stock/FX tickers.',
        keyConcept: 'High-Frequency Stream Conflation in Android',
        detailed: `Financial exchanges push 200+ price updates/sec. Without <code>conflate()</code>, the Android Choreographer drops frames trying to recompose on every tick. Conflate drops obsolete ticks, preserving 60fps rendering.`,
        realWorldPitfall: 'Buffering unlimited ticks causes memory bloat and displays stale prices to users.',
        correctAnswerBreakdown: 'Full reactive WebSocket stream integration.'
      }
    }
  ]
};
