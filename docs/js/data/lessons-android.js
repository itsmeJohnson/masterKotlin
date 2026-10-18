/* ==========================================================================
   Priority 2: Android Engineering & Kotlin Internals
   Banking-grade examples for Barclays GSC / Tesco Bank
   ========================================================================== */

export const ANDROID_LESSONS = {
  'lesson-android-coroutines-flow': {
    id: 'lesson-android-coroutines-flow',
    title: 'Coroutines, Structured Concurrency & Flow / StateFlow',
    category: 'Kotlin Concurrency',
    difficulty: 'Advanced',
    timeEstimate: '40 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Plain English & Senior Concept',
        content: `
          <p>A <strong>Coroutine</strong> is a lightweight thread of execution that can be suspended without blocking the underlying OS thread. In Android banking apps, we never block the Main (UI) thread because doing so causes frame drops and 5-second Application Not Responding (<strong>ANR</strong>) crashes.</p>
          <p><strong>Structured Concurrency</strong> ensures that child coroutines cannot leak: if a parent job is cancelled (e.g., when the user leaves a banking screen), all child background network calls are safely aborted.</p>
        `
      },
      {
        stepNumber: 2,
        title: 'StateFlow vs SharedFlow vs Channel',
        content: `
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Stream Type</th>
                  <th>Hot/Cold</th>
                  <th>Replay Buffer</th>
                  <th>Primary Banking Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>Flow</code></td>
                  <td>Cold (starts on collect)</td>
                  <td>None</td>
                  <td>Database queries (Room), one-off API requests transformed with operators.</td>
                </tr>
                <tr>
                  <td><code>StateFlow</code></td>
                  <td>Hot (always active)</td>
                  <td>1 (latest value)</td>
                  <td>UI State holder (e.g., Account Balance, Transaction List, Loading/Error).</td>
                </tr>
                <tr>
                  <td><code>SharedFlow</code></td>
                  <td>Hot</td>
                  <td>Configurable (default 0)</td>
                  <td>One-time UI events (Navigation, Show Toast, Biometric prompt dialog).</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        stepNumber: 3,
        title: 'Production Banking Example: Account Balance Fetch',
        content: `
          <pre><code class="kotlin">// Banking ViewModel with StateFlow and Structured Concurrency
sealed interface AccountUiState {
    data object Loading : AccountUiState
    data class Success(val balance: BigDecimal, val currency: String) : AccountUiState
    data class Error(val message: String, val canRetry: Boolean) : AccountUiState
}

@HiltViewModel
class AccountViewModel @Inject constructor(
    private val getAccountBalanceUseCase: GetAccountBalanceUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow&lt;AccountUiState&gt;(AccountUiState.Loading)
    val uiState: StateFlow&lt;AccountUiState&gt; = _uiState.asStateFlow()

    fun loadBalance(accountId: String) {
        viewModelScope.launch {
            _uiState.value = AccountUiState.Loading
            getAccountBalanceUseCase(accountId)
                .catch { exception -&gt;
                    _uiState.value = AccountUiState.Error(
                        message = exception.localizedMessage ?: "Failed to retrieve balance",
                        canRetry = true
                    )
                }
                .collect { account -&gt;
                    _uiState.value = AccountUiState.Success(
                        balance = account.availableBalance,
                        currency = account.currencyCode
                    )
                }
        }
    }
}</code></pre>
        `
      },
      {
        stepNumber: 4,
        title: 'Lifecycle-Aware UI Collection in Compose',
        content: `
          <p>Never use <code>stateFlow.collect()</code> directly in Composable functions without lifecycle awareness, as background rendering wastes battery and risks crashes.</p>
          <pre><code class="kotlin">@Composable
fun AccountScreen(viewModel: AccountViewModel = hiltViewModel()) {
    // Automatically stops collecting when the Composable is below ON_START
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when (val state = uiState) {
        is AccountUiState.Loading -&gt; LoadingSpinner()
        is AccountUiState.Success -&gt; BalanceCard(balance = state.balance, currency = state.currency)
        is AccountUiState.Error -&gt; ErrorBanner(message = state.message, onRetry = { viewModel.loadBalance("ACC-101") })
    }
}</code></pre>
        `
      },
      {
        stepNumber: 5,
        title: 'Common Production Pitfalls & Interview Questions',
        content: `
          <div class="alert alert-warning">
            <div class="alert-icon">⚠️</div>
            <div>
              <strong>Barclays Interview Question:</strong> What is the difference between <code>launch</code> and <code>async</code>, and what happens when an unhandled exception occurs inside a child coroutine?
              <br/><br/>
              <strong>Senior Answer:</strong> <code>launch</code> fires and forgets (returns a <code>Job</code>), while <code>async</code> produces a deferred value (returns <code>Deferred&lt;T&gt;</code>) requiring <code>.await()</code>. An unhandled exception in a standard <code>Job</code> propagates upward to its parent, cancelling all sibling coroutines. To isolate failures in independent tasks (e.g. fetching credit card and debit card balance in parallel), use <code>supervisorScope</code> or <code>SupervisorJob</code> so one failure does not cancel the other!
            </div>
          </div>
        `
      }
    ]
  },

  'lesson-android-architecture-clean': {
    id: 'lesson-android-architecture-clean',
    title: 'Clean Architecture, MVI / MVVM & Unidirectional Data Flow',
    category: 'Android Architecture',
    difficulty: 'Advanced',
    timeEstimate: '35 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Architectural Layers & Separation of Concerns',
        content: `
          <p>In high-scale banking applications (Tesco Bank, Barclays), Clean Architecture separates code into three decoupled layers:</p>
          <ol>
            <li><strong>Presentation Layer (UI & ViewModel):</strong> Renders Compose views, handles user intents, observes immutable <code>UiState</code>. Has no direct knowledge of HTTP or SQLite databases.</li>
            <li><strong>Domain Layer (UseCases & Entities):</strong> Pure Kotlin code. Contains business rules (e.g., <code>ValidateSufficientBalanceUseCase</code>, <code>CalculateDailyTransferLimitUseCase</code>). No Android framework dependencies.</li>
            <li><strong>Data Layer (Repositories & DataSources):</strong> Implements repository interfaces defined by the Domain layer. Coordinates Room SQLite caching, encrypted datastore, and Retrofit network requests.</li>
          </ol>
        `
      },
      {
        stepNumber: 2,
        title: 'Dependency Inversion Principle (DIP)',
        content: `
          <div class="alert alert-note">
            <div class="alert-icon">🏛️</div>
            <div>
              <strong>Rule:</strong> High-level domain logic must never depend on low-level data access details (Retrofit or Room). Both must depend on abstractions (interfaces).
            </div>
          </div>
          <pre><code class="kotlin">// 1. Domain Layer Interface (Pure Kotlin)
interface AccountRepository {
    suspend fun getAccountDetails(id: String): Result&lt;AccountDetails&gt;
}

// 2. Data Layer Implementation (Depends on Retrofit & Room)
class AccountRepositoryImpl @Inject constructor(
    private val api: BankingApiService,
    private val dao: AccountDao,
    private val securityManager: DeviceSecurityManager
) : AccountRepository {
    override suspend fun getAccountDetails(id: String): Result&lt;AccountDetails&gt; {
        // Offline-first caching with remote synchronization logic
        return try {
            val response = api.fetchAccount(id)
            dao.saveAccount(response.toEntity())
            Result.success(response.toDomain())
        } catch (e: Exception) {
            val cached = dao.getAccountById(id)
            if (cached != null) Result.success(cached.toDomain())
            else Result.failure(e)
        }
    }
}</code></pre>
        `
      }
    ]
  },

  'lesson-android-jetpack-compose': {
    id: 'lesson-android-jetpack-compose',
    title: 'Jetpack Compose: Recomposition, Stability & Performance',
    category: 'Jetpack Compose',
    difficulty: 'Advanced',
    timeEstimate: '40 min',
    steps: [
      {
        stepNumber: 1,
        title: 'The Recomposition Mental Model',
        content: `
          <p>Compose is declarative: when state changes, Composable functions are re-executed with new values. However, unnecessary recompositions cause frame drops (jank) in 120Hz displays.</p>
          <p>A Composable will <strong>skip</strong> recomposition if and only if:</p>
          <ul>
            <li>All its input arguments are <strong>stable</strong> or <strong>immutable</strong>.</li>
            <li>None of its input values have changed since the last invocation.</li>
          </ul>
        `
      },
      {
        stepNumber: 2,
        title: 'Stability Gotcha: Standard Collections',
        content: `
          <div class="alert alert-warning">
            <div class="alert-icon">⚠️</div>
            <div>
              <strong>Critical Gotcha:</strong> In Kotlin, <code>List&lt;T&gt;</code> is an interface. The Compose compiler cannot guarantee at runtime whether the underlying instance is a <code>MutableList</code> that modified its elements. Therefore, standard <code>List&lt;T&gt;</code> is treated as <em>unstable</em>, causing unnecessary recompositions!
              <br/><br/>
              <strong>Production Fix:</strong> Use <code>kotlinx.collections.immutable.ImmutableList&lt;T&gt;</code> or mark data classes with <code>@Immutable</code> / <code>@Stable</code>.
            </div>
          </div>
          <pre><code class="kotlin">@Immutable
data class TransactionListUiState(
    val transactions: kotlinx.collections.immutable.ImmutableList&lt;TransactionItem&gt; = persistentListOf()
)</code></pre>
        `
      },
      {
        stepNumber: 3,
        title: 'LazyColumn Optimization & Keys',
        content: `
          <pre><code class="kotlin">@Composable
fun TransactionFeed(transactions: ImmutableList&lt;TransactionItem&gt;) {
    LazyColumn {
        items(
            items = transactions,
            key = { item -&gt; item.transactionId } // Mandatory: prevents entire list remeasuring on insertion!
        ) { item -&gt;
            TransactionRow(item = item)
        }
    }
}</code></pre>
        `
      }
    ]
  },

  'lesson-android-di-networking': {
    id: 'lesson-android-di-networking',
    title: 'Hilt DI, Retrofit Interceptors & Certificate Pinning',
    category: 'DI & Networking',
    difficulty: 'Advanced',
    timeEstimate: '35 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Banking Network Security & Certificate Pinning',
        content: `
          <p>Financial apps are subject to strict regulatory compliance (PCI-DSS, FCA). Standard HTTPS is vulnerable if a user installs a malicious CA certificate on a rooted phone or proxy. <strong>Certificate Pinning</strong> ensures the app only connects to servers presenting a specific cryptographic public key hash.</p>
          <pre><code class="kotlin">// OkHttp Certificate Pinning Configuration
val certificatePinner = CertificatePinner.Builder()
    .add("api.tescobank.com", "sha256/k2v657xUM4MpNGMJxJwJVBgqollLk56VE4XqpZEbAOg=")
    // Always include at least one backup pin for certificate rotation!
    .add("api.tescobank.com", "sha256/JSMzqOOrtynOT1kmau6zKhgT676hGgcz88PjaBBmYVg=")
    .build()

val okHttpClient = OkHttpClient.Builder()
    .certificatePinner(certificatePinner)
    .addInterceptor(AuthTokenInterceptor())
    .build()</code></pre>
        `
      },
      {
        stepNumber: 2,
        title: 'Automatic OAuth Token Refresh via OkHttp Authenticator',
        content: `
          <p>When an API returns HTTP 401 Unauthorized, an <code>Authenticator</code> synchronously requests a new access token using a refresh token and replays the original request:</p>
          <pre><code class="kotlin">class TokenAuthenticator @Inject constructor(
    private val tokenStorage: SecureTokenStorage,
    private val authService: AuthService
) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? {
        synchronized(this) {
            val currentToken = tokenStorage.getAccessToken()
            // If another thread already refreshed the token, retry with it
            if (response.request.header("Authorization") != "Bearer $currentToken") {
                return response.request.newBuilder()
                    .header("Authorization", "Bearer $currentToken")
                    .build()
            }

            val newToken = authService.refreshBlocking(tokenStorage.getRefreshToken())
            if (newToken != null) {
                tokenStorage.saveAccessToken(newToken)
                return response.request.newBuilder()
                    .header("Authorization", "Bearer $newToken")
                    .build()
            }
            return null // Token refresh failed; trigger app logout
        }
    }
}</code></pre>
        `
      }
    ]
  }
};
