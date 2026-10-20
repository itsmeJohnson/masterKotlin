/* ==========================================================================
   Assessment Set 15: DBMS Transaction Isolation, Locks & B-Tree Internals
   Focus: Isolation Levels (Dirty, Non-Repeatable, Phantom), Pessimistic vs Optimistic,
          B-Tree Indexing, Subarray Sum Equals K (Prefix Sum + HashMap).
   ========================================================================== */

export const ASSESSMENT_SET_15 = {
  id: 'set-15',
  number: 15,
  title: 'Set 15: DBMS Transaction Isolation, Locks & B-Trees',
  shortTitle: 'Set 15: DBMS Isolation & B-Trees',
  focusArea: 'ACID Isolation Levels, MVCC, B-Trees vs Hash Indexes & Subarray Sum K',
  hackerEarthTrack: 'Algorithms > Prefix Sums & Hash Tables',
  hackerEarthChallenge: 'Code Monk: Subarray Sum Equals K in O(N)',
  hackerEarthConcepts: ['Prefix Sums', 'HashMap Frequency', 'Isolation Levels', 'B-Tree leaf pages'],
  difficulty: 'Senior / Lead Mobile Engineer',
  durationMinutes: 75,
  badge: 'Database Architect',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: DBMS Transaction Isolation & Storage Engines',
      shortTitle: 'DBMS Engines & Locks',
      icon: '🗄️',
      description: 'Senior database internals: ACID anomalies (Dirty/Phantom), MVCC undo logs, B-Trees vs Hash indexes, and Room withTransaction.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '📊',
      description: 'Deduplicating rows via ROW_NUMBER(), cumulative balances, and covering index DDL.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Subarray Sum Equals K in O(N) Time using Prefix Sum and HashMap.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Offline-First Transaction Sync Engine with Idempotency Key and Room withTransaction.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's15-q1-acid-isolation-anomalies',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'DBMS Architecture: Read Committed vs Repeatable Read vs Serializable',
      prompt: `Transaction A reads an account balance ($1000). Transaction B transfers $200 and commits.
Transaction A reads the account balance again within the same transaction and now sees $1200.
Which read phenomenon just occurred, and what minimum isolation level prevents this?`,
      options: [
        { id: 'opt-a', text: 'Dirty Read; prevented by READ UNCOMMITTED.' },
        { id: 'opt-b', text: 'Non-Repeatable Read (Fuzzy Read); prevented by REPEATABLE READ (or SERIALIZABLE).' },
        { id: 'opt-c', text: 'Phantom Read; prevented by READ COMMITTED.' },
        { id: 'opt-d', text: 'Lost Update; prevented by NO-LOCK.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Non-repeatable read occurs when re-reading the same row returns different values committed by another transaction; REPEATABLE READ prevents it.',
        keyConcept: 'ANSI SQL Isolation Anomalies',
        detailed: `The 3 classic read phenomena:
1. <strong>Dirty Read:</strong> Reading uncommitted changes from another transaction that might later roll back (prevented by <code>READ COMMITTED</code>).
2. <strong>Non-Repeatable Read:</strong> Re-reading the same row within a transaction returns modified column values committed by another transaction (prevented by <code>REPEATABLE READ</code>).
3. <strong>Phantom Read:</strong> Re-executing a range query (e.g. <code>WHERE balance &gt; 1000</code>) returns new "phantom" rows inserted by another committed transaction (prevented by <code>SERIALIZABLE</code> range locks or MVCC snapshots).`,
        realWorldPitfall: 'Assuming READ COMMITTED guarantees consistent multi-statement account reporting without snapshots.',
        correctAnswerBreakdown: 'Option B accurately identifies Non-Repeatable Read and REPEATABLE READ isolation.'
      }
    },
    {
      id: 's15-q2-pessimistic-vs-optimistic-locking',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Concurrency: Pessimistic Locking (FOR UPDATE) vs Optimistic Locking',
      prompt: `In banking applications handling ATM cash withdrawals versus web transfers:
When is <strong>Pessimistic Locking</strong> (<code>SELECT ... FOR UPDATE</code>) required instead of <strong>Optimistic Locking</strong> (version column)?`,
      options: [
        { id: 'opt-a', text: 'Pessimistic locking is only used for read-only analytics.' },
        { id: 'opt-b', text: 'Pessimistic locking is essential under high write contention where collision probability is high (e.g. concurrent automated debit requests); retrying failed optimistic updates repeatedly under high contention degrades throughput and exhausts CPU.' },
        { id: 'opt-c', text: 'Optimistic locking is banned in financial systems.' },
        { id: 'opt-d', text: 'There is no difference in concurrency throughput.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Pessimistic locking locks rows upfront to avoid rollback storms under heavy concurrent contention.',
        keyConcept: 'Pessimistic vs Optimistic Locking Trade-Offs',
        detailed: `- <strong>Optimistic Locking (OCC):</strong> Assumes collisions are rare. No locks are held during user think time. On commit, version is verified. Ideal for web forms and mobile apps.
- <strong>Pessimistic Locking (2PL):</strong> Acquires exclusive row-level locks immediately (<code>FOR UPDATE</code>). Ideal for flash-sale inventory decrements or rapid ATM withdrawals where 10 concurrent requests would otherwise cause 9 optimistic retries (live-lock).`,
        realWorldPitfall: 'Using pessimistic locking across user interaction steps: if a user opens a screen and walks away, rows remain locked indefinitely!',
        correctAnswerBreakdown: 'Option B accurately highlights high contention collision storms.'
      }
    },
    {
      id: 's15-q3-b-tree-vs-hash-indexes',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Database Storage: B-Tree Index vs Hash Index Mechanics',
      prompt: `Why do virtually all relational databases (SQLite, PostgreSQL, MySQL InnoDB) use <strong>B+ Trees</strong> as their default index structure instead of <strong>Hash Indexes</strong>?`,
      options: [
        { id: 'opt-a', text: 'Hash indexes use more memory than B+ Trees.' },
        { id: 'opt-b', text: 'Hash indexes only support exact equality lookups (=, IN). They cannot support range queries (BETWEEN, >, <), prefix pattern matching (LIKE "Barc%"), or sorted scans (ORDER BY) because hashing scrambles key order. B+ Trees maintain sorted order across doubly-linked leaf nodes.' },
        { id: 'opt-c', text: 'B+ Trees do not require disk storage.' },
        { id: 'opt-d', text: 'Hash indexes cannot handle numbers.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'B+ Trees maintain sorted order allowing range scans and ORDER BY; Hash indexes only support exact equality checks.',
        keyConcept: 'B+ Tree Leaf Node Chaining vs Hash Buckets',
        detailed: `In a B+ Tree:
- All data pointers reside in leaf nodes, which are sorted and doubly-linked together.
- A range query like <code>WHERE timestamp BETWEEN '2026-01-01' AND '2026-01-31'</code> performs a single $O(\\log N)$ tree traversal to find the start leaf, then simply scans sequentially along the leaf pointers.
A Hash index applies a cryptographic hash function that uniformly distributes keys across buckets: finding values in a range requires checking every single bucket in the entire table!`,
        realWorldPitfall: 'Assuming an index accelerates all queries: hash indexes fail completely on range and prefix queries.',
        correctAnswerBreakdown: 'Option B accurately explains range scan and sorting support in B+ Trees.'
      }
    },
    {
      id: 's15-q4-sqlite-wal-mode-concurrency',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'SQLite Internals: Write-Ahead Logging (WAL) Concurrency',
      prompt: `In standard SQLite rollback journal mode, writing locks the entire database, blocking all readers.
How does configuring <code>PRAGMA journal_mode = WAL;</code> fundamentally change reader and writer concurrency on Android?`,
      options: [
        { id: 'opt-a', text: 'It permits multiple writers to write simultaneously.' },
        { id: 'opt-b', text: 'WAL (Write-Ahead Logging) separates reads and writes: writers append new transactions to the WAL file without overwriting the main database file, allowing concurrent readers to read the main database without blocking or being blocked by the writer.' },
        { id: 'opt-c', text: 'It moves SQLite entirely into the Android RAM cache.' },
        { id: 'opt-d', text: 'WAL mode disables disk fsync calls.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'WAL allows simultaneous non-blocking reads while a write transaction is occurring.',
        keyConcept: 'SQLite Write-Ahead Logging (WAL) Architecture',
        detailed: `In WAL mode:
- Changes are written sequentially to a separate <code>&lt;database&gt;-wal</code> file.
- The original database file remains unchanged until a <strong>checkpoint</strong> occurs.
- Readers determine their view of data via the WAL index (<code>-shm</code> shared memory) file.
<strong>Result:</strong> Readers never block writers, and writers never block readers! (Though SQLite still supports only 1 active writer at a time).`,
        realWorldPitfall: 'Forgetting to enable WAL mode in Room: background sync operations cause UI queries on Dispatchers.Main to freeze.',
        correctAnswerBreakdown: 'Option B accurately explains non-blocking reader/writer concurrency in WAL.'
      }
    },
    {
      id: 's15-q5-clustered-vs-secondary-index',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Storage Engines: Clustered Index vs Secondary Index Pointer Hops',
      prompt: `What is the physical difference between a <strong>Clustered Index</strong> (e.g. SQLite standard RowID / WITHOUT ROWID) and a <strong>Secondary Index</strong>?`,
      options: [
        { id: 'opt-a', text: 'Clustered indexes are stored in the cloud; secondary indexes are local.' },
        { id: 'opt-b', text: 'In a Clustered Index, leaf pages contain the actual row data columns. In a Secondary Index, leaf pages store only the indexed columns plus a pointer (RowID or Primary Key) to the clustered index, requiring a second lookup (pointer hop) to retrieve other columns.' },
        { id: 'opt-c', text: 'Secondary indexes are temporary and deleted upon app close.' },
        { id: 'opt-d', text: 'There is no difference.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Clustered indexes store actual row records at leaf nodes; secondary indexes store primary key pointers, requiring an extra hop unless covered.',
        keyConcept: 'Clustered vs Secondary Index Architecture',
        detailed: `1. <strong>Clustered Index:</strong> The physical order of rows on disk matches the index order. The leaf nodes <i>are</i> the data rows. A table can have at most ONE clustered index.
2. <strong>Secondary Index:</strong> An auxiliary B-Tree. When you execute <code>SELECT * FROM accounts WHERE email = ?</code>, SQLite navigates the secondary index to find the matching RowID, then performs a second B-Tree traversal into the main table to fetch the remaining columns (called "Bookmark Lookup" or "Table Page Hop").`,
        realWorldPitfall: 'Selecting unnecessary columns (`SELECT *`) forces expensive secondary index bookmark lookups instead of index-only scans.',
        correctAnswerBreakdown: 'Option B accurately describes clustered leaf data vs secondary pointer hops.'
      }
    },
    {
      id: 's15-q6-room-with-transaction-dispatcher',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android Room: database.withTransaction {} Coroutine Rules',
      prompt: `When executing multiple Room DAO operations inside a transaction:
<pre><code>database.withTransaction {
    accountDao.debit(id, 100)
    auditDao.recordDebit(id, 100)
}</code></pre>
Why does <code>withTransaction</code> manage its own internal single-threaded dispatcher rather than inheriting <code>Dispatchers.IO</code>?`,
      options: [
        { id: 'opt-a', text: 'Dispatchers.IO does not support databases.' },
        { id: 'opt-b', text: 'SQLite transactions are bound to the specific operating system thread that opened the transaction. withTransaction acquires a single database connection and pins the coroutine execution to that specific connection thread, preventing thread-switching from breaking the active SQLite transaction.' },
        { id: 'opt-c', text: 'It forces the transaction to run on the Android Main UI thread.' },
        { id: 'opt-d', text: 'Room transactions cannot be suspended.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'withTransaction pins coroutine execution to a specific database connection thread to preserve transaction state.',
        keyConcept: 'Room withTransaction Thread Confinement',
        detailed: `In SQLite C-API, an open transaction (<code>BEGIN TRANSACTION</code>) is strictly thread-bound.
In standard coroutines with <code>Dispatchers.IO</code>, when a suspending function suspends and resumes, it may resume on a <strong>different thread</strong> in the IO thread pool!
If a coroutine resumed on Thread B after starting a transaction on Thread A, SQLite would throw <code>IllegalStateException: cannot commit transaction - SQL statements in progress</code>.
<code>Room.withTransaction</code> enforces thread confinement for the duration of the block.`,
        realWorldPitfall: 'Nesting `withContext(Dispatchers.IO)` inside `database.withTransaction` can cause connection deadlocks.',
        correctAnswerBreakdown: 'Option B accurately explains thread-bound SQLite transactions and coroutine thread pinning.'
      }
    },
    {
      id: 's15-q7-mvcc-undo-log-isolation',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'DBMS Engines: Multi-Version Concurrency Control (MVCC) Snapshots',
      prompt: `How does <strong>MVCC (Multi-Version Concurrency Control)</strong> allow long-running analytical queries to execute without holding read locks on tables?`,
      options: [
        { id: 'opt-a', text: 'It pauses all incoming write queries until the read query finishes.' },
        { id: 'opt-b', text: 'Whenever a row is updated, the database retains the older version of the row in an Undo Log or Rollback Segment with a transaction timestamp. Long-running reads traverse the undo log to view a consistent point-in-time snapshot of data as it existed when their query began.' },
        { id: 'opt-c', text: 'It copies the entire database to a temporary file.' },
        { id: 'opt-d', text: 'It executes queries on simulated random data.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'MVCC maintains historical row versions in undo logs, enabling lock-free point-in-time snapshot reads.',
        keyConcept: 'MVCC Snapshot Isolation & Undo Logs',
        detailed: `In traditional 2-Phase Locking (2PL), reading a row locks it with a Shared Lock, blocking all writers.
In modern engines with MVCC (PostgreSQL, MySQL InnoDB, Oracle):
- Each transaction is assigned a monotonically increasing Transaction ID (XID).
- When Row A is updated, the old row is kept in the Undo Log.
- A query started at XID 100 reads data valid as of XID 100, ignoring newer writes from XID 105.
This allows massive report queries to run for hours without blocking online payment transactions!`,
        realWorldPitfall: 'Long-running transactions prevent the database from cleaning up old undo logs, causing table bloat and disk exhaustion.',
        correctAnswerBreakdown: 'Option B accurately details point-in-time snapshot reads via undo logs.'
      }
    },
    {
      id: 's15-q8-database-deadlock-detection',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'DBMS Concurrency: Waits-For Graph & Deadlock Detection',
      prompt: `How does a relational database engine detect and resolve an internal deadlock between two concurrent transactions?`,
      options: [
        { id: 'opt-a', text: 'It shuts down the database service.' },
        { id: 'opt-b', text: 'The lock manager maintains a directed "Waits-For Graph" where nodes represent transactions and edges represent lock dependencies. When a cycle (directed loop) is detected via depth-first search, the engine selects a transaction as the "victim" and aborts/rolls it back with a DeadlockException.' },
        { id: 'opt-c', text: 'It grants the lock to both transactions at the same time.' },
        { id: 'opt-d', text: 'It reboots the operating system.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Databases detect cycles in a Waits-For graph and abort one transaction (the victim) to break the cycle.',
        keyConcept: 'Waits-For Graph & Cycle Breaking',
        detailed: `When Transaction 1 holds Row A and waits for Row B, and Transaction 2 holds Row B and waits for Row A:
1. The lock manager creates directed edges $T_1 \\to T_2$ and $T_2 \\to T_1$.
2. Periodic cycle-detection algorithms detect the loop $T_1 \\to T_2 \\to T_1$.
3. The engine picks the transaction that has modified fewer rows (lowest rollback cost) as the <strong>deadlock victim</strong>, rolls it back, and throws <code>SQLException: Deadlock detected</code>, allowing the other transaction to proceed.`,
        realWorldPitfall: 'Catching DeadlockException without implementing automatic exponential backoff retry logic.',
        correctAnswerBreakdown: 'Option B accurately explains Waits-For Graph cycle detection and victim selection.'
      }
    },

    // DBMS Section
    {
      id: 's15-q9-deduplicate-latest-row-number',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Deduplicate Transactions Keeping Only the Latest Entry',
      prompt: `Due to an offline sync glitch, identical transactions were inserted multiple times for the same <code>account_id</code>, <code>amount</code>, and <code>merchant</code>.
Write an SQL query using <code>ROW_NUMBER()</code> to return only the single <strong>most recent record</strong> for each distinct combination.
<br/><br/>
<strong>Return:</strong>
- <code>transaction_id</code>, <code>account_id</code>, <code>amount</code>, <code>merchant</code>, <code>timestamp</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, merchant, timestamp)`,
      expectedColumns: ['transaction_id', 'account_id', 'amount', 'merchant', 'timestamp'],
      validationType: 'dedup_latest_row_number',
      sampleSolution: `WITH ranked_records AS (
    SELECT 
        transaction_id,
        account_id,
        amount,
        merchant,
        timestamp,
        ROW_NUMBER() OVER (
            PARTITION BY account_id, amount, merchant 
            ORDER BY timestamp DESC, transaction_id DESC
        ) AS rn
    FROM transactions
)
SELECT transaction_id, account_id, amount, merchant, timestamp
FROM ranked_records
WHERE rn = 1
ORDER BY timestamp DESC;`,
      marks: 10,
      explanation: {
        summary: 'ROW_NUMBER() partitioned by unique business keys and ordered by timestamp DESC filters out older duplicates.',
        keyConcept: 'Deduplication via Window Partitioning',
        detailed: `<code>PARTITION BY account_id, amount, merchant</code> groups duplicate candidate rows. <code>ORDER BY timestamp DESC</code> assigns <code>rn = 1</code> to the latest row. Filtering <code>WHERE rn = 1</code> cleans the dataset in a single scan.`,
        realWorldPitfall: 'Using GROUP BY without row number: SQLite allows selecting unaggregated columns in GROUP BY, returning arbitrary rows.',
        correctAnswerBreakdown: 'ROW_NUMBER() partitioned by duplicate keys with rn = 1.'
      }
    },
    {
      id: 's15-q10-cumulative-net-balance-all-time',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: All-Time Net Cash Flow per Customer Account',
      prompt: `Calculate the total net balance across all transaction history for every account:
- <code>'CREDIT'</code> transactions add to the balance.
- <code>'DEBIT'</code> transactions subtract from the balance.
<br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>net_cashflow</code>.
- Order by <code>net_cashflow DESC</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, status)`,
      expectedColumns: ['account_id', 'net_cashflow'],
      validationType: 'net_cashflow_aggregation',
      sampleSolution: `SELECT 
    account_id,
    ROUND(SUM(
        CASE 
            WHEN transaction_type = 'CREDIT' THEN amount 
            WHEN transaction_type = 'DEBIT' THEN -amount 
            ELSE 0 
        END
    ), 2) AS net_cashflow
FROM transactions
WHERE status = 'COMPLETED'
GROUP BY account_id
ORDER BY net_cashflow DESC;`,
      marks: 10,
      explanation: {
        summary: 'Conditional SUM with CASE expression computes net balance across debits and credits.',
        keyConcept: 'Signed Net Aggregation in Financial Ledgers',
        detailed: `Combining <code>CASE</code> statements inside an aggregate function allows computing signed net ledger totals without writing separate subqueries for debits and credits.`,
        realWorldPitfall: 'Forgetting to filter `status = \'COMPLETED\'` includes failed or pending transactions in customer balances.',
        correctAnswerBreakdown: 'SUM with CASE WHEN credit THEN amount ELSE -amount.'
      }
    },
    {
      id: 's15-q11-no-defaults-anti-join',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Prime Borrowers (Active Loans with Zero Missed Payments)',
      prompt: `Identify all borrowers who have active loans with <strong>zero missed payment defaults</strong> in the <code>loan_defaults</code> table.
<br/><br/>
<strong>Return:</strong>
- <code>customer_id</code>, <code>customer_name</code>, <code>loan_amount</code>.`,
      schemaContext: `Tables: loans (loan_id, customer_id, customer_name, loan_amount, status), loan_defaults (default_id, loan_id, missed_date)`,
      expectedColumns: ['customer_id', 'customer_name', 'loan_amount'],
      validationType: 'prime_borrowers_anti_join',
      sampleSolution: `SELECT 
    l.customer_id,
    l.customer_name,
    l.loan_amount
FROM loans l
LEFT JOIN loan_defaults d ON l.loan_id = d.loan_id
WHERE l.status = 'ACTIVE' 
  AND d.default_id IS NULL;`,
      marks: 10,
      explanation: {
        summary: 'Anti-join with LEFT JOIN ... WHERE default_id IS NULL filters out any loans with defaults.',
        keyConcept: 'Credit Risk Anti-Join Filtering',
        detailed: `This query efficiently retrieves prime borrowers eligible for credit line increases. If a customer has even one row in <code>loan_defaults</code>, the left join matches and <code>d.default_id IS NULL</code> excludes them.`,
        realWorldPitfall: 'Using `COUNT(d.default_id) = 0` with GROUP BY is much slower on large datasets than an anti-join.',
        correctAnswerBreakdown: 'LEFT JOIN ... WHERE d.default_id IS NULL.'
      }
    },
    {
      id: 's15-q12-rapid-identical-amount-fraud',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Double-Tap Duplicate Payment Detection (< 60s)',
      prompt: `Find all instances where the same account submitted two transactions for the <strong>exact same dollar amount</strong> within <strong>60 seconds</strong> of each other.
<br/><br/>
<strong>Return:</strong>
- <code>t1.account_id</code>, <code>t1.transaction_id AS first_txn</code>, <code>t2.transaction_id AS second_txn</code>, <code>t1.amount</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['account_id', 'first_txn', 'second_txn', 'amount'],
      validationType: 'double_tap_payment_fraud',
      sampleSolution: `SELECT 
    t1.account_id,
    t1.transaction_id AS first_txn,
    t2.transaction_id AS second_txn,
    t1.amount
FROM transactions t1
JOIN transactions t2 ON t1.account_id = t2.account_id
    AND t1.amount = t2.amount
    AND t1.transaction_id < t2.transaction_id
    AND strftime('%s', t2.timestamp) >= strftime('%s', t1.timestamp)
    AND (strftime('%s', t2.timestamp) - strftime('%s', t1.timestamp)) <= 60
ORDER BY t1.account_id;`,
      marks: 10,
      explanation: {
        summary: 'Self-join matching account, identical amount, and epoch delta <= 60 detects double-tap accidental charges.',
        keyConcept: 'Double-Submit Payment Collision Detection',
        detailed: `When a mobile user taps "Pay" twice due to network lag, two identical transactions are created seconds apart. Identifying pairs where <code>amount</code> matches and epoch difference is $\\le 60\\text{s}$ flags accidental double charges for automated refunding.`,
        realWorldPitfall: 'Using `t1.transaction_id != t2.transaction_id` returns duplicate mirrored rows.',
        correctAnswerBreakdown: 'Self-join with t1.id < t2.id and epoch diff <= 60.'
      }
    },
    {
      id: 's15-q13-composite-btree-equality-range-ddl',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: B-Tree Composite Index (Equality Column First Rule)',
      prompt: `Given the query:
<pre><code>SELECT * FROM transactions WHERE account_id = ? AND timestamp >= ? AND timestamp <= ?;</code></pre>
Write SQLite DDL to create the optimal B-Tree index following the <strong>Equality-First Rule</strong>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status, timestamp)`,
      expectedColumns: ['query_status'],
      validationType: 'equality_first_index_ddl',
      sampleSolution: `CREATE INDEX idx_transactions_account_timestamp 
ON transactions(account_id, timestamp);`,
      marks: 10,
      explanation: {
        summary: 'In composite B-Tree indexes, columns filtered by equality (=) must come BEFORE columns filtered by range (>=, <=).',
        keyConcept: 'Composite Index Equality-First Rule',
        detailed: `If the index is created as <code>(timestamp, account_id)</code>:
The B-Tree first branches on <code>timestamp</code>. Within each timestamp range, entries for different accounts are mixed together. The database cannot seek directly to <code>account_id</code>, resulting in an index range scan!
Putting the equality column first <code>(account_id, timestamp)</code>:
The B-Tree seeks directly to the sub-tree for that exact account in $O(\\log N)$, and then scans only the contiguous range of timestamps for that specific account!`,
        realWorldPitfall: 'Creating composite index with range column first: `(timestamp, account_id)` ruins index seek performance.',
        correctAnswerBreakdown: 'CREATE INDEX ... (account_id, timestamp).'
      }
    },

    // DSA Coding Section
    {
      id: 's15-q14-subarray-sum-equals-k',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: Subarray Sum Equals K in O(N) using Prefix Sum & HashMap',
      prompt: `Given an array of integers <code>nums</code> and an integer $K$, return the total number of continuous subarrays whose sum equals $K$.
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in <strong>$O(N)$ time</strong>.
- $O(N^2)$ nested loop approaches will <strong>Time Out</strong>.
- $1 \\le N \\le 10^5$, $-1000 \\le nums[i] \\le 1000$, $-10^7 \\le K \\le 10^7$.
- Array can contain negative numbers (sliding window cannot be used because sum is non-monotonic).
<br/><br/>
<strong>Input Format:</strong>
Line 1: $N$ $K$<br/>
Line 2: $N$ space-separated integers.<br/>
<strong>Output Format:</strong>
A single integer representing the count of continuous subarrays with sum $K$.`,
      difficulty: 'Medium-Hard',
      marks: 30,
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      starterCode: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.StringTokenizer;

public class Solution {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null || line.trim().isEmpty()) return;
        
        StringTokenizer st = new StringTokenizer(line);
        int n = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
        
        int[] nums = new int[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            nums[i] = Integer.parseInt(st.nextToken());
        }
        
        System.out.println(subarraySum(nums, k));
    }

    public static int subarraySum(int[] nums, int k) {
        // Map to store frequency of prefix sums encountered so far
        HashMap<Integer, Integer> prefixMap = new HashMap<>();
        // Base case: prefix sum of 0 has occurred 1 time (empty subarray)
        prefixMap.put(0, 1);
        
        int currentSum = 0;
        int count = 0;
        
        for (int num : nums) {
            currentSum += num;
            
            // If (currentSum - k) exists in map, add its frequency
            int target = currentSum - k;
            if (prefixMap.containsKey(target)) {
                count += prefixMap.get(target);
            }
            
            // Record currentSum frequency in map
            prefixMap.put(currentSum, prefixMap.getOrDefault(currentSum, 0) + 1);
        }
        
        return count;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: '3 2\n1 1 1',
          expectedOutput: '2',
          isSample: true
        },
        {
          id: 'tc-2',
          input: '3 3\n1 2 3',
          expectedOutput: '2',
          isSample: true
        },
        {
          id: 'tc-3',
          input: '4 0\n1 -1 1 -1',
          expectedOutput: '4',
          isSample: false
        },
        {
          id: 'tc-4',
          input: '5 -2\n-1 -1 1 -2 0',
          expectedOutput: '4',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Maintain running prefix sum and query HashMap for (currentSum - k) in O(N) time.',
        keyConcept: 'Prefix Sum Difference Identity: prefix[j] - prefix[i] = K',
        detailed: `The sum of subarray from index $i+1$ to $j$ is:
$$\\sum_{m=i+1}^j \\text{nums}[m] = \\text{prefix}[j] - \\text{prefix}[i] = K$$
Rearranging gives:
$$\\text{prefix}[i] = \\text{prefix}[j] - K$$
As we iterate through the array maintaining running sum $S$:
1. If $S - K$ was previously seen $C$ times, then there exist $C$ distinct starting indices that form a valid subarray ending at current index!
2. Add $C$ to our answer count.
3. Record current sum $S$ in the frequency map.
Because the array contains negative numbers, standard sliding window does not work (the sum does not grow monotonically). Prefix map resolves this in strictly $O(N)$ time!`,
        realWorldPitfall: 'Forgetting `prefixMap.put(0, 1)` base case: this fails to count subarrays that start from index 0.',
        correctAnswerBreakdown: 'O(N) time and O(N) space using HashMap prefix frequency.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's15-q15-offline-transaction-sync-queue',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: Offline-First Transaction Engine with Idempotency and Room withTransaction',
      prompt: `Design and implement an offline-first financial payment synchronization engine supporting:
1. Client-generated UUID idempotency keys to prevent duplicate bank charges upon network timeouts.
2. Local Room queue storing pending transactions with status (<code>PENDING</code>, <code>SYNCING</code>, <code>SYNCED</code>, <code>FAILED</code>).
3. Atomic local balance deduction inside <code>database.withTransaction</code> before queuing.
4. Exponential backoff network sync worker using WorkManager / Coroutines.`,
      marks: 40,
      evaluationCriteria: [
        'Generates UUID idempotency key per payment intent',
        'Executes balance deduction and pending entry insert atomically in database.withTransaction',
        'Implements state machine: PENDING -> SYNCING -> SYNCED / FAILED',
        'Handles network timeout by safely retrying with the same idempotency key'
      ],
      sampleSolution: `@Entity(tableName = "pending_transactions")
data class PendingTransactionEntity(
    @PrimaryKey val idempotencyKey: String, // UUID generated on client
    val accountId: String,
    val amount: Double,
    val status: String, // PENDING, SYNCING, SYNCED, FAILED
    val retryCount: Int,
    val createdAt: Long = System.currentTimeMillis()
)

class OfflinePaymentRepository @Inject constructor(
    private val database: AppDatabase,
    private val paymentDao: PaymentDao,
    private val accountDao: AccountDao,
    private val api: BankingApiService
) {
    suspend fun queuePayment(accountId: String, amount: Double): String {
        val idempotencyKey = UUID.randomUUID().toString()

        database.withTransaction {
            val account = accountDao.getAccount(accountId)
                ?: throw IllegalArgumentException("Account not found")
            if (account.balance < amount) {
                throw IllegalStateException("Insufficient funds")
            }

            // Deduct local balance immediately (optimistic UI)
            accountDao.updateBalance(accountId, account.balance - amount)

            // Insert into offline queue
            paymentDao.insert(
                PendingTransactionEntity(
                    idempotencyKey = idempotencyKey,
                    accountId = accountId,
                    amount = amount,
                    status = "PENDING",
                    retryCount = 0
                )
            )
        }

        return idempotencyKey
    }

    suspend fun syncPendingTransactions() = withContext(Dispatchers.IO) {
        val pending = paymentDao.getByStatus("PENDING")
        for (item in pending) {
            try {
                paymentDao.updateStatus(item.idempotencyKey, "SYNCING")
                val response = api.submitPayment(
                    idempotencyKey = item.idempotencyKey,
                    accountId = item.accountId,
                    amount = item.amount
                )
                if (response.isSuccessful) {
                    paymentDao.updateStatus(item.idempotencyKey, "SYNCED")
                }
            } catch (e: Exception) {
                paymentDao.incrementRetry(item.idempotencyKey)
            }
        }
    }
}`,
      explanation: {
        summary: 'Idempotency keys combined with Room atomic transactions guarantee zero double-charging and consistent offline balance tracking.',
        keyConcept: 'Client-Side Idempotency & Offline-First State Machine',
        detailed: `In mobile banking, network drops during payment requests are frequent:
If the app sends a payment request and the connection drops before receiving the HTTP 200 response, retrying without an <strong>idempotency key</strong> would charge the customer twice!
Passing a client-generated UUID header (<code>X-Idempotency-Key</code>) instructs the bank gateway to recognize retry attempts and return the existing transaction receipt without re-executing funds transfer.
<code>database.withTransaction</code> guarantees that local balance deduction and queue entry creation either both succeed or both roll back.`,
        realWorldPitfall: 'Generating a new idempotency key on each retry: this completely breaks duplicate payment protection!',
        correctAnswerBreakdown: 'UUID idempotency key with Room withTransaction atomicity and state machine.'
      }
    }
  ]
};
