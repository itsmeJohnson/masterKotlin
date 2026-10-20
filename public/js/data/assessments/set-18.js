/* ==========================================================================
   Assessment Set 18: Security, Cryptography & Banking App Hardening
   Focus: Android Keystore StrongBox, Biometric CryptoObject, Certificate Pinning,
          Container With Most Water (Two Pointers O(N)).
   ========================================================================== */

export const ASSESSMENT_SET_18 = {
  id: 'set-18',
  number: 18,
  title: 'Set 18: Security, Cryptography & Banking App Hardening',
  shortTitle: 'Set 18: Security & Cryptography',
  focusArea: 'Keystore StrongBox, Biometric CryptoObject, Certificate Pinning & Two Pointers',
  hackerEarthTrack: 'Algorithms > Two Pointers & Greedy',
  hackerEarthChallenge: 'Code Monk: Container With Most Water in O(N)',
  hackerEarthConcepts: ['Two Pointers Area', 'Greedy Inward Shift', 'Hardware Keystore', 'FLAG_SECURE'],
  difficulty: 'Lead Mobile Engineer / Security Architect',
  durationMinutes: 75,
  badge: 'Security Specialist',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Mobile Security, Keystore & Cryptography',
      shortTitle: 'Security & Keystore',
      icon: '🛡️',
      description: 'Enterprise bank hardening: Android Keystore StrongBox, BiometricPrompt CryptoObject, Cert Pinning, and AES-GCM AEAD.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Multi-account IP address fraud, audit trail trigger DDL, and tamper verification.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Container With Most Water: Maximum Water Capacity in O(N) Time and O(1) Space.',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Hardware Keystore Biometric Authentication with AES-256-GCM CryptoObject.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's18-q1-android-keystore-strongbox',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Hardware Cryptography: Android Keystore TEE vs StrongBox Keymaster',
      prompt: `When generating an encryption key for financial transactions using the Android Keystore:
What is the security difference between standard TEE (Trusted Execution Environment) and <strong>StrongBox Keymaster</strong> (<code>setIsStrongBoxBacked(true)</code>)?`,
      options: [
        { id: 'opt-a', text: 'StrongBox is a software emulator running in the cloud.' },
        { id: 'opt-b', text: 'TEE runs in a secure CPU mode (ARM TrustZone) sharing the main application processor. StrongBox is a physically isolated, tamper-resistant dedicated hardware microcontroller (secure element) with its own isolated CPU, secure RAM, and true hardware random number generator, immune to side-channel CPU cache attacks (Spectre/Meltdown).' },
        { id: 'opt-c', text: 'StrongBox only stores passwords in plain text.' },
        { id: 'opt-d', text: 'TEE requires root access.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'StrongBox uses a separate physical secure microcontroller, preventing side-channel cache attacks on the main CPU.',
        keyConcept: 'ARM TrustZone TEE vs Dedicated StrongBox Hardware',
        detailed: `In Android:
- <strong>TEE (TrustZone):</strong> Secure enclave partitioned on the main application processor. Fast, but shares CPU cache lines with untrusted Android OS.
- <strong>StrongBox (Android 9+):</strong> Completely separate physical chip (like Titan M2 or SmartCard IC). It has internal timers, resistance to physical package decapping, and tamper-resistant storage. Private keys never leave the StrongBox chip.`,
        realWorldPitfall: 'Assuming all devices have StrongBox: if the device does not have the hardware chip, calling `setIsStrongBoxBacked(true)` throws StrongBoxUnavailableException. Always catch and fallback to standard TEE.',
        correctAnswerBreakdown: 'Option B accurately distinguishes shared TrustZone TEE from dedicated physical StrongBox hardware.'
      }
    },
    {
      id: 's18-q2-biometric-crypto-object-binding',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Biometric Security: BiometricPrompt with CryptoObject vs Boolean Callback',
      prompt: `Why is relying on the boolean callback <code>onAuthenticationSucceeded()</code> without passing a <strong>CryptoObject</strong> a critical vulnerability in banking applications?`,
      options: [
        { id: 'opt-a', text: 'BiometricPrompt does not work without CryptoObject.' },
        { id: 'opt-b', text: 'An attacker using Frida or Xposed dynamic instrumentation on a rooted device can easily hook onAuthenticationSucceeded() and invoke it directly, bypassing authentication. Using a CryptoObject initializes a Cipher backed by Keystore with setUserAuthenticationRequired(true); the hardware Keystore physically refuses to release or decrypt the session token unless the biometric sensor cryptographically unlocks the key.' },
        { id: 'opt-c', text: 'CryptoObject prevents screen recording.' },
        { id: 'opt-d', text: 'The boolean callback is deprecated in Android 10.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'CryptoObject cryptographically ties biometric unlock to hardware key release, making Frida hook bypasses impossible.',
        keyConcept: 'Cryptographically Enforced Biometric Authentication',
        detailed: `Hooking Java methods with Frida requires just 3 lines of JavaScript:
<code>BiometricPrompt.AuthenticationCallback.onAuthenticationSucceeded.implementation = function() { this.onAuthenticationSucceeded(null); }</code>
If the app only checks that the callback fired, the attacker bypasses biometric login completely!
When using <code>CryptoObject(cipher)</code>, the app requires the cipher to decrypt the user's banking token. The hardware Keystore refuses to perform cipher operations unless authorized by a hardware-signed biometric token.`,
        realWorldPitfall: 'Using BiometricPrompt just for UI gating without binding it to a hardware cryptographic cipher.',
        correctAnswerBreakdown: 'Option B accurately explains Frida hooking defense via Keystore user authentication binding.'
      }
    },
    {
      id: 's18-q3-certificate-pinning-mitm',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Network Security: Certificate Pinning & MITM Defense',
      prompt: `A financial app uses <code>CertificatePinner</code> in OkHttp to pin the public key hash of its backend servers:
<pre><code>val certificatePinner = CertificatePinner.Builder()
    .add("api.barclays.com", "sha256/k2v6EFvL+FNiET2UVpmJmIzNWKU=")
    .build()</code></pre>
Why must a production banking app always include at least one <strong>Backup Pin</strong> in the pin-set?`,
      options: [
        { id: 'opt-a', text: 'OkHttp requires 2 pins by specification.' },
        { id: 'opt-b', text: 'If the primary server TLS certificate is compromised, revoked, or expires, the backend must rotate certificates. Without a backup pin corresponding to the standby certificate/CA, existing installed apps will permanently reject all TLS connections, bricking the app until an emergency update is approved and released via the Play Store.' },
        { id: 'opt-c', text: 'Backup pins accelerate TLS handshakes.' },
        { id: 'opt-d', text: 'It connects the app to a backup proxy server.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Backup pins prevent app bricking when server TLS certificates expire or are emergency-rotated.',
        keyConcept: 'Certificate Pinning Resilience & Disaster Recovery',
        detailed: `Certificate pinning hardcodes the SHA-256 hash of the Subject Public Key Info (SPKI).
If the server's certificate expires or is revoked after a security breach, rotating the certificate changes the public key hash.
Without a pre-configured backup pin matching the new certificate authority, every TLS handshake fails with <code>SSLPeerUnverifiedException</code>. Millions of users are locked out until an app update is deployed.`,
        realWorldPitfall: 'Pinning only a single leaf certificate without backup intermediate or root CA pins.',
        correctAnswerBreakdown: 'Option B accurately explains the disaster-recovery requirement of backup pins.'
      }
    },
    {
      id: 's18-q4-aes-gcm-vs-cbc-padding-oracle',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Cryptography Standards: AES-GCM (AEAD) vs AES-CBC',
      prompt: `Why has the industry completely standardized on <strong>AES-GCM</strong> (Galois/Counter Mode) over <strong>AES-CBC</strong> for encrypting sensitive financial payloads?`,
      options: [
        { id: 'opt-a', text: 'AES-CBC cannot encrypt strings longer than 16 bytes.' },
        { id: 'opt-b', text: 'AES-GCM is an Authenticated Encryption with Associated Data (AEAD) cipher that computes an authentication tag, verifying both confidentiality and integrity. AES-CBC is vulnerable to bit-flipping attacks and Padding Oracle attacks (POODLE) unless paired with a manual HMAC-SHA256 (Encrypt-then-MAC).' },
        { id: 'opt-c', text: 'AES-GCM is 100x slower than CBC.' },
        { id: 'opt-d', text: 'AES-CBC is not supported in Java.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'AES-GCM provides built-in integrity and authenticity via an authentication tag, preventing padding oracle attacks.',
        keyConcept: 'Authenticated Encryption (AEAD) vs Malleable CBC Mode',
        detailed: `In <code>AES-CBC</code>:
An attacker intercepting the ciphertext can flip bits in the ciphertext, predictably flipping bits in the decrypted plaintext (malleability). Furthermore, error messages disclosing padding failures enable <strong>Padding Oracle</strong> attacks that recover the full plaintext without knowing the key!
<code>AES-GCM</code> generates a 128-bit authentication tag. If even 1 bit of ciphertext is altered, decryption immediately throws <code>AEADBadTagException</code> and decrypts nothing.`,
        realWorldPitfall: 'Reusing the same Initialization Vector (IV/Nonce) with AES-GCM under the same key completely destroys security, exposing the key stream.',
        correctAnswerBreakdown: 'Option B accurately describes AEAD integrity tags and padding oracle vulnerabilities.'
      }
    },
    {
      id: 's18-q5-flag-secure-screen-protection',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Data Leakage Defense: WindowManager.LayoutParams.FLAG_SECURE',
      prompt: `What specific operating system behaviors are prevented when an Android banking activity sets:
<pre><code>window.setFlags(
    WindowManager.LayoutParams.FLAG_SECURE,
    WindowManager.LayoutParams.FLAG_SECURE
)</code></pre>`,
      options: [
        { id: 'opt-a', text: 'It prevents network traffic from being logged in Logcat.' },
        { id: 'opt-b', text: 'It prevents the OS from capturing screenshot images of the window, masks the app screen in the Recent Apps (Task Switcher) overview preview, and blocks external screen recording and non-secure display mirroring.' },
        { id: 'opt-c', text: 'It encrypts the SQLite database.' },
        { id: 'opt-d', text: 'It disables app permissions.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'FLAG_SECURE blocks screenshots, masks task switcher preview snapshots, and disables insecure display streaming.',
        keyConcept: 'Window Security & Recent Apps Cache Protection',
        detailed: `When a user switches apps, Android takes a snapshot of the current window and saves it to disk (in <code>/data/system_ce/0/snapshots/</code>) to display in the Recent Apps switcher.
If account balances or credit card CVVs are visible, this snapshot is a major data leak.
<code>FLAG_SECURE</code> instructs the Android SurfaceFlinger compositor:
1. Block user screenshots (throws "Can't take screenshot due to security policy").
2. Show a blank white/black card in Recent Apps.
3. Block unencrypted HDMI/Miracast screen casting.`,
        realWorldPitfall: 'Forgetting FLAG_SECURE on login or OTP screens allows malicious malware apps with MediaProjection permissions to record user PINs.',
        correctAnswerBreakdown: 'Option B accurately details screenshot prevention and Task Switcher masking.'
      }
    },
    {
      id: 's18-q6-secure-random-vs-random',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Cryptographic Hygiene: java.security.SecureRandom vs java.util.Random',
      prompt: `Why is using <code>java.util.Random</code> strictly forbidden for generating transaction IDs, OTPs, or cryptographic salts in financial applications?`,
      options: [
        { id: 'opt-a', text: 'java.util.Random crashes on 64-bit devices.' },
        { id: 'opt-b', text: 'java.util.Random is a Linear Congruential Generator (LCG) using a 48-bit seed. Observing just two consecutive outputs allows an attacker to mathematically deduce the seed and predict all past and future generated numbers. SecureRandom uses OS entropy (/dev/urandom) providing cryptographically strong non-deterministic randomness.' },
        { id: 'opt-c', text: 'Random requires internet connectivity.' },
        { id: 'opt-d', text: 'SecureRandom only produces prime numbers.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'java.util.Random is mathematically predictable from minimal output samples; SecureRandom utilizes OS entropy.',
        keyConcept: 'Cryptographically Secure Pseudorandom Number Generators (CSPRNG)',
        detailed: `<code>java.util.Random</code> uses the formula:
$$X_{n+1} = (aX_n + c) \\pmod m$$
An attacker observing two OTP values generated by <code>java.util.Random</code> can calculate the internal seed in milliseconds and predict the OTP of the next user!
<code>SecureRandom</code> draws entropy from physical hardware noise and Linux kernel <code>/dev/urandom</code>, passing FIPS 140-2 compliance.`,
        realWorldPitfall: 'Generating Session IDs or CSRF tokens with `Random().nextInt()` makes authentication tokens forgeable.',
        correctAnswerBreakdown: 'Option B accurately contrasts LCG seed predictability with OS CSPRNG entropy.'
      }
    },
    {
      id: 's18-q7-root-detection-vectors',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Mobile Hardening: Root & Magisk/Zygisk Detection Vectors',
      prompt: `Which combination of checks constitutes a robust, defense-in-depth root detection strategy on modern Android devices?`,
      options: [
        { id: 'opt-a', text: 'Checking if the user is connected to Wi-Fi.' },
        { id: 'opt-b', text: '1) Checking for known su binary paths (/system/xbin/su, /sbin/su), 2) Checking Build.TAGS containing "test-keys", 3) Attempting to open a Unix domain socket to Magisk daemons, 4) Verifying system partition mount flags for Read-Write (RW), and 5) Google Play Integrity API server-side verification.' },
        { id: 'opt-c', text: 'Checking if Developer Options is enabled.' },
        { id: 'opt-d', text: 'Root detection is obsolete in Android 14.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Robust root detection combines file heuristics, partition flags, daemon probing, and Play Integrity API attestation.',
        keyConcept: 'Defense-in-Depth Root & Tamper Detection',
        detailed: `Modern root tools (Magisk, KernelSU, APatch) use root-hiding techniques (Zygisk modules) to hide su binaries.
A multi-layered defense involves:
- File checks for su / busybox.
- <code>Build.TAGS</code> and props (<code>ro.debuggable</code>, <code>ro.secure</code>).
- Inspecting <code>/proc/mounts</code> for RW system mounts.
- <strong>Google Play Integrity API:</strong> Cryptographic server-side hardware-attested token verifying genuine unrooted Google-certified devices.`,
        realWorldPitfall: 'Relying exclusively on client-side root checks: attackers hook client root detection functions in 2 seconds with Frida.',
        correctAnswerBreakdown: 'Option B outlines complete multi-layered root detection.'
      }
    },
    {
      id: 's18-q8-cleartext-traffic-manifest',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Network Security: android:usesCleartextTraffic and NetworkSecurityConfig',
      prompt: `Since Android 9 (API 28), <code>android:usesCleartextTraffic</code> defaults to <code>false</code>.
What happens if a developer mistakenly sets <code>android:usesCleartextTraffic="true"</code> in a production banking manifest?`,
      options: [
        { id: 'opt-a', text: 'The app is rejected by the Android compiler.' },
        { id: 'opt-b', text: 'It permits unencrypted HTTP connections across the entire app, exposing customer session tokens and credentials to passive eavesdropping and packet sniffing on public Wi-Fi networks. Production apps must enforce strict HTTPS via NetworkSecurityConfig.' },
        { id: 'opt-c', text: 'It disables Wi-Fi connections.' },
        { id: 'opt-d', text: 'It enables TLS 1.3.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Enabling usesCleartextTraffic allows unencrypted HTTP, exposing user data to MITM packet sniffing.',
        keyConcept: 'Cleartext Traffic Restrictions & NetworkSecurityConfig',
        detailed: `Leaving cleartext traffic enabled allows third-party advertising SDKs or buggy internal endpoints to transmit sensitive data over unencrypted <code>http://</code>.
Anyone on the same coffee shop Wi-Fi network running Wireshark can capture the plain text banking credentials.
Banking apps must enforce <code>&lt;base-config cleartextTrafficPermitted="false" /&gt;</code> in <code>res/xml/network_security_config.xml</code>.`,
        realWorldPitfall: 'Enabling cleartext traffic globally to debug an internal staging endpoint in release builds.',
        correctAnswerBreakdown: 'Option B accurately highlights public Wi-Fi packet sniffing risks.'
      }
    },

    // DBMS Section
    {
      id: 's18-q9-multi-account-ip-fraud',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Credential Stuffing Detection (IP Associated with 3+ Accounts in 1 Hour)',
      prompt: `Identify all suspicious IP addresses that were used to log into <strong>3 or more distinct accounts</strong> within any 1-hour window.
<br/><br/>
<strong>Return:</strong>
- <code>ip_address</code>, <code>distinct_accounts_count</code>.
- Order by <code>distinct_accounts_count DESC</code>.`,
      schemaContext: `Table: login_audit (audit_id, account_id, ip_address, status, timestamp)`,
      expectedColumns: ['ip_address', 'distinct_accounts_count'],
      validationType: 'credential_stuffing_ip_detection',
      sampleSolution: `SELECT 
    l1.ip_address,
    COUNT(DISTINCT l1.account_id) AS distinct_accounts_count
FROM login_audit l1
WHERE l1.timestamp >= datetime('now', '-1 hour')
GROUP BY l1.ip_address
HAVING COUNT(DISTINCT l1.account_id) >= 3
ORDER BY distinct_accounts_count DESC;`,
      marks: 10,
      explanation: {
        summary: 'GROUP BY ip_address with COUNT(DISTINCT account_id) >= 3 flags automated credential stuffing attacks.',
        keyConcept: 'Credential Stuffing & Botnet IP Clustering',
        detailed: `When cybercriminals attempt password spraying attacks against thousands of accounts using automated bots, they reuse IP proxy nodes. Aggregating distinct accounts per IP address in short time windows isolates attacking botnet egress nodes for firewall IP blocking.`,
        realWorldPitfall: 'Using COUNT(audit_id) instead of COUNT(DISTINCT account_id): a single legitimate user logging in 3 times is not an attack.',
        correctAnswerBreakdown: 'COUNT(DISTINCT account_id) >= 3 per IP.'
      }
    },
    {
      id: 's18-q10-audit-tamper-proof-trigger',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: DDL Trigger Enforcing Immutable Audit Logs',
      prompt: `Write SQLite DDL to create a <strong>BEFORE UPDATE OR DELETE Trigger</strong> on the <code>security_audit_log</code> table that completely prohibits any updates or deletions, raising an error with message <code>'Audit logs are strictly immutable'</code>.`,
      schemaContext: `Table: security_audit_log (log_id, account_id, action, timestamp)`,
      expectedColumns: ['query_status'],
      validationType: 'immutable_audit_trigger_ddl',
      sampleSolution: `CREATE TRIGGER prevent_audit_tampering
BEFORE UPDATE ON security_audit_log
BEGIN
    SELECT RAISE(ABORT, 'Audit logs are strictly immutable');
END;`,
      marks: 10,
      explanation: {
        summary: 'RAISE(ABORT, message) in a BEFORE trigger aborts any unauthorized update or deletion at the engine level.',
        keyConcept: 'WORM (Write-Once, Read-Many) Database Triggers',
        detailed: `Regulatory compliance (SOX, PCI-DSS, GDPR) mandates that audit trails must be immutable. Even a rogue DBA or compromised application cannot modify historical security records when a <code>BEFORE UPDATE</code> trigger calls <code>RAISE(ABORT)</code>.`,
        realWorldPitfall: 'Relying on application-level checks to protect audit tables: direct SQL injection can delete logs if not guarded by triggers.',
        correctAnswerBreakdown: 'CREATE TRIGGER ... BEFORE UPDATE ... SELECT RAISE(ABORT, ...).'
      }
    },
    {
      id: 's18-q11-consecutive-login-velocity',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Impossible Travel Time Velocity (Login from 2 Countries in 1 Hour)',
      prompt: `Detect "Impossible Travel" account takeovers: find all accounts that logged in from <strong>two different countries</strong> within <strong>less than 60 minutes</strong> (3600 seconds) of each other.
<br/><br/>
<strong>Return:</strong>
- <code>l1.account_id</code>, <code>l1.country AS origin_country</code>, <code>l2.country AS destination_country</code>, and <code>minute_diff</code>.`,
      schemaContext: `Table: login_audit (audit_id, account_id, country, timestamp)`,
      expectedColumns: ['account_id', 'origin_country', 'destination_country', 'minute_diff'],
      validationType: 'impossible_travel_detection',
      sampleSolution: `SELECT 
    l1.account_id,
    l1.country AS origin_country,
    l2.country AS destination_country,
    ROUND((strftime('%s', l2.timestamp) - strftime('%s', l1.timestamp)) / 60.0, 1) AS minute_diff
FROM login_audit l1
JOIN login_audit l2 ON l1.account_id = l2.account_id
    AND l1.country != l2.country
    AND strftime('%s', l2.timestamp) >= strftime('%s', l1.timestamp)
    AND (strftime('%s', l2.timestamp) - strftime('%s', l1.timestamp)) <= 3600
ORDER BY l1.account_id, minute_diff ASC;`,
      marks: 10,
      explanation: {
        summary: 'Self-join matching distinct countries within 3600 seconds isolates physically impossible travel events.',
        keyConcept: 'Impossible Travel Velocity Security Analytics',
        detailed: `If an account logs in from the United Kingdom at 10:00 AM and from Singapore at 10:20 AM, a human cannot physically fly between them in 20 minutes. This indicates stolen session credentials or VPN relaying.`,
        realWorldPitfall: 'Comparing identical countries: must enforce `l1.country != l2.country`.',
        correctAnswerBreakdown: 'Self-join on distinct countries and epoch delta <= 3600.'
      }
    },
    {
      id: 's18-q12-daily-net-liquidity-reserve',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Daily Net Cash Inflow vs Outflow',
      prompt: `Calculate the daily net liquidity flow for the current calendar month:
- Total Credits (Inflow)
- Total Debits (Outflow)
- Net Liquidity Delta = Credits - Debits
<br/>
<strong>Return:</strong>
- <code>txn_date</code>, <code>total_inflow</code>, <code>total_outflow</code>, <code>net_liquidity</code>.
- Order by <code>txn_date ASC</code>.`,
      schemaContext: `Table: transactions (transaction_id, amount, transaction_type, status, timestamp)`,
      expectedColumns: ['txn_date', 'total_inflow', 'total_outflow', 'net_liquidity'],
      validationType: 'daily_liquidity_reserve',
      sampleSolution: `SELECT 
    date(timestamp) AS txn_date,
    ROUND(SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END), 2) AS total_inflow,
    ROUND(SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END), 2) AS total_outflow,
    ROUND(SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE -amount END), 2) AS net_liquidity
FROM transactions
WHERE status = 'COMPLETED'
GROUP BY txn_date
ORDER BY txn_date ASC;`,
      marks: 10,
      explanation: {
        summary: 'Pivoting inflows and outflows with conditional sums produces daily liquidity reports.',
        keyConcept: 'Bank Treasury Liquidity Reporting',
        detailed: `Treasury desks monitor daily cash reserve ratios to ensure overnight interbank lending limits are satisfied. Aggregating signed sums partitioned by calendar date generates accurate cash positions.`,
        realWorldPitfall: 'Using separate queries for debit and credit: double scans the transaction table.',
        correctAnswerBreakdown: 'Conditional SUMs for inflow, outflow, and net liquidity grouped by date.'
      }
    },
    {
      id: 's18-q13-token-rotation-expiry-update',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Revoke All Active Tokens upon Password Reset',
      prompt: `When a customer executes a password reset, all existing mobile refresh tokens must be immediately invalidated.
Write an SQL <code>UPDATE</code> statement to set <code>is_revoked = 1</code> and <code>revoked_at = datetime('now')</code> for all active tokens belonging to account <code>'ACC-101'</code>.`,
      schemaContext: `Table: auth_tokens (token_id, account_id, is_revoked, revoked_at)`,
      expectedColumns: ['query_status'],
      validationType: 'revoke_tokens_password_reset',
      sampleSolution: `UPDATE auth_tokens 
SET is_revoked = 1,
    revoked_at = datetime('now')
WHERE account_id = 'ACC-101' AND is_revoked = 0;`,
      marks: 10,
      explanation: {
        summary: 'Mass invalidation of active tokens enforces session security upon credential change.',
        keyConcept: 'Token Revocation & Session Invalidation',
        detailed: `NIST digital identity guidelines require that password resets immediately revoke all issued JWT and OAuth refresh tokens across all enrolled devices to sever active attacker sessions.`,
        realWorldPitfall: 'Omitting `WHERE is_revoked = 0` overwrites the original `revoked_at` timestamp of previously revoked tokens.',
        correctAnswerBreakdown: 'UPDATE auth_tokens SET is_revoked = 1, revoked_at = datetime(\'now\') WHERE account_id = ? AND is_revoked = 0.'
      }
    },

    // DSA Coding Section
    {
      id: 's18-q14-container-with-most-water',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: Container With Most Water in O(N) Time and O(1) Space',
      prompt: `You are given an integer array <code>height</code> of length $N$. There are $N$ vertical lines drawn such that the two endpoints of the $i^{\\text{th}}$ line are $(i, 0)$ and $(i, \\text{height}[i])$.
Find two lines that together with the x-axis form a container, such that the container contains the most water.
Return the <strong>maximum amount of water</strong> a container can store.
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in <strong>$O(N)$ time</strong>.
- $O(N^2)$ brute force will <strong>Fail All Tests</strong>.
- Auxiliary space must be <strong>$O(1)$</strong>.
- $2 \\le N \\le 10^5$, $0 \\le height[i] \\le 10^4$.
<br/><br/>
<strong>Input Format:</strong>
Line 1: $N$<br/>
Line 2: $N$ space-separated non-negative integers.<br/>
<strong>Output Format:</strong>
A single integer representing the maximum water capacity.`,
      difficulty: 'Medium',
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
        int[] height = new int[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            height[i] = Integer.parseInt(st.nextToken());
        }
        
        System.out.println(maxArea(height));
    }

    public static long maxArea(int[] height) {
        if (height == null || height.length < 2) return 0;
        
        int left = 0;
        int right = height.length - 1;
        long maxWater = 0;
        
        // Two Pointers converging inward
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int width = right - left;
            long currentArea = (long) h * width;
            
            if (currentArea > maxWater) {
                maxWater = currentArea;
            }
            
            // Move pointer pointing to shorter line (greedy choice)
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxWater;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: '9\n1 8 6 2 5 4 8 3 7',
          expectedOutput: '49',
          isSample: true
        },
        {
          id: 'tc-2',
          input: '2\n1 1',
          expectedOutput: '1',
          isSample: true
        },
        {
          id: 'tc-3',
          input: '4\n4 3 2 1 4',
          expectedOutput: '16',
          isSample: false
        },
        {
          id: 'tc-4',
          input: '5\n1 2 4 3',
          expectedOutput: '4',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Start with maximum width (left = 0, right = n - 1); greedily shift the shorter pointer inward to search for taller boundaries in O(N) time.',
        keyConcept: 'Greedy Two-Pointer Inward Contraction',
        detailed: `The area between lines at $i$ and $j$ is $(j - i) \\times \\min(\\text{height}[i], \\text{height}[j])$.
1. Start with widest container: <code>left = 0</code>, <code>right = n - 1</code>.
2. In each step, the width $(j - i)$ will inevitably decrease by 1.
3. To achieve a larger area, the new minimum height must increase!
4. The height of the current container is bounded by the <strong>shorter</strong> line. Shifting the taller line inward cannot possibly increase the area (width decreases, height is still capped by the shorter line).
5. Therefore, we must greedily shift the <strong>shorter</strong> pointer inward!
This evaluates the optimal solution in strictly $O(N)$ time and $O(1)$ space.`,
        realWorldPitfall: 'Using 32-bit int: width * height can overflow standard int for large constraints, use `long`.',
        correctAnswerBreakdown: 'O(N) time with O(1) auxiliary space using two pointers.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's18-q15-keystore-aes-gcm-biometric-pipeline',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: Hardware Keystore AES-256-GCM Biometric CryptoObject Pipeline',
      prompt: `Implement a complete, production-grade <strong>Biometric Banking Vault</strong>:
1. Generate an AES-256-GCM key inside Android Keystore configured with:
   - <code>KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT</code>
   - <code>setUserAuthenticationRequired(true)</code> (key invalidated on lock/biometric change).
2. Initialize <code>Cipher</code> and wrap it in a <code>BiometricPrompt.CryptoObject</code>.
3. Authenticate with <code>BiometricPrompt</code> and securely encrypt/decrypt the customer's OAuth access token.`,
      marks: 40,
      evaluationCriteria: [
        'Configures KeyGenParameterSpec with AES-GCM and setUserAuthenticationRequired(true)',
        'Wraps Cipher in BiometricPrompt.CryptoObject',
        'Handles user authentication success and performs cipher.doFinal() safely',
        'Demonstrates proper IV / Nonce extraction and storage'
      ],
      sampleSolution: `class BiometricBankingVault(private val context: Context) {

    private val keyStore: KeyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
    private val keyAlias = "BankingVaultMasterKey"

    fun getOrCreateMasterKey(): SecretKey {
        if (!keyStore.containsAlias(keyAlias)) {
            val keyGenerator = KeyGenerator.getInstance(
                KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore"
            )
            val spec = KeyGenParameterSpec.Builder(
                keyAlias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .setUserAuthenticationRequired(true) // Requires fingerprint/face unlock!
                .setInvalidatedByBiometricEnrollment(true) // Revokes key if new fingerprint added!
                .build()

            keyGenerator.init(spec)
            keyGenerator.generateKey()
        }
        return keyStore.getKey(keyAlias, null) as SecretKey
    }

    fun createEncryptCryptoObject(): BiometricPrompt.CryptoObject {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateMasterKey())
        return BiometricPrompt.CryptoObject(cipher)
    }

    fun createDecryptCryptoObject(iv: ByteArray): BiometricPrompt.CryptoObject {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val spec = GCMParameterSpec(128, iv)
        cipher.init(Cipher.DECRYPT_MODE, getOrCreateMasterKey(), spec)
        return BiometricPrompt.CryptoObject(cipher)
    }
}`,
      explanation: {
        summary: 'Android Keystore with setUserAuthenticationRequired(true) and setInvalidatedByBiometricEnrollment(true) enforces hardware-level biometric defense.',
        keyConcept: 'Biometric Keystore Binding & Enrollment Invalidation',
        detailed: `In enterprise banking apps:
1. <code>setUserAuthenticationRequired(true)</code> guarantees the private key cannot be accessed until the user scans their fingerprint.
2. <code>setInvalidatedByBiometricEnrollment(true)</code> is critical: if an attacker steals an unlocked phone and registers their own fingerprint in Android Settings, Android Keystore automatically and permanently destroys the master key, preventing unauthorized wallet access!`,
        realWorldPitfall: 'Forgetting setInvalidatedByBiometricEnrollment(true): an attacker who learns the phone PIN can add their fingerprint and drain the bank account.',
        correctAnswerBreakdown: 'KeyGenParameterSpec with AES-GCM, user authentication required, and enrollment invalidation.'
      }
    }
  ]
};
