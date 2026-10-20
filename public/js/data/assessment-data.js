/* ==========================================================================
   HackerEarth-Style Mock Assessment Question Bank & Reference Solutions
   ========================================================================== */

export { ALL_ASSESSMENT_SETS, getAssessmentSetById } from './assessments/index.js';

export const MOCK_DATABASE_FIXTURES = {
  accounts: [
    { account_id: 'ACC-101', customer_name: 'Sophia Patel', branch: 'London Canary Wharf', balance: 14250.00, created_at: '2023-01-15 09:30:00' },
    { account_id: 'ACC-102', customer_name: 'David Cameron', branch: 'Edinburgh Gyle', balance: 3400.50, created_at: '2023-03-22 14:15:00' },
    { account_id: 'ACC-103', customer_name: 'Aisha Al-Mansoor', branch: 'Manchester Central', balance: 28900.00, created_at: '2023-05-10 11:00:00' },
    { account_id: 'ACC-104', customer_name: 'Liam Gallagher', branch: 'Glasgow City', balance: 950.25, created_at: '2023-08-01 16:45:00' },
    { account_id: 'ACC-105', customer_name: 'Elena Rostova', branch: 'London Canary Wharf', balance: 51200.75, created_at: '2023-11-18 10:20:00' }
  ],
  transactions: [
    { transaction_id: 'TXN-901', account_id: 'ACC-101', amount: 450.00, transaction_type: 'DEBIT', status: 'SUCCESS', timestamp: '2024-01-05 10:12:00', merchant_category: 'Groceries' },
    { transaction_id: 'TXN-902', account_id: 'ACC-101', amount: 1200.00, transaction_type: 'DEBIT', status: 'SUCCESS', timestamp: '2024-01-12 14:45:00', merchant_category: 'Electronics' },
    { transaction_id: 'TXN-903', account_id: 'ACC-101', amount: 300.00, transaction_type: 'DEBIT', status: 'SUCCESS', timestamp: '2024-01-20 18:00:00', merchant_category: 'Dining' },
    { transaction_id: 'TXN-904', account_id: 'ACC-101', amount: 50.00, transaction_type: 'DEBIT', status: 'SUCCESS', timestamp: '2024-01-28 08:30:00', merchant_category: 'Transport' },
    { transaction_id: 'TXN-905', account_id: 'ACC-102', amount: 2500.00, transaction_type: 'CREDIT', status: 'SUCCESS', timestamp: '2024-01-10 12:00:00', merchant_category: 'Salary' },
    { transaction_id: 'TXN-906', account_id: 'ACC-102', amount: 800.00, transaction_type: 'DEBIT', status: 'FAILED', timestamp: '2024-01-15 15:20:00', merchant_category: 'Travel' },
    { transaction_id: 'TXN-907', account_id: 'ACC-103', amount: 5400.00, transaction_type: 'DEBIT', status: 'SUCCESS', timestamp: '2024-01-08 17:40:00', merchant_category: 'Luxury' },
    { transaction_id: 'TXN-908', account_id: 'ACC-103', amount: 2100.00, transaction_type: 'DEBIT', status: 'SUCCESS', timestamp: '2024-01-18 11:25:00', merchant_category: 'Hotels' },
    { transaction_id: 'TXN-909', account_id: 'ACC-103', amount: 750.00, transaction_type: 'DEBIT', status: 'SUCCESS', timestamp: '2024-01-25 13:10:00', merchant_category: 'Dining' },
    { transaction_id: 'TXN-910', account_id: 'ACC-103', amount: 320.00, transaction_type: 'DEBIT', status: 'SUCCESS', timestamp: '2024-01-30 09:15:00', merchant_category: 'Groceries' },
    { transaction_id: 'TXN-911', account_id: 'ACC-999', amount: 150.00, transaction_type: 'DEBIT', status: 'PENDING', timestamp: '2024-02-01 10:00:00', merchant_category: 'Online' } // Orphan test row
  ]
};

export const ASSESSMENT_SECTIONS = [
  {
    id: 'sec-android-kotlin',
    title: 'Section 1: Android & Kotlin Engineering',
    shortTitle: 'Android & Kotlin',
    icon: '🤖',
    description: 'Core concepts including Coroutines, Jetpack Compose, Lifecycle, Flow, Hilt DI, and Memory Leaks.',
    questionCount: 8,
    marksPerQuestion: 5
  },
  {
    id: 'sec-dbms-room',
    title: 'Section 2: DBMS & SQLite / Room Queries',
    shortTitle: 'DBMS & Room',
    icon: '🗄️',
    description: 'High-performance SQL queries, Window Functions, Group By / Having, Joins, and Room Schema Migrations.',
    questionCount: 5,
    marksPerQuestion: 10
  },
  {
    id: 'sec-dsa-coding',
    title: 'Section 3: DSA Coding Problem',
    shortTitle: 'DSA Coding',
    icon: '💻',
    description: 'HackerEarth algorithmic challenge with sample testcases, hidden testcases, and Kotlinc JVM runner.',
    questionCount: 1,
    marksPerQuestion: 30
  },
  {
    id: 'sec-android-app-dev',
    title: 'Section 4: Complete Android App Architecture',
    shortTitle: 'Android App Dev',
    icon: '🏗️',
    description: 'Machine coding challenge: Build an Offline-First Banking Account & Transaction Feed with Clean Architecture.',
    questionCount: 1,
    marksPerQuestion: 40
  }
];

export const ASSESSMENT_QUESTIONS = [
  // ==========================================
  // SECTION 1: ANDROID & KOTLIN MCQs (Q1 - Q8)
  // ==========================================
  {
    id: 'q-mcq-coroutines-exceptions',
    sectionId: 'sec-android-kotlin',
    type: 'mcq',
    title: 'Kotlin Coroutines: Structured Concurrency & Failure Propagation',
    prompt: `In a banking app, an account sync operation launches two parallel child coroutines inside a scope:
<pre><code>val scope = CoroutineScope(Dispatchers.IO + Job())
scope.launch {
    launch { fetchAccountBalances() } // Throws IllegalArgumentException
    launch { fetchPendingStatements() } // In-flight network request
}</code></pre>
What is the exact runtime behavior when <code>fetchAccountBalances()</code> throws an unhandled <code>IllegalArgumentException</code>?`,
    options: [
      {
        id: 'opt-a',
        text: 'Only fetchAccountBalances() terminates. fetchPendingStatements() continues running to completion because coroutines are lightweight asynchronous threads.'
      },
      {
        id: 'opt-b',
        text: 'The exception cancels the parent scope and immediately cancels sibling coroutine fetchPendingStatements(), because a standard Job adheres to two-way failure propagation.'
      },
      {
        id: 'opt-c',
        text: 'fetchPendingStatements() will finish, but the exception is silently swallowed unless a CoroutineExceptionHandler is installed on the child launch.'
      },
      {
        id: 'opt-d',
        text: 'The entire Android process crashes immediately with a fatal crash before cancelling any sibling jobs.'
      }
    ],
    correctOptionId: 'opt-b',
    marks: 5,
    explanation: {
      summary: 'Standard Job propagates failures upward to the parent, which cancels all other children.',
      keyConcept: 'Structured Concurrency & Job vs SupervisorJob',
      detailed: `In Kotlin Structured Concurrency, a standard <code>Job()</code> employs **bidirectional cancellation propagation**. When a child coroutine fails with an unhandled exception (other than <code>CancellationException</code>):
1. The child cancels itself.
2. It propagates the exception upward to its parent.
3. The parent cancels all its other children (including the parallel <code>fetchPendingStatements()</code>).
4. The parent re-throws or passes the exception to the thread's uncaught exception handler.

If you want siblings to continue running independently when one fails, you **must use a <code>SupervisorJob</code>** or wrap the block in <code>supervisorScope { ... }</code>.`,
      realWorldPitfall: 'Using `CoroutineScope(Dispatchers.IO + SupervisorJob())` vs `supervisorScope`: if you launch a child inside a `launch`, the inner `launch` still creates a regular child `Job` unless wrapped in `supervisorScope`.',
      correctAnswerBreakdown: 'Option B is correct. Option A describes SupervisorJob behavior, not a standard Job. Option C is wrong because uncaught exceptions in `launch` are never silently swallowed.'
    }
  },
  {
    id: 'q-mcq-compose-recomposition',
    sectionId: 'sec-android-kotlin',
    type: 'mcq',
    title: 'Jetpack Compose: Stability & Skipping Recomposition',
    prompt: `Consider this Jetpack Compose item row displayed inside a banking transaction list:
<pre><code>data class Transaction(val id: String, val tags: List&lt;String&gt;)

@Composable
fun TransactionRow(txn: Transaction, onSelect: () -&gt; Unit) {
    Text(text = txn.id)
}</code></pre>
Even when <code>TransactionRow</code> recomposes, the inputs appear unchanged. Why might Compose fail to <strong>skip</strong> recomposition for this composable?`,
    options: [
      {
        id: 'opt-a',
        text: 'Compose cannot skip functions that accept lambda callbacks like onSelect.'
      },
      {
        id: 'opt-b',
        text: 'Standard standard Kotlin `List<String>` is an interface; the Compose compiler treats it as Unstable because it could be backed by a mutable implementation (e.g. ArrayList).'
      },
      {
        id: 'opt-c',
        text: 'Composables that render standard Text components can never be marked as skippable.'
      },
      {
        id: 'opt-d',
        text: 'Data classes in Kotlin are automatically marked as Non-Skippable by default.'
      }
    ],
    correctOptionId: 'opt-b',
    marks: 5,
    explanation: {
      summary: 'Collections from kotlin.collections (List, Set, Map) are treated as Unstable by the Compose compiler unless using Kotlinx Immutable Collections or @Immutable/@Stable.',
      keyConcept: 'Compose Stability System (Stable vs Unstable parameters)',
      detailed: `The Compose compiler classifies every parameter as either **Stable** or **Unstable**.
- For a composable function to be **skippable**, all its parameters must be Stable.
- <code>List&lt;String&gt;</code> is an interface. At runtime, an instance could be a <code>java.util.ArrayList</code>, which is mutable. Because Compose cannot guarantee immutability across recompositions, it marks <code>List</code> as **Unstable**.
- Consequently, any class containing a <code>List&lt;T&gt;</code> (like <code>data class Transaction</code>) is inferred as **Unstable**, causing <code>TransactionRow</code> to re-execute every time its parent recomposes.

**Solutions:**
1. Annotate the data class with <code>@Immutable</code> or <code>@Stable</code>.
2. Use <code>kotlinx.collections.immutable.ImmutableList&lt;String&gt;</code>.
3. Enable Compose Strong Skipping Mode (default in Compose Compiler 1.5.4+ / Kotlin 2.0+).`,
      realWorldPitfall: 'Assuming that because Kotlin `List` does not expose `.add()`, Compose considers it immutable. Under the hood on JVM, it is just `java.util.List`.',
      correctAnswerBreakdown: 'Option B correctly identifies the collection stability inference mechanism in Jetpack Compose.'
    }
  },
  {
    id: 'q-mcq-android-process-death',
    sectionId: 'sec-android-kotlin',
    type: 'mcq',
    title: 'Android Lifecycle: Process Death vs Configuration Change',
    prompt: `A user enters a 16-digit payment card number into an <code>EditText</code> and switches to their banking authenticator app. Due to heavy background memory pressure, the Android OS kills the app process.
When the user switches back, what component preserves the form state across this <strong>System Process Death</strong>?`,
    options: [
      {
        id: 'opt-a',
        text: 'Standard ViewModel in-memory properties, because ViewModel is scoped to the Activity lifecycle.'
      },
      {
        id: 'opt-b',
        text: 'SavedStateHandle injected into the ViewModel (or onSaveInstanceState Bundle), which is serialized and retained by the Android ActivityManagerService.'
      },
      {
        id: 'opt-c',
        text: 'Static companion object variables inside the Application class.'
      },
      {
        id: 'opt-d',
        text: 'Android Jetpack Navigation backstack cache, which resides in the Linux kernel shared memory.'
      }
    ],
    correctOptionId: 'opt-b',
    marks: 5,
    explanation: {
      summary: 'ViewModel only survives configuration changes; SavedStateHandle / onSaveInstanceState survives OS Process Death.',
      keyConcept: 'ViewModel Memory Lifespan vs System Process Kill',
      detailed: `When the operating system kills an app process to reclaim RAM:
- All in-memory allocations, singletons, Application objects, and standard <code>ViewModel</code> instances are completely wiped out.
- The OS retains the <code>Bundle</code> written during <code>onSaveInstanceState()</code> in system server memory (via <code>ActivityManagerService</code> / <code>WindowState</code>).
- Android Jetpack provides <code>SavedStateHandle</code> directly into your ViewModel via constructor injection. Any data saved into <code>savedStateHandle["card_number"] = text</code> is automatically restored when the user returns and the process is reconstituted.`,
      realWorldPitfall: 'Senior interviewers frequently test whether you know the difference between screen rotation (recreation without process destruction) and Low Memory Killer (LMK process termination).',
      correctAnswerBreakdown: 'Option B is correct. Option A is a classic beginner mistake: standard ViewModels die with the process.'
    }
  },
  {
    id: 'q-mcq-flow-state-vs-shared',
    sectionId: 'sec-android-kotlin',
    type: 'mcq',
    title: 'Kotlin Flow: StateFlow vs SharedFlow for One-Time Events',
    prompt: `In an MVI/MVVM Android architecture, you need to trigger a one-time <code>ShowBiometricErrorSnackbar</code> or <code>NavigateToDashboard</code> event.
Why is <code>StateFlow</code> <strong>unsuitable</strong> for one-time events?`,
    options: [
      {
        id: 'opt-a',
        text: 'StateFlow cannot be collected on Dispatchers.Main.'
      },
      {
        id: 'opt-b',
        text: 'StateFlow is conflated and requires an initial value; new collectors will re-receive the last emitted event upon screen rotation or recomposition (event replay bug).'
      },
      {
        id: 'opt-c',
        text: 'StateFlow does not support structured concurrency.'
      },
      {
        id: 'opt-d',
        text: 'StateFlow throws an IllegalStateException if collected by more than one observer.'
      }
    ],
    correctOptionId: 'opt-b',
    marks: 5,
    explanation: {
      summary: 'StateFlow is conflated and always holds a current value, causing re-emission of one-time events when views re-subscribe.',
      keyConcept: 'StateFlow (Continuous State) vs Channel / SharedFlow (Discrete Events)',
      detailed: `<code>StateFlow</code> represents a **state holder**:
1. It **always** requires an initial value.
2. It is **conflated**: intermediate values can be skipped if a collector is slow, and calling <code>value = sameValue</code> does not trigger emissions (distinctUntilChanged).
3. Any new collector (e.g. when an Activity or Fragment rotates and calls <code>repeatOnLifecycle</code>) immediately receives the **latest value**.
If you emit <code>ShowPaymentErrorDialog</code> via <code>StateFlow</code>, rotating the device re-triggers the dialog popup!

**Best Practice:**
Use <code>Channel&lt;UiEvent&gt;(capacity = Channel.BUFFERED).receiveAsFlow()</code> or <code>SharedFlow</code> with <code>replay = 0</code> for discrete one-time events.`,
      realWorldPitfall: 'Using Event wrappers (`Event<T>` with `hasBeenHandled`) in Kotlin Flow is an anti-pattern when Channels cleanly represent single-subscriber one-time queues.',
      correctAnswerBreakdown: 'Option B correctly identifies the conflation and replay characteristics of StateFlow.'
    }
  },
  {
    id: 'q-mcq-hilt-scoping',
    sectionId: 'sec-android-kotlin',
    type: 'mcq',
    title: 'Dagger / Hilt: Component Scopes & Retained Hierarchy',
    prompt: `In a modular Hilt Android banking application, what is the key lifecycle difference between:
<code>@ActivityScoped</code> and <code>@ActivityRetainedScoped</code>?`,
    options: [
      {
        id: 'opt-a',
        text: '@ActivityScoped survives configuration changes (device rotations), while @ActivityRetainedScoped is destroyed on every rotation.'
      },
      {
        id: 'opt-b',
        text: '@ActivityRetainedScoped survives configuration changes (similar to a ViewModel), whereas @ActivityScoped is destroyed and recreated whenever the Activity is recreated.'
      },
      {
        id: 'opt-c',
        text: '@ActivityRetainedScoped lives for the lifetime of the entire Application process.'
      },
      {
        id: 'opt-d',
        text: 'Both scopes are identical; @ActivityRetainedScoped is just an obsolete annotation alias.'
      }
    ],
    correctOptionId: 'opt-b',
    marks: 5,
    explanation: {
      summary: '@ActivityRetainedScoped is bound to ActivityRetainedComponent and survives screen rotations like ViewModel.',
      keyConcept: 'Hilt Component Hierarchy & Lifespans',
      detailed: `Hilt structures dependencies in a hierarchy:
- <code>SingletonComponent</code>: Lives as long as the Application.
- <code>ActivityRetainedComponent</code> (<code>@ActivityRetainedScoped</code>): Lives across Activity configuration changes (screen rotation, theme toggle), mirroring the ViewModel lifecycle.
- <code>ActivityComponent</code> (<code>@ActivityScoped</code>): Tied directly to the Android Activity window instance; destroyed when the Activity is destroyed.
- <code>FragmentComponent</code> / <code>ViewComponent</code>: Tied to individual views.`,
      realWorldPitfall: 'Injecting an `@ActivityScoped` instance into a `ViewModel` causes a compilation error in Hilt because a shorter-lived component cannot be injected into a longer-lived component.',
      correctAnswerBreakdown: 'Option B is the precise architectural distinction.'
    }
  },
  {
    id: 'q-mcq-memory-leak-viewbinding',
    sectionId: 'sec-android-kotlin',
    type: 'mcq',
    title: 'Memory Leaks: Fragment ViewBinding & GC Root Retaining',
    prompt: `In an Android Fragment using Android ViewBinding:
<pre><code>class AccountDetailsFragment : Fragment(R.layout.fragment_account) {
    private var binding: FragmentAccountBinding? = null
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentAccountBinding.bind(view)
    }
}</code></pre>
Why does failing to set <code>binding = null</code> in <code>onDestroyView()</code> produce a critical memory leak detected by LeakCanary?`,
    options: [
      {
        id: 'opt-a',
        text: 'Because Fragments are destroyed before their View hierarchy, causing a native C++ thread hang.'
      },
      {
        id: 'opt-b',
        text: 'Because a Fragment instance often outlives its View hierarchy (e.g. when placed on the FragmentManager backstack); retaining the binding retains the entire View tree and Activity Context.'
      },
      {
        id: 'opt-c',
        text: 'ViewBinding creates an open socket connection to Android Studio Layout Inspector.'
      },
      {
        id: 'opt-d',
        text: 'The Android garbage collector cannot reclaim classes that implement ViewBinding.'
      }
    ],
    correctOptionId: 'opt-b',
    marks: 5,
    explanation: {
      summary: 'Fragment views are destroyed when placed on the backstack, but the Fragment instance remains in memory.',
      keyConcept: 'Fragment Lifecycle vs View Lifecycle disparity',
      detailed: `In Android Fragment navigation:
- When a Fragment is replaced and added to the backstack, its **View hierarchy is completely destroyed** (<code>onDestroyView()</code> is called).
- However, the **Fragment instance itself is NOT destroyed**; it remains cached in the <code>FragmentManager</code> until popped.
- <code>FragmentAccountBinding</code> holds direct strong references to all Views in the layout. Each View holds a reference to its <code>Context</code> (the Activity).
- Retaining <code>binding</code> prevents the garbage collector from reclaiming the old View hierarchy and Activity context, leaking megabytes of bitmap memory!`,
      realWorldPitfall: 'Using `val binding by viewBinding()` without a lifecycle observer or auto-clearing delegate.',
      correctAnswerBreakdown: 'Option B accurately explains the backstack lifecycle divergence.'
    }
  },
  {
    id: 'q-mcq-room-threading',
    sectionId: 'sec-android-kotlin',
    type: 'mcq',
    title: 'Room Persistence: Suspend Functions & Flow Threading Model',
    prompt: `When calling a Room DAO query defined as:
<pre><code>@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions WHERE account_id = :accId")
    suspend fun getTransactions(accId: String): List&lt;TransactionEntity&gt;
}</code></pre>
Which statement regarding thread execution is correct?`,
    options: [
      {
        id: 'opt-a',
        text: 'Calling it from Dispatchers.Main will cause an immediate NetworkOnMainThreadException or IllegalStateException.'
      },
      {
        id: 'opt-b',
        text: 'Room automatically switches the execution off the main thread to its internal query background dispatcher; it is completely main-safe to invoke from Dispatchers.Main.'
      },
      {
        id: 'opt-c',
        text: 'The developer must wrap every Room suspend call with withContext(Dispatchers.IO) or the query will block UI rendering.'
      },
      {
        id: 'opt-d',
        text: 'Room suspend queries always run on the Android Binder IPC thread pool.'
      }
    ],
    correctOptionId: 'opt-b',
    marks: 5,
    explanation: {
      summary: 'Room DAO suspend functions and Flow queries are inherently main-safe.',
      keyConcept: 'Room Architecture & Main-Safety Principle',
      detailed: `Under the hood, the Room annotation processor generates code that delegates suspend functions to Room's own background query dispatcher:
<pre><code>return CoroutinesRoom.execute(__db, true, new Callable&lt;List&lt;TransactionEntity&gt;&gt;() { ... }, continuation);</code></pre>
This guarantees **Main-Safety**: callers in ViewModels or UseCases can safely invoke <code>dao.getTransactions()</code> directly without wrapping it in <code>withContext(Dispatchers.IO)</code>.`,
      realWorldPitfall: 'Writing redundant `withContext(Dispatchers.IO)` around Room calls adds unnecessary coroutine context-switching overhead.',
      correctAnswerBreakdown: 'Option B is correct. Room suspend queries are fully main-safe by design.'
    }
  },
  {
    id: 'q-mcq-workmanager-vs-fgs',
    sectionId: 'sec-android-kotlin',
    type: 'mcq',
    title: 'Modern Background Processing: WorkManager vs Foreground Service',
    prompt: `In an enterprise banking app, you need to sync encrypted offline transaction logs to the server once every 6 hours, even if the app is killed or the phone reboots, only when connected to an unmetered Wi-Fi network.
What is the recommended modern Android architecture component for this task?`,
    options: [
      {
        id: 'opt-a',
        text: 'WorkManager with PeriodicWorkRequestBuilder and NetworkType.UNMETERED constraint.'
      },
      {
        id: 'opt-b',
        text: 'A Foreground Service with a sticky notification running a continuous Thread.sleep() loop.'
      },
      {
        id: 'opt-c',
        text: 'AlarmManager setting an exact repeating RTC_WAKEUP alarm.'
      },
      {
        id: 'opt-d',
        text: 'A long-running Kotlin Coroutine started in GlobalScope.'
      }
    ],
    correctOptionId: 'opt-a',
    marks: 5,
    explanation: {
      summary: 'WorkManager is the standard for deferrable, guaranteed background work with hardware constraints.',
      keyConcept: 'WorkManager vs Services vs AlarmManager',
      detailed: `Google's Android Background Execution Guidelines dictate:
- **WorkManager**: Built for **deferrable, guaranteed work** that must execute even if the app exits or device reboots. Supports battery, charging, and network constraints (<code>NetworkType.UNMETERED</code>).
- **Foreground Service**: Reserved for tasks the user is actively aware of (e.g., active GPS navigation, music playback). Android 14+ severely restricts foreground service types.
- **AlarmManager**: Best for exact-time notifications (e.g. alarm clock, calendar reminder), not batch data sync.
- **GlobalScope Coroutines**: Die when the process terminates; completely unreliable for background sync.`,
      realWorldPitfall: 'Attempting to launch Foreground Services from background on Android 12+ throws `ForegroundServiceStartNotAllowedException`.',
      correctAnswerBreakdown: 'Option A is the official Android Jetpack best practice.'
    }
  },

  // ==========================================
  // SECTION 2: DBMS & ROOM QUERIES (Q9 - Q13)
  // ==========================================
  {
    id: 'q-dbms-second-highest',
    sectionId: 'sec-dbms-room',
    type: 'dbms_query',
    title: 'DBMS Query 1: Find Second Highest Transaction Amount',
    prompt: `Write a standard SQL query to find the <strong>second highest transaction amount</strong> from the <code>transactions</code> table.
<br/><br/>
<strong>Requirements:</strong>
- Return a single column named <code>second_highest_amount</code>.
- If there are duplicate highest values, the query must correctly return the distinct second highest amount.
- Do <strong>not</strong> rely on fragile database-specific syntax.`,
    schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
    expectedColumns: ['second_highest_amount'],
    validationType: 'second_highest',
    expectedOutputPreview: [{ second_highest_amount: 2500.00 }],
    sampleSolution: `SELECT MAX(amount) AS second_highest_amount
FROM transactions
WHERE amount < (SELECT MAX(amount) FROM transactions);`,
    alternativeSolutions: [
      `SELECT DISTINCT amount AS second_highest_amount FROM transactions ORDER BY amount DESC LIMIT 1 OFFSET 1;`,
      `WITH Ranked AS (SELECT amount, DENSE_RANK() OVER (ORDER BY amount DESC) as rnk FROM transactions) SELECT amount AS second_highest_amount FROM Ranked WHERE rnk = 2 LIMIT 1;`
    ],
    marks: 10,
    explanation: {
      summary: 'Can be solved using a subquery with MAX, LIMIT/OFFSET, or DENSE_RANK().',
      keyConcept: 'Subqueries, Window Ranking & Handling Duplicates',
      detailed: `In SQL interviews, finding the Nth highest value tests your understanding of duplicates and subqueries:
1. **Classic Subquery Approach:**
<pre><code>SELECT MAX(amount) AS second_highest_amount
FROM transactions
WHERE amount &lt; (SELECT MAX(amount) FROM transactions);</code></pre>
- The inner query <code>SELECT MAX(amount)</code> finds the absolute highest amount (£5,400.00).
- The outer query filters for all amounts strictly less than that maximum and selects their highest value (£2,500.00).
- Gracefully handles duplicate highest transactions without returning the same value twice.

2. **Modern Window Function (DENSE_RANK):**
<pre><code>SELECT amount AS second_highest_amount
FROM (
    SELECT amount, DENSE_RANK() OVER (ORDER BY amount DESC) as rnk
    FROM transactions
) WHERE rnk = 2 LIMIT 1;</code></pre>`,
      realWorldPitfall: 'Using `LIMIT 1 OFFSET 1` without `DISTINCT`: if the highest transaction appears twice (e.g. two £5,400 transactions), it incorrectly returns £5,400 as the second highest.',
      correctAnswerBreakdown: 'The query returns 2500.00 as the second highest amount (highest is 5400.00).'
    }
  },
  {
    id: 'q-dbms-running-balance',
    sectionId: 'sec-dbms-room',
    type: 'dbms_query',
    title: 'DBMS Query 2: Running Balance / Cumulative Spending per Account',
    prompt: `Write an SQL query using <strong>Window Functions</strong> to calculate the running total of debit spending for each account over time.
<br/><br/>
<strong>Requirements:</strong>
- Select <code>account_id</code>, <code>transaction_id</code>, <code>timestamp</code>, <code>amount</code>, and calculate <code>running_total</code>.
- Only consider transactions where <code>transaction_type = 'DEBIT'</code> and <code>status = 'SUCCESS'</code>.
- The running balance must be partitioned by <code>account_id</code> and ordered chronologically by <code>timestamp</code>.`,
    schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
    expectedColumns: ['account_id', 'transaction_id', 'timestamp', 'amount', 'running_total'],
    validationType: 'running_balance',
    expectedOutputPreview: [
      { account_id: 'ACC-101', transaction_id: 'TXN-901', timestamp: '2024-01-05 10:12:00', amount: 450, running_total: 450 },
      { account_id: 'ACC-101', transaction_id: 'TXN-902', timestamp: '2024-01-12 14:45:00', amount: 1200, running_total: 1650 },
      { account_id: 'ACC-101', transaction_id: 'TXN-903', timestamp: '2024-01-20 18:00:00', amount: 300, running_total: 1950 },
      { account_id: 'ACC-101', transaction_id: 'TXN-904', timestamp: '2024-01-28 08:30:00', amount: 50, running_total: 2000 }
    ],
    sampleSolution: `SELECT 
    account_id,
    transaction_id,
    timestamp,
    amount,
    SUM(amount) OVER (
        PARTITION BY account_id 
        ORDER BY timestamp 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM transactions
WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
ORDER BY account_id, timestamp;`,
    alternativeSolutions: [
      `SELECT account_id, transaction_id, timestamp, amount, SUM(amount) OVER (PARTITION BY account_id ORDER BY timestamp) AS running_total FROM transactions WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS' ORDER BY account_id, timestamp;`
    ],
    marks: 10,
    explanation: {
      summary: 'Calculated using SUM() OVER (PARTITION BY account_id ORDER BY timestamp).',
      keyConcept: 'SQLite Window Functions in Android Room (API 29+)',
      detailed: `SQLite 3.25+ introduced native window functions, fully supported in Android Room:
<pre><code>SUM(amount) OVER (
    PARTITION BY account_id
    ORDER BY timestamp
) AS running_total</code></pre>
- <code>PARTITION BY account_id</code>: Resets the accumulator for each distinct bank account.
- <code>ORDER BY timestamp</code>: Defines the rolling window progression.
- By default with <code>ORDER BY</code>, SQLite defaults to the frame specification: <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>. Specifying <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> is faster and prevents duplicate timestamp conflation.`,
      realWorldPitfall: 'Using self-joins (`JOIN transactions t2 ON t1.timestamp >= t2.timestamp`) which is O(N^2) instead of window functions which execute in O(N log N).',
      correctAnswerBreakdown: 'Accounts ACC-101 and ACC-103 have multiple debits that accumulate sequentially.'
    }
  },
  {
    id: 'q-dbms-high-value-segmentation',
    sectionId: 'sec-dbms-room',
    type: 'dbms_query',
    title: 'DBMS Query 3: High-Value Customer Spending with HAVING Filter',
    prompt: `The fraud and compliance team requires a report of accounts with frequent debit activity.
Write an SQL query to retrieve:
- <code>account_id</code>
- Total debit transactions count as <code>total_count</code>
- Total debit sum as <code>total_spent</code>
<br/>
<strong>Conditions:</strong>
- Only consider transactions where <code>transaction_type = 'DEBIT'</code> and <code>status = 'SUCCESS'</code>.
- Filter for accounts that have made <strong>more than 3 successful debit transactions</strong> AND where <code>total_spent > 1500.00</code>.`,
    schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
    expectedColumns: ['account_id', 'total_count', 'total_spent'],
    validationType: 'having_filter',
    expectedOutputPreview: [
      { account_id: 'ACC-101', total_count: 4, total_spent: 2000.00 },
      { account_id: 'ACC-103', total_count: 4, total_spent: 8570.00 }
    ],
    sampleSolution: `SELECT 
    account_id,
    COUNT(*) AS total_count,
    SUM(amount) AS total_spent
FROM transactions
WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'
GROUP BY account_id
HAVING COUNT(*) > 3 AND SUM(amount) > 1500.00;`,
    alternativeSolutions: [
      `SELECT account_id, COUNT(transaction_id) AS total_count, SUM(amount) AS total_spent FROM transactions WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS' GROUP BY account_id HAVING total_count > 3 AND total_spent > 1500.00;`
    ],
    marks: 10,
    explanation: {
      summary: 'Requires WHERE for pre-aggregation row filtering, GROUP BY, and HAVING for aggregate filtering.',
      keyConcept: 'WHERE vs HAVING Execution Lifecycle',
      detailed: `Understanding the SQL processing order is critical:
1. <code>FROM transactions</code>
2. <code>WHERE transaction_type = 'DEBIT' AND status = 'SUCCESS'</code>: Filters raw individual rows before grouping.
3. <code>GROUP BY account_id</code>: Aggregates rows into buckets per account.
4. <code>HAVING COUNT(*) &gt; 3 AND SUM(amount) &gt; 1500.00</code>: Evaluates conditions on the aggregated groups.
5. <code>SELECT account_id, COUNT(*), SUM(amount)</code>: Projects the final output columns.`,
      realWorldPitfall: 'Placing aggregate conditions like `WHERE SUM(amount) > 1500` inside the WHERE clause, which triggers a syntax error in SQL.',
      correctAnswerBreakdown: 'ACC-101 has 4 successful debits totaling £2,000; ACC-103 has 4 successful debits totaling £8,570.'
    }
  },
  {
    id: 'q-dbms-composite-index',
    sectionId: 'sec-dbms-room',
    type: 'dbms_query',
    title: 'DBMS Query 4: Index Optimization & Room Database DDL',
    prompt: `In the mobile app, users open their transaction ledger which executes:
<pre><code>SELECT * FROM transactions 
WHERE account_id = 'ACC-101' 
ORDER BY timestamp DESC 
LIMIT 20;</code></pre>
Write the SQLite DDL statement to create a <strong>composite index</strong> named <code>idx_transactions_account_timestamp</code> on the <code>transactions</code> table that fully covers this query and eliminates the sorting overhead.`,
    schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status, timestamp, merchant_category)`,
    expectedColumns: ['query_status'],
    validationType: 'index_ddl',
    sampleSolution: `CREATE INDEX idx_transactions_account_timestamp 
ON transactions(account_id, timestamp DESC);`,
    alternativeSolutions: [
      `CREATE INDEX idx_transactions_account_timestamp ON transactions(account_id, timestamp);`
    ],
    marks: 10,
    explanation: {
      summary: 'Composite B-Tree index on (account_id, timestamp DESC) allows an index seek followed by ordered scan.',
      keyConcept: 'Compound Indexing & Leftmost Prefix Rule in SQLite',
      detailed: `To optimize <code>WHERE account_id = ? ORDER BY timestamp DESC</code>:
- A single-column index on <code>account_id</code> allows finding matching rows, but SQLite must still load all matching rows into memory and perform an expensive in-memory sort (<code>B-TREE (TEMPORARY)</code>).
- A **composite index** on <code>(account_id, timestamp DESC)</code> creates an index tree sorted first by <code>account_id</code>, then by <code>timestamp DESC</code>.
- The SQLite query planner performs a direct B-Tree seek to the first entry matching <code>account_id</code>, and immediately traverses the index in order. No temporary sorting table is created!

**Equivalent Room Annotation:**
<pre><code>@Entity(
    tableName = "transactions",
    indices = [
        Index(value = ["account_id", "timestamp"])
    ]
)
data class TransactionEntity(...)</code></pre>`,
      realWorldPitfall: 'Creating the index in reverse order: `(timestamp, account_id)`. The leftmost prefix rule prevents SQLite from using this index efficiently when filtering by `account_id`.',
      correctAnswerBreakdown: '`CREATE INDEX idx_transactions_account_timestamp ON transactions(account_id, timestamp DESC);` is the optimal statement.'
    }
  },
  {
    id: 'q-dbms-unreconciled-orphans',
    sectionId: 'sec-dbms-room',
    type: 'dbms_query',
    title: 'DBMS Query 5: Detect Orphan Transactions via Anti-Join',
    prompt: `During an audit between local device cache and the bank core server, some transactions do not correspond to any registered account in the <code>accounts</code> table.
Write an SQL query using a <strong>LEFT JOIN</strong> (Anti-Join) to find all transactions whose <code>account_id</code> does not exist in <code>accounts</code>.
<br/><br/>
<strong>Return:</strong>
- <code>t.transaction_id</code>
- <code>t.account_id</code>
- <code>t.amount</code>
- <code>t.status</code>`,
    schemaContext: `Tables: accounts (account_id, customer_name, branch, balance), transactions (transaction_id, account_id, amount, status)`,
    expectedColumns: ['transaction_id', 'account_id', 'amount', 'status'],
    validationType: 'orphan_antijoin',
    expectedOutputPreview: [
      { transaction_id: 'TXN-911', account_id: 'ACC-999', amount: 150.00, status: 'PENDING' }
    ],
    sampleSolution: `SELECT 
    t.transaction_id,
    t.account_id,
    t.amount,
    t.status
FROM transactions t
LEFT JOIN accounts a ON t.account_id = a.account_id
WHERE a.account_id IS NULL;`,
    alternativeSolutions: [
      `SELECT t.transaction_id, t.account_id, t.amount, t.status FROM transactions t WHERE NOT EXISTS (SELECT 1 FROM accounts a WHERE a.account_id = t.account_id);`
    ],
    marks: 10,
    explanation: {
      summary: 'LEFT JOIN with WHERE right_table.key IS NULL finds records with no matching parent.',
      keyConcept: 'SQL Anti-Join Patterns & Foreign Key Integrity',
      detailed: `An Anti-Join returns rows from the left table where NO matching row exists in the right table:
1. <code>FROM transactions t LEFT JOIN accounts a ON t.account_id = a.account_id</code> preserves all transaction rows. When no account exists, the joined columns from <code>accounts</code> are populated with <code>NULL</code>.
2. <code>WHERE a.account_id IS NULL</code> filters out all valid accounts, leaving strictly the orphan transactions.

**Room Relation Defense:**
In Room, you can enforce SQLite Foreign Keys to prevent this at the database engine level:
<pre><code>@Entity(
    foreignKeys = [
        ForeignKey(
            entity = AccountEntity::class,
            parentColumns = ["account_id"],
            childColumns = ["account_id"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)</code></pre>`,
      realWorldPitfall: 'Using `NOT IN (SELECT account_id FROM accounts)`: if any `account_id` in `accounts` is `NULL`, standard SQL `NOT IN` returns zero rows due to three-valued logic (`NULL` comparison). `LEFT JOIN ... WHERE ... IS NULL` or `NOT EXISTS` is safe.',
      correctAnswerBreakdown: 'Transaction TXN-911 has account_id ACC-999, which has no row in the accounts table.'
    }
  },

  // ==========================================
  // SECTION 3: DSA CODING PROBLEM (Q14)
  // ==========================================
  {
    id: 'q-dsa-fraud-sliding-window',
    sectionId: 'sec-dsa-coding',
    type: 'dsa_problem',
    title: 'DSA Problem: High-Frequency Transaction Fraud Alert (Sliding Window Maximum)',
    prompt: `<strong>Problem Statement:</strong>
In Tesco Bank / Barclays core mobile ledger, a high-frequency fraud detection engine monitors incoming customer transactions.
Given an array of integer transaction amounts <code>nums</code> and a sliding window size <code>k</code>, you are sliding a window of size <code>k</code> from the very left of the array to the very right.
You can only see the <code>k</code> transactions in the window. Each time the sliding window moves right by one position, determine the <strong>maximum transaction amount</strong> in the window.
<br/><br/>
Return an array of the maximum amounts for each window from left to right.
<br/><br/>
<strong>HackerEarth Stdin / Stdout Format:</strong>
<ul>
  <li>First line: integer <code>N</code> (number of transactions) and integer <code>k</code> (window size).</li>
  <li>Second line: <code>N</code> space-separated integers representing transaction amounts.</li>
  <li>Output: Space-separated integers representing the maximum in each sliding window.</li>
</ul>
<strong>Constraints:</strong>
<ul>
  <li><code>1 &lt;= k &lt;= nums.size &lt;= 10^5</code></li>
  <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
  <li><strong>Time Complexity Required:</strong> <code>O(N)</code> (An O(N * k) solution will trigger Time Limit Exceeded).</li>
  <li><strong>Auxiliary Space:</strong> <code>O(k)</code></li>
</ul>`,
    starterCode: `import java.util.ArrayDeque
import java.util.Scanner

// Function-based interface
fun maxSlidingWindow(nums: IntArray, k: Int): IntArray {
    if (nums.isEmpty() || k <= 0) return IntArray(0)
    val n = nums.size
    val result = IntArray(n - k + 1)
    var resultIndex = 0

    // TODO: Implement O(N) Monotonic Queue / ArrayDeque
    // Store indices in the deque in decreasing order of value

    return result
}

// HackerEarth CLI Runner Entrypoint
fun main() {
    val sampleInput = intArrayOf(100, 300, -100, -300, 500, 300, 600, 700)
    val k = 3
    val result = maxSlidingWindow(sampleInput, k)
    println("Window Maxima: " + result.joinToString(" "))
}`,
    solutionCode: `import java.util.ArrayDeque

fun maxSlidingWindow(nums: IntArray, k: Int): IntArray {
    if (nums.isEmpty() || k <= 0) return IntArray(0)
    val n = nums.size
    val result = IntArray(n - k + 1)
    var resultIndex = 0
    
    // Monotonic Deque storing indices.
    // Elements at indices in the deque are maintained in strictly decreasing order.
    val deque = ArrayDeque<Int>()

    for (i in 0 until n) {
        // 1. Remove indices that are out of the current sliding window boundary [i - k + 1, i]
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst()
        }

        // 2. Remove indices whose corresponding values are smaller than or equal to current nums[i]
        // because they can never be the maximum again in this or any future window!
        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
            deque.pollLast()
        }

        // 3. Add current index to back of deque
        deque.offerLast(i)

        // 4. Record maximum (always at front of deque) once window has reached size k
        if (i >= k - 1) {
            result[resultIndex++] = nums[deque.peekFirst()]
        }
    }

    return result
}

fun main() {
    val nums = intArrayOf(100, 300, -100, -300, 500, 300, 600, 700)
    val k = 3
    val res = maxSlidingWindow(nums, k)
    println(res.joinToString(" "))
}`,
    testCases: [
      {
        id: 'tc-1',
        name: 'Sample Case 1: Standard Banking Ledger',
        input: 'nums = [100, 300, -100, -300, 500, 300, 600, 700], k = 3',
        expected: '300 300 500 500 600 700',
        isHidden: false
      },
      {
        id: 'tc-2',
        name: 'Sample Case 2: Window size = 1',
        input: 'nums = [1, -1], k = 1',
        expected: '1 -1',
        isHidden: false
      },
      {
        id: 'tc-3',
        name: 'Hidden Case 1: Strictly Decreasing Sequence',
        input: 'nums = [9, 8, 7, 6, 5, 4, 3], k = 3',
        expected: '9 8 7 6 5',
        isHidden: true
      },
      {
        id: 'tc-4',
        name: 'Hidden Case 2: Window equals Array Size (k = N)',
        input: 'nums = [4, 2, 12, 3], k = 4',
        expected: '12',
        isHidden: true
      }
    ],
    marks: 30,
    explanation: {
      summary: 'Optimal O(N) time complexity achieved using a Monotonic Decreasing Deque storing array indices.',
      keyConcept: 'Monotonic Queue & Amortized O(1) Sliding Window',
      detailed: `### 1. Why Brute Force Fails (O(N * k))
Iterating through all $N - k + 1$ windows and computing $\\max$ takes $O(k)$ per step, leading to $O(N \\times k)$ total time. For $N = 10^5, k = 10^4$, this requires $10^9$ operations, exceeding the 2-second JVM timeout on HackerEarth.

### 2. The Monotonic Deque Pattern (O(N))
We maintain a double-ended queue (<code>ArrayDeque&lt;Int&gt;</code>) storing **indices**:
1. **Eviction of Out-of-Bounds**: At index $i$, any index $&lt; i - k + 1$ has fallen out of the left edge and is popped from the front (<code>pollFirst()</code>).
2. **Monotonic Invariant**: Before inserting index $i$, we pop all indices from the back whose values $\\le nums[i]$. Why? Because $nums[i]$ is newer and greater; smaller preceding elements can **never** be the maximum in any present or future window!
3. **Instant Query**: The index with the maximum value is always at <code>deque.peekFirst()</code>.
4. **Complexity**: Each index is pushed once and popped at most once. Hence, amortized operations = $2N \\implies O(N)$ time. Space is $O(k)$ for the deque.`,
      realWorldPitfall: 'Storing values instead of indices in the Deque: storing values prevents you from determining whether an element has expired out of the left boundary when duplicate values occur.',
      correctAnswerBreakdown: 'The optimal Kotlin solution processes all windows in a single pass of 8 iterations with zero heap allocations inside the loop.'
    }
  },

  // ==========================================
  // SECTION 4: COMPLETE ANDROID APP DEV (Q15)
  // ==========================================
  {
    id: 'q-android-arch-machine-coding',
    sectionId: 'sec-android-app-dev',
    type: 'android_architecture',
    title: 'Complete Android App Machine Coding: Offline-First Transaction Feed',
    prompt: `<strong>Senior Android Machine Coding Challenge:</strong>
Design and implement a production-ready, <strong>Offline-First Banking Transaction Feed App</strong> according to modern Android Clean Architecture guidelines (MVI/MVVM + Jetpack Compose + Room + Kotlin Flow).
<br/><br/>
<strong>Architecture Requirements:</strong>
<ol>
  <li><strong>Data Layer (Room + Single Source of Truth):</strong>
    Define <code>TransactionEntity</code>, DAO with reactive <code>Flow&lt;List&lt;TransactionEntity&gt;&gt;</code>, and a Repository implementing offline-first syncing (emit local cache immediately, fetch remote API, save to Room, emit updates).
  </li>
  <li><strong>Domain Layer:</strong>
    Provide a clean UseCase or Result wrapper encapsulating error handling and business validation.
  </li>
  <li><strong>Presentation Layer (ViewModel):</strong>
    Expose an immutable <code>StateFlow&lt;TransactionUiState&gt;</code> with explicit states: <code>Loading</code>, <code>Success(items, isRefreshing)</code>, and <code>Error(message)</code>. Handle coroutine exception handling cleanly.
  </li>
  <li><strong>UI Layer (Jetpack Compose):</strong>
    Compose UI screen with pull-to-refresh, smooth empty states, format currency, and skippable row composables.
  </li>
  <li><strong>Unit Testing (MockK + Turbine):</strong>
    Provide unit tests asserting that the ViewModel emits <code>Loading -&gt; Success</code> when refreshing.
  </li>
</ol>`,
    starterCode: `// =========================================================================
// Architecture Machine Coding Workspace
// Fill in the missing components below or explore the tabs
// =========================================================================

// 1. DATA LAYER (Room Entity & DAO)
// @Entity(tableName = "transactions")
// data class TransactionEntity(...)

// 2. REPOSITORY (Offline-First Single Source of Truth)
// class TransactionRepositoryImpl(...) : TransactionRepository

// 3. VIEWMODEL (StateFlow & MVI / MVVM)
// class TransactionFeedViewModel(...) : ViewModel()

// 4. JETPACK COMPOSE UI
// @Composable fun TransactionFeedScreen(...)`,
    fullArchitectureCode: `package com.bank.mastery.transactions

import androidx.room.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

// =========================================================================
// 1. DATA LAYER: Room Entity, DAO, and Network Models
// =========================================================================

@Entity(
    tableName = "transactions",
    indices = [Index(value = ["account_id", "timestamp"])]
)
data class TransactionEntity(
    @PrimaryKey val transactionId: String,
    @ColumnInfo(name = "account_id") val accountId: String,
    val amount: Double,
    val type: String, // 'DEBIT' or 'CREDIT'
    val status: String,
    val timestamp: Long,
    val merchant: String
)

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions WHERE account_id = :accId ORDER BY timestamp DESC")
    fun observeTransactions(accId: String): Flow<List<TransactionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(transactions: List<TransactionEntity>)

    @Query("DELETE FROM transactions WHERE account_id = :accId")
    suspend fun clearAccount(accId: String)
}

interface TransactionApiService {
    suspend fun fetchTransactions(accountId: String): List<TransactionDto>
}

data class TransactionDto(
    val id: String,
    val accountId: String,
    val amount: Double,
    val type: String,
    val status: String,
    val timestamp: Long,
    val merchant: String
)

// =========================================================================
// 2. REPOSITORY LAYER: Offline-First Single Source of Truth (SSOT)
// =========================================================================

interface TransactionRepository {
    fun getTransactionsStream(accountId: String): Flow<List<TransactionEntity>>
    suspend fun refreshTransactions(accountId: String): Result<Unit>
}

class TransactionRepositoryImpl(
    private val dao: TransactionDao,
    private val api: TransactionApiService,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : TransactionRepository {

    // Emits cached data from Room immediately and updates whenever SQLite table changes
    override fun getTransactionsStream(accountId: String): Flow<List<TransactionEntity>> =
        dao.observeTransactions(accountId).flowOn(dispatcher)

    // Fetches from remote network API, parses, and writes to Room database
    override suspend fun refreshTransactions(accountId: String): Result<Unit> = withContext(dispatcher) {
        try {
            val remoteDtos = api.fetchTransactions(accountId)
            val entities = remoteDtos.map { dto ->
                TransactionEntity(
                    transactionId = dto.id,
                    accountId = dto.accountId,
                    amount = dto.amount,
                    type = dto.type,
                    status = dto.status,
                    timestamp = dto.timestamp,
                    merchant = dto.merchant
                )
            }
            dao.upsertAll(entities)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

// =========================================================================
// 3. PRESENTATION LAYER: MVI / MVVM ViewModel with StateFlow
// =========================================================================

sealed interface TransactionUiState {
    object Loading : TransactionUiState
    data class Success(
        val transactions: List<TransactionEntity>,
        val isRefreshing: Boolean = false
    ) : TransactionUiState
    data class Error(val message: String) : TransactionUiState
}

class TransactionFeedViewModel(
    private val repository: TransactionRepository,
    private val accountId: String = "ACC-101"
) : ViewModel() {

    private val _isRefreshing = MutableStateFlow(false)
    private val _errorMessage = MutableStateFlow<String?>(null)

    // Combine Room continuous Flow with transient UI state
    val uiState: StateFlow<TransactionUiState> = combine(
        repository.getTransactionsStream(accountId),
        _isRefreshing,
        _errorMessage
    ) { items, refreshing, errorMsg ->
        when {
            errorMsg != null && items.isEmpty() -> TransactionUiState.Error(errorMsg)
            items.isEmpty() && refreshing -> TransactionUiState.Loading
            else -> TransactionUiState.Success(
                transactions = items,
                isRefreshing = refreshing
            )
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = TransactionUiState.Loading
    )

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _isRefreshing.value = true
            _errorMessage.value = null
            repository.refreshTransactions(accountId)
                .onFailure { err ->
                    _errorMessage.value = err.localizedMessage ?: "Network sync failed."
                }
            _isRefreshing.value = false
        }
    }
}

// =========================================================================
// 4. UI LAYER: Jetpack Compose Feed Screen
// =========================================================================

@Composable
fun TransactionFeedScreen(
    viewModel: TransactionFeedViewModel,
    modifier: Modifier = Modifier
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = { TopAppBar(title = { Text("Account Transactions") }) }
    ) { padding ->
        Box(modifier = modifier.fillMaxSize().padding(padding)) {
            when (val current = state) {
                is TransactionUiState.Loading -> {
                    CircularProgressIndicator(modifier = Modifier.align(androidx.compose.ui.Alignment.Center))
                }
                is TransactionUiState.Error -> {
                    Column(
                        modifier = Modifier.align(androidx.compose.ui.Alignment.Center),
                        horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                    ) {
                        Text(text = current.message, color = MaterialTheme.colorScheme.error)
                        Button(onClick = { viewModel.refresh() }) {
                            Text("Retry")
                        }
                    }
                }
                is TransactionUiState.Success -> {
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        items(
                            items = current.transactions,
                            key = { it.transactionId }
                        ) { txn ->
                            TransactionRowItem(txn)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TransactionRowItem(txn: TransactionEntity) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 6.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(text = txn.merchant, style = MaterialTheme.typography.titleMedium)
                Text(text = txn.type, style = MaterialTheme.typography.bodySmall)
            }
            Text(
                text = "£" + String.format("%.2f", txn.amount),
                style = MaterialTheme.typography.titleMedium
            )
        }
    }
}`,
    marks: 40,
    explanation: {
      summary: 'Production Android Clean Architecture with Offline-First Single Source of Truth (SSOT), MVI StateFlow, and Compose.',
      keyConcept: 'Offline-First Single Source of Truth & Unidirectional Data Flow',
      detailed: `### 1. Offline-First Single Source of Truth (SSOT)
In top-tier mobile banking apps (Tesco Bank, Barclays, Revolut), UI screens never wait for the network to render:
- The Room database is the **Single Source of Truth**.
- The Repository exposes <code>Flow&lt;List&lt;TransactionEntity&gt;&gt;</code> directly from Room DAO.
- When the screen opens, cached data is emitted in under 10ms.
- A background network request fetches fresh items and writes directly into Room (<code>upsertAll</code>).
- Room automatically detects table mutations and emits the fresh list downstream to the UI!

### 2. ViewModel State Modeling with StateFlow
- We use a sealed interface <code>TransactionUiState</code> with <code>Loading</code>, <code>Success</code>, and <code>Error</code>.
- <code>SharingStarted.WhileSubscribed(5000)</code>: Keeps the upstream coroutine active for 5 seconds after the last UI collector detaches (handles screen rotation without cancelling the network request).

### 3. Jetpack Compose Best Practices
- <code>items(items = ..., key = { it.transactionId })</code>: Supplying stable keys allows Compose to reorder and animate items without re-instantiating the entire list.`,
      realWorldPitfall: 'Returning network data directly to the ViewModel and manually updating in-memory lists: this violates SSOT and results in cache desynchronization across app tabs.',
      correctAnswerBreakdown: 'The solution demonstrates all 5 tiers: Room Entity/DAO, Offline-First Repository, ViewModel StateFlow with WhileSubscribed, and declarative Compose UI.'
    }
  }
];
