/* ==========================================================================
   Assessment Set 12: XML to Jetpack Compose Migration & UI Performance
   Focus: ComposeView vs AndroidView, ViewCompositionStrategy, 3 Phases of Compose,
          derivedStateOf, Longest Consecutive Sequence in O(N).
   ========================================================================== */

export const ASSESSMENT_SET_12 = {
  id: 'set-12',
  number: 12,
  title: 'Set 12: XML to Jetpack Compose Migration & Performance',
  shortTitle: 'Set 12: XML to Compose Migration',
  focusArea: 'ComposeView in XML, ViewCompositionStrategy, Compose 3 Phases & O(N) Hash Sequences',
  hackerEarthTrack: 'Algorithms > Hash Tables & Sets',
  hackerEarthChallenge: 'Code Monk: Longest Consecutive Sequence in O(N)',
  hackerEarthConcepts: ['HashSet Lookup', 'O(N) Disjoint Chains', 'Compose Slot Table', 'ViewCompositionStrategy'],
  difficulty: 'Senior / Lead Mobile Engineer',
  durationMinutes: 75,
  badge: 'Compose Architect',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: XML-to-Compose Migration & Rendering Engine',
      shortTitle: 'XML to Compose',
      icon: '🎨',
      description: 'Incremental UI migration: ComposeView in Fragment XML, ViewCompositionStrategy, 3 Phases of Compose, and derivedStateOf.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Partitioned rankings, duplicate identity detection, and 7-day rolling metrics.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Longest Consecutive Elements Sequence in an Unsorted Array in O(N) Time.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Incrementally migrating an XML Heterogeneous RecyclerView to Jetpack Compose LazyColumn.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's12-q1-view-composition-strategy',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Compose in XML: ViewCompositionStrategy in Fragments',
      prompt: `When embedding a <code>ComposeView</code> inside an existing XML Fragment layout:
<pre><code>override fun onCreateView(...): View {
    return ComposeView(requireContext()).apply {
        // Missing strategy configuration
        setContent { BankingTheme { AccountScreen() } }
    }
}</code></pre>
Why must you explicitly configure <code>setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)</code>?`,
      options: [
        { id: 'opt-a', text: 'To enable hardware acceleration on the fragment window.' },
        { id: 'opt-b', text: 'By default, ComposeView disposes its composition when the View is detached from the window. In Fragments, views are detached during configuration changes and Fragment backstack transitions before the Fragment is destroyed, causing State loss or memory leaks. DisposeOnViewTreeLifecycleDestroyed binds Compose disposal to viewLifecycleOwner.lifecycle onDestroy.' },
        { id: 'opt-c', text: 'ComposeView cannot render without this line.' },
        { id: 'opt-d', text: 'It connects Compose to Android DataBinding.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'DisposeOnViewTreeLifecycleDestroyed prevents premature composition disposal when Fragment views are detached.',
        keyConcept: 'Fragment View Lifecycle vs Window Detachment',
        detailed: `In Android Fragments, the View lifecycle is detached and recreated when navigating in a <code>FragmentManager</code> backstack.
The default <code>ViewCompositionStrategy.DisposeOnDetachedFromWindow</code> disposes the Compose slot table the instant the Fragment view leaves the screen, discarding UI state even if the Fragment is still alive!
<code>DisposeOnViewTreeLifecycleDestroyed</code> synchronizes Compose cleanup with <code>fragment.viewLifecycleOwner</code>.`,
        realWorldPitfall: 'Navigating forward and back in a hybrid XML Fragment app loses all user form inputs if the default strategy is left active.',
        correctAnswerBreakdown: 'Option B accurately highlights Fragment view detachment vs lifecycle destruction.'
      }
    },
    {
      id: 's12-q2-compose-three-phases',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Compose Performance: The 3 Phases of Jetpack Compose',
      prompt: `Jetpack Compose renders frames across 3 distinct phases:
<strong>1. Composition</strong> $\\to$ <strong>2. Layout</strong> $\\to$ <strong>3. Draw</strong>.
To animate the offset of a top-bar based on a scroll offset without triggering recomposition on every pixel scroll, what is the most performant approach?`,
      options: [
        { id: 'opt-a', text: 'Pass scrollOffset directly into Modifier.offset(y = scrollOffset.dp).' },
        { id: 'opt-b', text: 'Use the lambda modifier Modifier.offset { IntOffset(x = 0, y = scrollState.value) } to read the scroll state during the Layout phase, completely skipping the Composition phase.' },
        { id: 'opt-c', text: 'Wrap the composable in a LaunchedEffect.' },
        { id: 'opt-d', text: 'Recreate the Box on every scroll event.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Lambda modifier (Modifier.offset { ... }) defers state reads to the Layout phase, bypassing Composition.',
        keyConcept: 'State Read Deferral & The 3 Compose Phases',
        detailed: `1. <strong>Composition:</strong> Executes the Composable tree and builds the Slot Table.
2. <strong>Layout:</strong> Measures and places UI nodes (Width, Height, Coordinates).
3. <strong>Draw:</strong> Renders pixels on the canvas.
Reading state during Composition forces the entire Composable function to re-execute (recompose) at 60/120fps.
Using lambda-based modifiers like <code>Modifier.offset { ... }</code> or <code>Modifier.drawBehind { ... }</code> defers the state read to Layout or Draw, achieving buttery 120fps animations with 0 recompositions!`,
        realWorldPitfall: 'Reading rapidly changing scroll or sensor values in the Composition phase triggers jank and frame drops.',
        correctAnswerBreakdown: 'Option B explains phase skipping via lambda modifier state reading.'
      }
    },
    {
      id: 's12-q3-derived-state-of-vs-remember',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Compose Optimization: remember(key) vs derivedStateOf',
      prompt: `You want to show a "Scroll to Top" button only when <code>listState.firstVisibleItemIndex &gt; 0</code>.
Which implementation minimizes unnecessary recompositions?`,
      options: [
        { id: 'opt-a', text: 'val showButton = listState.firstVisibleItemIndex > 0' },
        { id: 'opt-b', text: 'val showButton by remember { derivedStateOf { listState.firstVisibleItemIndex > 0 } }' },
        { id: 'opt-c', text: 'val showButton = remember(listState.firstVisibleItemIndex) { listState.firstVisibleItemIndex > 0 }' },
        { id: 'opt-d', text: 'val showButton = mutableStateOf(listState.firstVisibleItemIndex > 0)' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'derivedStateOf only triggers recomposition when the resulting boolean condition changes, filtering out pixel-by-pixel changes.',
        keyConcept: 'derivedStateOf vs remember(key) Thresholding',
        detailed: `<code>listState.firstVisibleItemIndex</code> updates constantly as the user scrolls.
- If you use <code>remember(listState.firstVisibleItemIndex)</code>, the composable recomposes on <strong>every single new item index</strong> (index 1, 2, 3, 4...).
- With <code>derivedStateOf { index &gt; 0 }</code>, the Compose runtime observes the derived condition. It only emits a change when the boolean flips from <code>false -&gt; true</code> or <code>true -&gt; false</code>. It completely suppresses all other recompositions during scroll!`,
        realWorldPitfall: 'Using `remember(scrollState.value)` causes continuous recompositions across the entire screen.',
        correctAnswerBreakdown: 'Option B accurately isolates the derived boolean state flip.'
      }
    },
    {
      id: 's12-q4-android-view-compose-interop',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Compose in XML: Embedding Legacy Views with AndroidView',
      prompt: `When integrating a legacy XML-based third-party charting library or MapView inside a Jetpack Compose screen:
<pre><code>AndroidView(
    factory = { context -> LegacyChartView(context) },
    update = { chartView -> chartView.setData(accountData) }
)</code></pre>
When is the <code>factory</code> block executed versus the <code>update</code> block?`,
      options: [
        { id: 'opt-a', text: 'Both factory and update are called on every recomposition.' },
        { id: 'opt-b', text: 'factory runs exactly once when the node enters the Composition; update runs on the first composition and re-executes whenever state read inside the block (like accountData) changes.' },
        { id: 'opt-c', text: 'factory runs in the background thread; update runs on the main thread.' },
        { id: 'opt-d', text: 'update only runs when the user touches the view.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'AndroidView factory runs once on attachment; update re-executes whenever observed state mutations occur.',
        keyConcept: 'AndroidView Lifecycle & State Updates',
        detailed: `<code>AndroidView</code> bridges standard Android <code>View</code> instances into Compose:
- <code>factory</code>: Instantiates the Java/Android View exactly once. Heavy initialization (like inflations or OpenGL contexts) must live here.
- <code>update</code>: A callback invoked whenever State read inside its lambda updates, allowing you to update View properties without re-inflating the view hierarchy.`,
        realWorldPitfall: 'Re-instantiating heavy view objects inside the `update` block instead of using `factory`.',
        correctAnswerBreakdown: 'Option B accurately explains factory vs update execution cycles.'
      }
    },
    {
      id: 's12-q5-xml-view-inflation-vs-slot-table',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Rendering Architecture: XML View Hierarchy vs Compose Slot Table',
      prompt: `Why does a deep XML layout hierarchy (e.g. nested <code>LinearLayout</code>s with <code>layout_weight</code>) cause significant UI jank compared to equivalent Jetpack Compose layouts?`,
      options: [
        { id: 'opt-a', text: 'XML views do not support GPU rendering.' },
        { id: 'opt-b', text: 'Nested layout_weight triggers double measurement ($O(2^N)$ layout passes) up and down the View hierarchy. Compose enforces single-pass measurement ($O(N)$), forbidding child nodes from being measured more than once during layout.' },
        { id: 'opt-c', text: 'XML views cannot run on 64-bit CPUs.' },
        { id: 'opt-d', text: 'Compose compiles directly to C++ binaries.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Compose enforces single-pass measurement O(N), avoiding the exponential double-measurement passes of nested XML layouts.',
        keyConcept: 'Single-Pass Measurement in Compose vs Multi-Pass XML Views',
        detailed: `In legacy Android XML:
A <code>LinearLayout</code> with <code>layout_weight</code> measures children once to compute remaining space, and a second time to assign final dimensions. If nested $N$ levels deep, measurement complexity explodes to $O(2^N)$, causing frame drops.
Compose architecture strictly forbids multi-pass measurement: each child is measured exactly once ($O(N)$). Complex intrinsic sizing is handled via <code>IntrinsicSize.Min / Max</code> queries before the measure pass.`,
        realWorldPitfall: 'Nesting multiple RelativeLayouts or weighted LinearLayouts in XML causes severe frame drops during RecyclerView scrolling.',
        correctAnswerBreakdown: 'Option B accurately describes the $O(2^N)$ vs $O(N)$ measurement constraint.'
      }
    },
    {
      id: 's12-q6-subcompose-layout-pitfall',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Compose Internals: SubcomposeLayout Use Cases and Overhead',
      prompt: `<code>SubcomposeLayout</code> defers composition of some content until the measurement step of other content (e.g. <code>BoxWithConstraints</code>, <code>LazyColumn</code>).
Why is using <code>SubcomposeLayout</code> inside every item of a scrolling list considered an anti-pattern?`,
      options: [
        { id: 'opt-a', text: 'SubcomposeLayout cannot be used on mobile devices.' },
        { id: 'opt-b', text: 'Subcomposition decouples composition from the normal phase order, incurring high runtime overhead. Creating subcompositions during active scrolling leads to frequent frame drops.' },
        { id: 'opt-c', text: 'It prevents animations from running.' },
        { id: 'opt-d', text: 'It requires Java reflection.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'SubcomposeLayout has high execution overhead; abusing it inside list items causes scrolling jank.',
        keyConcept: 'SubcomposeLayout & Deferred Composition Overhead',
        detailed: `Normally, Composition happens before Layout. <code>SubcomposeLayout</code> allows a composable to measure one child first, and then compose a second child using those measured dimensions.
While necessary for <code>LazyColumn</code> (which must measure its viewport before composing visible items), using it inside individual list items introduces multiple micro-composition cycles per frame, ruining 120Hz scrolling smoothness.`,
        realWorldPitfall: 'Wrapping list items in BoxWithConstraints (which uses SubcomposeLayout internally) destroys LazyColumn scroll performance.',
        correctAnswerBreakdown: 'Option B accurately identifies the runtime overhead of subcomposition during scroll.'
      }
    },
    {
      id: 's12-q7-livedata-to-state-flow-migration',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Architecture Migration: XML LiveData to Compose StateFlow',
      prompt: `In legacy XML, ViewModels exposed <code>LiveData&lt;T&gt;</code> observed via <code>dataBinding</code> or <code>observe(viewLifecycleOwner)</code>.
When migrating to Jetpack Compose, why is observing <code>StateFlow</code> with <code>collectAsStateWithLifecycle()</code> preferred over <code>collectAsState()</code>?`,
      options: [
        { id: 'opt-a', text: 'collectAsState() causes compile-time errors in Compose.' },
        { id: 'opt-b', text: 'collectAsState() keeps collecting from the Flow even when the app is in the background (between onStop and onStart), wasting CPU and battery. collectAsStateWithLifecycle() cancels collection when the Lifecycle drops below Lifecycle.State.STARTED.' },
        { id: 'opt-c', text: 'collectAsStateWithLifecycle() only works with Room databases.' },
        { id: 'opt-d', text: 'StateFlow cannot be observed without LiveData.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'collectAsStateWithLifecycle() halts Flow collection when the app is backgrounded, conserving CPU and network.',
        keyConcept: 'Lifecycle-Aware Flow Collection in Jetpack Compose',
        detailed: `In legacy XML, <code>LiveData</code> was inherently lifecycle-aware: it automatically stopped delivering updates when the Activity was paused/stopped.
Standard <code>collectAsState()</code> does NOT pause when the UI is backgrounded: if the upstream Flow is a continuous location or WebSocket stream, it keeps emitting and processing in the background!
<code>collectAsStateWithLifecycle()</code> (from <code>androidx.lifecycle.compose</code>) halts collection in <code>onStop</code> and resumes in <code>onStart</code>, mirroring LiveData's safety.`,
        realWorldPitfall: 'Using `collectAsState()` on a 60fps stock price stream drains the user device battery while the screen is locked.',
        correctAnswerBreakdown: 'Option B accurately explains background collection suspension.'
      }
    },
    {
      id: 's12-q8-coordinator-layout-to-nested-scroll',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'UI Migration: XML CoordinatorLayout to Compose NestedScrollConnection',
      prompt: `How do you recreate the collapsible toolbar behavior of XML's <code>CoordinatorLayout</code> + <code>AppBarLayout</code> in pure Jetpack Compose?`,
      options: [
        { id: 'opt-a', text: 'By wrapping Compose in an AndroidView containing a CoordinatorLayout.' },
        { id: 'opt-b', text: 'By attaching a custom NestedScrollConnection to Modifier.nestedScroll() that intercepts onPreScroll and onPostScroll deltas to collapse/expand the TopAppBar.' },
        { id: 'opt-c', text: 'By using Thread.sleep() on the main thread.' },
        { id: 'opt-d', text: 'Compose does not support collapsible headers.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Modifier.nestedScroll() with a NestedScrollConnection intercepts scroll deltas to animate collapsible headers.',
        keyConcept: 'NestedScrollConnection & Collapsible Headers',
        detailed: `Compose implements nested scrolling via <code>Modifier.nestedScroll(nestedScrollConnection)</code>:
- <code>onPreScroll</code>: Intercepts the scroll delta before the child (e.g. <code>LazyColumn</code>) consumes it, allowing the header to collapse.
- <code>onPostScroll</code>: Consumes any unconsumed delta after the child hits its boundary, allowing the header to expand.
Material 3's <code>TopAppBarDefaults.enterAlwaysScrollBehavior()</code> is built entirely on this mechanism.`,
        realWorldPitfall: 'Trying to manually calculate scroll offsets inside LazyColumn onScrollListener creates laggy, desynchronized animations.',
        correctAnswerBreakdown: 'Option B describes Compose native nested scrolling architecture.'
      }
    },

    // DBMS Section
    {
      id: 's12-q9-second-highest-per-branch',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Second Highest Transaction per Bank Branch',
      prompt: `Write an SQL query using <code>DENSE_RANK()</code> to find the <strong>2nd highest transaction amount</strong> for each bank branch.
<br/><br/>
<strong>Return:</strong>
- <code>branch</code>, <code>transaction_id</code>, <code>amount</code>.
- Order by <code>branch ASC</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, branch, amount, timestamp)`,
      expectedColumns: ['branch', 'transaction_id', 'amount'],
      validationType: 'second_highest_per_branch',
      sampleSolution: `WITH ranked_txns AS (
    SELECT 
        branch,
        transaction_id,
        amount,
        DENSE_RANK() OVER (PARTITION BY branch ORDER BY amount DESC) AS rnk
    FROM transactions
)
SELECT branch, transaction_id, amount
FROM ranked_txns
WHERE rnk = 2
ORDER BY branch ASC;`,
      marks: 10,
      explanation: {
        summary: 'DENSE_RANK() partitioned by branch isolates the 2nd highest amount per branch.',
        keyConcept: 'Partitioned Ranking with DENSE_RANK()',
        detailed: `<code>PARTITION BY branch ORDER BY amount DESC</code> resets the ranking counter for each individual branch. Using <code>DENSE_RANK()</code> guarantees that if multiple transactions share the top amount, the next distinct lower amount receives rank 2.`,
        realWorldPitfall: 'Using ROW_NUMBER() instead of DENSE_RANK(): if two transactions tie for 1st place, ROW_NUMBER() assigns 1 and 2, incorrectly returning the tied 1st place transaction as 2nd place.',
        correctAnswerBreakdown: 'DENSE_RANK() with PARTITION BY branch WHERE rnk = 2.'
      }
    },
    {
      id: 's12-q10-rolling-7-day-volume',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Rolling 7-Day Spend Volume per Customer',
      prompt: `Calculate the rolling 7-day cumulative debit spending volume for account <code>'ACC-101'</code> for each transaction.
<br/><br/>
<strong>Return:</strong>
- <code>transaction_id</code>, <code>timestamp</code>, <code>amount</code>, and <code>rolling_7d_total</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, timestamp)`,
      expectedColumns: ['transaction_id', 'timestamp', 'amount', 'rolling_7d_total'],
      validationType: 'rolling_7d_volume',
      sampleSolution: `SELECT 
    t1.transaction_id,
    t1.timestamp,
    t1.amount,
    (
        SELECT ROUND(SUM(t2.amount), 2)
        FROM transactions t2
        WHERE t2.account_id = t1.account_id
          AND t2.transaction_type = 'DEBIT'
          AND julianday(t1.timestamp) - julianday(t2.timestamp) BETWEEN 0 AND 7
    ) AS rolling_7d_total
FROM transactions t1
WHERE t1.account_id = 'ACC-101' AND t1.transaction_type = 'DEBIT'
ORDER BY t1.timestamp ASC;`,
      marks: 10,
      explanation: {
        summary: 'Correlated subquery or range window calculates the sum of transactions within the past 7 days.',
        keyConcept: 'Rolling Window Aggregations by Time Delta',
        detailed: `Using <code>julianday(t1.timestamp) - julianday(t2.timestamp) BETWEEN 0 AND 7</code> sums all previous debit transactions that occurred within 7 calendar days of each transaction timestamp.`,
        realWorldPitfall: 'Using ROWS BETWEEN 6 PRECEDING (which counts 7 transactions, NOT 7 days).',
        correctAnswerBreakdown: 'Calculates the true 7-day rolling financial velocity.'
      }
    },
    {
      id: 's12-q11-duplicate-phone-fraud',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Multi-Account Sybil Fraud Detection (Duplicate Phones)',
      prompt: `Identify all phone numbers associated with more than one active customer account (potential synthetic identity fraud).
<br/><br/>
<strong>Return:</strong>
- <code>phone_number</code>, <code>account_count</code>, <code>total_combined_balance</code>.
- Order by <code>account_count DESC</code>.`,
      schemaContext: `Table: accounts (account_id, customer_name, phone_number, balance, status)`,
      expectedColumns: ['phone_number', 'account_count', 'total_combined_balance'],
      validationType: 'duplicate_phone_fraud',
      sampleSolution: `SELECT 
    phone_number,
    COUNT(account_id) AS account_count,
    ROUND(SUM(balance), 2) AS total_combined_balance
FROM accounts
WHERE status = 'ACTIVE' AND phone_number IS NOT NULL
GROUP BY phone_number
HAVING COUNT(account_id) > 1
ORDER BY account_count DESC;`,
      marks: 10,
      explanation: {
        summary: 'GROUP BY phone_number HAVING COUNT > 1 identifies shared phone numbers across multiple accounts.',
        keyConcept: 'Sybil Fraud & Group By Aggregation',
        detailed: `In banking risk operations, multiple high-balance accounts registered under identical phone numbers represent credit stacking or bot mule accounts. <code>HAVING COUNT &gt; 1</code> isolates these fraud clusters.`,
        realWorldPitfall: 'Forgetting `WHERE phone_number IS NOT NULL` will lump all accounts with missing phones into one massive group.',
        correctAnswerBreakdown: 'GROUP BY phone_number HAVING COUNT(account_id) > 1.'
      }
    },
    {
      id: 's12-q12-nth-percentile-transaction',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Customer Spending Decile using NTILE(10)',
      prompt: `Segment all customer accounts into 10 spending deciles (1 = lowest spenders, 10 = highest spenders) based on their total transaction volume.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>total_spent</code>, <code>spending_decile</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status)`,
      expectedColumns: ['account_id', 'total_spent', 'spending_decile'],
      validationType: 'spending_decile_ntile',
      sampleSolution: `WITH customer_spend AS (
    SELECT 
        account_id,
        ROUND(SUM(amount), 2) AS total_spent
    FROM transactions
    WHERE status = 'COMPLETED'
    GROUP BY account_id
)
SELECT 
    account_id,
    total_spent,
    NTILE(10) OVER (ORDER BY total_spent ASC) AS spending_decile
FROM customer_spend
ORDER BY spending_decile DESC, total_spent DESC;`,
      marks: 10,
      explanation: {
        summary: 'NTILE(10) partitions rows into 10 equal buckets based on total spend.',
        keyConcept: 'Customer Segmentation with NTILE()',
        detailed: `<code>NTILE(10)</code> divides ordered customer spend into 10 deciles. Decile 10 represents the top 10% high-net-worth spenders for targeted banking offers.`,
        realWorldPitfall: 'Attempting to calculate percentiles manually using row count math.',
        correctAnswerBreakdown: 'NTILE(10) OVER (ORDER BY total_spent ASC).'
      }
    },
    {
      id: 's12-q13-covering-index-query',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Pure Covering Index Design DDL',
      prompt: `The most frequent query on mobile startup is:
<pre><code>SELECT transaction_id, amount, timestamp FROM transactions WHERE account_id = ? ORDER BY timestamp DESC LIMIT 20;</code></pre>
Write SQLite DDL to create a <strong>Covering Composite Index</strong> such that SQLite satisfies this query entirely from the B-Tree index without hitting table pages.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status, timestamp)`,
      expectedColumns: ['query_status'],
      validationType: 'covering_index_ddl',
      sampleSolution: `CREATE INDEX idx_transactions_covering 
ON transactions(account_id, timestamp DESC, amount, transaction_id);`,
      marks: 10,
      explanation: {
        summary: 'Covering index includes all columns requested in SELECT, WHERE, and ORDER BY.',
        keyConcept: 'Covering Index Optimization (Index-Only Scan)',
        detailed: `When an index includes all columns specified in the query:
1. <code>account_id</code> satisfies the WHERE filter.
2. <code>timestamp DESC</code> satisfies the sort order without an in-memory temp sort.
3. <code>amount</code> and <code>transaction_id</code> are stored directly in the index leaf pages.
SQLite executes an <strong>Index-Only Scan</strong>, avoiding disk page lookups into the main table entirely!`,
        realWorldPitfall: 'Missing a single SELECT column forces SQLite to perform a table lookup for every single index match.',
        correctAnswerBreakdown: 'Composite index covering account_id, timestamp DESC, amount, and transaction_id.'
      }
    },

    // DSA Coding Section
    {
      id: 's12-q14-longest-consecutive-sequence',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: Longest Consecutive Elements Sequence in O(N)',
      prompt: `Given an unsorted array of integers <code>nums</code>, find the length of the longest consecutive elements sequence.
<br/><br/>
<strong>Strict Constraints:</strong>
- You must write an algorithm that runs in <strong>$O(N)$ time</strong>.
- Sorting the array takes $O(N \\log N)$ and is <strong>disqualified / will TLE</strong> on large tests.
- $0 \\le N \\le 10^5$, $-10^9 \\le nums[i] \\le 10^9$.
<br/><br/>
<strong>Input Format:</strong>
Line 1: $N$<br/>
Line 2: $N$ space-separated integers.<br/>
<strong>Output Format:</strong>
A single integer representing the length of the longest consecutive sequence.`,
      difficulty: 'Medium-Hard',
      marks: 30,
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      starterCode: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashSet;
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
        if (n == 0) {
            System.out.println(0);
            return;
        }
        
        int[] nums = new int[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            nums[i] = Integer.parseInt(st.nextToken());
        }
        
        System.out.println(longestConsecutive(nums));
    }

    public static int longestConsecutive(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        // Step 1: Insert all numbers into a HashSet for O(1) lookups
        HashSet<Integer> set = new HashSet<>();
        for (int num : nums) {
            set.add(num);
        }
        
        int maxLength = 0;
        
        // Step 2: Only start counting if 'num' is the START of a sequence (num - 1 not in set)
        for (int num : set) {
            if (!set.contains(num - 1)) {
                int currentNum = num;
                int currentStreak = 1;
                
                while (set.contains(currentNum + 1)) {
                    currentNum++;
                    currentStreak++;
                }
                
                if (currentStreak > maxLength) {
                    maxLength = currentStreak;
                }
            }
        }
        
        return maxLength;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: '6\n100 4 200 1 3 2',
          expectedOutput: '4',
          isSample: true
        },
        {
          id: 'tc-2',
          input: '10\n0 3 7 2 5 8 4 6 0 1',
          expectedOutput: '9',
          isSample: true
        },
        {
          id: 'tc-3',
          input: '0\n',
          expectedOutput: '0',
          isSample: false
        },
        {
          id: 'tc-4',
          input: '5\n1 2 3 4 5',
          expectedOutput: '5',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Insert elements into a HashSet; iterate through elements that have no predecessor (num - 1) to count streak lengths in O(N) amortized time.',
        keyConcept: 'HashSet Disjoint Chain Traversal in O(N)',
        detailed: `Sorting takes $O(N \\log N)$, violating the constraint.
Using a <code>HashSet</code> allows $O(1)$ lookups.
Key insight: An element $x$ is only the start of a consecutive sequence if $x - 1$ does NOT exist in the set!
- If $x - 1$ exists, we skip it because it was or will be counted as part of a longer sequence starting earlier.
- If $x - 1$ does not exist, we loop $x+1, x+2, \\dots$ until the streak breaks.
Because each number is visited at most twice (once in the outer loop, and at most once inside the while loop across all streaks), the total time complexity is strictly $O(N)$!`,
        realWorldPitfall: 'Forgetting the `!set.contains(num - 1)` check causes the while loop to re-scan for every element, degrading to $O(N^2)$ and timing out.',
        correctAnswerBreakdown: 'O(N) time complexity using HashSet boundary check.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's12-q15-xml-recyclerview-to-compose-lazycolumn',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: Migrating Heterogeneous XML RecyclerView to Jetpack Compose LazyColumn',
      prompt: `Migrate a complex banking transaction feed previously implemented with:
- XML <code>RecyclerView</code>
- <code>ListAdapter</code> with <code>DiffUtil.ItemCallback</code>
- 3 distinct <code>ViewHolder</code> ViewTypes:
  1. <code>DateHeaderViewHolder</code>
  2. <code>TransactionItemViewHolder</code>
  3. <code>PromotionalBannerViewHolder</code>
Demonstrate the complete Jetpack Compose <code>LazyColumn</code> implementation with:
1. Stable key specification (<code>key = { ... }</code>) to prevent recomposition churn.
2. <code>contentType</code> optimization for item view recycling.
3. Sticky date headers using <code>stickyHeader</code>.`,
      marks: 40,
      evaluationCriteria: [
        'Uses LazyColumn with items(items, key = { it.id }, contentType = { it.type })',
        'Implements stickyHeader for transaction date dividers',
        'Models UI state with immutable sealed interface / Kotlin value classes',
        'Preserves 120fps scrolling with stable lambdas and deferred state'
      ],
      sampleSolution: `@Immutable
sealed interface FeedItem {
    val id: String

    data class DateHeader(override val id: String, val date: String) : FeedItem
    data class Transaction(override val id: String, val title: String, val amount: Double) : FeedItem
    data class PromoBanner(override val id: String, val bannerUrl: String) : FeedItem
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun TransactionFeedScreen(
    feedItems: List<FeedItem>,
    onTransactionClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(
            items = feedItems,
            key = { item -> item.id },
            contentType = { item ->
                when (item) {
                    is FeedItem.DateHeader -> "header"
                    is FeedItem.Transaction -> "transaction"
                    is FeedItem.PromoBanner -> "banner"
                }
            }
        ) { item ->
            when (item) {
                is FeedItem.DateHeader -> DateHeaderView(item.date)
                is FeedItem.Transaction -> TransactionRow(
                    item = item,
                    onClick = { onTransactionClick(item.id) }
                )
                is FeedItem.PromoBanner -> PromoBannerCard(item.bannerUrl)
            }
        }
    }
}`,
      explanation: {
        summary: 'LazyColumn with stable keys and contentType replaces complex RecyclerView Adapters and ViewHolders with 80% less code.',
        keyConcept: 'LazyColumn contentType & Stable Keys',
        detailed: `In legacy RecyclerView:
Handling multiple view types required overriding <code>getItemViewType()</code>, writing separate XML files, creating custom ViewHolders, and binding them in <code>onCreateViewHolder</code>.
In Jetpack Compose:
1. <code>key = { item.id }</code> preserves scroll position and item animations across list updates.
2. <code>contentType = { ... }</code> mimics RecyclerView view recycling: Compose reuses composition slots between items sharing the same content type, preventing layout remeasurement.`,
        realWorldPitfall: 'Omitting keys causes LazyColumn to discard state (like text field inputs or expanded states) whenever items reorder.',
        correctAnswerBreakdown: 'LazyColumn with key, contentType, and sealed interface data modeling.'
      }
    }
  ]
};
