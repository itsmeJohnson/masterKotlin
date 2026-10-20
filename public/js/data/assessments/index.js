/* ==========================================================================
   Master Assessment Sets Index
   Aggregates 20 complete HackerEarth-style practice assessment sets.
   Includes Sets 1-10 (Foundations & Core) and Sets 11-20 (Deep Migration,
   Java/JVM Internals, High-Contention Concurrency & Advanced Algorithms).
   ========================================================================== */

import { ASSESSMENT_SET_1 } from './set-1.js';
import { ASSESSMENT_SET_2 } from './set-2.js';
import { ASSESSMENT_SET_3 } from './set-3.js';
import { ASSESSMENT_SET_4 } from './set-4.js';
import { ASSESSMENT_SET_5 } from './set-5.js';
import { ASSESSMENT_SET_6 } from './set-6.js';
import { ASSESSMENT_SET_7 } from './set-7.js';
import { ASSESSMENT_SET_8 } from './set-8.js';
import { ASSESSMENT_SET_9 } from './set-9.js';
import { ASSESSMENT_SET_10 } from './set-10.js';
import { ASSESSMENT_SET_11 } from './set-11.js';
import { ASSESSMENT_SET_12 } from './set-12.js';
import { ASSESSMENT_SET_13 } from './set-13.js';
import { ASSESSMENT_SET_14 } from './set-14.js';
import { ASSESSMENT_SET_15 } from './set-15.js';
import { ASSESSMENT_SET_16 } from './set-16.js';
import { ASSESSMENT_SET_17 } from './set-17.js';
import { ASSESSMENT_SET_18 } from './set-18.js';
import { ASSESSMENT_SET_19 } from './set-19.js';
import { ASSESSMENT_SET_20 } from './set-20.js';

export const ALL_ASSESSMENT_SETS = [
  ASSESSMENT_SET_1,
  ASSESSMENT_SET_2,
  ASSESSMENT_SET_3,
  ASSESSMENT_SET_4,
  ASSESSMENT_SET_5,
  ASSESSMENT_SET_6,
  ASSESSMENT_SET_7,
  ASSESSMENT_SET_8,
  ASSESSMENT_SET_9,
  ASSESSMENT_SET_10,
  ASSESSMENT_SET_11,
  ASSESSMENT_SET_12,
  ASSESSMENT_SET_13,
  ASSESSMENT_SET_14,
  ASSESSMENT_SET_15,
  ASSESSMENT_SET_16,
  ASSESSMENT_SET_17,
  ASSESSMENT_SET_18,
  ASSESSMENT_SET_19,
  ASSESSMENT_SET_20
];

export function getAssessmentSetById(setId) {
  return ALL_ASSESSMENT_SETS.find(s => s.id === setId) || ALL_ASSESSMENT_SETS[0];
}
