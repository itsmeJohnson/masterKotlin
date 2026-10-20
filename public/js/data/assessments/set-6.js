/* ==========================================================================
   Assessment Set 6: Mobile Security, Cryptography & FTS5 Search
   Focus: Android Keystore, BiometricPrompt CryptoObject, Certificate Pinning,
          SQLite FTS5 Full Text Search, and Top K Frequent Merchants.
   ========================================================================== */

export const ASSESSMENT_SET_6 = {
  id: 'set-6',
  number: 6,
  title: 'Set 6: Security, Keystore Cryptography & FTS5 Search',
  shortTitle: 'Set 6: Security & Keystore',
  focusArea: 'Keystore AES-GCM, BiometricPrompt, Certificate Pinning & Top K Frequent',
  hackerEarthTrack: 'Data Structures > Heaps & Priority Queues',
  hackerEarthChallenge: 'Code Monk: Monk and Champions League / Top K Frequent',
  hackerEarthConcepts: ['Min-Heap', 'Max-Heap', 'Top-K Elements', 'Keystore Cryptography', 'FTS5 Full-Text Search'],
  difficulty: 'Senior Mobile Engineer (Security & FinTech)',
  durationMinutes: 60,
  badge: 'Security & Cryptography',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Android & Kotlin Engineering',
      shortTitle: 'Android & Kotlin',
      icon: '🤖',
      description: 'Android Keystore, Biometrics, Certificate Pinning, ProGuard R8, and DataStore.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & SQLite / Room Queries',
      shortTitle: 'DBMS & Room',
      icon: '🗄️',
      description: 'SQLite FTS5 virtual tables, PAN card masking, audit trail diffs, and WAL mode.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Top K Frequent Transaction Merchants (Min-Heap / Bucket Sort O(N log K)).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Hardware-Backed Biometric Security Vault with Android Keystore.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's6-q1-android-keystore-hardware',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Android Security: Hardware-Backed Keystore vs Software Keys',
      prompt: `Why is generating cryptographic keys inside the <strong>Android Keystore</strong> (with <code>setUserAuthenticationRequired(true)</code>) significantly more secure than storing AES keys in code or files?`,
      options: [
        { id: 'opt-a', text: 'Android Keystore keys are stored on Google Cloud servers.' },
        { id: 'opt-b', text: 'Keystore private/secret key material resides in a dedicated hardware chip (Secure Element / StrongBox / TEE) and never enters the application process memory, preventing extraction even on rooted devices.' },
        { id: 'opt-c', text: 'Keystore keys never expire.' },
        { id: 'opt-d', text: 'It compresses the key to 16 bytes.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Android Keystore delegates cryptographic operations to hardware (TEE / StrongBox) so key material is never exposed in RAM.',
        keyConcept: 'Hardware-Backed Android Keystore (TEE & StrongBox)',
        detailed: `In top-tier mobile banking, cryptographic private keys must never reside in process RAM where memory dump tools or rooted malware can inspect them.
The **Android Keystore provider** performs encryption/decryption inside the hardware **Trusted Execution Environment (TEE)** or **StrongBox Keymaster**. The app only receives the encrypted ciphertext.`,
        realWorldPitfall: 'Hardcoding encryption keys in C++ NDK shared libraries: attackers easily extract them using `strings` or Ghidra.',
        correctAnswerBreakdown: 'Option B accurately explains hardware boundary isolation.'
      }
    },
    {
      id: 's6-q2-biometric-crypto-object',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Biometric Security: BiometricPrompt.CryptoObject Authentication',
      prompt: `In high-value banking fund transfers, why is authenticating with <code>BiometricPrompt.authenticate(promptInfo, CryptoObject(cipher))</code> strictly required over calling <code>BiometricPrompt.authenticate(promptInfo)</code> without a CryptoObject?`,
      options: [
        { id: 'opt-a', text: 'Calling without CryptoObject displays a low-resolution fingerprint icon.' },
        { id: 'opt-b', text: 'Without CryptoObject, a hooked or rooted device running Frida/Xposed can easily bypass authentication by hooking onAuthenticationSucceeded(). CryptoObject cryptographically unlocks the Cipher only upon genuine hardware biometric match.' },
        { id: 'opt-c', text: 'CryptoObject is required for face unlock but not fingerprint.' },
        { id: 'opt-d', text: 'Android 14 disallows calling BiometricPrompt without parameters.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'CryptoObject binds the biometric hardware match to the cryptographic key unlock, preventing Frida hook bypasses.',
        keyConcept: 'Biometric Cryptographic Binding',
        detailed: `If you authenticate without <code>CryptoObject</code>, the app relies purely on the boolean callback <code>onAuthenticationSucceeded()</code>. Attackers use dynamic instrumentation (Frida) to invoke this method directly!
With <code>CryptoObject(cipher)</code>, the Keystore key remains locked by the hardware security module until the fingerprint sensor verifies the biometric. If hooked, the cipher cannot decrypt the transfer payload, preventing fraud.`,
        realWorldPitfall: 'Relying on boolean flags like `isUserAuthenticated = true` in memory after biometric callback.',
        correctAnswerBreakdown: 'Option B is the fundamental security difference.'
      }
    },
    {
      id: 's6-q3-certificate-pinning',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Network Security: OkHttp Certificate Pinning & Backup Pins',
      prompt: `When configuring OkHttp <code>CertificatePinner</code> for bank API endpoints:
<pre><code>val certificatePinner = CertificatePinner.Builder()
    .add("api.bank.com", "sha256/PRIMARY_KEY_PIN...")
    .add("api.bank.com", "sha256/BACKUP_KEY_PIN...")
    .build()</code></pre>
Why is registering at least one <strong>backup pin</strong> strictly required by security standards?`,
      options: [
        { id: 'opt-a', text: 'OkHttp throws an IllegalArgumentException if only one pin is supplied.' },
        { id: 'opt-b', text: 'If the server certificate expires or the primary CA is compromised and rotated, app versions without a backup pin will fail all TLS handshakes, permanently bricking app connectivity until an update is installed.' },
        { id: 'opt-c', text: 'Backup pins double the encryption speed.' },
        { id: 'opt-d', text: 'Backup pins are required only for Android 10 and below.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Backup pins prevent app bricking when server certificates rotate or expire.',
        keyConcept: 'Certificate Pinning Resilience & Disaster Recovery',
        detailed: `Certificate pinning protects against Man-in-the-Middle (MITM) attacks by checking public key hashes. However, if the bank's production SSL certificate rotates unexpectedly and the mobile app only pinned the old certificate, every network call will throw <code>SSLPeerUnverifiedException</code>! A pre-shared backup pin ensures continuity.`,
        realWorldPitfall: 'Pinning only a single certificate without a Disaster Recovery backup pin.',
        correctAnswerBreakdown: 'Option B accurately highlights TLS failure risk.'
      }
    },
    {
      id: 's6-q4-proguard-r8-rules',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Build Optimization: ProGuard / R8 Obfuscation & Reflection',
      prompt: `A banking app uses Gson or Kotlinx Serialization to parse API responses into data classes:
<pre><code>data class TransferResponse(val transactionId: String, val status: String)</code></pre>
In release APK builds with <code>minifyEnabled true</code>, network calls return objects with all null fields. What is the root cause?`,
      options: [
        { id: 'opt-a', text: 'R8 deletes the entire network socket library.' },
        { id: 'opt-b', text: 'R8 obfuscated field names (e.g. transactionId became "a"), so the JSON parser looking for "transactionId" could not match keys via reflection.' },
        { id: 'opt-c', text: 'Release builds do not allow internet permissions.' },
        { id: 'opt-d', text: 'Kotlin data classes cannot be compiled in release mode.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'R8 obfuscation renames class fields, breaking reflection-based JSON deserializers without @Keep or @SerializedName.',
        keyConcept: 'R8 Obfuscation & Reflection Preservation',
        detailed: `R8 minifies and obfuscates field identifiers to single letters (<code>a</code>, <code>b</code>). Reflection-based parsers matching JSON keys against field names fail to find matches.
Fix: Annotate model classes with <code>@Keep</code> or use <code>@SerializedName("transactionId")</code> / <code>@SerialName</code>.`,
        realWorldPitfall: 'Testing only debug builds where minification is disabled, causing release crashes on launch.',
        correctAnswerBreakdown: 'Option B is the classic R8 serialization bug.'
      }
    },
    {
      id: 's6-q5-datastore-vs-sharedprefs',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Data Storage: Jetpack DataStore vs Legacy SharedPreferences',
      prompt: `Why has Google officially deprecated <code>SharedPreferences</code> in favor of <strong>Jetpack DataStore</strong> (Preferences / Proto DataStore)?`,
      options: [
        { id: 'opt-a', text: 'SharedPreferences only works with XML, while DataStore works only with SQL.' },
        { id: 'opt-b', text: 'SharedPreferences.apply() runs asynchronously but blocks the UI thread during onStop() on Activity pause, causing ANRs. DataStore is fully coroutine-based, transactional, and safe from main-thread deadlocks.' },
        { id: 'opt-c', text: 'DataStore is written in C++.' },
        { id: 'opt-d', text: 'SharedPreferences cannot store strings longer than 100 characters.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'SharedPreferences.apply() blocks the main thread in onStop(); DataStore is asynchronous and transactional.',
        keyConcept: 'DataStore Coroutines vs SharedPreferences ANR Trap',
        detailed: `Although <code>SharedPreferences.apply()</code> queues disk writes in background, Android's ActivityThread forces a synchronous wait on all pending disk writes during <code>onStop()</code> / <code>onPause()</code>, causing frequent Application Not Responding (ANR) errors. Jetpack DataStore uses Kotlin Coroutines and Flow to prevent UI stalls.`,
        realWorldPitfall: 'Calling `SharedPreferences.apply()` repeatedly inside loops before user leaves screen triggers ANRs.',
        correctAnswerBreakdown: 'Option B accurately describes the hidden main-thread wait in SharedPreferences.'
      }
    },
    {
      id: 's6-q6-play-integrity-api',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Mobile Security: Google Play Integrity API Device Verdicts',
      prompt: `When verifying device security in a banking application via Google Play Integrity API, what does the verdict <code>MEETS_STRONG_INTEGRITY</code> guarantee?`,
      options: [
        { id: 'opt-a', text: 'The device has an active Wi-Fi connection.' },
        { id: 'opt-b', text: 'The app is running on a genuine Android device backed by hardware-attested security (TEE / StrongBox) with verified boot, not an unlocked bootloader or emulator.' },
        { id: 'opt-c', text: 'The user has biometric face unlock registered.' },
        { id: 'opt-d', text: 'The device has an antivirus app installed.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'MEETS_STRONG_INTEGRITY guarantees hardware-attested boot integrity and genuine OEM hardware.',
        keyConcept: 'Play Integrity Hardware Attestation',
        detailed: `Play Integrity API returns evaluation verdicts:
- <code>MEETS_BASIC_INTEGRITY</code>: Basic system checks pass.
- <code>MEETS_DEVICE_INTEGRITY</code>: Certified Google device.
- <code>MEETS_STRONG_INTEGRITY</code>: Hardware-backed keystore attestation proves bootloader is locked, verified boot is active, and no kernel rootkit is present.`,
        realWorldPitfall: 'Performing Play Integrity token verification on device instead of validating the cryptographic verdict on the bank backend server.',
        correctAnswerBreakdown: 'Option B describes hardware-attested integrity.'
      }
    },
    {
      id: 's6-q7-accessibility-semantics',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Jetpack Compose: Accessibility Semantics & Screen Readers (TalkBack)',
      prompt: `In an accessible banking app:
<pre><code>Row(modifier = Modifier.semantics(mergeDescendants = true) { }) {
    Image(Icons.Default.CreditCard, contentDescription = null)
    Text("Visa Ending in 4242")
}</code></pre>
What is the effect of <code>semantics(mergeDescendants = true)</code> for TalkBack screen reader users?`,
      options: [
        { id: 'opt-a', text: 'It hides the entire row from the screen reader.' },
        { id: 'opt-b', text: 'It merges all children into a single accessibility node, reading the complete row as a single focused element instead of making the user swipe through image and text separately.' },
        { id: 'opt-c', text: 'It translates the text into Braille.' },
        { id: 'opt-d', text: 'It increases the font size by 200%.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'mergeDescendants = true combines child semantics into a unified accessibility node.',
        keyConcept: 'Compose Accessibility & TalkBack Navigation',
        detailed: `Without <code>mergeDescendants = true</code>, vision-impaired users using TalkBack have to tap or swipe through every individual icon and text element. Merging descendants treats the composite card or list item as a single logical entity.`,
        realWorldPitfall: 'Leaving empty contentDescription on interactive buttons: TalkBack announces "unlabeled button".',
        correctAnswerBreakdown: 'Option B is correct.'
      }
    },
    {
      id: 's6-q8-aes-gcm-tag',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Cryptography: AES-GCM Authenticated Encryption with Associated Data (AEAD)',
      prompt: `Why is <code>AES/GCM/NoPadding</code> preferred over <code>AES/CBC/PKCS7Padding</code> for encrypting financial transaction payloads on mobile devices?`,
      options: [
        { id: 'opt-a', text: 'AES-GCM is an AEAD cipher that provides both confidentiality and data authenticity (integrity tag), detecting any tampering with ciphertext without separate HMAC.' },
        { id: 'opt-b', text: 'AES-GCM runs only in software mode.' },
        { id: 'opt-c', text: 'AES-CBC has been banned by the US government.' },
        { id: 'opt-d', text: 'AES-GCM does not require an Initialization Vector (IV).' }
      ],
      correctOptionId: 'opt-a',
      marks: 5,
      explanation: {
        summary: 'AES-GCM provides authenticated encryption (AEAD), combining encryption and cryptographic integrity verification.',
        keyConcept: 'Authenticated Encryption with Associated Data (AEAD)',
        detailed: `With AES-CBC, an attacker can modify bits in the ciphertext (bit-flipping attack) and the decryption will succeed without detecting corruption unless an external HMAC is checked.
<code>AES-GCM</code> outputs a 128-bit authentication tag; if even a single byte of the ciphertext is modified, decryption throws an <code>AEADBadTagException</code>.`,
        realWorldPitfall: 'Reusing the same Initialization Vector (IV) with the same AES-GCM key catastrophically leaks the encryption key!',
        correctAnswerBreakdown: 'Option A highlights the built-in integrity verification.'
      }
    },

    // DBMS Section
    {
      id: 's6-q9-pan-card-masking',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: PCI-DSS Payment Card PAN Number Masking',
      prompt: `Write an SQL query to mask customer account numbers for PCI-DSS compliance, replacing all but the last 4 characters with <code>'****-****-'</code>.
<br/><br/>
<strong>Return:</strong>
- <code>customer_name</code>, <code>masked_account</code>.`,
      schemaContext: `Table: accounts (account_id, customer_name, balance)`,
      expectedColumns: ['customer_name', 'masked_account'],
      validationType: 'pan_masking',
      sampleSolution: `SELECT 
    customer_name,
    '****-****-' || SUBSTR(account_id, -3) AS masked_account
FROM accounts;`,
      marks: 10,
      explanation: {
        summary: 'SUBSTR(account_id, -3) or -4 extracts the trailing digits, concatenated with masking symbols.',
        keyConcept: 'String Manipulation & Masking in SQLite',
        detailed: `PCI-DSS regulations forbid displaying unmasked card/account numbers in logs and public UI views. SQLite <code>SUBSTR(str, -N)</code> extracts the last $N$ characters.`,
        realWorldPitfall: 'Logging unmasked PAN numbers violates banking regulatory compliance.',
        correctAnswerBreakdown: 'Returns masked representation for all customer rows.'
      }
    },
    {
      id: 's6-q10-fts5-search',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: SQLite FTS5 Full-Text Search Virtual Table',
      prompt: `Write SQLite DDL to create a Full-Text Search virtual table named <code>merchants_fts</code> using the <strong>FTS5</strong> engine with columns <code>merchant_name</code> and <code>category</code>.`,
      schemaContext: `Target: Full-text search on merchants`,
      expectedColumns: ['query_status'],
      validationType: 'fts5_ddl',
      sampleSolution: `CREATE VIRTUAL TABLE merchants_fts USING fts5(
    merchant_name, 
    category
);`,
      marks: 10,
      explanation: {
        summary: 'CREATE VIRTUAL TABLE ... USING fts5(...) provides fast text indexing with BM25 ranking.',
        keyConcept: 'SQLite FTS5 Full-Text Search',
        detailed: `Standard SQL <code>LIKE '%query%'</code> performs a slow full table scan. FTS5 builds inverted token indexes, executing substring and prefix searches in sub-milliseconds on mobile devices.`,
        realWorldPitfall: 'FTS5 tables cannot use standard foreign keys.',
        correctAnswerBreakdown: 'CREATE VIRTUAL TABLE merchants_fts USING fts5(...)'
      }
    },
    {
      id: 's6-q11-wal-mode',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Configure SQLite Write-Ahead Logging (WAL) Mode',
      prompt: `Write the SQLite PRAGMA command to enable <strong>Write-Ahead Logging (WAL)</strong> journal mode to allow concurrent readers while a write transaction is executing.`,
      schemaContext: `Database Configuration`,
      expectedColumns: ['journal_mode'],
      validationType: 'wal_pragma',
      sampleSolution: `PRAGMA journal_mode = WAL;`,
      marks: 10,
      explanation: {
        summary: 'PRAGMA journal_mode = WAL enables concurrent readers and writers.',
        keyConcept: 'SQLite Write-Ahead Logging (WAL) in Room',
        detailed: `In standard rollback journal mode, writing locks the entire database file, blocking all readers. In WAL mode, writes append to a <code>-wal</code> file, allowing background readers to access data concurrently without contention. Room enables WAL by default.`,
        realWorldPitfall: 'Disabling WAL mode leads to SQLiteDatabaseLockedException under high background sync concurrency.',
        correctAnswerBreakdown: 'PRAGMA journal_mode = WAL;'
      }
    },
    {
      id: 's6-q12-high-spenders-ntile',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Customer Segmentation into Quartiles with NTILE(4)',
      prompt: `Divide all accounts into 4 equal wealth quartiles based on their <code>balance</code> in descending order using <strong>NTILE(4)</strong>.
<br/><br/>
<strong>Return:</strong>
- <code>account_id</code>, <code>balance</code>, and <code>wealth_quartile</code> (1 = highest balance quartile).`,
      schemaContext: `Table: accounts (account_id, balance)`,
      expectedColumns: ['account_id', 'balance', 'wealth_quartile'],
      validationType: 'ntile_quartiles',
      sampleSolution: `SELECT 
    account_id,
    balance,
    NTILE(4) OVER (ORDER BY balance DESC) AS wealth_quartile
FROM accounts;`,
      marks: 10,
      explanation: {
        summary: 'NTILE(4) OVER (ORDER BY balance DESC) splits ordered rows into 4 equal buckets.',
        keyConcept: 'SQLite NTILE Window Function',
        detailed: `<code>NTILE(k)</code> distributes rows as evenly as possible across $k$ numbered buckets, useful for risk tiering and premium service segmentation.`,
        realWorldPitfall: 'NTILE cannot be filtered in WHERE without a CTE or subquery.',
        correctAnswerBreakdown: 'Accounts divided into quartiles 1 through 4.'
      }
    },
    {
      id: 's6-q13-audit-status-counts',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Transaction Status Breakdown with Conditional SUM',
      prompt: `Write an SQL query to calculate the total count of SUCCESS vs FAILED vs PENDING transactions using conditional aggregation (<code>CASE WHEN</code>).
<br/><br/>
<strong>Return:</strong>
- <code>success_count</code>, <code>failed_count</code>, <code>pending_count</code>.`,
      schemaContext: `Table: transactions (transaction_id, status)`,
      expectedColumns: ['success_count', 'failed_count', 'pending_count'],
      validationType: 'status_breakdown_case',
      sampleSolution: `SELECT 
    SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) AS success_count,
    SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS failed_count,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending_count
FROM transactions;`,
      marks: 10,
      explanation: {
        summary: 'SUM(CASE WHEN status = ... THEN 1 ELSE 0 END) pivots status counts into summary columns.',
        keyConcept: 'Conditional Aggregation (Pivoting in SQLite)',
        detailed: `Aggregates multiple metrics in a single table pass without running 3 separate queries.`,
        realWorldPitfall: 'Using COUNT(CASE WHEN ... THEN 0 END): COUNT counts zeros as non-null rows! Use SUM or COUNT(CASE WHEN ... THEN 1 ELSE NULL END).',
        correctAnswerBreakdown: 'Produces summary status columns in a single row.'
      }
    },

    // DSA Problem
    {
      id: 's6-q14-top-k-frequent-merchants',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth DSA: Top K Frequent Transaction Merchants (PriorityQueue / Heap)',
      prompt: `<div class="hackerearth-badge-row" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
    ⚡ HackerEarth Track: Data Structures &gt; Heaps
  </span>
  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
    🎯 Code Monk: Priority Queue &amp; Min-Heap
  </span>
  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
    ⏱️ Target: O(N log K) Time | O(N) Space
  </span>
</div>
Given an array of merchant names <code>merchants</code> and an integer <code>k</code>, return the <code>k</code> most frequent merchants.
<br/><br/>
Return the result sorted by frequency descending.
<br/><br/>
<strong>Constraints:</strong>
- <code>1 &lt;= merchants.size &lt;= 10^5</code>
- <code>k &lt;= distinct merchants</code>
- <strong>Time Complexity:</strong> Must run in <code>O(N log K)</code> or better.`,
      starterCode: `import java.util.PriorityQueue

fun topKFrequent(merchants: Array<String>, k: Int): List<String> {
    val freqMap = HashMap<String, Int>()

    // TODO: Count frequencies and use Min-Heap of size K in O(N log K)

    return emptyList()
}

fun main() {
    val arr = arrayOf("Tesco", "Barclays", "Tesco", "Amazon", "Tesco", "Barclays")
    val res = topKFrequent(arr, 2)
    println("Top 2: " + res.joinToString(", "))
}`,
      solutionCode: `import java.util.PriorityQueue

fun topKFrequent(merchants: Array<String>, k: Int): List<String> {
    val freqMap = HashMap<String, Int>()
    for (m in merchants) {
        freqMap[m] = freqMap.getOrDefault(m, 0) + 1
    }

    // Min-heap ordered by frequency ascending
    val minHeap = PriorityQueue<Pair<String, Int>>(compareBy { it.second })

    for ((merchant, count) in freqMap) {
        minHeap.offer(Pair(merchant, count))
        if (minHeap.size > k) {
            minHeap.poll() // Evict least frequent
        }
    }

    val result = mutableListOf<String>()
    while (!minHeap.isEmpty()) {
        result.add(minHeap.poll().first)
    }
    result.reverse() // Highest frequency first
    return result
}

fun main() {
    val arr = arrayOf("Tesco", "Barclays", "Tesco", "Amazon", "Tesco", "Barclays")
    val res = topKFrequent(arr, 2)
    println(res.joinToString(" "))
}`,
      testCases: [
        { id: 'tc-1', name: 'Sample Case 1: Tesco & Barclays', input: '["Tesco","Barclays","Tesco","Amazon","Tesco","Barclays"], k=2', expected: 'Tesco Barclays', isHidden: false },
        { id: 'tc-2', name: 'Sample Case 2: k = 1', input: '["Costa","Costa","Starbucks"], k=1', expected: 'Costa', isHidden: false },
        { id: 'tc-3', name: 'Hidden Case 1: All distinct', input: '["A","B","C","D"], k=2', expected: 'A B', isHidden: true },
        { id: 'tc-4', name: 'Hidden Case 2: High volume', input: '["Uber","Uber","Uber","Uber","Deliveroo"], k=1', expected: 'Uber', isHidden: true }
      ],
      marks: 30,
      explanation: {
        summary: 'Frequency map + Min-Heap of size K guarantees O(N log K) time and O(N) space.',
        keyConcept: 'Min-Heap for Top K Selection',
        detailed: `A naive sort of all entries takes $O(M \log M)$ where $M$ is unique merchants. By maintaining a Min-Heap of capacity $k$, inserting takes $O(\log k)$. Elements with the lowest frequency are evicted at the top, leaving the $k$ most frequent elements.`,
        realWorldPitfall: 'Using Max-Heap of size $N$: polling $k$ times takes $O(N \log N)$ which is slower than Min-Heap $O(N \log k)$ when $k \ll N$.',
        correctAnswerBreakdown: 'Optimal O(N log K) Min-Heap solution.'
      }
    },

    // Android App Dev Machine Coding
    {
      id: 's6-q15-android-arch-biometric-vault',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Complete Android App Machine Coding: Hardware-Backed Biometric Security Vault',
      prompt: `Implement a production <strong>Biometric Authentication Vault</strong> for Android banking apps using <code>BiometricPrompt.CryptoObject</code>, Android Keystore hardware keys (AES-256-GCM), and secure token decryption.`,
      starterCode: `// Biometric Vault Architecture
// 1. KEYSTORE MANAGER (KeyGenParameterSpec with setUserAuthenticationRequired)
// 2. CIPHER INITIALIZER
// 3. BIOMETRIC PROMPT CONTROLLER WITH CryptoObject`,
      fullArchitectureCode: `package com.bank.mastery.security

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import androidx.biometric.BiometricPrompt
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey

class BiometricVaultManager {
    private val keyAlias = "BankingVaultKey"

    fun generateHardwareKey() {
        val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
        val spec = KeyGenParameterSpec.Builder(
            keyAlias,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setUserAuthenticationRequired(true)
            .build()
        keyGenerator.init(spec)
        keyGenerator.generateKey()
    }

    fun getEncryptCipher(): Cipher {
        val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        val key = keyStore.getKey(keyAlias, null) as SecretKey
        return Cipher.getInstance("AES/GCM/NoPadding").apply {
            init(Cipher.ENCRYPT_MODE, key)
        }
    }
}`,
      marks: 40,
      explanation: {
        summary: 'Configures AES-GCM in AndroidKeyStore with setUserAuthenticationRequired(true) and CryptoObject.',
        keyConcept: 'Biometric Authenticated Encryption',
        detailed: `Hardware key requires biometric validation before the Keystore unlocks it for cryptographic operations. This blocks memory scraping and Frida tampering.`,
        realWorldPitfall: 'Using ECB mode instead of GCM: ECB is completely insecure and leaks patterns in data.',
        correctAnswerBreakdown: 'Full security vault implementation.'
      }
    }
  ]
};
