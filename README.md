# Persona Matcher 🧘‍♂️

A **smart, extensible preference-based product recommendation engine** built with **Vanilla JavaScript, HTML, and CSS**.  

It profiles users through a **trait-based scoring quiz** and maps their answers to **product personas**, making it ideal for recommending laptops, phones, or any product driven by user preferences.

---

## Why This Project Exists

This project exists to explore how **non-trivial decision logic** can live outside the UI.

On the surface, Persona Matcher looks like “just a quiz.”
Underneath, it models a **stateful decision engine** that:

* accumulates scores across multiple dimensions
* supports forward and backward navigation
* derives results from aggregated state
* remains extensible without changing core logic

The goal was not to build a flashy personality test, but to understand how **real recommendation systems** are structured:
where data is immutable, logic is centralized, and the UI is a replaceable layer.

This project represents a shift from “making things work” to **making systems understandable, evolvable, and safe to change**.

---

## Engineering Focus

The primary engineering focus of this project was **state control and responsibility boundaries**.

Specifically:

* keeping **source data immutable**
* ensuring the **engine owns all state transitions**
* exposing **snapshots, not live state**
* preventing the UI from influencing domain logic

Key areas of focus:

* **Immutability as a safety net**
  Quiz data is deep-frozen on load to prevent accidental mutation across modules.

* **Engine-driven state**
  The quiz engine owns progression, scoring, and navigation logic.
  The UI never calculates outcomes — it only renders them.

* **Explicit state transitions**
  Moving forward, going back, and completing the quiz are all deliberate engine actions.

* **Framework-agnostic design**
  The engine can be reused in other environments without modification.

This project was where I fully internalized the idea that **state should be protected before it’s shared**.

---

## Architecture Overview

```
User Interaction
        │
        ▼
Presentation Layer (script.js)
        │
        ▼
Quiz Engine (quizEngine.js)
        │
        ▼
Immutable Data Layer (dataFetcher.js → frozen JSON)

------------------------------------------------------------

script.js (app orchestrator)
  ├─ initializes quiz engine
  ├─ renders question & result snapshots
  ├─ updates progress bar
  └─ handles user events (answer/back)

quizEngine.js (core quiz logic)
  ├─ tracks current question index
  ├─ computes trait scores
  ├─ caches answers for back navigation
  └─ emits state snapshots to presentation layer

dataFetcher.js (immutable data layer)
  ├─ fetches JSON quiz data
  ├─ deep-freezes objects to prevent mutation
  └─ provides read-only quiz definitions to engine

```

#### Flow Overview

1. **Initialization**
   - `script.js` fetches immutable JSON data via `dataFetcher.js`.
   - `startQuiz` initializes the engine, passing rendering callbacks.

2. **Question Rendering**
   - Engine emits the current question snapshot.
   - `script.js` renders the question, options, and progress bar.

3. **Answer Handling**
   - User selects an option → event listener calls `engine.answer(optionId)`.
   - Engine updates internal scores and emits next question snapshot.
   - Presentation layer renders the updated question.

4. **Navigation**
   - User clicks **Back** → event listener calls `engine.goBack()`.
   - Engine reverses last answer, updates scores, emits previous question snapshot.
   - Presentation layer renders previous question.

5. **Result Calculation**
   - After all questions, engine calculates the highest-scoring trait.
   - Finds the corresponding persona in JSON.
   - Calls render callback to display final persona and recommendations.

**Key rule:**
The flow is always **top → down**.
No layer reaches upward, and no layer mutates data it doesn’t own.

---

## Design Decisions

### 1. Freeze data at the boundary

Quiz data is deep-frozen immediately after fetching.

This ensures:

* traits, questions, and scoring rules cannot be mutated accidentally
* bugs fail loudly instead of silently corrupting state
* engine logic can trust its inputs

If something breaks, it breaks early.

---

### 2. Keep mutable state private to the engine

The quiz engine maintains:

* current index
* scoring state
* answer history

None of this state is exposed directly.

Instead, the engine emits **read-only snapshots** (`{ index, question }`) to the presentation layer.

The UI never owns state — it reacts to it.

---

### 3. Treat navigation as a first-class concern

Supporting “Back” was not an afterthought.

Answer history is tracked explicitly so that:

* scores can be reversed deterministically
* navigation doesn’t rely on recalculation hacks
* forward and backward movement stay symmetric

This mirrors real-world workflows where users revise decisions.

---

### 4. Separate orchestration from logic

`script.js` does not decide *what* happens — it decides *when* things happen.

Its role is to:

* initialize the engine
* wire events to engine methods
* render engine outputs

This keeps the control flow readable without pushing logic into the UI.

---

### 5. Optimize for clarity, not cleverness

This project intentionally avoids:

* frameworks
* global state
* implicit behavior

The goal was to make every responsibility visible, even if that meant writing more code.

The result is a system that’s easier to reason about **without even running it**.

---

### 6. Using Git branches to isolate architectural change

This refactor was the first time I deliberately used **branching as part of the design process**, not just version control.

Instead of refactoring directly on `main`, I introduced a dedicated `feature` branch once the architectural direction became unclear. This allowed me to:

* experiment freely with breaking changes
* refactor in small, focused commits
* abandon or rework ideas without polluting stable history
* review the refactor as a coherent narrative rather than a tangled diff

Each commit on the feature branch represents a **single architectural decision**:

* freezing input data
* emitting state snapshots instead of internal state
* tightening engine boundaries
* simplifying orchestration

Once the refactor stabilized, it was merged back through a controlled staging branch.

Seeing the full commit graph made something click for me:
Git isn’t just a safety net — it’s a **thinking tool** for complex refactors.

Branching made architectural exploration explicit, reversible, and reviewable.

---

## 🎯 Features

- **JSON-driven quizzes** – Add/remove questions, options, and traits without touching engine logic  
- **Trait scoring system** – Dynamically calculates scores for traits like `PERF`, `PORT`, `BATT`, etc.  
- **Dynamic persona matching** – Picks the persona based on dominant traits  
- **Lightweight, modular JS engine** – No frameworks required  
- **Mobile-friendly UI** – Fully responsive, clean component-based layout  
- **Extensible** – Supports any product category or persona type  

---

## 🖥️ Demo

Check out the live demo:
<a href="https://ridd418.github.io/persona-matcher/" target="_blank" rel="noopener noreferrer">
  https://ridd418.github.io/persona-matcher
</a>

---

## 📂 Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ridd418/persona-matcher.git
    cd deal-timer
    ```

2. Install `Docker` and `Docker Compose` if not already installed

3. Deploy using Docker (from the project folder):

    ```bash
    docker compose up -d
    ```

4. Open <a href="http://localhost:4000/" target="_blank" rel="noopener noreferrer">http://localhost:4000</a> in your browser

**Tip:** Change the host `port` in `compose.yaml` if needed:

```yaml
ports:
  - "<your port here>:80"
````

**Clean up:**

```bash
docker compose down
```

---

## 🔧 Customization

### Edit Quiz Data

All quiz content is in JSON files in `/data`. Example structure:

```json
{
  "id": "q1",
  "text": "What frustrates you the most?",
  "options": [
    { "id": "a", "text": "Slow performance", "scores": { "PERF": 2 } }
  ]
}
```

You can add or remove:

* Questions
* Options
* Traits
* Result personas

No other files need to change.

### JSON Schema

**Question Object**

```ts
Question {
  id: string,
  text: string,
  options: Option[]
}
```

**Option Object**

```ts
Option {
  id: string,
  text: string,
  scores: { [traitKey: string]: number }
}
```

**Result Persona Object**

```ts
Result {
  id: string,
  primaryTrait: string,
  text: string,
  recommended: string
}
```

The engine is **trait-agnostic**—add as many traits as you want.

---

## 📸 Screenshot

![Persona Matcher Screenshot](media/screenshot.png)

---

## ⭐ Acknowledgments

Inspired by:

* Personality profiling systems (MBTI, Enneagram)
* Modern product recommendation UX
* Preference-based scoring engines

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.