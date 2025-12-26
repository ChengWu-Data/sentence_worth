"use client";

import { useState } from "react";
import type { EvaluationMode, EvaluationResult } from "@/lib/evaluator/contract";

export default function Home() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<EvaluationMode>("normal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onEvaluate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Request failed");
        return;
      }
      setResult(data as EvaluationResult);
    } catch (e: any) {
      setError(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">一句话值多少钱</h1>
          <p className="text-sm md:text-base text-neutral-600">
            输入一句自我介绍 / 简历 bullet，让“招聘市场”用毒舌口吻给你打分、扣分点、和改写建议。
          </p>
        </header>

        <section className="space-y-3">
          <textarea
            className="w-full min-h-[140px] rounded-xl border p-4 text-sm outline-none focus:ring-2"
            placeholder="例：Built a retrieval pipeline with SBERT+FAISS and improved Recall@5 by 18% on a 200-doc eval set."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm">
              模式：
              <select
                className="ml-2 rounded-lg border px-3 py-2 text-sm"
                value={mode}
                onChange={(e) => setMode(e.target.value as EvaluationMode)}
              >
                <option value="normal">normal</option>
                <option value="harsh">harsh</option>
              </select>
            </label>

            <button
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
              onClick={onEvaluate}
              disabled={loading || text.trim().length === 0}
            >
              {loading ? "估价中…" : "给我估价"}
            </button>

            <span className="text-xs text-neutral-500">
              {text.length}/500
            </span>
          </div>

          {error && (
            <div className="rounded-xl border p-4 text-sm">
              <div className="font-medium">出错了</div>
              <div className="text-neutral-600">{error}</div>
            </div>
          )}
        </section>

        {result && (
          <section className="rounded-2xl border p-5 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="text-2xl font-semibold">Score: {result.score}/100</div>
              <div className="text-sm text-neutral-600">{result.salary_range}</div>
            </div>

            <div className="text-sm">{result.market_comment}</div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">加分点</div>
                <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                  {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">扣分点</div>
                <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                  {result.penalties.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">改写建议</div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm whitespace-pre-wrap">
                {result.rewrite}
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              provider: {result.meta.provider} · version: {result.meta.version}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
