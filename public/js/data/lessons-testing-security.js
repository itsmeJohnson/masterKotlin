/* ==========================================================================
   Priority 3: Testing, Security & Delivery
   Banking-grade Engineering Practices (Barclays / Tesco Bank)
   ========================================================================== */

export const TESTING_SECURITY_LESSONS = {
  'lesson-testing-junit-mockk-turbine': {
    id: 'lesson-testing-junit-mockk-turbine',
    title: 'Unit Testing: MockK, Turbine & Compose UI Tests',
    category: 'Testing & QA',
    difficulty: 'Advanced',
    timeEstimate: '35 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Coroutine Unit Testing with StandardTestDispatcher',
        content: `
          <p>Unit testing coroutines without proper dispatchers results in flaky race conditions. In modern Kotlin test libraries, <code>StandardTestDispatcher</code> gives full deterministic control over virtual time execution.</p>
          <pre><code class="kotlin">class AccountViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private val getAccountUseCase = mockk&lt;GetAccountBalanceUseCase&gt;()
    private lateinit var viewModel: AccountViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        viewModel = AccountViewModel(getAccountUseCase)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun \`when loadBalance succeeds, uiState transitions to Success\`() = runTest(testDispatcher) {
        val mockAccount = Account(BigDecimal("1500.50"), "GBP")
        coEvery { getAccountUseCase("ACC-1") } returns flowOf(mockAccount)

        viewModel.uiState.test {
            // Initial state is Loading
            assertEquals(AccountUiState.Loading, awaitItem())

            viewModel.loadBalance("ACC-1")
            testDispatcher.scheduler.advanceUntilIdle()

            // Verify success emission
            val success = awaitItem() as AccountUiState.Success
            assertEquals(BigDecimal("1500.50"), success.balance)
            assertEquals("GBP", success.currency)
        }
    }
}</code></pre>
        `
      },
      {
        stepNumber: 2,
        title: 'Turbine: Why Flow Testing Requires It',
        content: `
          <p>Standard unit test assertions often miss intermediate Flow emissions or hang indefinitely waiting for cold flows. <code>Turbine</code> by CashApp provides an intuitive event-driven assertion API: <code>awaitItem()</code>, <code>awaitError()</code>, and <code>awaitComplete()</code>.</p>
        `
      }
    ]
  },

  'lesson-security-keystore-pinning': {
    id: 'lesson-security-keystore-pinning',
    title: 'Banking Security: Keystore, Biometrics & Root Detection',
    category: 'Security',
    difficulty: 'Advanced',
    timeEstimate: '40 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Android Keystore & Hardware-Backed TEE',
        content: `
          <p>In a financial institution, secrets (JWT tokens, cryptographic private keys) must never be stored in plain text or standard <code>SharedPreferences</code>. The Android Keystore system generates and stores keys inside a hardware-isolated secure element (<strong>TEE</strong> - Trusted Execution Environment or StrongBox Keymaster), making key extraction impossible even on a rooted device.</p>
          <pre><code class="kotlin">// Generating an AES-256 GCM Key in Hardware Keystore
val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
val keyGenParameterSpec = KeyGenParameterSpec.Builder(
    "banking_user_auth_key",
    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
)
    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
    .setKeySize(256)
    .setUserAuthenticationRequired(true) // Requires Biometric fingerprint/face unlock
    .setUserAuthenticationParameters(
        0, // 0 means authenticates for every single cryptographic transaction
        KeyProperties.AUTH_BIOMETRIC_STRONG
    )
    .build()

keyGenerator.init(keyGenParameterSpec)
keyGenerator.generateKey()</code></pre>
        `
      },
      {
        stepNumber: 2,
        title: 'Root Detection & Anti-Tampering Defenses',
        content: `
          <div class="alert alert-important">
            <div class="alert-icon">🛡️</div>
            <div>
              <strong>Multi-Layered Integrity Checks:</strong>
              <ol>
                <li><strong>Google Play Integrity API:</strong> Server-verified attestation ensuring binary was downloaded from genuine Google Play on a CTS-certified device.</li>
                <li><strong>Local Root Detection Heuristics:</strong> Checking for known SU binaries (<code>/system/xbin/su</code>), Magisk manager packages, test-keys build tags, and writable system directories.</li>
                <li><strong>Zeroing Sensitive Memory:</strong> Always store sensitive PINs in <code>CharArray</code> instead of immutable <code>String</code>, and overwrite the array with zeros immediately after transmission to prevent memory dumps.</li>
              </ol>
            </div>
          </div>
        `
      }
    ]
  },

  'lesson-delivery-gradle-cicd': {
    id: 'lesson-delivery-gradle-cicd',
    title: 'Build Systems: Gradle Kotlin DSL & CI/CD Pipelines',
    category: 'Build & Delivery',
    difficulty: 'Advanced',
    timeEstimate: '30 min',
    steps: [
      {
        stepNumber: 1,
        title: 'libs.versions.toml Version Catalogs',
        content: `
          <p>Modern enterprise Android projects centralize all dependencies, plugins, and version numbers into a single type-safe TOML version catalog.</p>
          <pre><code class="toml">[versions]
kotlin = "2.1.20"
hilt = "2.51"
composeBom = "2024.04.00"

[libraries]
compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
compose-ui = { group = "androidx.compose.ui", name = "ui" }
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }

[plugins]
android-application = { id = "com.android.application", version = "8.4.0" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }</code></pre>
        `
      },
      {
        stepNumber: 2,
        title: 'Staged Rollout & Emergency Halts',
        content: `
          <p>Release schedule for banking updates:</p>
          <ul>
            <li><strong>Day 1:</strong> 5% staged rollout to early adopters. Monitor Crashlytics ANR and crash-free users rate (&gt;= 99.85%).</li>
            <li><strong>Day 2:</strong> 10% rollout. Monitor API latency and gateway failure rates.</li>
            <li><strong>Day 3:</strong> 25% rollout.</li>
            <li><strong>Day 4:</strong> 50% rollout.</li>
            <li><strong>Day 5:</strong> 100% full release.</li>
          </ul>
        `
      }
    ]
  },

  'lesson-monitoring-crashlytics-anr': {
    id: 'lesson-monitoring-crashlytics-anr',
    title: 'Production Monitoring: Crashlytics, ANRs & LeakCanary',
    category: 'Observability',
    difficulty: 'Advanced',
    timeEstimate: '30 min',
    steps: [
      {
        stepNumber: 1,
        title: 'ANR (Application Not Responding) Watchdog & Triage',
        content: `
          <p>An ANR is triggered when an input event or broadcast is unhandled for 5 seconds. To debug ANRs in production, examine the Android <code>traces.txt</code> file:</p>
          <ul>
            <li>Check the <code>"main" prio=5 tid=1</code> thread state.</li>
            <li>Look for <code>WAITING</code> on locks held by background binder threads or blocking synchronized blocks.</li>
            <li>Confirm that no SharedPreferences <code>.commit()</code> or database queries run synchronously on Dispatchers.Main.</li>
          </ul>
        `
      }
    ]
  }
};
