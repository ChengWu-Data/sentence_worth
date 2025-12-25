# Sentence Worth

> How much is this sentence worth — if evaluated by the hiring market itself?

This is a small web tool that prices **one single resume sentence**
as if judged by the job market.

No encouragement.  
No career advice.  
No pretending effort equals value.

Just signal, penalties, and market reality.

---

## What You Do

- Paste **one resume bullet**
- Choose a tone (normal / harsh)
- Get:
  - A hireability score
  - A salary range (market-style, not exact)
  - Clear strengths
  - Clear penalties
  - One blunt market comment
  - One rewritten version that actually transmits signal

---

## What This Is NOT

- ❌ Not a resume generator  
- ❌ Not career coaching  
- ❌ Not salary prediction  
- ❌ Not motivation or encouragement  

This tool does not tell you what to feel.
It shows you what the market *reads*.

---

## Why This Exists

Most resumes fail not because of lack of skill,
but because they fail to **transmit signal**.

This project treats the job market as a cold evaluator:
- unclear impact gets discounted
- vague effort gets penalized
- specificity gets rewarded

Nothing personal. Just pricing.

---

## How It Works (High Level)

1. You submit a sentence
2. The system evaluates its signal
3. A pricing layer anchors it to a realistic market range
4. The output is normalized into a fixed structure
5. The UI renders it without interpretation

LLMs are used as language evaluators,  
not as decision-makers.

Money, score, and constraints are rule-anchored.

---

## Design Principles

- **One sentence only**
- **One page only**
- **LLM is replaceable**
- **Rules are explicit**
- **Failures must still render**

---

## Disclaimer

This is not career advice.

This is a simulation of how the hiring market
*often behaves*, not how it should behave.

If it feels uncomfortable,
that’s usually the point.

---

## Tech Stack (MVP)

- Next.js (App Router)
- TypeScript
- Serverless API
- LLM (provider-agnostic)
- Rule-based pricing & post-processing

---

## Status

- v0: Single sentence evaluation (current)
- Future versions may add:
  - job-specific modes
  - comparison views
  - multi-bullet evaluation

Only if it stays sharp.
