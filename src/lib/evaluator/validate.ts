import { EvaluationResultSchema, type EvaluationResult } from "./contract";

export function parseEvaluationResult(input: unknown): EvaluationResult {
  return EvaluationResultSchema.parse(input);
}

export function safeParseEvaluationResult(input: unknown): {
  ok: true; data: EvaluationResult;
} | {
  ok: false; error: string;
} {
  const res = EvaluationResultSchema.safeParse(input);
  if (res.success) return { ok: true, data: res.data };

  return {
    ok: false,
    error: res.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; "),
  };
}
