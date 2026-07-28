import { useMemo } from 'react'
import { analyzeThemes } from '../lib/themes'
import type { SajuResult } from '../lib/saju'
import type { Interpretation } from '../lib/interpret'

export default function ThemeView({
  result,
  interp,
}: {
  result: SajuResult
  interp: Interpretation
}) {
  const themes = useMemo(() => analyzeThemes(result, interp), [result, interp])
  return (
    <section id="sec-theme" className="card">
      <h2 className="section-title">
        테마별 운세 <span className="hanja-sub">戀愛 · 財物 · 健康</span>
      </h2>
      <p className="easy-note">
        💡 쉽게 말하면 — 내 사주를 바탕으로 <b>연애·재물·건강·학업·대인관계</b> 다섯 가지 분야의 타고난 운을 풀어봤어요.
      </p>
      <div className="theme-list">
        {themes.map((t) => (
          <div className="theme-item" key={t.title}>
            <h3 className="theme-title">
              <span className="theme-icon">{t.icon}</span> {t.title}
            </h3>
            {t.paras.map((p, i) => (
              <p className="theme-para" key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            <p className="example">📌 {t.example}</p>
            <p className="basis">🔎 근거: {t.basis}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
