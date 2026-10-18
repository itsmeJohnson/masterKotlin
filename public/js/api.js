/* ==========================================================================
   API & Execution Client
   Integrates with local kotlinc runner or provides honest offline fallback.
   ========================================================================== */

export class ApiClient {
  static baseUrl = '';
  static compilerInfo = {
    available: false,
    version: 'Probing...',
    mode: 'Checking'
  };

  /**
   * Probes backend health and kotlinc compiler status
   */
  static async checkCompilerStatus() {
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        this.compilerInfo = {
          available: data.kotlincAvailable,
          version: data.kotlincVersion || 'kotlinc',
          mode: data.kotlincAvailable ? 'Live JVM Compiler' : 'Compiler Offline'
        };
      } else {
        this.compilerInfo = {
          available: false,
          version: 'Not reachable',
          mode: 'Static Review Mode'
        };
      }
    } catch (e) {
      this.compilerInfo = {
        available: false,
        version: 'Server Disconnected',
        mode: 'Client-Side Evaluation Mode'
      };
    }
    return this.compilerInfo;
  }

  /**
   * Executes Kotlin code via the backend kotlinc runner
   */
  static async executeKotlin(code, stdin = '') {
    // If compiler is known to be available, execute remotely
    try {
      const res = await fetch(`${this.baseUrl}/api/run-kotlin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, stdin })
      });

      if (res.ok) {
        const result = await res.json();
        return {
          verified: true,
          success: result.success,
          stdout: result.stdout || '',
          stderr: result.stderr || '',
          executionTimeMs: result.executionTimeMs || 0,
          compiler: result.compiler || 'kotlinc-jvm 2.1.20',
          exitCode: result.exitCode
        };
      } else {
        const errJson = await res.json().catch(() => ({}));
        return {
          verified: false,
          success: false,
          stdout: '',
          stderr: errJson.error || `Execution failed with HTTP ${res.status}`,
          executionTimeMs: 0,
          compiler: 'Unavailable'
        };
      }
    } catch (networkError) {
      // Honest offline fallback — clearly marked as unverified
      return {
        verified: false,
        success: false,
        stdout: '',
        stderr: `Compiler service offline (${networkError.message}). Live kotlinc compilation requires running the server via npm start.`,
        executionTimeMs: 0,
        compiler: 'Client-Side Static Mode'
      };
    }
  }
}
