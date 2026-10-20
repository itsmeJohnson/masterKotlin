/* ==========================================================================
   Assessment Set 14: Advanced Concurrency, Deadlocks & Thread Synchronization
   Focus: Coffman Deadlock Conditions, SupervisorJob vs Job, ReentrantLock,
          Trapping Rain Water (Two Pointers O(1) space).
   ========================================================================== */

export const ASSESSMENT_SET_14 = {
  id: 'set-14',
  number: 14,
  title: 'Set 14: Concurrency, Deadlocks & Thread Synchronization',
  shortTitle: 'Set 14: Concurrency & Deadlocks',
  focusArea: 'Coffman Deadlocks, SupervisorJob, ConcurrentHashMap & Trapping Rain Water',
  hackerEarthTrack: 'Algorithms > Dynamic Programming & Two Pointers',
  hackerEarthChallenge: 'Code Monk: Trapping Rain Water in O(1) Auxiliary Space',
  hackerEarthConcepts: ['Two Pointers Trapping', 'O(1) Space', 'Coffman Conditions', 'SupervisorJob'],
  difficulty: 'Senior / Lead Mobile Engineer',
  durationMinutes: 75,
  badge: 'Concurrency Architect',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Advanced Concurrency, Deadlocks & Thread Synchronization',
      shortTitle: 'Concurrency & Deadlocks',
      icon: '🔒',
      description: 'Senior multithreading: Coffman deadlock breaking, SupervisorJob failure isolation, ConcurrentHashMap, and async exception handling.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Set difference (EXCEPT), 10-second rapid velocity fraud, and optimistic concurrency DDL.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Trapping Rain Water in O(N) Time and O(1) Auxiliary Space using Two Pointers.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Thread-safe in-memory Banking LRU Cache with TTL and Mutex.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's14-q1-coffman-deadlock-conditions',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'OS & Concurrency: The 4 Coffman Deadlock Conditions',
      prompt: `A deadlock can occur if and only if all four <strong>Coffman Conditions</strong> hold simultaneously:
1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait
In production mobile banking software, which condition is most practically broken to eliminate deadlocks?`,
      options: [
        { id: 'opt-a', text: 'Condition 1: By making all memory readable and writable without locks.' },
        { id: 'opt-b', text: 'Condition 4: By enforcing a strict global lock acquisition ordering (e.g. always acquiring Lock A before Lock B based on resource ID), eliminating the possibility of a Circular Wait cycle.' },
        { id: 'opt-c', text: 'Condition 3: By force-terminating any thread holding a lock.' },
        { id: 'opt-d', text: 'Condition 2: By forcing all threads to run on a single CPU core.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Enforcing a strict global lock acquisition order breaks Circular Wait, mathematically preventing deadlocks.',
        keyConcept: 'Coffman Deadlock Conditions & Lock Hierarchy Ordering',
        detailed: `The 4 Coffman Conditions are:
1. <strong>Mutual Exclusion:</strong> Resources cannot be shared concurrently.
2. <strong>Hold & Wait:</strong> Threads holding allocated resources can request new ones.
3. <strong>No Preemption:</strong> Locks cannot be forcibly confiscated.
4. <strong>Circular Wait:</strong> Thread 1 waits for Lock B (held by Thread 2), while Thread 2 waits for Lock A (held by Thread 1).
Breaking Circular Wait via <strong>Lock Ordering</strong> (e.g. if transferring funds between Account 101 and Account 204, always acquire the lock on <code>min(id1, id2)</code> first) guarantees no circular cycle can ever form!`,
        realWorldPitfall: 'Acquiring multiple locks in random or incoming parameter order in bank transfer methods leads to rare, catastrophic deadlocks under load.',
        correctAnswerBreakdown: 'Option B accurately identifies breaking Circular Wait via lock ordering.'
      }
    },
    {
      id: 's14-q2-supervisor-job-vs-job',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Coroutines: SupervisorJob vs Standard Job Failure Isolation',
      prompt: `Consider this coroutine scope:
<pre><code>val scope = CoroutineScope(Job() + Dispatchers.IO)
scope.launch { throw RuntimeException("Network crash") }
scope.launch { fetchUserProfile() }</code></pre>
What happens to <code>fetchUserProfile()</code> when the first launch throws an uncaught exception?`,
      options: [
        { id: 'opt-a', text: 'fetchUserProfile() continues running normally.' },
        { id: 'opt-b', text: 'Because a standard Job propagates child cancellation upwards, the parent Job is cancelled, which immediately cancels all sibling coroutines including fetchUserProfile(). Replacing Job() with SupervisorJob() is required to isolate child failures.' },
        { id: 'opt-c', text: 'The app reboots the Android OS.' },
        { id: 'opt-d', text: 'Dispatchers.IO switches to Dispatchers.Main.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'A standard Job cancels all siblings when one child fails; SupervisorJob isolates child failures.',
        keyConcept: 'Structured Concurrency: Job vs SupervisorJob',
        detailed: `In standard Kotlin Structured Concurrency:
- <code>Job</code>: Failure is bidirectional. If child A fails, it cancels the parent scope, which cancels child B, C, etc.
- <code>SupervisorJob</code>: Failure is unidirectional (downwards only). A failure in child A does NOT cancel the parent or its sibling coroutines.
<code>viewModelScope</code> uses <code>SupervisorJob()</code> internally so that a failed subtask does not crash all active ViewModel observers.`,
        realWorldPitfall: 'Using `CoroutineScope(Job())` for long-lived application services: one failed analytics ping permanently cancels the entire service!',
        correctAnswerBreakdown: 'Option B accurately explains sibling cancellation and SupervisorJob.'
      }
    },
    {
      id: 's14-q3-async-coroutine-exception-handler',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Coroutines Internals: CoroutineExceptionHandler with async vs launch',
      prompt: `Why does attaching a <code>CoroutineExceptionHandler</code> to an <code>async</code> builder have no effect?
<pre><code>val deferred = scope.async(handler) {
    throw IllegalStateException("API error")
}</code></pre>`,
      options: [
        { id: 'opt-a', text: 'CoroutineExceptionHandler only works on Android 12+.' },
        { id: 'opt-b', text: 'async encapsulates exceptions inside the resulting Deferred object. The exception is only re-thrown when deferred.await() is invoked. CoroutineExceptionHandler is only invoked by root launch coroutines.' },
        { id: 'opt-c', text: 'async cannot throw exceptions.' },
        { id: 'opt-d', text: 'handler must be written in Java.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'async encapsulates exceptions in the Deferred result; CoroutineExceptionHandler only intercepts unhandled exceptions in launch.',
        keyConcept: 'Exception Propagation in async vs launch',
        detailed: `<code>CoroutineExceptionHandler</code> is a global catch mechanism for "fire-and-forget" coroutines started with <code>launch</code>.
<code>async</code> represents a future value: it wraps both successful results and exceptions inside <code>Deferred&lt;T&gt;</code>.
When <code>deferred.await()</code> is called, the exception is rethrown directly at the call site, where standard <code>try-catch</code> must be used.`,
        realWorldPitfall: 'Passing CoroutineExceptionHandler to async and expecting it to prevent app crashes when await() is called.',
        correctAnswerBreakdown: 'Option B accurately details exception encapsulation in Deferred.'
      }
    },
    {
      id: 's14-q4-reentrant-lock-fairness-trylock',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Java Concurrency: ReentrantLock tryLock() vs synchronized',
      prompt: `What major operational advantage does <code>java.util.concurrent.locks.ReentrantLock</code> have over the intrinsic <code>synchronized</code> block in high-frequency trading or UI applications?`,
      options: [
        { id: 'opt-a', text: 'ReentrantLock runs without consuming memory.' },
        { id: 'opt-b', text: 'ReentrantLock provides tryLock(timeout, unit), allowing a thread to give up if the lock cannot be acquired within a deadline, preventing permanent UI thread freezes. It also supports fair queueing and interruptible lock acquisition.' },
        { id: 'opt-c', text: 'ReentrantLock is automatic and requires no unlocking.' },
        { id: 'opt-d', text: 'synchronized locks are deprecated on Android.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'ReentrantLock supports timed tryLock, interruptible acquisition, and fair scheduling, whereas synchronized blocks unconditionally forever.',
        keyConcept: 'ReentrantLock Advanced Capabilities',
        detailed: `With intrinsic <code>synchronized</code>:
If Thread A holds the lock and hangs, Thread B will block forever with no way to timeout or interrupt it.
<code>ReentrantLock</code> offers:
1. <code>tryLock(500, TimeUnit.MILLISECONDS)</code>: Returns false if busy, allowing the app to show a "Network busy, please retry" alert instead of an ANR.
2. <code>lockInterruptibly()</code>: Responds to thread cancellation.
3. <code>new ReentrantLock(true)</code>: Enforces FIFO fair lock granting.`,
        realWorldPitfall: 'Forgetting to call `lock.unlock()` inside a `finally` block: if an exception occurs, the lock remains held forever!',
        correctAnswerBreakdown: 'Option B accurately highlights tryLock, timeouts, and interruptibility.'
      }
    },
    {
      id: 's14-q5-concurrent-hash-map-buckets',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Data Structures: ConcurrentHashMap Striped Locking & CAS',
      prompt: `Why does <code>ConcurrentHashMap</code> drastically outperform <code>Collections.synchronizedMap()</code> under high concurrent multi-threaded read/write workloads?`,
      options: [
        { id: 'opt-a', text: 'ConcurrentHashMap runs on the GPU.' },
        { id: 'opt-b', text: 'synchronizedMap locks the entire map with a single global mutex for every operation (serializing all readers and writers). ConcurrentHashMap uses CAS (Compare-And-Swap) for empty bucket insertions and synchronized locks only on the specific bucket head node, allowing concurrent reads without locking.' },
        { id: 'opt-c', text: 'ConcurrentHashMap allows only 1 thread at a time.' },
        { id: 'opt-d', text: 'ConcurrentHashMap does not support hash codes.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'ConcurrentHashMap uses bucket-level locking and lock-free CAS, enabling multiple threads to read and write simultaneously.',
        keyConcept: 'Striped Bucket Locking vs Global Monitor',
        detailed: `<code>Collections.synchronizedMap</code> wraps a standard HashMap with <code>synchronized (mutex)</code>. Every read and write locks the entire data structure, creating massive thread contention.
In <code>ConcurrentHashMap</code> (Java 8+):
1. Reads (<code>get()</code>) are generally lock-free using volatile reads.
2. Writes to empty buckets use atomic CAS (no locking).
3. Writes to occupied buckets lock <strong>only the first node of that specific hash bucket</strong> (Node tree/linked list), allowing threads writing to different buckets to proceed in parallel.`,
        realWorldPitfall: 'Using ConcurrentHashMap compound operations (e.g. check-then-act `if (!map.containsKey(k)) map.put(k, v)`) without `computeIfAbsent()`: compound operations are not atomic across calls!',
        correctAnswerBreakdown: 'Option B accurately explains bucket-level locking and CAS.'
      }
    },
    {
      id: 's14-q6-thread-starvation-dispatchers-default',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Coroutine Diagnostics: Thread Starvation on Dispatchers.Default',
      prompt: `<code>Dispatchers.Default</code> uses a thread pool with size equal to the number of CPU cores (e.g. 8 threads on an octa-core phone).
What happens if you launch 8 coroutines that execute infinite non-suspending mathematical loops:
<pre><code>repeat(8) {
    scope.launch(Dispatchers.Default) {
        while (true) { /* Heavy crypto loop without suspend */ }
    }
}</code></pre>`,
      options: [
        { id: 'opt-a', text: 'The coroutines runtime automatically spawns 100 new threads to handle other work.' },
        { id: 'opt-b', text: 'All 8 worker threads of Dispatchers.Default are 100% occupied. Any subsequent coroutine dispatched to Dispatchers.Default will starve and never execute until one of the loops yields with yield() or suspends.' },
        { id: 'opt-c', text: 'The phone battery is protected by throttling threads to 1 FPS.' },
        { id: 'opt-d', text: 'The compiler throws a ThreadStarvationException.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Non-suspending CPU loops monopolize Dispatchers.Default worker threads, causing thread starvation.',
        keyConcept: 'Coroutine Thread Starvation & Cooperative Multitasking',
        detailed: `Kotlin Coroutines rely on <strong>cooperative multitasking</strong>.
Because <code>Dispatchers.Default</code> limits its thread count to CPU core count ($N_{\\text{cores}}$), running non-suspending tight loops on all threads exhausts the thread pool.
Other coroutines queued on <code>Dispatchers.Default</code> cannot run.
To fix: call <code>yield()</code> periodically in CPU-intensive loops or check <code>isActive</code>.`,
        realWorldPitfall: 'Running blocking image compression or cryptographic hashing without `yield()` freezes other background coroutines.',
        correctAnswerBreakdown: 'Option B accurately describes thread starvation under CPU saturation.'
      }
    },
    {
      id: 's14-q7-countdown-latch-vs-cyclic-barrier',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Java Concurrency: CountDownLatch vs CyclicBarrier',
      prompt: `What is the key architectural difference between <code>CountDownLatch</code> and <code>CyclicBarrier</code>?`,
      options: [
        { id: 'opt-a', text: 'CountDownLatch cannot be used in mobile applications.' },
        { id: 'opt-b', text: 'A CountDownLatch cannot be reset (it is a one-shot countdown to 0). A CyclicBarrier can be reset and reused across multiple iterative cycles, coordinating threads to wait for each other at a common barrier point.' },
        { id: 'opt-c', text: 'CyclicBarrier only works with 1 thread.' },
        { id: 'opt-d', text: 'CountDownLatch requires coroutines.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'CountDownLatch is a one-shot countdown; CyclicBarrier is reusable across iterative phases.',
        keyConcept: 'CountDownLatch vs CyclicBarrier',
        detailed: `- <code>CountDownLatch(N)</code>: Calling <code>latch.countDown()</code> decrements the counter. When it reaches 0, all waiting threads unblock. Once at 0, it cannot be reused.
- <code>CyclicBarrier(N)</code>: All $N$ threads call <code>barrier.await()</code>. When all $N$ arrive, the barrier trips, an optional barrier action runs, and the barrier resets automatically for the next cycle.`,
        realWorldPitfall: 'Trying to reuse a CountDownLatch for subsequent network batches: once tripped, it remains at 0 forever.',
        correctAnswerBreakdown: 'Option B correctly highlights one-shot vs reusable barrier semantics.'
      }
    },
    {
      id: 's14-q8-copy-on-write-array-list-tradeoffs',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Data Structures: CopyOnWriteArrayList Read/Write Trade-offs',
      prompt: `When is <code>CopyOnWriteArrayList</code> ideal, and why is it terrible for frequent write operations?`,
      options: [
        { id: 'opt-a', text: 'It is ideal for database storage; terrible for memory.' },
        { id: 'opt-b', text: 'It is ideal for read-heavy observer/listener lists where reads are frequent and fast without locking; it is terrible for frequent writes because every write (add/remove) makes an entire clone of the underlying array, causing massive GC pressure and memory allocations.' },
        { id: 'opt-c', text: 'It only allows 10 elements max.' },
        { id: 'opt-d', text: 'It is deprecated in Android 11.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'CopyOnWriteArrayList provides lock-free iteration by cloning the backing array on every single modification.',
        keyConcept: 'CopyOnWriteArrayList Memory & CPU Characteristics',
        detailed: `In <code>CopyOnWriteArrayList</code>:
- Iterators read an immutable snapshot of the backing array: <code>ConcurrentModificationException</code> is impossible even if other threads modify the list during iteration.
- Every mutation (<code>add</code>, <code>remove</code>, <code>set</code>) clones the entire underlying array. If the list has 10,000 items, inserting 100 items allocates 1,000,000 object references in heap memory!`,
        realWorldPitfall: 'Using CopyOnWriteArrayList for an incoming 1000-msg/sec WebSocket buffer exhausts heap memory immediately.',
        correctAnswerBreakdown: 'Option B accurately explains lock-free reads vs array clone write penalties.'
      }
    },

    // DBMS Section
    {
      id: 's14-q9-set-difference-activity-churn',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Customer Churn Detection via Set Difference (EXCEPT)',
      prompt: `Identify all accounts that performed transactions in <code>'2026-10'</code> (October) but had <strong>ZERO</strong> transactions in <code>'2026-11'</code> (November).
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>
- Use the SQL <code>EXCEPT</code> operator.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['account_id'],
      validationType: 'churn_except_query',
      sampleSolution: `SELECT DISTINCT account_id 
FROM transactions 
WHERE strftime('%Y-%m', timestamp) = '2026-10'
EXCEPT 
SELECT DISTINCT account_id 
FROM transactions 
WHERE strftime('%Y-%m', timestamp) = '2026-11';`,
      marks: 10,
      explanation: {
        summary: 'EXCEPT operator returns rows from the first query that do not exist in the second query.',
        keyConcept: 'Relational Set Difference (EXCEPT)',
        detailed: `Set operations (<code>UNION</code>, <code>INTERSECT</code>, <code>EXCEPT</code>) operate on full result sets. <code>Query_A EXCEPT Query_B</code> subtracts all accounts active in November from October's active accounts to produce the churn list.`,
        realWorldPitfall: 'Using UNION instead of EXCEPT.',
        correctAnswerBreakdown: 'Selects Oct accounts EXCEPT Nov accounts.'
      }
    },
    {
      id: 's14-q10-ten-second-velocity-fraud',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: High-Velocity Rapid Fire Fraud (< 10 Seconds Apart)',
      prompt: `Detect high-frequency card brute-force attacks: find all accounts that submitted two or more transactions within <strong>10 seconds</strong> of each other.
<br/><br/>
<strong>Return:</strong>
- <code>t1.account_id</code>, <code>t1.transaction_id AS txn_1</code>, <code>t2.transaction_id AS txn_2</code>, and <code>second_diff</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['account_id', 'txn_1', 'txn_2', 'second_diff'],
      validationType: 'rapid_velocity_fraud',
      sampleSolution: `SELECT 
    t1.account_id,
    t1.transaction_id AS txn_1,
    t2.transaction_id AS txn_2,
    CAST((strftime('%s', t2.timestamp) - strftime('%s', t1.timestamp)) AS INTEGER) AS second_diff
FROM transactions t1
JOIN transactions t2 ON t1.account_id = t2.account_id
    AND t1.transaction_id < t2.transaction_id
    AND strftime('%s', t2.timestamp) >= strftime('%s', t1.timestamp)
    AND (strftime('%s', t2.timestamp) - strftime('%s', t1.timestamp)) <= 10
ORDER BY t1.account_id, second_diff ASC;`,
      marks: 10,
      explanation: {
        summary: 'Self-join on timestamp difference in epoch seconds isolates rapid transactions within 10s.',
        keyConcept: 'Time Delta Fraud Velocity Metrics',
        detailed: `Converting timestamps to epoch seconds via <code>strftime('%s', timestamp)</code> allows direct integer arithmetic. Joining where difference is $\\le 10$ identifies automated card stuffing bots.`,
        realWorldPitfall: 'Using date subtraction without epoch conversion.',
        correctAnswerBreakdown: 'Self-join checking epoch second delta <= 10.'
      }
    },
    {
      id: 's14-q11-optimistic-locking-version-ddl',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Optimistic Concurrency Control (OCC) DDL & UPDATE',
      prompt: `Write an SQL <code>UPDATE</code> statement to decrement an account balance by <code>$250.00</code> using <strong>Optimistic Concurrency Control</strong>:
- Account ID: <code>'ACC-101'</code>
- Expected Version: <code>4</code>
- Increment the <code>version</code> column by <code>1</code> if and only if the current version matches 4.`,
      schemaContext: `Table: accounts (account_id, balance, version)`,
      expectedColumns: ['query_status'],
      validationType: 'optimistic_lock_update',
      sampleSolution: `UPDATE accounts 
SET balance = balance - 250.00,
    version = version + 1
WHERE account_id = 'ACC-101' AND version = 4;`,
      marks: 10,
      explanation: {
        summary: 'Optimistic locking checks and increments a version column, detecting concurrent collisions if rows affected = 0.',
        keyConcept: 'Optimistic Concurrency Control (OCC)',
        detailed: `In mobile apps, holding database locks across network calls is forbidden. With OCC:
1. App reads account: balance = $1000, version = 4.
2. User submits transfer.
3. App executes <code>UPDATE ... WHERE account_id = ? AND version = 4</code>.
If another thread or device updated the account in between, the version is now 5. The UPDATE affects 0 rows, signalling an <code>OptimisticLockException</code> so the app can refresh and retry!`,
        realWorldPitfall: 'Omitting the `AND version = ?` condition in the WHERE clause, causing the lost update anomaly.',
        correctAnswerBreakdown: 'UPDATE ... SET balance = balance - 250, version = version + 1 WHERE version = 4.'
      }
    },
    {
      id: 's14-q12-top-percentile-cume-dist',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Top 5% Largest Transactions via CUME_DIST()',
      prompt: `Identify transactions that fall in the <strong>top 5% of highest transactions</strong> (cumulative distribution $\\ge 0.95$) across the institution.
<br/><br/>
<strong>Return:</strong>
- <code>transaction_id</code>, <code>amount</code>, <code>percentile_rank</code> rounded to 4 decimals.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount)`,
      expectedColumns: ['transaction_id', 'amount', 'percentile_rank'],
      validationType: 'top_5_percent_cum_dist',
      sampleSolution: `WITH dist_calc AS (
    SELECT 
        transaction_id,
        amount,
        ROUND(CUME_DIST() OVER (ORDER BY amount ASC), 4) AS percentile_rank
    FROM transactions
)
SELECT transaction_id, amount, percentile_rank
FROM dist_calc
WHERE percentile_rank >= 0.95
ORDER BY amount DESC;`,
      marks: 10,
      explanation: {
        summary: 'CUME_DIST() computes the relative cumulative distribution position (0.0 to 1.0) of values.',
        keyConcept: 'Cumulative Distribution Window Function (CUME_DIST)',
        detailed: `<code>CUME_DIST() OVER (ORDER BY amount ASC)</code> computes the proportion of rows with values less than or equal to the current row. Values $\\ge 0.95$ represent the top 5th percentile for anti-money laundering (AML) scrutiny.`,
        realWorldPitfall: 'Confusing CUME_DIST() with PERCENT_RANK().',
        correctAnswerBreakdown: 'CUME_DIST() OVER (ORDER BY amount ASC) >= 0.95.'
      }
    },
    {
      id: 's14-q13-filtered-index-active-accounts',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Partial B-Tree Index for High-Net-Worth Active Accounts',
      prompt: `Write SQLite DDL to create an index on <code>(balance DESC, account_id)</code> only for accounts where <code>status = 'ACTIVE' AND balance &gt;= 10000.00</code>.`,
      schemaContext: `Table: accounts (account_id, customer_name, balance, status)`,
      expectedColumns: ['query_status'],
      validationType: 'partial_hnw_index_ddl',
      sampleSolution: `CREATE INDEX idx_active_hnw_accounts 
ON accounts(balance DESC, account_id) 
WHERE status = 'ACTIVE' AND balance >= 10000.00;`,
      marks: 10,
      explanation: {
        summary: 'Partial index indexes only rows satisfying the compound WHERE condition.',
        keyConcept: 'Partial Index with Compound Predicates',
        detailed: `In wealth management applications, querying the top balances of verified active accounts is frequent. Storing only active high-balance accounts in the index saves memory and speeds up index lookups by 10x.`,
        realWorldPitfall: 'Indexing closed/suspended accounts when business logic only queries active accounts.',
        correctAnswerBreakdown: 'CREATE INDEX ... WHERE status = \'ACTIVE\' AND balance >= 10000.00.'
      }
    },

    // DSA Coding Section
    {
      id: 's14-q14-trapping-rain-water',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: Trapping Rain Water in O(N) Time and O(1) Space',
      prompt: `Given $N$ non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in <strong>$O(N)$ time</strong>.
- Auxiliary space must be <strong>$O(1)$</strong> (no prefix/suffix arrays or extra buffers).
- $1 \\le N \\le 10^5$, $0 \\le height[i] \\le 10^4$.
<br/><br/>
<strong>Input Format:</strong>
Line 1: $N$<br/>
Line 2: $N$ space-separated non-negative integers.<br/>
<strong>Output Format:</strong>
A single integer representing the total units of trapped rain water.`,
      difficulty: 'Hard',
      marks: 30,
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      starterCode: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Solution {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null || line.trim().isEmpty()) {
            System.out.println(0);
            return;
        }
        
        int n = Integer.parseInt(line.trim());
        if (n <= 2) {
            System.out.println(0);
            return;
        }
        
        int[] height = new int[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            height[i] = Integer.parseInt(st.nextToken());
        }
        
        System.out.println(trap(height));
    }

    public static long trap(int[] height) {
        if (height == null || height.length <= 2) return 0;
        
        int left = 0;
        int right = height.length - 1;
        int leftMax = 0;
        int rightMax = 0;
        long totalWater = 0;
        
        // Two Pointers converging towards the center in O(1) space
        while (left < right) {
            if (height[left] <= height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    totalWater += (leftMax - height[left]);
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    totalWater += (rightMax - height[right]);
                }
                right--;
            }
        }
        
        return totalWater;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
          expectedOutput: '6',
          isSample: true
        },
        {
          id: 'tc-2',
          input: '6\n4 2 0 3 2 5',
          expectedOutput: '9',
          isSample: true
        },
        {
          id: 'tc-3',
          input: '3\n3 2 1',
          expectedOutput: '0',
          isSample: false
        },
        {
          id: 'tc-4',
          input: '5\n5 0 0 0 5',
          expectedOutput: '15',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Two pointers from left and right boundaries converge inwards: water trapped at the smaller pointer depends strictly on its corresponding max boundary, achieving O(1) space.',
        keyConcept: 'Two-Pointer Space Optimization for Trapping Rain Water',
        detailed: `The water trapped above index $i$ is $\\min(\\text{leftMax}, \\text{rightMax}) - \\text{height}[i]$.
Using two pointers (<code>left = 0</code>, <code>right = n - 1</code>):
- If <code>height[left] &lt;= height[right]</code>, we know that <code>leftMax &lt;= rightMax</code> holds true because there exists a barrier at least as tall as <code>height[right]</code> on the right.
Thus, the water trapped at <code>left</code> is determined solely by <code>leftMax - height[left]</code>.
We increment <code>left</code>.
- Symmetrically, if <code>height[right] &lt; height[left]</code>, water trapped at <code>right</code> is determined solely by <code>rightMax - height[right]</code>.
We decrement <code>right</code>.
This computes exact trapped water in $O(N)$ time with strictly $O(1)$ extra space!`,
        realWorldPitfall: 'Using 32-bit int for accumulated water: large arrays with deep valleys can exceed 2 billion units, requiring `long`.',
        correctAnswerBreakdown: 'O(N) time with O(1) auxiliary space using two pointers.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's14-q15-threadsafe-lru-cache-ttl',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: High-Performance Thread-Safe LRU Cache with TTL Eviction',
      prompt: `Design and implement an in-memory <code>BankingSessionCache&lt;K, V&gt;</code> supporting:
1. Maximum capacity eviction (Least Recently Used).
2. Time-To-Live (TTL) expiration per entry.
3. Thread-safe concurrent access without coarse global locking bottlenecks (using <code>ReentrantReadWriteLock</code> or Coroutines Mutex).
4. Kotlin generics and clean API.`,
      marks: 40,
      evaluationCriteria: [
        'Implements LinkedHashMap(capacity, loadFactor, accessOrder = true) or custom doubly-linked list',
        'Implements TTL expiry check on get() and periodic cleanup',
        'Uses ReentrantReadWriteLock (readLock() for gets, writeLock() for puts)',
        'Guarantees thread-safety across concurrent reader and writer threads'
      ],
      sampleSolution: `class BankingSessionCache<K, V>(
    private val maxCapacity: Int,
    private val defaultTtlMs: Long = 5 * 60 * 1000L // 5 minutes
) {
    private data class CacheEntry<V>(val value: V, val expiryTime: Long)

    private val rwLock = ReentrantReadWriteLock()
    private val readLock = rwLock.readLock()
    private val writeLock = rwLock.writeLock()

    // accessOrder = true makes LinkedHashMap order entries from least to most recently accessed
    private val map = object : LinkedHashMap<K, CacheEntry<V>>(maxCapacity, 0.75f, true) {
        override fun removeEldestEntry(eldest: MutableMap.MutableEntry<K, CacheEntry<V>>?): Boolean {
            return size > maxCapacity
        }
    }

    fun get(key: K): V? {
        readLock.lock()
        try {
            val entry = map[key] ?: return null
            if (System.currentTimeMillis() > entry.expiryTime) {
                // Expired entry
                return null
            }
            return entry.value
        } finally {
            readLock.unlock()
        }
    }

    fun put(key: K, value: V, ttlMs: Long = defaultTtlMs) {
        writeLock.lock()
        try {
            val expiry = System.currentTimeMillis() + ttlMs
            map[key] = CacheEntry(value, expiry)
        } finally {
            writeLock.unlock()
        }
    }

    fun clearExpired() {
        writeLock.lock()
        try {
            val now = System.currentTimeMillis()
            map.entries.removeIf { it.value.expiryTime < now }
        } finally {
            writeLock.unlock()
        }
    }
}`,
      explanation: {
        summary: 'ReentrantReadWriteLock allows multiple concurrent readers while serializing writes, combining LinkedHashMap LRU order with TTL expiration.',
        keyConcept: 'Reader-Writer Lock & LRU Cache Design',
        detailed: `In banking apps, session tokens and exchange rates are read hundreds of times per second but updated infrequently.
Using a standard <code>synchronized</code> or single mutex forces all readers to queue sequentially.
<code>ReentrantReadWriteLock</code> allows arbitrary concurrent readers to execute simultaneously without blocking each other. Only writes acquire the exclusive write lock.
<code>accessOrder = true</code> in <code>LinkedHashMap</code> automatically reorders entries on <code>get()</code>, making LRU eviction seamless.`,
        realWorldPitfall: 'Reading without locks on LinkedHashMap with accessOrder=true: get() modifies internal linked list pointers, causing ConcurrentModificationException without write protection!',
        correctAnswerBreakdown: 'ReentrantReadWriteLock with LinkedHashMap accessOrder and TTL timestamp comparison.'
      }
    }
  ]
};
