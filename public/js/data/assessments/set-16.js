/* ==========================================================================
   Assessment Set 16: RxJava to Kotlin Coroutines & Flow Migration
   Focus: Observable to Flow, Schedulers vs Dispatchers, flatMapLatest,
          3Sum Triplet Sum to Zero (Two Pointers O(N^2) deduplicated).
   ========================================================================== */

export const ASSESSMENT_SET_16 = {
  id: 'set-16',
  number: 16,
  title: 'Set 16: RxJava to Kotlin Coroutines & Flow Migration',
  shortTitle: 'Set 16: RxJava to Flow Migration',
  focusArea: 'RxJava to Flow Mapping, Schedulers vs Dispatchers, flatMapLatest & 3Sum DSA',
  hackerEarthTrack: 'Algorithms > Two Pointers & Sorting',
  hackerEarthChallenge: 'Code Monk: 3Sum Triplet Sum to Zero in O(N^2)',
  hackerEarthConcepts: ['Two Pointers 3Sum', 'Duplicate Skipping', 'RxJava to Flow', 'WhileSubscribed(5000)'],
  difficulty: 'Senior / Lead Mobile Engineer',
  durationMinutes: 75,
  badge: 'Reactive Specialist',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: RxJava to Kotlin Coroutines & Flow Migration',
      shortTitle: 'RxJava to Flow',
      icon: '🌊',
      description: 'Reactive migration: Observable vs Flow, Schedulers vs Dispatchers, BehaviorSubject vs StateFlow, and WhileSubscribed(5000).',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Z-Score statistical anomaly queries, recursive referral trees, and expiration updates.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: '3Sum: Find all Unique Triplets summing to Zero in O(N^2) Time.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Migrating an RxJava Single/Observable Banking Repository to Coroutines Flow with Exponential Retry.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's16-q1-rxjava-primitive-mapping',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Reactive Migration: RxJava Type Mapping to Kotlin Coroutines',
      prompt: `When migrating an enterprise codebase from RxJava 2/3 to Kotlin Coroutines:
What is the idiomatic Kotlin equivalent for <code>Single&lt;T&gt;</code>, <code>Completable</code>, and <code>Observable&lt;T&gt;</code>?`,
      options: [
        { id: 'opt-a', text: 'All three map to Deferred<T>.' },
        { id: 'opt-b', text: 'Single<T> maps to a suspending function "suspend fun (): T"; Completable maps to "suspend fun (): Unit"; Observable<T> maps to cold "Flow<T>".' },
        { id: 'opt-c', text: 'Single<T> maps to LiveData; Observable<T> maps to BroadcastReceiver.' },
        { id: 'opt-d', text: 'Kotlin does not support asynchronous streaming.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Single -> suspend fun (): T; Completable -> suspend fun (): Unit; Observable -> Flow<T>.',
        keyConcept: 'RxJava to Coroutines Conceptual Type Mapping',
        detailed: `In RxJava, everything had to be wrapped in a reactive type:
- <code>Single&lt;T&gt;</code> (emits 1 item or error) $\\implies$ <code>suspend fun (): T</code>.
- <code>Completable</code> (emits complete or error) $\\implies$ <code>suspend fun (): Unit</code>.
- <code>Maybe&lt;T&gt;</code> (emits 0 or 1 item) $\\implies$ <code>suspend fun (): T?</code>.
- <code>Observable&lt;T&gt;</code> / <code>Flowable&lt;T&gt;</code> (multi-value stream) $\\implies$ <code>Flow&lt;T&gt;</code>.
Eliminating Single/Completable wrappers in favor of simple suspending functions eliminates callback hell and memory overhead.`,
        realWorldPitfall: 'Converting Single<T> into a Flow<T> with single item emission instead of a simple suspending function.',
        correctAnswerBreakdown: 'Option B is the official Jetbrains/Google migration standard.'
      }
    },
    {
      id: 's16-q2-schedulers-vs-dispatchers',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Thread Scheduling: RxJava Schedulers vs Coroutines Dispatchers',
      prompt: `In RxJava, switching threads used <code>.subscribeOn(Schedulers.io())</code> and <code>.observeOn(AndroidSchedulers.mainThread())</code>.
How does thread context switching work in Kotlin Coroutines, and why is it superior?`,
      options: [
        { id: 'opt-a', text: 'Coroutines use OS thread interrupts.' },
        { id: 'opt-b', text: 'Coroutines use withContext(Dispatchers.IO) inside the method itself (Main-Safety), meaning callers on the Main thread can invoke the function directly without worrying about which dispatcher to specify.' },
        { id: 'opt-c', text: 'Coroutines cannot switch threads once started.' },
        { id: 'opt-d', text: 'Dispatchers.IO creates 10,000 physical OS threads.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'withContext provides Main-Safety: the callee encapsulates its own threading, removing the burden from the caller.',
        keyConcept: 'Main-Safety Principle vs observeOn/subscribeOn',
        detailed: `In RxJava:
The UI layer was responsible for calling <code>.subscribeOn(Schedulers.io())</code>. If the caller forgot, the network request crashed the UI thread with <code>NetworkOnMainThreadException</code>.
In Kotlin Coroutines:
We follow the <strong>Main-Safety</strong> principle: repository and data source methods wrap heavy work in <code>withContext(Dispatchers.IO)</code>. Callers on <code>Dispatchers.Main</code> can safely call them directly!`,
        realWorldPitfall: 'Relying on callers to switch dispatchers leads to intermittent NetworkOnMainThreadException crashes.',
        correctAnswerBreakdown: 'Option B accurately explains Main-Safety via withContext.'
      }
    },
    {
      id: 's16-q3-behaviorsubject-to-stateflow',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Hot Streams: RxJava BehaviorSubject vs Kotlin MutableStateFlow',
      prompt: `When migrating an RxJava <code>BehaviorSubject&lt;T&gt;</code> to Kotlin Coroutines <code>MutableStateFlow&lt;T&gt;</code>:
What are the two most critical behavioral differences to keep in mind?`,
      options: [
        { id: 'opt-a', text: 'StateFlow does not support numbers.' },
        { id: 'opt-b', text: '1) MutableStateFlow requires an initial value at instantiation, whereas BehaviorSubject can be empty. 2) StateFlow conflates emissions using structural equality (equals): emitting the identical value twice does NOT trigger downstream collectors.' },
        { id: 'opt-c', text: 'BehaviorSubject is cold, while StateFlow is warm.' },
        { id: 'opt-d', text: 'StateFlow cannot be collected by multiple subscribers.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'StateFlow requires an initial value and performs conflation (distinctUntilChanged) automatically.',
        keyConcept: 'StateFlow Initial Value & Conflation Semantics',
        detailed: `1. <strong>Mandatory Initial Value:</strong> <code>MutableStateFlow(UiState.Initial)</code> always holds a non-null current value readable synchronously via <code>stateFlow.value</code>.
2. <strong>Distinct Until Changed:</strong> If <code>stateFlow.value = currentVal</code> is set with an identical object, StateFlow suppresses the emission because <code>old == new</code> is true. <code>BehaviorSubject</code> emits duplicate values unless chained with <code>.distinctUntilChanged()</code>.`,
        realWorldPitfall: 'Using StateFlow to deliver one-off navigation events: emitting the same navigation route twice is ignored due to conflation!',
        correctAnswerBreakdown: 'Option B accurately highlights mandatory initial value and equality conflation.'
      }
    },
    {
      id: 's16-q4-flatmap-vs-flatmaplatest',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Stream Transformation: flatMapLatest vs switchMap in Search Bars',
      prompt: `When implementing a live banking search bar where each new keystroke cancels previous pending network queries:
What is the exact Kotlin Flow equivalent of RxJava's <code>switchMap</code>?`,
      options: [
        { id: 'opt-a', text: 'flatMapConcat' },
        { id: 'opt-b', text: 'flatMapLatest (or transformLatest)' },
        { id: 'opt-c', text: 'flatMapMerge' },
        { id: 'opt-d', text: 'combine' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'flatMapLatest cancels the previous inner flow when a new upstream emission arrives, matching RxJava switchMap.',
        keyConcept: 'Flow Flattening Strategies (Concat vs Merge vs Latest)',
        detailed: `- <code>flatMapConcat</code>: Processes inner flows sequentially (waits for flow 1 to complete before starting flow 2).
- <code>flatMapMerge</code>: Runs up to <code>DEFAULT_CONCURRENCY</code> inner flows concurrently and interleaves emissions.
- <code>flatMapLatest</code>: Cancels the previous inner flow execution immediately upon receiving a new upstream value. Exactly identical to RxJava's <code>switchMap</code> for search-as-you-type!`,
        realWorldPitfall: 'Using `flatMapMerge` for search queries causes race conditions where an older query finishes after a newer one, showing stale results.',
        correctAnswerBreakdown: 'Option B accurately maps switchMap to flatMapLatest.'
      }
    },
    {
      id: 's16-q5-while-subscribed-5000-delay',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Architecture: SharingStarted.WhileSubscribed(5000) for Screen Rotation',
      prompt: `In Android ViewModels, cold database/network flows are converted to hot StateFlows:
<pre><code>val uiState = repository.getTransactionsFlow()
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = UiState.Loading
    )</code></pre>
Why is a <code>stopTimeoutMillis = 5000</code> buffer specifically recommended?`,
      options: [
        { id: 'opt-a', text: 'To delay the initial network request by 5 seconds.' },
        { id: 'opt-b', text: 'During configuration changes (like screen rotation), the old Activity unregisters its collector before the new Activity subscribes (which takes ~200-500ms). The 5-second buffer keeps the upstream Flow alive during this brief absence of subscribers, preventing unnecessary cancellation and restart of expensive network/database queries.' },
        { id: 'opt-c', text: 'It enforces a 5-second timeout on network calls.' },
        { id: 'opt-d', text: 'Room databases crash without a 5000ms delay.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '5000ms stop timeout prevents upstream Flow cancellation during brief Activity destruction and recreation on screen rotation.',
        keyConcept: 'SharingStarted.WhileSubscribed(5000) & Configuration Changes',
        detailed: `When the phone rotates:
1. Old Activity calls <code>onStop</code> / <code>onDestroy</code> (subscriber count drops to 0).
2. If using <code>WhileSubscribed(0)</code>, the upstream flow cancels immediately.
3. 200ms later, new Activity calls <code>onStart</code> (subscriber count becomes 1).
4. The upstream Flow restarts from scratch, re-fetching data from disk or network and flickering the UI!
<code>WhileSubscribed(5000)</code> waits 5 seconds before cancelling upstream, seamlessly bridging the rotation window.`,
        realWorldPitfall: 'Using `SharingStarted.Eagerly`: the Flow remains active forever in the ViewModel, draining battery even when the user leaves the app.',
        correctAnswerBreakdown: 'Option B accurately explains screen rotation collector detachment.'
      }
    },
    {
      id: 's16-q6-disposable-vs-structured-concurrency',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Resource Teardown: CompositeDisposable vs CoroutineScope Cancellation',
      prompt: `In legacy RxJava Android code, forgetting to add a <code>Disposable</code> to <code>CompositeDisposable</code> and calling <code>compositeDisposable.clear()</code> in <code>onDestroy()</code> was the #1 cause of memory leaks.
How does Kotlin <strong>Structured Concurrency</strong> solve this fundamentally?`,
      options: [
        { id: 'opt-a', text: 'Coroutines cannot be cancelled.' },
        { id: 'opt-b', text: 'In structured concurrency, all coroutines must be launched within a CoroutineScope bound to a lifecycle (e.g. viewModelScope or lifecycleScope). When the lifecycle destroys the scope, the runtime automatically and recursively cancels the parent Job and all its child coroutines without manual book-keeping.' },
        { id: 'opt-c', text: 'Kotlin replaces CompositeDisposable with an automatic Java Agent.' },
        { id: 'opt-d', text: 'The Android OS kills threads automatically.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Structured concurrency guarantees automatic hierarchical cancellation when the parent scope is destroyed.',
        keyConcept: 'Parent-Child Coroutine Hierarchy vs Manual Disposables',
        detailed: `In RxJava, every stream was an independent entity: if you forgot to collect its <code>Disposable</code> in <code>compositeDisposable.add()</code>, it became an unmanaged rogue stream.
In Kotlin Coroutines:
A coroutine cannot be launched without a parent <code>CoroutineScope</code>. The scope forms a tree hierarchy of <code>Job</code> nodes.
When <code>viewModelScope</code> is cleared in <code>ViewModel.onCleared()</code>, it calls <code>cancel()</code> on the root Job, which automatically cancels every single child coroutine in the tree.`,
        realWorldPitfall: 'Using `GlobalScope.launch`: it bypasses structured concurrency, recreating the exact memory leak risks of unmanaged RxJava Disposables.',
        correctAnswerBreakdown: 'Option B accurately highlights automatic hierarchical cancellation via lifecycle scopes.'
      }
    },
    {
      id: 's16-q7-flow-catch-operator-placement',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Flow Error Handling: catch Operator Upstream vs Downstream',
      prompt: `Consider this Kotlin Flow pipeline:
<pre><code>repository.fetchTransactions()
    .catch { e -> emit(emptyList()) } // Operator A
    .map { list -> processTransactions(list) } // May throw Exception
    .collect { render(it) }</code></pre>
If <code>processTransactions(list)</code> throws an exception, will <code>Operator A</code> catch it?`,
      options: [
        { id: 'opt-a', text: 'Yes, catch intercepts all exceptions in the entire chain regardless of placement.' },
        { id: 'opt-b', text: 'No. The catch operator only catches exceptions that occur in upstream operators (operators declared above it in the chain). Exceptions in downstream operators (map, collect) bypass it and crash unless handled by a downstream catch.' },
        { id: 'opt-c', text: 'catch throws an IllegalStateException if placed above map.' },
        { id: 'opt-d', text: 'The flow emits null.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'The catch operator ONLY catches exceptions that occur UPSTREAM of where it is declared.',
        keyConcept: 'Upstream Exception Catching in Kotlin Flow',
        detailed: `The Kotlin Flow <code>catch</code> operator preserves exception transparency. It only intercepts exceptions thrown by the flow producer and operators <strong>above</strong> it.
Any exception thrown by downstream operators (like <code>map</code> or <code>collect</code> below it) is NOT caught by that <code>catch</code> block.
To catch transformation errors, place <code>catch</code> after <code>map</code>.`,
        realWorldPitfall: 'Placing `catch` at the top of a flow pipeline: UI transformation errors below it crash the app completely.',
        correctAnswerBreakdown: 'Option B accurately defines upstream exception handling rules in Flow.'
      }
    },
    {
      id: 's16-q8-flow-combine-vs-zip',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Flow Operators: combine() vs zip() Synchronization',
      prompt: `When synchronizing an Account Flow and an Exchange Rate Flow to compute real-time values:
What is the difference between <code>flowA.combine(flowB) { a, b -&gt; ... }</code> and <code>flowA.zip(flowB) { a, b -&gt; ... }</code>?`,
      options: [
        { id: 'opt-a', text: 'combine only works with integers; zip works with objects.' },
        { id: 'opt-b', text: 'zip pairs emissions in strict 1-to-1 order (1st of A with 1st of B, 2nd of A with 2nd of B). combine emits a new value whenever EITHER flow emits, pairing the new emission with the most recent cached value of the other flow.' },
        { id: 'opt-c', text: 'zip executes on background threads; combine on UI thread.' },
        { id: 'opt-d', text: 'There is no difference.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'combine pairs latest values whenever either stream emits; zip pairs strictly 1-to-1.',
        keyConcept: 'combine vs zip Stream Merging Semantics',
        detailed: `- <code>zip</code>: Strict 1-to-1 lockstep. If Flow A emits 5 times and Flow B emits once, <code>zip</code> only produces 1 output until Flow B emits again.
- <code>combine</code>: Whenever Flow A emits, it combines with the latest emission from Flow B, and vice-versa. Ideal for combining multiple UI inputs (e.g. username + password validation).`,
        realWorldPitfall: 'Using `zip` for form validation: if user types 10 characters in username and 1 in password, zip only processes the first character!',
        correctAnswerBreakdown: 'Option B accurately distinguishes 1-to-1 lockstep pairing from latest value combining.'
      }
    },

    // DBMS Section
    {
      id: 's16-q9-zscore-fraud-statistical-anomaly',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Statistical Outlier Anomaly (Z-Score > 3x Average)',
      prompt: `Identify all transactions where the <code>amount</code> is greater than <strong>3 times the average transaction amount</strong> for that specific account.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>transaction_id</code>, <code>amount</code>, <code>avg_account_spend</code> (rounded to 2 decimal places).`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status)`,
      expectedColumns: ['account_id', 'transaction_id', 'amount', 'avg_account_spend'],
      validationType: 'zscore_fraud_anomaly',
      sampleSolution: `WITH account_stats AS (
    SELECT 
        account_id,
        transaction_id,
        amount,
        ROUND(AVG(amount) OVER (PARTITION BY account_id), 2) AS avg_account_spend
    FROM transactions
    WHERE status = 'COMPLETED'
)
SELECT account_id, transaction_id, amount, avg_account_spend
FROM account_stats
WHERE amount > 3 * avg_account_spend
ORDER BY amount DESC;`,
      marks: 10,
      explanation: {
        summary: 'AVG() OVER (PARTITION BY account_id) computes customer baselines; filtering where amount > 3 * avg detects fraud spikes.',
        keyConcept: 'Partitioned Statistical Baselines',
        detailed: `Using window functions avoids self-joins or correlated subqueries. Each transaction row is evaluated against its account's baseline average in a single scan.`,
        realWorldPitfall: 'Computing global average across all bank customers instead of partitioning per individual customer.',
        correctAnswerBreakdown: 'AVG() OVER (PARTITION BY account_id) with amount > 3 * avg filter.'
      }
    },
    {
      id: 's16-q10-recursive-referral-hierarchy',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Recursive CTE for Referral Bonus Hierarchy',
      prompt: `Customer referral bonuses cascade up to 3 levels deep.
Write a <strong>Recursive Common Table Expression (CTE)</strong> to trace all direct and indirect referrals starting from root customer <code>'CUST-100'</code>.
<br/><br/>
<strong>Return:</strong>
- <code>customer_id</code>, <code>referred_by</code>, <code>referral_level</code>.`,
      schemaContext: `Table: customers (customer_id, customer_name, referred_by)`,
      expectedColumns: ['customer_id', 'referred_by', 'referral_level'],
      validationType: 'recursive_referral_cte',
      sampleSolution: `WITH RECURSIVE referral_tree AS (
    -- Anchor member: direct referrals of CUST-100 (Level 1)
    SELECT 
        customer_id, 
        referred_by, 
        1 AS referral_level
    FROM customers
    WHERE referred_by = 'CUST-100'

    UNION ALL

    -- Recursive member: cascade referrals up to level 3
    SELECT 
        c.customer_id, 
        c.referred_by, 
        r.referral_level + 1
    FROM customers c
    JOIN referral_tree r ON c.referred_by = r.customer_id
    WHERE r.referral_level < 3
)
SELECT customer_id, referred_by, referral_level
FROM referral_tree
ORDER BY referral_level ASC, customer_id ASC;`,
      marks: 10,
      explanation: {
        summary: 'WITH RECURSIVE traverses parent-child hierarchical trees up to specified depth.',
        keyConcept: 'Recursive Common Table Expressions (CTE)',
        detailed: `A recursive CTE has:
1. <strong>Anchor member:</strong> Initial query finding base nodes.
2. <code>UNION ALL</code>
3. <strong>Recursive member:</strong> Joins back to the CTE itself until the termination condition (<code>level &lt; 3</code>) is met.`,
        realWorldPitfall: 'Omitting the depth termination condition can cause an infinite loop if circular referrals exist.',
        correctAnswerBreakdown: 'WITH RECURSIVE anchor + recursive join with level constraint.'
      }
    },
    {
      id: 's16-q11-consistently-active-monthly-accounts',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Consistently Active Customers (Transactions in All 12 Months)',
      prompt: `Find all accounts that have completed transactions in <strong>every single calendar month</strong> of the year 2026 (exactly 12 distinct months).
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>distinct_months_active</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, timestamp, status)`,
      expectedColumns: ['account_id', 'distinct_months_active'],
      validationType: 'consistently_active_12_months',
      sampleSolution: `SELECT 
    account_id,
    COUNT(DISTINCT strftime('%m', timestamp)) AS distinct_months_active
FROM transactions
WHERE strftime('%Y', timestamp) = '2026'
  AND status = 'COMPLETED'
GROUP BY account_id
HAVING COUNT(DISTINCT strftime('%m', timestamp)) = 12;`,
      marks: 10,
      explanation: {
        summary: 'HAVING COUNT(DISTINCT month) = 12 filters accounts active across all calendar months.',
        keyConcept: 'Relational Division & Complete Coverage',
        detailed: `Extracting the month formatted as <code>%m</code> and using <code>COUNT(DISTINCT strftime('%m', timestamp)) = 12</code> guarantees that the customer had transactions in January through December without exception.`,
        realWorldPitfall: 'Using `COUNT(transaction_id) >= 12` (which could be 12 transactions in January alone).',
        correctAnswerBreakdown: 'COUNT(DISTINCT strftime(\'%m\', timestamp)) = 12.'
      }
    },
    {
      id: 's16-q12-expire-stale-pending-transactions',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Batch Expire Stale Pending Authorizations (> 30 Mins)',
      prompt: `Write an SQL <code>UPDATE</code> query to set <code>status = 'EXPIRED'</code> for all transactions currently in <code>status = 'PENDING'</code> that were created more than <strong>30 minutes (1800 seconds)</strong> ago.`,
      schemaContext: `Table: transactions (transaction_id, status, timestamp)`,
      expectedColumns: ['query_status'],
      validationType: 'expire_stale_txns_update',
      sampleSolution: `UPDATE transactions 
SET status = 'EXPIRED' 
WHERE status = 'PENDING' 
  AND (strftime('%s', 'now') - strftime('%s', timestamp)) > 1800;`,
      marks: 10,
      explanation: {
        summary: 'UPDATE with epoch time subtraction marks stale pending holds as EXPIRED.',
        keyConcept: 'Time-Based State Machine Expirations',
        detailed: `In payment gateways, authorizations hold funds for 30 minutes. If no capture confirmation arrives, background jobs mark them EXPIRED to release holds.`,
        realWorldPitfall: 'Forgetting `status = \'PENDING\'` would overwrite COMPLETED historical transactions!',
        correctAnswerBreakdown: 'UPDATE ... SET status = \'EXPIRED\' WHERE status = \'PENDING\' AND delta > 1800.'
      }
    },
    {
      id: 's16-q13-covering-aggregate-index-ddl',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Index Optimization for Monthly Balance Aggregations',
      prompt: `The bank dashboard runs this query millions of times daily:
<pre><code>SELECT account_id, strftime('%Y-%m', timestamp) AS m, SUM(amount) FROM transactions GROUP BY account_id, m;</code></pre>
Write SQLite DDL to create an index that provides an <strong>Index-Only Scan</strong> for this query.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['query_status'],
      validationType: 'covering_aggregate_index_ddl',
      sampleSolution: `CREATE INDEX idx_txn_monthly_agg 
ON transactions(account_id, timestamp, amount);`,
      marks: 10,
      explanation: {
        summary: 'Covering index containing account_id, timestamp, and amount avoids table reads during aggregation.',
        keyConcept: 'Aggregation Covering Index',
        detailed: `By storing <code>account_id</code>, <code>timestamp</code>, and <code>amount</code> directly in the index B-tree, SQLite reads index leaf blocks sequentially to evaluate grouping and summation without touching the underlying transaction table.`,
        realWorldPitfall: 'Omitting `amount` from the index forces a table lookup for every single row.',
        correctAnswerBreakdown: 'CREATE INDEX ... (account_id, timestamp, amount).'
      }
    },

    // DSA Coding Section
    {
      id: 's16-q14-three-sum-triplets-zero',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: 3Sum Triplet Sum to Zero in O(N^2) without Duplicates',
      prompt: `Given an integer array <code>nums</code> of size $N$, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that $i \\ne j, i \\ne k, j \\ne k$, and:
$$\\text{nums}[i] + \\text{nums}[j] + \\text{nums}[k] = 0$$
<strong>Notice that the solution set must NOT contain duplicate triplets.</strong>
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in <strong>$O(N^2)$ time</strong>.
- $O(N^3)$ brute force will <strong>Fail All Tests</strong>.
- $3 \\le N \\le 3000$, $-10^5 \\le nums[i] \\le 10^5$.
<br/><br/>
<strong>Input Format:</strong>
Line 1: $N$<br/>
Line 2: $N$ space-separated integers.<br/>
<strong>Output Format:</strong>
Print each unique triplet on a new line (sorted in non-decreasing order), or print nothing if no triplets exist.`,
      difficulty: 'Medium-Hard',
      marks: 30,
      timeLimitMs: 1500,
      memoryLimitMb: 256,
      starterCode: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
        
        List<List<Integer>> triplets = threeSum(nums);
        
        StringBuilder sb = new StringBuilder();
        for (List<Integer> triplet : triplets) {
            sb.append(triplet.get(0)).append(" ")
              .append(triplet.get(1)).append(" ")
              .append(triplet.get(2)).append("\n");
        }
        System.out.print(sb.toString());
    }

    public static List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        if (nums == null || nums.length < 3) return result;
        
        // Step 1: Sort array in O(N log N)
        Arrays.sort(nums);
        int n = nums.length;
        
        // Step 2: Fix first element nums[i] and use Two Pointers for remaining two
        for (int i = 0; i < n - 2; i++) {
            // Early break: if smallest element is > 0, sum cannot be 0
            if (nums[i] > 0) break;
            
            // Skip duplicate values for first element
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int left = i + 1;
            int right = n - 1;
            
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    
                    // Skip duplicates for left pointer
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    // Skip duplicates for right pointer
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: '6\n-1 0 1 2 -1 -4',
          expectedOutput: '-1 -1 2\n-1 0 1\n',
          isSample: true
        },
        {
          id: 'tc-2',
          input: '3\n0 1 1',
          expectedOutput: '',
          isSample: true
        },
        {
          id: 'tc-3',
          input: '3\n0 0 0',
          expectedOutput: '0 0 0\n',
          isSample: false
        },
        {
          id: 'tc-4',
          input: '5\n-2 0 1 1 2',
          expectedOutput: '-2 0 2\n-2 1 1\n',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Sort array; iterate through element i, then use two pointers (left and right) skipping identical values to eliminate duplicate triplets in O(N^2) time.',
        keyConcept: '3Sum via Sorting & Two Pointers with Duplicate Pruning',
        detailed: `1. Sort the array ($O(N \\log N)$).
2. For each fixed index $i$:
   - If $i > 0$ and $nums[i] == nums[i-1]$, skip to prevent duplicate answers.
   - Use two pointers: <code>left = i + 1</code>, <code>right = n - 1</code>.
   - If sum $== 0$: Record triplet, then advance <code>left</code> while $nums[left] == nums[left+1]$ and advance <code>right</code> while $nums[right] == nums[right-1]$.
   - If sum $< 0$: Increment <code>left</code> to increase total.
   - If sum $> 0$: Decrement <code>right</code> to decrease total.
Total runtime is $O(N \\log N) + O(N^2) = O(N^2)$ with $O(1)$ auxiliary space beyond the output list.`,
        realWorldPitfall: 'Using a HashSet of lists to deduplicate: hashing lists has high memory overhead and slows down execution, risking TLE on HackerEarth.',
        correctAnswerBreakdown: 'O(N^2) time with in-place pointer duplicate skipping.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's16-q15-rxjava-repository-to-flow-retry',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: Migrating RxJava Repository Layer to Flow with Custom Exponential Backoff',
      prompt: `Migrate a legacy RxJava <code>BankingRepository</code>:
<pre><code>public Observable&lt;List&lt;Transaction&gt;&gt; observeTransactions() {
    return api.fetch()
        .retryWhen(new RetryWithDelay(3, 1000))
        .subscribeOn(Schedulers.io());
}</code></pre>
into modern Kotlin Coroutines <code>Flow</code> with:
1. Custom <code>retryWhen</code> operator implementing exponential backoff (1s, 2s, 4s).
2. Catching only transient network errors (<code>IOException</code>) while propagating fatal auth errors (401 Unauthorized) immediately.
3. Offline database cache emission followed by network refresh.`,
      marks: 40,
      evaluationCriteria: [
        'Replaces RxJava Observable with Kotlin Flow',
        'Implements retryWhen with delay(currentDelay) and exponential multiplier',
        'Differentiates IOException vs HttpException(401)',
        'Implements Offline-First: emitAll(dao.getTransactions()) followed by network refresh'
      ],
      sampleSolution: `class ModernBankingRepository @Inject constructor(
    private val api: BankingApiService,
    private val dao: TransactionDao
) {
    fun getTransactionsStream(): Flow<List<TransactionEntity>> = flow {
        // Step 1: Emit local cached data immediately
        val cached = dao.getAllTransactions()
        emit(cached)

        // Step 2: Fetch latest from network with retry
        val networkData = fetchWithExponentialBackoff()
        dao.insertAll(networkData)
        emit(networkData)
    }.flowOn(Dispatchers.IO)

    private suspend fun fetchWithExponentialBackoff(
        maxRetries: Int = 3,
        initialDelayMs: Long = 1000L
    ): List<TransactionEntity> {
        var currentDelay = initialDelayMs
        repeat(maxRetries - 1) { attempt ->
            try {
                return api.getTransactions()
            } catch (e: IOException) {
                // Transient network error: backoff and retry
                delay(currentDelay)
                currentDelay *= 2
            } catch (e: HttpException) {
                if (e.code() == 401) {
                    throw e // Propagate authentication failure immediately!
                }
                delay(currentDelay)
                currentDelay *= 2
            }
        }
        return api.getTransactions() // Final attempt
    }
}`,
      explanation: {
        summary: 'Kotlin Flow with suspending retry and flowOn(Dispatchers.IO) replaces complex RxJava RetryWithDelay operators with clean, readable code.',
        keyConcept: 'Flow Offline-First & Suspending Exponential Backoff',
        detailed: `In RxJava, exponential backoff required complex <code>.retryWhen { errors -> errors.flatMap { ... } }</code> constructs that were hard to read and test.
In Kotlin Coroutines:
Suspension makes delays trivial: <code>delay(currentDelay)</code> pauses the coroutine without blocking any thread.
Distinguishing fatal errors (HTTP 401 Session Expired) from transient network blips prevents useless retries that lock user accounts.`,
        realWorldPitfall: 'Retrying on HTTP 401 Unauthorized: retrying 3 times with bad credentials locks the user banking profile!',
        correctAnswerBreakdown: 'Flow producer with flowOn(Dispatchers.IO), selective error retry, and exponential delay.'
      }
    }
  ]
};
