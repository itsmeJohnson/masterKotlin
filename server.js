const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3456;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { etag: false, maxAge: 0 }));

// Verify kotlinc availability
let kotlincAvailable = false;
let kotlincVersion = 'Unknown';
let kotlincBinary = 'kotlinc';

function probeKotlinc() {
  const candidates = ['kotlinc', '/usr/local/bin/kotlinc', '/opt/homebrew/bin/kotlinc'];
  for (const bin of candidates) {
    try {
      const out = require('child_process').execSync(`${bin} -version 2>&1`, { encoding: 'utf8' });
      if (out.includes('kotlinc-jvm') || out.includes('info: kotlinc')) {
        kotlincAvailable = true;
        kotlincVersion = out.trim();
        kotlincBinary = bin;
        console.log(`[Kotlin Engine] Detected: ${kotlincVersion} at ${bin}`);
        return;
      }
    } catch (e) {
      // try next candidate
    }
  }
  console.log('[Kotlin Engine] kotlinc not detected. Web runner fallback active.');
}

probeKotlinc();

// Health & Compiler Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    kotlincAvailable,
    kotlincVersion,
    platform: os.platform(),
    timestamp: new Date().toISOString()
  });
});

// Execute Kotlin snippet safely
app.post('/api/run-kotlin', (req, res) => {
  const { code, stdin = '' } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Code string is required.' });
  }

  if (!kotlincAvailable) {
    return res.status(503).json({
      error: 'Local kotlinc compiler is not running or available on this host.',
      kotlincAvailable: false
    });
  }

  // Create temporary script file
  const tmpDir = path.join(os.tmpdir(), 'kotlin-mastery-lab');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const scriptId = `script_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.kts`;
  const scriptPath = path.join(tmpDir, scriptId);

  // If code defines fun main, make sure it gets invoked in .kts script mode if no top-level call exists
  let executableCode = code;
  const hasZeroArgMain = /fun\s+main\s*\(\s*\)/.test(code);
  const hasParamMain = /fun\s+main\s*\([^)]+\)/.test(code);
  const codeWithoutMainDecl = code.replace(/fun\s+main\s*\([^)]*\)/g, '');
  const alreadyInvokesMain = /\bmain\s*\(/.test(codeWithoutMainDecl);

  // If there's an explicit top-level test runner snippet at the end (like println(...)), don't auto-invoke main
  const hasTopLevelPrintln = code.split('\n').some(l => {
    const trimmed = l.trim();
    return (trimmed.startsWith('println(') || trimmed.startsWith('print(')) && !l.startsWith('  ') && !l.startsWith('\t');
  });

  if (!alreadyInvokesMain && !hasTopLevelPrintln) {
    if (hasParamMain) {
      executableCode = `${code}\n\nmain(emptyArray<String>())\n`;
    } else if (hasZeroArgMain) {
      executableCode = `${code}\n\nmain()\n`;
    }
  }

  fs.writeFileSync(scriptPath, executableCode, 'utf8');

  const startTime = Date.now();
  const child = spawn(kotlincBinary, ['-script', scriptPath], {
    timeout: 12000
  });

  let stdout = '';
  let stderr = '';
  let killedDueToTimeout = false;

  const timer = setTimeout(() => {
    killedDueToTimeout = true;
    child.kill('SIGKILL');
  }, 12000);

  if (stdin) {
    child.stdin.write(stdin);
    child.stdin.end();
  } else {
    child.stdin.end();
  }

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('close', (exitCode) => {
    clearTimeout(timer);
    const executionTimeMs = Date.now() - startTime;

    // Clean up temp file
    try {
      if (fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
      }
    } catch (e) {
      // ignore cleanup errors
    }

    if (killedDueToTimeout) {
      return res.json({
        success: false,
        exitCode: -1,
        stdout,
        stderr: 'Execution timed out (12-second limit exceeded). Check for infinite loops or blocking operations.',
        executionTimeMs,
        isTimeout: true,
        compiler: kotlincVersion
      });
    }

    // Filter out standard kotlinc harmless warnings from stderr if it compiled ok
    const cleanStderr = stderr
      .split('\n')
      .filter(l => !l.startsWith('info: kotlinc-jvm') && !l.includes('Picked up JAVA_TOOL_OPTIONS'))
      .join('\n')
      .trim();

    res.json({
      success: exitCode === 0,
      exitCode,
      stdout,
      stderr: cleanStderr,
      executionTimeMs,
      compiler: kotlincVersion
    });
  });

  child.on('error', (err) => {
    clearTimeout(timer);
    try {
      if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
    } catch (e) {}

    res.status(500).json({
      success: false,
      error: `Failed to execute process: ${err.message}`,
      compiler: kotlincVersion
    });
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Kotlin & Android Mastery Lab — Tesco / Barclays Prep `);
  console.log(` Server running on http://localhost:${PORT} `);
  console.log(`=======================================================`);
});
