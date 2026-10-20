/* ==========================================================================
   Assessment Set 4: Offline-First, Room Migrations & Interval Merging
   Focus: Room Manual vs AutoMigration, Foreign Key cascades,
          Merge Intervals (Greedy/Sorting), and Encrypted Room SQLite.
   ========================================================================== */

export const ASSESSMENT_SET_4 = {
  id: 'set-4',
  number: 4,
  title: 'Set 4: Offline-First, Room Migrations & Two Pointers',
  shortTitle: 'Set 4: Room Migrations & Intervals',
  focusArea: 'Room Migrations, Foreign Keys ON DELETE CASCADE, Merge Intervals & Encrypted SQLite',
  hackerEarthTrack: 'Algorithms > Sorting & Interval Scheduling',
  hackerEarthChallenge: 'Code Monk: Sorting, Comparators & Interval Merging',
  hackerEarthConcepts: ['Interval Scheduling', 'Custom Comparators', 'Greedy Merging', 'Room Migrations', 'Foreign Keys'],
  difficulty: 'Senior Mobile Engineer',
  durationMinutes: 60,
  badge: 'Offline-First & Persistence',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'Room manual migrations, foreign keys, @Relation, MVI Channels, and StrictMode.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'Atomic balance updates, fraud deduplication within 60s, ON DELETE CASCADE, and EXPLAIN QUERY PLAN.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Merge Overlapping Transaction Intervals (Greedy Sorting Algorithm).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Room Database Migration (v1 to v2) with Encrypted SQLite.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's4-q1-room-migration-crash',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Room Persistence: Database Version Upgrades & IllegalStateException',
      prompt: `A developer adds a new column <code>val fee: Double</code> to an existing <code>@Entity</code> and increments the Room database version from <code>1</code> to <code>2</code>. They release the update without providing a <code>Migration</code> object.
What happens when existing users update and launch the app?`,
      options: [
        { id: 'opt-a', text: 'SQLite automatically infers the column and populates it with nulls.' },
        { id: 'opt-b', text: 'The app crashes immediately on launch with: IllegalStateException: A migration from 1 to 2 was required but not found.' },
        { id: 'opt-c', text: 'Room wipes the user data automatically without throwing an error.' },
        { id: 'opt-d', text: 'The app launches in read-only mode.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Room throws an IllegalStateException when database version is incremented without a matching Migration or fallbackToDestructiveMigration().',
        keyConcept: 'Room Database Migration Lifecycle',
        detailed: `Room validates the database schema hash stored in <code>room_master_table</code> against the compiled schema. If the version numbers mismatch and no matching <code>Migration(1, 2)</code> or <code>@AutoMigration</code> is registered, Room throws a fatal <code>IllegalStateException</code> to prevent silent data corruption.`,
        realWorldPitfall: 'Using `fallbackToDestructiveMigration()` in production banking apps: it wipes user offline transaction records!',
        correctAnswerBreakdown: 'Option B accurately identifies the migration crash.'
      }
    },
    {
      id: 's4-q2-room-embedded-relation',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Room Persistence: @Relation vs Writing Manual SQL Joins',
      prompt: `To fetch an Account with all its associated Transactions:
<pre><code>data class AccountWithTransactions(
    @Embedded val account: AccountEntity,
    @Relation(
        parentColumn = "account_id",
        entityColumn = "account_id"
    )
    val transactions: List&lt;TransactionEntity&gt;
)</code></pre>
How does Room execute queries returning <code>AccountWithTransactions</code> under the hood?`,
      options: [
        { id: 'opt-a', text: 'It executes a single giant SQL CROSS JOIN that duplicates parent columns in memory.' },
        { id: 'opt-b', text: 'Room executes two distinct queries: first it fetches the accounts, extracts their IDs, and runs a second query with WHERE account_id IN (...) before assembling the POJO in memory.' },
        { id: 'opt-c', text: 'It uses SQLite JSON serialization.' },
        { id: 'opt-d', text: 'It requires raw cursor manipulation by the developer.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Room @Relation executes two separate queries and avoids duplicate parent column overhead.',
        keyConcept: 'Room Relational Entity Assembly',
        detailed: `Unlike traditional SQL joins which repeat all parent columns for every child row (consuming excess memory), Room executes two targeted queries and joins them in Kotlin memory. For this reason, methods returning <code>@Relation</code> classes must be marked with <code>@Transaction</code> to guarantee read atomicity.`,
        realWorldPitfall: 'Forgetting `@Transaction` on DAO methods returning `@Relation` types can result in inconsistent data if transactions are written between the two queries.',
        correctAnswerBreakdown: 'Option B describes Room internal 2-query resolution.'
      }
    },
    {
      id: 's4-q3-coroutine-cancellation-exception',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Coroutines: Catching Exception vs CancellationException',
      prompt: `Why is writing <code>catch (e: Exception)</code> around suspending coroutine code considered an anti-pattern unless <code>e</code> is checked for <code>CancellationException</code>?`,
      options: [
        { id: 'opt-a', text: 'CancellationException is an Error and cannot be caught by Exception.' },
        { id: 'opt-b', text: 'CancellationException inherits from IllegalStateException, which crashes the JVM.' },
        { id: 'opt-c', text: 'Coroutine cancellation relies on CancellationException. Catching it without re-throwing swallows the cancellation signal, breaking structured concurrency and keeping zombie coroutines running.' },
        { id: 'opt-d', text: 'The compiler will fail with a syntax error.' }
      ],
      correctOptionId: 'opt-c',
      marks: 5,
      explanation: {
        summary: 'Catching Exception without re-throwing CancellationException breaks coroutine cancellation.',
        keyConcept: 'Coroutine Cancellation & Exception Hierarchy',
        detailed: `In Kotlin Coroutines, when a scope is cancelled, suspending points throw <code>CancellationException</code>. If you write:
<pre><code>try { ... } catch (e: Exception) { log(e) }</code></pre>
you inadvertently catch and swallow <code>CancellationException</code>! The coroutine continues running, leaking memory and network bandwidth. Always re-throw: <code>if (e is CancellationException) throw e</code>.`,
        realWorldPitfall: 'Swallowing cancellation in background sync loops causes coroutines to run forever after user logs out.',
        correctAnswerBreakdown: 'Option C is the core principle of Kotlin structured concurrency.'
      }
    },
    {
      id: 's4-q4-strictmode-violations',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android Diagnostics: StrictMode ThreadPolicy Violations',
      prompt: `In an Android banking app debug build, <code>StrictMode.setThreadPolicy(...)</code> is configured with <code>detectDiskReads()</code> and <code>penaltyDeath()</code>.
Which action on the Main Thread will trigger an immediate crash?`,
      options: [
        { id: 'opt-a', text: 'Allocating an empty ArrayList.' },
        { id: 'opt-b', text: 'Calling SharedPreferences.getString() or File.exists() on Dispatchers.Main.' },
        { id: 'opt-c', text: 'Calling Log.d() with a debug message.' },
        { id: 'opt-d', text: 'Rendering a Compose Text element.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'SharedPreferences.getString() performs flash disk I/O, violating StrictMode on the Main thread.',
        keyConcept: 'StrictMode & Eliminating Main-Thread I/O Jitter',
        detailed: `<code>SharedPreferences</code> and File operations hit the flash NAND file system. If flash storage is busy, disk reads can block the main thread for 50-200ms, causing dropped frames (jank) or ANRs (Application Not Responding). StrictMode flags these violations instantly.`,
        realWorldPitfall: 'Reading SharedPreferences in Activity.onCreate() instead of using Jetpack DataStore asynchronously.',
        correctAnswerBreakdown: 'Option B accurately identifies disk reads on the main thread.'
      }
    },
    {
      id: 's4-q5-encrypted-sharedpreferences',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android Security: EncryptedSharedPreferences vs SharedPreferences',
      prompt: `How does <code>EncryptedSharedPreferences</code> (AndroidX Security) protect auth tokens stored on a rooted device?`,
      options: [
        { id: 'opt-a', text: 'It stores the tokens in the SIM card memory.' },
        { id: 'opt-b', text: 'It uses a two-tier key scheme: keys are encrypted with AES-256-SIV and values are encrypted with AES-256-GCM using a Master Key stored in the hardware-backed Android Keystore.' },
        { id: 'opt-c', text: 'It converts strings into Base64.' },
        { id: 'opt-d', text: 'It uploads the tokens to Google Drive.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'EncryptedSharedPreferences encrypts keys (AES-SIV) and values (AES-GCM) with a hardware Keystore master key.',
        keyConcept: 'Jetpack Security & Two-Tier Cryptography',
        detailed: `Standard <code>SharedPreferences</code> stores keys and values in plain text XML in <code>/data/data/&lt;package&gt;/shared_prefs/</code>. On a rooted phone, anyone can read it. <code>EncryptedSharedPreferences</code> guarantees confidentiality: even if an attacker reads the XML file, keys and values appear as cipher noise.`,
        realWorldPitfall: 'Using plain Base64 encoding and believing it is encryption.',
        correctAnswerBreakdown: 'Option B describes the official Tink cryptographic scheme.'
      }
    },
    {
      id: 's4-q6-modifier-chaining-order',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: Modifier Chaining Execution Order',
      prompt: `Consider this Compose snippet:
<pre><code>Box(
    modifier = Modifier
        .background(Color.Blue)
        .padding(16.dp)
        .background(Color.Yellow)
        .size(100.dp)
)</code></pre>
What is the visual appearance of this Box?`,
      options: [
        { id: 'opt-a', text: 'A solid blue 100dp box with no yellow visible.' },
        { id: 'opt-b', text: 'A solid yellow 100dp box.' },
        { id: 'opt-c', text: 'A yellow inner area surrounded by a 16dp blue outer padding border.' },
        { id: 'opt-d', text: 'The Compose runtime throws an IllegalArgumentException.' }
      ],
      correctOptionId: 'opt-c',
      marks: 5,
      explanation: {
        summary: 'In Compose, modifiers are applied sequentially from top to bottom (outer to inner).',
        keyConcept: 'Compose Modifier Chaining Order',
        detailed: `In Jetpack Compose, order matters:
1. <code>background(Color.Blue)</code> draws the outer blue layer.
2. <code>padding(16.dp)</code> insets the remaining content boundary by 16dp.
3. <code>background(Color.Yellow)</code> fills the inset inner area with yellow.
Thus, you get a yellow inner rectangle framed by 16dp of blue!`,
        realWorldPitfall: 'Placing `clickable` before vs after `padding`: putting clickable after padding makes the padded border non-clickable.',
        correctAnswerBreakdown: 'Option C is correct.'
      }
    },
    {
      id: 's4-q7-dbms-normalization-1nf-2nf-3nf',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'DBMS Architecture: Database Normalization (1NF, 2NF, and 3NF)',
      prompt: `A banking ledger table stores:
<code>Transactions(transaction_id, account_id, customer_name, customer_city, amount, timestamp)</code>
where <code>transaction_id</code> is the primary key and <code>account_id -&gt; (customer_name, customer_city)</code>.
Why does this table violate <strong>Third Normal Form (3NF)</strong>, and what is the exact requirement to satisfy 3NF?`,
      options: [
        { id: 'opt-a', text: 'It violates 3NF because values are not atomic (violating 1NF).' },
        { id: 'opt-b', text: 'It violates 3NF because there is a transitive functional dependency: non-key attributes (customer_name, customer_city) depend on account_id, which in turn depends on the primary key transaction_id. 3NF requires no transitive dependencies on candidate keys.' },
        { id: 'opt-c', text: 'It violates 3NF because the table has more than 5 columns.' },
        { id: 'opt-d', text: 'It does not violate 3NF; it only violates BCNF.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '3NF requires that the table is in 2NF and has NO transitive functional dependencies (every non-prime attribute is non-transitively dependent on every candidate key).',
        keyConcept: 'Database Normalization Hierarchy: 1NF -> 2NF -> 3NF',
        detailed: `1. <strong>1NF (First Normal Form):</strong> Each column contains atomic (indivisible) values; no repeating groups or arrays.
2. <strong>2NF (Second Normal Form):</strong> Must be in 1NF AND have no partial dependencies (no non-prime attribute depends on a proper subset of a composite primary key).
3. <strong>3NF (Third Normal Form):</strong> Must be in 2NF AND have no transitive dependencies ($X \\to Y \\to Z$). Here, <code>transaction_id -&gt; account_id</code> and <code>account_id -&gt; customer_city</code>, creating update, insert, and deletion anomalies. Splitting into <code>Accounts</code> and <code>Transactions</code> achieves 3NF.`,
        realWorldPitfall: 'Denormalizing without reason causes update anomalies: updating a customer address requires updating 10,000 historical transaction rows.',
        correctAnswerBreakdown: 'Option B accurately identifies the transitive dependency rule of 3NF.'
      }
    },
    {
      id: 's4-q8-kotlin-val-vs-var',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Kotlin Core: val vs var (Immutability, Backing Fields & Thread Safety)',
      prompt: `Which of the following statements regarding Kotlin's <code>val</code> vs <code>var</code> is strictly accurate?`,
      options: [
        { id: 'opt-a', text: 'val creates a deeply immutable data structure: modifying elements inside a val list (e.g. val list = ArrayList<String>()) is prohibited at compile time.' },
        { id: 'opt-b', text: 'val declares a read-only reference (cannot be reassigned after initialization and compiles to a Java final field when backed by storage), but the object it references can still be internally mutable.' },
        { id: 'opt-c', text: 'var cannot be used inside coroutines or multithreaded code.' },
        { id: 'opt-d', text: 'val and var generate identical JVM bytecode with identical getters and setters.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'val means read-only reference (non-reassignable), not deep immutability; internal object state can still mutate.',
        keyConcept: 'val (Read-only Reference) vs var (Mutable Variable)',
        detailed: `In Kotlin:
- <code>val</code> creates a read-only variable reference: once assigned, the reference cannot point to a new object (translates to <code>final</code> in Java bytecode). However, if the underlying object is mutable (e.g., <code>val list = mutableListOf(1, 2)</code>), you can still execute <code>list.add(3)</code>!
- <code>var</code> allows reassigning the variable reference anytime and generates both a getter and a setter (unless private).
- For true immutability, pair <code>val</code> with immutable types (e.g., <code>kotlinx.collections.immutable</code> or <code>List&lt;T&gt;</code> without casting).`,
        realWorldPitfall: 'Assuming `val list = mutableListOf(...)` is thread-safe: concurrent writes to the list from background threads still throw ConcurrentModificationException.',
        correctAnswerBreakdown: 'Option B is the precise technical distinction between reference immutability and object immutability.'
      }
    },

    // DBMS Section
    {
      id: 's4-q9-duplicate-transaction-dedup',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Detect Duplicate Transactions Submitted within 60 Seconds',
      prompt: `Write an SQL query using self-joins or window functions to detect potential duplicate transactions from the same account with the identical <code>amount</code> submitted within 1 hour (3600 seconds) of each other.
<br/><br/>
<strong>Return:</strong>
- <code>t1.transaction_id AS original_txn</code>, <code>t2.transaction_id AS duplicate_txn</code>, <code>t1.account_id</code>, <code>t1.amount</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['original_txn', 'duplicate_txn', 'account_id', 'amount'],
      validationType: 'fraud_dedup',
      sampleSolution: `SELECT 
    t1.transaction_id AS original_txn,
    t2.transaction_id AS duplicate_txn,
    t1.account_id,
    t1.amount
FROM transactions t1
JOIN transactions t2 ON t1.account_id = t2.account_id 
    AND t1.amount = t2.amount 
    AND t1.transaction_id < t2.transaction_id
    AND ABS(strftime('%s', t2.timestamp) - strftime('%s', t1.timestamp)) <= 3600;`,
      marks: 10,
      explanation: {
        summary: 'Self-join on account_id, identical amount, and timestamp proximity detects duplicates.',
        keyConcept: 'Fraud Deduplication in SQLite',
        detailed: `Using <code>strftime('%s', timestamp)</code> converts ISO-8601 timestamps into epoch seconds. The join condition <code>t1.transaction_id &lt; t2.transaction_id</code> avoids duplicate mirrored pairs (A-B and B-A).`,
        realWorldPitfall: 'Using `t1.transaction_id != t2.transaction_id` returns each pair twice.',
        correctAnswerBreakdown: 'Accurately isolates identical amount transactions submitted in quick succession.'
      }
    },
    {
      id: 's4-q10-on-delete-cascade',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Foreign Key Constraint with ON DELETE CASCADE DDL',
      prompt: `Write SQLite DDL to create a <code>card_tokens</code> table with columns:
- <code>token_id TEXT PRIMARY KEY</code>
- <code>account_id TEXT</code>
- Foreign key referencing <code>accounts(account_id)</code> with <code>ON DELETE CASCADE</code>.`,
      schemaContext: `Table: accounts (account_id, customer_name, branch, balance)`,
      expectedColumns: ['query_status'],
      validationType: 'fk_cascade_ddl',
      sampleSolution: `CREATE TABLE card_tokens (
    token_id TEXT PRIMARY KEY,
    account_id TEXT,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);`,
      marks: 10,
      explanation: {
        summary: 'ON DELETE CASCADE automatically deletes associated child tokens when the parent account is deleted.',
        keyConcept: 'Referential Integrity & Cascading Deletions',
        detailed: `In banking apps, deleting a customer account should automatically delete their sensitive biometric and card tokens to comply with GDPR/data privacy laws. <code>ON DELETE CASCADE</code> instructs SQLite to clean up child rows automatically.`,
        realWorldPitfall: 'SQLite disables foreign keys by default. You must execute `PRAGMA foreign_keys = ON;` in Room OpenHelper.',
        correctAnswerBreakdown: 'CREATE TABLE with FOREIGN KEY ... REFERENCES accounts(account_id) ON DELETE CASCADE.'
      }
    },
    {
      id: 's4-q11-explain-query-plan',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Inspect SQLite EXPLAIN QUERY PLAN',
      prompt: `Write the SQLite command to inspect the query execution plan for:
<pre><code>SELECT * FROM transactions WHERE account_id = 'ACC-101';</code></pre>`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount)`,
      expectedColumns: ['id', 'parent', 'notused', 'detail'],
      validationType: 'explain_query_plan',
      sampleSolution: `EXPLAIN QUERY PLAN 
SELECT * FROM transactions WHERE account_id = 'ACC-101';`,
      marks: 10,
      explanation: {
        summary: 'EXPLAIN QUERY PLAN reveals whether SQLite uses an index seek or performs a full table scan.',
        keyConcept: 'SQLite EXPLAIN QUERY PLAN Diagnostic',
        detailed: `Profiling database performance on Android requires verifying that queries show <code>SEARCH TABLE ... USING INDEX</code> rather than <code>SCAN TABLE</code>. <code>EXPLAIN QUERY PLAN</code> outputs the planner's decisions.`,
        realWorldPitfall: 'Assuming an index is being used without checking EXPLAIN QUERY PLAN.',
        correctAnswerBreakdown: 'EXPLAIN QUERY PLAN reveals scan vs seek.'
      }
    },
    {
      id: 's4-q12-atomic-balance-sync',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Update Account Balances from Transaction Logs',
      prompt: `Write an SQL <code>UPDATE</code> statement to synchronize <code>accounts.balance</code> by subtracting all successful DEBIT transactions for account <code>'ACC-101'</code>.`,
      schemaContext: `Tables: accounts (account_id, balance), transactions (account_id, amount, transaction_type, status)`,
      expectedColumns: ['query_status'],
      validationType: 'balance_sync_update',
      sampleSolution: `UPDATE accounts 
SET balance = balance - (
    SELECT COALESCE(SUM(amount), 0) 
    FROM transactions 
    WHERE account_id = 'ACC-101' 
      AND transaction_type = 'DEBIT' 
      AND status = 'SUCCESS'
)
WHERE account_id = 'ACC-101';`,
      marks: 10,
      explanation: {
        summary: 'UPDATE with subquery and COALESCE safely recalculates account balance.',
        keyConcept: 'Correlated Updates in SQLite',
        detailed: `Using <code>COALESCE(SUM(amount), 0)</code> prevents setting balance to NULL if no debit transactions match.`,
        realWorldPitfall: 'Omitting COALESCE: if SUM() returns NULL, `balance - NULL` sets balance to NULL.',
        correctAnswerBreakdown: 'Performs safe atomic subtraction with COALESCE.'
      }
    },
    {
      id: 's4-q13-branch-spending-summary',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Branch Spending Summary with Multi-Table Join',
      prompt: `Write an SQL query to retrieve total successful debit spending grouped by branch.
<br/><br/>
<strong>Return:</strong>
- <code>branch</code>, <code>total_spent</code>, and <code>txn_count</code>.
- Order by <code>total_spent DESC</code>.`,
      schemaContext: `Tables: accounts (account_id, branch), transactions (account_id, amount, transaction_type, status)`,
      expectedColumns: ['branch', 'total_spent', 'txn_count'],
      validationType: 'branch_spending_summary',
      sampleSolution: `SELECT 
    a.branch,
    SUM(t.amount) AS total_spent,
    COUNT(t.transaction_id) AS txn_count
FROM accounts a
JOIN transactions t ON a.account_id = t.account_id
WHERE t.transaction_type = 'DEBIT' AND t.status = 'SUCCESS'
GROUP BY a.branch
ORDER BY total_spent DESC;`,
      marks: 10,
      explanation: {
        summary: 'Joins accounts and transactions on account_id, filters debits, and aggregates per branch.',
        keyConcept: 'Multi-Table Relational Aggregation',
        detailed: `Computes regional banking branch volume across account holders.`,
        realWorldPitfall: 'Using INNER JOIN omits branches with no active accounts.',
        correctAnswerBreakdown: 'London Canary Wharf and Manchester Central lead in total spend.'
      }
    },

    // DSA Problem
    {
      id: 's4-q14-merge-intervals',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Merge Overlapping Scheduled Maintenance Windows',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Algorithms &gt; Sorting &amp; Greedy
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Sorting &amp; Interval Scheduling
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(N log N) Time | O(N) Space
  </span>
</div>
Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code> representing scheduled banking system maintenance intervals, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all intervals in the input.
<br/><br/>
<strong>Constraints:</strong>
- <code>1 &lt;= intervals.size &lt;= 10^4</code>
- <code>intervals[i].size == 2</code>
- <code>0 &lt;= start_i &lt;= end_i &lt;= 10^4</code>
- <strong>Time Complexity Required:</strong> <code>O(N log N)</code>.`,
      starterCode: `fun mergeIntervals(intervals: Array<IntArray>): Array<IntArray> {
    if (intervals.size <= 1) return intervals

    // TODO: Sort intervals by start time and merge overlaps in O(N log N)

    return intervals
}

fun main() {
    val arr = arrayOf(intArrayOf(1, 3), intArrayOf(2, 6), intArrayOf(8, 10), intArrayOf(15, 18))
    val res = mergeIntervals(arr)
    println(res.map { "[ \${it[0]}, \${it[1]} ]" }.joinToString(", "))
}`,
      solutionCode: `fun mergeIntervals(intervals: Array<IntArray>): Array<IntArray> {
    if (intervals.size <= 1) return intervals

    // 1. Sort intervals by start time
    intervals.sortBy { it[0] }

    val merged = mutableListOf<IntArray>()
    var current = intervals[0]
    merged.add(current)

    for (i in 1 until intervals.size) {
        val next = intervals[i]
        if (next[0] <= current[1]) {
            // Overlapping intervals: extend the current end time
            current[1] = maxOf(current[1], next[1])
        } else {
            // Non-overlapping interval: advance
            current = next
            merged.add(current)
        }
    }

    return merged.toTypedArray()
}

fun main() {
    val arr = arrayOf(intArrayOf(1, 3), intArrayOf(2, 6), intArrayOf(8, 10), intArrayOf(15, 18))
    val res = mergeIntervals(arr)
    println(res.map { "[\${it[0]},\${it[1]}]" }.joinToString(" "))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Standard Overlap', input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '[1,6] [8,10] [15,18]', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: Consecutive Touching', input: '[[1,4],[4,5]]', expected: '[1,5]', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: Fully Contained Interval', input: '[[1,10],[2,5],[6,8]]', expected: '[1,10]', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: Already Disjoint', input: '[[1,2],[3,4],[5,6]]', expected: '[1,2] [3,4] [5,6]', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Sorting intervals by start time enables greedy merging in a single linear pass (O(N log N)).',
        keyConcept: 'Greedy Interval Merging with Sorting',
        detailed: `Sorting by <code>start</code> ensures that any potentially overlapping intervals appear adjacent in the array.
- If <code>next.start &lt;= current.end</code>, they overlap: <code>current.end = maxOf(current.end, next.end)</code>.
- Otherwise, add <code>next</code> as a new disjoint interval.
Complexity: Sorting takes $O(N \log N)$; linear sweep takes $O(N)$.`,
        realWorldPitfall: 'Forgetting `maxOf(current[1], next[1])`: if the second interval is completely inside the first, setting `current[1] = next[1]` incorrectly shrinks the interval!',
        correctAnswerBreakdown: 'Optimal O(N log N) solution.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's4-q15-android-arch-room-migration',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Room Database Migration (v1 -> v2) with Encrypted SQLite',
      prompt: `Implement a production <strong>Room Migration script from v1 to v2</strong> that adds an encrypted biometric auth column, preserves all customer rows without data loss, and verifies schema integrity.`,
      starterCode: `// Room v1 -> v2 Migration
// 1. MIGRATION OBJECT: val MIGRATION_1_2 = object : Migration(1, 2) { ... }
// 2. ROOM DATABASE BUILDER: Room.databaseBuilder(...)
// 3. TESTING SCRIPT`,
      fullArchitectureCode: `package com.bank.mastery.database

import androidx.room.*
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        // Safe SQLite ALTER TABLE adding non-null column with default
        db.execSQL("ALTER TABLE accounts ADD COLUMN biometric_enabled INTEGER NOT NULL DEFAULT 0")
        db.execSQL("CREATE INDEX IF NOT EXISTS idx_accounts_biometric ON accounts(biometric_enabled)")
    }
}

@Database(entities = [AccountEntity::class], version = 2)
abstract class AppDatabase : RoomDatabase() {
    abstract fun accountDao(): AccountDao
}`,
      marks: 40,
      explanation: {
        summary: 'Room Migration(1, 2) executes raw SQLite DDL and validates schema hashes.',
        keyConcept: 'Zero-Downtime Mobile Database Migrations',
        detailed: `Adding non-null columns in SQLite requires a <code>DEFAULT</code> value. Room checks the resulting schema hash; if <code>MIGRATION_1_2</code> matches the compiled schema, the database is upgraded without wiping user data.`,
        realWorldPitfall: 'Adding a NOT NULL column without a DEFAULT value in SQLite ALTER TABLE throws a SQLiteException.',
        correctAnswerBreakdown: 'Full migration implementation.'
      }
    }
  ]
};
