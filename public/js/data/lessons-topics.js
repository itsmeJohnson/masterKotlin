/* ==========================================================================
   Priority 1: Comprehensive Topics Dataset
   Complete 16-step teaching sequence for all core curriculum modules.
   ========================================================================== */

export const CURRICULUM_TOPIC_LESSONS = {
  'lesson-kotlin-types-null-safety': {
    id: 'lesson-kotlin-types-null-safety',
    title: 'Null Safety, Smart Casts & Type System',
    category: 'Kotlin Fundamentals',
    difficulty: 'Beginner',
    timeEstimate: '20 min',
    visualizerSample: 'val name: String? = null',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>In Kotlin, the type system distinguishes between references that can hold <code>null</code> (nullable references) and those that cannot (non-nullable references). This completely eliminates the notorious <code>NullPointerException</code> (NPE) at compile time rather than crashing in production.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>In banking systems (such as Tesco Bank or Barclays), unhandled null pointers during payment processing or balance retrieval cause immediate mobile app crashes, customer frustration, and regulatory audit penalties. Kotlin forces engineers to handle missing values explicitly.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Think of an envelope. A non-nullable type <code>String</code> is guaranteed to be a solid envelope that contains a paper letter. A nullable type <code>String?</code> is a translucent envelope that might contain a letter or might be completely empty. Before reading, you must verify whether it is empty or use a safe opener.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// Non-nullable type: cannot be assigned null
var name: String = "Alice"
// name = null // COMPILATION ERROR!

// Nullable type with question mark (?)
var address: String? = null

// Safe call operator (?.)
val len: Int? = address?.length

// Elvis operator (?:) - default fallback value
val safeLength: Int = address?.length ?: 0

// Safe cast operator (as?)
val num: Int? = (address as? Int)

// Smart cast using 'is'
if (address != null) {
    println(address.length) // Auto-smart-cast to non-null String
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun getAccountCity(customerAddress: String?): String {
    return customerAddress?.trim()?.takeIf { it.isNotEmpty() } ?: "Unknown City"
}

fun main() {
    println(getAccountCity("London")) // "London"
    println(getAccountCity(null))     // "Unknown City"
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>customerAddress: String?</code>: Accepts either a valid String or null.</li>
          <li><code>customerAddress?.trim()</code>: Safely trims whitespace only if address is non-null.</li>
          <li><code>takeIf { it.isNotEmpty() }</code>: Returns null if the trimmed string is blank.</li>
          <li><code>?: "Unknown City"</code>: If any prior chained call produced null, supply the fallback.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Kotlin’s null safety is enforced at <strong>compile time</strong> without allocating extra wrapper objects, resulting in zero runtime memory overhead compared to Java Optional.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Value Progression',
        content: '<p>When <code>customerAddress = null</code>, the JVM evaluates <code>customerAddress?.trim()</code>, immediately bypasses the method call, and proceeds to evaluate the Elvis operator default.</p>'
      },
      {
        stepNumber: 9,
        title: 'Conditionals & Smart Casting',
        content: `<p>Kotlin performs <strong>Smart Casting</strong>. When an <code>is</code> check or null check succeeds, the compiler automatically casts the reference to the verified non-nullable type within that scope:</p><pre><code class="kotlin">fun printLength(obj: Any) {
    if (obj is String) {
        println(obj.length) // Smart-cast: no explicit cast needed
    }
}</code></pre>`
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>Trace with <code>null</code>: <code>null?.trim()</code> -> <code>null</code> -> <code>?: "Unknown City"</code> -> yields <code>"Unknown City"</code>.<br/>Trace with <code>" Edinburgh "</code>: <code>" Edinburgh "?.trim()</code> -> <code>"Edinburgh"</code> -> <code>?: "Unknown City"</code> is skipped -> yields <code>"Edinburgh"</code>.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Predictable string return without throwing <code>NullPointerException</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Senior Anti-Patterns',
        content: '<p><strong>AVP Warning:</strong> Never use the double-bang operator (<code>!!</code>) in production code! In mobile banking, code like <code>val id = response.user!!.id</code> will immediately crash if an API field is omitted. Always use <code>?: return</code>, <code>?: throw SpecificDomainException()</code>, or safe calls.</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Auxiliary Space Complexity',
        content: '<p><strong>Time Complexity:</strong> <code>O(1)</code> constant time for null checks.<br/><strong>Auxiliary Space:</strong> <code>O(1)</code> space with zero garbage-collection overhead.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Write a Kotlin function <code>parseUserAge(input: String?): Int</code> that safely trims the string, converts it to an Int using <code>toIntOrNull()</code>, verifies that the age is between 18 and 120, and returns <code>-1</code> if null, non-numeric, or out of bounds.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Use safe call chaining: <code>input?.trim()?.toIntOrNull()?.takeIf { it in 18..120 } ?: -1</code>.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Refactor a Java method containing multiple nested <code>if (a != null && a.getB() != null)</code> checks into idiomatic Kotlin using <code>let</code>, <code>?.</code>, and <code>?:</code>.</p>'
      }
    ]
  },

  'lesson-kotlin-oop-data-classes': {
    id: 'lesson-kotlin-oop-data-classes',
    title: 'Classes, Data Classes & Collections',
    category: 'Kotlin Fundamentals',
    difficulty: 'Easy',
    timeEstimate: '25 min',
    visualizerSample: 'data class Account(val id: String, val balance: Double)',
    problemId: 'ex-two-sum',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>A <strong>class</strong> is a blueprint for creating objects that combine data and behavior. A <strong>data class</strong> in Kotlin is a specialized class designed specifically to hold data, where the compiler automatically generates utility functions: <code>equals()</code>, <code>hashCode()</code>, <code>toString()</code>, <code>copy()</code>, and component destructuring functions.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>In financial systems, you model accounts, transactions, currency amounts, and audit logs. Using plain classes without consistent value equality causes bugs where two distinct instances with identical account IDs and balances fail hash-set lookups or equality comparisons.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Think of an official printed bank statement. If two customers hold statements showing identical account numbers, timestamps, and balance figures, the contents represent the exact same financial snapshot. A data class guarantees value-based identity rather than memory-address identity.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// Concise primary constructor with immutability
data class BankAccount(
    val accountId: String,
    val sortCode: String,
    val balancePence: Long
)

// Immutable List vs MutableList
val readOnlyAccounts: List<BankAccount> = listOf(...)
val mutableList = mutableListOf<BankAccount>()

// Data class copy: non-destructive mutation
val updatedAccount = currentAccount.copy(balancePence = currentAccount.balancePence + 5000)

// Destructuring declarations
val (id, sort, bal) = updatedAccount</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">data class Transaction(val id: String, val amount: Double)

fun main() {
    val tx1 = Transaction("TX-100", 250.0)
    val tx2 = Transaction("TX-100", 250.0)

    println(tx1 == tx2) // true! Structural equality via auto-generated equals()
    println(tx1)        // Transaction(id=TX-100, amount=250.0) via auto-generated toString()

    val credited = tx1.copy(amount = tx1.amount + 50.0)
    println(credited)   // Transaction(id=TX-100, amount=300.0)
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>data class Transaction(...)</code>: Instructs kotlinc to generate structural equality methods.</li>
          <li><code>tx1 == tx2</code>: Calls <code>tx1.equals(tx2)</code> under the hood, comparing member values.</li>
          <li><code>tx1.copy(...)</code>: Creates a new immutable instance with selected fields modified.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Data class properties declared in the primary constructor are stored as private fields with public getters. They should always be declared as <code>val</code> to guarantee thread safety and prevent hash code corruption inside HashMaps or HashSets.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>When placed in a <code>HashSet</code>, <code>tx1.hashCode()</code> is computed from its properties. Because properties are immutable, the hash code never mutates, guaranteeing <code>O(1)</code> lookup integrity.</p>'
      },
      {
        stepNumber: 9,
        title: 'Collection Transformations',
        content: `<pre><code class="kotlin">val highValueTxs = transactions
    .filter { it.amount > 1000.0 }
    .map { it.id }
    .toSet()

val groupedByCurrency = transactions.groupBy { it.currency }</code></pre>`
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>List of 3 transactions -> <code>filter { it.amount > 100 }</code> keeps 2 items -> <code>map { it.id }</code> produces <code>["TX-1", "TX-3"]</code>.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Pure immutable list or set containing transformed domain models.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Common Mistakes',
        content: '<p><strong>Trap:</strong> Placing mutable properties (<code>var</code>) or mutable collections (e.g. <code>ArrayList</code>) inside a data class. If an element mutates after being added to a <code>HashSet</code>, its hash code changes, making it permanently unfindable in the set!</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><code>copy()</code> takes <code>O(1)</code> time and space. Collection pipelines take <code>O(N)</code> time; use <code>asSequence()</code> for large collections to avoid intermediate list allocations.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Define a <code>data class PaymentRecord(val txId: String, val userId: String, val amount: Long)</code>. Write a function <code>findTopSpender(payments: List<PaymentRecord>): String?</code> that groups payments by <code>userId</code> and returns the user with the highest total amount.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Use <code>payments.groupBy { it.userId }.mapValues { entry -> entry.value.sumOf { it.amount } }.maxByOrNull { it.value }?.key</code>.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Implement a custom comparator for a <code>List<BankAccount></code> that sorts primarily by descending balance, and secondarily by ascending accountId string.</p>'
      }
    ]
  },

  'lesson-kotlin-stdin-stdout': {
    id: 'lesson-kotlin-stdin-stdout',
    title: 'HackerEarth Stdin/Stdout & I/O Parsing',
    category: 'Kotlin Fundamentals',
    difficulty: 'Easy',
    timeEstimate: '15 min',
    visualizerSample: 'Scanner vs BufferedReader',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>In coding assessment platforms like HackerEarth, HackerRank, and LeetCode, input data is supplied via standard input (<strong>stdin</strong>) and your solution must print answers to standard output (<strong>stdout</strong>). Fast I/O ensures your solution does not exceed strict platform time limits (TLE).</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Using slow I/O methods like Java’s <code>Scanner</code> on inputs with <code>10^5</code> integers can consume over 1.5 seconds just reading input, causing an immediate Time Limit Exceeded (TLE) verdict even if your algorithm is optimal <code>O(n)</code>.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Think of transferring water with a teaspoon (<code>Scanner</code> reading one token at a time) versus a wide pipe (<code>BufferedReader</code> fetching an 8KB memory chunk at once).</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.StringTokenizer

// Modern Kotlin 1.6+ Stdin
val line = readlnOrNull() // reads one line safely

// High-speed Competitive Programming Template
val reader = BufferedReader(InputStreamReader(System.\`in\`))
var tokenizer: StringTokenizer? = null

fun nextToken(): String {
    while (tokenizer == null || !tokenizer!!.hasMoreTokens()) {
        val l = reader.readLine() ?: return ""
        tokenizer = StringTokenizer(l)
    }
    return tokenizer!!.nextToken()
}

fun nextInt(): Int = nextToken().toInt()</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val n = readln().trim().toInt()
    val numbers = readln().trim().split(" ").map { it.toInt() }
    val sum = numbers.sum()
    println(sum)
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>readln()</code>: Reads the next line from standard input.</li>
          <li><code>trim()</code>: Removes trailing newlines or whitespace.</li>
          <li><code>split(" ")</code>: Splits on single space delimiter into tokens.</li>
          <li><code>map { it.toInt() }</code>: Converts string tokens to integers.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p><code>BufferedReader</code> buffers 8192 characters in memory, avoiding hundreds of thousands of low-level native OS read system calls.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>Lines are read into memory buffers sequentially until EOF (end-of-file) is reached.</p>'
      },
      {
        stepNumber: 9,
        title: 'Handling Multiple Test Cases',
        content: `<pre><code class="kotlin">fun main() {
    val t = readln().trim().toInt()
    repeat(t) {
        val s = readln().trim()
        val ans = solve(s)
        println(ans)
    }
}</code></pre>`
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>Input:<br/><code>3<br/>10 20 30</code><br/>First line reads <code>3</code>. Second line splits into <code>[10, 20, 30]</code>. Sum is <code>60</code>.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Prints <code>60</code> followed by newline to stdout.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Common Mistakes',
        content: '<p><strong>Trap:</strong> Trailing blank lines or multiple spaces between integers. Always handle empty tokens or use <code>StringTokenizer</code> which naturally ignores contiguous whitespace.</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><code>BufferedReader</code> reads <code>N</code> numbers in <code>O(N)</code> time with <code>O(1)</code> buffer space.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Write a complete HackerEarth solution that reads an integer $T$ test cases, where each test case consists of a string $S$. Print <code>YES</code> if $S$ is a palindrome, or <code>NO</code> otherwise.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Compare two pointers: <code>var l = 0; var r = s.length - 1; while (l &lt; r) { if (s[l++] != s[r--]) return "NO" }; return "YES"</code>.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Write a fast parser for an array of 500,000 integers using <code>BufferedReader</code> and calculate its prefix sum array without creating unnecessary intermediate string arrays.</p>'
      }
    ]
  },

  'lesson-strings-reverse-palindrome': {
    id: 'lesson-strings-reverse-palindrome',
    title: 'Strings: Reversal, Palindromes & Anagrams',
    category: 'Strings',
    difficulty: 'Easy',
    timeEstimate: '30 min',
    visualizerSample: 'racecar',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>A <strong>palindrome</strong> reads the exact same forward and backward (e.g. "racecar"). Two strings are <strong>anagrams</strong> if they contain the exact same characters with identical frequencies in any order (e.g. "listen" and "silent").</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>These are the fundamental two-pointer and frequency-counting patterns used in data validation, token comparison, and algorithmic screening at every tier-1 company.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Checking an anagram is like checking whether two scrabble bags contain the exact same wooden letters. Checking a palindrome is like two inspectors walking from opposite ends of a bridge toward the center, verifying each pair of pillars matches.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// Two-pointer palindrome check: O(n) time, O(1) space
fun isPalindrome(s: String): Boolean {
    var left = 0
    var right = s.length - 1
    while (left &lt; right) {
        if (s[left] != s[right]) return false
        left++
        right--
    }
    return true
}

// Anagram verification via frequency array: O(n) time, O(1) auxiliary space
fun isAnagram(s: String, t: String): Boolean {
    if (s.length != t.length) return false
    val counts = IntArray(26)
    for (i in s.indices) {
        counts[s[i] - 'a']++
        counts[t[i] - 'a']--
    }
    return counts.all { it == 0 }
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    println(isPalindrome("radar"))      // true
    println(isAnagram("anagram", "nagaram")) // true
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>counts[s[i] - 'a']++</code>: Maps character 'a'..'z' to integer indices 0..25.</li>
          <li><code>counts[t[i] - 'a']--</code>: Decrements count for matching character.</li>
          <li><code>counts.all { it == 0 }</code>: If all 26 buckets are zero, characters matched perfectly.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>The <code>IntArray(26)</code> occupies exactly 26 integer slots (104 bytes), which is strictly <code>O(1)</code> space regardless of how long the input strings are.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>At each step, <code>left</code> increments and <code>right</code> decrements until they cross at the midpoint <code>left >= right</code>.</p>'
      },
      {
        stepNumber: 9,
        title: 'Handling Case & Non-Alphanumeric',
        content: `<pre><code class="kotlin">while (left &lt; right &amp;&amp; !s[left].isLetterOrDigit()) left++
while (left &lt; right &amp;&amp; !s[right].isLetterOrDigit()) right--
if (s[left].lowercaseChar() != s[right].lowercaseChar()) return false</code></pre>`
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>String "racecar":<br/>left=0 (\'r\'), right=6 (\'r\') -> match.<br/>left=1 (\'a\'), right=5 (\'a\') -> match.<br/>left=2 (\'c\'), right=4 (\'c\') -> match.<br/>left=3, right=3 -> loop terminates. Returns true.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Boolean <code>true</code> or <code>false</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Common Mistakes',
        content: '<p><strong>Trap:</strong> Using <code>s.reversed() == s</code> in interview assessments. While valid Kotlin, creating a reversed string allocates an entirely new string in memory (<code>O(n)</code> space). Interviewers expect the in-place two-pointer approach.</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(n)</code> linear scan.<br/><strong>Auxiliary Space:</strong> <code>O(1)</code> in-place pointers.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve: <strong>Valid Palindrome II</strong>. Given a string <code>s</code>, return <code>true</code> if the string can be a palindrome after deleting at most one character.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>When a mismatch occurs at <code>s[left] != s[right]</code>, check if either <code>isPalindrome(s, left + 1, right)</code> OR <code>isPalindrome(s, left, right - 1)</code> is true.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Group Anagrams: Given an array of strings, group the anagrams together using a HashMap with sorted strings as keys.</p>'
      }
    ]
  },

  'lesson-arrays-stock-buy-sell': {
    id: 'lesson-arrays-stock-buy-sell',
    title: 'Arrays: Best Time to Buy and Sell Stock',
    category: 'Arrays & Lists',
    difficulty: 'Easy',
    timeEstimate: '20 min',
    visualizerSample: '[7, 1, 5, 3, 6, 4]',
    problemId: 'ex-kadane-array',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>You are given an array of stock prices where <code>prices[i]</code> is the price on day <code>i</code>. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Standard problem at Barclays GSC and Tesco Bank assessing whether an engineer recognizes greedy single-pass linear scans <code>O(n)</code> instead of quadratic nested loops <code>O(n^2)</code>.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Think of traveling through time while recording the cheapest hotel rate you have encountered so far. At each new day, you calculate: <em>"If I had booked at the historical lowest price and sold today, what is my profit?"</em></p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">fun maxProfit(prices: IntArray): Int {
    if (prices.isEmpty()) return 0
    var minPrice = prices[0]
    var maxProfit = 0

    for (i in 1 until prices.size) {
        if (prices[i] &lt; minPrice) {
            minPrice = prices[i]
        } else {
            maxProfit = maxOf(maxProfit, prices[i] - minPrice)
        }
    }
    return maxProfit
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val prices = intArrayOf(7, 1, 5, 3, 6, 4)
    println(maxProfit(prices)) // Output: 5 (Buy at 1, Sell at 6)
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>var minPrice = prices[0]</code>: Tracks the lowest price observed up to today.</li>
          <li><code>prices[i] &lt; minPrice</code>: If today’s price is a new low, update buy candidate.</li>
          <li><code>maxOf(maxProfit, prices[i] - minPrice)</code>: Evaluate selling today versus historic best profit.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Requires exactly two integer registers (<code>minPrice</code>, <code>maxProfit</code>). No dynamic memory allocation.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>For <code>[7, 1, 5, 3, 6, 4]</code>:<br/>Day 0 (7): minPrice=7, profit=0<br/>Day 1 (1): minPrice=1, profit=0<br/>Day 2 (5): profit=max(0, 5-1)=4<br/>Day 3 (3): profit=max(4, 3-1)=4<br/>Day 4 (6): profit=max(4, 6-1)=5<br/>Day 5 (4): profit=max(5, 4-1)=5. Max profit is 5.</p>'
      },
      {
        stepNumber: 9,
        title: 'Conditionals & Order of Operations',
        content: '<p>Notice that we can only sell <strong>after</strong> we buy (future days only). Updating <code>minPrice</code> before computing today\'s profit would allow a sell on the same day with 0 profit, which is naturally safe.</p>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>Input: <code>[7, 6, 4, 3, 1]</code> (strictly decreasing). Min price continuously drops from 7 to 1. No positive profit is ever made. Final answer is correctly <code>0</code>.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Returns integer <code>5</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Pitfalls',
        content: '<p><strong>Edge cases:</strong> Array with 0 or 1 elements (return 0), strictly decreasing prices (return 0), identical prices (return 0).</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Auxiliary Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(n)</code> single pass.<br/><strong>Auxiliary Space:</strong> <code>O(1)</code> space.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve <strong>Best Time to Buy and Sell Stock II</strong>: You may complete as many transactions as you like (i.e. buy one and sell one multiple times). Return the maximum profit.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Greedy approach: Whenever <code>prices[i] &gt; prices[i - 1]</code>, add the difference to total profit!</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve <strong>Maximum Subarray (Kadane\'s Algorithm)</strong> to see the exact mathematical equivalence between cumulative profit diffs and subarray sums.</p>'
      }
    ]
  },

  'lesson-hashmaps-group-anagrams': {
    id: 'lesson-hashmaps-group-anagrams',
    title: 'HashMaps: Group Anagrams & Longest Consecutive',
    category: 'HashMaps & Sets',
    difficulty: 'Medium',
    timeEstimate: '30 min',
    visualizerSample: '["eat","tea","tan","ate","nat","bat"]',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>Given an array of strings, group the anagrams together. Anagrams are words formed by rearranging the letters of another word, meaning when sorted or counted, they produce the identical key signature.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Tests HashMap key modeling and canonical data representation. Instead of comparing all pairs in <code>O(N^2 * K)</code>, hashing canonical keys achieves <code>O(N * K log K)</code> or <code>O(N * K)</code>.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Think of sorting coins into buckets. Regardless of which order coins arrive, a bucket labeled "1 Dime, 2 Nickels" collects all identical currency sets.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">fun groupAnagrams(strs: Array<String>): List<List<String>> {
    val map = HashMap<String, MutableList<String>>()

    for (s in strs) {
        // Canonical sorted key
        val key = String(s.toCharArray().apply { sort() })
        map.getOrPut(key) { mutableListOf() }.add(s)
    }

    return map.values.toList()
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val words = arrayOf("eat", "tea", "tan", "ate", "nat", "bat")
    println(groupAnagrams(words))
    // Output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>s.toCharArray().apply { sort() }</code>: Sorts characters to create the canonical signature (e.g. "eat" -> "aet").</li>
          <li><code>map.getOrPut(key) { mutableListOf() }</code>: Idiomatic Kotlin: retrieves the list or instantiates a new list if key is missing.</li>
          <li><code>.add(s)</code>: Appends original word to the anagram group.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>The HashMap stores string keys and references to mutable lists of strings. Total heap space equals the number of characters in the input.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>"eat" maps to key "aet" -> group=["eat"]<br/>"tea" maps to key "aet" -> group=["eat", "tea"]<br/>"tan" maps to key "aet" -> group=["tan"]<br/>"ate" maps to key "aet" -> group=["eat", "tea", "ate"]</p>'
      },
      {
        stepNumber: 9,
        title: 'Alternative: 26-Count Tuple Keys',
        content: '<p>For strings of length $K \gg 26$, building a 26-integer count signature <code>#1#0#0...#1</code> avoids the $O(K \log K)$ sort, reducing time to pure $O(N \cdot K)$.</p>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>All anagrams of "ate" cluster under key "aet". Words with unique signatures like "bat" form singleton lists.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>A list of lists of strings: <code>[["eat","tea","ate"],["tan","nat"],["bat"]]</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Pitfalls',
        content: '<p>Empty input array (return empty list), array containing empty strings <code>[""]</code> (valid anagrams of each other), single-character strings.</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(N * K log K)</code> where $N$ is word count and $K$ is max word length.<br/><strong>Auxiliary Space:</strong> <code>O(N * K)</code> to store hash table entries.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve: <strong>Longest Consecutive Sequence</strong>. Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence in <code>O(n)</code> time using a <code>HashSet</code>.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Add all numbers to a <code>HashSet</code>. Only start counting sequence length if <code>!set.contains(num - 1)</code> (meaning <code>num</code> is the beginning of a streak!).</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Implement an anagram group solver that processes a continuous stream of strings using <code>Flow</code> or reactive channels.</p>'
      }
    ]
  },

  'lesson-sorting-algorithms': {
    id: 'lesson-sorting-algorithms',
    title: 'Sorting: Merge Sort, Quick Sort & Comparators',
    category: 'Sorting',
    difficulty: 'Medium',
    timeEstimate: '35 min',
    visualizerSample: 'MergeSort [38, 27, 43, 3, 9, 82, 10]',
    problemId: 'ex-kadane-array',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p><strong>Sorting</strong> arranges elements in a specified order (ascending or descending). <strong>Merge Sort</strong> divides the array in half recursively and merges the sorted halves in linear time. <strong>Quick Sort</strong> picks a pivot element and partitions elements smaller to the left and larger to the right.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Sorting transforms chaotic input into ordered data, enabling <code>O(log n)</code> binary search and two-pointer convergence. In banking apps, sorting transaction histories stably preserves timestamp precedence for identical currency amounts.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Think of sorting playing cards. Divide a deck into two equal piles, sort each pile, then take the smaller top card from either pile to form the final sorted deck (Merge Sort).</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// Standard library idiomatic sorting
val sortedList = list.sorted() // returns new sorted list
mutableList.sort()             // in-place sort

// Multi-field comparator
data class Order(val priority: Int, val timestamp: Long)
val comparator = compareBy<Order> { it.priority }.thenByDescending { it.timestamp }
orders.sortWith(comparator)

// Merge Sort Implementation
fun mergeSort(arr: IntArray, left: Int, right: Int) {
    if (left < right) {
        val mid = left + (right - left) / 2
        mergeSort(arr, left, mid)
        mergeSort(arr, mid + 1, right)
        merge(arr, left, mid, right)
    }
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val nums = intArrayOf(5, 2, 8, 1, 9)
    nums.sort()
    println(nums.joinToString()) // 1, 2, 5, 8, 9
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>val mid = left + (right - left) / 2</code>: Prevents integer overflow.</li>
          <li><code>mergeSort(arr, left, mid)</code>: Recursively sorts left subarray.</li>
          <li><code>merge(arr, left, mid, right)</code>: Merges two sorted subarrays into temporary buffer.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Merge Sort requires <code>O(n)</code> auxiliary space for merging. Quick Sort operates in-place with <code>O(log n)</code> call-stack space.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>Divide depth is $\log_2(N)$. At each level of recursion, $N$ elements are compared and copied.</p>'
      },
      {
        stepNumber: 9,
        title: 'Stability & Trade-Offs',
        content: '<p><strong>Stable Sort:</strong> Preserves the relative order of records with equal keys. Merge Sort and Kotlin’s <code>sorted()</code> (Timsort) are stable. Quick Sort is typically unstable.</p>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p><code>[4, 2, 1, 3]</code> -> split to <code>[4, 2]</code> and <code>[1, 3]</code> -> sort to <code>[2, 4]</code> and <code>[1, 3]</code> -> merge to <code>[1, 2, 3, 4]</code>.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Sorted array: <code>[1, 2, 3, 4]</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Mistakes',
        content: '<p>Worst case in Quick Sort occurs when array is already sorted and pivot is always chosen as first/last element ($O(N^2)$). Always use randomized pivots or dual-pivot.</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Merge Sort:</strong> <code>O(n log n)</code> time (best, avg, worst), <code>O(n)</code> auxiliary space.<br/><strong>Quick Sort:</strong> <code>O(n log n)</code> avg time, <code>O(log n)</code> space.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Given an array of strings, sort them such that strings with equal length preserve their original input order, but longer strings appear first.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Use stable sort: <code>strs.sortedByDescending { it.length }</code>.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve: <strong>Kth Largest Element in an Array</strong> using Quickselect algorithm in average <code>O(n)</code> time.</p>'
      }
    ]
  },

  'lesson-two-pointers-patterns': {
    id: 'lesson-two-pointers-patterns',
    title: 'Two Pointers: Sorted Pairs, 3-Sum & Cycle Detect',
    category: 'Two Pointers',
    difficulty: 'Medium',
    timeEstimate: '30 min',
    visualizerSample: 'Left & Right Pointer Convergence',
    problemId: 'ex-two-sum',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>The <strong>Two Pointers</strong> pattern uses two index variables to traverse a sequence either toward each other (from both ends), in the same direction at different speeds (fast and slow pointers), or across two separate arrays.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Replaces <code>O(n^2)</code> quadratic loops with <code>O(n)</code> linear scans while consuming strictly <code>O(1)</code> space. Essential for cycle detection in linked lists and sorted pair sum queries.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Fast & Slow pointers (Floyd’s algorithm): Think of two runners on a circular running track. The fast runner laps the slow runner if and only if the track forms a closed loop!</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// 1. Two Sum in Sorted Array
fun twoSumSorted(numbers: IntArray, target: Int): IntArray {
    var left = 0
    var right = numbers.size - 1
    while (left < right) {
        val sum = numbers[left] + numbers[right]
        when {
            sum == target -> return intArrayOf(left + 1, right + 1)
            sum < target -> left++
            else -> right--
        }
    }
    return intArrayOf()
}

// 2. Floyd's Cycle Detection
class ListNode(var \`val\`: Int, var next: ListNode? = null)
fun hasCycle(head: ListNode?): Boolean {
    var slow = head
    var fast = head
    while (fast?.next != null) {
        slow = slow?.next
        fast = fast.next?.next
        if (slow === fast) return true
    }
    return false
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val sorted = intArrayOf(2, 7, 11, 15)
    val res = twoSumSorted(sorted, 9)
    println(res.joinToString()) // 1, 2
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>val sum = numbers[left] + numbers[right]</code>: Calculates candidate sum.</li>
          <li><code>sum < target -> left++</code>: Sum is too small; increase value by advancing left pointer.</li>
          <li><code>sum > target -> right--</code>: Sum is too large; decrease value by retreating right pointer.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Only two pointer integers are stored on the stack. No heap allocation.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>In every iteration, the distance <code>right - left</code> decreases by at least 1. Maximum loop iterations: $N$.</p>'
      },
      {
        stepNumber: 9,
        title: 'Why It Works (Monotonicity)',
        content: '<p>Because the array is sorted, moving <code>left</code> rightwards is guaranteed to strictly increase the sum, while moving <code>right</code> leftwards is guaranteed to strictly decrease the sum.</p>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p><code>[2, 7, 11, 15]</code>, target=9:<br/>left=0 (2), right=3 (15), sum=17 > 9 -> right=2.<br/>left=0 (2), right=2 (11), sum=13 > 9 -> right=1.<br/>left=0 (2), right=1 (7), sum=9 == 9 -> Match found!</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>1-based indices <code>[1, 2]</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Mistakes',
        content: '<p>Attempting two-pointer convergence on an <strong>unsorted</strong> array. The array MUST be sorted first!</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(n)</code> linear scan.<br/><strong>Auxiliary Space:</strong> <code>O(1)</code> constant space.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve: <strong>3Sum</strong>. Find all unique triplets in the array which gives the sum of zero. Avoid duplicate triplets in the result.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Sort the array. Fix the first number with loop <code>i</code>, then run two-pointer convergence on remaining elements. Skip duplicate numbers with <code>while (nums[i] == nums[i-1]) continue</code>.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve <strong>Container With Most Water</strong>: Given integer array <code>height</code>, find two lines that together with the x-axis form a container that contains the most water.</p>'
      }
    ]
  },

  'lesson-sliding-window-fixed-variable': {
    id: 'lesson-sliding-window-fixed-variable',
    title: 'Sliding Window: Fixed Size vs Dynamic Window',
    category: 'Sliding Window',
    difficulty: 'Medium',
    timeEstimate: '35 min',
    visualizerSample: 'Fixed size k vs dynamic sum >= S',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>A <strong>sliding window</strong> maintains a continuous range of elements defined by <code>left</code> and <code>right</code> boundaries. In <strong>fixed-size</strong> windows, the width is constant $k$. In <strong>dynamic</strong> windows, the window expands rightwards to satisfy a condition and contracts leftwards to optimize or restore validity.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Computes rolling aggregations (moving averages, max subsegment sums, non-repeating substrings) in <code>O(n)</code> instead of recalculating the window from scratch in <code>O(n * k)</code>.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>A moving spotlight on a stage. As the spotlight shifts one actor to the right, you do not turn off the spotlight: you simply add the actor entering from the right and subtract the actor exiting on the left.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// Fixed Size Window of size k
fun maxSumSubarray(arr: IntArray, k: Int): Int {
    var windowSum = 0
    for (i in 0 until k) windowSum += arr[i]
    var maxSum = windowSum

    for (right in k until arr.size) {
        windowSum += arr[right] - arr[right - k] // Add new, drop oldest
        maxSum = maxOf(maxSum, windowSum)
    }
    return maxSum
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val arr = intArrayOf(2, 1, 5, 1, 3, 2)
    println(maxSumSubarray(arr, 3)) // Output: 9 (subarray [5, 1, 3])
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>windowSum += arr[right] - arr[right - k]</code>: Shifts window by adding entry and removing exit in $O(1)$ operations.</li>
          <li><code>maxSum = maxOf(maxSum, windowSum)</code>: Records global optimal window sum so far.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Uses two integer accumulators (<code>windowSum</code>, <code>maxSum</code>). Zero heap allocation.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>Initial window [2, 1, 5] sum = 8.<br/>Slide right: add 1, drop 2 -> [1, 5, 1] sum = 7.<br/>Slide right: add 3, drop 1 -> [5, 1, 3] sum = 9 (new max!).<br/>Slide right: add 2, drop 5 -> [1, 3, 2] sum = 6. Max sum is 9.</p>'
      },
      {
        stepNumber: 9,
        title: 'Dynamic Window Pattern',
        content: '<p>In dynamic windows (e.g. minimum subarray length with sum $\\ge target$), use a while loop inside: <code>while (currentSum >= target) { minLen = minOf(minLen, right - left + 1); currentSum -= arr[left++] }</code>.</p>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>Shows linear expansion of right pointer followed by conditional contractions of left pointer.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Returns maximum integer <code>9</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Mistakes',
        content: '<p>Array size smaller than $k$ (return 0 or error), negative numbers in dynamic window sum problems (sliding window requires monotonic positive sums; with negatives, use prefix sums + HashMap!).</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(n)</code> linear scan.<br/><strong>Auxiliary Space:</strong> <code>O(1)</code> space.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve: <strong>Minimum Size Subarray Sum</strong>. Given an array of positive integers <code>nums</code> and a positive integer <code>target</code>, return the minimal length of a contiguous subarray of which the sum is greater than or equal to <code>target</code>.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Expand <code>right</code> while adding <code>nums[right]</code> to <code>sum</code>. While <code>sum >= target</code>, record <code>minLen = minOf(minLen, right - left + 1)</code> and contract <code>sum -= nums[left++]</code>.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve: <strong>Longest Repeating Character Replacement</strong> using sliding window and frequency map.</p>'
      }
    ]
  },

  'lesson-binary-search-bounds': {
    id: 'lesson-binary-search-bounds',
    title: 'Binary Search: Lower/Upper Bounds & Rotated Array',
    category: 'Binary Search',
    difficulty: 'Medium',
    timeEstimate: '35 min',
    visualizerSample: 'Binary Search on Rotated Array',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p><strong>Binary Search</strong> is a divide-and-conquer algorithm that finds the position of a target value within a sorted array. By comparing the target with the middle element, it eliminates half of the remaining search space at every step.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Reduces search complexity from linear <code>O(n)</code> to logarithmic <code>O(log n)</code>. Searching through 1,000,000 items takes at most 20 comparisons!</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Searching for a word in a physical dictionary. You open to the middle. If the target word comes before the current page alphabetically, you discard the entire right half of the book.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// Overflow-safe binary search
fun binarySearch(nums: IntArray, target: Int): Int {
    var left = 0
    var right = nums.size - 1

    while (left <= right) {
        // Safe midpoint calculation (avoids integer overflow)
        val mid = left + (right - left) / 2
        when {
            nums[mid] == target -> return mid
            nums[mid] < target -> left = mid + 1
            else -> right = mid - 1
        }
    }
    return -1
}

// Lower bound: first index where nums[i] >= target
fun lowerBound(nums: IntArray, target: Int): Int {
    var left = 0
    var right = nums.size
    while (left < right) {
        val mid = left + (right - left) / 2
        if (nums[mid] >= target) right = mid else left = mid + 1
    }
    return left
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val nums = intArrayOf(1, 3, 5, 7, 9, 11)
    println(binarySearch(nums, 7)) // Output: 3 (index 3)
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>val mid = left + (right - left) / 2</code>: Guarantees no 32-bit signed integer overflow when <code>left + right > Int.MAX_VALUE</code>.</li>
          <li><code>nums[mid] < target -> left = mid + 1</code>: Target must be in the right half.</li>
          <li><code>nums[mid] > target -> right = mid - 1</code>: Target must be in the left half.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Uses three local integer registers (<code>left</code>, <code>right</code>, <code>mid</code>). Zero dynamic heap allocations.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>Search range size progression: $N \\rightarrow N/2 \\rightarrow N/4 \\rightarrow \\dots \\rightarrow 1$. Maximum iterations: $\\lfloor\\log_2 N\\rfloor + 1$.</p>'
      },
      {
        stepNumber: 9,
        title: 'Search in Rotated Sorted Array',
        content: '<p>Even in a rotated array (e.g. <code>[4, 5, 6, 7, 0, 1, 2]</code>), one of the two halves (left or right of mid) is <strong>always normally sorted</strong>. Identify which half is sorted, check if target lies within that range, and prune accordingly.</p>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>Array <code>[1, 3, 5, 7, 9, 11]</code>, target=7:<br/>left=0, right=5, mid=2 (5) &lt; 7 -> left=3.<br/>left=3, right=5, mid=4 (9) &gt; 7 -> right=3.<br/>left=3, right=3, mid=3 (7) == 7 -> Return index 3!</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Integer index <code>3</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Mistakes',
        content: '<p>Off-by-one errors with <code>left &lt;= right</code> versus <code>left &lt; right</code>. Use <code>left &lt;= right</code> for standard exact match search; use <code>left &lt; right</code> for boundary condition searches.</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(log n)</code> logarithmic time.<br/><strong>Auxiliary Space:</strong> <code>O(1)</code> space.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve: <strong>Find First and Last Position of Element in Sorted Array</strong>. Return <code>[firstIndex, lastIndex]</code> in <code>O(log n)</code> time.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Run two binary searches: one with lower bound logic (seeking leftmost occurrence), and one with upper bound logic (seeking rightmost occurrence).</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve <strong>Search in Rotated Sorted Array</strong> where elements may contain duplicates.</p>'
      }
    ]
  },

  'lesson-stacks-queues-parens': {
    id: 'lesson-stacks-queues-parens',
    title: 'Stacks & Queues: Balanced Parens & Monotonic Stack',
    category: 'Stacks, Queues & Lists',
    difficulty: 'Medium',
    timeEstimate: '30 min',
    visualizerSample: 'Stack LIFO: ([{}])',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>A <strong>Stack</strong> is a Last-In, First-Out (LIFO) data structure where elements are pushed and popped from the top. A <strong>Queue</strong> is a First-In, First-Out (FIFO) data structure where elements are added at the rear and removed from the front.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Stacks power syntax parsing, undo/redo buffers, balanced bracket validation, and monotonic lookups (e.g. Next Greater Element). Queues power BFS graph traversal, job schedulers, and coroutine dispatchers.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Stack: A spring-loaded stack of cafeteria trays—you can only grab or add the tray on top. Queue: A physical queue of customers waiting at a bank teller.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">import java.util.ArrayDeque

// In modern Kotlin, use ArrayDeque (faster than java.util.Stack)
val stack = ArrayDeque<Char>()

stack.push('(')
val top = stack.peek()
val removed = stack.pop()
val isEmpty = stack.isEmpty()

// Valid Parentheses Algorithm
fun isValid(s: String): Boolean {
    val stack = ArrayDeque<Char>()
    for (ch in s) {
        when (ch) {
            '(', '{', '[' -> stack.push(ch)
            ')' -> if (stack.isEmpty() || stack.pop() != '(') return false
            '}' -> if (stack.isEmpty() || stack.pop() != '{') return false
            ']' -> if (stack.isEmpty() || stack.pop() != '[') return false
        }
    }
    return stack.isEmpty()
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    println(isValid("()[]{}")) // true
    println(isValid("(]"))     // false
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>when (ch)</code>: Evaluates opening versus closing bracket types.</li>
          <li><code>stack.push(ch)</code>: Preserves opening bracket on top of LIFO stack.</li>
          <li><code>stack.isEmpty() || stack.pop() != '('</code>: Detects unexpected closing bracket or mismatched pair.</li>
          <li><code>stack.isEmpty()</code>: Ensures no unmatched opening brackets linger.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p><code>ArrayDeque</code> manages a resizable circular array buffer, avoiding the synchronized overhead of legacy <code>java.util.Stack</code>.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>For <code>"{[()]}"</code>: push <code>{</code>, push <code>[</code>, push <code>(</code>. When <code>)</code> arrives, pop matches <code>(</code>. When <code>]</code> arrives, pop matches <code>[</code>. When <code>}</code> arrives, pop matches <code>{</code>. Stack is empty -> Valid!</p>'
      },
      {
        stepNumber: 9,
        title: 'Monotonic Stack Pattern',
        content: '<p>A <strong>Monotonic Stack</strong> keeps elements strictly increasing or decreasing. Used to find the <strong>Next Greater Element</strong> in <code>O(n)</code> time: while stack is non-empty and <code>nums[i] > stack.peek()</code>, pop and resolve answers!</p>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>Input <code>"([)]"</code>: push <code>(</code>, push <code>[</code>. Next char is <code>)</code>, but top is <code>[</code> -> mismatch detected, immediately returns false.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Boolean <code>true</code> or <code>false</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Mistakes',
        content: '<p>String with only opening brackets like <code>"((("</code> (must check <code>stack.isEmpty()</code> at the end!), string with only closing brackets like <code>")"</code> (must check <code>stack.isEmpty()</code> before popping!).</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(n)</code> single pass.<br/><strong>Auxiliary Space:</strong> <code>O(n)</code> worst-case stack depth.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Implement a <code>MinStack</code> class that supports <code>push</code>, <code>pop</code>, <code>top</code>, and retrieving the minimum element in <code>O(1)</code> time.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Maintain an auxiliary stack of pairs <code>(val, currentMinSoFar)</code> or a second parallel minStack.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve: <strong>Daily Temperatures</strong> using a Monotonic Stack to find how many days you have to wait until a warmer temperature.</p>'
      }
    ]
  },

  'lesson-recursion-subsets': {
    id: 'lesson-recursion-subsets',
    title: 'Recursion & Backtracking: Subsets & Permutations',
    category: 'Recursion & Backtracking',
    difficulty: 'Medium',
    timeEstimate: '35 min',
    visualizerSample: 'Subsets [1, 2, 3] Decision Tree',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p><strong>Recursion</strong> is a technique where a function solves a problem by calling itself with smaller inputs until reaching a base condition. <strong>Backtracking</strong> explores candidate solutions incrementally, abandoning (backtracking from) paths that fail to meet problem constraints.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Solves combinatorial search problems: generating permutations, subsets, password cracking, pathfinding in mazes, and constraint satisfaction.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Walking through a hedge maze. At every fork in the road, you choose the left path. If you hit a dead end, you retrace your steps back to the fork and try the right path.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// The Universal Backtracking Blueprint:
// Choose -> Explore -> Unchoose (Backtrack)
fun subsets(nums: IntArray): List<List<Int>> {
    val result = mutableListOf<List<Int>>()

    fun backtrack(index: Int, current: MutableList<Int>) {
        result.add(ArrayList(current)) // Capture snapshot

        for (i in index until nums.size) {
            current.add(nums[i])          // 1. Choose
            backtrack(i + 1, current)    // 2. Explore
            current.removeAt(current.size - 1) // 3. Unchoose (backtrack)
        }
    }

    backtrack(0, mutableListOf())
    return result
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val nums = intArrayOf(1, 2)
    println(subsets(nums)) // Output: [[], [1], [1, 2], [2]]
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>result.add(ArrayList(current))</code>: Takes a deep copy of current path (crucial, otherwise later mutations modify saved results!).</li>
          <li><code>current.add(nums[i])</code>: Selects number <code>nums[i]</code>.</li>
          <li><code>current.removeAt(current.size - 1)</code>: Pops the number, restoring state for the next sibling choice.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Each recursive call pushes an activation frame onto the JVM call stack containing <code>index</code> and local registers. Maximum recursion depth is $N$.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>Forms a binary decision tree. For each element $i$, we branch on either including it or excluding it. Total leaves = $2^N$.</p>'
      },
      {
        stepNumber: 9,
        title: 'Base Case Importance',
        content: '<p>Without a valid base case or natural loop termination, recursive functions cause a fatal <code>StackOverflowError</code>.</p>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p><code>[1, 2]</code>:<br/>backtrack(0, []): adds []<br/>-> choose 1: backtrack(1, [1]): adds [1]<br/>-> choose 2: backtrack(2, [1, 2]): adds [1, 2]<br/>-> backtrack, pop 2, pop 1<br/>-> choose 2: backtrack(2, [2]): adds [2].</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>All $2^N$ subsets: <code>[[], [1], [1, 2], [2]]</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Mistakes',
        content: '<p><strong>Senior Bug:</strong> Doing <code>result.add(current)</code> instead of <code>result.add(ArrayList(current))</code>. If you don\'t create a copy, all items in <code>result</code> will point to the same empty list at the end!</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(2^n * n)</code>.<br/><strong>Auxiliary Space:</strong> <code>O(n)</code> call stack depth.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve: <strong>Permutations</strong>. Given an array <code>nums</code> of distinct integers, return all possible permutations in any order.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Use a boolean array <code>used = BooleanArray(nums.size)</code>. In the loop from 0 to N-1, if <code>!used[i]</code>, mark used, recurse, then unmark used.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve <strong>Combination Sum</strong>: Find all unique combinations where candidate numbers sum to target, allowing unlimited reuse of elements.</p>'
      }
    ]
  },

  'lesson-dp-fib-climbing-stairs': {
    id: 'lesson-dp-fib-climbing-stairs',
    title: 'Dynamic Programming: Climbing Stairs & House Robber',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    timeEstimate: '40 min',
    visualizerSample: 'Climbing Stairs DP Table dp[i] = dp[i-1] + dp[i-2]',
    problemId: 'ex-kadane-array',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p><strong>Dynamic Programming (DP)</strong> solves complex problems by breaking them down into simpler <strong>overlapping subproblems</strong>, solving each subproblem once, and storing the answers (memoization or tabulation) to avoid redundant recalculation.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Converts exponential time algorithms <code>O(2^n)</code> into efficient linear <code>O(n)</code> or polynomial <code>O(n^2)</code> solutions. Crucial for financial optimization, resource allocation, and knapsack assessments.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Writing <code>1 + 1 + 1 + 1 + 1</code> on a whiteboard and asking "What is that?" -> 5. Adding another <code>+ 1</code> to the end and asking "What is it now?" You instantly say 6 without recalculating the first five 1s, because you <strong>memorized</strong> the past answer!</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">// Space-Optimized Tabulation: O(n) time, O(1) space
fun climbStairs(n: Int): Int {
    if (n <= 2) return n
    var prev2 = 1 // ways to reach step 1
    var prev1 = 2 // ways to reach step 2

    for (i in 3..n) {
        val current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    }
    return prev1
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    println(climbStairs(5)) // Output: 8 distinct ways
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>if (n <= 2) return n</code>: Base cases (1 step: 1 way, 2 steps: 2 ways).</li>
          <li><code>val current = prev1 + prev2</code>: State recurrence relation $dp[i] = dp[i-1] + dp[i-2]$.</li>
          <li><code>prev2 = prev1; prev1 = current</code>: Shifts state variables forward, eliminating the need for a full array.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Instead of an <code>IntArray(n + 1)</code> taking $O(N)$ heap memory, maintaining <code>prev1</code> and <code>prev2</code> operates in strictly $O(1)$ space.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>Step 3: 2 + 1 = 3<br/>Step 4: 3 + 2 = 5<br/>Step 5: 5 + 3 = 8.</p>'
      },
      {
        stepNumber: 9,
        title: 'The 4 Steps of Every DP Problem',
        content: '<ol><li>Define the state: What does <code>dp[i]</code> represent?</li><li>Formulate the recurrence relation: How does <code>dp[i]</code> derive from earlier states?</li><li>Identify base cases: What are <code>dp[0]</code> and <code>dp[1]</code>?</li><li>Determine computation order and space optimization.</li></ol>'
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>For $n = 4$: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2 -> Exactly 5 distinct combinations.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>Integer <code>8</code> for $n = 5$.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Mistakes',
        content: '<p>Handling $n=1$ and $n=2$ before loop, integer overflow for large $n$ (use modulo $10^9+7$ or Long if required by problem spec).</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(n)</code> linear time.<br/><strong>Auxiliary Space:</strong> <code>O(1)</code> space.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve: <strong>House Robber</strong>. You are a robber planning to rob houses along a street. Each house has money. Adjacent houses have security systems that trigger the police if two adjacent houses are robbed. Find max money you can rob.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Recurrence: <code>dp[i] = maxOf(dp[i-1], dp[i-2] + nums[i])</code>. Either skip house $i$ or rob house $i$ plus max money from house $i-2$.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve: <strong>Coin Change</strong>: Fewest number of coins needed to make up a given amount.</p>'
      }
    ]
  },

  'lesson-trees-graphs-traversals': {
    id: 'lesson-trees-graphs-traversals',
    title: 'Trees & Graphs: BFS, DFS & Shortest Path',
    category: 'Trees & Graphs',
    difficulty: 'Hard',
    timeEstimate: '45 min',
    visualizerSample: 'BFS Level-Order Queue Traversal',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>A <strong>Tree</strong> is a hierarchical connected graph without cycles. A <strong>Graph</strong> consists of vertices (nodes) connected by edges. <strong>BFS (Breadth-First Search)</strong> explores layer by layer using a queue. <strong>DFS (Depth-First Search)</strong> explores as deep as possible along each branch using recursion or a stack.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>BFS guarantees finding the <strong>shortest path</strong> in unweighted graphs (e.g. minimum transfer hops in payments networks). DFS powers topological sorting, dependency resolution in Gradle, and cycle detection.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>BFS: Dropping a pebble into water; ripples expand outward concentric circle by concentric circle. DFS: Exploring a cave tunnel to its very end before turning back to check side caverns.</p>'
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `<pre><code class="kotlin">class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// 1. BFS Level-Order Traversal
fun levelOrder(root: TreeNode?): List<List<Int>> {
    val result = mutableListOf<List<Int>>()
    if (root == null) return result
    val queue = ArrayDeque<TreeNode>()
    queue.add(root)

    while (queue.isNotEmpty()) {
        val levelSize = queue.size
        val currentLevel = mutableListOf<Int>()
        repeat(levelSize) {
            val node = queue.removeFirst()
            currentLevel.add(node.\`val\`)
            node.left?.let { queue.add(it) }
            node.right?.let { queue.add(it) }
        }
        result.add(currentLevel)
    }
    return result
}

// 2. DFS Max Depth
fun maxDepth(root: TreeNode?): Int {
    if (root == null) return 0
    return 1 + maxOf(maxDepth(root.left), maxDepth(root.right))
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Smallest Working Example',
        content: `<pre><code class="kotlin">fun main() {
    val root = TreeNode(3).apply {
        left = TreeNode(9)
        right = TreeNode(20).apply {
            left = TreeNode(15)
            right = TreeNode(7)
        }
    }
    println(levelOrder(root)) // [[3], [9, 20], [15, 7]]
}</code></pre>`
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Breakdown',
        content: `<ol>
          <li><code>val levelSize = queue.size</code>: Captures exact number of nodes on current depth level.</li>
          <li><code>repeat(levelSize)</code>: Pops all nodes of current level and enqueues their children.</li>
          <li><code>result.add(currentLevel)</code>: Saves snapshot of current depth layer.</li>
        </ol>`
      },
      {
        stepNumber: 7,
        title: 'Variable & Memory Tracking',
        content: '<p>Queue holds at most the maximum width of the tree (for a complete binary tree, width is $N/2$ at the lowest level). Space is $O(W) \\le O(N)$.</p>'
      },
      {
        stepNumber: 8,
        title: 'Runtime Progression',
        content: '<p>Level 0: [3]<br/>Level 1: [9, 20]<br/>Level 2: [15, 7]. Total nodes visited: exactly $N$.</p>'
      },
      {
        stepNumber: 9,
        title: 'Graph Adjacency Representation',
        content: `<pre><code class="kotlin">// Adjacency List for Graphs
val graph = HashMap<Int, MutableList<Int>>()
fun addEdge(u: Int, v: Int) {
    graph.getOrPut(u) { mutableListOf() }.add(v)
}</code></pre>`
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace',
        content: '<p>Queue begins with [3]. Size=1. Pop 3, enqueue 9 and 20. Queue is now [9, 20]. Size=2. Pop 9, pop 20, enqueue 15 and 7. Repeat until queue empty.</p>'
      },
      {
        stepNumber: 11,
        title: 'Final Output',
        content: '<p>List of levels: <code>[[3], [9, 20], [15, 7]]</code>.</p>'
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Mistakes',
        content: '<p>In general graphs with cycles, forgetting to maintain a <code>visited</code> set causes an infinite loop! Always mark nodes visited immediately when enqueuing.</p>'
      },
      {
        stepNumber: 13,
        title: 'Time & Space Complexity',
        content: '<p><strong>Time:</strong> <code>O(V + E)</code> where $V$ is vertices and $E$ is edges.<br/><strong>Auxiliary Space:</strong> <code>O(V)</code> for queue/visited set.</p>'
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: '<p>Solve: <strong>Number of Islands</strong>. Given an <code>m x n</code> 2D binary grid representing a map of \'1\'s (land) and \'0\'s (water), return the number of islands using BFS or DFS.</p>'
      },
      {
        stepNumber: 15,
        title: 'Hints & Solution Guide',
        content: '<p>Iterate through every cell. If cell is \'1\', increment island count and run DFS to sink all connected \'1\'s to \'0\'s.</p>'
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: '<p>Solve: <strong>Course Schedule</strong> (detecting cycles in directed dependency graph using Kahn\'s BFS Topological Sort algorithm).</p>'
      }
    ]
  }
};
