import { ELEMENT_COLOR } from '../lib/ganji'
import { computeFortune } from '../lib/fortune'
import type { SajuResult, Pillar } from '../lib/saju'
import type { Interpretation } from '../lib/interpret'

function MiniPillar({ p }: { p: Pillar | null }) {
  if (!p) {
    return (
      <div className="sc-pillar">
        <div className="sc-gz sc-empty">?<br />?</div>
      </div>
    )
  }
  return (
    <div className="sc-pillar">
      <div className="sc-gz" style={{ background: ELEMENT_COLOR[p.gan.element] }}>
        {p.gan.hanja}
      </div>
      <div className="sc-gz" style={{ background: ELEMENT_COLOR[p.ji.element] }}>
        {p.ji.hanja}
      </div>
    </div>
  )
}

export default function ShareCard({
  result,
  interp,
  name,
}: {
  result: SajuResult
  interp: Interpretation
  name: string
}) {
  const dm = interp.dayMaster
  const maxBar = Math.max(...interp.bars.map((b) => b.count), 1)
  const fortune = computeFortune(result.dayMaster, interp.strength.label, new Date())

  return (
    <div className="share-card">
      <div className="sc-head">
        <span className="sc-mark">命</span>
        <div>
          <div className="sc-brand">정통 사주</div>
          <div className="sc-sub">
            {name || '무명'} · {result.input.gender === '남' ? '남성' : '여성'} ·{' '}
            {result.input.year}.{result.input.month}.{result.input.day}
          </div>
        </div>
      </div>

      <div className="sc-pillars">
        <MiniPillar p={result.pillars.hour} />
        <MiniPillar p={result.pillars.day} />
        <MiniPillar p={result.pillars.month} />
        <MiniPillar p={result.pillars.year} />
      </div>

      <div className="sc-block">
        <div className="sc-label">일간 · 나의 기질</div>
        <div className="sc-dm-title">{dm.title}</div>
        <div className="sc-keywords">
          {dm.keywords.map((k) => (
            <span className="sc-chip" key={k}>{k}</span>
          ))}
        </div>
      </div>

      <div className="sc-block">
        <div className="sc-label">
          오행 · <span className={`sc-strength tag-${interp.strength.label}`}>{interp.strength.label}</span>
        </div>
        <div className="sc-ohaeng">
          {interp.bars.map((b) => (
            <div className="sc-obar-item" key={b.element}>
              <div className="sc-obar-wrap">
                <div
                  className="sc-obar"
                  style={{ height: `${(b.count / maxBar) * 100}%`, background: ELEMENT_COLOR[b.element] }}
                />
              </div>
              <span style={{ color: ELEMENT_COLOR[b.element] }}>{b.element}{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sc-year">
        <span className="sc-label">{new Date().getFullYear()} 올해</span>
        <span className={`favor favor-${fortune.year.favor.tag}`}>{fortune.year.favor.tag}</span>
        <span className="sc-year-gz">
          {fortune.year.gan.hanja}{fortune.year.ji.hanja} · {fortune.year.ganShishen}
        </span>
      </div>

      <div className="sc-foot">四柱八字 · 정통 사주로 본 나의 명식</div>
    </div>
  )
}
