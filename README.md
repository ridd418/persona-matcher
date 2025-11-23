
# 📘 **persona-matcher**

_A smart, extensible preference-based product recommendation engine._

## 📌 Overview

**persona-matcher** is not just a quiz app — it's a **smart profiling engine** that takes user responses, identifies underlying **personality traits**, and maps these traits to **product personas**.

Unlike traditional quizzes with fixed logic paths, persona-matcher uses:

- **Trait-based scoring**
    
- **Flexible JSON-driven questions**
    
- **Dynamic persona matching**
    
- **Clean, modular UI components**
    

This makes it ideal for recommending **any product category like laptops, phones, skincare routines, shoes** which are driven by user preferences rather than strict specifications.

---

## ✨ Features

- 🔹 **JSON-based quiz engine** — modify or replace questions without touching core logic
    
- 🔹 **Trait scoring system** (non contradicting question, based on MBTI quizzes)
    
- 🔹 **Dynamic persona selection** based on dominant traits
    
- 🔹 **Clean, component-based HTML/CSS architecture**
    
- 🔹 **Lightweight JS engine** (no frameworks required)
    
- 🔹 **Mobile-friendly layout**
    
- 🔹 Fully **extensible** for any product type
    

---

## 🧠 How It Works

1. Each answer contributes points to traits like `PERF`, `PORT`, `BATT`, etc.
    
2. After the quiz, trait scores are compared.
    
3. The highest-scoring trait determines your **primary persona**.
    
4. The system outputs a tailored recommendation text.
    

This makes the quiz feel like a **personality test**, not a survey.

---

## 🗂️ Project Structure

```
persona-matcher/
│
├── index.html           # App UI
├── styles.css           # Modular BEM-based styles
├── quiz-data.js         # JSON quiz content + scoring data
├── quiz.js              # Quiz engine logic
│
├── /assets/             # (Optional) images, icons, illustrations
│
└── README.md            # You're here :)
```

---

## 🚀 Installation

Clone the repo:

```bash
git clone https://github.com/ridd418/persona-matcher
cd persona-matcher
```

That's it!

Serve locally with any static server like **ngix/apache** or **serve in nodeJS**:

Example:
```bash
npx serve .
```
or use **VSCode Live Sever** extension (not tested)

---

## 🧪 Usage

1. Open url the app hosted on
    
2. Answer the questions
    
3. Your persona appears instantly
    
4. Recommendations are displayed based on your score profile

Thats it!

---

## 🧩 Customization

### 🔧 Edit Questions / Traits

All quiz content lives in `quiz-data.js`.

Example structure:

```json
{
  "id": "q1",
  "text": "What frustrates you the most?",
  "options": [
    {
      "id": "a",
      "text": "Slow performance",
      "scores": {"PERF": 2}
    }
  ]
}
```

You can add/remove:

- Questions
    
- Options
    
- Traits
    
- Results
    

No other file needs to change.

---

## 🧬 JSON Schema

### Question Object

```ts
Question {
  id: string,
  text: string,
  options: Option[]
}
```

### Option Object

```ts
Option {
  id: string,
  text: string,
  scores: { [traitKey: string]: number }
}
```

### Result Persona Object

```ts
Result {
  id: string,
  primaryTrait: string,
  text: string,
  recommended: string
}
```

The engine is **trait-agnostic** — add as many traits as you want.

*(More **template quizzes** are available at **./data/more_quizzes**, rename as **data.json** and drop it in **./data** directory.)*

---

## ⭐ Acknowledgments

Inspired by:

- Personality profiling systems (MBTI, Enneagram)
    
- Modern product recommendation UX
    
- Preference-based scoring engines
    
---