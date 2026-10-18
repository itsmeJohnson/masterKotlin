/* ==========================================================================
   Priority 1: Kotlin & DSA Lesson Content
   Follows the strict 16-step teaching sequence.
   ========================================================================== */

export const FUNDAMENTAL_LESSONS = {
  'lesson-kotlin-fundamentals-intro': {
    id: 'lesson-kotlin-fundamentals-intro',
    title: 'Kotlin Fundamentals — Variables, Loops, Conditions and Indexes',
    category: 'Kotlin Fundamentals',
    difficulty: 'Beginner',
    timeEstimate: '25 min',
    visualizerSample: 'abcba',
    problemId: 'ex-substring-abcba',

    // The mandatory 16-step sequence:
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: `
          <p>In programming, a <strong>variable</strong> is a labeled storage container in memory for holding information. An <strong>index</strong> is the exact 0-based numeric position of an element in a sequence (like a String or an Array). A <strong>loop</strong> repeats a block of instructions across a series of positions. A <strong>condition</strong> is a decision gate (true or false) that determines whether a specific block of instructions runs.</p>
          <p>A <strong>HashMap</strong> is a key-value dictionary that lets us store something we saw (like a character) and retrieve related information (like the index where we last saw it) in constant <code>O(1)</code> average time.</p>
        `
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: `
          <p>Every algorithm interview assessment—from Barclays GSC to Tesco Bank—tests whether you can coordinate three basic operations simultaneously:</p>
          <ol>
            <li><strong>Traversing data:</strong> Moving a pointer across an input sequentially without running past the bounds.</li>
            <li><strong>Remembering history:</strong> Recording previously seen values in a fast lookup table (like a HashMap) instead of searching backwards with nested loops.</li>
            <li><strong>Updating states conditionally:</strong> Changing window boundaries and maximum scores only when a specific rule triggers.</li>
          </ol>
          <p>If you struggle with off-by-one index mistakes or updating variables in the wrong order, this lesson trains you to see the exact state transitions.</p>
        `
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: `
          <p>Imagine reading letters printed on a train track: <code>a</code>, <code>b</code>, <code>c</code>, <code>b</code>, <code>a</code>.</p>
          <p>You have a small notebook (our <strong>HashMap</strong>) and two bookmarks:</p>
          <ul>
            <li><strong>Right Bookmark (<code>right</code>):</strong> The letter you are currently reading right now.</li>
            <li><strong>Left Bookmark (<code>left</code>):</strong> Where your current clean segment begins.</li>
            <li><strong>Notebook:</strong> Whenever you read a letter, you check your notebook: <em>"Have I seen this letter before inside my current segment?"</em></li>
          </ul>
          <p>If you see letter <code>b</code> again at track position 3, your notebook says: <em>"I already saw 'b' at position 1!"</em> You immediately slide your left bookmark to position 2 (one step past position 1), eliminating the duplicate without having to start over from the beginning of the train.</p>
        `
      },
      {
        stepNumber: 4,
        title: 'Required Kotlin Syntax',
        content: `
          <p>In Kotlin, we declare read-only values with <code>val</code> (cannot be reassigned) and mutable variables with <code>var</code> (can be reassigned):</p>
          <pre><code class="kotlin">// 1. Immutable reference (recommended for safety)
val inputString: String = "abcba"

// 2. Mutable state variables
var maxLen: Int = 0
var left: Int = 0

// 3. HashMap for character-to-index tracking
val lastSeen = HashMap&lt;Char, Int&gt;()

// 4. Safe iteration through 0-based indices
for (right in inputString.indices) {
    val ch = inputString[right]
    // ...
}</code></pre>
        `
      },
      {
        stepNumber: 5,
        title: 'Smallest Possible Working Example',
        content: `
          <p>Here is the minimal working function that calculates the length of the longest substring without repeating characters using the string <code>"abcba"</code>:</p>
          <pre><code class="kotlin">fun lengthOfLongestSubstring(s: String): Int {
    var maxLen = 0
    var left = 0
    val lastSeen = HashMap&lt;Char, Int&gt;()

    for (right in s.indices) {
        val ch = s[right]
        if (lastSeen.containsKey(ch)) {
            // Jump left past the previous duplicate, but never move left backwards!
            left = maxOf(left, lastSeen[ch]!! + 1)
        }
        lastSeen[ch] = right
        val currentWindowLen = right - left + 1
        maxLen = maxOf(maxLen, currentWindowLen)
    }

    return maxLen
}

fun main() {
    val result = lengthOfLongestSubstring("abcba")
    println("Result: $result") // Prints: 3 (from "abc")
}</code></pre>
        `
      },
      {
        stepNumber: 6,
        title: 'Line-by-Line Code Breakdown',
        content: `
          <ul>
            <li><code>var maxLen = 0</code>: Tracks the highest valid window length observed across the entire execution.</li>
            <li><code>var left = 0</code>: Pointer marking the starting index of the current unique substring window.</li>
            <li><code>val lastSeen = HashMap&lt;Char, Int&gt;()</code>: Stores each unique character as a key and its latest 0-based index as the value.</li>
            <li><code>for (right in s.indices)</code>: Kotlin standard range from <code>0</code> up to <code>s.length - 1</code>. <code>right</code> increments by 1 on each step.</li>
            <li><code>val ch = s[right]</code>: Character indexing syntax. In Kotlin, <code>s[i]</code> internally calls <code>s.get(i)</code>.</li>
            <li><code>if (lastSeen.containsKey(ch))</code>: Condition evaluation checking whether <code>ch</code> exists in the table.</li>
            <li><code>left = maxOf(left, lastSeen[ch]!! + 1)</code>: Crucial logic! If duplicate was seen, slide <code>left</code> to <code>lastSeen[ch] + 1</code>. <code>maxOf</code> guarantees that if the duplicate is <em>behind</em> the current <code>left</code>, <code>left</code> does not move backwards.</li>
            <li><code>lastSeen[ch] = right</code>: Upserts the map entry with the new rightmost index.</li>
            <li><code>val currentWindowLen = right - left + 1</code>: Substring length formula (inclusive bounds).</li>
            <li><code>maxLen = maxOf(maxLen, currentWindowLen)</code>: Updates maximum length if current window is larger.</li>
          </ul>
        `
      },
      {
        stepNumber: 7,
        title: 'Variables & Initial State',
        content: `
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Type</th>
                  <th>Initial Value</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>s</code></td>
                  <td><code>String</code></td>
                  <td><code>"abcba"</code></td>
                  <td>Input string to evaluate. Length is 5 (indices 0 to 4).</td>
                </tr>
                <tr>
                  <td><code>maxLen</code></td>
                  <td><code>Int</code></td>
                  <td><code>0</code></td>
                  <td>Accumulator storing the best answer found so far.</td>
                </tr>
                <tr>
                  <td><code>left</code></td>
                  <td><code>Int</code></td>
                  <td><code>0</code></td>
                  <td>Left boundary of our active sliding window.</td>
                </tr>
                <tr>
                  <td><code>lastSeen</code></td>
                  <td><code>HashMap&lt;Char, Int&gt;</code></td>
                  <td><code>{}</code> (empty)</td>
                  <td>Lookup table recording the latest index for each character.</td>
                </tr>
                <tr>
                  <td><code>right</code></td>
                  <td><code>Int</code></td>
                  <td><code>0</code> (starts at loop)</td>
                  <td>Right boundary exploring one new character per cycle.</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        stepNumber: 8,
        title: 'How Values Change During Execution',
        content: `
          <p>Notice how state updates in harmony:</p>
          <ol>
            <li><strong>Before reading a char:</strong> <code>right</code> points to index <code>i</code>.</li>
            <li><strong>Condition Check:</strong> If <code>ch</code> is in <code>lastSeen</code>, we ask: <em>Is its old position &gt;= left?</em> If yes, a conflict occurs inside our window.</li>
            <li><strong>Boundary Movement:</strong> <code>left</code> moves rightward past the old duplicate position.</li>
            <li><strong>Record Update:</strong> The map overwrites the old index of <code>ch</code> with the current <code>right</code> index.</li>
            <li><strong>Score Update:</strong> Window length is recomputed as <code>(right - left + 1)</code> and compared against <code>maxLen</code>.</li>
          </ol>
        `
      },
      {
        stepNumber: 9,
        title: 'Deep Dive: Loops, Conditions & Map Updates',
        content: `
          <p>Why do we use <code>right - left + 1</code> instead of <code>right - left</code>?</p>
          <div class="alert alert-important">
            <div class="alert-icon">📌</div>
            <div>
              <strong>0-Based Counting Rule:</strong> When both indices are inclusive, the count of elements between index 0 and index 2 is: <code>2 - 0 + 1 = 3</code> elements (indices 0, 1, 2). Forgetting the <code>+1</code> is the single most common off-by-one bug in junior code assessments!
            </div>
          </div>
          <p>Why <code>maxOf(left, lastSeen[ch]!! + 1)</code>?</p>
          <p>Consider the string <code>"abba"</code>. At index 3 (second 'a'), 'a' was seen at index 0. But <code>left</code> is already at index 2 (because of 'b'). If we blindly did <code>left = lastSeen['a'] + 1</code>, <code>left</code> would jump backwards from 2 to 1! Using <code>maxOf</code> prevents this fatal mistake.</p>
        `
      },
      {
        stepNumber: 10,
        title: 'Sample Input Trace: "abcba" Step-by-Step',
        content: `
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>right</th>
                  <th>ch</th>
                  <th>Condition (in map?)</th>
                  <th>left before/after</th>
                  <th>Window</th>
                  <th>Window Len</th>
                  <th>maxLen</th>
                  <th>HashMap State</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>0</code></td>
                  <td><code>'a'</code></td>
                  <td>false</td>
                  <td>0 &rarr; 0</td>
                  <td><code>"a"</code></td>
                  <td>1</td>
                  <td><strong>1</strong></td>
                  <td><code>{'a': 0}</code></td>
                </tr>
                <tr>
                  <td><code>1</code></td>
                  <td><code>'b'</code></td>
                  <td>false</td>
                  <td>0 &rarr; 0</td>
                  <td><code>"ab"</code></td>
                  <td>2</td>
                  <td><strong>2</strong></td>
                  <td><code>{'a': 0, 'b': 1}</code></td>
                </tr>
                <tr>
                  <td><code>2</code></td>
                  <td><code>'c'</code></td>
                  <td>false</td>
                  <td>0 &rarr; 0</td>
                  <td><code>"abc"</code></td>
                  <td>3</td>
                  <td><strong>3</strong></td>
                  <td><code>{'a': 0, 'b': 1, 'c': 2}</code></td>
                </tr>
                <tr>
                  <td><code>3</code></td>
                  <td><code>'b'</code></td>
                  <td><strong>true ('b' at 1)</strong></td>
                  <td>0 &rarr; <strong>2</strong></td>
                  <td><code>"cb"</code></td>
                  <td>2</td>
                  <td><strong>3</strong></td>
                  <td><code>{'a': 0, 'b': 3, 'c': 2}</code></td>
                </tr>
                <tr>
                  <td><code>4</code></td>
                  <td><code>'a'</code></td>
                  <td><strong>true ('a' at 0)</strong></td>
                  <td>2 &rarr; <strong>2</strong> (0+1 &lt; 2)</td>
                  <td><code>"cba"</code></td>
                  <td>3</td>
                  <td><strong>3</strong></td>
                  <td><code>{'a': 4, 'b': 3, 'c': 2}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        stepNumber: 11,
        title: 'Final Output & Interpretation',
        content: `
          <p>The loop terminates because <code>right = 4</code> was the last index of <code>"abcba"</code>.</p>
          <p>The function returns <code>maxLen = 3</code>.</p>
          <p>The longest valid substring is <code>"abc"</code> (length 3). Another valid substring of length 3 is <code>"cba"</code>. Both have length 3.</p>
        `
      },
      {
        stepNumber: 12,
        title: 'Edge Cases & Common Mistakes',
        content: `
          <ul>
            <li><strong>Empty string <code>""</code>:</strong> Loop doesn't execute; correctly returns <code>0</code>.</li>
            <li><strong>Single character <code>"a"</code>:</strong> Loop runs once; returns <code>1</code>.</li>
            <li><strong>All same characters <code>"bbbbb"</code>:</strong> On every index after 0, <code>left</code> jumps to <code>right</code>; window length stays <code>1</code>; returns <code>1</code>.</li>
            <li><strong>All unique characters <code>"abcdef"</code>:</strong> Condition never triggers; returns <code>6</code>.</li>
            <li><strong>Off-by-one pointer reset:</strong> Resetting <code>left</code> to <code>0</code> on a duplicate instead of <code>lastSeen[ch] + 1</code> drops performance from <code>O(n)</code> to <code>O(n^2)</code>.</li>
          </ul>
        `
      },
      {
        stepNumber: 13,
        title: 'Time & Auxiliary Space Complexity',
        content: `
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Complexity</th>
                  <th>Technical Justification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Time Complexity</strong></td>
                  <td><code>O(n)</code></td>
                  <td>Each character is visited exactly once by <code>right</code>. <code>left</code> only moves forward, never backward. HashMap lookups and insertions are <code>O(1)</code> average. Total time is linear with string length <code>n</code>.</td>
                </tr>
                <tr>
                  <td><strong>Auxiliary Space</strong></td>
                  <td><code>O(min(n, m))</code></td>
                  <td>Where <code>n</code> is string length and <code>m</code> is the size of the character alphabet (e.g., 26 for lowercase English, or 128 for ASCII). At most <code>min(n, m)</code> unique keys are stored in the HashMap.</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        stepNumber: 14,
        title: 'Independent Exercise',
        content: `
          <div class="alert alert-tip">
            <div class="alert-icon">💡</div>
            <div>
              <strong>Your Challenge:</strong> Switch to the <strong>Practise</strong> tab or click <em>Start Exercise</em> below. Write the Kotlin solution for finding the length of the longest substring without repeating characters. Run the test cases to verify against <code>"abcba"</code>, <code>"bbbbb"</code>, and <code>"pwwkew"</code>!
            </div>
          </div>
        `
      },
      {
        stepNumber: 15,
        title: 'Hints & Review Checklist',
        content: `
          <ul>
            <li><strong>Hint 1:</strong> Start with <code>var left = 0</code> and <code>var maxLen = 0</code>.</li>
            <li><strong>Hint 2:</strong> Use a <code>HashMap&lt;Char, Int&gt;</code> where key is character and value is its index.</li>
            <li><strong>Hint 3:</strong> Remember: when duplicate occurs, <code>left = maxOf(left, map[ch]!! + 1)</code> to avoid moving backwards!</li>
          </ul>
        `
      },
      {
        stepNumber: 16,
        title: 'Confirmation Practice Problem',
        content: `
          <p>Once you master this, solve: <strong>Longest Substring with at Most K Distinct Characters</strong>. The sliding window logic is identical, but instead of tracking duplicates, your condition checks whether <code>map.size &gt; k</code>, shrinking <code>left</code> while decrementing frequencies.</p>
        `
      }
    ]
  },

  'lesson-strings-longest-substring': {
    id: 'lesson-strings-longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    category: 'Strings',
    difficulty: 'Medium',
    timeEstimate: '35 min',
    visualizerSample: 'pwwkew',
    problemId: 'ex-substring-abcba',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>A <strong>substring</strong> is a contiguous sequence of characters within a string. Finding the longest substring without repeating characters means finding the widest contiguous window where no character appears more than once.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>This is one of the top 5 most frequently asked technical assessment questions at Tier-1 tech and financial institutions (Barclays, Tesco Bank, Goldman Sachs, Amazon). It evaluates two-pointer sliding window mastery and constant-time frequency indexing.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Think of an airport security conveyor belt passing luggage tags. If an identical tag code appears while earlier items are still on the active scanning belt, you release the belt from the rear up to the duplicate item before letting the new item enter.</p>'
      },
      {
        stepNumber: 4,
        title: 'Kotlin Implementation Code',
        content: `<pre><code class="kotlin">class Solution {
    fun lengthOfLongestSubstring(s: String): Int {
        var maxLength = 0
        var left = 0
        val charIndexMap = HashMap&lt;Char, Int&gt;()

        for (right in s.indices) {
            val currentChar = s[right]
            if (charIndexMap.containsKey(currentChar)) {
                left = maxOf(left, charIndexMap[currentChar]!! + 1)
            }
            charIndexMap[currentChar] = right
            maxLength = maxOf(maxLength, right - left + 1)
        }
        return maxLength
    }
}</code></pre>`
      },
      {
        stepNumber: 5,
        title: 'Interactive Trace Recommendation',
        content: '<p>Open the <strong>Trace</strong> tab above to view the step-by-step pointer motion for <code>"pwwkew"</code>!</p>'
      }
    ]
  },

  'lesson-arrays-kadane-subarray': {
    id: 'lesson-arrays-kadane-subarray',
    title: 'Kadane’s Algorithm — Maximum Subarray Sum',
    category: 'Arrays & Lists',
    difficulty: 'Medium',
    timeEstimate: '25 min',
    visualizerSample: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    problemId: 'ex-kadane-array',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>Given an array of integers with both positive and negative values, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Brute force takes <code>O(n^2)</code> or <code>O(n^3)</code>. Kadane’s algorithm solves it in a single linear pass <code>O(n)</code> with <code>O(1)</code> space. It is a foundational introduction to dynamic programming.</p>'
      },
      {
        stepNumber: 3,
        title: 'Real-World Analogy',
        content: '<p>Imagine daily financial profit and losses. If your accumulated net balance from past days drops below zero (i.e. you are in net debt), it is more profitable to abandon that past history and start fresh with today’s revenue!</p>'
      },
      {
        stepNumber: 4,
        title: 'Kotlin Implementation',
        content: `<pre><code class="kotlin">fun maxSubArray(nums: IntArray): Int {
    var currentSum = nums[0]
    var maxSum = nums[0]

    for (i in 1 until nums.size) {
        // Either extend the previous subarray or start fresh from nums[i]
        currentSum = maxOf(nums[i], currentSum + nums[i])
        maxSum = maxOf(maxSum, currentSum)
    }

    return maxSum
}</code></pre>`
      }
    ]
  },

  'lesson-hashmaps-two-sum': {
    id: 'lesson-hashmaps-two-sum',
    title: 'Two Sum & Complement Lookup',
    category: 'HashMaps & Sets',
    difficulty: 'Easy',
    timeEstimate: '20 min',
    visualizerSample: '[2, 7, 11, 15]',
    problemId: 'ex-two-sum',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English Concept',
        content: '<p>Given an array of integers and a target sum, find the indices of the two numbers such that they add up to the target.</p>'
      },
      {
        stepNumber: 2,
        title: 'Why Developers Need It',
        content: '<p>Transforms a nested <code>O(n^2)</code> double loop into a single pass <code>O(n)</code> solution using space-time trade-off. Demonstrates HashMap complement lookup: <code>complement = target - currentNumber</code>.</p>'
      },
      {
        stepNumber: 3,
        title: 'Kotlin Implementation',
        content: `<pre><code class="kotlin">fun twoSum(nums: IntArray, target: Int): IntArray {
    val seen = HashMap&lt;Int, Int&gt;() // Number to index

    for (i in nums.indices) {
        val complement = target - nums[i]
        if (seen.containsKey(complement)) {
            return intArrayOf(seen[complement]!!, i)
        }
        seen[nums[i]] = i
    }

    throw IllegalArgumentException("No two sum solution found")
}</code></pre>`
      }
    ]
  }
};
