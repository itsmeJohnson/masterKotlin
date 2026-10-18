/* ==========================================================================
   Algorithm Exercises Bank — 50 Essential Programming Algorithms
   10 Core Concepts (5 Problems Each) for Technical Assessment Mastery
   ========================================================================== */

export const ALGORITHM_EXERCISES = {
  // ========================================================================
  // CONCEPT 1: ARRAYS & TWO POINTERS (5 Programs)
  // ========================================================================
  'algo-twosum-sorted': {
    id: 'algo-twosum-sorted',
    title: 'Two Sum II — Input Array Is Sorted',
    category: 'Arrays & Two Pointers',
    difficulty: 'Easy',
    description: `Given a <strong>1-indexed</strong> array of integers <code>numbers</code> that is already <strong>sorted in non-decreasing order</strong>, find two numbers such that they add up to a specific <code>target</code> number.
    <br/><br/>
    Return the indices of the two numbers, <code>index1</code> and <code>index2</code>, added by one as an integer array <code>[index1, index2]</code> of length 2.
    <br/><br/>
    Your solution must use only <code>O(1)</code> additional space.`,
    inputFormat: 'An IntArray <code>numbers</code> (sorted) and an Int <code>target</code>.',
    outputFormat: 'Return an IntArray of size 2 containing the 1-based indices.',
    constraints: [
      '2 <= numbers.size <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      'Exactly one solution exists.'
    ],
    examples: [
      {
        input: 'numbers = [2, 7, 11, 15], target = 9',
        output: '[1, 2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].'
      },
      {
        input: 'numbers = [2, 3, 4], target = 6',
        output: '[1, 3]',
        explanation: 'The sum of 2 and 4 is 6. Therefore, index1 = 1, index2 = 3. We return [1, 3].'
      }
    ],
    starterCode: `fun twoSumSorted(numbers: IntArray, target: Int): IntArray {
    var left = 0
    var right = numbers.size - 1

    // TODO: While left < right
    // Calculate current sum = numbers[left] + numbers[right]
    // If sum == target, return 1-based indices: intArrayOf(left + 1, right + 1)
    // If sum < target, increment left
    // If sum > target, decrement right

    return intArrayOf(-1, -1)
}

fun main() {
    val res = twoSumSorted(intArrayOf(2, 7, 11, 15), 9)
    println(res.joinToString(", "))
}`,
    testCases: [
      {
        name: 'Target 9: [2, 7, 11, 15]',
        input: 'numbers = [2, 7, 11, 15], target = 9',
        expected: '1, 2',
        testSnippet: 'println(twoSumSorted(intArrayOf(2, 7, 11, 15), 9).joinToString(", "))'
      },
      {
        name: 'Target 6: [2, 3, 4]',
        input: 'numbers = [2, 3, 4], target = 6',
        expected: '1, 3',
        testSnippet: 'println(twoSumSorted(intArrayOf(2, 3, 4), 6).joinToString(", "))'
      },
      {
        name: 'Target -1: [-1, 0]',
        input: 'numbers = [-1, 0], target = -1',
        expected: '1, 2',
        testSnippet: 'println(twoSumSorted(intArrayOf(-1, 0), -1).joinToString(", "))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Since the array is already sorted, use one pointer at index 0 and one pointer at the end of the array.'
      },
      {
        level: 2,
        text: 'If sum < target, the only way to increase the sum is to advance left++. If sum > target, decrease right--.'
      }
    ],
    solution: {
      code: `fun twoSumSorted(numbers: IntArray, target: Int): IntArray {
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
    return intArrayOf(-1, -1)
}`,
      timeComplexity: 'O(n) — Each step moves one pointer closer until the target is found.',
      spaceComplexity: 'O(1) — Only two integer pointer variables.',
      pitfalls: ['Forgetting that problem requires 1-based indexing (left + 1, right + 1).']
    }
  },

  'algo-container-water': {
    id: 'algo-container-water',
    title: 'Container With Most Water',
    category: 'Arrays & Two Pointers',
    difficulty: 'Medium',
    description: `You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i-th</code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.
    <br/><br/>
    Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the <strong>maximum amount of water</strong> a container can store.`,
    inputFormat: 'An IntArray <code>height</code>.',
    outputFormat: 'Return an Int representing maximum capacity.',
    constraints: ['2 <= height.size <= 10^5', '0 <= height[i] <= 10^4'],
    examples: [
      {
        input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        output: '49',
        explanation: 'Lines at index 1 and 8 (heights 8 and 7) with width 7 give area = min(8, 7) * 7 = 49.'
      }
    ],
    starterCode: `fun maxArea(height: IntArray): Int {
    var maxWater = 0
    var left = 0
    var right = height.size - 1

    // TODO: Loop while left < right
    // Width = right - left
    // Height = minOf(height[left], height[right])
    // Update maxWater
    // Advance the pointer with the smaller height

    return maxWater
}

fun main() {
    println(maxArea(intArrayOf(1, 8, 6, 2, 5, 4, 8, 3, 7)))
}`,
    testCases: [
      {
        name: 'Standard Heights [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        input: '[1, 8, 6, 2, 5, 4, 8, 3, 7]',
        expected: '49',
        testSnippet: 'println(maxArea(intArrayOf(1, 8, 6, 2, 5, 4, 8, 3, 7)))'
      },
      {
        name: 'Minimal Pair: [1, 1]',
        input: '[1, 1]',
        expected: '1',
        testSnippet: 'println(maxArea(intArrayOf(1, 1)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Area is constrained by the shorter line: area = min(height[left], height[right]) * (right - left).'
      },
      {
        level: 2,
        text: 'Moving the taller line cannot increase area since the width decreases and height is capped by the shorter line. Always move the shorter line!'
      }
    ],
    solution: {
      code: `fun maxArea(height: IntArray): Int {
    var maxWater = 0
    var left = 0
    var right = height.size - 1

    while (left < right) {
        val h = minOf(height[left], height[right])
        val w = right - left
        maxWater = maxOf(maxWater, h * w)
        if (height[left] < height[right]) {
            left++
        } else {
            right--
        }
    }
    return maxWater
}`,
      timeComplexity: 'O(n) — Single pass with two pointers.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Brute force O(n^2) nested loops will time out on 10^5 constraints.']
    }
  },

  'algo-3sum': {
    id: 'algo-3sum',
    title: '3Sum — Unique Triplets Summing to Zero',
    category: 'Arrays & Two Pointers',
    difficulty: 'Medium',
    description: `Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.
    <br/><br/>
    Notice that the solution set must not contain duplicate triplets.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return a List<List<Int>> with unique triplets.',
    constraints: ['3 <= nums.size <= 3000', '-10^5 <= nums[i] <= 10^5'],
    examples: [
      {
        input: 'nums = [-1, 0, 1, 2, -1, -4]',
        output: '[[-1, -1, 2], [-1, 0, 1]]',
        explanation: 'Triplets summing to 0 without duplicates.'
      }
    ],
    starterCode: `fun threeSum(nums: IntArray): List<List<Int>> {
    val result = mutableListOf<List<Int>>()
    nums.sort()

    // TODO: For i in 0 until nums.size - 2
    // Skip duplicate nums[i]
    // Use two pointers: left = i + 1, right = nums.size - 1
    // If sum == 0, add to result and skip duplicates of left and right

    return result
}

fun main() {
    val res = threeSum(intArrayOf(-1, 0, 1, 2, -1, -4))
    println(res.joinToString("; ") { it.joinToString(",") })
}`,
    testCases: [
      {
        name: 'Standard Triplet Set',
        input: '[-1, 0, 1, 2, -1, -4]',
        expected: '-1,-1,2; -1,0,1',
        testSnippet: 'println(threeSum(intArrayOf(-1, 0, 1, 2, -1, -4)).joinToString("; ") { it.joinToString(",") })'
      },
      {
        name: 'Zeroes Array: [0, 0, 0]',
        input: '[0, 0, 0]',
        expected: '0,0,0',
        testSnippet: 'println(threeSum(intArrayOf(0, 0, 0)).joinToString("; ") { it.joinToString(",") })'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Sorting the array first makes duplicate avoidance and two-pointer traversal straightforward.'
      },
      {
        level: 2,
        text: 'Fix the first element nums[i]. Then solve the remaining 2Sum problem with left = i + 1 and right = size - 1.'
      }
    ],
    solution: {
      code: `fun threeSum(nums: IntArray): List<List<Int>> {
    val result = mutableListOf<List<Int>>()
    nums.sort()

    for (i in 0 until nums.size - 2) {
        if (i > 0 && nums[i] == nums[i - 1]) continue
        var left = i + 1
        var right = nums.size - 1

        while (left < right) {
            val sum = nums[i] + nums[left] + nums[right]
            when {
                sum == 0 -> {
                    result.add(listOf(nums[i], nums[left], nums[right]))
                    while (left < right && nums[left] == nums[left + 1]) left++
                    while (left < right && nums[right] == nums[right - 1]) right--
                    left++
                    right--
                }
                sum < 0 -> left++
                else -> right--
            }
        }
    }
    return result
}`,
      timeComplexity: 'O(n^2) — Sorting takes O(n log n); two-pointer pass for each element takes O(n^2).',
      spaceComplexity: 'O(1) auxiliary space (excluding result list).',
      pitfalls: ['Forgetting to skip duplicate elements at i, left, and right, producing redundant duplicate triplets.']
    }
  },

  'algo-trapping-rain-water': {
    id: 'algo-trapping-rain-water',
    title: 'Trapping Rain Water',
    category: 'Arrays & Two Pointers',
    difficulty: 'Hard',
    description: `Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.`,
    inputFormat: 'An IntArray <code>height</code>.',
    outputFormat: 'Return an Int representing total units of trapped rain water.',
    constraints: ['1 <= height.size <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      {
        input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        output: '6',
        explanation: 'Water trapped between elevation peaks is 6 units.'
      }
    ],
    starterCode: `fun trap(height: IntArray): Int {
    if (height.isEmpty()) return 0
    var left = 0
    var right = height.size - 1
    var leftMax = 0
    var rightMax = 0
    var totalWater = 0

    // TODO: Two pointer scan
    // Maintain leftMax and rightMax
    // Process the smaller side to guarantee bound safety

    return totalWater
}

fun main() {
    println(trap(intArrayOf(0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1)))
}`,
    testCases: [
      {
        name: 'Standard Mountain Elevation',
        input: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        expected: '6',
        testSnippet: 'println(trap(intArrayOf(0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1)))'
      },
      {
        name: 'Simple Bowl: [4, 2, 0, 3, 2, 5]',
        input: '[4, 2, 0, 3, 2, 5]',
        expected: '9',
        testSnippet: 'println(trap(intArrayOf(4, 2, 0, 3, 2, 5)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Water at position i is determined by min(maxLeft, maxRight) - height[i].'
      },
      {
        level: 2,
        text: 'With two pointers, if height[left] < height[right], water is bounded by leftMax. Otherwise, bounded by rightMax.'
      }
    ],
    solution: {
      code: `fun trap(height: IntArray): Int {
    if (height.isEmpty()) return 0
    var left = 0
    var right = height.size - 1
    var leftMax = 0
    var rightMax = 0
    var totalWater = 0

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left]
            } else {
                totalWater += leftMax - height[left]
            }
            left++
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right]
            } else {
                totalWater += rightMax - height[right]
            }
            right--
        }
    }
    return totalWater
}`,
      timeComplexity: 'O(n) — Single pass with two pointers.',
      spaceComplexity: 'O(1) — No prefix/suffix arrays needed.',
      pitfalls: ['Attempting prefix and suffix arrays which takes O(n) auxiliary space instead of O(1).']
    }
  },

  'algo-remove-duplicates': {
    id: 'algo-remove-duplicates',
    title: 'Remove Duplicates from Sorted Array',
    category: 'Arrays & Two Pointers',
    difficulty: 'Easy',
    description: `Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, remove the duplicates <strong>in-place</strong> such that each unique element appears only once. The relative order of the elements should be kept the same.
    <br/><br/>
    Return <code>k</code> after placing the final result in the first <code>k</code> slots of <code>nums</code>.`,
    inputFormat: 'An IntArray <code>nums</code> (sorted).',
    outputFormat: 'Return an Int representing count of unique elements.',
    constraints: ['1 <= nums.size <= 3 * 10^4', '-100 <= nums[i] <= 100'],
    examples: [
      {
        input: 'nums = [1, 1, 2]',
        output: '2, nums = [1, 2, _]',
        explanation: 'Your function should return k = 2, with the first two elements being 1 and 2.'
      }
    ],
    starterCode: `fun removeDuplicates(nums: IntArray): Int {
    if (nums.isEmpty()) return 0
    var writeIndex = 1

    // TODO: Loop readIndex from 1 until nums.size
    // If nums[readIndex] != nums[readIndex - 1], copy to nums[writeIndex++]

    return writeIndex
}

fun main() {
    val arr = intArrayOf(0, 0, 1, 1, 1, 2, 2, 3, 3, 4)
    val k = removeDuplicates(arr)
    println("k=$k: " + arr.take(k).joinToString(","))
}`,
    testCases: [
      {
        name: 'Basic Duplicates: [1, 1, 2]',
        input: '[1, 1, 2]',
        expected: '2',
        testSnippet: 'println(removeDuplicates(intArrayOf(1, 1, 2)))'
      },
      {
        name: 'Multiple Duplicates: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]',
        input: '[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]',
        expected: '5',
        testSnippet: 'println(removeDuplicates(intArrayOf(0, 0, 1, 1, 1, 2, 2, 3, 3, 4)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Use a slow pointer writeIndex that only advances when a brand new distinct value is encountered.'
      }
    ],
    solution: {
      code: `fun removeDuplicates(nums: IntArray): Int {
    if (nums.isEmpty()) return 0
    var write = 1

    for (read in 1 until nums.size) {
        if (nums[read] != nums[read - 1]) {
            nums[write] = nums[read]
            write++
        }
    }
    return write
}`,
      timeComplexity: 'O(n) — Single linear scan.',
      spaceComplexity: 'O(1) — In-place modification.',
      pitfalls: ['Creating a new array or Set which violates the in-place O(1) requirement.']
    }
  },

  // ========================================================================
  // CONCEPT 2: SLIDING WINDOW (5 Programs)
  // ========================================================================
  'algo-max-subarray-k': {
    id: 'algo-max-subarray-k',
    title: 'Maximum Sum Subarray of Size K',
    category: 'Sliding Window',
    difficulty: 'Easy',
    description: `Given an array of integers <code>arr</code> and a positive integer <code>k</code>, find the maximum sum of any contiguous subarray of size <code>k</code>.`,
    inputFormat: 'An Int <code>k</code> and an IntArray <code>arr</code>.',
    outputFormat: 'Return an Int representing maximum sum of a window of size k.',
    constraints: ['1 <= k <= arr.size <= 10^5', '-10^4 <= arr[i] <= 10^4'],
    examples: [
      {
        input: 'k = 3, arr = [2, 1, 5, 1, 3, 2]',
        output: '9',
        explanation: 'Subarray [5, 1, 3] gives the maximum sum of 9.'
      }
    ],
    starterCode: `fun maxSubArrayOfSizeK(k: Int, arr: IntArray): Int {
    var windowSum = 0
    var maxSum = Int.MIN_VALUE

    // TODO: Calculate initial sum of first k elements
    // Slide window by subtracting arr[i - k] and adding arr[i]
    // Track maximum sum

    return maxSum
}

fun main() {
    println(maxSubArrayOfSizeK(3, intArrayOf(2, 1, 5, 1, 3, 2)))
}`,
    testCases: [
      {
        name: 'Standard Window k=3',
        input: 'k = 3, [2, 1, 5, 1, 3, 2]',
        expected: '9',
        testSnippet: 'println(maxSubArrayOfSizeK(3, intArrayOf(2, 1, 5, 1, 3, 2)))'
      },
      {
        name: 'k=2, [2, 3, 4, 1, 5]',
        input: 'k = 2, [2, 3, 4, 1, 5]',
        expected: '7',
        testSnippet: 'println(maxSubArrayOfSizeK(2, intArrayOf(2, 3, 4, 1, 5)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Instead of re-summing all k elements each time, subtract the element leaving the window and add the new element entering the window.'
      }
    ],
    solution: {
      code: `fun maxSubArrayOfSizeK(k: Int, arr: IntArray): Int {
    if (arr.size < k) return 0
    var windowSum = 0
    for (i in 0 until k) {
        windowSum += arr[i]
    }
    var maxSum = windowSum

    for (i in k until arr.size) {
        windowSum += arr[i] - arr[i - k]
        maxSum = maxOf(maxSum, windowSum)
    }
    return maxSum
}`,
      timeComplexity: 'O(n) — Linear time.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Initializing maxSum to 0 when all array numbers could be negative.']
    }
  },

  'algo-min-window-substring': {
    id: 'algo-min-window-substring',
    title: 'Minimum Window Substring',
    category: 'Sliding Window',
    difficulty: 'Hard',
    description: `Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return the <strong>minimum window substring</strong> of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window.
    <br/><br/>
    If there is no such substring, return the empty string <code>""</code>.`,
    inputFormat: 'Two strings <code>s</code> and <code>t</code>.',
    outputFormat: 'Return the minimum window substring.',
    constraints: ['1 <= s.length, t.length <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes A, B, and C.'
      }
    ],
    starterCode: `fun minWindow(s: String, t: String): String {
    if (s.isEmpty() || t.isEmpty()) return ""
    val targetMap = HashMap<Char, Int>()
    for (ch in t) targetMap[ch] = targetMap.getOrDefault(ch, 0) + 1

    var left = 0
    var matchCount = 0
    var minLen = Int.MAX_VALUE
    var startIndex = 0

    // TODO: Expand right pointer and shrink left pointer when window is valid

    return if (minLen == Int.MAX_VALUE) "" else s.substring(startIndex, startIndex + minLen)
}

fun main() {
    println(minWindow("ADOBECODEBANC", "ABC"))
}`,
    testCases: [
      {
        name: 'Standard Target "ABC" in "ADOBECODEBANC"',
        input: 's = "ADOBECODEBANC", t = "ABC"',
        expected: 'BANC',
        testSnippet: 'println(minWindow("ADOBECODEBANC", "ABC"))'
      },
      {
        name: 'Identical: "a", "a"',
        input: 's = "a", t = "a"',
        expected: 'a',
        testSnippet: 'println(minWindow("a", "a"))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Track character frequencies needed in t. Expand right until all characters in t are matched.'
      },
      {
        level: 2,
        text: 'Once valid, contract left to find the minimal window while maintaining all required character counts.'
      }
    ],
    solution: {
      code: `fun minWindow(s: String, t: String): String {
    if (s.isEmpty() || t.isEmpty()) return ""
    val need = IntArray(128)
    for (ch in t) need[ch.code]++

    var required = t.length
    var left = 0
    var minLen = Int.MAX_VALUE
    var start = 0

    for (right in s.indices) {
        val rCh = s[right].code
        if (need[rCh] > 0) required--
        need[rCh]--

        while (required == 0) {
            val windowLen = right - left + 1
            if (windowLen < minLen) {
                minLen = windowLen
                start = left
            }
            val lCh = s[left].code
            need[lCh]++
            if (need[lCh] > 0) required++
            left++
        }
    }
    return if (minLen == Int.MAX_VALUE) "" else s.substring(start, start + minLen)
}`,
      timeComplexity: 'O(m + n) — Linear scan over both strings.',
      spaceComplexity: 'O(1) — Fixed 128-element ASCII array.',
      pitfalls: ['String allocation inside loop causing TLE on 10^5 constraints.']
    }
  },

  'algo-longest-repeating-char': {
    id: 'algo-longest-repeating-char',
    title: 'Longest Repeating Character Replacement',
    category: 'Sliding Window',
    difficulty: 'Medium',
    description: `You are given a string <code>s</code> and an integer <code>k</code>. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most <code>k</code> times.
    <br/><br/>
    Return the length of the longest substring containing the same letter you can get after performing the above operations.`,
    inputFormat: 'A string <code>s</code> and an Int <code>k</code>.',
    outputFormat: 'Return an Int representing maximum contiguous character sequence length.',
    constraints: ['1 <= s.length <= 10^5', '0 <= k <= s.length'],
    examples: [
      {
        input: 's = "ABAB", k = 2',
        output: '4',
        explanation: 'Replace the two "A"s with two "B"s or vice versa.'
      }
    ],
    starterCode: `fun characterReplacement(s: String, k: Int): Int {
    val counts = IntArray(26)
    var left = 0
    var maxFreq = 0
    var maxLen = 0

    // TODO: Sliding window. Window is valid if (windowLen - maxFreq) <= k

    return maxLen
}

fun main() {
    println(characterReplacement("AABABBA", 1))
}`,
    testCases: [
      {
        name: 'Replacement with k=2: "ABAB"',
        input: 's = "ABAB", k = 2',
        expected: '4',
        testSnippet: 'println(characterReplacement("ABAB", 2))'
      },
      {
        name: 'Replacement with k=1: "AABABBA"',
        input: 's = "AABABBA", k = 1',
        expected: '4',
        testSnippet: 'println(characterReplacement("AABABBA", 1))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'The number of characters we need to replace in window [left..right] is: (right - left + 1) - maxFreq.'
      }
    ],
    solution: {
      code: `fun characterReplacement(s: String, k: Int): Int {
    val count = IntArray(26)
    var left = 0
    var maxFreq = 0
    var maxLen = 0

    for (right in s.indices) {
        val idx = s[right] - 'A'
        count[idx]++
        maxFreq = maxOf(maxFreq, count[idx])

        while ((right - left + 1) - maxFreq > k) {
            count[s[left] - 'A']--
            left++
        }
        maxLen = maxOf(maxLen, right - left + 1)
    }
    return maxLen
}`,
      timeComplexity: 'O(n) — Each character visited at most twice.',
      spaceComplexity: 'O(1) — 26-element array.',
      pitfalls: ['Recomputing maximum frequency across all 26 letters inside the inner loop.']
    }
  },

  'algo-fruit-baskets': {
    id: 'algo-fruit-baskets',
    title: 'Fruit Into Baskets (At Most 2 Distinct Characters)',
    category: 'Sliding Window',
    difficulty: 'Medium',
    description: `You are visiting a farm that has a single row of fruit trees arranged from left to right. You are given an integer array <code>fruits</code> where <code>fruits[i]</code> is the type of fruit the <code>i-th</code> tree produces.
    <br/><br/>
    You want to collect as much fruit as possible. However, you only have <strong>two baskets</strong>, and each basket can only hold a single type of fruit. Return the <strong>maximum number of fruits</strong> you can pick.`,
    inputFormat: 'An IntArray <code>fruits</code>.',
    outputFormat: 'Return an Int representing maximum contiguous fruits with <= 2 types.',
    constraints: ['1 <= fruits.size <= 10^5', '0 <= fruits[i] < fruits.size'],
    examples: [
      {
        input: 'fruits = [1, 2, 1]',
        output: '3',
        explanation: 'We can pick from all 3 trees.'
      },
      {
        input: 'fruits = [0, 1, 2, 2]',
        output: '3',
        explanation: 'We can pick from [1, 2, 2].'
      }
    ],
    starterCode: `fun totalFruit(fruits: IntArray): Int {
    val basket = HashMap<Int, Int>() // Fruit type to count
    var left = 0
    var maxPicked = 0

    // TODO: Slide right pointer. When basket.size > 2, shrink left pointer

    return maxPicked
}

fun main() {
    println(totalFruit(intArrayOf(1, 2, 3, 2, 2)))
}`,
    testCases: [
      {
        name: 'Pick with 3 types: [1, 2, 3, 2, 2]',
        input: '[1, 2, 3, 2, 2]',
        expected: '4',
        testSnippet: 'println(totalFruit(intArrayOf(1, 2, 3, 2, 2)))'
      },
      {
        name: 'Two types: [1, 2, 1]',
        input: '[1, 2, 1]',
        expected: '3',
        testSnippet: 'println(totalFruit(intArrayOf(1, 2, 1)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'This is identical to finding the Longest Subarray with at most 2 distinct integers.'
      }
    ],
    solution: {
      code: `fun totalFruit(fruits: IntArray): Int {
    val map = HashMap<Int, Int>()
    var left = 0
    var maxPicked = 0

    for (right in fruits.indices) {
        val f = fruits[right]
        map[f] = map.getOrDefault(f, 0) + 1

        while (map.size > 2) {
            val leftFruit = fruits[left]
            map[leftFruit] = map[leftFruit]!! - 1
            if (map[leftFruit] == 0) map.remove(leftFruit)
            left++
        }
        maxPicked = maxOf(maxPicked, right - left + 1)
    }
    return maxPicked
}`,
      timeComplexity: 'O(n) — Each fruit added and removed from map at most once.',
      spaceComplexity: 'O(1) — Map has at most 3 entries at any time.',
      pitfalls: ['Forgetting to remove key from map when its count reaches 0, which keeps map.size > 2.']
    }
  },

  // ========================================================================
  // CONCEPT 3: PREFIX SUM & KADANE'S (5 Programs)
  // ========================================================================
  'algo-subarray-sum-k': {
    id: 'algo-subarray-sum-k',
    title: 'Subarray Sum Equals K',
    category: 'Prefix Sum & Kadane',
    difficulty: 'Medium',
    description: `Given an array of integers <code>nums</code> and an integer <code>k</code>, return the total number of subarrays whose sum equals to <code>k</code>.
    <br/><br/>
    A subarray is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: 'An IntArray <code>nums</code> and an Int <code>k</code>.',
    outputFormat: 'Return an Int representing total count of matching subarrays.',
    constraints: ['1 <= nums.size <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    examples: [
      {
        input: 'nums = [1, 1, 1], k = 2',
        output: '2',
        explanation: 'Subarrays [1, 1] at [0..1] and [1..2] sum to 2.'
      }
    ],
    starterCode: `fun subarraySum(nums: IntArray, k: Int): Int {
    var count = 0
    var currentSum = 0
    val prefixMap = HashMap<Int, Int>()
    prefixMap[0] = 1 // Base case for prefix equals k

    // TODO: Iterate over nums
    // Add nums[i] to currentSum
    // If prefixMap contains (currentSum - k), add its frequency to count
    // Update prefixMap[currentSum]

    return count
}

fun main() {
    println(subarraySum(intArrayOf(1, 2, 3), 3))
}`,
    testCases: [
      {
        name: 'nums=[1, 1, 1], k=2',
        input: 'nums=[1, 1, 1], k=2',
        expected: '2',
        testSnippet: 'println(subarraySum(intArrayOf(1, 1, 1), 2))'
      },
      {
        name: 'nums=[1, 2, 3], k=3',
        input: 'nums=[1, 2, 3], k=3',
        expected: '2',
        testSnippet: 'println(subarraySum(intArrayOf(1, 2, 3), 3))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'If prefixSum[j] - prefixSum[i] = k, then the subarray between i and j has sum equal to k!'
      }
    ],
    solution: {
      code: `fun subarraySum(nums: IntArray, k: Int): Int {
    var count = 0
    var sum = 0
    val prefix = HashMap<Int, Int>()
    prefix[0] = 1

    for (num in nums) {
        sum += num
        if (prefix.containsKey(sum - k)) {
            count += prefix[sum - k]!!
        }
        prefix[sum] = prefix.getOrDefault(sum, 0) + 1
    }
    return count
}`,
      timeComplexity: 'O(n) — Single pass with HashMap.',
      spaceComplexity: 'O(n) — Map stores up to n prefix sums.',
      pitfalls: ['Forgetting to initialize prefix[0] = 1, which misses subarrays starting from index 0.']
    }
  },

  'algo-product-except-self': {
    id: 'algo-product-except-self',
    title: 'Product of Array Except Self',
    category: 'Prefix Sum & Kadane',
    difficulty: 'Medium',
    description: `Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.
    <br/><br/>
    The product of any prefix or suffix of <code>nums</code> is guaranteed to fit in a 32-bit integer.
    <br/><br/>
    You must write an algorithm that runs in <code>O(n)</code> time and <strong>without using the division operation</strong>.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return an IntArray <code>answer</code>.',
    constraints: ['2 <= nums.size <= 10^5', '-30 <= nums[i] <= 30'],
    examples: [
      {
        input: 'nums = [1, 2, 3, 4]',
        output: '[24, 12, 8, 6]',
        explanation: 'Each element is the product of all other elements.'
      }
    ],
    starterCode: `fun productExceptSelf(nums: IntArray): IntArray {
    val n = nums.size
    val result = IntArray(n) { 1 }

    // TODO: Compute prefix products in result
    // In a second pass backwards, multiply by suffix product

    return result
}

fun main() {
    println(productExceptSelf(intArrayOf(1, 2, 3, 4)).joinToString(", "))
}`,
    testCases: [
      {
        name: 'Standard Array [1, 2, 3, 4]',
        input: '[1, 2, 3, 4]',
        expected: '24, 12, 8, 6',
        testSnippet: 'println(productExceptSelf(intArrayOf(1, 2, 3, 4)).joinToString(", "))'
      },
      {
        name: 'Array with Zeros: [-1, 1, 0, -3, 3]',
        input: '[-1, 1, 0, -3, 3]',
        expected: '0, 0, 9, 0, 0',
        testSnippet: 'println(productExceptSelf(intArrayOf(-1, 1, 0, -3, 3)).joinToString(", "))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'The answer at i is: (product of all numbers left of i) * (product of all numbers right of i).'
      }
    ],
    solution: {
      code: `fun productExceptSelf(nums: IntArray): IntArray {
    val n = nums.size
    val res = IntArray(n) { 1 }

    var prefix = 1
    for (i in 0 until n) {
        res[i] = prefix
        prefix *= nums[i]
    }

    var suffix = 1
    for (i in n - 1 downTo 0) {
        res[i] *= suffix
        suffix *= nums[i]
    }
    return res
}`,
      timeComplexity: 'O(n) — Two linear passes.',
      spaceComplexity: 'O(1) extra space (output array does not count as auxiliary space).',
      pitfalls: ['Using division which breaks when numbers include 0.']
    }
  },

  'algo-max-product-subarray': {
    id: 'algo-max-product-subarray',
    title: 'Maximum Product Subarray',
    category: 'Prefix Sum & Kadane',
    difficulty: 'Medium',
    description: `Given an integer array <code>nums</code>, find a subarray that has the largest product, and return the product.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return an Int representing maximum product.',
    constraints: ['1 <= nums.size <= 2 * 10^4', '-10 <= nums[i] <= 10'],
    examples: [
      {
        input: 'nums = [2, 3, -2, 4]',
        output: '6',
        explanation: '[2, 3] has the largest product 6.'
      }
    ],
    starterCode: `fun maxProduct(nums: IntArray): Int {
    var maxProd = nums[0]
    var minProd = nums[0]
    var result = nums[0]

    // TODO: Track both maxProd and minProd because multiplying a negative number by minProd can become the new maxProd!

    return result
}

fun main() {
    println(maxProduct(intArrayOf(2, 3, -2, 4)))
}`,
    testCases: [
      {
        name: 'Standard [2, 3, -2, 4]',
        input: '[2, 3, -2, 4]',
        expected: '6',
        testSnippet: 'println(maxProduct(intArrayOf(2, 3, -2, 4)))'
      },
      {
        name: 'Negatives Flipping: [-2, 3, -4]',
        input: '[-2, 3, -4]',
        expected: '24',
        testSnippet: 'println(maxProduct(intArrayOf(-2, 3, -4)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'A negative number flips max into min and min into max. Swap maxProd and minProd whenever num < 0.'
      }
    ],
    solution: {
      code: `fun maxProduct(nums: IntArray): Int {
    var maxProd = nums[0]
    var minProd = nums[0]
    var result = nums[0]

    for (i in 1 until nums.size) {
        val num = nums[i]
        if (num < 0) {
            val temp = maxProd
            maxProd = minProd
            minProd = temp
        }
        maxProd = maxOf(num, maxProd * num)
        minProd = minOf(num, minProd * num)
        result = maxOf(result, maxProd)
    }
    return result
}`,
      timeComplexity: 'O(n) — Single linear pass.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Forgetting to store temporary maxProd before computing minProd.']
    }
  },

  'algo-range-sum-query': {
    id: 'algo-range-sum-query',
    title: 'Range Sum Query — Immutable',
    category: 'Prefix Sum & Kadane',
    difficulty: 'Easy',
    description: `Given an integer array <code>nums</code>, handle multiple queries of the following type: calculate the sum of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> inclusive where <code>left <= right</code> in <code>O(1)</code> time per query.`,
    inputFormat: 'An IntArray <code>nums</code>, Int <code>left</code>, Int <code>right</code>.',
    outputFormat: 'Return an Int representing sum.',
    constraints: ['1 <= nums.size <= 10^4', '0 <= left <= right < nums.size'],
    examples: [
      {
        input: 'nums = [-2, 0, 3, -5, 2, -1], sumRange(0, 2)',
        output: '1',
        explanation: '(-2) + 0 + 3 = 1.'
      }
    ],
    starterCode: `class NumArray(nums: IntArray) {
    val prefix = IntArray(nums.size + 1)
    init {
        // TODO: Build 1-indexed prefix sum array
    }

    fun sumRange(left: Int, right: Int): Int {
        // TODO: Return prefix[right + 1] - prefix[left]
        return 0
    }
}

fun main() {
    val obj = NumArray(intArrayOf(-2, 0, 3, -5, 2, -1))
    println(obj.sumRange(0, 2))
    println(obj.sumRange(2, 5))
}`,
    testCases: [
      {
        name: 'sumRange(0, 2) on [-2, 0, 3, -5, 2, -1]',
        input: '0, 2',
        expected: '1',
        testSnippet: 'println(NumArray(intArrayOf(-2, 0, 3, -5, 2, -1)).sumRange(0, 2))'
      },
      {
        name: 'sumRange(2, 5) on [-2, 0, 3, -5, 2, -1]',
        input: '2, 5',
        expected: '-1',
        testSnippet: 'println(NumArray(intArrayOf(-2, 0, 3, -5, 2, -1)).sumRange(2, 5))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Precompute prefix[i] = sum of nums[0..i-1]. Then range sum is prefix[right + 1] - prefix[left].'
      }
    ],
    solution: {
      code: `class NumArray(nums: IntArray) {
    private val prefix = IntArray(nums.size + 1)
    init {
        for (i in nums.indices) {
            prefix[i + 1] = prefix[i] + nums[i]
        }
    }

    fun sumRange(left: Int, right: Int): Int {
        return prefix[right + 1] - prefix[left]
    }
}`,
      timeComplexity: 'O(1) per range query, O(n) precomputation.',
      spaceComplexity: 'O(n) for prefix array.',
      pitfalls: ['Calculating range sums with a loop which results in O(n) per query instead of O(1).']
    }
  },

  // ========================================================================
  // CONCEPT 4: BINARY SEARCH (5 Programs)
  // ========================================================================
  'algo-binary-search-std': {
    id: 'algo-binary-search-std',
    title: 'Standard Binary Search',
    category: 'Binary Search',
    difficulty: 'Easy',
    description: `Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.
    <br/><br/>
    You must write an algorithm with <code>O(log n)</code> runtime complexity.`,
    inputFormat: 'An IntArray <code>nums</code> and an Int <code>target</code>.',
    outputFormat: 'Return the 0-based index or -1.',
    constraints: ['1 <= nums.size <= 10^4', 'nums is sorted in ascending order with unique values.'],
    examples: [
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      }
    ],
    starterCode: `fun search(nums: IntArray, target: Int): Int {
    var left = 0
    var right = nums.size - 1

    // TODO: Loop while left <= right
    // Calculate mid = left + (right - left) / 2 to avoid integer overflow
    // Return mid if nums[mid] == target

    return -1
}

fun main() {
    println(search(intArrayOf(-1, 0, 3, 5, 9, 12), 9))
}`,
    testCases: [
      {
        name: 'Found target 9',
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        expected: '4',
        testSnippet: 'println(search(intArrayOf(-1, 0, 3, 5, 9, 12), 9))'
      },
      {
        name: 'Missing target 2',
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        expected: '-1',
        testSnippet: 'println(search(intArrayOf(-1, 0, 3, 5, 9, 12), 2))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Always use mid = left + (right - left) / 2 instead of (left + right) / 2 to prevent integer overflow.'
      }
    ],
    solution: {
      code: `fun search(nums: IntArray, target: Int): Int {
    var left = 0
    var right = nums.size - 1

    while (left <= right) {
        val mid = left + (right - left) / 2
        when {
            nums[mid] == target -> return mid
            nums[mid] < target -> left = mid + 1
            else -> right = mid - 1
        }
    }
    return -1
}`,
      timeComplexity: 'O(log n) — Divides search space in half each iteration.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Using left < right instead of left <= right which misses single-element matches.']
    }
  },

  'algo-search-rotated-array': {
    id: 'algo-search-rotated-array',
    title: 'Search in Rotated Sorted Array',
    category: 'Binary Search',
    difficulty: 'Medium',
    description: `There is an integer array <code>nums</code> sorted in ascending order (with distinct values). Prior to being passed to your function, <code>nums</code> is possibly rotated at an unknown pivot index.
    <br/><br/>
    Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not.
    <br/><br/>
    You must achieve <code>O(log n)</code> runtime complexity.`,
    inputFormat: 'An IntArray <code>nums</code> and an Int <code>target</code>.',
    outputFormat: 'Return the index or -1.',
    constraints: ['1 <= nums.size <= 5000', 'All values of nums are unique.'],
    examples: [
      {
        input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
        output: '4',
        explanation: '0 is at index 4.'
      }
    ],
    starterCode: `fun searchRotated(nums: IntArray, target: Int): Int {
    var left = 0
    var right = nums.size - 1

    // TODO: Determine which half is normally sorted (nums[left] <= nums[mid])
    // Check if target lies within the sorted half
    // Adjust left or right accordingly

    return -1
}

fun main() {
    println(searchRotated(intArrayOf(4, 5, 6, 7, 0, 1, 2), 0))
}`,
    testCases: [
      {
        name: 'Target in right half: [4, 5, 6, 7, 0, 1, 2], target=0',
        input: 'nums=[4, 5, 6, 7, 0, 1, 2], target=0',
        expected: '4',
        testSnippet: 'println(searchRotated(intArrayOf(4, 5, 6, 7, 0, 1, 2), 0))'
      },
      {
        name: 'Target missing: [4, 5, 6, 7, 0, 1, 2], target=3',
        input: 'nums=[4, 5, 6, 7, 0, 1, 2], target=3',
        expected: '-1',
        testSnippet: 'println(searchRotated(intArrayOf(4, 5, 6, 7, 0, 1, 2), 3))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'At least one half of the array (left..mid or mid..right) is guaranteed to be strictly sorted.'
      }
    ],
    solution: {
      code: `fun searchRotated(nums: IntArray, target: Int): Int {
    var left = 0
    var right = nums.size - 1

    while (left <= right) {
        val mid = left + (right - left) / 2
        if (nums[mid] == target) return mid

        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (target >= nums[left] && target < nums[mid]) {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            // Right half is sorted
            if (target > nums[mid] && target <= nums[right]) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }
    return -1
}`,
      timeComplexity: 'O(log n) — Binary search.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Forgetting <= when testing if target lies within the sorted half boundaries.']
    }
  },

  'algo-find-first-last-pos': {
    id: 'algo-find-first-last-pos',
    title: 'Find First and Last Position in Sorted Array',
    category: 'Binary Search',
    difficulty: 'Medium',
    description: `Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value.
    <br/><br/>
    If target is not found in the array, return <code>[-1, -1]</code>.
    <br/><br/>
    You must write an algorithm with <code>O(log n)</code> runtime complexity.`,
    inputFormat: 'An IntArray <code>nums</code> and an Int <code>target</code>.',
    outputFormat: 'Return IntArray of size 2: [firstIndex, lastIndex].',
    constraints: ['0 <= nums.size <= 10^5', 'nums is sorted in non-decreasing order.'],
    examples: [
      {
        input: 'nums = [5, 7, 7, 8, 8, 10], target = 8',
        output: '[3, 4]',
        explanation: '8 starts at index 3 and ends at index 4.'
      }
    ],
    starterCode: `fun searchRange(nums: IntArray, target: Int): IntArray {
    // TODO: Run two binary searches:
    // 1. Find first index (bias left: right = mid - 1 when nums[mid] == target)
    // 2. Find last index (bias right: left = mid + 1 when nums[mid] == target)
    return intArrayOf(-1, -1)
}

fun main() {
    println(searchRange(intArrayOf(5, 7, 7, 8, 8, 10), 8).joinToString(","))
}`,
    testCases: [
      {
        name: 'Target 8 in [5, 7, 7, 8, 8, 10]',
        input: 'nums=[5, 7, 7, 8, 8, 10], target=8',
        expected: '3,4',
        testSnippet: 'println(searchRange(intArrayOf(5, 7, 7, 8, 8, 10), 8).joinToString(","))'
      },
      {
        name: 'Target missing: target=6',
        input: 'target=6',
        expected: '-1,-1',
        testSnippet: 'println(searchRange(intArrayOf(5, 7, 7, 8, 8, 10), 6).joinToString(","))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'When nums[mid] == target, do not immediately stop. Record the index and continue searching left to find the first position, and search right to find the last position.'
      }
    ],
    solution: {
      code: `fun searchRange(nums: IntArray, target: Int): IntArray {
    fun findBound(findFirst: Boolean): Int {
        var left = 0
        var right = nums.size - 1
        var ans = -1

        while (left <= right) {
            val mid = left + (right - left) / 2
            if (nums[mid] == target) {
                ans = mid
                if (findFirst) right = mid - 1 else left = mid + 1
            } else if (nums[mid] < target) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        return ans
    }

    return intArrayOf(findBound(true), findBound(false))
}`,
      timeComplexity: 'O(log n) — Two binary search passes.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Linear scan from mid which degrades to O(n) when all elements are identical.']
    }
  },

  'algo-find-min-rotated': {
    id: 'algo-find-min-rotated',
    title: 'Find Minimum in Rotated Sorted Array',
    category: 'Binary Search',
    difficulty: 'Medium',
    description: `Suppose an array of length <code>n</code> sorted in ascending order is rotated between <code>1</code> and <code>n</code> times. Return the <strong>minimum element</strong> of this array in <code>O(log n)</code> time.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return the minimum Int value.',
    constraints: ['1 <= nums.size <= 5000', 'All elements of nums are unique.'],
    examples: [
      {
        input: 'nums = [3, 4, 5, 1, 2]',
        output: '1',
        explanation: 'Original array was [1, 2, 3, 4, 5] rotated 3 times.'
      }
    ],
    starterCode: `fun findMin(nums: IntArray): Int {
    var left = 0
    var right = nums.size - 1

    // TODO: Compare nums[mid] with nums[right]
    // If nums[mid] > nums[right], the minimum is in the right half (left = mid + 1)
    // Else minimum is at mid or in the left half (right = mid)

    return nums[left]
}

fun main() {
    println(findMin(intArrayOf(3, 4, 5, 1, 2)))
}`,
    testCases: [
      {
        name: 'Rotated: [3, 4, 5, 1, 2]',
        input: '[3, 4, 5, 1, 2]',
        expected: '1',
        testSnippet: 'println(findMin(intArrayOf(3, 4, 5, 1, 2)))'
      },
      {
        name: 'Rotated 4 times: [4, 5, 6, 7, 0, 1, 2]',
        input: '[4, 5, 6, 7, 0, 1, 2]',
        expected: '0',
        testSnippet: 'println(findMin(intArrayOf(4, 5, 6, 7, 0, 1, 2)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Compare nums[mid] with nums[right]. If nums[mid] > nums[right], the inflection point (minimum) must lie strictly to the right.'
      }
    ],
    solution: {
      code: `fun findMin(nums: IntArray): Int {
    var left = 0
    var right = nums.size - 1

    while (left < right) {
        val mid = left + (right - left) / 2
        if (nums[mid] > nums[right]) {
            left = mid + 1
        } else {
            right = mid
        }
    }
    return nums[left]
}`,
      timeComplexity: 'O(log n) — Logarithmic binary search.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Setting right = mid - 1 instead of right = mid, which skips the minimum when mid itself is the minimum.']
    }
  },

  'algo-peak-element': {
    id: 'algo-peak-element',
    title: 'Find Peak Element',
    category: 'Binary Search',
    difficulty: 'Medium',
    description: `A peak element is an element that is strictly greater than its neighbors. Given an integer array <code>nums</code>, find a peak element, and return its index. If the array contains multiple peaks, return the index to <strong>any of the peaks</strong> in <code>O(log n)</code> time.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return the 0-based index of any peak.',
    constraints: ['1 <= nums.size <= 1000', 'nums[i] != nums[i + 1] for all valid i.'],
    examples: [
      {
        input: 'nums = [1, 2, 3, 1]',
        output: '2',
        explanation: '3 is a peak element and your function should return the index number 2.'
      }
    ],
    starterCode: `fun findPeakElement(nums: IntArray): Int {
    var left = 0
    var right = nums.size - 1

    // TODO: Compare nums[mid] and nums[mid + 1]
    // If rising slope (nums[mid] < nums[mid + 1]), peak lies to the right
    // Else falling slope, peak is at mid or to the left

    return left
}

fun main() {
    println(findPeakElement(intArrayOf(1, 2, 3, 1)))
}`,
    testCases: [
      {
        name: 'Peak at 2: [1, 2, 3, 1]',
        input: '[1, 2, 3, 1]',
        expected: '2',
        testSnippet: 'println(findPeakElement(intArrayOf(1, 2, 3, 1)))'
      },
      {
        name: 'Peak at 5: [1, 2, 1, 3, 5, 6, 4]',
        input: '[1, 2, 1, 3, 5, 6, 4]',
        expected: '5',
        testSnippet: 'println(findPeakElement(intArrayOf(1, 2, 1, 3, 5, 6, 4)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Always move in the direction of the ascending slope; you are guaranteed to hit at least one peak.'
      }
    ],
    solution: {
      code: `fun findPeakElement(nums: IntArray): Int {
    var left = 0
    var right = nums.size - 1

    while (left < right) {
        val mid = left + (right - left) / 2
        if (nums[mid] < nums[mid + 1]) {
            left = mid + 1
        } else {
            right = mid
        }
    }
    return left
}`,
      timeComplexity: 'O(log n) — Binary search.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Checking out of bounds when accessing nums[mid + 1] if while condition is <= right.']
    }
  },

  // ========================================================================
  // CONCEPT 5: LINKED LISTS & FAST-SLOW POINTERS (5 Programs)
  // ========================================================================
  'algo-linked-list-cycle': {
    id: 'algo-linked-list-cycle',
    title: 'Linked List Cycle Detection',
    category: 'Linked Lists & Pointers',
    difficulty: 'Easy',
    description: `Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.
    <br/><br/>
    There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Return <code>true</code> if there is a cycle in the linked list. Otherwise, return <code>false</code>.
    <br/><br/>
    Can you solve it using <code>O(1)</code> memory?`,
    inputFormat: 'A <code>ListNode?</code> head.',
    outputFormat: 'Return a Boolean (true/false).',
    constraints: ['The number of nodes in the list is in the range [0, 10^4].'],
    examples: [
      {
        input: 'head = [3, 2, 0, -4] with tail pointing to index 1',
        output: 'true',
        explanation: 'There is a cycle in the linked list.'
      }
    ],
    starterCode: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun hasCycle(head: ListNode?): Boolean {
    var slow = head
    var fast = head

    // TODO: Advance slow by 1 step, fast by 2 steps
    // If slow and fast meet, cycle detected!

    return false
}

fun main() {
    val n1 = ListNode(3)
    val n2 = ListNode(2)
    val n3 = ListNode(0)
    val n4 = ListNode(-4)
    n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2 // cycle to n2
    println(hasCycle(n1))
}`,
    testCases: [
      {
        name: 'List with cycle',
        input: '3 -> 2 -> 0 -> -4 -> 2',
        expected: 'true',
        testSnippet: `val a = ListNode(3); val b = ListNode(2); val c = ListNode(0); val d = ListNode(-4)
a.next = b; b.next = c; c.next = d; d.next = b
println(hasCycle(a))`
      },
      {
        name: 'Linear list without cycle',
        input: '1 -> 2 -> null',
        expected: 'false',
        testSnippet: `val a = ListNode(1); val b = ListNode(2)
a.next = b
println(hasCycle(a))`
      }
    ],
    hints: [
      {
        level: 1,
        text: "Floyd's Cycle Finding Algorithm: Use two pointers at different speeds (slow moves 1 step, fast moves 2 steps)."
      }
    ],
    solution: {
      code: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun hasCycle(head: ListNode?): Boolean {
    var slow = head
    var fast = head

    while (fast?.next != null) {
        slow = slow?.next
        fast = fast.next?.next
        if (slow === fast) return true
    }
    return false
}`,
      timeComplexity: 'O(n) — Linear time.',
      spaceComplexity: 'O(1) — No HashSet needed.',
      pitfalls: ['Checking fast.next without first verifying fast is non-null causes NullPointerException.']
    }
  },

  'algo-middle-linked-list': {
    id: 'algo-middle-linked-list',
    title: 'Middle of the Linked List',
    category: 'Linked Lists & Pointers',
    difficulty: 'Easy',
    description: `Given the <code>head</code> of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the <strong>second middle node</strong>.`,
    inputFormat: 'A <code>ListNode?</code> head.',
    outputFormat: 'Return the middle <code>ListNode?</code>.',
    constraints: ['The number of nodes in the list is in the range [1, 100].'],
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[3, 4, 5]',
        explanation: 'The middle node of the list is node 3.'
      }
    ],
    starterCode: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun middleNode(head: ListNode?): ListNode? {
    var slow = head
    var fast = head

    // TODO: Advance slow by 1, fast by 2 until fast reaches end

    return slow
}

fun main() {
    val head = ListNode(1).apply {
        next = ListNode(2).apply {
            next = ListNode(3).apply {
                next = ListNode(4).apply { next = ListNode(5) }
            }
        }
    }
    println(middleNode(head)?.\`val\`)
}`,
    testCases: [
      {
        name: 'Odd nodes: [1, 2, 3, 4, 5]',
        input: '1 -> 2 -> 3 -> 4 -> 5',
        expected: '3',
        testSnippet: `val a = ListNode(1); val b = ListNode(2); val c = ListNode(3); val d = ListNode(4); val e = ListNode(5)
a.next = b; b.next = c; c.next = d; d.next = e
println(middleNode(a)?.\`val\`)`
      },
      {
        name: 'Even nodes: [1, 2, 3, 4, 5, 6]',
        input: '1 -> 2 -> 3 -> 4 -> 5 -> 6',
        expected: '4',
        testSnippet: `val a = ListNode(1); val b = ListNode(2); val c = ListNode(3); val d = ListNode(4); val e = ListNode(5); val f = ListNode(6)
a.next = b; b.next = c; c.next = d; d.next = e; e.next = f
println(middleNode(a)?.\`val\`)`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'When fast reaches the end of the list, slow will be exactly halfway!'
      }
    ],
    solution: {
      code: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun middleNode(head: ListNode?): ListNode? {
    var slow = head
    var fast = head

    while (fast?.next != null) {
        slow = slow?.next
        fast = fast.next?.next
    }
    return slow
}`,
      timeComplexity: 'O(n) — Single pass.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Counting total nodes first and doing a second pass takes 2 traversals instead of 1.']
    }
  },

  'algo-reverse-linked-list': {
    id: 'algo-reverse-linked-list',
    title: 'Reverse Linked List',
    category: 'Linked Lists & Pointers',
    difficulty: 'Easy',
    description: `Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.`,
    inputFormat: 'A <code>ListNode?</code> head.',
    outputFormat: 'Return the new head of the reversed list.',
    constraints: ['The number of nodes in the list is the range [0, 5000].'],
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        explanation: 'Reversed order.'
      }
    ],
    starterCode: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var curr = head

    // TODO: While curr != null
    // Save nextNode = curr.next
    // Point curr.next = prev
    // Advance prev = curr, curr = nextNode

    return prev
}

fun main() {
    val h = ListNode(1).apply { next = ListNode(2).apply { next = ListNode(3) } }
    var rev = reverseList(h)
    val list = mutableListOf<Int>()
    while (rev != null) { list.add(rev.\`val\`); rev = rev.next }
    println(list.joinToString(","))
}`,
    testCases: [
      {
        name: 'Reverse [1, 2, 3]',
        input: '1 -> 2 -> 3',
        expected: '3,2,1',
        testSnippet: `val a = ListNode(1); val b = ListNode(2); val c = ListNode(3)
a.next = b; b.next = c
var r = reverseList(a)
val l = mutableListOf<Int>()
while (r != null) { l.add(r.\`val\`); r = r.next }
println(l.joinToString(","))`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Maintain three pointers: prev, curr, and nextNode to avoid losing reference to the rest of the list.'
      }
    ],
    solution: {
      code: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var curr = head

    while (curr != null) {
        val nextNode = curr.next
        curr.next = prev
        prev = curr
        curr = nextNode
    }
    return prev
}`,
      timeComplexity: 'O(n) — Single pass.',
      spaceComplexity: 'O(1) — In-place pointer reversal.',
      pitfalls: ['Overwriting curr.next before storing the original next pointer causes list disconnect.']
    }
  },

  'algo-merge-two-sorted-lists': {
    id: 'algo-merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    category: 'Linked Lists & Pointers',
    difficulty: 'Easy',
    description: `You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Merge the two lists into one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.`,
    inputFormat: 'Two heads <code>list1: ListNode?</code> and <code>list2: ListNode?</code>.',
    outputFormat: 'Return the merged <code>ListNode?</code>.',
    constraints: ['Both list1 and list2 are sorted in non-decreasing order.'],
    examples: [
      {
        input: 'list1 = [1, 2, 4], list2 = [1, 3, 4]',
        output: '[1, 1, 2, 3, 4, 4]',
        explanation: 'Merged in sorted order.'
      }
    ],
    starterCode: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun mergeTwoLists(list1: ListNode?, list2: ListNode?): ListNode? {
    val dummy = ListNode(0)
    var tail = dummy
    var l1 = list1
    var l2 = list2

    // TODO: While l1 != null and l2 != null
    // Attach smaller node to tail.next, advance pointer
    // Attach remaining non-null list

    return dummy.next
}

fun main() {
    val a = ListNode(1).apply { next = ListNode(4) }
    val b = ListNode(2).apply { next = ListNode(3) }
    var m = mergeTwoLists(a, b)
    val out = mutableListOf<Int>()
    while (m != null) { out.add(m.\`val\`); m = m.next }
    println(out.joinToString(","))
}`,
    testCases: [
      {
        name: 'Merge [1, 4] and [2, 3]',
        input: 'list1=[1, 4], list2=[2, 3]',
        expected: '1,2,3,4',
        testSnippet: `val a = ListNode(1); a.next = ListNode(4)
val b = ListNode(2); b.next = ListNode(3)
var m = mergeTwoLists(a, b)
val out = mutableListOf<Int>()
while (m != null) { out.add(m.\`val\`); m = m.next }
println(out.joinToString(","))`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'A dummy head node eliminates edge cases when appending the first element.'
      }
    ],
    solution: {
      code: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun mergeTwoLists(list1: ListNode?, list2: ListNode?): ListNode? {
    val dummy = ListNode(0)
    var tail = dummy
    var l1 = list1
    var l2 = list2

    while (l1 != null && l2 != null) {
        if (l1.\`val\` <= l2.\`val\`) {
            tail.next = l1
            l1 = l1.next
        } else {
            tail.next = l2
            l2 = l2.next
        }
        tail = tail.next!!
    }
    tail.next = l1 ?: l2
    return dummy.next
}`,
      timeComplexity: 'O(n + m) — Where n and m are lengths of list1 and list2.',
      spaceComplexity: 'O(1) — Reuses existing nodes.',
      pitfalls: ['Forgetting to append the remaining non-null list after the while loop finishes.']
    }
  },

  'algo-remove-nth-from-end': {
    id: 'algo-remove-nth-from-end',
    title: 'Remove N-th Node From End of List',
    category: 'Linked Lists & Pointers',
    difficulty: 'Medium',
    description: `Given the <code>head</code> of a linked list, remove the <code>n-th</code> node from the end of the list and return its head in a <strong>single pass</strong>.`,
    inputFormat: 'A <code>ListNode?</code> head and an Int <code>n</code>.',
    outputFormat: 'Return the head of modified list.',
    constraints: ['1 <= n <= size of list <= 30'],
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5], n = 2',
        output: '[1, 2, 3, 5]',
        explanation: 'Removing 2nd node from end (node 4).'
      }
    ],
    starterCode: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun removeNthFromEnd(head: ListNode?, n: Int): ListNode? {
    val dummy = ListNode(0).apply { next = head }
    var fast: ListNode? = dummy
    var slow: ListNode? = dummy

    // TODO: Advance fast pointer n + 1 steps ahead
    // Advance fast and slow together until fast is null
    // Delete slow.next

    return dummy.next
}

fun main() {
    val a = ListNode(1).apply { next = ListNode(2).apply { next = ListNode(3) } }
    var r = removeNthFromEnd(a, 2)
    val out = mutableListOf<Int>()
    while (r != null) { out.add(r.\`val\`); r = r.next }
    println(out.joinToString(","))
}`,
    testCases: [
      {
        name: 'Remove 2nd from end on [1, 2, 3]',
        input: 'head = [1, 2, 3], n = 2',
        expected: '1,3',
        testSnippet: `val a = ListNode(1); val b = ListNode(2); val c = ListNode(3)
a.next = b; b.next = c
var r = removeNthFromEnd(a, 2)
val out = mutableListOf<Int>()
while (r != null) { out.add(r.\`val\`); r = r.next }
println(out.joinToString(","))`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Create a gap of n nodes between fast and slow. When fast hits null, slow is right before the target node.'
      }
    ],
    solution: {
      code: `class ListNode(var \`val\`: Int) {
    var next: ListNode? = null
}

fun removeNthFromEnd(head: ListNode?, n: Int): ListNode? {
    val dummy = ListNode(0).apply { next = head }
    var fast: ListNode? = dummy
    var slow: ListNode? = dummy

    for (i in 0..n) {
        fast = fast?.next
    }

    while (fast != null) {
        slow = slow?.next
        fast = fast.next
    }

    slow?.next = slow?.next?.next
    return dummy.next
}`,
      timeComplexity: 'O(L) — Single pass where L is the number of nodes.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Not using a dummy node makes removing the first node (head) complex and error-prone.']
    }
  },

  // ========================================================================
  // CONCEPT 6: STACKS & MONOTONIC STACKS (5 Programs)
  // ========================================================================
  'algo-valid-parentheses': {
    id: 'algo-valid-parentheses',
    title: 'Valid Parentheses',
    category: 'Stacks & Queues',
    difficulty: 'Easy',
    description: `Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.
    <br/><br/>
    An input string is valid if open brackets are closed by the same type of brackets in the correct order.`,
    inputFormat: 'A single string <code>s</code>.',
    outputFormat: 'Return a Boolean (true/false).',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'All brackets closed correctly.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Mismatched closing bracket.'
      }
    ],
    starterCode: `fun isValid(s: String): Boolean {
    val stack = ArrayDeque<Char>()

    // TODO: Push matching closing bracket when opening bracket seen
    // If closing bracket seen, stack must not be empty and must match top

    return stack.isEmpty()
}

fun main() {
    println(isValid("()[]{}"))
}`,
    testCases: [
      {
        name: 'Valid "()[]{}"',
        input: '"()[]{}"',
        expected: 'true',
        testSnippet: 'println(isValid("()[]{}"))'
      },
      {
        name: 'Invalid "(]"',
        input: '"(]"',
        expected: 'false',
        testSnippet: 'println(isValid("(]"))'
      },
      {
        name: 'Nested valid "{[()()]}"',
        input: '"{[()()]}"',
        expected: 'true',
        testSnippet: 'println(isValid("{[()()]}"))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Push expected closing brackets: when seeing ( push ), when seeing { push }, when seeing [ push ].'
      }
    ],
    solution: {
      code: `fun isValid(s: String): Boolean {
    val stack = ArrayDeque<Char>()
    for (ch in s) {
        when (ch) {
            '(' -> stack.addLast(')')
            '{' -> stack.addLast('}')
            '[' -> stack.addLast(']')
            else -> {
                if (stack.isEmpty() || stack.removeLast() != ch) return false
            }
        }
    }
    return stack.isEmpty()
}`,
      timeComplexity: 'O(n) — Single pass over string.',
      spaceComplexity: 'O(n) — Stack holds at most n elements.',
      pitfalls: ['Forgetting to check stack.isEmpty() before pop, or forgetting stack.isEmpty() at the end.']
    }
  },

  'algo-next-greater-element': {
    id: 'algo-next-greater-element',
    title: 'Next Greater Element',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    description: `Given an array of integers <code>nums</code>, find the next greater element for each element in the array. The next greater element of a number <code>x</code> is the first greater number to its right. If it does not exist, output <code>-1</code> for this number.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return an IntArray of next greater values.',
    constraints: ['1 <= nums.size <= 10^5'],
    examples: [
      {
        input: 'nums = [4, 5, 2, 25]',
        output: '[5, 25, 25, -1]',
        explanation: 'For 4 it is 5, for 5 it is 25, for 2 it is 25, for 25 it is -1.'
      }
    ],
    starterCode: `fun nextGreaterElement(nums: IntArray): IntArray {
    val result = IntArray(nums.size) { -1 }
    val stack = ArrayDeque<Int>() // Stack of indices

    // TODO: Monotonic stack. While stack is not empty and nums[stack.peek()] < nums[i], pop and assign result

    return result
}

fun main() {
    println(nextGreaterElement(intArrayOf(4, 5, 2, 25)).joinToString(", "))
}`,
    testCases: [
      {
        name: 'Standard [4, 5, 2, 25]',
        input: '[4, 5, 2, 25]',
        expected: '5, 25, 25, -1',
        testSnippet: 'println(nextGreaterElement(intArrayOf(4, 5, 2, 25)).joinToString(", "))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Maintain a decreasing monotonic stack of indices. When a larger number arrives, it resolves the next greater element for all smaller numbers on top of the stack.'
      }
    ],
    solution: {
      code: `fun nextGreaterElement(nums: IntArray): IntArray {
    val res = IntArray(nums.size) { -1 }
    val stack = ArrayDeque<Int>()

    for (i in nums.indices) {
        while (stack.isNotEmpty() && nums[stack.last()] < nums[i]) {
            val idx = stack.removeLast()
            res[idx] = nums[i]
        }
        stack.addLast(i)
    }
    return res
}`,
      timeComplexity: 'O(n) — Each index is pushed and popped at most once.',
      spaceComplexity: 'O(n) — Stack auxiliary space.',
      pitfalls: ['Using nested loops O(n^2) which causes Time Limit Exceeded on 10^5 constraints.']
    }
  },

  'algo-daily-temperatures': {
    id: 'algo-daily-temperatures',
    title: 'Daily Temperatures — Wait Days to Warmer Day',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    description: `Given an array of integers <code>temperatures</code> represents daily temperatures, return an array <code>answer</code> such that <code>answer[i]</code> is the number of days you have to wait after the <code>i-th</code> day to get a warmer temperature. If there is no future day for which this is possible, keep <code>answer[i] == 0</code> instead.`,
    inputFormat: 'An IntArray <code>temperatures</code>.',
    outputFormat: 'Return an IntArray <code>answer</code>.',
    constraints: ['1 <= temperatures.size <= 10^5', '30 <= temperatures[i] <= 100'],
    examples: [
      {
        input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]',
        output: '[1, 1, 4, 2, 1, 1, 0, 0]',
        explanation: 'Days until warmer temperature.'
      }
    ],
    starterCode: `fun dailyTemperatures(temperatures: IntArray): IntArray {
    val ans = IntArray(temperatures.size)
    val stack = ArrayDeque<Int>() // Monotonic stack of indices

    // TODO: Process temperatures with monotonic stack

    return ans
}

fun main() {
    println(dailyTemperatures(intArrayOf(73, 74, 75, 71, 69, 72, 76, 73)).joinToString(","))
}`,
    testCases: [
      {
        name: 'Standard Weekly Temperatures',
        input: '[73, 74, 75, 71, 69, 72, 76, 73]',
        expected: '1,1,4,2,1,1,0,0',
        testSnippet: 'println(dailyTemperatures(intArrayOf(73, 74, 75, 71, 69, 72, 76, 73)).joinToString(","))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Store indices in the stack. When temperatures[curr] > temperatures[top], the wait duration is curr - top.'
      }
    ],
    solution: {
      code: `fun dailyTemperatures(temperatures: IntArray): IntArray {
    val ans = IntArray(temperatures.size)
    val stack = ArrayDeque<Int>()

    for (i in temperatures.indices) {
        while (stack.isNotEmpty() && temperatures[i] > temperatures[stack.last()]) {
            val prevDay = stack.removeLast()
            ans[prevDay] = i - prevDay
        }
        stack.addLast(i)
    }
    return ans
}`,
      timeComplexity: 'O(n) — Each day pushed and popped at most once.',
      spaceComplexity: 'O(n) — Monotonic stack space.',
      pitfalls: ['Pushing temperature value instead of index, making distance calculation impossible.']
    }
  },

  'algo-min-stack': {
    id: 'algo-min-stack',
    title: 'Min Stack with O(1) Minimum Retrieval',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in <strong>O(1)</strong> constant time.
    <br/><br/>
    Implement the <code>MinStack</code> class:
    <ul>
      <li><code>push(val: Int)</code> pushes element onto stack.</li>
      <li><code>pop()</code> removes element on top.</li>
      <li><code>top(): Int</code> gets top element.</li>
      <li><code>getMin(): Int</code> retrieves the minimum element in the stack.</li>
    </ul>`,
    inputFormat: 'Operations sequence.',
    outputFormat: 'Return values of top and getMin calls.',
    constraints: ['Methods pop, top and getMin operations will always be called on non-empty stacks.'],
    examples: [
      {
        input: 'push(-2), push(0), push(-3), getMin() -> -3, pop(), top() -> 0, getMin() -> -2',
        output: '[-3, 0, -2]',
        explanation: 'MinStack maintains O(1) min.'
      }
    ],
    starterCode: `class MinStack() {
    private val mainStack = ArrayDeque<Int>()
    private val minStack = ArrayDeque<Int>()

    fun push(\`val\`: Int) {
        // TODO: Push to mainStack and push minOf(\`val\`, currentMin) to minStack
    }

    fun pop() {
        // TODO: Pop from both stacks
    }

    fun top(): Int {
        return mainStack.last()
    }

    fun getMin(): Int {
        return minStack.last()
    }
}

fun main() {
    val s = MinStack()
    s.push(-2); s.push(0); s.push(-3)
    println(s.getMin())
    s.pop()
    println(s.top())
    println(s.getMin())
}`,
    testCases: [
      {
        name: 'MinStack basic operations',
        input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
        expected: '-3\n0\n-2',
        testSnippet: `val s = MinStack()
s.push(-2); s.push(0); s.push(-3)
println(s.getMin())
s.pop()
println(s.top())
println(s.getMin())`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Maintain an auxiliary stack where each element represents the minimum value at that stack depth.'
      }
    ],
    solution: {
      code: `class MinStack() {
    private val mainStack = ArrayDeque<Int>()
    private val minStack = ArrayDeque<Int>()

    fun push(\`val\`: Int) {
        mainStack.addLast(\`val\`)
        val currentMin = if (minStack.isEmpty()) \`val\` else minOf(\`val\`, minStack.last())
        minStack.addLast(currentMin)
    }

    fun pop() {
        mainStack.removeLast()
        minStack.removeLast()
    }

    fun top(): Int = mainStack.last()
    fun getMin(): Int = minStack.last()
}`,
      timeComplexity: 'O(1) for all operations (push, pop, top, getMin).',
      spaceComplexity: 'O(n) auxiliary stack space.',
      pitfalls: ['Scanning the stack on getMin(), turning an O(1) requirement into O(n).']
    }
  },

  'algo-asteroid-collision': {
    id: 'algo-asteroid-collision',
    title: 'Asteroid Collision Simulation',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    description: `We are given an array <code>asteroids</code> of integers representing asteroids in a row.
    <br/><br/>
    For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.
    <br/><br/>
    Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.`,
    inputFormat: 'An IntArray <code>asteroids</code>.',
    outputFormat: 'Return an IntArray of surviving asteroids.',
    constraints: ['2 <= asteroids.size <= 10^4', '-1000 <= asteroids[i] <= 1000', 'asteroids[i] != 0'],
    examples: [
      {
        input: 'asteroids = [5, 10, -5]',
        output: '[5, 10]',
        explanation: '10 and -5 collide resulting in 10. 5 and 10 never collide.'
      },
      {
        input: 'asteroids = [8, -8]',
        output: '[]',
        explanation: 'Both explode.'
      }
    ],
    starterCode: `fun asteroidCollision(asteroids: IntArray): IntArray {
    val stack = ArrayDeque<Int>()

    // TODO: Collision only happens when top of stack > 0 and current asteroid < 0
    // Resolve collisions with while loop

    return stack.toIntArray()
}

fun main() {
    println(asteroidCollision(intArrayOf(5, 10, -5)).joinToString(","))
}`,
    testCases: [
      {
        name: '[5, 10, -5] -> [5, 10]',
        input: '[5, 10, -5]',
        expected: '5,10',
        testSnippet: 'println(asteroidCollision(intArrayOf(5, 10, -5)).joinToString(","))'
      },
      {
        name: 'Equal size: [8, -8]',
        input: '[8, -8]',
        expected: '',
        testSnippet: 'println(asteroidCollision(intArrayOf(8, -8)).joinToString(","))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'A collision ONLY occurs when an existing asteroid is moving right (> 0) and the incoming asteroid is moving left (< 0).'
      }
    ],
    solution: {
      code: `fun asteroidCollision(asteroids: IntArray): IntArray {
    val stack = ArrayDeque<Int>()

    for (ast in asteroids) {
        var alive = true
        while (alive && ast < 0 && stack.isNotEmpty() && stack.last() > 0) {
            val top = stack.last()
            if (top < -ast) {
                stack.removeLast() // top explodes, continue checking
            } else if (top == -ast) {
                stack.removeLast() // both explode
                alive = false
            } else {
                alive = false // incoming explodes
            }
        }
        if (alive) stack.addLast(ast)
    }
    return stack.toIntArray()
}`,
      timeComplexity: 'O(n) — Each asteroid is pushed and popped at most once.',
      spaceComplexity: 'O(n) — Stack storage.',
      pitfalls: ['Triggering collision when top < 0 and ast > 0 (they are moving away from each other!).']
    }
  },

  // ========================================================================
  // CONCEPT 7: HASHMAPS, SETS & FREQUENCY COUNTING (5 Programs)
  // ========================================================================
  'algo-group-anagrams': {
    id: 'algo-group-anagrams',
    title: 'Group Anagrams',
    category: 'HashMaps & Sets',
    difficulty: 'Medium',
    description: `Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in <strong>any order</strong>.
    <br/><br/>
    An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    inputFormat: 'An Array<String> <code>strs</code>.',
    outputFormat: 'Return a List<List<String>> of grouped anagrams.',
    constraints: ['1 <= strs.size <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    examples: [
      {
        input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]',
        explanation: 'Grouped by common sorted letter signature.'
      }
    ],
    starterCode: `fun groupAnagrams(strs: Array<String>): List<List<String>> {
    val map = HashMap<String, MutableList<String>>()

    // TODO: For each word, sort its characters to form canonical key
    // Group in map

    return map.values.toList()
}

fun main() {
    val res = groupAnagrams(arrayOf("eat", "tea", "tan", "ate", "nat", "bat"))
    println(res.size)
}`,
    testCases: [
      {
        name: 'Six words into 3 groups',
        input: '["eat", "tea", "tan", "ate", "nat", "bat"]',
        expected: '3',
        testSnippet: 'println(groupAnagrams(arrayOf("eat", "tea", "tan", "ate", "nat", "bat")).size)'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Sort characters of each word to create a canonical key: "eat" -> "aet", "tea" -> "aet".'
      }
    ],
    solution: {
      code: `fun groupAnagrams(strs: Array<String>): List<List<String>> {
    val map = HashMap<String, MutableList<String>>()
    for (s in strs) {
        val key = String(s.toCharArray().apply { sort() })
        map.computeIfAbsent(key) { mutableListOf() }.add(s)
    }
    return map.values.toList()
}`,
      timeComplexity: 'O(n * k log k) where n is word count and k is max word length.',
      spaceComplexity: 'O(n * k) for map storage.',
      pitfalls: ['Forgetting that empty string "" is a valid word.']
    }
  },

  'algo-top-k-frequent': {
    id: 'algo-top-k-frequent',
    title: 'Top K Frequent Elements',
    category: 'HashMaps & Sets',
    difficulty: 'Medium',
    description: `Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements in <code>O(n)</code> or <code>O(n log k)</code> time.`,
    inputFormat: 'An IntArray <code>nums</code> and an Int <code>k</code>.',
    outputFormat: 'Return an IntArray of k most frequent elements.',
    constraints: ['1 <= nums.size <= 10^5', 'k is in range [1, unique elements]'],
    examples: [
      {
        input: 'nums = [1, 1, 1, 2, 2, 3], k = 2',
        output: '[1, 2]',
        explanation: '1 occurs 3 times, 2 occurs 2 times.'
      }
    ],
    starterCode: `fun topKFrequent(nums: IntArray, k: Int): IntArray {
    val freqMap = HashMap<Int, Int>()
    for (n in nums) freqMap[n] = freqMap.getOrDefault(n, 0) + 1

    // TODO: Bucket sort by frequency or PriorityQueue min-heap
    return intArrayOf()
}

fun main() {
    println(topKFrequent(intArrayOf(1, 1, 1, 2, 2, 3), 2).sorted().joinToString(","))
}`,
    testCases: [
      {
        name: 'Top 2 frequent: [1, 1, 1, 2, 2, 3]',
        input: '[1, 1, 1, 2, 2, 3], k=2',
        expected: '1,2',
        testSnippet: 'println(topKFrequent(intArrayOf(1, 1, 1, 2, 2, 3), 2).sorted().joinToString(","))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Use bucket sort where bucket index represents frequency (0 to n). This gives O(n) runtime!'
      }
    ],
    solution: {
      code: `fun topKFrequent(nums: IntArray, k: Int): IntArray {
    val count = HashMap<Int, Int>()
    for (n in nums) count[n] = count.getOrDefault(n, 0) + 1

    val buckets = Array(nums.size + 1) { mutableListOf<Int>() }
    for ((num, freq) in count) {
        buckets[freq].add(num)
    }

    val res = mutableListOf<Int>()
    for (f in buckets.indices.reversed()) {
        for (num in buckets[f]) {
            res.add(num)
            if (res.size == k) return res.toIntArray()
        }
    }
    return res.toIntArray()
}`,
      timeComplexity: 'O(n) — Linear time using bucket sort.',
      spaceComplexity: 'O(n) — Buckets array.',
      pitfalls: ['Sorting entire map entries O(n log n) which is suboptimal.']
    }
  },

  'algo-longest-consecutive': {
    id: 'algo-longest-consecutive',
    title: 'Longest Consecutive Sequence',
    category: 'HashMaps & Sets',
    difficulty: 'Medium',
    description: `Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence in <strong>O(n)</strong> time.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return an Int representing longest consecutive streak.',
    constraints: ['0 <= nums.size <= 10^5'],
    examples: [
      {
        input: 'nums = [100, 4, 200, 1, 3, 2]',
        output: '4',
        explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.'
      }
    ],
    starterCode: `fun longestConsecutive(nums: IntArray): Int {
    val set = nums.toHashSet()
    var longestStreak = 0

    // TODO: Only start counting streak from sequence start (num - 1 not in set)

    return longestStreak
}

fun main() {
    println(longestConsecutive(intArrayOf(100, 4, 200, 1, 3, 2)))
}`,
    testCases: [
      {
        name: 'Streak of 4: [100, 4, 200, 1, 3, 2]',
        input: '[100, 4, 200, 1, 3, 2]',
        expected: '4',
        testSnippet: 'println(longestConsecutive(intArrayOf(100, 4, 200, 1, 3, 2)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Only attempt to build a sequence if num - 1 is NOT present in the HashSet. This guarantees each number is visited at most twice.'
      }
    ],
    solution: {
      code: `fun longestConsecutive(nums: IntArray): Int {
    val set = nums.toHashSet()
    var maxStreak = 0

    for (num in set) {
        if (!set.contains(num - 1)) {
            var curr = num
            var streak = 1
            while (set.contains(curr + 1)) {
                curr++
                streak++
            }
            maxStreak = maxOf(maxStreak, streak)
        }
    }
    return maxStreak
}`,
      timeComplexity: 'O(n) — Each number processed at most twice.',
      spaceComplexity: 'O(n) — HashSet of distinct elements.',
      pitfalls: ['Checking sequence for every number without checking (num - 1), degrading to O(n^2).']
    }
  },

  'algo-valid-anagram': {
    id: 'algo-valid-anagram',
    title: 'Valid Anagram',
    category: 'HashMaps & Sets',
    difficulty: 'Easy',
    description: `Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.`,
    inputFormat: 'Two strings <code>s</code> and <code>t</code>.',
    outputFormat: 'Return Boolean.',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Both contain identical letter counts.'
      }
    ],
    starterCode: `fun isAnagram(s: String, t: String): Boolean {
    if (s.length != t.length) return false
    val count = IntArray(26)

    // TODO: Increment for s, decrement for t

    return count.all { it == 0 }
}

fun main() {
    println(isAnagram("anagram", "nagaram"))
}`,
    testCases: [
      {
        name: 'Valid "anagram" & "nagaram"',
        input: 's="anagram", t="nagaram"',
        expected: 'true',
        testSnippet: 'println(isAnagram("anagram", "nagaram"))'
      },
      {
        name: 'Invalid "rat" & "car"',
        input: 's="rat", t="car"',
        expected: 'false',
        testSnippet: 'println(isAnagram("rat", "car"))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Use a 26-element integer frequency array instead of sorting or HashMap for optimal performance.'
      }
    ],
    solution: {
      code: `fun isAnagram(s: String, t: String): Boolean {
    if (s.length != t.length) return false
    val freq = IntArray(26)
    for (i in s.indices) {
        freq[s[i] - 'a']++
        freq[t[i] - 'a']--
    }
    return freq.all { it == 0 }
}`,
      timeComplexity: 'O(n) — Single pass.',
      spaceComplexity: 'O(1) — 26-element array.',
      pitfalls: ['Sorting both strings O(n log n) is slower than frequency counting O(n).']
    }
  },

  // ========================================================================
  // CONCEPT 8: BINARY TREES & BST (5 Programs)
  // ========================================================================
  'algo-max-depth-tree': {
    id: 'algo-max-depth-tree',
    title: 'Maximum Depth of Binary Tree',
    category: 'Binary Trees & BST',
    difficulty: 'Easy',
    description: `Given the <code>root</code> of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    inputFormat: 'A <code>TreeNode?</code> root.',
    outputFormat: 'Return Int depth.',
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].'],
    examples: [
      {
        input: 'root = [3, 9, 20, null, null, 15, 7]',
        output: '3',
        explanation: 'Path 3 -> 20 -> 15 gives depth 3.'
      }
    ],
    starterCode: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun maxDepth(root: TreeNode?): Int {
    if (root == null) return 0
    return 1 + maxOf(maxDepth(root.left), maxDepth(root.right))
}

fun main() {
    val r = TreeNode(3).apply {
        left = TreeNode(9)
        right = TreeNode(20).apply { left = TreeNode(15); right = TreeNode(7) }
    }
    println(maxDepth(r))
}`,
    testCases: [
      {
        name: 'Tree with 3 levels',
        input: '3 -> [9, 20 -> [15, 7]]',
        expected: '3',
        testSnippet: `val r = TreeNode(3).apply {
    left = TreeNode(9)
    right = TreeNode(20).apply { left = TreeNode(15); right = TreeNode(7) }
}
println(maxDepth(r))`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Depth of tree rooted at node = 1 + max(depth(left), depth(right)).'
      }
    ],
    solution: {
      code: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun maxDepth(root: TreeNode?): Int {
    if (root == null) return 0
    return 1 + maxOf(maxDepth(root.left), maxDepth(root.right))
}`,
      timeComplexity: 'O(n) — Visits every node once.',
      spaceComplexity: 'O(h) — Call stack proportional to tree height h.',
      pitfalls: ['Forgetting base case root == null resulting in StackOverflowError.']
    }
  },

  'algo-invert-binary-tree': {
    id: 'algo-invert-binary-tree',
    title: 'Invert Binary Tree',
    category: 'Binary Trees & BST',
    difficulty: 'Easy',
    description: `Given the <code>root</code> of a binary tree, invert the tree (swap left and right children recursively), and return its root.`,
    inputFormat: 'A <code>TreeNode?</code> root.',
    outputFormat: 'Return inverted <code>TreeNode?</code>.',
    constraints: ['The number of nodes in the tree is in the range [0, 100].'],
    examples: [
      {
        input: 'root = [4, 2, 7, 1, 3, 6, 9]',
        output: '[4, 7, 2, 9, 6, 3, 1]',
        explanation: 'Mirrored binary tree.'
      }
    ],
    starterCode: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun invertTree(root: TreeNode?): TreeNode? {
    if (root == null) return null
    // TODO: Swap left and right children recursively
    val temp = root.left
    root.left = invertTree(root.right)
    root.right = invertTree(temp)
    return root
}

fun main() {
    val r = TreeNode(4).apply { left = TreeNode(2); right = TreeNode(7) }
    val inv = invertTree(r)
    println("\${inv?.left?.\`val\`},\${inv?.right?.\`val\`}")
}`,
    testCases: [
      {
        name: 'Invert [4, 2, 7]',
        input: '4 -> [2, 7]',
        expected: '7,2',
        testSnippet: `val r = TreeNode(4).apply { left = TreeNode(2); right = TreeNode(7) }
val inv = invertTree(r)
println("\${inv?.left?.\`val\`},\${inv?.right?.\`val\`}")`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Save temp = root.left before overwriting it with invertTree(root.right).'
      }
    ],
    solution: {
      code: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun invertTree(root: TreeNode?): TreeNode? {
    if (root == null) return null
    val temp = root.left
    root.left = invertTree(root.right)
    root.right = invertTree(temp)
    return root
}`,
      timeComplexity: 'O(n) — Each node is visited once.',
      spaceComplexity: 'O(h) — Call stack.',
      pitfalls: ['Overwriting root.left before recursing on root.right without a temporary reference.']
    }
  },

  'algo-level-order-traversal': {
    id: 'algo-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    category: 'Binary Trees & BST',
    difficulty: 'Medium',
    description: `Given the <code>root</code> of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level) using a <strong>Queue (BFS)</strong>.`,
    inputFormat: 'A <code>TreeNode?</code> root.',
    outputFormat: 'Return a List<List<Int>>.',
    constraints: ['The number of nodes in the tree is in the range [0, 2000].'],
    examples: [
      {
        input: 'root = [3, 9, 20, null, null, 15, 7]',
        output: '[[3], [9, 20], [15, 7]]',
        explanation: 'BFS traversal by depth.'
      }
    ],
    starterCode: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun levelOrder(root: TreeNode?): List<List<Int>> {
    val result = mutableListOf<List<Int>>()
    if (root == null) return result
    val queue = ArrayDeque<TreeNode>()
    queue.addLast(root)

    // TODO: While queue not empty, capture queue.size for current level
    // Poll nodes, collect values, and enqueue children

    return result
}

fun main() {
    val r = TreeNode(3).apply { left = TreeNode(9); right = TreeNode(20) }
    println(levelOrder(r).joinToString(";") { it.joinToString(",") })
}`,
    testCases: [
      {
        name: 'Level order [3, 9, 20]',
        input: '3 -> [9, 20]',
        expected: '3;9,20',
        testSnippet: `val r = TreeNode(3).apply { left = TreeNode(9); right = TreeNode(20) }
println(levelOrder(r).joinToString(";") { it.joinToString(",") })`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'At the start of each level loop, capture val levelSize = queue.size. Then loop exactly levelSize times.'
      }
    ],
    solution: {
      code: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun levelOrder(root: TreeNode?): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    if (root == null) return res
    val q = ArrayDeque<TreeNode>()
    q.addLast(root)

    while (q.isNotEmpty()) {
        val levelSize = q.size
        val currentLevel = mutableListOf<Int>()
        for (i in 0 until levelSize) {
            val node = q.removeFirst()
            currentLevel.add(node.\`val\`)
            node.left?.let { q.addLast(it) }
            node.right?.let { q.addLast(it) }
        }
        res.add(currentLevel)
    }
    return res
}`,
      timeComplexity: 'O(n) — Each node enqueued and dequeued once.',
      spaceComplexity: 'O(n) — Queue holds at most n/2 nodes at lowest leaf level.',
      pitfalls: ['Evaluating queue.size inside the loop condition dynamically instead of taking a fixed snapshot.']
    }
  },

  'algo-validate-bst': {
    id: 'algo-validate-bst',
    title: 'Validate Binary Search Tree',
    category: 'Binary Trees & BST',
    difficulty: 'Medium',
    description: `Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST).
    <br/><br/>
    A valid BST satisfies:
    <ul>
      <li>Left subtree contains only nodes with keys <strong>strictly less than</strong> node's key.</li>
      <li>Right subtree contains only nodes with keys <strong>strictly greater than</strong> node's key.</li>
      <li>Both left and right subtrees must also be binary search trees.</li>
    </ul>`,
    inputFormat: 'A <code>TreeNode?</code> root.',
    outputFormat: 'Return Boolean (true/false).',
    constraints: ['The number of nodes in the tree is in range [1, 10^4].'],
    examples: [
      {
        input: 'root = [2, 1, 3]',
        output: 'true',
        explanation: 'Valid BST.'
      },
      {
        input: 'root = [5, 1, 4, null, null, 3, 6]',
        output: 'false',
        explanation: 'Root value 5 is greater than right child 4.'
      }
    ],
    starterCode: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun isValidBST(root: TreeNode?): Boolean {
    fun validate(node: TreeNode?, min: Long, max: Long): Boolean {
        // TODO: Base case null -> true
        // Check if node.val is within (min..max)
        // Recurse validate(left, min, node.val) && validate(right, node.val, max)
        return true
    }
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE)
}

fun main() {
    val r = TreeNode(2).apply { left = TreeNode(1); right = TreeNode(3) }
    println(isValidBST(r))
}`,
    testCases: [
      {
        name: 'Valid BST [2, 1, 3]',
        input: '2 -> [1, 3]',
        expected: 'true',
        testSnippet: `val r = TreeNode(2).apply { left = TreeNode(1); right = TreeNode(3) }
println(isValidBST(r))`
      },
      {
        name: 'Invalid BST [5, 1, 4]',
        input: '5 -> [1, 4]',
        expected: 'false',
        testSnippet: `val r = TreeNode(5).apply { left = TreeNode(1); right = TreeNode(4) }
println(isValidBST(r))`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Checking only node.left < node.val and node.right > node.val is not enough! A node in right subtree must also be greater than all ancestor roots. Pass min and max bounds.'
      }
    ],
    solution: {
      code: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun isValidBST(root: TreeNode?): Boolean {
    fun check(node: TreeNode?, min: Long, max: Long): Boolean {
        if (node == null) return true
        val v = node.\`val\`.toLong()
        if (v <= min || v >= max) return false
        return check(node.left, min, v) && check(node.right, v, max)
    }
    return check(root, Long.MIN_VALUE, Long.MAX_VALUE)
}`,
      timeComplexity: 'O(n) — Visits each node once.',
      spaceComplexity: 'O(h) — Stack space.',
      pitfalls: ['Using Int.MIN_VALUE and Int.MAX_VALUE which causes boundary failure when node.val is Int.MAX_VALUE. Use Long.']
    }
  },

  'algo-lowest-common-ancestor': {
    id: 'algo-lowest-common-ancestor',
    title: 'Lowest Common Ancestor in Binary Tree',
    category: 'Binary Trees & BST',
    difficulty: 'Medium',
    description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes <code>p</code> and <code>q</code>.
    <br/><br/>
    The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow a node to be a descendant of itself).`,
    inputFormat: 'A <code>TreeNode?</code> root, <code>p: TreeNode</code>, <code>q: TreeNode</code>.',
    outputFormat: 'Return the LCA <code>TreeNode?</code>.',
    constraints: ['All node values are unique.', 'p != q and both exist in tree.'],
    examples: [
      {
        input: 'root = [3, 5, 1, 6, 2, 0, 8], p = 5, q = 1',
        output: '3',
        explanation: 'LCA of 5 and 1 is 3.'
      }
    ],
    starterCode: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun lowestCommonAncestor(root: TreeNode?, p: TreeNode?, q: TreeNode?): TreeNode? {
    if (root == null || root === p || root === q) return root
    // TODO: Recurse left and right
    // If both return non-null, root is the LCA!

    return root
}

fun main() {
    val r = TreeNode(3)
    val p = TreeNode(5); val q = TreeNode(1)
    r.left = p; r.right = q
    println(lowestCommonAncestor(r, p, q)?.\`val\`)
}`,
    testCases: [
      {
        name: 'LCA of p=5 and q=1 in root=3',
        input: 'root=3, p=5, q=1',
        expected: '3',
        testSnippet: `val r = TreeNode(3); val p = TreeNode(5); val q = TreeNode(1)
r.left = p; r.right = q
println(lowestCommonAncestor(r, p, q)?.\`val\`)`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'If left recursion finds one node and right recursion finds the other, the current root must be their lowest common ancestor.'
      }
    ],
    solution: {
      code: `class TreeNode(var \`val\`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun lowestCommonAncestor(root: TreeNode?, p: TreeNode?, q: TreeNode?): TreeNode? {
    if (root == null || root === p || root === q) return root

    val left = lowestCommonAncestor(root.left, p, q)
    val right = lowestCommonAncestor(root.right, p, q)

    return when {
        left != null && right != null -> root
        left != null -> left
        else -> right
    }
}`,
      timeComplexity: 'O(n) — Explores nodes in tree.',
      spaceComplexity: 'O(h) — Call stack depth.',
      pitfalls: ['Assuming the tree is a BST; this works on any arbitrary binary tree.']
    }
  },

  // ========================================================================
  // CONCEPT 9: DYNAMIC PROGRAMMING (5 Programs)
  // ========================================================================
  'algo-climbing-stairs': {
    id: 'algo-climbing-stairs',
    title: 'Climbing Stairs',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    description: `You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?`,
    inputFormat: 'An Int <code>n</code>.',
    outputFormat: 'Return Int distinct ways.',
    constraints: ['1 <= n <= 45'],
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: '1. 1 step + 1 step, 2. 2 steps.'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: '1. 1+1+1, 2. 1+2, 3. 2+1.'
      }
    ],
    starterCode: `fun climbStairs(n: Int): Int {
    if (n <= 2) return n
    var a = 1
    var b = 2

    // TODO: DP Fibonacci transition: next = a + b

    return b
}

fun main() {
    println(climbStairs(5))
}`,
    testCases: [
      {
        name: 'n=5 stairs',
        input: '5',
        expected: '8',
        testSnippet: 'println(climbStairs(5))'
      },
      {
        name: 'n=3 stairs',
        input: '3',
        expected: '3',
        testSnippet: 'println(climbStairs(3))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Ways to reach step i = ways to reach (i - 1) + ways to reach (i - 2). Only two previous states need to be tracked.'
      }
    ],
    solution: {
      code: `fun climbStairs(n: Int): Int {
    if (n <= 2) return n
    var prev2 = 1
    var prev1 = 2
    for (i in 3..n) {
        val curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    }
    return prev1
}`,
      timeComplexity: 'O(n) — Linear time.',
      spaceComplexity: 'O(1) — Constant memory.',
      pitfalls: ['Plain recursion O(2^n) causes Time Limit Exceeded.']
    }
  },

  'algo-coin-change': {
    id: 'algo-coin-change',
    title: 'Coin Change — Minimum Coins',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.
    <br/><br/>
    Return the <strong>fewest number of coins</strong> that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.`,
    inputFormat: 'An IntArray <code>coins</code> and an Int <code>amount</code>.',
    outputFormat: 'Return the minimum coin count or -1.',
    constraints: ['1 <= coins.size <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    examples: [
      {
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins).'
      }
    ],
    starterCode: `fun coinChange(coins: IntArray, amount: Int): Int {
    val dp = IntArray(amount + 1) { amount + 1 }
    dp[0] = 0

    // TODO: For each i in 1..amount
    // For each coin in coins: if i - coin >= 0, dp[i] = minOf(dp[i], 1 + dp[i - coin])

    return if (dp[amount] > amount) -1 else dp[amount]
}

fun main() {
    println(coinChange(intArrayOf(1, 2, 5), 11))
}`,
    testCases: [
      {
        name: 'coins = [1, 2, 5], amount = 11',
        input: '[1, 2, 5], 11',
        expected: '3',
        testSnippet: 'println(coinChange(intArrayOf(1, 2, 5), 11))'
      },
      {
        name: 'Impossible: coins = [2], amount = 3',
        input: '[2], 3',
        expected: '-1',
        testSnippet: 'println(coinChange(intArrayOf(2), 3))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Bottom-up DP: dp[i] is the minimum coins needed for amount i. dp[i] = min(dp[i], 1 + dp[i - coin]).'
      }
    ],
    solution: {
      code: `fun coinChange(coins: IntArray, amount: Int): Int {
    val dp = IntArray(amount + 1) { amount + 1 }
    dp[0] = 0

    for (i in 1..amount) {
        for (c in coins) {
            if (i - c >= 0) {
                dp[i] = minOf(dp[i], 1 + dp[i - c])
            }
        }
    }
    return if (dp[amount] > amount) -1 else dp[amount]
}`,
      timeComplexity: 'O(amount * coins.size).',
      spaceComplexity: 'O(amount) for DP table.',
      pitfalls: ['Using greedy choice (always picking largest coin) which fails on denominations like coins = [1, 3, 4, 5], amount = 7 (greedy gives 5+1+1=3, optimal is 4+3=2).']
    }
  },

  'algo-house-robber': {
    id: 'algo-house-robber',
    title: 'House Robber — Maximum Non-Adjacent Sum',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and <strong>it will automatically contact the police if two adjacent houses were broken into on the same night</strong>.
    <br/><br/>
    Given an integer array <code>nums</code> representing the amount of money of each house, return the maximum amount of money you can rob tonight <strong>without alerting the police</strong>.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return maximum money robbable.',
    constraints: ['1 <= nums.size <= 100', '0 <= nums[i] <= 400'],
    examples: [
      {
        input: 'nums = [1, 2, 3, 1]',
        output: '4',
        explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 4.'
      },
      {
        input: 'nums = [2, 7, 9, 3, 1]',
        output: '12',
        explanation: 'Rob house 1 (2), house 3 (9), and house 5 (1). Total = 12.'
      }
    ],
    starterCode: `fun rob(nums: IntArray): Int {
    var robPrev = 0
    var notRobPrev = 0

    // TODO: At each house:
    // Option 1: Rob this house -> notRobPrev + num
    // Option 2: Skip this house -> maxOf(robPrev, notRobPrev)

    return maxOf(robPrev, notRobPrev)
}

fun main() {
    println(rob(intArrayOf(2, 7, 9, 3, 1)))
}`,
    testCases: [
      {
        name: 'Standard [2, 7, 9, 3, 1]',
        input: '[2, 7, 9, 3, 1]',
        expected: '12',
        testSnippet: 'println(rob(intArrayOf(2, 7, 9, 3, 1)))'
      },
      {
        name: '[1, 2, 3, 1]',
        input: '[1, 2, 3, 1]',
        expected: '4',
        testSnippet: 'println(rob(intArrayOf(1, 2, 3, 1)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'At house i: maxProfit[i] = max(maxProfit[i - 1], maxProfit[i - 2] + nums[i]).'
      }
    ],
    solution: {
      code: `fun rob(nums: IntArray): Int {
    var rob1 = 0
    var rob2 = 0

    for (n in nums) {
        val newRob = maxOf(rob1 + n, rob2)
        rob1 = rob2
        rob2 = newRob
    }
    return rob2
}`,
      timeComplexity: 'O(n) — Single pass.',
      spaceComplexity: 'O(1) — Two state variables.',
      pitfalls: ['Allocating full O(n) dp array when only 2 previous states are required.']
    }
  },

  'algo-longest-increasing-subseq': {
    id: 'algo-longest-increasing-subseq',
    title: 'Longest Increasing Subsequence (LIS)',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.`,
    inputFormat: 'An IntArray <code>nums</code>.',
    outputFormat: 'Return Int length of LIS.',
    constraints: ['1 <= nums.size <= 2500'],
    examples: [
      {
        input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
        output: '4',
        explanation: 'LIS is [2, 3, 7, 101] with length 4.'
      }
    ],
    starterCode: `fun lengthOfLIS(nums: IntArray): Int {
    if (nums.isEmpty()) return 0
    val dp = IntArray(nums.size) { 1 }
    var maxLen = 1

    // TODO: For each i, check all j < i. If nums[i] > nums[j], dp[i] = maxOf(dp[i], dp[j] + 1)

    return maxLen
}

fun main() {
    println(lengthOfLIS(intArrayOf(10, 9, 2, 5, 3, 7, 101, 18)))
}`,
    testCases: [
      {
        name: 'Standard LIS: [10, 9, 2, 5, 3, 7, 101, 18]',
        input: '[10, 9, 2, 5, 3, 7, 101, 18]',
        expected: '4',
        testSnippet: 'println(lengthOfLIS(intArrayOf(10, 9, 2, 5, 3, 7, 101, 18)))'
      },
      {
        name: 'All identical: [7, 7, 7, 7]',
        input: '[7, 7, 7, 7]',
        expected: '1',
        testSnippet: 'println(lengthOfLIS(intArrayOf(7, 7, 7, 7)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'dp[i] represents length of longest increasing subsequence ending at index i.'
      }
    ],
    solution: {
      code: `fun lengthOfLIS(nums: IntArray): Int {
    if (nums.isEmpty()) return 0
    val dp = IntArray(nums.size) { 1 }
    var maxLen = 1

    for (i in 1 until nums.size) {
        for (j in 0 until i) {
            if (nums[i] > nums[j]) {
                dp[i] = maxOf(dp[i], dp[j] + 1)
            }
        }
        maxLen = maxOf(maxLen, dp[i])
    }
    return maxLen
}`,
      timeComplexity: 'O(n^2) DP or O(n log n) with patience binary search.',
      spaceComplexity: 'O(n) for dp array.',
      pitfalls: ['Subsequence vs Substring: elements in a subsequence do NOT need to be contiguous in the original array.']
    }
  },

  'algo-knapsack-01': {
    id: 'algo-knapsack-01',
    title: '0/1 Knapsack Problem',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `Given weights and values of <code>n</code> items, put these items in a knapsack of capacity <code>W</code> to get the maximum total value in the knapsack. Each item can either be chosen once or left behind (0/1 choice).`,
    inputFormat: 'Int <code>W</code>, IntArray <code>wt</code>, IntArray <code>val</code>.',
    outputFormat: 'Return maximum total value.',
    constraints: ['1 <= n <= 1000', '1 <= W <= 1000'],
    examples: [
      {
        input: 'W = 4, wt = [1, 2, 3], val = [10, 15, 40]',
        output: '55',
        explanation: 'Take item 1 (wt 1, val 10) and item 3 (wt 3, val 40) = wt 4, val 55.'
      }
    ],
    starterCode: `fun knapSack(W: Int, wt: IntArray, \`val\`: IntArray): Int {
    val dp = IntArray(W + 1)

    // TODO: For each item (w, v)
    // Traverse backwards from W downTo w to avoid using the same item multiple times
    // dp[j] = maxOf(dp[j], dp[j - w] + v)

    return dp[W]
}

fun main() {
    println(knapSack(4, intArrayOf(1, 2, 3), intArrayOf(10, 15, 40)))
}`,
    testCases: [
      {
        name: 'W=4, wt=[1, 2, 3], val=[10, 15, 40]',
        input: 'W=4',
        expected: '55',
        testSnippet: 'println(knapSack(4, intArrayOf(1, 2, 3), intArrayOf(10, 15, 40)))'
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Space optimization: by running the inner capacity loop backwards from W downTo w, we can use a single 1D array of size W + 1.'
      }
    ],
    solution: {
      code: `fun knapSack(W: Int, wt: IntArray, \`val\`: IntArray): Int {
    val dp = IntArray(W + 1)

    for (i in wt.indices) {
        val w = wt[i]
        val v = \`val\`[i]
        for (j in W downTo w) {
            dp[j] = maxOf(dp[j], dp[j - w] + v)
        }
    }
    return dp[W]
}`,
      timeComplexity: 'O(n * W) pseudo-polynomial time.',
      spaceComplexity: 'O(W) space.',
      pitfalls: ['Iterating forwards from w up to W turns this into Unbounded Knapsack (allowing infinite copies of same item).']
    }
  },

  // ========================================================================
  // CONCEPT 10: GRAPHS, BFS & DFS (5 Programs)
  // ========================================================================
  'algo-number-of-islands': {
    id: 'algo-number-of-islands',
    title: 'Number of Islands — Grid BFS / DFS',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    description: `Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return the number of islands.
    <br/><br/>
    An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    inputFormat: 'An Array<CharArray> <code>grid</code>.',
    outputFormat: 'Return total count of distinct islands.',
    constraints: ['1 <= m, n <= 300', 'grid[i][j] is "0" or "1"'],
    examples: [
      {
        input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
        output: '2',
        explanation: 'Top-left cluster forms 1 island, bottom-right forms 2nd island.'
      }
    ],
    starterCode: `fun numIslands(grid: Array<CharArray>): Int {
    var count = 0
    val rows = grid.size
    val cols = grid[0].size

    fun dfs(r: Int, c: Int) {
        // TODO: Boundary checks and water check
        // Mark as visited by setting grid[r][c] = '0'
        // Explore 4 directions
    }

    // TODO: Loop through all cells, trigger DFS when '1' found

    return count
}

fun main() {
    val g = arrayOf(
        charArrayOf('1', '1', '0'),
        charArrayOf('1', '1', '0'),
        charArrayOf('0', '0', '1')
    )
    println(numIslands(g))
}`,
    testCases: [
      {
        name: 'Two islands in 3x3 grid',
        input: '3x3 grid with 2 islands',
        expected: '2',
        testSnippet: `val g = arrayOf(
    charArrayOf('1', '1', '0'),
    charArrayOf('1', '1', '0'),
    charArrayOf('0', '0', '1')
)
println(numIslands(g))`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Sink visited land cells in-place by setting grid[r][c] = "0" to avoid needing an auxiliary visited matrix.'
      }
    ],
    solution: {
      code: `fun numIslands(grid: Array<CharArray>): Int {
    if (grid.isEmpty()) return 0
    var count = 0
    val m = grid.size
    val n = grid[0].size

    fun dfs(r: Int, c: Int) {
        if (r !in 0 until m || c !in 0 until n || grid[r][c] == '0') return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    }

    for (r in 0 until m) {
        for (c in 0 until n) {
            if (grid[r][c] == '1') {
                count++
                dfs(r, c)
            }
        }
    }
    return count
}`,
      timeComplexity: 'O(m * n) — Each cell visited at most constant number of times.',
      spaceComplexity: 'O(m * n) — Recursion stack depth in worst case (grid full of land).',
      pitfalls: ['Forgetting to check boundary conditions r !in 0 until m before array access.']
    }
  },

  'algo-rotting-oranges': {
    id: 'algo-rotting-oranges',
    title: 'Rotting Oranges — Multi-Source BFS',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    description: `You are given an <code>m x n</code> grid where each cell can have one of three values:
    <ul>
      <li><code>0</code> representing an empty cell,</li>
      <li><code>1</code> representing a fresh orange, or</li>
      <li><code>2</code> representing a rotten orange.</li>
    </ul>
    Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the <strong>minimum number of minutes</strong> that must elapse until no cell has a fresh orange. If this is impossible, return <code>-1</code>.`,
    inputFormat: 'An Array<IntArray> <code>grid</code>.',
    outputFormat: 'Return Int minutes or -1.',
    constraints: ['1 <= m, n <= 10'],
    examples: [
      {
        input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]',
        output: '4',
        explanation: 'All fresh oranges rot in 4 minutes.'
      }
    ],
    starterCode: `fun orangesRotting(grid: Array<IntArray>): Int {
    val q = ArrayDeque<Pair<Int, Int>>()
    var freshCount = 0

    // TODO: Enqueue all initial rotten oranges (2) and count fresh oranges (1)
    // Run multi-source BFS level by level
    // Return minutes elapsed, or -1 if freshCount > 0

    return 0
}

fun main() {
    val g = arrayOf(
        intArrayOf(2, 1, 1),
        intArrayOf(1, 1, 0),
        intArrayOf(0, 1, 1)
    )
    println(orangesRotting(g))
}`,
    testCases: [
      {
        name: '4 minutes to rot all',
        input: '[[2,1,1],[1,1,0],[0,1,1]]',
        expected: '4',
        testSnippet: `val g = arrayOf(
    intArrayOf(2, 1, 1),
    intArrayOf(1, 1, 0),
    intArrayOf(0, 1, 1)
)
println(orangesRotting(g))`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Multi-source BFS: add all initial rotten oranges to the queue at time 0. Process one minute per BFS level.'
      }
    ],
    solution: {
      code: `fun orangesRotting(grid: Array<IntArray>): Int {
    val m = grid.size
    val n = grid[0].size
    val q = ArrayDeque<Pair<Int, Int>>()
    var fresh = 0

    for (r in 0 until m) {
        for (c in 0 until n) {
            if (grid[r][c] == 2) q.addLast(r to c)
            else if (grid[r][c] == 1) fresh++
        }
    }

    if (fresh == 0) return 0
    var minutes = 0
    val dirs = arrayOf(-1 to 0, 1 to 0, 0 to -1, 0 to 1)

    while (q.isNotEmpty() && fresh > 0) {
        val size = q.size
        for (i in 0 until size) {
            val (r, c) = q.removeFirst()
            for ((dr, dc) in dirs) {
                val nr = r + dr
                val nc = c + dc
                if (nr in 0 until m && nc in 0 until n && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2
                    fresh--
                    q.addLast(nr to nc)
                }
            }
        }
        minutes++
    }
    return if (fresh == 0) minutes else -1
}`,
      timeComplexity: 'O(m * n) — Each cell visited once.',
      spaceComplexity: 'O(m * n) — Queue.',
      pitfalls: ['Incrementing minutes even when no fresh oranges were infected.']
    }
  },

  'algo-course-schedule': {
    id: 'algo-course-schedule',
    title: 'Course Schedule — Cycle Detection & Topological Sort',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    description: `There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [a, b]</code> indicates that you must take course <code>b</code> first if you want to take course <code>a</code>.
    <br/><br/>
    Return <code>true</code> if you can finish all courses. Otherwise, return <code>false</code>. (Detect directed graph cycles using Kahn's algorithm or DFS 3-color states).`,
    inputFormat: 'Int <code>numCourses</code> and Array<IntArray> <code>prerequisites</code>.',
    outputFormat: 'Return Boolean.',
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.size <= 5000'],
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1, 0]]',
        output: 'true',
        explanation: 'Take course 0 then take course 1.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]',
        output: 'false',
        explanation: 'Cycle exists: impossible to take.'
      }
    ],
    starterCode: `fun canFinish(numCourses: Int, prerequisites: Array<IntArray>): Boolean {
    val inDegree = IntArray(numCourses)
    val adj = Array(numCourses) { mutableListOf<Int>() }

    // TODO: Build graph and calculate in-degree of each course
    // Enqueue courses with 0 in-degree
    // Process queue; decrement dependent course in-degrees

    return true
}

fun main() {
    println(canFinish(2, arrayOf(intArrayOf(1, 0))))
}`,
    testCases: [
      {
        name: 'Linear dependency [[1, 0]]',
        input: '2, [[1, 0]]',
        expected: 'true',
        testSnippet: 'println(canFinish(2, arrayOf(intArrayOf(1, 0))))'
      },
      {
        name: 'Cycle [[1, 0], [0, 1]]',
        input: '2, [[1, 0], [0, 1]]',
        expected: 'false',
        testSnippet: 'println(canFinish(2, arrayOf(intArrayOf(1, 0), intArrayOf(0, 1))))'
      }
    ],
    hints: [
      {
        level: 1,
        text: "Kahn's Algorithm: A directed graph can be topologically sorted if and only if it is a Directed Acyclic Graph (DAG)."
      }
    ],
    solution: {
      code: `fun canFinish(numCourses: Int, prerequisites: Array<IntArray>): Boolean {
    val inDegree = IntArray(numCourses)
    val adj = Array(numCourses) { mutableListOf<Int>() }

    for (p in prerequisites) {
        val course = p[0]
        val prereq = p[1]
        adj[prereq].add(course)
        inDegree[course]++
    }

    val q = ArrayDeque<Int>()
    for (i in 0 until numCourses) {
        if (inDegree[i] == 0) q.addLast(i)
    }

    var taken = 0
    while (q.isNotEmpty()) {
        val curr = q.removeFirst()
        taken++
        for (next in adj[curr]) {
            inDegree[next]--
            if (inDegree[next] == 0) q.addLast(next)
        }
    }
    return taken == numCourses
}`,
      timeComplexity: 'O(V + E) — Standard topological sort.',
      spaceComplexity: 'O(V + E) — Adjacency list.',
      pitfalls: ['Inverting the edge direction: prereq -> course vs course -> prereq.']
    }
  },

  'algo-clone-graph': {
    id: 'algo-clone-graph',
    title: 'Clone Graph',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    description: `Given a reference of a node in a connected undirected graph, return a <strong>deep copy (clone)</strong> of the graph. Each node in the graph contains a value (<code>Int</code>) and a list (<code>List<Node></code>) of its neighbors.`,
    inputFormat: 'A <code>Node?</code>.',
    outputFormat: 'Return the deep-copied <code>Node?</code>.',
    constraints: ['The number of nodes in the graph is in the range [0, 100].'],
    examples: [
      {
        input: 'node = [[2,4],[1,3],[2,4],[1,3]]',
        output: 'Deep copy with brand new object memory addresses',
        explanation: 'All nodes and neighbor connections cloned.'
      }
    ],
    starterCode: `class Node(var \`val\`: Int) {
    var neighbors: ArrayList<Node?> = ArrayList()
}

fun cloneGraph(node: Node?): Node? {
    if (node == null) return null
    val visited = HashMap<Node, Node>() // original -> clone

    fun dfs(curr: Node): Node {
        // TODO: If already cloned, return visited[curr]
        // Else create new Node, put in visited, and clone all neighbors
        return curr
    }

    return dfs(node)
}

fun main() {
    val n1 = Node(1)
    val n2 = Node(2)
    n1.neighbors.add(n2); n2.neighbors.add(n1)
    val c1 = cloneGraph(n1)
    println(c1 !== n1 && c1?.\`val\` == 1)
}`,
    testCases: [
      {
        name: 'Clone 2-node graph',
        input: '1 <-> 2',
        expected: 'true',
        testSnippet: `val n1 = Node(1); val n2 = Node(2)
n1.neighbors.add(n2); n2.neighbors.add(n1)
val c1 = cloneGraph(n1)
println(c1 !== n1 && c1?.\`val\` == 1)`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Use a HashMap<Node, Node> to keep track of already cloned nodes to avoid infinite recursion loops on graph cycles.'
      }
    ],
    solution: {
      code: `class Node(var \`val\`: Int) {
    var neighbors: ArrayList<Node?> = ArrayList()
}

fun cloneGraph(node: Node?): Node? {
    if (node == null) return null
    val clonedMap = HashMap<Node, Node>()

    fun dfs(curr: Node): Node {
        if (clonedMap.containsKey(curr)) return clonedMap[curr]!!
        val copy = Node(curr.\`val\`)
        clonedMap[curr] = copy
        for (nbr in curr.neighbors) {
            if (nbr != null) {
                copy.neighbors.add(dfs(nbr))
            }
        }
        return copy
    }

    return dfs(node)
}`,
      timeComplexity: 'O(V + E) — Visits each node and edge once.',
      spaceComplexity: 'O(V) for visited map and recursion stack.',
      pitfalls: ['Not tracking visited cloned nodes, leading to infinite recursion on cycles.']
    }
  },

  'algo-flood-fill': {
    id: 'algo-flood-fill',
    title: 'Flood Fill Algorithm',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Easy',
    description: `An image is represented by an <code>m x n</code> integer grid <code>image</code> where <code>image[i][j]</code> represents the pixel value of the image.
    <br/><br/>
    You are also given three integers <code>sr</code>, <code>sc</code>, and <code>color</code>. You should perform a flood fill on the image starting from the pixel <code>image[sr][sc]</code>, changing all connected pixels of the original color to <code>color</code>.`,
    inputFormat: 'Array<IntArray> <code>image</code>, Int <code>sr</code>, Int <code>sc</code>, Int <code>color</code>.',
    outputFormat: 'Return the modified 2D image array.',
    constraints: ['1 <= m, n <= 50', '0 <= color, image[i][j] < 2^16'],
    examples: [
      {
        input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2',
        output: '[[2,2,2],[2,2,0],[2,0,1]]',
        explanation: 'Connected 1s converted to 2.'
      }
    ],
    starterCode: `fun floodFill(image: Array<IntArray>, sr: Int, sc: Int, color: Int): Array<IntArray> {
    val originalColor = image[sr][sc]
    if (originalColor == color) return image

    fun dfs(r: Int, c: Int) {
        // TODO: Check bounds and originalColor match
        // Update pixel to color and recurse on 4 neighbors
    }

    dfs(sr, sc)
    return image
}

fun main() {
    val img = arrayOf(
        intArrayOf(1, 1, 1),
        intArrayOf(1, 1, 0),
        intArrayOf(1, 0, 1)
    )
    val res = floodFill(img, 1, 1, 2)
    println(res[1][1])
}`,
    testCases: [
      {
        name: 'Flood fill center pixel from 1 to 2',
        input: 'sr=1, sc=1, color=2',
        expected: '2',
        testSnippet: `val img = arrayOf(
    intArrayOf(1, 1, 1),
    intArrayOf(1, 1, 0),
    intArrayOf(1, 0, 1)
)
val res = floodFill(img, 1, 1, 2)
println(res[1][1])`
      }
    ],
    hints: [
      {
        level: 1,
        text: 'Guard against infinite loops if image[sr][sc] == color initially!'
      }
    ],
    solution: {
      code: `fun floodFill(image: Array<IntArray>, sr: Int, sc: Int, color: Int): Array<IntArray> {
    val startColor = image[sr][sc]
    if (startColor == color) return image
    val m = image.size
    val n = image[0].size

    fun dfs(r: Int, c: Int) {
        if (r !in 0 until m || c !in 0 until n || image[r][c] != startColor) return
        image[r][c] = color
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    }

    dfs(sr, sc)
    return image
}`,
      timeComplexity: 'O(m * n) — Pixels visited at most once.',
      spaceComplexity: 'O(m * n) — Recursion stack.',
      pitfalls: ['Forgetting if (startColor == color) return image, which causes infinite mutual recursion between adjacent cells.']
    }
  }
};
