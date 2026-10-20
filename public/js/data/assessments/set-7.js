/* ==========================================================================
   Assessment Set 7: WorkManager, Background Sync & Conditional Aggregations
   Focus: WorkManager chaining, Doze mode constraints, Expedited workers,
          CASE WHEN aggregations, Stock Buy & Sell, and Background Download Engine.
   ========================================================================== */

export const ASSESSMENT_SET_7 = {
  id: 'set-7',
  number: 7,
  title: 'Set 7: WorkManager, Background Sync & Aggregations',
  shortTitle: 'Set 7: WorkManager & Sync',
  focusArea: 'WorkManager Chaining, Constraints, Doze Mode & Greedy Valley-Peak',
  hackerEarthTrack: 'Algorithms > Greedy & Arrays',
  hackerEarthChallenge: 'Code Monk: Greedy Single-Pass Valley-Peak / Stock Timing',
  hackerEarthConcepts: ['Single Pass State Machine', 'Cyclic Shift', 'WorkManager Chaining', 'CASE WHEN Aggregations'],
  difficulty: 'Senior Mobile Engineer',
  durationMinutes: 60,
  badge: 'Background Work',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'WorkManager chaining, CoroutineWorker, Doze mode, Expedited work, and Assisted Injection.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'Universal quantification, Net balance over time, Recursive CTEs, and CASE WHEN sums.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Best Time to Buy and Sell Stock (Single Pass Valley-Peak in O(N)).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Reliable Background Sync & Download Engine with WorkManager.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's7-q1-workmanager-unique-policy',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'WorkManager: ExistingPeriodicWorkPolicy.UPDATE vs KEEP vs CANCEL_AND_REENQUEUE',
      prompt: `In an Android banking app, a periodic ledger audit worker is registered:
<pre><code>WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "LedgerAuditWork",
    ExistingPeriodicWorkPolicy.KEEP,
    workRequest
)</code></pre>
If the app updates the worker interval from 24 hours to 12 hours and calls this method with <code>KEEP</code>, what happens?`,
      options: [
        { id: 'opt-a', text: 'WorkManager immediately updates the scheduled interval to 12 hours.' },
        { id: 'opt-b', text: 'WorkManager ignores the new request completely and continues running the existing work on the 24-hour interval.' },
        { id: 'opt-c', text: 'WorkManager cancels all pending jobs.' },
        { id: 'opt-d', text: 'A duplicate work request is enqueued alongside the first one.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'ExistingPeriodicWorkPolicy.KEEP preserves the existing scheduled work and discards the new request.',
        keyConcept: 'WorkManager Unique Work Policies',
        detailed: `- <code>KEEP</code>: Retains the existing work if one is already scheduled; ignores the new request.
- <code>CANCEL_AND_REENQUEUE</code>: Cancels existing work and starts from zero.
- <code>UPDATE</code> (WorkManager 2.8+): Modifies the existing work parameters (e.g. interval) without losing internal retry state.`,
        realWorldPitfall: 'Using KEEP when you intend to update intervals after an app update; the new interval never takes effect.',
        correctAnswerBreakdown: 'Option B correctly describes KEEP behavior.'
      }
    },
    {
      id: 's7-q2-coroutineworker-do-work',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'WorkManager: CoroutineWorker vs Worker Threading',
      prompt: `What is the primary architectural difference between extending <code>Worker</code> and extending <code>CoroutineWorker</code> in WorkManager?`,
      options: [
        { id: 'opt-a', text: 'Worker runs on the Main Thread while CoroutineWorker runs in C++.' },
        { id: 'opt-b', text: 'Worker.doWork() is synchronous and runs on a background Executor. CoroutineWorker.doWork() is a suspending function running on Dispatchers.Default, supporting native Kotlin coroutines and cancellation.' },
        { id: 'opt-c', text: 'CoroutineWorker can only run once.' },
        { id: 'opt-d', text: 'Worker does not support constraints.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'CoroutineWorker exposes a suspend doWork() running natively on Dispatchers.Default with coroutine cancellation.',
        keyConcept: 'WorkManager Kotlin Integration',
        detailed: `<code>CoroutineWorker</code> provides first-class support for suspending calls (Retrofit suspend, Room suspend). When the OS stops the work (e.g. Wi-Fi dropped), the underlying coroutine is cancelled automatically via cooperative cancellation.`,
        realWorldPitfall: 'Using standard Worker and blocking threads with Thread.sleep() or runBlocking().',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's7-q3-expedited-work-quota',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'WorkManager: Expedited Work & setExpedited()',
      prompt: `When enqueuing an urgent high-priority payment confirmation:
<pre><code>val request = OneTimeWorkRequestBuilder&lt;PaymentWorker&gt;()
    .setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
    .build()</code></pre>
What is the purpose of <strong>Expedited Work</strong> in Android 12+?`,
      options: [
        { id: 'opt-a', text: 'It gives the app unlimited battery consumption.' },
        { id: 'opt-b', text: 'It allows critical tasks to execute immediately, bypassing Doze mode and App Standby buckets, subject to an OS quota.' },
        { id: 'opt-c', text: 'It runs the worker on the GPU.' },
        { id: 'opt-d', text: 'It disables network encryption.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Expedited work executes immediately regardless of Doze mode, subject to system quota limits.',
        keyConcept: 'Android Expedited Jobs & Quota Management',
        detailed: `Since Android 12 restricted foreground service launches from background, <code>setExpedited()</code> is the official replacement for urgent work (chat messages, payment webhooks). If quota is exceeded, <code>OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST</code> gracefully falls back to regular background scheduling.`,
        realWorldPitfall: 'Using `OutOfQuotaPolicy.DROP_WORK_REQUEST`: can result in lost payments if quota runs out.',
        correctAnswerBreakdown: 'Option B accurately highlights immediate execution and Doze bypass.'
      }
    },
    {
      id: 's7-q4-android-doze-mode',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Battery Optimization: Android Doze Mode & Maintenance Windows',
      prompt: `When an Android device is unplugged, stationary, and screen is off for an extended period, what restrictions does the OS kernel enforce under <strong>Deep Doze Mode</strong>?`,
      options: [
        { id: 'opt-a', text: 'The device powers off automatically.' },
        { id: 'opt-b', text: 'Network access is disabled, wake locks are ignored, standard AlarmManager alarms are deferred, and background syncs are suspended until periodic maintenance windows occur.' },
        { id: 'opt-c', text: 'Only cellular calls are allowed; Wi-Fi chips are deleted.' },
        { id: 'opt-d', text: 'Apps are uninstalled from RAM.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Doze mode defers network, ignores wake locks, and batches background work into maintenance windows.',
        keyConcept: 'Android Doze Mode Restrictions',
        detailed: `To preserve battery life when stationary, Android enters Deep Doze. The kernel suspends network traffic and defers background sync jobs. Only high-priority FCM push messages or Expedited Work can wake the system.`,
        realWorldPitfall: 'Trying to run continuous infinite loops in services while device is in Doze mode.',
        correctAnswerBreakdown: 'Option B accurately describes Doze restrictions.'
      }
    },
    {
      id: 's7-q5-hilt-assisted-inject',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Dependency Injection: Hilt @AssistedInject in Worker Classes',
      prompt: `Why does a custom <code>CoroutineWorker</code> require <code>@AssistedInject</code> and <code>@Assisted</code> annotations instead of standard <code>@Inject constructor(...)</code>?`,
      options: [
        { id: 'opt-a', text: 'Hilt cannot inject workers.' },
        { id: 'opt-b', text: 'WorkManager instantiates workers dynamically at runtime and must pass runtime parameters (Context, WorkerParameters) that are not known in the static Dagger graph.' },
        { id: 'opt-c', text: 'AssistedInject runs faster on Android.' },
        { id: 'opt-d', text: 'It enables ProGuard to delete the worker.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '@AssistedInject combines static graph dependencies with dynamic runtime parameters (Context, WorkerParameters).',
        keyConcept: 'Hilt Assisted Injection & Custom Worker Factories',
        detailed: `Standard Dagger <code>@Inject</code> only handles dependencies known at graph compile time. A Worker requires <code>@Assisted appContext: Context</code> and <code>@Assisted workerParams: WorkerParameters</code> supplied by the OS at the moment of execution. <code>@AssistedInject</code> bridges both worlds.`,
        realWorldPitfall: 'Failing to configure `HiltWorkerFactory` in custom Application class triggers WorkManager instantiation crash.',
        correctAnswerBreakdown: 'Option B accurately describes dynamic parameter injection.'
      }
    },
    {
      id: 's7-q6-operator-overloading',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Language: Operator Overloading in Financial Money Classes',
      prompt: `Given a financial currency class:
<pre><code>data class Money(val amount: BigDecimal, val currency: String) {
    operator fun plus(other: Money): Money {
        require(currency == other.currency) { "Currency mismatch" }
        return Money(amount + other.amount, currency)
    }
}</code></pre>
What syntax does the <code>operator</code> keyword enable in Kotlin?`,
      options: [
        { id: 'opt-a', text: 'Money.plus(other)' },
        { id: 'opt-b', text: 'val total = moneyA + moneyB' },
        { id: 'opt-c', text: 'moneyA += moneyB (only)' },
        { id: 'opt-d', text: 'Automatic JSON serialization' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'operator fun plus enables using the mathematical + operator between objects.',
        keyConcept: 'Kotlin Operator Overloading',
        detailed: `In Kotlin, defining a function with the <code>operator</code> keyword matching standard conventions (<code>plus</code>, <code>minus</code>, <code>times</code>, <code>get</code>, <code>invoke</code>) allows using intuitive mathematical symbols like <code>moneyA + moneyB</code>.`,
        realWorldPitfall: 'Defining operator functions without validation: e.g. adding USD to GBP without exchange rate conversion.',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's7-q7-compose-animated-visibility',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: AnimatedVisibility Enter/Exit Transitions',
      prompt: `In an account warning banner in Compose:
<pre><code>AnimatedVisibility(
    visible = hasOverdraft,
    enter = fadeIn() + expandVertically(),
    exit = fadeOut() + shrinkVertically()
) {
    OverdraftWarningBanner()
}</code></pre>
What is the user experience benefit of combining <code>fadeIn() + expandVertically()</code>?`,
      options: [
        { id: 'opt-a', text: 'It prevents recomposition.' },
        { id: 'opt-b', text: 'It creates a smooth accordion slide-and-fade animation while adjusting the surrounding layout height smoothly, avoiding abrupt layout jumps.' },
        { id: 'opt-c', text: 'It runs on a C++ thread.' },
        { id: 'opt-d', text: 'It renders in 4K resolution.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'AnimatedVisibility animates both opacity and layout height to eliminate visual jumps.',
        keyConcept: 'Compose Animation Transitions & Layout Stability',
        detailed: `Simply using <code>if (hasOverdraft)</code> abruptly snaps content into place, displacing adjacent list items. Combining <code>fadeIn()</code> and <code>expandVertically()</code> smoothly animates both alpha and layout bounds simultaneously.`,
        realWorldPitfall: 'Using plain opacity animations without height animation leaves an empty blank gap in the layout.',
        correctAnswerBreakdown: 'Option B accurately highlights accordion expansion.'
      }
    },
    {
      id: 's7-q8-periodic-work-minimum-interval',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'WorkManager Constraints: PeriodicWorkRequest Minimum Interval',
      prompt: `What is the <strong>minimum allowable repetition interval</strong> for a <code>PeriodicWorkRequest</code> enforced by the Android OS?`,
      options: [
        { id: 'opt-a', text: '1 minute' },
        { id: 'opt-b', text: '15 minutes' },
        { id: 'opt-c', text: '1 hour' },
        { id: 'opt-d', text: '24 hours' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'PeriodicWorkRequest enforces a minimum interval of 15 minutes (MIN_PERIODIC_INTERVAL_MILLIS).',
        keyConcept: 'WorkManager Battery Protection Thresholds',
        detailed: `To prevent battery drain, Google enforces a hard minimum interval of **15 minutes** (<code>PeriodicWorkRequest.MIN_PERIODIC_INTERVAL_MILLIS</code>). If you specify a shorter duration (e.g. 5 minutes), WorkManager automatically clamps it to 15 minutes.`,
        realWorldPitfall: 'Assuming `PeriodicWorkRequest(5, TimeUnit.MINUTES)` will fire every 5 minutes; it will fire every 15 minutes.',
        correctAnswerBreakdown: 'Option B is the official 15-minute floor.'
      }
    },

    // DBMS Section
    {
      id: 's7-q9-conditional-aggregations-case',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Net Ledger Cash Flow (Credits vs Debits) per Account',
      prompt: `Calculate the net transaction volume for each account by subtracting total DEBITS from total CREDITS using <code>CASE WHEN</code>.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>total_credits</code>, <code>total_debits</code>, and <code>net_flow</code>.`,
      schemaContext: `Table: transactions (account_id, amount, transaction_type, status)`,
      expectedColumns: ['account_id', 'total_credits', 'total_debits', 'net_flow'],
      validationType: 'net_cash_flow',
      sampleSolution: `SELECT 
    account_id,
    SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END) AS total_credits,
    SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END) AS total_debits,
    SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE -amount END) AS net_flow
FROM transactions
WHERE status = 'SUCCESS'
GROUP BY account_id;`,
      marks: 10,
      explanation: {
        summary: 'Pivots credits and debits in a single query pass using CASE WHEN.',
        keyConcept: 'Conditional Financial Sums in SQL',
        detailed: `Computes both gross flows and net cash balance change in a single table scan.`,
        realWorldPitfall: 'Using separate queries joined together adds redundant I/O passes.',
        correctAnswerBreakdown: 'Computes net flow per account.'
      }
    },
    {
      id: 's7-q10-recursive-cte-referrals',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Recursive CTE for Customer Referral Hierarchy',
      prompt: `In SQLite, write the syntax structure for a <strong>Recursive Common Table Expression</strong> (CTE) starting with customer <code>'ACC-101'</code>.
<pre><code>WITH RECURSIVE ReferralTree AS (...) SELECT * FROM ReferralTree;</code></pre>`,
      schemaContext: `Table: customer_referrals (account_id, referred_by)`,
      expectedColumns: ['account_id', 'level'],
      validationType: 'recursive_cte',
      sampleSolution: `WITH RECURSIVE ReferralTree AS (
    SELECT account_id, 0 AS level FROM accounts WHERE account_id = 'ACC-101'
    UNION ALL
    SELECT a.account_id, r.level + 1 FROM accounts a JOIN ReferralTree r ON a.branch = 'London Canary Wharf' WHERE r.level < 2
)
SELECT account_id, level FROM ReferralTree;`,
      marks: 10,
      explanation: {
        summary: 'WITH RECURSIVE enables tree and hierarchy traversal in SQLite 3.8.3+.',
        keyConcept: 'SQLite Recursive CTEs',
        detailed: `Recursive CTEs feature an anchor member and a recursive member joined with <code>UNION ALL</code>, essential for organizational charts and referral tree networks.`,
        realWorldPitfall: 'Omitting a termination condition (WHERE level < N) creates an infinite recursion loop!',
        correctAnswerBreakdown: 'Valid recursive structure.'
      }
    },
    {
      id: 's7-q11-anomalous-gap-detection',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Identify Inactive Account Gaps Greater than 10 Days',
      prompt: `Write an SQL query using <code>LAG()</code> to find transactions where the gap between consecutive transactions for the same account was <strong>greater than 10 days</strong> (864,000 seconds).
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>transaction_id</code>, <code>timestamp</code>, and <code>days_since_prev</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, timestamp)`,
      expectedColumns: ['account_id', 'transaction_id', 'timestamp', 'days_since_prev'],
      validationType: 'inactivity_gap',
      sampleSolution: `WITH Gaps AS (
    SELECT 
        account_id,
        transaction_id,
        timestamp,
        ROUND((strftime('%s', timestamp) - strftime('%s', LAG(timestamp) OVER (PARTITION BY account_id ORDER BY timestamp))) / 86400.0, 1) AS days_since_prev
    FROM transactions
)
SELECT account_id, transaction_id, timestamp, days_since_prev
FROM Gaps
WHERE days_since_prev > 10;`,
      marks: 10,
      explanation: {
        summary: 'Computes epoch difference between consecutive transactions using LAG(timestamp).',
        keyConcept: 'Temporal Window Analytics',
        detailed: `Detects re-activation of dormant accounts which often correlates with compromised credentials.`,
        realWorldPitfall: 'Dividing epoch seconds by 86400 without decimal `.0` truncates fractional days.',
        correctAnswerBreakdown: 'Identifies transaction gaps > 10 days.'
      }
    },
    {
      id: 's7-q12-universal-quantification',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Accounts with 100% Successful Transactions',
      prompt: `Find all accounts where <strong>every single transaction</strong> recorded has <code>status = 'SUCCESS'</code> (zero failed or pending transactions).
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, status)`,
      expectedColumns: ['account_id'],
      validationType: 'all_successful_accounts',
      sampleSolution: `SELECT account_id
FROM transactions
GROUP BY account_id
HAVING COUNT(*) = SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END);`,
      marks: 10,
      explanation: {
        summary: 'HAVING COUNT(*) = SUM(CASE WHEN status = "SUCCESS" ...) enforces universal success.',
        keyConcept: 'Universal Quantification in SQL',
        detailed: `Ensures that no row in the group has any status other than SUCCESS.`,
        realWorldPitfall: 'Filtering with WHERE status = "SUCCESS" in an inner query: still returns accounts that also had failed transactions!',
        correctAnswerBreakdown: 'ACC-101 and ACC-103 have 100% success rate.'
      }
    },
    {
      id: 's7-q13-top-merchant-volumes',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Merchant Category Spend Breakdown',
      prompt: `Calculate the total revenue and transaction volume per <code>merchant_category</code> for all successful DEBIT transactions.
<br/><br/>
<strong>Return:</strong>
- <code>merchant_category</code>, <code>total_spent</code>, <code>volume</code>.
- Order by <code>total_spent DESC</code>.`,
      schemaContext: `Table: transactions (merchant_category, amount, transaction_type, status)`,
      expectedColumns: ['merchant_category', 'total_spent', 'volume'],
      validationType: 'merchant_category_breakdown',
      sampleSolution: `SELECT 
    merchant_category,
    SUM(amount) AS total_spent,
    COUNT(*) AS volume
FROM transactions
WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
GROUP BY merchant_category
ORDER BY total_spent DESC;`,
      marks: 10,
      explanation: {
        summary: 'Standard aggregation by category sorted by total volume.',
        keyConcept: 'Category Summarization in Ledger Audits',
        detailed: `Summarizes retail, groceries, and travel spending.`,
        realWorldPitfall: 'Missing DEBIT filter includes credit returns in spend total.',
        correctAnswerBreakdown: 'Luxury and Hotels top category spend.'
      }
    },

    // DSA Problem
    {
      id: 's7-q14-best-time-stock',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Optimal Execution Timing (Single Pass Peak-Valley)',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Algorithms &gt; Greedy
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Single-Pass Peak-Valley Algorithm
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(N) Time | O(1) Space
  </span>
</div>
You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock or currency pair on the <code>i</code>-th day.
<br/><br/>
You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.
<br/><br/>
Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return <code>0</code>.
<br/><br/>
<strong>Constraints:</strong>
- <code>1 &lt;= prices.size &lt;= 10^5</code>
- <code>0 &lt;= prices[i] &lt;= 10^4</code>
- <strong>Time Complexity:</strong> Must run in <code>O(N)</code>.
- <strong>Space Complexity:</strong> Must run in <code>O(1)</code> space.`,
      starterCode: `fun maxProfit(prices: IntArray): Int {
    var minPrice = Int.MAX_VALUE
    var maxProfit = 0

    // TODO: Track minimum price so far and maximum profit in O(N)

    return maxProfit
}

fun main() {
    val arr = intArrayOf(7, 1, 5, 3, 6, 4)
    println("Max Profit: " + maxProfit(arr))
}`,
      solutionCode: `fun maxProfit(prices: IntArray): Int {
    var minPrice = Int.MAX_VALUE
    var maxProfit = 0

    for (price in prices) {
        if (price < minPrice) {
            minPrice = price // Found new valley
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice // Found new peak profit
        }
    }

    return maxProfit
}

fun main() {
    val arr = intArrayOf(7, 1, 5, 3, 6, 4)
    println(maxProfit(arr))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Standard Valley Peak', input: '[7,1,5,3,6,4]', expected: '5', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: Strictly Decreasing (No Profit)', input: '[7,6,4,3,1]', expected: '0', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: Single Element', input: '[9]', expected: '0', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: Peak at Very End', input: '[2,4,1,10]', expected: '9', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Maintains running minimum price so far and tracks maximum price - minPrice difference in O(N) time and O(1) space.',
        keyConcept: 'Single Pass Valley-Peak Greedy Tracking',
        detailed: `A brute-force two-loop check takes $O(N^2)$.
By maintaining <code>minPrice</code> as the lowest point seen so far, each element only needs to compare <code>price - minPrice</code> against <code>maxProfit</code>. Total passes = 1, space = $O(1)$.`,
        realWorldPitfall: 'Selling before buying: sorting the array violates the chronological order of days!',
        correctAnswerBreakdown: 'Buy on day 2 (price 1) and sell on day 5 (price 6) gives profit 5.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's7-q15-android-arch-workmanager-sync',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Reliable Background Sync Engine with WorkManager',
      prompt: `Implement a production <strong>Background Sync Engine</strong> in Android using <code>CoroutineWorker</code>, network constraints, foreground progress notifications, and exponential backoff retry.`,
      starterCode: `// WorkManager Background Sync Engine
// 1. COROUTINE WORKER with doWork()
// 2. CONSTRAINTS (NetworkType.UNMETERED + RequiresCharging)
// 3. ENQUEUE LOGIC with BackoffPolicy`,
      fullArchitectureCode: `package com.bank.mastery.sync

import android.content.Context
import androidx.work.*
import java.util.concurrent.TimeUnit

class StatementSyncWorker(
    appContext: Context,
    params: WorkerParameters
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        return try {
            // Perform background network download and Room insertion
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}

fun schedulePeriodicSync(context: Context) {
    val constraints = Constraints.Builder()
        .setRequiredNetworkType(NetworkType.UNMETERED)
        .setRequiresBatteryNotLow(true)
        .build()

    val request = PeriodicWorkRequestBuilder<StatementSyncWorker>(12, TimeUnit.HOURS)
        .setConstraints(constraints)
        .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
        .build()

    WorkManager.getInstance(context).enqueueUniquePeriodicWork(
        "StatementSync",
        ExistingPeriodicWorkPolicy.UPDATE,
        request
    )
}`,
      marks: 40,
      explanation: {
        summary: 'Configures CoroutineWorker with UNMETERED constraint, EXPONENTIAL backoff, and UPDATE policy.',
        keyConcept: 'Enterprise Background Sync Engineering',
        detailed: `Adheres to modern Android battery guidelines. <code>Result.retry()</code> combined with exponential backoff handles temporary network drops without overloading servers.`,
        realWorldPitfall: 'Using LINEAR backoff with 1-second retries during an API outage causes a thundering herd problem.',
        correctAnswerBreakdown: 'Full WorkManager implementation.'
      }
    }
  ]
};
