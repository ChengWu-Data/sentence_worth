// src/lib/evaluator/schema.ts

/**
 * EvaluationResult
 * ----------------
 * Single source of truth for the entire system.
 * UI, API, and LLM outputs must conform to this structure.
 */

export type EvaluationMode = "normal" | "harsh";

export interface EvaluationResult {
  mode: EvaluationMode;

  /** Overall market score (0–100) */
  score: number;

  /** Market-style salary range (not literal prediction) */
  salary_range: string;

  /** Strong positive hiring signals */
  strengths: string[];

  /** Missing signals / penalties */
  penalties: string[];

  /** One blunt market comment */
  market_comment: string;

  /** Improved rewrite with stronger signal */
  rewrite: string;

  /** Metadata for versioning & debugging */
  meta: {
    provider: string;
    version: "v0";
  };
}
