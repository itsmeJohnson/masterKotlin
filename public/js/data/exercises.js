/* ==========================================================================
   Exercises Database
   Contains problem statements, constraints, test cases, hints, starter code,
   and reference solutions.
   ========================================================================== */

import { ALGORITHM_EXERCISES } from './algorithm-exercises.js';

export const EXERCISES = {
  ...ALGORITHM_EXERCISES,
  'ex-substring-abcba': {
    id: 'ex-substring-abcba',
    title: 'Longest Substring Without Repeating Characters',
    category: 'Strings & Sliding Window',
    difficulty: 'Medium',
    description: `Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.
    <br/><br/>
    A substring is a contiguous non-empty sequence of characters within a string.`,
    inputFormat: 'A single string <code>s</code>.',
    outputFormat: 'Return a single integer representing the maximum length of a substring without repeating characters.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        input: 's = "abcba"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Note that the answer must be a substring, "pwke" is a subsequence and not a substring.'
      }
    ],
    starterCode: `// Function-based solution
fun lengthOfLongestSubstring(s: String): Int {
    var maxLen = 0
    var left = 0
    val lastSeen = HashMap<Char, Int>()

    // TODO: Iterate through s with right pointer
    // If character was seen, slide left pointer
    // Update lastSeen map and maxLen

    return maxLen
}

// HackerEarth / CLI Entrypoint
fun main() {
    val input = "abcba"
    val result = lengthOfLongestSubstring(input)
    println("Result: $result")
}`,
    testCases: [
      {
        name: 'Initial String: abcba',
        input: '"abcba"',
        expected: '3',
        testSnippet: 'println(lengthOfLongestSubstring("abcba"))'
      },
      {
        name: 'Single Repeated Char: bbbbb',
        input: '"bbbbb"',
        expected: '1',
        testSnippet: 'println(lengthOfLongestSubstring("bbbbb"))'
      },
      {
        name: 'Interleaved Duplicates: pwwkew',
        input: '"pwwkew"',
        expected: '3',
        testSnippet: 'println(lengthOfLongestSubstring("pwwkew"))'
      },
      {
        name: 'Empty String',
        input: '""',
        expected: '0',
        testSnippet: 'println(lengthOfLongestSubstring(""))'
      },
      {
        name: 'All Unique: barclays',
        input: '"barclays"',
        expected: '7',
        testSnippet: 'println(lengthOfLongestSubstring("barclays"))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Use two pointers (left and right) representing the boundaries of your active substring window.'
      },
      {
        level: 2,
        text: 'Store the last seen index of each character in a HashMap<Char, Int>. When you encounter a duplicate at index right, update left = maxOf(left, map[ch]!! + 1).'
      },
      {
        level: 3,
        text: 'Why maxOf? Because if a duplicate character was seen at an index before the current left pointer, left must NOT jump backwards!'
      }
    ],
    solution: {
      code: `fun lengthOfLongestSubstring(s: String): Int {
    var maxLen = 0
    var left = 0
    val lastSeen = HashMap<Char, Int>()

    for (right in s.indices) {
        val ch = s[right]
        if (lastSeen.containsKey(ch)) {
            left = maxOf(left, lastSeen[ch]!! + 1)
        }
        lastSeen[ch] = right
        maxLen = maxOf(maxLen, right - left + 1)
    }

    return maxLen
}`,
      timeComplexity: 'O(n) — Linear time where n is the length of string s. Each character is visited at most once by right and left.',
      spaceComplexity: 'O(min(n, m)) — Auxiliary space for the HashMap where m is the size of the character alphabet.',
      pitfalls: [
        'Forgetting the + 1 when calculating window length (right - left + 1).',
        'Directly assigning left = map[ch] + 1 without maxOf(left, ...), which causes left to jump backwards on inputs like "abba".',
        'Creating new substring instances on every step (e.g. s.substring(left, right)), which degrades time complexity to O(n^2).'
      ]
    },
    similarProblem: {
      title: 'Longest Substring with at Most K Distinct Characters',
      category: 'Sliding Window',
      difficulty: 'Medium'
    }
  },

  'ex-two-sum': {
    id: 'ex-two-sum',
    title: 'Two Sum — Complement Hash Table',
    category: 'HashMaps',
    difficulty: 'Easy',
    description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.
    <br/><br/>
    You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.`,
    inputFormat: 'An IntArray <code>nums</code> and an Int <code>target</code>.',
    outputFormat: 'Return an IntArray of size 2 containing the two 0-based indices.',
    constraints: [
      '2 <= nums.size <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    starterCode: `fun twoSum(nums: IntArray, target: Int): IntArray {
    val seen = HashMap<Int, Int>() // Number to Index

    // TODO: Iterate with index i
    // Check if complement (target - nums[i]) exists in seen
    // If yes, return intArrayOf(seen[complement]!!, i)
    // Else store nums[i] in seen

    return intArrayOf()
}

fun main() {
    val res = twoSum(intArrayOf(2, 7, 11, 15), 9)
    println(res.joinToString())
}`,
    testCases: [
      {
        name: 'Basic Pair: [2, 7, 11, 15] target=9',
        input: 'nums=[2, 7, 11, 15], target=9',
        expected: '0, 1',
        testSnippet: 'println(twoSum(intArrayOf(2, 7, 11, 15), 9).joinToString(", "))'
      },
      {
        name: 'Adjacent Pair: [3, 2, 4] target=6',
        input: 'nums=[3, 2, 4], target=6',
        expected: '1, 2',
        testSnippet: 'println(twoSum(intArrayOf(3, 2, 4), 6).joinToString(", "))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Instead of searching for nums[j] with a nested loop, compute complement = target - nums[i].'
      },
      {
        level: 2,
        text: 'Store each number and its index in a HashMap as you iterate. Check if complement was already inserted.'
      }
    ],
    solution: {
      code: `fun twoSum(nums: IntArray, target: Int): IntArray {
    val seen = HashMap<Int, Int>()

    for (i in nums.indices) {
        val complement = target - nums[i]
        if (seen.containsKey(complement)) {
            return intArrayOf(seen[complement]!!, i)
        }
        seen[nums[i]] = i
    }

    return intArrayOf()
}`,
      timeComplexity: 'O(n) — Single pass with O(1) average lookup in HashMap.',
      spaceComplexity: 'O(n) — Storing at most n elements in the map.',
      pitfalls: ['Using the same index twice (e.g. nums[0] + nums[0] = target).']
    }
  },

  'ex-kadane-array': {
    id: 'ex-kadane-array',
    title: 'Kadane’s Algorithm — Maximum Subarray Sum',
    category: 'Arrays & Dynamic Programming',
    difficulty: 'Medium',
    description: `Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return an Int representing the maximum subarray sum.',
    constraints: [
      '1 <= nums.size <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.'
      }
    ],
    starterCode: `fun maxSubArray(nums: IntArray): Int {
    var currentSum = nums[0]
    var maxSum = nums[0]

    // TODO: Loop from index 1 to nums.size - 1
    // Update currentSum = maxOf(nums[i], currentSum + nums[i])
    // Update maxSum = maxOf(maxSum, currentSum)

    return maxSum
}

fun main() {
    println(maxSubArray(intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)))
}`,
    testCases: [
      {
        name: 'Standard Array with Negatives',
        input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expected: '6',
        testSnippet: 'println(maxSubArray(intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)))'
      },
      {
        name: 'All Negative Array: [-5, -2, -8, -1]',
        input: '[-5, -2, -8, -1]',
        expected: '-1',
        testSnippet: 'println(maxSubArray(intArrayOf(-5, -2, -8, -1)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'At each index i, you have two choices: extend the previous subarray or start a new subarray at nums[i].'
      }
    ],
    solution: {
      code: `fun maxSubArray(nums: IntArray): Int {
    var currentSum = nums[0]
    var maxSum = nums[0]

    for (i in 1 until nums.size) {
        currentSum = maxOf(nums[i], currentSum + nums[i])
        maxSum = maxOf(maxSum, currentSum)
    }

    return maxSum
}`,
      timeComplexity: 'O(n) — Single linear pass.',
      spaceComplexity: 'O(1) — Constant extra space.',
      pitfalls: ['Initializing maxSum to 0 instead of nums[0], which fails when all numbers are negative!']
    }
  }
};
