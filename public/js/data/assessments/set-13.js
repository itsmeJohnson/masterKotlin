/* ==========================================================================
   Assessment Set 13: Java Memory Model, Concurrency & GC Internals
   Focus: JMM volatile & memory barriers, Non-static inner class leaks,
          WeakReference vs SoftReference, Next Greater Element (Monotonic Stack).
   ========================================================================== */

export const ASSESSMENT_SET_13 = {
  id: 'set-13',
  number: 13,
  title: 'Set 13: Java Memory Model, Concurrency & GC Internals',
  shortTitle: 'Set 13: JMM & Memory Internals',
  focusArea: 'JMM Volatile, Inner Class Leaks, ART Garbage Collector & Monotonic Stack',
  hackerEarthTrack: 'Data Structures > Stacks & Queues',
  hackerEarthChallenge: 'Code Monk: Next Greater Element using Monotonic Stack',
  hackerEarthConcepts: ['Monotonic Stack', 'O(N) Stack Traversal', 'JMM Memory Barriers', 'WeakReference'],
  difficulty: 'Senior / Lead Mobile Engineer',
  durationMinutes: 75,
  badge: 'JVM Internals Master',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Java Memory Model, Concurrency & GC Internals',
      shortTitle: 'JMM & GC Internals',
      icon: '⚙️',
      description: 'Low-level JVM diagnostics: volatile memory barriers, ThreadLocal pool leaks, reference queues, and ART generational GC.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Correlated 3rd highest queries, reversing offset transactions, and self-joins.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Next Greater Element in O(N) using a Monotonic Decreasing Stack.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Migrating a legacy Android HandlerThread & MessageQueue pipeline to Coroutines Channel.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's13-q1-volatile-memory-barrier',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Java Concurrency: volatile Keyword and Memory Barriers',
      prompt: `In the Java Memory Model (JMM), what does declaring a field as <code>volatile</code> guarantee at the hardware CPU level?`,
      options: [
        { id: 'opt-a', text: 'It prevents the variable from being modified by more than one thread.' },
        { id: 'opt-b', text: 'It guarantees visibility (reads/writes bypass L1/L2 CPU caches directly to main memory) and establishes happens-before relationships by emitting memory barriers (fences) that prevent instruction reordering around the read/write.' },
        { id: 'opt-c', text: 'It makes compound operations like count++ atomic without locks.' },
        { id: 'opt-d', text: 'It serializes all threads attempting to access the class.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'volatile provides visibility and prevents instruction reordering via memory barriers; it does NOT make compound operations atomic.',
        keyConcept: 'JMM Happens-Before & Hardware Memory Barriers',
        detailed: `In modern multi-core CPUs, each core has its own L1/L2 cache. Without <code>volatile</code>, Thread A's write to a variable may sit dirty in Core 0's cache while Thread B on Core 1 reads stale RAM values.
Declaring <code>volatile</code>:
1. Emits a store fence on writes (flushing cache lines to shared memory).
2. Emits a load fence on reads (invalidating local cache lines).
3. Inhibits compiler/hardware reordering across the boundary.
However, <code>volatile</code> does <strong>NOT</strong> guarantee atomicity: <code>count++</code> (read-modify-write) is still subject to race conditions and requires <code>AtomicInteger</code>.`,
        realWorldPitfall: 'Using `volatile var counter = 0` and incrementing it from 10 threads leads to lost updates.',
        correctAnswerBreakdown: 'Option B accurately defines visibility and happens-before memory barriers.'
      }
    },
    {
      id: 's13-q2-inner-class-activity-leak',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Java Memory Leaks: Non-Static Inner Class Implicit Outer Reference',
      prompt: `Consider this legacy Java Android code:
<pre><code>public class AccountActivity extends AppCompatActivity {
    private TextView balanceText;

    private void fetchBalance() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                // Background network call taking 15 seconds
            }
        }).start();
    }
}</code></pre>
Why does this cause a major memory leak if the user rotates the device or presses Back 2 seconds after launching?`,
      options: [
        { id: 'opt-a', text: 'Thread instances cannot run in the background.' },
        { id: 'opt-b', text: 'In Java, an anonymous inner class (Runnable) holds an implicit strong reference to its enclosing outer class instance (AccountActivity.this). The running Thread (a GC root) keeps the entire destroyed Activity with its View hierarchy and Bitmap cache in memory until the thread finishes.' },
        { id: 'opt-c', text: 'TextView does not support background threads.' },
        { id: 'opt-d', text: 'The OS kills the process immediately.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Non-static inner classes hold implicit outer references; long-running threads keep destroyed Activities in RAM.',
        keyConcept: 'Java Implicit Outer Reference & GC Roots',
        detailed: `In Java bytecode, any non-static inner class or anonymous class has a hidden constructor parameter: <code>this$0</code> referencing the outer class instance.
Active Java threads are <strong>GC Roots</strong>. As long as the thread runs, the GC tracing algorithm traces from the Thread $\\to$ Runnable $\\to$ <code>AccountActivity.this</code> $\\to$ Window $\\to$ View Tree $\\to$ Bitmaps, preventing garbage collection and leaking 50MB+ of RAM per rotation.
In Kotlin, nested classes are <code>static</code> by default, preventing this hazard.`,
        realWorldPitfall: 'Using anonymous Runnables or non-static Handlers in Activities without WeakReference causes massive out-of-memory crashes on rotation.',
        correctAnswerBreakdown: 'Option B accurately identifies the `this$0` implicit reference to the outer Activity.'
      }
    },
    {
      id: 's13-q3-weak-vs-soft-reference',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'JVM Memory: Strong vs Soft vs Weak vs Phantom References',
      prompt: `When building an in-memory bitmap cache or listener registry, what is the exact garbage collection behavior of a <code>WeakReference</code> compared to a <code>SoftReference</code>?`,
      options: [
        { id: 'opt-a', text: 'SoftReference objects are cleared immediately on the next GC cycle; WeakReference objects are never cleared.' },
        { id: 'opt-b', text: 'A WeakReference is eagerly cleared by the GC as soon as no strong references exist, during the very next GC cycle. A SoftReference is retained as long as memory is sufficient, and is only cleared by the JVM in response to memory pressure before throwing OutOfMemoryError.' },
        { id: 'opt-c', text: 'Both references are identical in Android ART.' },
        { id: 'opt-d', text: 'WeakReference can only store primitive integers.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'WeakReference is cleared on the next GC pass; SoftReference is cleared only when the JVM faces memory exhaustion.',
        keyConcept: 'Java Reference Strengths (Strong > Soft > Weak > Phantom)',
        detailed: `1. <strong>Strong Reference:</strong> Normal assignment (<code>val a = Object()</code>). Never collected while reachable.
2. <strong>SoftReference:</strong> Ideal for memory-sensitive caches (e.g. downloaded images). The GC tries to keep soft references in heap until memory drops dangerously low before throwing OOM.
3. <strong>WeakReference:</strong> Ideal for listeners and observers (prevents memory leaks). As soon as the owner releases its strong reference, the GC clears it on the next cycle regardless of available heap.
4. <strong>PhantomReference:</strong> Enqueued when an object is physically finalized; used for custom native resource cleanup.`,
        realWorldPitfall: 'Using WeakReference for a bitmap cache: images are wiped on every minor GC cycle, forcing constant disk re-reads.',
        correctAnswerBreakdown: 'Option B accurately contrasts GC collection triggers between Weak and Soft references.'
      }
    },
    {
      id: 's13-q4-threadlocal-pool-leaks',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Concurrency Hazards: ThreadLocal Memory Leaks in ThreadPoolExecutors',
      prompt: `Why is using <code>ThreadLocal&lt;SimpleDateFormat&gt;</code> or <code>ThreadLocal&lt;UserContext&gt;</code> hazardous when executed inside a thread pool (like <code>Dispatchers.Default</code> or <code>Executors.newFixedThreadPool(4)</code>) unless <code>threadLocal.remove()</code> is called in a finally block?`,
      options: [
        { id: 'opt-a', text: 'ThreadLocal cannot be used on multi-core processors.' },
        { id: 'opt-b', text: 'Threads in a thread pool are pooled and never die. The Thread maintains an internal ThreadLocalMap holding the value. If not removed, the data persists on that thread indefinitely, leaking memory and leaking previous user data to subsequent tasks executed on the same thread.' },
        { id: 'opt-c', text: 'ThreadLocal crashes when accessed by more than one thread.' },
        { id: 'opt-d', text: 'ThreadLocal is deprecated in Java 17.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Pooled threads never terminate; failing to call threadLocal.remove() retains data forever and pollutes future tasks.',
        keyConcept: 'ThreadLocalMap Life Cycle & Worker Thread Reuse',
        detailed: `In Java, <code>ThreadLocal</code> stores values in the thread's own <code>Thread.threadLocals</code> map where the key is a WeakReference to the ThreadLocal, but the <strong>value is strongly referenced</strong>!
In a thread pool, threads live for the entire life of the application. If worker tasks set user context and finish without calling <code>threadLocal.remove()</code>:
1. The memory can never be garbage collected.
2. The next task assigned to that thread inherits the previous user's credentials—a critical banking security breach!`,
        realWorldPitfall: 'Leaking authentication tokens across customers sharing pooled backend or mobile worker threads.',
        correctAnswerBreakdown: 'Option B accurately highlights thread reuse and ThreadLocalMap retention.'
      }
    },
    {
      id: 's13-q5-art-gc-pause-large-object-space',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android Runtime (ART): Generational GC and Large Object Space (LOS)',
      prompt: `In Android ART, why are large Bitmap allocations ($> 12\\text{ KB}$) allocated in the <strong>Large Object Space (LOS)</strong> rather than the standard generational nursery (Eden)?`,
      options: [
        { id: 'opt-a', text: 'Large Object Space is stored in cloud memory.' },
        { id: 'opt-b', text: 'Moving large memory buffers during Generational GC compaction is extremely expensive (copying megabytes of bytes between survivor spaces stalls the CPU). LOS uses a non-moving page-based allocator where memory is never moved/compacted, eliminating GC pause jank for images.' },
        { id: 'opt-c', text: 'Bitmaps cannot be garbage collected.' },
        { id: 'opt-d', text: 'LOS is encrypted with hardware AES.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'LOS avoids expensive memory copying of large objects during generational compaction.',
        keyConcept: 'Android ART Large Object Space (LOS) Architecture',
        detailed: `Standard generational garbage collection moves living objects from Eden to Survivor to Tenured spaces during compaction to eliminate fragmentation.
If a 10MB bitmap was in the moving space, the GC would spend 15ms copying 10MB across RAM blocks, causing dropped frames (jank).
ART places large byte arrays and bitmaps in the <strong>Large Object Space (LOS)</strong>, which is non-moving: ART only adjusts page table pointers when reclaiming memory, avoiding byte copy overhead.`,
        realWorldPitfall: 'Allocating hundreds of temporary large byte arrays causes heap fragmentation in non-moving spaces.',
        correctAnswerBreakdown: 'Option B accurately explains why non-moving allocation prevents copy overhead.'
      }
    },
    {
      id: 's13-q6-double-checked-locking-reordering',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'JMM Internals: Instruction Reordering in Double-Checked Locking',
      prompt: `Why did the classic Java Double-Checked Locking singleton pattern fail before Java 5?
<pre><code>if (instance == null) {
    synchronized (Singleton.class) {
        if (instance == null) {
            instance = new Singleton(); // Line X
        }
    }
}</code></pre>`,
      options: [
        { id: 'opt-a', text: 'synchronized locks were not thread-safe.' },
        { id: 'opt-b', text: 'The creation of an object consists of: 1) Allocate memory, 2) Run constructor, 3) Assign reference to instance. The compiler or CPU can reorder this into 1 -> 3 -> 2. Thread B sees instance != null and accesses it before Thread A runs the constructor, accessing a half-initialized corrupt object.' },
        { id: 'opt-c', text: 'null checks are ignored by the JIT compiler.' },
        { id: 'opt-d', text: 'Java does not allow two if statements with the same condition.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Instruction reordering causes the variable reference to be published before the object constructor completes.',
        keyConcept: 'Instruction Reordering & The 1-3-2 Hazard',
        detailed: `In bytecode, <code>new Singleton()</code> performs:
1. <code>mem = allocate()</code>
2. <code>ctorSingleton(mem)</code>
3. <code>instance = mem</code>
If reordered to 1 $\\to$ 3 $\\to$ 2: Thread A assigns the memory address to <code>instance</code>. Thread B enters the outer check, sees <code>instance != null</code>, and returns <code>instance</code> immediately. Thread B calls methods on an uninitialized object whose fields are still null/0!
Adding <code>volatile</code> in Java 5+ introduces a write barrier preventing step 2 and 3 from reordering.`,
        realWorldPitfall: 'Writing custom DCL singletons without `volatile` leads to random, irreproducible crash reports in production.',
        correctAnswerBreakdown: 'Option B accurately explains the 1-3-2 instruction reordering hazard.'
      }
    },
    {
      id: 's13-q7-string-pool-memory-intern',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'JVM Memory: String Constant Pool & String.intern()',
      prompt: `What is the difference between:
<code>String s1 = "barclays";</code> and <code>String s2 = new String("barclays");</code> in JVM memory?`,
      options: [
        { id: 'opt-a', text: 's1 is stored in the String Constant Pool (in Metaspace/Heap); s2 creates a separate new object instance on the heap holding a reference to the char array. Thus s1 == s2 is false.' },
        { id: 'opt-b', text: 's1 is mutable; s2 is immutable.' },
        { id: 'opt-c', text: 's1 is allocated on the stack; s2 is allocated on the GPU.' },
        { id: 'opt-d', text: 'There is no difference; Java optimizes them into identical references.' }
      ],
      correctOptionId: 'opt-a',
      marks: 5,
      explanation: {
        summary: 'String literals are interned in the String Pool; new String() creates a distinct heap object, breaking reference equality (==).',
        keyConcept: 'String Constant Pool & Reference Equality',
        detailed: `When you write a string literal <code>"barclays"</code>, the JVM checks the String Constant Pool. If present, it reuses the reference.
Calling <code>new String("barclays")</code> explicitly forces the allocation of a brand new <code>java.lang.String</code> object on the heap:
- <code>s1 == s2</code> is <code>false</code> (different object identities).
- <code>s1.equals(s2)</code> is <code>true</code> (identical character sequence).
- Calling <code>s2.intern()</code> returns the pooled reference where <code>s1 == s2.intern()</code> is <code>true</code>.`,
        realWorldPitfall: 'Comparing Strings in Java using `==` instead of `.equals()`.',
        correctAnswerBreakdown: 'Option A accurately contrasts the String Constant Pool and heap allocations.'
      }
    },
    {
      id: 's13-q8-cleaner-vs-finalize-deprecation',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Garbage Collection: java.lang.ref.Cleaner vs Deprecated finalize()',
      prompt: `Why was <code>Object.finalize()</code> deprecated in modern Java/Android, and how does <code>java.lang.ref.Cleaner</code> fix its fundamental flaws?`,
      options: [
        { id: 'opt-a', text: 'finalize() cannot free C++ pointers.' },
        { id: 'opt-b', text: 'finalize() causes object resurrection, unhandled exceptions in finalizers are ignored, and objects with finalizers require at least two full GC cycles to be collected. Cleaner uses PhantomReference and runs cleanup actions on a dedicated thread without keeping the main object alive.' },
        { id: 'opt-c', text: 'Cleaner is built into Android Room.' },
        { id: 'opt-d', text: 'finalize() only runs on Android 4.0.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'finalize() delays garbage collection and permits resurrection bugs; Cleaner uses PhantomReferences for safe teardown.',
        keyConcept: 'Object Finalization Flaws & Modern Cleaners',
        detailed: `When an object overrides <code>finalize()</code>:
1. The GC cannot collect it on discovery: it moves it to a finalizer queue.
2. A single low-priority <code>FinalizerThread</code> runs finalizers. If it falls behind, memory blows up (OutOfMemoryError).
3. Inside <code>finalize()</code>, an object could assign <code>this</code> to a static variable, resurrecting itself from death!
<code>java.lang.ref.Cleaner</code> runs independent cleaning actions that do not hold a reference to the target object.`,
        realWorldPitfall: 'Relying on `finalize()` to close SQLite database connections or sockets leads to file descriptor exhaustion.',
        correctAnswerBreakdown: 'Option B accurately details object resurrection and two-cycle GC delays.'
      }
    },

    // DBMS Section
    {
      id: 's13-q9-correlated-third-highest',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: 3rd Highest Transaction Amount via Correlated Subquery',
      prompt: `Write an SQL query to find the <strong>3rd highest distinct transaction amount</strong> without using <code>LIMIT</code> or window functions (pure correlated subquery approach).
<br/><br/>
<strong>Return:</strong>
- <code>amount</code> as <code>third_highest_amount</code>.`,
      schemaContext: `Table: transactions (transaction_id, amount)`,
      expectedColumns: ['third_highest_amount'],
      validationType: 'correlated_3rd_highest',
      sampleSolution: `SELECT DISTINCT t1.amount AS third_highest_amount
FROM transactions t1
WHERE 2 = (
    SELECT COUNT(DISTINCT t2.amount)
    FROM transactions t2
    WHERE t2.amount > t1.amount
);`,
      marks: 10,
      explanation: {
        summary: 'Correlated subquery counting amounts greater than t1.amount isolates the Nth rank.',
        keyConcept: 'Nth Highest via Correlated Subquery',
        detailed: `For any amount $X$, if there are exactly 2 distinct amounts greater than $X$ in the table, then $X$ must be the 3rd highest distinct amount! This classical relational algebra query works on all SQL dialects regardless of window function support.`,
        realWorldPitfall: 'Using `WHERE 3 = (...)` (which would find the 4th highest since 0 amounts greater = 1st highest).',
        correctAnswerBreakdown: 'WHERE 2 = (SELECT COUNT(DISTINCT ...) WHERE t2.amount > t1.amount).'
      }
    },
    {
      id: 's13-q10-offsetting-reversal-transactions',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Match Cancelled/Reversed Transactions within 24 Hours',
      prompt: `A payment reversal is recorded as a second transaction on the same <code>account_id</code> with negative amount (<code>t2.amount = -t1.amount</code>) occurring within 24 hours of <code>t1</code>.
Write an SQL query to identify all original transactions and their corresponding reversal IDs.
<br/><br/>
<strong>Return:</strong>
- <code>t1.transaction_id AS original_txn</code>, <code>t2.transaction_id AS reversal_txn</code>, <code>t1.account_id</code>, <code>t1.amount</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['original_txn', 'reversal_txn', 'account_id', 'amount'],
      validationType: 'reversal_transactions_match',
      sampleSolution: `SELECT 
    t1.transaction_id AS original_txn,
    t2.transaction_id AS reversal_txn,
    t1.account_id,
    t1.amount
FROM transactions t1
JOIN transactions t2 ON t1.account_id = t2.account_id
    AND t1.amount > 0
    AND t2.amount = -t1.amount
    AND julianday(t2.timestamp) >= julianday(t1.timestamp)
    AND (julianday(t2.timestamp) - julianday(t1.timestamp)) * 24 <= 24;`,
      marks: 10,
      explanation: {
        summary: 'Join on same account, negated amount, and timestamp delta within 24 hours matches reversals.',
        keyConcept: 'Self-Join Offset Matching',
        detailed: `In double-entry financial bookkeeping, chargebacks and cancellations generate offsetting contra-entries. Self-joining on <code>t2.amount = -t1.amount</code> and bounding the time window isolates paired cancellations.`,
        realWorldPitfall: 'Omitting `t1.amount > 0` causes each pair to be returned twice (once as A-B and once as B-A).',
        correctAnswerBreakdown: 'Self-join with negated amount and timestamp delta check.'
      }
    },
    {
      id: 's13-q11-same-month-deposit-clusters',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Cluster Accounts Opened in Same Month with Same Initial Deposit',
      prompt: `Find pairs of distinct customer accounts opened in the same calendar month and year having the identical starting <code>initial_deposit</code>.
<br/><br/>
<strong>Return:</strong>
- <code>a1.account_id AS account_1</code>, <code>a2.account_id AS account_2</code>, <code>a1.initial_deposit</code>, <code>strftime('%Y-%m', a1.created_at) AS open_month</code>.
- Avoid duplicate reciprocal pairs (ensure <code>a1.account_id &lt; a2.account_id</code>).`,
      schemaContext: `Table: accounts (account_id, customer_name, initial_deposit, created_at)`,
      expectedColumns: ['account_1', 'account_2', 'initial_deposit', 'open_month'],
      validationType: 'account_clustering_match',
      sampleSolution: `SELECT 
    a1.account_id AS account_1,
    a2.account_id AS account_2,
    a1.initial_deposit,
    strftime('%Y-%m', a1.created_at) AS open_month
FROM accounts a1
JOIN accounts a2 ON a1.account_id < a2.account_id
    AND a1.initial_deposit = a2.initial_deposit
    AND strftime('%Y-%m', a1.created_at) = strftime('%Y-%m', a2.created_at)
ORDER BY open_month DESC, a1.account_id ASC;`,
      marks: 10,
      explanation: {
        summary: 'Self-join on identical open month and initial deposit with a1.id < a2.id prevents mirrored duplicates.',
        keyConcept: 'Entity Clustering & Anti-Symmetry Joins',
        detailed: `Using <code>a1.account_id &lt; a2.account_id</code> guarantees strictly one record per pair (eliminating reflexive A=A matches and symmetric B-A duplicates).`,
        realWorldPitfall: 'Using `!=` returns both (A, B) and (B, A).',
        correctAnswerBreakdown: 'Self-join with strict inequality < and formatted month matching.'
      }
    },
    {
      id: 's13-q12-dormant-branch-analysis',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Identify Branches with Zero Transactions in Q4',
      prompt: `Find all bank branches that recorded zero transactions between <code>'2026-10-01'</code> and <code>'2026-12-31'</code>.
<br/><br/>
<strong>Return:</strong>
- <code>branch_id</code>, <code>branch_name</code>, <code>city</code>.`,
      schemaContext: `Tables: branches (branch_id, branch_name, city), transactions (transaction_id, branch_id, timestamp)`,
      expectedColumns: ['branch_id', 'branch_name', 'city'],
      validationType: 'dormant_branches_not_exists',
      sampleSolution: `SELECT 
    b.branch_id,
    b.branch_name,
    b.city
FROM branches b
WHERE NOT EXISTS (
    SELECT 1 
    FROM transactions t
    WHERE t.branch_id = b.branch_id
      AND t.timestamp BETWEEN '2026-10-01 00:00:00' AND '2026-12-31 23:59:59'
);`,
      marks: 10,
      explanation: {
        summary: 'NOT EXISTS with correlated date filter efficiently finds entities with no matching rows in the date range.',
        keyConcept: 'Correlated NOT EXISTS vs Outer Join',
        detailed: `The SQL query engine halts evaluation of <code>NOT EXISTS</code> as soon as a single matching row is encountered (short-circuiting), making it significantly faster than full outer joins for existence checks.`,
        realWorldPitfall: 'Using `NOT IN` with subqueries containing possible NULL values.',
        correctAnswerBreakdown: 'WHERE NOT EXISTS (SELECT 1 ...).'
      }
    },
    {
      id: 's13-q13-non-overlapping-dates-ddl',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: DDL Table Constraints for Promotion Date Validation',
      prompt: `Write SQLite DDL to create a <code>card_promotions</code> table:
- <code>promo_id TEXT PRIMARY KEY</code>
- <code>start_date TEXT NOT NULL</code>
- <code>end_date TEXT NOT NULL</code>
- A <code>CHECK</code> constraint ensuring <code>end_date &gt;= start_date</code>.`,
      schemaContext: `Table: card_promotions`,
      expectedColumns: ['query_status'],
      validationType: 'check_constraint_ddl',
      sampleSolution: `CREATE TABLE card_promotions (
    promo_id TEXT PRIMARY KEY,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    CHECK (end_date >= start_date)
);`,
      marks: 10,
      explanation: {
        summary: 'CHECK constraint enforces business rules at the database engine level, rejecting invalid date ranges.',
        keyConcept: 'SQLite Table-Level CHECK Constraints',
        detailed: `Enforcing data integrity in DDL prevents bugs in app code from corrupting the database. If an API attempts to insert an end date prior to a start date, SQLite aborts the insert with <code>SQLiteConstraintException</code>.`,
        realWorldPitfall: 'Relying only on UI validation allows bad data to sneak in via background sync or database migrations.',
        correctAnswerBreakdown: 'CREATE TABLE with CHECK (end_date >= start_date).'
      }
    },

    // DSA Coding Section
    {
      id: 's13-q14-next-greater-element-stack',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: Next Greater Element using Monotonic Stack in O(N)',
      prompt: `Given an array <code>nums</code> of $N$ integers, find the <strong>Next Greater Element (NGE)</strong> for every element.
The Next Greater Element for an element <code>nums[i]</code> is the first greater element to its right. If no greater element exists, output <code>-1</code> for that position.
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in <strong>$O(N)$ time</strong>.
- Brute force nested loops take $O(N^2)$ and will <strong>fail large test cases</strong>.
- $1 \\le N \\le 10^5$, $-10^9 \\le nums[i] \\le 10^9$.
<br/><br/>
<strong>Input Format:</strong>
Line 1: $N$<br/>
Line 2: $N$ space-separated integers.<br/>
<strong>Output Format:</strong>
$N$ space-separated integers representing the Next Greater Element for each position.`,
      difficulty: 'Medium',
      marks: 30,
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      starterCode: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.StringTokenizer;

public class Solution {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null || line.trim().isEmpty()) return;
        
        int n = Integer.parseInt(line.trim());
        int[] nums = new int[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            nums[i] = Integer.parseInt(st.nextToken());
        }
        
        int[] nge = nextGreaterElement(nums);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(nge[i]).append(i == n - 1 ? "" : " ");
        }
        System.out.println(sb.toString());
    }

    public static int[] nextGreaterElement(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        // Monotonic stack storing indices or values from right to left
        Deque<Integer> stack = new ArrayDeque<>();
        
        // Traverse backwards from right to left
        for (int i = n - 1; i >= 0; i--) {
            // Pop smaller or equal elements since they cannot be the NGE for nums[i] or any element to its left
            while (!stack.isEmpty() && stack.peek() <= nums[i]) {
                stack.pop();
            }
            
            // If stack is empty, no greater element exists to the right
            result[i] = stack.isEmpty() ? -1 : stack.peek();
            
            // Push current element for elements to the left
            stack.push(nums[i]);
        }
        
        return result;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: '4\n4 5 2 25',
          expectedOutput: '5 25 25 -1',
          isSample: true
        },
        {
          id: 'tc-2',
          input: '4\n13 7 6 12',
          expectedOutput: '-1 12 12 -1',
          isSample: true
        },
        {
          id: 'tc-3',
          input: '3\n3 2 1',
          expectedOutput: '-1 -1 -1',
          isSample: false
        },
        {
          id: 'tc-4',
          input: '5\n1 2 3 4 5',
          expectedOutput: '2 3 4 5 -1',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Traverse backwards with a monotonic decreasing stack: each element is pushed and popped at most once, guaranteeing O(N) runtime.',
        keyConcept: 'Monotonic Decreasing Stack Traversal',
        detailed: `In a monotonic decreasing stack:
1. Traverse elements from right to left ($i = n-1 \\dots 0$).
2. While the top of the stack is $\\le nums[i]$, pop it. Why? Because $nums[i]$ is taller and positioned to the left, so it will shadow those smaller elements from ever being the next greater element for any element further left!
3. The remaining top of stack is the next greater element (or -1 if empty).
4. Push $nums[i]$ onto the stack.
Every array element is pushed onto the stack exactly once and popped at most once. Hence, total operations across all iterations is at most $2N \\implies O(N)$ total time!`,
        realWorldPitfall: 'Using nested loops gives O(N^2) which exceeds the 1.0 second limit for N = 100,000.',
        correctAnswerBreakdown: 'O(N) time complexity using ArrayDeque as a monotonic stack.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's13-q15-handlerthread-to-coroutine-channel',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: Migrating Legacy HandlerThread Queue to Coroutines Actor/Channel',
      prompt: `Migrate a legacy Android background print/audit logging subsystem built with:
- <code>HandlerThread("AuditLogger")</code>
- <code>Handler(handlerThread.looper) { handleMessage(msg) }</code>
into a modern, non-blocking Kotlin Coroutines <code>Channel&lt;AuditLogEvent&gt;(Channel.BUFFERED)</code> consumer.
Demonstrate:
1. How HandlerThread held an active OS thread alive even when idle.
2. Replacing it with a structured Coroutine scope and Channel consumer.
3. Graceful shutdown handling without dropping in-flight audit records.`,
      marks: 40,
      evaluationCriteria: [
        'Explains OS thread overhead of HandlerThread Looper loop',
        'Implements Channel(Channel.BUFFERED) with a dedicated consumer coroutine',
        'Uses Dispatchers.IO for physical file/network flushing',
        'Implements close() and drain remaining items gracefully'
      ],
      sampleSolution: `class ModernAuditLogger(
    private val scope: CoroutineScope,
    private val diskWriter: AuditDiskWriter
) {
    private val channel = Channel<AuditLogEvent>(capacity = Channel.BUFFERED)

    init {
        scope.launch(Dispatchers.IO) {
            // Consumer coroutine: suspends when empty, processes sequentially
            for (event in channel) {
                diskWriter.writeRecord(event)
            }
        }
    }

    suspend fun logEvent(event: AuditLogEvent) {
        channel.send(event) // Non-blocking suspend if buffer full
    }

    suspend fun shutdown() {
        channel.close() // Closes input; loop finishes remaining buffered items
    }
}`,
      explanation: {
        summary: 'Kotlin Channels provide sequential, thread-safe asynchronous queue processing without dedicating an idle OS thread.',
        keyConcept: 'Coroutines Channel vs Java HandlerThread',
        detailed: `A legacy <code>HandlerThread</code> allocates a dedicated Linux kernel thread (consuming 1MB of stack memory) and runs an infinite <code>Looper.loop()</code>. Even when idle for hours, the thread exists.
A Coroutine <code>Channel</code> consumer suspends when the channel is empty: the underlying thread returns to the <code>Dispatchers.IO</code> thread pool to do other work.
Calling <code>channel.close()</code> stops new inputs while allowing the consumer loop to drain all pending audit events, ensuring zero data loss during app termination.`,
        realWorldPitfall: 'Calling `handlerThread.quit()` abruptly drops all unhandled messages queued in the MessageQueue.',
        correctAnswerBreakdown: 'Channel(BUFFERED) consumer running on Dispatchers.IO with graceful channel.close() drain.'
      }
    }
  ]
};
