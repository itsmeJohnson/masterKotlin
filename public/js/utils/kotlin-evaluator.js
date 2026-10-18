/* ==========================================================================
   Static Code Analyzer & Tutor Reviewer
   Reviews Kotlin submissions for logic anti-patterns, off-by-one errors,
   and performance pitfalls.
   ========================================================================== */

export class KotlinEvaluator {
  /**
   * Analyzes user code for common architectural, algorithmic, and syntax anti-patterns
   */
  static analyzeCode(code, problemId) {
    const feedback = [];
    const lines = code.split('\n');

    // Rule 1: Check for off-by-one window length
    if (problemId === 'ex-substring-abcba') {
      const hasRightMinusLeft = code.includes('right - left');
      const hasPlusOne = code.includes('right - left + 1') || code.includes('right - left +1');
      if (hasRightMinusLeft && !hasPlusOne) {
        feedback.push({
          type: 'error',
          title: 'Off-By-One Index Bug in Window Length',
          line: lines.findIndex(l => l.includes('right - left')) + 1,
          message: 'Found `right - left`. Remember that 0-based inclusive ranges require `right - left + 1`. For example, from index 0 to 2 has 3 elements (0, 1, 2).'
        });
      }

      // Rule 2: Check for left jumping backwards
      const hasDirectLeftAssign = /left\s*=\s*\w+\[\w+\]\s*\+\s*1/.test(code);
      const hasMaxOf = code.includes('maxOf(left,') || code.includes('Math.max(left,');
      if (hasDirectLeftAssign && !hasMaxOf) {
        feedback.push({
          type: 'warning',
          title: 'Potential Left Pointer Regression Bug',
          line: lines.findIndex(l => /left\s*=/.test(l)) + 1,
          message: 'Found direct assignment to `left`. If duplicate character was seen at an index before the current left pointer, left will move backwards! Use `left = maxOf(left, map[ch]!! + 1)`.'
        });
      }

      // Rule 3: Check for substring allocation inside loop
      if (code.includes('.substring(')) {
        feedback.push({
          type: 'performance',
          title: 'Unnecessary String Allocation in O(n) Loop',
          line: lines.findIndex(l => l.includes('.substring(')) + 1,
          message: 'Allocating `.substring()` inside the loop creates new String objects on each iteration, degrading space complexity and triggering garbage collection.'
        });
      }
    }

    // General Kotlin rules
    lines.forEach((line, idx) => {
      // Check for !! non-null assertion
      if (line.includes('!!') && !line.includes('map[')) {
        feedback.push({
          type: 'warning',
          title: 'Unsafe Non-Null Assertion (!!)',
          line: idx + 1,
          message: 'Kotlin best practice encourages safe calls (`?.`), Elvis operator (`?:`), or `checkNotNull()` instead of `!!` to avoid NullPointerExceptions in production.'
        });
      }

      // Check for var that could be val
      if (/var\s+(s|input|target)\s*[:=]/.test(line)) {
        feedback.push({
          type: 'style',
          title: 'Immutability Suggestion',
          line: idx + 1,
          message: 'Parameters or fixed inputs should be declared with `val` for immutability.'
        });
      }
    });

    if (feedback.length === 0) {
      feedback.push({
        type: 'success',
        title: 'Clean Code & Structure Verified',
        line: 1,
        message: 'No common off-by-one errors, pointer regressions, or unsafe allocations detected. Excellent Kotlin idiom usage!'
      });
    }

    return feedback;
  }
}
