/* ==========================================================================
   Assessment Set 11: Java-to-Kotlin Migration & Interoperability Deep-Dive
   Focus: @JvmStatic, Platform Types (Type!), @Throws, Declaration-site variance,
          @JvmOverloads in XML Custom Views, Product of Array Except Self O(N).
   ========================================================================== */

export const ASSESSMENT_SET_11 = {
  id: 'set-11',
  number: 11,
  title: 'Set 11: Java-to-Kotlin Migration & JVM Interoperability',
  shortTitle: 'Set 11: Java-to-Kotlin Migration',
  focusArea: 'Java Interop, Platform Types, Generics Variance, @JvmOverloads & Array DSA',
  hackerEarthTrack: 'Algorithms > Arrays & Math',
  hackerEarthChallenge: 'Code Monk: Prefix & Suffix Products without Division',
  hackerEarthConcepts: ['Prefix/Suffix Arrays', 'O(1) Space Product', 'Platform Types', 'Java Interop Bytecode'],
  difficulty: 'Senior / Lead Mobile Engineer',
  durationMinutes: 75,
  badge: 'Migration Specialist',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Java-to-Kotlin Migration & JVM Internals',
      shortTitle: 'Java & Kotlin Interop',
      icon: '☕',
      description: 'Java interoperability: @JvmStatic, platform types, @Throws, generics variance (in/out), and @JvmOverloads for XML views.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Consecutive activity streaks using LAG/LEAD, cumulative balances, and partial indexes.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Product of Array Except Self in O(N) Time and O(1) Auxiliary Space.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Migrating a legacy Java Double-Checked Locking Singleton to modern Kotlin & Hilt.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's11-q1-jvm-static-companion',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Java Interop: @JvmStatic on Companion Object Members',
      prompt: `Consider this Kotlin utility object:
<pre><code>class TokenManager {
    companion object {
        fun clearSession() { /* ... */ }
    }
}</code></pre>
When calling this function from legacy Java code, why is <code>TokenManager.clearSession()</code> a compilation error unless <code>@JvmStatic</code> is applied?`,
      options: [
        { id: 'opt-a', text: 'Kotlin companion objects are private by default in Java.' },
        { id: 'opt-b', text: 'Without @JvmStatic, clearSession is compiled as an instance method of a singleton inner instance named Companion. Java must invoke it via TokenManager.Companion.clearSession(). @JvmStatic instructs the compiler to synthesize a real static forwarder on the outer class.' },
        { id: 'opt-c', text: 'Companion objects do not generate bytecode.' },
        { id: 'opt-d', text: 'Java does not support static methods.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '@JvmStatic generates a true static forwarder method on the enclosing Java class.',
        keyConcept: 'Companion Object Bytecode & @JvmStatic',
        detailed: `In Kotlin bytecode, companion objects are represented as a nested static singleton instance: <code>public static final Companion Companion = new Companion();</code>.
Calling it from Java without <code>@JvmStatic</code> requires <code>TokenManager.Companion.clearSession()</code>. Adding <code>@JvmStatic</code> tells <code>kotlinc</code> to also generate <code>public static void clearSession() { Companion.clearSession(); }</code> on the outer class, enabling clean Java syntax.`,
        realWorldPitfall: 'Omitting @JvmStatic breaks legacy Java unit tests and dagger modules expecting static factory methods.',
        correctAnswerBreakdown: 'Option B accurately details the static forwarder bytecode synthesis.'
      }
    },
    {
      id: 's11-q2-platform-types-npe',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Type System: Platform Types (T!) and Silent NullPointerException',
      prompt: `A Kotlin class calls a legacy Java method without nullability annotations:
<pre><code>// Java:
public class LegacyAccountService {
    public static String getAccountHolderName(String id) {
        return maybeNullFromDatabase(id);
    }
}</code></pre>
<pre><code>// Kotlin:
val name = LegacyAccountService.getAccountHolderName("101")
val upper = name.uppercase()</code></pre>
Why does the Kotlin compiler allow <code>name.uppercase()</code> without a compile-time safe-call (<code>?.</code>), and what happens at runtime if the Java method returns <code>null</code>?`,
      options: [
        { id: 'opt-a', text: 'Kotlin treats unannotated Java types as nullable (String?), so this snippet refuses to compile.' },
        { id: 'opt-b', text: 'Kotlin infers unannotated Java types as "Platform Types" (String!). The compiler relaxes nullability checks, allowing you to treat it as non-null or nullable. If null is returned, an immediate NullPointerException crashes at runtime on dereference.' },
        { id: 'opt-c', text: 'Kotlin automatically replaces null with an empty string "" at runtime.' },
        { id: 'opt-d', text: 'The JVM throws a ClassCastException.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Platform types (String!) have relaxed compile checks; treating them as non-null crashes with NPE if Java returns null.',
        keyConcept: 'Platform Types & Interoperability Null Safety',
        detailed: `Because Java has no built-in nullability metadata, Kotlin represents types from Java without <code>@Nullable</code> or <code>@NonNull</code> as <strong>Platform Types</strong>, shown as <code>T!</code> in IDE warnings.
Kotlin permits you to treat <code>T!</code> as either <code>T</code> or <code>T?</code>. If you treat it as non-null and Java returns null, Kotlin generates an intrinsic check (<code>Intrinsics.checkNotNullExpressionValue</code>) or crashes with <code>NullPointerException</code> on dereference.`,
        realWorldPitfall: 'Assuming Java library methods never return null. Always explicitly annotate Java APIs with `@Nullable`/`@NonNull` or assign to explicit `val name: String?` in Kotlin.',
        correctAnswerBreakdown: 'Option B accurately describes Platform Type semantics and runtime NPE failure.'
      }
    },
    {
      id: 's11-q3-throws-checked-exceptions',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Exception Handling: @Throws and Java Checked Exceptions',
      prompt: `Kotlin does not have checked exceptions. Suppose you write a Kotlin network client:
<pre><code>class BankApiClient {
    fun fetchLedger(): Ledger {
        if (networkDown) throw IOException("Socket timeout")
        return Ledger()
    }
}</code></pre>
When a legacy Java class attempts to call <code>client.fetchLedger()</code> inside <code>try { ... } catch (IOException e) { ... }</code>, why does the Java compiler throw a compile error: <em>"exception IOException is never thrown in body of corresponding try statement"</em>?`,
      options: [
        { id: 'opt-a', text: 'Java does not allow catching IOException.' },
        { id: 'opt-b', text: 'By default, Kotlinc does not declare checked exceptions in the JVM method signature (throws clause). Java compiler rejects catching checked exceptions that are not declared in the method signature unless @Throws(IOException::class) is added in Kotlin.' },
        { id: 'opt-c', text: 'IOException is converted to RuntimeException by the Android runtime.' },
        { id: 'opt-d', text: 'Kotlin catches all exceptions internally.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '@Throws is required for Java to recognize that a Kotlin method throws checked exceptions.',
        keyConcept: '@Throws Annotation & Checked Exception Bytecode',
        detailed: `In Java, the compiler strictly enforces that you can only catch a checked exception (like <code>IOException</code>) if the invoked method explicitly declares <code>throws IOException</code> in its signature.
Because Kotlin treats all exceptions as unchecked, <code>kotlinc</code> compiles methods without a <code>throws</code> clause. Adding <code>@Throws(IOException::class)</code> instructs <code>kotlinc</code> to write the <code>Exceptions</code> attribute in the classfile bytecode, making Java compilation succeed.`,
        realWorldPitfall: 'Migrating a Java interface to Kotlin without `@Throws` causes all existing Java callers with try-catch blocks to break compilation.',
        correctAnswerBreakdown: 'Option B accurately explains the JVM method signature throws clause requirement.'
      }
    },
    {
      id: 's11-q4-generics-variance-in-out',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Generics Variance: Declaration-Site (out/in) vs Java Use-Site (? extends/? super)',
      prompt: `In Java, to read elements from a collection of subclasses, you must use wildcard variance: <code>List&lt;? extends Account&gt;</code> (PECS: Producer Extends, Consumer Super).
How does Kotlin simplify this using <strong>Declaration-Site Variance</strong>?`,
      options: [
        { id: 'opt-a', text: 'Kotlin disallows subtyping in generic collections entirely.' },
        { id: 'opt-b', text: 'By declaring "out T" on the interface definition (e.g. interface List<out E>), every usage of List<Account> automatically accepts List<SavingsAccount> without needing wildcard syntax at every call site.' },
        { id: 'opt-c', text: 'Kotlin replaces all generics with java.lang.Object at runtime.' },
        { id: 'opt-d', text: 'Kotlin uses "in T" for producers and "out T" for consumers.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Declaration-site variance (out T) marks the type parameter covariant at the interface definition once and for all.',
        keyConcept: 'Declaration-Site Variance vs Use-Site Variance (PECS)',
        detailed: `In Java, <code>List&lt;String&gt;</code> is NOT a subtype of <code>List&lt;Object&gt;</code>. You are forced to write <code>List&lt;? extends Object&gt;</code> everywhere you read items.
Kotlin introduces <strong>declaration-site variance</strong>:
- <code>out T</code> (Covariant / Producer): <code>T</code> only appears in return/output positions. Thus <code>List&lt;SavingsAccount&gt;</code> is automatically a subtype of <code>List&lt;Account&gt;</code>!
- <code>in T</code> (Contravariant / Consumer): <code>T</code> only appears in argument/input positions (like <code>Comparable&lt;in T&gt;</code>).`,
        realWorldPitfall: 'Trying to put an `out T` parameter into a public function argument position: the Kotlin compiler rejects it with "Type parameter T is declared as \'out\' but occurs in \'in\' position".',
        correctAnswerBreakdown: 'Option B captures the essence of Kotlin declaration-site variance.'
      }
    },
    {
      id: 's11-q5-jvm-overloads-xml-custom-views',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android XML Views: @JvmOverloads for Custom View Constructors',
      prompt: `When writing an Android custom view in Kotlin to be inflated from XML:
<pre><code>class CustomBadgeView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr)</code></pre>
Why is the <code>@JvmOverloads</code> annotation essential for correct XML layout inflation?`,
      options: [
        { id: 'opt-a', text: 'It registers the view with the Android Choreographer.' },
        { id: 'opt-b', text: 'LayoutInflater in Android uses Java reflection to invoke the 2-argument constructor View(Context, AttributeSet). Without @JvmOverloads, Kotlin only generates the 3-argument constructor in bytecode, causing InflateException at runtime.' },
        { id: 'opt-c', text: 'It enables hardware acceleration for custom draw passes.' },
        { id: 'opt-d', text: 'It binds the view directly to Jetpack Compose.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: '@JvmOverloads instructs kotlinc to generate overloaded constructor signatures (1-arg, 2-arg, 3-arg) needed by LayoutInflater.',
        keyConcept: '@JvmOverloads & Android View Inflation',
        detailed: `Kotlin default parameter values are handled via a synthetic bitmask method in bytecode. To Java reflection (which Android's <code>LayoutInflater</code> uses when parsing XML tags), only the full 3-arg constructor exists unless <code>@JvmOverloads</code> is present.
<code>@JvmOverloads</code> forces the compiler to generate:
1. <code>CustomBadgeView(Context)</code>
2. <code>CustomBadgeView(Context, AttributeSet)</code>
3. <code>CustomBadgeView(Context, AttributeSet, int)</code>
Preventing the dreaded <code>android.view.InflateException: NoSuchMethodException: CustomBadgeView.&lt;init&gt;(Context, AttributeSet)</code>.`,
        realWorldPitfall: 'Forgetting `@JvmOverloads` when migrating Java custom views to Kotlin causes release build inflation crashes.',
        correctAnswerBreakdown: 'Option B accurately identifies LayoutInflater constructor reflection.'
      }
    },
    {
      id: 's11-q6-reified-type-parameters',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Generics Internals: Inlined Reified Types vs Java Type Erasure',
      prompt: `In Java, you cannot write <code>if (item instanceof T)</code> or <code>T.class</code> due to generic type erasure.
Why does this work in Kotlin when declared as:
<pre><code>inline fun &lt;reified T&gt; parseJson(json: String): T</code></pre>`,
      options: [
        { id: 'opt-a', text: 'Kotlin stores type metadata in a static global registry on the JVM.' },
        { id: 'opt-b', text: 'Because the function is marked "inline", the compiler copies the actual bytecode to the call site where the exact concrete type argument (e.g. User.class) is known at compile time, substituting the concrete class directly into the inlined bytecode.' },
        { id: 'opt-c', text: 'Kotlin uses C++ templates instead of JVM bytecode.' },
        { id: 'opt-d', text: 'Reified types only work on Android 14+.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Inlined functions substitute the concrete class directly into the call-site bytecode, bypassing type erasure.',
        keyConcept: 'Reified Generics via Bytecode Inlining',
        detailed: `On the JVM, generics are erased at compile time (replaced with <code>Object</code> or their upper bound).
Because an <code>inline</code> function has no separate method call in bytecode (its body is pasted directly at every call site), the compiler already knows the exact concrete type being passed (e.g. <code>parseJson&lt;User&gt;(json)</code>). It replaces <code>T::class.java</code> with <code>User.class</code> directly in the call site bytecode!
Hence, <code>reified</code> is only permitted on <code>inline</code> functions.`,
        realWorldPitfall: 'Trying to call a reified inline function from Java: Java cannot inline Kotlin bytecode and therefore cannot call reified functions.',
        correctAnswerBreakdown: 'Option B accurately explains call-site bytecode substitution.'
      }
    },
    {
      id: 's11-q7-synchronized-lock-vs-coroutine-mutex',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Concurrency Migration: Java synchronized / ReentrantLock vs Coroutine Mutex',
      prompt: `When migrating a multithreaded Java repository with <code>synchronized (lock) { ... }</code> to Kotlin Coroutines:
Why should you <strong>NEVER</strong> call <code>synchronized</code> or block a thread with <code>ReentrantLock</code> across a suspending point?`,
      options: [
        { id: 'opt-a', text: 'The Kotlin compiler rejects synchronized blocks containing coroutines.' },
        { id: 'opt-b', text: 'A coroutine suspended inside synchronized(lock) holds the monitor lock while releasing the underlying OS thread; another coroutine on that thread or another worker cannot acquire the lock, causing thread starvation or deadlock. Use Mutex.withLock instead.' },
        { id: 'opt-c', text: 'synchronized locks are deleted in Android 13.' },
        { id: 'opt-d', text: 'Coroutine Mutex uses 10x more CPU than synchronized.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Blocking locks like synchronized hold thread monitor state across suspension, risking deadlock; use suspending Mutex.withLock.',
        keyConcept: 'Thread Monitor Lock vs Coroutine Non-Blocking Mutex',
        detailed: `<code>synchronized</code> and <code>ReentrantLock</code> are tied to OS threads. When a coroutine suspends, it leaves the thread to do other work, but the JVM monitor lock remains held! If a second coroutine tries to execute on that dispatcher, it deadlocks.
Kotlin's <code>kotlinx.coroutines.sync.Mutex</code> is coroutine-aware: <code>mutex.withLock { ... }</code> suspends the coroutine without blocking the underlying thread.`,
        realWorldPitfall: 'Putting `delay()` or suspending network calls inside Java `synchronized` blocks locks up the Dispatcher thread pool.',
        correctAnswerBreakdown: 'Option B highlights the thread monitor lock retention issue across suspension points.'
      }
    },
    {
      id: 's11-q8-sam-conversion-kotlin',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Functional Programming: Java SAM Interfaces vs Kotlin "fun interface"',
      prompt: `In Java, any interface with a single abstract method (like <code>Runnable</code> or <code>OnClickListener</code>) automatically supports lambda assignment (SAM conversion).
In Kotlin, what must you do if you define an interface in Kotlin and want callers to write lambdas directly: <code>val listener = OnPaymentComplete { txn -> ... }</code>?`,
      options: [
        { id: 'opt-a', text: 'Nothing; all 1-method Kotlin interfaces automatically support SAM conversion in Kotlin.' },
        { id: 'opt-b', text: 'Prefix the interface with the "fun" keyword (fun interface OnPaymentComplete { ... }) to declare it as a Functional (SAM) Interface in Kotlin.' },
        { id: 'opt-c', text: 'Use a Java wrapper class.' },
        { id: 'opt-d', text: 'Annotate it with @FunctionalInterface from java.lang.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Kotlin requires the "fun interface" modifier for Kotlin-defined single abstract method interfaces.',
        keyConcept: 'Kotlin Functional (SAM) Interfaces (fun interface)',
        detailed: `While Kotlin automatically performs SAM conversion for interfaces defined in <strong>Java</strong>, interfaces defined in <strong>Kotlin</strong> require the explicit <code>fun interface</code> modifier (introduced in Kotlin 1.4).
Without <code>fun</code>, Kotlin treats it as a standard interface, requiring anonymous object syntax: <code>object : OnPaymentComplete { override fun onComplete(...) }</code>.`,
        realWorldPitfall: 'Forgetting `fun` on Kotlin listener interfaces makes client call sites verbose with `object : ...`.',
        correctAnswerBreakdown: 'Option B accurately identifies the "fun interface" requirement.'
      }
    },

    // DBMS Section
    {
      id: 's11-q9-consecutive-transaction-streak',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Detect 3+ Consecutive Days with Transactions',
      prompt: `Write an SQL query using <code>LAG()</code> and <code>LEAD()</code> or window functions to identify accounts that completed transactions on at least 3 consecutive calendar days.
<br/><br/>
<strong>Return:</strong>
- <code>DISTINCT account_id</code>`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['account_id'],
      validationType: 'consecutive_streak',
      sampleSolution: `WITH daily_activity AS (
    SELECT DISTINCT 
        account_id, 
        date(timestamp) AS txn_date 
    FROM transactions
),
streak_calc AS (
    SELECT 
        account_id,
        txn_date,
        LAG(txn_date, 1) OVER (PARTITION BY account_id ORDER BY txn_date) AS prev_date,
        LEAD(txn_date, 1) OVER (PARTITION BY account_id ORDER BY txn_date) AS next_date
    FROM daily_activity
)
SELECT DISTINCT account_id 
FROM streak_calc 
WHERE julianday(txn_date) - julianday(prev_date) = 1 
  AND julianday(next_date) - julianday(txn_date) = 1;`,
      marks: 10,
      explanation: {
        summary: 'LAG and LEAD compare adjacent chronological dates to find 3 consecutive days.',
        keyConcept: 'Consecutive Streaks with Window Functions',
        detailed: `Comparing <code>prev_date</code> (1 day before) and <code>next_date</code> (1 day after) using <code>julianday()</code> isolates contiguous daily streaks without expensive multi-way self-joins.`,
        realWorldPitfall: 'Not deduplicating multiple transactions on the same day prior to computing streaks.',
        correctAnswerBreakdown: 'Uses CTE with LAG and LEAD to assert consecutive day intervals.'
      }
    },
    {
      id: 's11-q10-running-cumulative-balance',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Running Cumulative Balance per Account',
      prompt: `Compute the chronological running balance for account <code>'ACC-101'</code>.
Credits add to balance; debits subtract from balance.
<br/><br/>
<strong>Return:</strong>
- <code>transaction_id</code>, <code>amount</code>, <code>transaction_type</code>, <code>timestamp</code>, and <code>running_balance</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, transaction_type, timestamp)`,
      expectedColumns: ['transaction_id', 'amount', 'transaction_type', 'timestamp', 'running_balance'],
      validationType: 'running_balance',
      sampleSolution: `SELECT 
    transaction_id,
    amount,
    transaction_type,
    timestamp,
    SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE -amount END) 
        OVER (ORDER BY timestamp, transaction_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_balance
FROM transactions
WHERE account_id = 'ACC-101'
ORDER BY timestamp ASC;`,
      marks: 10,
      explanation: {
        summary: 'Window SUM with CASE WHEN computes signed running balance in chronological order.',
        keyConcept: 'Cumulative Running Balances in Banking',
        detailed: `<code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> computes the cumulative rolling sum. Signing credits positive and debits negative produces the exact account balance at any point in history.`,
        realWorldPitfall: 'Using RANGE instead of ROWS can combine duplicate timestamps into a single window frame sum.',
        correctAnswerBreakdown: 'Option uses window SUM with CASE WHEN.'
      }
    },
    {
      id: 's11-q11-unmatched-accounts-anti-join',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Anti-Join for Dormant Accounts (Zero Transactions)',
      prompt: `Find all customer accounts that have never performed any transactions.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>customer_name</code>, <code>balance</code>.`,
      schemaContext: `Tables: accounts (account_id, customer_name, balance), transactions (transaction_id, account_id, amount)`,
      expectedColumns: ['account_id', 'customer_name', 'balance'],
      validationType: 'dormant_accounts_antijoin',
      sampleSolution: `SELECT 
    a.account_id,
    a.customer_name,
    a.balance
FROM accounts a
LEFT JOIN transactions t ON a.account_id = t.account_id
WHERE t.transaction_id IS NULL;`,
      marks: 10,
      explanation: {
        summary: 'LEFT JOIN ... WHERE right.key IS NULL is the canonical, efficient SQL anti-join.',
        keyConcept: 'Anti-Join for Unmatched/Orphan Detection',
        detailed: `An anti-join returns rows from the left table that have no matching rows in the right table. The query planner converts this into a Hash Anti-Join or Merge Anti-Join, which is much faster than <code>NOT IN (SELECT ...)</code> when null values are present.`,
        realWorldPitfall: 'Using `WHERE id NOT IN (SELECT id FROM ...)`: if any row in the subquery is NULL, NOT IN evaluates to UNKNOWN and returns 0 rows.',
        correctAnswerBreakdown: 'LEFT JOIN with WHERE right.id IS NULL.'
      }
    },
    {
      id: 's11-q12-transaction-tier-breakdown',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Tiered Spending Aggregation with CASE WHEN',
      prompt: `Categorize all completed transactions into three tiers:
- <code>'LOW'</code>: amount < 100
- <code>'MEDIUM'</code>: amount BETWEEN 100 AND 500
- <code>'HIGH'</code>: amount > 500
<br/>
<strong>Return:</strong>
- <code>spending_tier</code>, <code>total_count</code>, <code>total_volume</code>.`,
      schemaContext: `Table: transactions (transaction_id, amount, status)`,
      expectedColumns: ['spending_tier', 'total_count', 'total_volume'],
      validationType: 'tiered_spending_breakdown',
      sampleSolution: `SELECT 
    CASE 
        WHEN amount < 100 THEN 'LOW'
        WHEN amount <= 500 THEN 'MEDIUM'
        ELSE 'HIGH'
    END AS spending_tier,
    COUNT(*) AS total_count,
    ROUND(SUM(amount), 2) AS total_volume
FROM transactions
WHERE status = 'COMPLETED'
GROUP BY spending_tier
ORDER BY total_volume DESC;`,
      marks: 10,
      explanation: {
        summary: 'CASE expression in SELECT and GROUP BY classifies records into business categories.',
        keyConcept: 'Conditional Grouping & Bucket Analysis',
        detailed: `Bucketing financial data with CASE WHEN enables histogram generation and risk segmentation inside the database without loading all rows into mobile RAM.`,
        realWorldPitfall: 'Overlapping condition boundaries in CASE expressions.',
        correctAnswerBreakdown: 'Accurately partitions amounts into LOW, MEDIUM, HIGH buckets.'
      }
    },
    {
      id: 's11-q13-partial-index-failed-txns',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Partial Index DDL for Failed Transaction Audits',
      prompt: `99% of transactions in the database have status <code>'COMPLETED'</code>. Only 1% are <code>'FAILED'</code>.
Write SQLite DDL to create an efficient <strong>Partial Index</strong> on <code>(account_id, timestamp)</code> indexed <strong>ONLY</strong> for rows where <code>status = 'FAILED'</code>.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, status, timestamp)`,
      expectedColumns: ['query_status'],
      validationType: 'partial_index_ddl',
      sampleSolution: `CREATE INDEX idx_failed_txns 
ON transactions(account_id, timestamp) 
WHERE status = 'FAILED';`,
      marks: 10,
      explanation: {
        summary: 'Partial indexes index only a subset of table rows matching a WHERE predicate, saving 99% index storage.',
        keyConcept: 'SQLite Partial Indexes for Sparse States',
        detailed: `In SQLite and PostgreSQL, partial indexes include a <code>WHERE</code> clause. Instead of indexing millions of successful transactions, the B-Tree only contains the 1% failed records. This saves flash storage, speeds up inserts, and makes fraud audit queries instantaneous.`,
        realWorldPitfall: 'Indexing the entire table for a flag that is 99% homogeneous bloats database size unnecessarily.',
        correctAnswerBreakdown: 'CREATE INDEX ... WHERE status = \'FAILED\'.'
      }
    },

    // DSA Coding Section
    {
      id: 's11-q14-product-array-except-self',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: Product of Array Except Self without Division in O(N)',
      prompt: `Given an integer array <code>nums</code> of size $N$, return an array <code>output</code> such that <code>output[i]</code> is equal to the product of all elements of <code>nums</code> except <code>nums[i]</code>.
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in $O(N)$ time.
- <strong>You CANNOT use the division operator <code>/</code></strong> (due to potential zeroes and numerical precision).
- Auxiliary space must be $O(1)$ (the output array does not count as extra space).
- $2 \le N \le 10^5$, $-30 \le nums[i] \le 30$.
- The product of any prefix or suffix is guaranteed to fit in a 32-bit integer.
<br/><br/>
<strong>Input Format:</strong>
Line 1: $N$<br/>
Line 2: $N$ space-separated integers.<br/>
<strong>Output Format:</strong>
$N$ space-separated integers representing the output array.`,
      difficulty: 'Medium-Hard',
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
        if (line == null || line.trim().isEmpty()) return;
        
        int n = Integer.parseInt(line.trim());
        int[] nums = new int[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            nums[i] = Integer.parseInt(st.nextToken());
        }
        
        int[] result = productExceptSelf(nums);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(result[i]).append(i == n - 1 ? "" : " ");
        }
        System.out.println(sb.toString());
    }

    public static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] output = new int[n];
        
        // Step 1: Calculate prefix products directly into output array
        output[0] = 1;
        for (int i = 1; i < n; i++) {
            output[i] = output[i - 1] * nums[i - 1];
        }
        
        // Step 2: Traverse from right, multiplying suffix product on the fly
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            output[i] = output[i] * right;
            right *= nums[i];
        }
        
        return output;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: '4\n1 2 3 4',
          expectedOutput: '24 12 8 6',
          isSample: true
        },
        {
          id: 'tc-2',
          input: '5\n-1 1 0 -3 3',
          expectedOutput: '0 0 9 0 0',
          isSample: true
        },
        {
          id: 'tc-3',
          input: '2\n0 0',
          expectedOutput: '0 0',
          isSample: false
        },
        {
          id: 'tc-4',
          input: '3\n5 10 2',
          expectedOutput: '20 10 50',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Compute prefix products in the output array in pass 1, then accumulate suffix products in variable R in pass 2.',
        keyConcept: 'Prefix & Suffix Decomposition in O(1) Extra Space',
        detailed: `For each index $i$, the result is:
$$\\text{output}[i] = \\prod_{j < i} \\text{nums}[j] \\times \\prod_{j > i} \\text{nums}[j]$$
1. First pass (left-to-right): Fill <code>output[i]</code> with the running product of all elements to the left of $i$.
2. Second pass (right-to-left): Maintain a single integer <code>right = 1</code> representing the product of elements to the right. Multiply <code>output[i] *= right</code>, then update <code>right *= nums[i]</code>.
Total time is $O(N)$ with two linear scans and zero auxiliary arrays.`,
        realWorldPitfall: 'Using division: if nums contains multiple zeroes, dividing by zero causes ArithmeticException or incorrect values.',
        correctAnswerBreakdown: 'O(N) time with O(1) auxiliary space (output array does not count as extra space per problem definition).'
      }
    },

    // Complete App Architecture Section
    {
      id: 's11-q15-java-singleton-to-kotlin-hilt',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: Migrating Legacy Java Double-Checked Locking Singleton to Modern Kotlin Hilt',
      prompt: `Migrate a legacy Java banking network client using Double-Checked Locking (DCL) into a modern, thread-safe Kotlin implementation injected via Hilt.
Demonstrate:
1. Identifying flaws in Java DCL (missing volatile keyword breaking cache coherence).
2. Clean Kotlin <code>object</code> or Hilt <code>@Singleton</code> with coroutine interceptors.
3. Thread-safe biometric token rotation.`,
      marks: 40,
      evaluationCriteria: [
        'Explains why volatile is required in Java Double-Checked Locking to prevent instruction reordering',
        'Implements idiomatic Kotlin object / companion lazy initialization',
        'Demonstrates Hilt @Module with @Provides @Singleton',
        'Includes Coroutine suspend token refresh with non-blocking Mutex'
      ],
      sampleSolution: `// 1. Legacy Java Problem:
// Without 'volatile', JVM instruction reordering can publish a half-initialized instance:
// Memory allocated -> Reference assigned to sInstance -> Constructor runs (Thread B sees non-null half-built object!)

// 2. Modern Kotlin + Hilt Solution:
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor
    ): OkHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .connectTimeout(15, TimeUnit.SECONDS)
        .build()
}

@Singleton
class AuthTokenManager @Inject constructor() {
    private val mutex = Mutex()
    private var cachedToken: String? = null

    suspend fun getValidToken(): String = mutex.withLock {
        cachedToken ?: fetchNewTokenFromKeystore().also { cachedToken = it }
    }

    private suspend fun fetchNewTokenFromKeystore(): String = withContext(Dispatchers.IO) {
        // Hardware-backed Keystore biometric retrieval
        "JWT-SECURE-TOKEN-" + System.currentTimeMillis()
    }
}`,
      explanation: {
        summary: 'Kotlin Hilt eliminates manual DCL singletons, offering thread-safe dependency injection and clean lifecycle scoping.',
        keyConcept: 'Java DCL Memory Model vs Modern Hilt Scoping',
        detailed: `In legacy Java:
<code>if (instance == null) { synchronized(Lock.class) { if (instance == null) instance = new MySingleton(); } }</code>
fails without <code>volatile</code> because compilers and CPU caches reorder memory allocation before constructor completion.
Kotlin object declarations are compiled to thread-safe static initialization guaranteed by the JVM classloader, and Hilt manages singleton lifecycles safely.`,
        realWorldPitfall: 'Writing manual singletons in Kotlin instead of using Hilt / Koin leads to tight coupling and impossible unit testing.',
        correctAnswerBreakdown: 'Hilt @Singleton with non-blocking Coroutine Mutex for token refresh.'
      }
    }
  ]
};
