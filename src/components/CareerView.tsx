import { useMemo } from 'react'
import { analyzeCareer } from '../lib/career'
import type { SajuResult } from '../lib/saju'
import type { Interpretation } from '../lib/interpret'

export default function CareerView({
  result,
  interp,
}: {
  result: SajuResult
  interp: Interpretation
}) {
  const c = useMemo(() => analyzeCareer(result, interp, new Date()), [result, interp])
  return (
    <section id="sec-career" className="card">
      <h2 className="section-title">
        직장운·적성 <span className="hanja-sub">職業</span>
      </h2>
      <p className="easy-note">
        💡 쉽게 말하면 — 내 사주가 <b>조직 생활형</b>인지 <b>사업·전문직형</b>인지, 그리고 지금 직장·일 운의 흐름은 어떤지 보는 부분이에요.
      </p>

      <div className="career-style">
        <h3 className="career-title">{c.styleTitle}</h3>
        <p className="career-text">{c.styleText}</p>
        <div className="career-fields">
          {c.fields.map((f) => (
            <span className="chip" key={f}>{f}</span>
          ))}
        </div>
        <p className="career-caution"><b className="neg">참고</b> {c.caution}</p>
      </div>

      <div className="career-flow">
        <span className="career-flow-label">지금 직장운 흐름</span>
        <p>{c.flowText}</p>
      </div>
      <p className="basis">🔎 근거: {c.basis}</p>
    </section>
  )
}
