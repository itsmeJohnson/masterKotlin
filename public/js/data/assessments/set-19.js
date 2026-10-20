/* ==========================================================================
   Assessment Set 19: Advanced Modularization, Dynamic Features & Gradle Internals
   Focus: Multi-Module Architecture, api vs implementation, Dynamic Features,
          Meeting Rooms II (Intervals & PriorityQueue / Two Pointers).
   ========================================================================== */

export const ASSESSMENT_SET_19 = {
  id: 'set-19',
  number: 19,
  title: 'Set 19: Modularization, Dynamic Features & Gradle Internals',
  shortTitle: 'Set 19: Modularization & Gradle',
  focusArea: 'Clean Architecture Modules, api vs implementation, SplitInstall & Meeting Rooms II',
  hackerEarthTrack: 'Algorithms > Sorting & Greedy Scheduling',
  hackerEarthChallenge: 'Code Monk: Minimum Meeting Rooms Required (Interval Overlaps)',
  hackerEarthConcepts: ['Interval Boundary Sorting', 'Min-Heap Allocation', 'Compilation Avoidance', 'Dynamic Feature Delivery'],
  difficulty: 'Lead Mobile Engineer / Principal Architect',
  durationMinutes: 75,
  badge: 'Build & Architecture Lead',
  sections: [
    {
      id: 'sec-android-kotlin',
      title: 'Section 1: Modularization, Gradle & Dynamic Delivery',
      shortTitle: 'Modularization & Gradle',
      icon: '📦',
      description: 'Enterprise architecture: multi-module compilation avoidance, api vs implementation, Dynamic Feature Modules, and Dagger cross-module injection.',
      questionCount: 8,
      marksPerQuestion: 5
    },
    {
      id: 'sec-dbms-room',
      title: 'Section 2: DBMS & Financial Ledger Queries',
      shortTitle: 'DBMS & SQL',
      icon: '🗄️',
      description: 'Year-over-Year (YoY) revenue growth, customer lifetime value, and merchant refund audits.',
      questionCount: 5,
      marksPerQuestion: 10
    },
    {
      id: 'sec-dsa-coding',
      title: 'Section 3: DSA Coding Problem',
      shortTitle: 'DSA Coding',
      icon: '💻',
      description: 'Meeting Rooms II: Minimum Conference Rooms Required for Overlapping Intervals in O(N log N).',
      questionCount: 1,
      marksPerQuestion: 30
    },
    {
      id: 'sec-android-app-dev',
      title: 'Section 4: Complete Android App Architecture',
      shortTitle: 'Android App Dev',
      icon: '🏗️',
      description: 'Machine coding: Decoupled Multi-Module Navigation and Cross-Module Dagger/Hilt Component Dependencies.',
      questionCount: 1,
      marksPerQuestion: 40
    }
  ],
  questions: [
    {
      id: 's19-q1-api-vs-implementation-gradle',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Gradle Compilation: "api" vs "implementation" and Compilation Avoidance',
      prompt: `In a multi-module Android project where module <code>:app</code> depends on <code>:core:network</code> which depends on <code>:core:model</code>:
Why does changing a method implementation inside <code>:core:model</code> avoid recompiling <code>:app</code> if <code>:core:network</code> used <code>implementation(project(":core:model"))</code> instead of <code>api(...)</code>?`,
      options: [
        { id: 'opt-a', text: 'Gradle ignores changes in nested modules.' },
        { id: 'opt-b', text: '"implementation" hides transitive dependencies from the consuming module\'s compile classpath (ABI encapsulation). Because :core:model is not on :app\'s compile classpath, internal changes in :core:model do not alter :core:network\'s public ABI, triggering Gradle Compilation Avoidance and saving minutes of build time.' },
        { id: 'opt-c', text: 'api is deprecated in Gradle 8.' },
        { id: 'opt-d', text: 'implementation converts Kotlin into native C++ code.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'implementation keeps transitive dependencies off upstream compile classpaths, enabling Gradle Compilation Avoidance.',
        keyConcept: 'Gradle Compilation Avoidance & ABI Leakage',
        detailed: `- <code>api</code>: Leaks the dependency onto all downstream modules' compile classpaths. If you change 1 line of private code in <code>:core:model</code>, Gradle must recompile <code>:core:model</code>, <code>:core:network</code>, <code>:app</code>, and all other 30 feature modules!
- <code>implementation</code>: Encapsulates the dependency. As long as the public Application Binary Interface (ABI) of <code>:core:network</code> does not change, Gradle skips recompilation of all upstream modules (<strong>Compilation Avoidance</strong>).`,
        realWorldPitfall: 'Using `api` everywhere in multi-module projects causes 10-minute incremental build times.',
        correctAnswerBreakdown: 'Option B accurately explains compile classpath encapsulation and ABI stability.'
      }
    },
    {
      id: 's19-q2-dynamic-feature-split-install',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Play Feature Delivery: Dynamic Feature Modules and SplitInstallManager',
      prompt: `A banking app wants to reduce initial download size by delivering an ID Document Scanning / Passport OCR module on-demand only when a user applies for a mortgage.
How does <strong>Google Play Feature Delivery</strong> load this module at runtime?`,
      options: [
        { id: 'opt-a', text: 'By downloading raw APK files from an Amazon S3 bucket.' },
        { id: 'opt-b', text: 'Using SplitInstallManager to request the dynamic feature module from the Google Play Store; upon download, the OS attaches the split APK to the running application via SplitCompat.install(context) without requiring an app restart.' },
        { id: 'opt-c', text: 'Dynamic features cannot be delivered without restarting the phone.' },
        { id: 'opt-d', text: 'By compiling the code inside the Android WebView.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'SplitInstallManager downloads split APKs from Google Play and attaches them at runtime via SplitCompat.',
        keyConcept: 'Play Feature Delivery & Dynamic Split APKs',
        detailed: `With Dynamic Feature Modules:
1. The base APK excludes heavy ML models and OCR native libraries (saving 30MB+ on install).
2. When the user taps "Scan Passport", <code>SplitInstallManager.startInstall(request)</code> requests the split APK from Google Play.
3. <code>SplitCompat.install(context)</code> loads the code and resources into the existing process classloader, enabling instant access to the dynamic feature.`,
        realWorldPitfall: 'Forgetting to initialize `SplitCompat.install(this)` in Application.attachBaseContext(): classes from the dynamic feature throw ClassNotFoundException.',
        correctAnswerBreakdown: 'Option B accurately describes SplitInstallManager and SplitCompat runtime attachment.'
      }
    },
    {
      id: 's19-q3-dagger-cross-dynamic-module-injection',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Dependency Injection: Dagger in Dynamic Feature Modules (Inverted Dependencies)',
      prompt: `In standard multi-module architectures, the base module depends on feature modules.
However, in Dynamic Feature Modules, the <strong>dynamic feature module depends on the base app module</strong> (inverted dependency).
How does Dagger/Hilt supply dependencies from the Base Application Component into the Dynamic Feature Component?`,
      options: [
        { id: 'opt-a', text: 'By making all base dependencies public static variables.' },
        { id: 'opt-b', text: 'By defining an interface in the base module exposing required dependencies, and creating a Dagger Component in the dynamic feature that declares the base component as a Component Dependency: @Component(dependencies = [BaseDependencies::class]).' },
        { id: 'opt-c', text: 'Dagger does not work with dynamic feature modules.' },
        { id: 'opt-d', text: 'By copying all source code into the dynamic module.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Dynamic feature components use Dagger Component Dependencies to consume dependencies exposed by the base module.',
        keyConcept: 'Inverted Dependency Injection with Component Dependencies',
        detailed: `Because the base module cannot import the dynamic feature (it doesn't even know if the module is installed), standard Hilt subcomponents cannot be generated in the base.
The dynamic feature module imports the base module. It declares:
<code>@Component(dependencies = [BaseAppComponent::class])</code>
allowing the dynamic module to retrieve Singletons (like <code>Retrofit</code>, <code>OkHttpClient</code>, <code>RoomDatabase</code>) from the base application graph.`,
        realWorldPitfall: 'Attempting to use `@InstallIn(SingletonComponent::class)` inside a dynamic feature module causes compilation failure.',
        correctAnswerBreakdown: 'Option B accurately explains Dagger Component Dependencies across inverted module boundaries.'
      }
    },
    {
      id: 's19-q4-gradle-configuration-cache',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Build Optimization: Gradle Configuration Cache',
      prompt: `Why does enabling the <strong>Gradle Configuration Cache</strong> (<code>org.gradle.configuration-cache=true</code>) drastically accelerate incremental builds in large 50+ module Android apps?`,
      options: [
        { id: 'opt-a', text: 'It converts all Java code into Kotlin.' },
        { id: 'opt-b', text: 'Gradle caches the entire evaluated task graph to disk after the first run. On subsequent builds where build scripts (.gradle/.gradle.kts) have not changed, Gradle completely skips the configuration phase (evaluating 50+ build files, plugins, and dependency graphs) and begins executing tasks immediately.' },
        { id: 'opt-c', text: 'It disables unit test execution.' },
        { id: 'opt-d', text: 'It runs the build on the GPU.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Configuration Cache skips evaluating build scripts and task configuration on every build, saving 15-30 seconds per build.',
        keyConcept: 'Gradle 3 Build Phases (Initialization -> Configuration -> Execution)',
        detailed: `In a 50-module app, evaluating <code>build.gradle.kts</code> across all modules can take 20 seconds before any compilation even starts!
With Configuration Cache enabled:
Gradle records the resolved task execution graph. On your next code edit, Gradle validates that build scripts haven't changed and jumps straight to <strong>Execution Phase</strong> in 0.5 seconds!`,
        realWorldPitfall: 'Using `project` references or reading system environment variables at task execution time violates configuration cache rules and fails builds.',
        correctAnswerBreakdown: 'Option B accurately explains task graph caching and skipping the configuration phase.'
      }
    },
    {
      id: 's19-q5-decoupled-navigation-mediator',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Clean Architecture: Feature-to-Feature Navigation Without Direct Module Coupling',
      prompt: `Module <code>:feature:accounts</code> needs to navigate to <code>:feature:transfer</code>.
To strictly prevent circular module dependencies, how should feature-to-feature navigation be designed?`,
      options: [
        { id: 'opt-a', text: 'Have :feature:accounts add implementation(project(":feature:transfer")) directly.' },
        { id: 'opt-b', text: 'Define a navigation interface / contract in a shared :core:navigation module (or use Deep Links / URI navigation like "bank://transfer?id=101"). The :app module or DI framework injects the concrete destination navigator without either feature directly depending on the other.' },
        { id: 'opt-c', text: 'Combine both features into a single massive module.' },
        { id: 'opt-d', text: 'Restart the Activity on every navigation.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Shared navigation contracts in a core module or URI deep links decouple feature modules from each other.',
        keyConcept: 'Decoupled Feature Navigation & Inversion of Control',
        detailed: `If Feature A depends on Feature B, and Feature B later needs something from Feature A, you hit a fatal <strong>Circular Dependency</strong> in Gradle.
By declaring an interface <code>TransferNavigator</code> in <code>:core:navigation</code>:
- <code>:feature:accounts</code> calls <code>navigator.openTransfer(accountId)</code>.
- The root <code>:app</code> module (which depends on all features) implements the navigation route.
Neither feature has any compile-time knowledge of the other!`,
        realWorldPitfall: 'Directly referencing target Activity or Composable classes from other feature modules breaks modular isolation.',
        correctAnswerBreakdown: 'Option B accurately outlines navigation contracts and deep linking.'
      }
    },
    {
      id: 's19-q6-asm-bytecode-manipulation-agp',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Build Tooling: AGP Transform API & AsmClassVisitorFactory',
      prompt: `How do enterprise banking security plugins and performance profilers inject automatic method timing and thread-checking into compiled bytecode during Gradle builds?`,
      options: [
        { id: 'opt-a', text: 'By editing the source code text files before compilation.' },
        { id: 'opt-b', text: 'By registering an AsmClassVisitorFactory using the Android Gradle Plugin (AGP) Instrumentation API. It intercepts compiled class bytecode and injects JVM bytecode instructions (using the ASM library) during the Dex transformation pipeline.' },
        { id: 'opt-c', text: 'By running a background service on the mobile device.' },
        { id: 'opt-d', text: 'By compiling with GCC instead of Kotlinc.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'AGP AsmClassVisitorFactory instruments compiled bytecode during build time using the ASM library.',
        keyConcept: 'Build-Time Bytecode Instrumentation (ASM)',
        detailed: `Enterprise APM tools (Datadog, New Relic) and security protectors use AGP's <code>variant.instrumentation.transformClassesWith(...)</code>.
This allows custom Gradle plugins to visit every method bytecode instruction and inject tracing, StrictMode thread checks, or encrypted strings directly into the final DEX binary without modifying developer source files.`,
        realWorldPitfall: 'Attempting to use the old deprecated AGP Transform API which was completely removed in AGP 8.0.',
        correctAnswerBreakdown: 'Option B accurately identifies AsmClassVisitorFactory and AGP instrumentation.'
      }
    },
    {
      id: 's19-q7-gradle-version-catalog-toml',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Build Engineering: Gradle Version Catalogs (libs.versions.toml)',
      prompt: `What major problem in enterprise Android builds is solved by migrating from Groovy <code>ext { ... }</code> or Kotlin <code>buildSrc</code> to <strong>Gradle Version Catalogs (libs.versions.toml)</strong>?`,
      options: [
        { id: 'opt-a', text: 'It automatically fixes Android memory leaks.' },
        { id: 'opt-b', text: 'buildSrc invalidates the entire Gradle build cache on any dependency version change (triggering full rebuilds). Version Catalogs separate dependency metadata into a declarative TOML file: changing a dependency version does not invalidate build script compilation, preserving build cache and configuration cache.' },
        { id: 'opt-c', text: 'TOML files compile to C++.' },
        { id: 'opt-d', text: 'It removes the need for Gradle plugins.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'Version Catalogs preserve build cache because dependency version changes in TOML do not force buildSrc recompilation.',
        keyConcept: 'Version Catalogs (TOML) vs buildSrc Build Cache Invalidation',
        detailed: `In legacy multi-module apps, placing versions in <code>buildSrc</code> meant that updating a single library version recompiled the entire <code>buildSrc</code> project, invalidating the cache of all 50 modules.
Gradle Version Catalogs (<code>gradle/libs.versions.toml</code>) are purely declarative:
- Type-safe accessors (<code>libs.retrofit</code>).
- Bundles for grouping related dependencies (<code>libs.bundles.compose</code>).
- Preserves configuration cache and execution cache across version bumps.`,
        realWorldPitfall: 'Using buildSrc for version constants in large repositories ruins incremental build times.',
        correctAnswerBreakdown: 'Option B accurately highlights buildSrc cache invalidation vs TOML stability.'
      }
    },
    {
      id: 's19-q8-composite-builds-include-build',
      sectionId: 'sec-android-kotlin',
      type: 'mcq',
      title: 'Developer Ergonomics: Composite Builds (includeBuild) vs Binary Dependencies',
      prompt: `A banking mobile team develops an internal SDK: <code>com.barclays:biometrics-sdk:2.1.0</code> published to an internal Artifactory.
To debug a critical bug in the SDK while working in the main banking app without publishing snapshot artifacts after every change:
What Gradle feature allows developing both repositories simultaneously?`,
      options: [
        { id: 'opt-a', text: 'Publishing to Maven Central.' },
        { id: 'opt-b', text: 'Gradle Composite Builds using "includeBuild(\"../biometrics-sdk\")" in settings.gradle.kts. Gradle automatically substitutes the external binary dependency with the local source build, enabling instant source-level debugging and hot-reloading.' },
        { id: 'opt-c', text: 'Copying the JAR file into the /libs folder.' },
        { id: 'opt-d', text: 'Disabling Gradle sync.' }
      ],
      correctOptionId: 'opt-b',
      marks: 5,
      explanation: {
        summary: 'includeBuild enables Composite Builds, transparently substituting binary dependencies with local source projects.',
        keyConcept: 'Gradle Composite Builds & Dependency Substitution',
        detailed: `With <code>includeBuild("../biometrics-sdk")</code> in <code>settings.gradle.kts</code>:
Gradle intercepts any dependency declaration <code>implementation("com.barclays:biometrics-sdk:2.1.0")</code> and redirects it directly to the local source code project!
You get breakpoint debugging, refactoring, and code changes across both projects simultaneously without publishing artifacts to remote repositories.`,
        realWorldPitfall: 'Publishing hundreds of -SNAPSHOT artifacts to remote Maven repositories just to test a 2-line change.',
        correctAnswerBreakdown: 'Option B accurately describes includeBuild dependency substitution.'
      }
    },

    // DBMS Section
    {
      id: 's19-q9-year-over-year-yoy-revenue',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 1: Monthly Year-Over-Year (YoY) Revenue Growth Calculation',
      prompt: `Calculate the <strong>Year-Over-Year (YoY) percentage revenue growth</strong> for each calendar month in 2026 compared to the exact same calendar month in 2025.
<br/><br/>
<strong>Return:</strong>
- <code>report_month</code> (formatted 'MM'), <code>revenue_2025</code>, <code>revenue_2026</code>, and <code>yoy_growth_percent</code> (rounded to 2 decimals).
- Order by <code>report_month ASC</code>.`,
      schemaContext: `Table: transactions (transaction_id, amount, status, timestamp)`,
      expectedColumns: ['report_month', 'revenue_2025', 'revenue_2026', 'yoy_growth_percent'],
      validationType: 'yoy_growth_calculation',
      sampleSolution: `WITH monthly_rev AS (
    SELECT 
        strftime('%m', timestamp) AS month_num,
        ROUND(SUM(CASE WHEN strftime('%Y', timestamp) = '2025' THEN amount ELSE 0 END), 2) AS rev_2025,
        ROUND(SUM(CASE WHEN strftime('%Y', timestamp) = '2026' THEN amount ELSE 0 END), 2) AS rev_2026
    FROM transactions
    WHERE status = 'COMPLETED'
      AND strftime('%Y', timestamp) IN ('2025', '2026')
    GROUP BY month_num
)
SELECT 
    month_num AS report_month,
    rev_2025 AS revenue_2025,
    rev_2026 AS revenue_2026,
    ROUND(((rev_2026 - rev_2025) * 100.0) / NULLIF(rev_2025, 0), 2) AS yoy_growth_percent
FROM monthly_rev
ORDER BY report_month ASC;`,
      marks: 10,
      explanation: {
        summary: 'Pivoting years with conditional sums and applying NULLIF prevents division-by-zero during YoY percentage calculations.',
        keyConcept: 'Year-Over-Year Growth & NULLIF Division Protection',
        detailed: `Comparing identical months across fiscal years isolates seasonal trends from genuine corporate growth. Using <code>NULLIF(rev_2025, 0)</code> safely handles baseline months with zero revenue without throwing division errors.`,
        realWorldPitfall: 'Dividing without NULLIF: if 2025 had 0 revenue in a month, SQL crashes with Division by Zero.',
        correctAnswerBreakdown: 'Conditional sums per year with (rev26 - rev25) * 100.0 / NULLIF(rev25, 0).'
      }
    },
    {
      id: 's19-q10-customer-lifetime-value-clv',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 2: Customer Lifetime Value (CLV) & Tenure Ranking',
      prompt: `Calculate the <strong>Customer Lifetime Value (CLV)</strong>: total fee revenue generated per customer along with their tenure in days.
<br/><br/>
<strong>Return:</strong>
- <code>c.customer_id</code>, <code>c.customer_name</code>, <code>tenure_days</code>, <code>total_fee_revenue</code>.
- Filter only customers with tenure $> 30$ days and order by <code>total_fee_revenue DESC</code>.`,
      schemaContext: `Tables: customers (customer_id, customer_name, created_at), fees (fee_id, customer_id, fee_amount, timestamp)`,
      expectedColumns: ['customer_id', 'customer_name', 'tenure_days', 'total_fee_revenue'],
      validationType: 'clv_tenure_ranking',
      sampleSolution: `SELECT 
    c.customer_id,
    c.customer_name,
    CAST(julianday('now') - julianday(c.created_at) AS INTEGER) AS tenure_days,
    ROUND(COALESCE(SUM(f.fee_amount), 0), 2) AS total_fee_revenue
FROM customers c
LEFT JOIN fees f ON c.customer_id = f.customer_id
GROUP BY c.customer_id, c.customer_name, c.created_at
HAVING tenure_days > 30
ORDER BY total_fee_revenue DESC;`,
      marks: 10,
      explanation: {
        summary: 'LEFT JOIN with COALESCE and julianday tenure difference computes Customer Lifetime Value.',
        keyConcept: 'Customer Lifetime Value (CLV) Metrics',
        detailed: `In wealth management, identifying high-tenure, high-revenue customers allows VIP concierge routing. <code>COALESCE</code> handles new customers who haven't generated fees yet.`,
        realWorldPitfall: 'Using INNER JOIN: drops customers who have never incurred fees.',
        correctAnswerBreakdown: 'LEFT JOIN with tenure_days > 30 in HAVING clause.'
      }
    },
    {
      id: 's19-q11-zero-refund-merchants',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 3: Pristine Merchants (Over $50k Sales with Zero Refunds)',
      prompt: `Identify all merchants with over <strong>$50,000 in completed sales</strong> who have recorded <strong>ZERO refund transactions</strong>.
<br/><br/>
<strong>Return:</strong>
- <code>merchant_id</code>, <code>merchant_name</code>, <code>total_sales</code>.`,
      schemaContext: `Tables: merchants (merchant_id, merchant_name), orders (order_id, merchant_id, amount, order_type, status)`,
      expectedColumns: ['merchant_id', 'merchant_name', 'total_sales'],
      validationType: 'pristine_merchants_anti_join',
      sampleSolution: `SELECT 
    m.merchant_id,
    m.merchant_name,
    ROUND(SUM(o.amount), 2) AS total_sales
FROM merchants m
JOIN orders o ON m.merchant_id = o.merchant_id
WHERE o.status = 'COMPLETED' AND o.order_type = 'SALE'
  AND NOT EXISTS (
      SELECT 1 
      FROM orders r 
      WHERE r.merchant_id = m.merchant_id 
        AND r.order_type = 'REFUND'
  )
GROUP BY m.merchant_id, m.merchant_name
HAVING total_sales > 50000
ORDER BY total_sales DESC;`,
      marks: 10,
      explanation: {
        summary: 'NOT EXISTS for refunds combined with HAVING total_sales > 50000 filters prime low-risk merchants.',
        keyConcept: 'Underwriting Merchant Risk Evaluation',
        detailed: `Payment acquirers offer preferred transaction processing rates to merchants with zero chargeback and refund history. Combining relational aggregation with correlated NOT EXISTS isolates zero-refund merchants.`,
        realWorldPitfall: 'Grouping before filtering refunds can corrupt aggregate sales numbers.',
        correctAnswerBreakdown: 'NOT EXISTS (order_type = \'REFUND\') with HAVING total_sales > 50000.'
      }
    },
    {
      id: 's19-q12-quarterly-partitioning-strategy',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 4: Fiscal Quarter Performance Breakdown',
      prompt: `Segment transaction performance by fiscal quarter for 2026:
- <code>'Q1'</code>: Months 01, 02, 03
- <code>'Q2'</code>: Months 04, 05, 06
- <code>'Q3'</code>: Months 07, 08, 09
- <code>'Q4'</code>: Months 10, 11, 12
<br/>
<strong>Return:</strong>
- <code>quarter</code>, <code>transaction_count</code>, <code>total_volume</code>.`,
      schemaContext: `Table: transactions (transaction_id, amount, status, timestamp)`,
      expectedColumns: ['quarter', 'transaction_count', 'total_volume'],
      validationType: 'quarterly_performance_segmentation',
      sampleSolution: `SELECT 
    CASE 
        WHEN strftime('%m', timestamp) IN ('01', '02', '03') THEN 'Q1'
        WHEN strftime('%m', timestamp) IN ('04', '05', '06') THEN 'Q2'
        WHEN strftime('%m', timestamp) IN ('07', '08', '09') THEN 'Q3'
        ELSE 'Q4'
    END AS quarter,
    COUNT(*) AS transaction_count,
    ROUND(SUM(amount), 2) AS total_volume
FROM transactions
WHERE strftime('%Y', timestamp) = '2026'
  AND status = 'COMPLETED'
GROUP BY quarter
ORDER BY quarter ASC;`,
      marks: 10,
      explanation: {
        summary: 'CASE statement in SELECT and GROUP BY partitions dates into calendar fiscal quarters.',
        keyConcept: 'Fiscal Quarter Aggregation',
        detailed: `Mapping month numbers into financial quarters allows leadership to track quarterly corporate revenue targets directly in SQL.`,
        realWorldPitfall: 'Assuming fiscal year starts in January for all jurisdictions (some start in April).',
        correctAnswerBreakdown: 'CASE WHEN strftime(\'%m\') IN (...) THEN \'Q1\' ... GROUP BY quarter.'
      }
    },
    {
      id: 's19-q13-foreign-key-index-covering-ddl',
      sectionId: 'sec-dbms-room',
      type: 'dbms_query',
      title: 'DBMS Query 5: Indexing Foreign Key Columns for Fast JOINs & Cascades',
      prompt: `SQLite does NOT automatically create indexes on foreign key columns.
Write SQLite DDL to create an index on <code>transactions(account_id)</code> to eliminate full table scans when parent accounts are deleted or joined.`,
      schemaContext: `Table: transactions (transaction_id, account_id, amount, timestamp)`,
      expectedColumns: ['query_status'],
      validationType: 'fk_index_creation_ddl',
      sampleSolution: `CREATE INDEX idx_transactions_account_id 
ON transactions(account_id);`,
      marks: 10,
      explanation: {
        summary: 'Explicitly indexing foreign key columns prevents full table scans during parent deletions and JOINs.',
        keyConcept: 'Foreign Key Indexing Requirement in SQLite',
        detailed: `In SQLite:
While <code>PRIMARY KEY</code> columns are automatically indexed, <code>FOREIGN KEY</code> columns are NOT!
When deleting an account from <code>accounts</code>, if <code>ON DELETE CASCADE</code> is active, SQLite must verify or delete corresponding rows in <code>transactions</code>. Without an index on <code>transactions(account_id)</code>, SQLite performs a <strong>Full Table Scan of millions of rows</strong> for every deleted account!`,
        realWorldPitfall: 'Omitting indexes on foreign key columns leads to massive database freezes during parent record deletion.',
        correctAnswerBreakdown: 'CREATE INDEX idx_transactions_account_id ON transactions(account_id);'
      }
    },

    // DSA Coding Section
    {
      id: 's19-q14-meeting-rooms-ii',
      sectionId: 'sec-dsa-coding',
      type: 'dsa_problem',
      title: 'HackerEarth Challenge: Meeting Rooms II / Minimum Concurrent Rooms in O(N log N)',
      prompt: `Given an array of meeting time intervals consisting of start and end times <code>[[s1, e1], [s2, e2], ...]</code> ($s_i < e_i$), find the <strong>minimum number of conference rooms required</strong> so that no two meetings overlap in the same room.
<br/><br/>
<strong>Strict Constraints:</strong>
- Must run in <strong>$O(N \\log N)$ time</strong>.
- $1 \\le N \\le 10^5$, $0 \\le s_i < e_i \\le 10^9$.
- If a meeting ends at time $T$, another meeting can start at the exact same time $T$ in the same room without conflict.
<br/><br/>
<strong>Input Format:</strong>
Line 1: $N$<br/>
Next $N$ lines: Two space-separated integers representing <code>start</code> and <code>end</code> time of each meeting.<br/>
<strong>Output Format:</strong>
A single integer representing the minimum number of conference rooms needed.`,
      difficulty: 'Medium-Hard',
      marks: 30,
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      starterCode: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Solution {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null || line.trim().isEmpty()) return;
        
        int n = Integer.parseInt(line.trim());
        int[] startTimes = new int[n];
        int[] endTimes = new int[n];
        
        for (int i = 0; i < n; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            startTimes[i] = Integer.parseInt(st.nextToken());
            endTimes[i] = Integer.parseInt(st.nextToken());
        }
        
        System.out.println(minMeetingRooms(startTimes, endTimes));
    }

    public static int minMeetingRooms(int[] startTimes, int[] endTimes) {
        if (startTimes == null || startTimes.length == 0) return 0;
        int n = startTimes.length;
        
        // Sort start times and end times independently in O(N log N)
        Arrays.sort(startTimes);
        Arrays.sort(endTimes);
        
        int startPointer = 0;
        int endPointer = 0;
        int usedRooms = 0;
        int maxRooms = 0;
        
        // Two Pointers chronological event traversal
        while (startPointer < n) {
            if (startTimes[startPointer] < endTimes[endPointer]) {
                // A meeting starts before the earliest ending meeting finishes -> allocate room
                usedRooms++;
                startPointer++;
            } else {
                // An earlier meeting finished -> free up room
                usedRooms--;
                endPointer++;
            }
            
            if (usedRooms > maxRooms) {
                maxRooms = usedRooms;
            }
        }
        
        return maxRooms;
    }
}`,
      testCases: [
        {
          id: 'tc-1',
          input: '3\n0 30\n5 10\n15 20',
          expectedOutput: '2',
          isSample: true
        },
        {
          id: 'tc-2',
          input: '2\n7 10\n2 4',
          expectedOutput: '1',
          isSample: true
        },
        {
          id: 'tc-3',
          input: '3\n1 5\n5 10\n10 15',
          expectedOutput: '1',
          isSample: false
        },
        {
          id: 'tc-4',
          input: '4\n1 10\n2 7\n3 19\n8 12',
          expectedOutput: '3',
          isSample: false
        }
      ],
      explanation: {
        summary: 'Sort start times and end times separately; use two pointers to track active meeting overlap in O(N log N) time and O(1) extra space beyond sorting.',
        keyConcept: 'Chronological Sweep-Line with Two Pointers',
        detailed: `Instead of maintaining a PriorityQueue (which has object allocation overhead):
1. Extract <code>startTimes</code> and <code>endTimes</code> into separate primitive arrays.
2. Sort both arrays in $O(N \\log N)$.
3. Use two pointers (<code>startPointer</code>, <code>endPointer</code>):
   - If <code>startTimes[startPointer] &lt; endTimes[endPointer]</code>: A new meeting has started while previous ones are still in progress $\\implies$ increment <code>usedRooms</code> and advance <code>startPointer</code>.
   - Else: A previous meeting has ended $\\implies$ decrement <code>usedRooms</code> and advance <code>endPointer</code>.
The peak value of <code>usedRooms</code> is the exact minimum number of rooms required!`,
        realWorldPitfall: 'Using `<` vs `<=`: if meeting A ends at 5 and meeting B starts at 5, they can share the same room, so `startTimes[startPointer] < endTimes[endPointer]` must be strictly less.',
        correctAnswerBreakdown: 'O(N log N) time and O(N) space using two pointer chronological traversal.'
      }
    },

    // Complete App Architecture Section
    {
      id: 's19-q15-modular-clean-architecture-hilt',
      sectionId: 'sec-android-app-dev',
      type: 'android_architecture',
      title: 'Enterprise Architecture: Decoupled Multi-Module Architecture with Feature Inversion',
      prompt: `Architect a scalable multi-module Android banking application structure:
1. Define module dependency graph:
   - <code>:app</code>
   - <code>:core:network</code>
   - <code>:core:database</code>
   - <code>:core:navigation</code>
   - <code>:feature:auth</code>
   - <code>:feature:payments</code>
2. Write the Dagger/Hilt navigation contract pattern allowing <code>:feature:auth</code> to navigate to <code>:feature:payments</code> without a direct Gradle module dependency.
3. Show Gradle <code>build.gradle.kts</code> dependency declarations preventing circular dependency issues.`,
      marks: 40,
      evaluationCriteria: [
        'Draws clear unidirectional module dependency hierarchy',
        'Implements NavigationContract in :core:navigation',
        'Injects NavigationContract implementation in :app',
        'Verifies zero circular Gradle dependencies between feature modules'
      ],
      sampleSolution: `// 1. Module Hierarchy:
// :app (combines all features)
//   ├── :feature:auth
//   ├── :feature:payments
// Both features depend ONLY on :core:navigation, :core:model, :core:designsystem

// 2. In :core:navigation (Shared contract):
interface PaymentsNavigator {
    fun openPaymentTransfer(accountId: String)
}

// 3. In :feature:auth (Zero knowledge of :feature:payments):
class AuthViewModel @Inject constructor(
    private val paymentsNavigator: PaymentsNavigator
) : ViewModel() {
    fun onLoginSuccess(userAccountId: String) {
        paymentsNavigator.openPaymentTransfer(userAccountId)
    }
}

// 4. In :app (Concrete binding):
@Module
@InstallIn(SingletonComponent::class)
abstract class NavigationModule {
    @Binds
    @Singleton
    abstract fun bindPaymentsNavigator(
        impl: AppComposeNavigator
    ): PaymentsNavigator
}`,
      explanation: {
        summary: 'Inversion of Control via navigation interfaces in a core module prevents circular Gradle dependencies and enables parallel compilation.',
        keyConcept: 'Dependency Inversion in Multi-Module Architecture',
        detailed: `In enterprise banking apps with 100+ engineers:
If features depend on features directly, compilation times explode and merge conflicts block releases.
By defining lightweight interfaces in <code>:core:navigation</code>, feature modules can be compiled in parallel by Gradle, tested in isolation via mock navigators, and even packaged into Dynamic Feature Modules.`,
        realWorldPitfall: 'Allowing circular dependencies between feature modules: Gradle completely rejects circular project dependencies.',
        correctAnswerBreakdown: 'Navigation interfaces in core:navigation bound by root :app module.'
      }
    }
  ]
};
