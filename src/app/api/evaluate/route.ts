import { NextResponse } from "next/server";
import { EvaluationResultSchema, type EvaluationMode } from "@/lib/evaluator/contract";

type EvaluateRequest = {
  text: string;
  mode?: EvaluationMode;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function evaluate(text: string, mode: EvaluationMode) {
  const t = text.trim();

  const hasNumbers = /\d/.test(t);
  const hasImpactVerb =
    /\b(improved|increased|reduced|built|led|shipped|delivered|launched|optimized|audited)\b/i.test(t);
  const hasTools =
    /\b(SQL|Python|Tableau|Power BI|Looker|AWS|Excel|dbt|Airflow|Spark|FAISS|SBERT)\b/i.test(t);
  const tooVague = t.length < 35 || /\b(helped|worked on|assisted|involved)\b/i.test(t);

  let score = 60;
  const strengths: string[] = [];
  const penalties: string[] = [];

  if (hasNumbers) { score += 12; strengths.push("有量化信息（可信号）"); }
  else { score -= 10; penalties.push("没有量化结果（像在讲过程，不像在讲价值）"); }

  if (hasImpactVerb) { score += 10; strengths.push("动词有冲击力（更像交付）"); }
  else { score -= 6; penalties.push("动词偏弱（更像“参与/协助”）"); }

  if (hasTools) { score += 6; strengths.push("技能栈明确（可被匹配到 JD 关键词）"); }
  else { penalties.push("工具/方法不明确（招聘侧难以归类）"); }

  if (tooVague) { score -= 12; penalties.push("表达偏空（缺少范围/规模/结果）"); }

  score = clamp(score, 0, 100);

  const salary_range =
    score >= 85 ? "NYC $140k–$190k (strong signal)" :
    score >= 75 ? "NYC $115k–$160k (solid)" :
    score >= 65 ? "NYC $95k–$130k (mixed)" :
    "NYC $75k–$105k (weak signal)";

  const harshPrefix = mode === "harsh" ? "市场毒舌： " : "";
  const market_comment =
    score >= 85 ? `${harshPrefix}这句像是“能被面试官复述”的 bullet。继续保持：范围+动作+结果一条线。` :
    score >= 75 ? `${harshPrefix}不错，但还差一个“可复述的证据点”：再加一个指标/对比/基准。` :
    score >= 65 ? `${harshPrefix}像在描述任务，不像在卖价值。把“我做了什么”改成“我带来了什么变化”。` :
    `${harshPrefix}这句基本等于没说。先补：对象是谁/规模多大/改了什么/结果怎样。`;

  const rewrite =
    hasNumbers
      ? `Rewritten: ${t.replace(/\s+/g, " ")} (tie metrics → business impact in one sentence).`
      : `Rewritten: Owned X end-to-end and delivered Y% improvement (replace with your real metric).`;

  const result = {
    mode,
    score,
    salary_range,
    strengths,
    penalties,
    market_comment,
    rewrite,
    meta: {
      provider: "rule-based-mvp",
      version: "v0" as const,
    },
  };

  return EvaluationResultSchema.parse(result);
}

export async function POST(req: Request) {
  let body: EvaluateRequest;

  try {
    body = (await req.json()) as EvaluateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  const mode: EvaluationMode = body.mode ?? "normal";

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  if (text.length > 500) {
    return NextResponse.json({ error: "text too long (<= 500 chars)" }, { status: 400 });
  }

  const result = evaluate(text, mode);
  return NextResponse.json(result);
}
