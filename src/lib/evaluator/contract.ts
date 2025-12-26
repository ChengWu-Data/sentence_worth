import { z } from "zod";

/**
 * Runtime contract for EvaluationResult.
 * LLM / API outputs must parse with this schema.
 */

export const EvaluationModeSchema = z.enum(["normal", "harsh"]);
export type EvaluationMode = z.infer<typeof EvaluationModeSchema>;

export const EvaluationResultSchema = z.object({
  mode: EvaluationModeSchema,

  score: z.number().int().min(0).max(100),

  // e.g. "$95k–$125k" or "NYC $120k–$160k"
  salary_range: z.string().min(1),

  strengths: z.array(z.string().min(1)).max(8),
  penalties: z.array(z.string().min(1)).max(10),

  market_comment: z.string().min(1),
  rewrite: z.string().min(1),

  meta: z.object({
    provider: z.string().min(1),
    version: z.literal("v0"),
  }),
});

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
