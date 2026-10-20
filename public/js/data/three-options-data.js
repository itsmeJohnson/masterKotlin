/* ==========================================================================
   Three Options Data Store & Instant Keyword Search Engine
   Kotlin & Android Mastery Lab — Tesco Bank / Barclays GSC Preparation
   Consolidates:
   1. 100 DBMS & SQLite Queries (Priority)
   2. 160 Android & Kotlin MCQs with Correct Answers & Explanations
   3. 67 DSA Programs & Algorithmic Solutions
   ========================================================================== */

import { ALL_ASSESSMENT_SETS } from './assessments/index.js';
import { ALGORITHM_EXERCISES } from './algorithm-exercises.js';

// Cache aggregated datasets
let cachedDbms = null;
let cachedMcqs = null;
let cachedDsa = null;

// ==========================================
// 1. DBMS & QUERIES DATA
// ==========================================
export function getAllDbmsQueries() {
  if (cachedDbms) return cachedDbms;

  const queries = [];
  ALL_ASSESSMENT_SETS.forEach(set => {
    (set.questions || []).forEach(q => {
      if (q.type === 'dbms_query') {
        // Infer category tags
        const tags = [];
        const content = `${q.title} ${q.prompt} ${q.sampleSolution || ''}`.toLowerCase();
        
        if (content.includes('window') || content.includes('over (') || content.includes('dense_rank') || content.includes('row_number')) {
          tags.push('Window Functions');
        }
        if (content.includes('group by') || content.includes('having')) {
          tags.push('GROUP BY / HAVING');
        }
        if (content.includes('join') || content.includes('not exists') || content.includes('not in') || content.includes('anti-join') || content.includes('orphan')) {
          tags.push('Joins & Anti-Joins');
        }
        if (content.includes('index') || content.includes('create index') || content.includes('ddl') || content.includes('b-tree')) {
          tags.push('Indexing & DDL');
        }
        if (content.includes('strftime') || content.includes('month') || content.includes('date') || content.includes('timestamp')) {
          tags.push('Date & Time');
        }
        if (content.includes('max(') || content.includes('second highest') || content.includes('nth highest') || content.includes('subquery')) {
          tags.push('Subqueries & Top-N');
        }
        if (content.includes('room') || content.includes('migration') || content.includes('entity') || content.includes('foreignkey')) {
          tags.push('Room Architecture');
        }
        if (tags.length === 0) {
          tags.push('General SQL');
        }

        queries.push({
          id: q.id,
          setId: set.id,
          setNumber: set.number,
          setName: set.title,
          title: q.title,
          prompt: q.prompt,
          schemaContext: q.schemaContext || 'Table: transactions (transaction_id, account_id, amount, status, timestamp)',
          sampleSolution: q.sampleSolution || '',
          alternativeSolutions: q.alternativeSolutions || [],
          expectedColumns: q.expectedColumns || [],
          expectedOutputPreview: q.expectedOutputPreview || null,
          explanation: q.explanation || null,
          tags: tags,
          type: 'dbms'
        });
      }
    });
  });

  cachedDbms = queries;
  return cachedDbms;
}

export const DBMS_TAGS = [
  'All',
  'Window Functions',
  'GROUP BY / HAVING',
  'Joins & Anti-Joins',
  'Subqueries & Top-N',
  'Indexing & DDL',
  'Date & Time',
  'Room Architecture'
];

// ==========================================
// 2. MCQs DATA
// ==========================================
export function getAllMcqs() {
  if (cachedMcqs) return cachedMcqs;

  const mcqs = [];
  ALL_ASSESSMENT_SETS.forEach(set => {
    (set.questions || []).forEach(q => {
      if (q.type === 'mcq') {
        const correctOpt = (q.options || []).find(o => o.id === q.correctOptionId);
        
        // Infer tags
        const tags = [];
        const content = `${q.title} ${q.prompt} ${(q.explanation && q.explanation.keyConcept) || ''}`.toLowerCase();
        
        if (content.includes('coroutine') || content.includes('launch') || content.includes('async') || content.includes('job') || content.includes('dispatchers') || content.includes('supervisor')) {
          tags.push('Coroutines & Concurrency');
        }
        if (content.includes('flow') || content.includes('stateflow') || content.includes('sharedflow') || content.includes('channel')) {
          tags.push('Flow & State');
        }
        if (content.includes('compose') || content.includes('recomposition') || content.includes('stability') || content.includes('@stable') || content.includes('remembersaveable')) {
          tags.push('Jetpack Compose');
        }
        if (content.includes('lifecycle') || content.includes('process death') || content.includes('savedstatehandle') || content.includes('viewmodel')) {
          tags.push('Lifecycle & Process Death');
        }
        if (content.includes('leak') || content.includes('memory') || content.includes('gc') || content.includes('profiler') || content.includes('weakreference')) {
          tags.push('Memory & Leaks');
        }
        if (content.includes('hilt') || content.includes('dagger') || content.includes('di') || content.includes('injection')) {
          tags.push('Dependency Injection');
        }
        if (content.includes('inline') || content.includes('reified') || content.includes('sealed') || content.includes('value class') || content.includes('delegation') || content.includes('by lazy')) {
          tags.push('Kotlin Features');
        }
        if (content.includes('keystore') || content.includes('pinning') || content.includes('security') || content.includes('r8') || content.includes('proguard')) {
          tags.push('Security & Networking');
        }
        if (tags.length === 0) {
          tags.push('Core Android & JVM');
        }

        mcqs.push({
          id: q.id,
          setId: set.id,
          setNumber: set.number,
          setName: set.title,
          title: q.title,
          prompt: q.prompt,
          options: q.options || [],
          correctOptionId: q.correctOptionId,
          correctOptionText: correctOpt ? correctOpt.text : '',
          explanation: q.explanation || null,
          tags: tags,
          type: 'mcq'
        });
      }
    });
  });

  cachedMcqs = mcqs;
  return cachedMcqs;
}

export const MCQ_TAGS = [
  'All',
  'Coroutines & Concurrency',
  'Flow & State',
  'Jetpack Compose',
  'Lifecycle & Process Death',
  'Memory & Leaks',
  'Kotlin Features',
  'Dependency Injection',
  'Security & Networking'
];

// ==========================================
// 3. DSA PROGRAMS DATA
// ==========================================
export function getAllDsaPrograms() {
  if (cachedDsa) return cachedDsa;

  const dsaList = [];

  // Add 47 exercises from algorithm-exercises.js
  Object.values(ALGORITHM_EXERCISES).forEach(algo => {
    dsaList.push({
      id: algo.id,
      title: algo.title,
      category: algo.category || 'General Algorithms',
      difficulty: algo.difficulty || 'Medium',
      description: algo.description,
      inputFormat: algo.inputFormat || '',
      outputFormat: algo.outputFormat || '',
      constraints: algo.constraints || [],
      examples: algo.examples || [],
      starterCode: algo.starterCode || '',
      solutionCode: (algo.solution && algo.solution.code) || algo.starterCode || '',
      explanation: (algo.solution && algo.solution.explanation) || (algo.hints && algo.hints.map(h => h.text).join('\n')) || '',
      timeComplexity: algo.timeComplexity || 'O(N)',
      spaceComplexity: algo.spaceComplexity || 'O(1)',
      tags: [algo.category || 'General Algorithms', algo.difficulty || 'Medium'],
      source: 'Algorithm Bank',
      type: 'dsa'
    });
  });

  // Add 20 HackerEarth DSA challenges from assessment sets
  ALL_ASSESSMENT_SETS.forEach(set => {
    (set.questions || []).forEach(q => {
      if (q.type === 'dsa_problem' || q.type === 'dsa_challenge') {
        const titleClean = q.title.replace(/^HackerEarth DSA:\s*/, '');
        dsaList.push({
          id: q.id,
          title: titleClean,
          category: 'HackerEarth Challenges',
          difficulty: 'Senior / Lead',
          description: q.prompt,
          inputFormat: '',
          outputFormat: '',
          constraints: ['1 <= N <= 10^5', 'Time Limit: 1.0s (Kotlinc JVM)'],
          examples: [],
          starterCode: q.starterCode || '',
          solutionCode: q.solutionCode || q.starterCode || '',
          explanation: (q.explanation && (q.explanation.detailed || q.explanation.summary)) || '',
          timeComplexity: 'O(N) Optimal',
          spaceComplexity: 'O(K) / O(N)',
          tags: ['HackerEarth Challenges', set.title],
          source: `Set ${set.number}`,
          type: 'dsa'
        });
      }
    });
  });

  cachedDsa = dsaList;
  return cachedDsa;
}

export const DSA_TAGS = [
  'All',
  'Arrays & Two Pointers',
  'Sliding Window',
  'Prefix Sum & Kadane',
  'Binary Search',
  'Stacks & Queues',
  'HashMaps & Sets',
  'Dynamic Programming',
  'Binary Trees & BST',
  'Graphs & BFS/DFS',
  'HackerEarth Challenges'
];

// ==========================================
// SEARCH FILTRATION HELPERS
// ==========================================
export function filterItems(items, query, activeTag) {
  let filtered = items;

  // Filter by category tag
  if (activeTag && activeTag !== 'All') {
    filtered = filtered.filter(item => {
      if (item.category && item.category === activeTag) return true;
      if (item.tags && item.tags.some(t => t.toLowerCase() === activeTag.toLowerCase())) return true;
      return false;
    });
  }

  // Filter by keyword query
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    filtered = filtered.filter(item => {
      // Build searchable haystack
      let haystack = '';
      if (item.type === 'dbms') {
        haystack = [
          item.title,
          item.prompt,
          item.schemaContext,
          item.sampleSolution,
          item.alternativeSolutions ? item.alternativeSolutions.join(' ') : '',
          item.explanation ? `${item.explanation.summary} ${item.explanation.keyConcept} ${item.explanation.detailed} ${item.explanation.realWorldPitfall}` : '',
          item.tags ? item.tags.join(' ') : '',
          item.setName
        ].join(' ').toLowerCase();
      } else if (item.type === 'mcq') {
        const optionsText = (item.options || []).map(o => o.text).join(' ');
        haystack = [
          item.title,
          item.prompt,
          optionsText,
          item.correctOptionText,
          item.explanation ? `${item.explanation.summary} ${item.explanation.keyConcept} ${item.explanation.detailed} ${item.explanation.realWorldPitfall}` : '',
          item.tags ? item.tags.join(' ') : '',
          item.setName
        ].join(' ').toLowerCase();
      } else if (item.type === 'dsa') {
        haystack = [
          item.title,
          item.category,
          item.description,
          item.solutionCode,
          item.explanation,
          item.tags ? item.tags.join(' ') : '',
          item.source
        ].join(' ').toLowerCase();
      }

      // Check all search tokens match (AND query)
      return tokens.every(token => haystack.includes(token));
    });
  }

  return filtered;
}
