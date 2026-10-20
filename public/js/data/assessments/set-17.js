/* ==========================================================================
   Assessment Set 17: Deep Android Performance, App Size & Battery Optimization
   Focus: Baseline Profiles, R8/ProGuard Shrinking, Doze Mode & WorkManager,
          Longest Palindromic Substring (Expand Around Center O(1) space).
   ========================================================================== */

export const ASSESSMENT_SET_17 = {
  id: 'set-17',
  number: 17,
  title: 'Set 17: Android Performance, App Size & Battery Optimization',
  shortTitle: 'Set 17: Performance & Battery',
  focusArea: 'Baseline Profiles, R8 Shrinking, WorkManager Doze & Palindromic Substrings',
  hackerEarthTrack: 'Algorithms > Strings & Dynamic Programming',
  hackerEarthChallenge: 'Code Monk: Longest Palindromic Substring in O(1) Extra Space',
  hackerEarthConcepts: ['Expand Around Center', 'O(1) Space Palindrome', 'Baseline Profiles', 'R8 Full Mode'],
  difficulty: 'Senior / Lead Mobile Engineer',
  durationMinutes: 75,
  badge: 'Performance Guru',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android Performance, Profiling & App Optimization',
      shortTitle: 'Performance & R8',
      icon: '⚡',
      description: 'Senior optimizations: ART Baseline Profiles, R8 full mode, Doze mode WorkManager constraints, and Bitmap.Config.HARDWARE.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Top-N per customer category, percentage spend contributions, and brute-force login alerts.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Longest Palindromic Substring in O(N^2) Time and O(1) Auxiliary Space.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Enterprise Baseline Profiles & Macrobenchmark implementation for 60/120fps Compose scrolling.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's17-q1-baseline-profiles-art',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'ART Runtime: Baseline Profiles & Ahead-of-Time (AOT) Compilation',
      prompt: `Why does including <strong>Baseline Profiles</strong> in an Android release build reduce app cold launch time by up to 30% and eliminate initial scrolling jank?`,
      options: [
        { id: 'opt-a', text: 'Baseline profiles compress the APK file to half its size.' },
        { id: 'opt-b', text: 'Baseline Profiles provide the Android Runtime (ART) with a curated list of critical classes and methods (e.g. startup and first frame composables). ART pre-compiles this critical code to native machine code (AOT) during app installation, completely bypassing slow JIT interpretation on the first launch.' },
        { id: 'opt-c', text: 'Baseline profiles enable 5G download acceleration.' },
        { id: 'opt-d', text: 'Baseline profiles are only used in debug builds.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Baseline Profiles trigger AOT compilation during install, eliminating JIT compilation pauses during cold startup.',
        keyConcept: 'ART AOT/JIT Hybrid & Profile-Guided Optimization (PGO)',
        detailed: `In Android ART:
Without profiles, an app launches in <strong>JIT (Just-In-Time) Interpretation mode</strong>. The CPU interprets DEX bytecode while simultaneously compiling hot methods, resulting in dropped frames during startup and initial scroll.
With Baseline Profiles (generated via Macrobenchmark):
During app installation, the Play Store / OS pre-compiles the specified critical classes into native binary code ahead of time (AOT). The first launch executes fully optimized native machine code instantly!`,
        realWorldPitfall: 'Releasing Jetpack Compose apps without Baseline Profiles causes noticeable 1-2 second startup delays.',
        correctAnswerBreakdown: 'Option B accurately explains AOT pre-compilation during install.'
      }
    },
    {
      id: 's17-q2-r8-full-mode-shrinking',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Code Shrinking: R8 Full Mode vs Compat Mode and Reflection',
      prompt: `When migrating an Android build to <strong>R8 Full Mode</strong> (<code>android.enableR8.fullMode=true</code>):
Why do serialization libraries using reflection (like Gson) crash at runtime unless explicit <code>-keepclassmembers</code> rules are configured?`,
      options: [
        { id: 'opt-a', text: 'R8 full mode does not support Java.' },
        { id: 'opt-b', text: 'In Full Mode, R8 aggressively removes or obfuscates unreferenced fields, inlines single-implementation interfaces, and optimizes away parameter names. If a model class is only accessed via reflection by Gson, R8 considers fields unused and strips or renames them, causing deserialization to return null.' },
        { id: 'opt-c', text: 'Full mode requires Kotlin 2.0.' },
        { id: 'opt-d', text: 'R8 only deletes comments.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'R8 Full Mode aggressively strips and renames unreferenced fields accessed only through reflection.',
        keyConcept: 'R8 Full Mode Aggressive Optimizations',
        detailed: `In compat mode, R8 preserved certain reflective patterns. In <strong>Full Mode</strong>:
R8 aggressively inlines classes, merges interfaces, and renames fields to <code>a, b, c</code>.
Because Gson inspects fields reflectively by string name (e.g. <code>"account_id"</code>), reading obfuscated fields fails silently or crashes.
Solution: Use <code>kotlinx.serialization</code> (compiler plugin without reflection) or annotate models with <code>@Keep</code>.`,
        realWorldPitfall: 'Enabling R8 full mode without testing release builds causes API response models to deserialize with all null properties in production.',
        correctAnswerBreakdown: 'Option B accurately highlights reflective field stripping and renaming in R8 Full Mode.'
      }
    },
    {
      id: 's17-q3-doze-mode-workmanager-constraints',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Battery Optimization: Android Doze Mode & WorkManager Constraints',
      prompt: `When an Android device enters <strong>Doze Mode</strong> (screen off, unplugged, stationary):
Why does legacy background execution (e.g. <code>AlarmManager</code> with WakeLocks) drain battery and get killed, while <code>WorkManager</code> executes reliably?`,
      options: [
        { id: 'opt-a', text: 'WorkManager bypasses Android battery optimizations entirely.' },
        { id: 'opt-b', text: 'Doze Mode suspends network access, CPU wakelocks, and alarms, grouping execution into brief "maintenance windows". WorkManager coordinates with Android JobScheduler to schedule tasks specifically during maintenance windows and defers work until battery/network constraints are met.' },
        { id: 'opt-c', text: 'WorkManager runs on Google servers.' },
        { id: 'opt-d', text: 'WakeLocks are permanently enabled in Android 14.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'WorkManager respects Doze maintenance windows and defers execution until OS constraints are satisfied.',
        keyConcept: 'Android Doze Mode & JobScheduler Maintenance Windows',
        detailed: `In Doze mode, the OS severely throttles CPU and cuts off network access to preserve battery.
Apps that acquire <code>WakeLock</code> fight the OS, draining battery and triggering Play Console battery warnings.
<code>WorkManager</code> integrates with the OS battery manager:
It batches background sync tasks to execute only during periodic <strong>maintenance windows</strong> or when constraints (like <code>setRequiresCharging(true)</code> and <code>setRequiredNetworkType(NetworkType.UNMETERED)</code>) are met.`,
        realWorldPitfall: 'Using continuous background threads or WakeLocks: Android 12+ flags and kills the app for high background battery drain.',
        correctAnswerBreakdown: 'Option B accurately explains Doze maintenance window batching.'
      }
    },
    {
      id: 's17-q4-bitmap-hardware-config',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Memory Footprint: Bitmap.Config.HARDWARE (GraphicBuffer Memory)',
      prompt: `Why does modern Android (API 26+) recommend decoding images using <code>Bitmap.Config.HARDWARE</code> for display-only bitmaps?`,
      options: [
        { id: 'opt-a', text: 'It saves bitmaps as raw text files.' },
        { id: 'opt-b', text: 'HARDWARE bitmaps allocate memory directly in GPU GraphicBuffer memory rather than the Java/ART heap. This reduces app heap memory usage by 80%, avoids GC pressure, and enables near-instant zero-copy drawing to the GPU.' },
        { id: 'opt-c', text: 'HARDWARE bitmaps allow pixel modification on the CPU.' },
        { id: 'opt-d', text: 'It disables image rendering.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'HARDWARE bitmaps live in GPU VRAM, keeping large image allocations off the JVM heap and preventing OOMs.',
        keyConcept: 'GraphicBuffer & Bitmap.Config.HARDWARE',
        detailed: `Standard <code>ARGB_8888</code> allocates 4 bytes per pixel on the JVM heap or native heap, contributing directly to heap pressure and triggering garbage collection passes during fast scrolling.
<code>Bitmap.Config.HARDWARE</code> stores pixels directly in a <code>GraphicBuffer</code> in GPU memory:
- Java heap consumption is zero.
- Drawing is instantaneous (no texture upload CPU-to-GPU copy required).
- Trade-off: HARDWARE bitmaps are immutable and cannot be drawn to with a software <code>Canvas</code>.`,
        realWorldPitfall: 'Calling `bitmap.getPixel(x, y)` on a HARDWARE bitmap throws IllegalArgumentException.',
        correctAnswerBreakdown: 'Option B accurately highlights GPU GraphicBuffer allocation and zero-copy rendering.'
      }
    },
    {
      id: 's17-q5-choreographer-frame-budget',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'UI Diagnostics: Android Choreographer Frame Deadlines',
      prompt: `The Android <code>Choreographer</code> synchronizes rendering with the hardware display VSYNC pulse.
To maintain <strong>120 Hz</strong> refresh rate (high-refresh displays found on modern flagships), what is the maximum time budget available for the Main thread to process input, animation, layout, and draw passes per frame?`,
      options: [
        { id: 'opt-a', text: '16.6 milliseconds' },
        { id: 'opt-b', text: '8.33 milliseconds' },
        { id: 'opt-c', text: '33.3 milliseconds' },
        { id: 'opt-d', text: '100 milliseconds' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '120Hz displays have a strict 8.33ms frame deadline (1000ms / 120 = 8.33ms).',
        keyConcept: 'VSYNC Frame Budgets (60Hz vs 90Hz vs 120Hz)',
        detailed: `- <strong>60 Hz:</strong> $1000 / 60 \\approx 16.66\\text{ ms}$.
- <strong>90 Hz:</strong> $1000 / 90 \\approx 11.11\\text{ ms}$.
- <strong>120 Hz:</strong> $1000 / 120 \\approx 8.33\\text{ ms}$.
If the Main thread spends 9ms parsing JSON or measuring views, it misses the VSYNC deadline. The Choreographer drops the frame, resulting in visible stutter (jank).`,
        realWorldPitfall: 'Assuming you have 16ms to work on modern devices: on a 120Hz display, a 10ms operation drops frames!',
        correctAnswerBreakdown: 'Option B: 8.33 milliseconds.'
      }
    },
    {
      id: 's17-q6-strictmode-disk-reads-ci',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Diagnostics: StrictMode ThreadPolicy & VmPolicy',
      prompt: `What is the difference between <code>StrictMode.ThreadPolicy</code> and <code>StrictMode.VmPolicy</code>?`,
      options: [
        { id: 'opt-a', text: 'ThreadPolicy is for Kotlin; VmPolicy is for Java.' },
        { id: 'opt-b', text: 'ThreadPolicy detects accidental operations on the Main thread (disk reads, disk writes, unbuffered network calls); VmPolicy detects application-wide memory and resource leaks (unclosed SQLite cursors, leaked Closable objects, Activity instance leaks, non-SDK interface reflection).' },
        { id: 'opt-c', text: 'VmPolicy only runs on virtual machines in cloud emulators.' },
        { id: 'opt-d', text: 'ThreadPolicy monitors battery percentage.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'ThreadPolicy catches Main-thread I/O violations; VmPolicy catches resource leaks (cursors, activities, files).',
        keyConcept: 'StrictMode ThreadPolicy vs VmPolicy',
        detailed: `In Android:
- <code>ThreadPolicy</code>: Monitored per thread. Catches <code>detectDiskReads()</code>, <code>detectDiskWrites()</code>, <code>detectNetwork()</code> on the UI thread.
- <code>VmPolicy</code>: Monitored process-wide. Catches <code>detectLeakedSqlLiteObjects()</code> (unclosed Cursors/Databases), <code>detectLeakedClosableObjects()</code> (unclosed InputStreams), <code>detectActivityLeaks()</code>.`,
        realWorldPitfall: 'Forgetting to close a Cursor in legacy SQLite: VmPolicy flags a fatal crash if penaltyDeath() is enabled.',
        correctAnswerBreakdown: 'Option B accurately distinguishes thread-bound I/O checks from process-wide resource leak detection.'
      }
    },
    {
      id: 's17-q7-overdraw-gpu-debugging',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Graphics Performance: GPU Overdraw Elimination',
      prompt: `When inspecting GPU Overdraw in Developer Options, a screen flashes <strong>Red</strong> (4x+ overdraw).
What is the most common architectural cause of severe overdraw in Android views, and how is it fixed?`,
      options: [
        { id: 'opt-a', text: 'Screen brightness is too high.' },
        { id: 'opt-b', text: 'Setting background colors redundantly on nested layouts (e.g. window background + Activity root layout background + Fragment background + RecyclerView item background). Fixing it requires removing window backgrounds (window.setBackgroundDrawable(null)) and eliminating redundant parent backgrounds.' },
        { id: 'opt-c', text: 'Using VectorDrawables.' },
        { id: 'opt-d', text: 'Running on Android 14.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Stacking opaque backgrounds on nested containers forces the GPU to paint the same pixel 4+ times per frame.',
        keyConcept: 'GPU Overdraw & Pixel Fill-Rate Bottlenecks',
        detailed: `Overdraw occurs when the GPU wastes cycles drawing pixels that are immediately painted over by another opaque view on top.
Color code:
- Blue: 1x overdraw (acceptable)
- Green: 2x overdraw
- Pink: 3x overdraw
- Red: 4x+ overdraw (serious performance penalty)
Removing unnecessary <code>android:background</code> attributes from parent containers allows the GPU to write directly to the frame buffer once.`,
        realWorldPitfall: 'Setting a solid white background on the Activity root layout when the Theme window already provides a white background.',
        correctAnswerBreakdown: 'Option B accurately explains redundant stacked backgrounds and window background removal.'
      }
    },
    {
      id: 's17-q8-compose-unstable-lambda-allocation',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Compose Performance: Unstable Lambda Allocation in LazyColumn Slots',
      prompt: `Why does writing an inline trailing lambda inside a <code>LazyColumn</code> item cause unnecessary recompositions during scroll:
<pre><code>items(transactions) { txn ->
    TransactionRow(
        transaction = txn,
        onClick = { viewModel.onSelect(txn.id) } // Line X
    )
}</code></pre>`,
      options: [
        { id: 'opt-a', text: 'Compose does not support lambdas.' },
        { id: 'opt-b', text: 'A new lambda instance is allocated on every single recomposition/scroll frame because it captures txn.id. The Compose runtime compares parameter equality: because the lambda reference changes every frame, Compose considers the parameters changed and forces TransactionRow to recompose.' },
        { id: 'opt-c', text: 'It causes OutOfMemoryError.' },
        { id: 'opt-d', text: 'viewModel.onSelect must be static.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Capturing lambdas allocated in list slots change identity every frame, breaking Composable skipping.',
        keyConcept: 'Lambda Stability & Composable Skipping',
        detailed: `For a Composable to be <strong>skipping</strong> (skipping recomposition when inputs do not change), all arguments must be stable.
When a lambda captures an item parameter:
<code>{ viewModel.onSelect(txn.id) }</code>
a new function instance is instantiated on every pass. When Compose evaluates whether <code>TransactionRow</code> needs recomposition, it compares the lambda instance: <code>oldLambda !== newLambda</code>. Recomposition cannot be skipped!
Solution: Pass <code>onSelect: (String) -&gt; Unit</code> with a stable method reference or hoist the click handler.`,
        realWorldPitfall: 'Allocating capturing lambdas in list items defeats Compose skipping, causing scroll stutter.',
        correctAnswerBreakdown: 'Option B accurately explains new lambda allocation and failed equality checks.'
      }
    },

    // DBMS Section
    {
      id: 's17-q9-top-3-txns-per-category',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Top 3 Highest Transactions per Category via ROW_NUMBER()',
      prompt: `Write an SQL query to retrieve the <strong>top 3 highest transaction amounts</strong> for each spending category.
<br/><br/>
<strong>Return:</strong>
- <code>category</code>, <code>transaction_id</code>, <code>amount</code>, <code>category_rank</code>.
- Order by <code>category ASC, category_rank ASC</code>.`,
      schemaContext: `Table: transactions (transaction_id, category, amount, timestamp)`,
      expectedColumns: ['category', 'transaction_id', 'amount', 'category_rank'],
      validationType: 'top_3_per_category',
      sampleSolution: `WITH ranked_category_txns AS (
    SELECT 
        category,
        transaction_id,
        amount,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY amount DESC, transaction_id ASC) AS category_rank
    FROM transactions
)
SELECT category, transaction_id, amount, category_rank
FROM ranked_category_txns
WHERE category_rank <= 3
ORDER BY category ASC, category_rank ASC;`,
      marks: 10,
      explanation: {
        summary: 'ROW_NUMBER() partitioned by category orders transactions descending; filtering <= 3 selects top 3.',
        keyConcept: 'Top-N per Category Pattern',
        detailed: `The standard relational pattern to find the top $N$ items per group partitions by the grouping column and filters the generated row rank $\\le N$ in an outer query.`,
        realWorldPitfall: 'Using LIMIT 3 (which restricts the entire query result to 3 rows, not 3 per category).',
        correctAnswerBreakdown: 'ROW_NUMBER() OVER (PARTITION BY category ORDER BY amount DESC) <= 3.'
      }
    },
    {
      id: 's17-q10-category-percentage-contribution',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Percentage Contribution of Each Category to Total Spend',
      prompt: `Calculate the total spending per category and its <strong>percentage share</strong> of the institution's overall total transaction volume.
<br/><br/>
<strong>Return:</strong>
- <code>category</code>, <code>category_total</code>, <code>percentage_share</code> (rounded to 2 decimal places).
- Order by <code>category_total DESC</code>.`,
      schemaContext: `Table: transactions (transaction_id, category, amount, status)`,
      expectedColumns: ['category', 'category_total', 'percentage_share'],
      validationType: 'category_percentage_share',
      sampleSolution: `WITH total_metrics AS (
    SELECT SUM(amount) AS grand_total FROM transactions WHERE status = 'COMPLETED'
),
category_metrics AS (
    SELECT 
        category,
        ROUND(SUM(amount), 2) AS category_total
    FROM transactions
    WHERE status = 'COMPLETED'
    GROUP BY category
)
SELECT 
    c.category,
    c.category_total,
    ROUND((c.category_total * 100.0) / t.grand_total, 2) AS percentage_share
FROM category_metrics c
CROSS JOIN total_metrics t
ORDER BY c.category_total DESC;`,
      marks: 10,
      explanation: {
        summary: 'CROSS JOIN with overall grand total computes proportional percentage contributions per category.',
        keyConcept: 'Proportional Aggregation & Market Basket Analysis',
        detailed: `Using a CTE to compute the scalar grand total allows cross-joining it with grouped category aggregates to compute percentage distributions without subquery duplication.`,
        realWorldPitfall: 'Integer division: omitting `* 100.0` causes integer truncation to 0% in SQLite.',
        correctAnswerBreakdown: 'Category total divided by grand total * 100.0.'
      }
    },
    {
      id: 's17-q11-brute-force-login-alerts',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Account Takeover Alert (3+ Failed Logins in 15 Mins)',
      prompt: `Identify all accounts that registered <strong>3 or more FAILED login attempts</strong> within a 15-minute (900 seconds) sliding window.
<br/><br/>
<strong>Return:</strong>
- <code>DISTINCT account_id</code>`,
      schemaContext: `Table: login_attempts (attempt_id, account_id, status, timestamp)`,
      expectedColumns: ['account_id'],
      validationType: 'brute_force_login_detection',
      sampleSolution: `SELECT DISTINCT l1.account_id
FROM login_attempts l1
JOIN login_attempts l2 ON l1.account_id = l2.account_id
    AND l1.status = 'FAILED'
    AND l2.status = 'FAILED'
    AND l1.attempt_id != l2.attempt_id
    AND strftime('%s', l2.timestamp) >= strftime('%s', l1.timestamp)
    AND (strftime('%s', l2.timestamp) - strftime('%s', l1.timestamp)) <= 900
GROUP BY l1.account_id, l1.attempt_id
HAVING COUNT(l2.attempt_id) >= 2;`,
      marks: 10,
      explanation: {
        summary: 'Joining failed attempts within a 900-second window detects brute-force attack bursts.',
        keyConcept: 'Sliding Window Security Event Detection',
        detailed: `Counting paired failed attempts occurring within 15 minutes of an initial failure flags credential-stuffing attacks for automated temporary account lockouts.`,
        realWorldPitfall: 'Using global daily counts: slow spaced attempts over 24 hours are not brute-force bursts.',
        correctAnswerBreakdown: 'Self-join on status = FAILED with 900s epoch delta.'
      }
    },
    {
      id: 's17-q12-partitioned-date-pruning',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Year-Month In-Memory Aggregate Pruning',
      prompt: `Calculate the total debit volume processed per bank branch during the single month <code>'2026-10'</code>.
<br/><br/>
<strong>Return:</strong>
- <code>branch</code>, <code>monthly_debit_volume</code>.`,
      schemaContext: `Table: transactions (transaction_id, branch, amount, transaction_type, timestamp)`,
      expectedColumns: ['branch', 'monthly_debit_volume'],
      validationType: 'monthly_debit_pruning',
      sampleSolution: `SELECT 
    branch,
    ROUND(SUM(amount), 2) AS monthly_debit_volume
FROM transactions
WHERE transaction_type = 'DEBIT'
  AND timestamp >= '2026-10-01 00:00:00'
  AND timestamp <= '2026-10-31 23:59:59'
GROUP BY branch
ORDER BY monthly_debit_volume DESC;`,
      marks: 10,
      explanation: {
        summary: 'Direct timestamp range comparison (>= and <=) allows B-Tree index range seeks, unlike strftime functions.',
        keyConcept: 'SARGable Range Queries vs Function Calls',
        detailed: `Writing <code>strftime('%Y-%m', timestamp) = '2026-10'</code> is <strong>non-SARGable</strong>: SQLite must execute the strftime function on every row in the table (Full Table Scan).
Writing <code>timestamp &gt;= '2026-10-01' AND timestamp &lt;= '2026-10-31'</code> allows SQLite to seek directly into the timestamp B-Tree index, accelerating the query by 100x!`,
        realWorldPitfall: 'Using SQL functions in WHERE clauses disables B-Tree index seeks.',
        correctAnswerBreakdown: 'Direct boundary comparison timestamp >= ... AND timestamp <= ...'
      }
    },
    {
      id: 's17-q13-foreign-key-enforce-pragma',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Enforcing SQLite Foreign Keys PRAGMA DDL',
      prompt: `SQLite compiles with foreign key support, but by default foreign key enforcement is <strong>disabled</strong> for backwards compatibility.
Write the exact SQLite command required in <code>RoomOpenHelper.onConfigure()</code> to enable foreign key cascade constraints.`,
      schemaContext: `Database Configuration`,
      expectedColumns: ['query_status'],
      validationType: 'pragma_foreign_keys_enable',
      sampleSolution: `PRAGMA foreign_keys = ON;`,
      marks: 10,
      explanation: {
        summary: 'PRAGMA foreign_keys = ON enables referential integrity and ON DELETE CASCADE enforcement in SQLite.',
        keyConcept: 'SQLite PRAGMA foreign_keys Configuration',
        detailed: `Without executing <code>PRAGMA foreign_keys = ON;</code>, SQLite completely ignores <code>FOREIGN KEY</code> declarations in DDL! Child records remain orphaned and cascading deletes never trigger. Room enables this automatically, but custom SQLiteOpenHelper databases must execute it in <code>onConfigure()</code>.`,
        realWorldPitfall: 'Assuming foreign keys are active by default in raw SQLite.',
        correctAnswerBreakdown: 'PRAGMA foreign_keys = ON;'
      }
    },

    // DSA Coding Section
    {
      id: 's17-q14-longest-palindromic-substring',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: Longest Palindromic Substring in O(N^2) Time and O(1) Space',
      prompt: `Given a string <code>s</code> of length $N$, find and return the <strong>longest palindromic substring</strong> in <code>s</code>.
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in <strong>$O(N^2)$ time</strong> and <strong>$O(1)$ auxiliary space</strong> (excluding return string).
- Dynamic programming using an $N \\times N$ boolean table uses $O(N^2)$ memory and will <strong>fail Memory Limits</strong> for $N = 10^4$.
- $1 \\le N \\le 1000$, characters are alphanumeric and case-sensitive.
<br/><br/>
<strong>Input Format:</strong>
Line 1: String <code>s</code><br/>
<strong>Output Format:</strong>
Print the longest palindromic substring. If multiple palindromes have the same maximum length, return the first one that appears.`,
      difficulty: 'Medium-Hard',
      marks: 30,
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      starterCode: `import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Solution {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null || s.trim().isEmpty()) {
            System.out.println("");
            return;
        }
        
        System.out.println(longestPalindrome(s.trim()));
    }

    public static String longestPalindrome(String s) {
        if (s == null || s.length() < 1) return "";
        
        int start = 0;
        int end = 0;
        int n = s.length();
        
        // Expand Around Center for every index
        for (int i = 0; i < n; i++) {
            // Case 1: Odd-length palindrome centered at i (e.g. "aba")
            int len1 = expandAroundCenter(s, i, i);
            // Case 2: Even-length palindrome centered between i and i+1 (e.g. "abba")
            int len2 = expandAroundCenter(s, i, i + 1);
            
            int maxLen = Math.max(len1, len2);
            if (maxLen > end - start + 1) {
                // Update start and end boundary indices
                start = i - (maxLen - 1) / 2;
                end = i + maxLen / 2;
            }
        }
        
        return s.substring(start, end + 1);
    }

    private static int expandAroundCenter(String s, int left, int right) {
        int l = left;
        int r = right;
        int n = s.length();
        
        while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) {
            l--;
            r++;
        }
        
        // Length of palindrome is (r - 1) - (l + 1) + 1 = r - l - 1
        return r - l - 1;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: 'babad',
          expectedOutput: 'bab',
          isSample: true
        },
        {
          id: 'tc-2',
          input: 'cbbd',
          expectedOutput: 'bb',
          isSample: true
        },
        {
          id: 'tc-3',
          input: 'a',
          expectedOutput: 'a',
          isSample: false
        },
        {
          id: 'tc-4',
          input: 'forgeeksskeegfor',
          expectedOutput: 'geeksskeeg',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Expand around each center (both single character odd centers and adjacent character even centers) in O(1) space.',
        keyConcept: 'Expand Around Center Algorithm',
        detailed: `A palindrome mirrors around its center:
There are $2N - 1$ possible centers (odd length centers at each character index $i$, and even length centers between $i$ and $i+1$).
For each center:
Expand pointers outwards while <code>s[left] == s[right]</code>.
When the while loop terminates, the length is $(r - 1) - (l + 1) + 1 = r - l - 1$.
Because we only store integer indices (<code>start</code>, <code>end</code>), auxiliary space is strictly $O(1)$, compared to $O(N^2)$ memory required by 2D Dynamic Programming tables.`,
        realWorldPitfall: 'Using 2D DP boolean array `dp[n][n]`: for large strings, allocating a 10,000 x 10,000 array throws OutOfMemoryError.',
        correctAnswerBreakdown: 'O(N^2) time and O(1) auxiliary space using expand around center.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's17-q15-macrobenchmark-baseline-profiles',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: Implementing Baseline Profiles and Macrobenchmark for 120 FPS Compose Feeds',
      prompt: `Implement a production <strong>Baseline Profile Generator</strong> and <strong>Macrobenchmark</strong> test to measure and verify zero-jank frame rates on a banking transactions feed:
1. Write a <code>BaselineProfileGenerator</code> test automating app cold startup and scrolling the <code>LazyColumn</code> feed using UI Automator.
2. Write a <code>CompilationMode.Partial(BaselineProfileMode.Require)</code> benchmark test.
3. Define frame timing metrics asserting that $99\\%$ of frames are delivered within the $8.33\\text{ms}$ (120Hz) frame budget.`,
      marks: 40,
      evaluationCriteria: [
        'Implements @RunWith(AndroidJUnit4::class) with BaselineProfileRule',
        'Uses UI Automator to fling and scroll through the banking feed',
        'Implements MacrobenchmarkRule with FrameTimingMetric',
        'Asserts frameDurationCpuMs P95 / P99 < 8.33ms'
      ],
      sampleSolution: `@RunWith(AndroidJUnit4::class)
@LargeTest
class BaselineProfileGenerator {

    @get:Rule
    val rule = BaselineProfileRule()

    @Test
    fun generateBaselineProfile() = rule.collect(
        packageName = "com.barclays.banking.mobile",
        includeInStartupProfile = true
    ) {
        // Step 1: Cold start app
        pressHome()
        startActivityAndWait()

        // Step 2: Navigate to transaction feed and fling scroll
        val feed = device.findObject(By.res("transaction_lazy_column"))
        feed.setGestureMargin(device.displayWidth / 5)
        feed.fling(Direction.DOWN)
        device.waitForIdle()
    }
}

@RunWith(AndroidJUnit4::class)
@LargeTest
class BankingFeedBenchmark {

    @get:Rule
    val benchmarkRule = MacrobenchmarkRule()

    @Test
    fun scrollFeedWithBaselineProfile() = benchmarkRule.measureRepeated(
        packageName = "com.barclays.banking.mobile",
        metrics = listOf(FrameTimingMetric()),
        compilationMode = CompilationMode.Partial(
            baselineProfileMode = BaselineProfileMode.Require
        ),
        iterations = 5,
        startupMode = StartupMode.WARM
    ) {
        startActivityAndWait()
        val feed = device.findObject(By.res("transaction_lazy_column"))
        feed.fling(Direction.DOWN)
    }
}`,
      explanation: {
        summary: 'BaselineProfileRule automatically captures critical execution paths, eliminating frame drops on 120Hz banking feeds.',
        keyConcept: 'Automated Profile-Guided Optimization with Macrobenchmark',
        detailed: `In enterprise banking apps with millions of users, Play Store delivers the generated <code>baseline-prof.txt</code> alongside the APK.
Android OS compiles the UI Automator interactions into native binary code upon install.
<code>FrameTimingMetric</code> tracks <code>frameDurationCpuMs</code> at the 50th, 90th, 95th, and 99th percentiles, ensuring high-frequency transactions feeds render smoothly without jank.`,
        realWorldPitfall: 'Running benchmarks in debuggable builds: ART turns off optimizations in debug builds, producing invalid benchmark data.',
        correctAnswerBreakdown: 'BaselineProfileRule with UI Automator fling and FrameTimingMetric assertion.'
      }
    }
  ]
};
