# Kotlin & Android Mastery Lab — Tesco Bank / Barclays GSC Preparation

An end-to-end, interactive learning and assessment platform built for senior mobile engineering roles (Senior Android Developer, Mobile Software Engineer, AVP) for **Barclays GSC** and **Tesco Bank**.

---

## 🌟 Key Features

### 1. 📖 Learn Mode (16-Step Guided Pedagogy)
Every technical topic is taught through a battle-tested, 16-step pedagogical sequence:
1. Plain English Concept & Context
2. Technical Need & Motivation
3. Real-World Analogy
4. Kotlin Idioms & Syntax
5. Smallest Working Example
6. Line-by-Line Breakdown
7. Variable & Memory Tracking
8. Runtime Progression
9. Conditionals & Loop Mechanics
10. Input / State Trace
11. Output Verification
12. Edge Cases & Banking Pitfalls
13. Time & Auxiliary Space Complexity
14. Independent Coding Exercise
15. Hints & Model Solution
16. Assessment Confirmation Problem

### 2. ▶ Trace Mode (Visual Algorithm Tutor)
- Step-by-step interactive algorithm debugger
- Live array pointer lane (`left`, `right`, `mid`)
- Current sliding window visualizer with duplicate collision detection
- Real-time `HashMap` state and variable watch grid
- Adjustable playback speed and step progress controls

### 3. ✍ Practise Mode (Coding Workspace & Test Runner)
- Built-in Kotlin IDE with line numbering, tab formatting, and draft autosaving
- Real-time compilation and execution via local **kotlinc 2.1.20 JVM**
- Multi-case automated test runner comparing stdout against expected banking test cases
- Segmented mobile tabs (`📋 Problem Details` ↔ `💻 Code & Test Runner`) for seamless smartphone and tablet usage

### 4. 🔍 Review Mode (Anti-Pattern Diagnostic)
- Static code triage detecting off-by-one errors, memory leaks, pointer regressions, and suboptimal JVM allocations
- Common pitfalls checklist tailored to banking scale and concurrency

### 5. 👔 Interview Mode (Senior / AVP Leadership Scenarios)
- Real-world production crisis scenarios:
  - Banking Monolith to Multi-Module Clean Architecture
  - Coroutine Deadlocks & Main-Thread Freezes
  - Offline-First Biometric Vault & Encrypted SharedPreferences
  - Real-Time Trade Stream Memory Leaks
- Automated scoring rubric with follow-up probing questions

### 6. 📊 Progress Dashboard
- Live assessment readiness index calculation
- Solved problem counters and time-spent telemetry
- Revision queue for topics flagged as needing reinforcement
- Exportable progress data in JSON format

---

## 📱 Mobile Responsiveness

The platform is designed to be fully responsive across mobile phones, tablets, and desktop displays:
- **Mobile Navigation Drawer:** Off-canvas sidebar with touch-friendly accordion curriculum items
- **Mobile Workspace Segmented Control:** Instantly switch between problem requirements and code runner without vertical scrolling friction
- **Touch-Optimized Controls:** Touch-friendly buttons (≥ 42px) with horizontal swipe support for tabs and visualizer cells
- **Adaptive Header:** Compact search triggers and status pills that scale across all screen widths

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Kotlin Compiler (`kotlinc` 2.1+) installed on PATH (or via Homebrew `brew install kotlin`)

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/itsmeJohnson/masterKotlin.git
cd masterKotlin

# Install dependencies
npm install

# Start the server
PORT=3456 node server.js
```

Open your browser at:
```
http://localhost:3456/
```

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, child_process (kotlinc JVM runner)
- **Frontend:** Vanilla JavaScript (ES Modules), Custom CSS Design System, JetBrains Mono & Inter typography
- **Compiler:** `kotlinc 2.1.20` JVM target
