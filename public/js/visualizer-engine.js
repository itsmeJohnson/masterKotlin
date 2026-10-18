/* ==========================================================================
   Visualizer Execution Engine
   Generates authentic, step-by-step trace states dynamically from input data.
   ========================================================================== */

export class VisualizerEngine {
  /**
   * Generates step-by-step trace for Longest Substring Without Repeating Characters.
   * Input: string (e.g. "abcba")
   */
  static generateSubstringTrace(s) {
    const chars = s.split('');
    const steps = [];

    // Initial state before loop starts
    steps.push({
      stepIndex: 0,
      phase: 'INITIALIZATION',
      title: 'Initial State Before Iteration',
      chars,
      pointers: { left: 0, right: 0 },
      windowRange: [0, 0],
      activeIndices: [],
      matchedIndices: [],
      variables: {
        's': `"${s}"`,
        's.length': s.length,
        'left': 0,
        'right': 0,
        'maxLen': 0,
        'windowLen': 0
      },
      hashmap: {},
      conditionText: 'Loop begins at right = 0',
      conditionResult: null,
      actionText: 'Allocated HashMap<Char, Int>() and initialized left = 0, maxLen = 0.',
      currentAnswer: 'maxLen = 0',
      pedagogy: 'We place left and right at index 0. The map starts empty. Next, the loop will read the first character.'
    });

    if (s.length === 0) {
      steps.push({
        stepIndex: 1,
        phase: 'COMPLETION',
        title: 'Empty String Base Case',
        chars: [],
        pointers: { left: 0, right: 0 },
        windowRange: [0, -1],
        activeIndices: [],
        matchedIndices: [],
        variables: { 'maxLen': 0 },
        hashmap: {},
        conditionText: 's.isEmpty() == true',
        conditionResult: true,
        actionText: 'Immediately return 0.',
        currentAnswer: 'maxLen = 0',
        pedagogy: 'String length is 0. No iterations needed.'
      });
      return steps;
    }

    let left = 0;
    let maxLen = 0;
    const lastSeen = {};
    let stepCount = 1;

    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      const alreadySeen = Object.prototype.hasOwnProperty.call(lastSeen, ch);
      const prevIndex = alreadySeen ? lastSeen[ch] : -1;
      const willMoveLeft = alreadySeen && prevIndex >= left;

      // 1. Inspecting & evaluating condition step
      steps.push({
        stepIndex: stepCount++,
        phase: 'CONDITION EVALUATION',
        title: `Iteration ${right}: Inspecting '${ch}' at index ${right}`,
        chars,
        pointers: { left, right },
        windowRange: [left, right],
        activeIndices: [right],
        matchedIndices: willMoveLeft ? [prevIndex, right] : [],
        variables: {
          'right': right,
          'ch': `'${ch}'`,
          'left': left,
          'maxLen': maxLen,
          'lastSeen[ch]': alreadySeen ? prevIndex : 'null'
        },
        hashmap: { ...lastSeen },
        conditionText: `lastSeen.containsKey('${ch}')? ${alreadySeen ? `true (seen at index ${prevIndex})` : 'false'}`,
        conditionResult: alreadySeen,
        actionText: willMoveLeft
          ? `Duplicate '${ch}' detected in active window! Next: shift left from ${left} to maxOf(${left}, ${prevIndex} + 1) = ${prevIndex + 1}.`
          : alreadySeen
            ? `'${ch}' was seen at index ${prevIndex}, but that is behind left=${left}. Left does NOT move.`
            : `First time seeing '${ch}'. Window remains clean.`,
        currentAnswer: `Current maxLen so far = ${maxLen}`,
        pedagogy: willMoveLeft
          ? `Because '${ch}' was already seen at index ${prevIndex} within the current window [${left}..${right}], keeping left at ${left} would violate the unique substring requirement. We must advance left past index ${prevIndex}.`
          : `No duplicate conflict inside window [${left}..${right}]. We can safely expand the window rightwards.`
      });

      // Update left pointer if duplicate inside window
      if (alreadySeen) {
        left = Math.max(left, prevIndex + 1);
      }

      // Update map and maxLen
      lastSeen[ch] = right;
      const currentWindowLen = right - left + 1;
      const isNewMax = currentWindowLen > maxLen;
      maxLen = Math.max(maxLen, currentWindowLen);

      // 2. State update step after action
      steps.push({
        stepIndex: stepCount++,
        phase: 'STATE UPDATE',
        title: `Updated Window & Score for index ${right}`,
        chars,
        pointers: { left, right },
        windowRange: [left, right],
        activeIndices: [right],
        matchedIndices: [],
        variables: {
          'right': right,
          'left': left,
          'window': `"${s.substring(left, right + 1)}"`,
          'windowLen (right - left + 1)': `${right} - ${left} + 1 = ${currentWindowLen}`,
          'maxLen': maxLen
        },
        hashmap: { ...lastSeen },
        updatedMapKey: ch,
        conditionText: `currentWindowLen (${currentWindowLen}) > maxLen? ${isNewMax ? 'true' : 'false'}`,
        conditionResult: isNewMax,
        actionText: `Updated lastSeen['${ch}'] = ${right}. ${isNewMax ? `New maxLen record achieved: ${maxLen}!` : `maxLen remains ${maxLen}.`}`,
        currentAnswer: `maxLen = ${maxLen}`,
        pedagogy: `Window is now "${s.substring(left, right + 1)}" (indices ${left} to ${right}). Next, loop moves to right = ${right + 1}.`
      });
    }

    // Final Completion Step
    steps.push({
      stepIndex: stepCount,
      phase: 'COMPLETION',
      title: 'Execution Completed Successfully',
      chars,
      pointers: { left, right: s.length - 1 },
      windowRange: [left, s.length - 1],
      activeIndices: [],
      matchedIndices: [],
      variables: {
        'Final maxLen': maxLen,
        'Total Iterations': s.length,
        'Time Complexity': 'O(n)',
        'Space Complexity': 'O(min(n, m))'
      },
      hashmap: { ...lastSeen },
      conditionText: `right == ${s.length} (loop terminated)`,
      conditionResult: null,
      actionText: `Function returns ${maxLen}. Longest valid unique substring length confirmed.`,
      currentAnswer: `Final Answer = ${maxLen}`,
      pedagogy: `The entire string was scanned in a single linear O(n) pass. The optimal answer is ${maxLen}.`
    });

    return steps;
  }

  /**
   * Generates step-by-step trace for Kadane's Maximum Subarray Sum.
   */
  static generateKadaneTrace(nums) {
    const steps = [];
    if (!nums || nums.length === 0) return steps;

    let currentSum = nums[0];
    let maxSum = nums[0];
    let startIdx = 0;
    let endIdx = 0;
    let tempStart = 0;

    steps.push({
      stepIndex: 0,
      phase: 'INITIALIZATION',
      title: 'Kadane Initialization',
      chars: nums.map(String),
      pointers: { left: 0, right: 0 },
      windowRange: [0, 0],
      variables: {
        'currentSum': currentSum,
        'maxSum': maxSum,
        'i': 0
      },
      hashmap: {},
      conditionText: 'currentSum = nums[0], maxSum = nums[0]',
      conditionResult: null,
      actionText: `Initialized currentSum = ${nums[0]} and maxSum = ${nums[0]}.`,
      currentAnswer: `maxSum = ${maxSum}`,
      pedagogy: 'Start with the first element. We will examine each subsequent number to decide whether to add it or start fresh.'
    });

    for (let i = 1; i < nums.length; i++) {
      const num = nums[i];
      const shouldRestart = num > (currentSum + num);

      if (shouldRestart) {
        currentSum = num;
        tempStart = i;
      } else {
        currentSum += num;
      }

      const isNewMax = currentSum > maxSum;
      if (isNewMax) {
        maxSum = currentSum;
        startIdx = tempStart;
        endIdx = i;
      }

      steps.push({
        stepIndex: i,
        phase: 'ITERATION',
        title: `Index ${i}: Evaluating element ${num}`,
        chars: nums.map(String),
        pointers: { left: tempStart, right: i },
        windowRange: [tempStart, i],
        activeIndices: [i],
        variables: {
          'nums[i]': num,
          'currentSum + nums[i]': `${currentSum - num} + ${num} = ${currentSum}`,
          'currentSum': currentSum,
          'maxSum': maxSum
        },
        hashmap: {},
        conditionText: `nums[i] (${num}) > currentSum + nums[i]? ${shouldRestart ? 'true (restart)' : 'false (extend)'}`,
        conditionResult: shouldRestart,
        actionText: shouldRestart
          ? `Past accumulated sum was negative. Abandon past and restart subarray at index ${i}.`
          : `Extend current subarray sum to ${currentSum}. ${isNewMax ? `New maxSum = ${maxSum}!` : ''}`,
        currentAnswer: `Current maxSum = ${maxSum}`,
        pedagogy: shouldRestart
          ? `Because the previous sum was negative, carrying it forward would only reduce our future sum. Restarting at ${num} is strictly better.`
          : `Carrying forward the previous positive sum improves our cumulative total.`
      });
    }

    steps.push({
      stepIndex: nums.length,
      phase: 'COMPLETION',
      title: 'Kadane Max Subarray Complete',
      chars: nums.map(String),
      pointers: { left: startIdx, right: endIdx },
      windowRange: [startIdx, endIdx],
      activeIndices: [],
      variables: {
        'Final maxSum': maxSum,
        'Best Subarray Range': `[${startIdx}..${endIdx}]`,
        'Time Complexity': 'O(n)'
      },
      hashmap: {},
      conditionText: 'Completed full array pass',
      conditionResult: null,
      actionText: `Maximum contiguous subarray sum is ${maxSum}.`,
      currentAnswer: `Final maxSum = ${maxSum}`,
      pedagogy: `Finished in O(n) time and O(1) space.`
    });

    return steps;
  }
}
