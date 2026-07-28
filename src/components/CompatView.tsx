import { ELEMENT_COLOR } from '../lib/ganji'
import type { CompatResult } from '../lib/compat'
import type { SajuResult } from '../lib/saju'

function PersonBadge({ result, name, tagClass, tag }: { result: SajuResult; name: string; tagClass: string; tag: string }) {
  const dm = result.dayMaster
  const ji = result.pillars.day.ji
  return (
    <div className="compat-person">
      <span className={`couple-tag ${tagClass}`}>{tag}</span>
      <span className="compat-name">{name || (tag === '나' ? '나' : '상대')}</span>
      <div className="compat-daybadge">
        <span className="compat-gz" style={{ background: ELEMENT_COLOR[dm.element] }}>{dm.hanja}</span>
        <span className="compat-gz" style={{ background: ELEMENT_COLOR[ji.element] }}>{ji.hanja}</span>
      </div>
      <span className="compat-dm">{dm.hangul}{dm.element} 일간</span>
    </div>
  )
}

export default function CompatView({
  compat,
  a,
  b,
  nameA,
  nameB,
}: {
  compat: CompatResult
  a: SajuResult
  b: SajuResult
  nameA: string
  nameB: string
}) {
  return (
    <>
      <section id="sec-compat" className="card compat-hero">
        <div className="compat-people">
          <PersonBadge result={a} name={nameA} tagClass="me" tag="나" />
          <div className="compat-heart">💞</div>
          <PersonBadge result={b} name={nameB} tagClass="you" tag="상대" />
        </div>
        <div className="compat-score-wrap">
          <div className="compat-grade">{compat.grade}</div>
          <div className="compat-score">{compat.score}<em>점</em></div>
        </div>
        <p className="compat-summary" dangerouslySetInnerHTML={{ __html: compat.summary }} />
      </section>

      <section id="sec-compat-detail" className="card">
        <h2 className="section-title">궁합 풀이 <span className="hanja-sub">宮合</span></h2>
        <p className="easy-note">
          💡 쉽게 말하면 — 두 사람의 사주를 <b>성향·배우자 자리·기운·재물·건강·일·대인관계</b> 등 분야별로 하나하나 비교해 인연을 풀어봤어요.
        </p>
        <div className="theme-list">
          {compat.sections.map((s, i) => (
            <div className="theme-item" id={`sec-c-${i}`} key={s.title}>
              <h3 className="theme-title">
                <span className="theme-icon">{s.icon}</span> {s.title}
              </h3>
              {s.paras.map((p, i) => (
                <p className="theme-para" key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              <p className="basis">🔎 근거: {s.basis}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sec-compat-fortune" className="card">
        <h2 className="section-title">올해·오늘 두 사람 운세 <span className="hanja-sub">歲運 · 日辰</span></h2>
        <p className="easy-note">
          💡 쉽게 말하면 — <b>올해와 오늘</b>의 기운이 두 사람 관계에 어떻게 작용하는지, 한 문단씩 짚어봤어요.
        </p>
        <div className="cfortune">
          {[compat.fortune.year, compat.fortune.today].map((p) => (
            <div className="cfortune-item" key={p.label}>
              <div className="cfortune-head">
                <span className="cfortune-gz" style={{ background: ELEMENT_COLOR[p.element] }}>{p.ganZhi}</span>
                <div className="cfortune-headtext">
                  <span className="cfortune-label">{p.label} 두 사람 운세</span>
                  <span className="cfortune-sub">{p.ganZhi} ({p.hangul})</span>
                </div>
                <span className={`ctag ctag-${p.tag}`}>{p.tag}</span>
              </div>
              {p.paras.map((para, i) => (
                <p className="cfortune-comment" key={i}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="sec-compat-timeline" className="card">
        <h2 className="section-title">시기별 궁합 흐름 <span className="hanja-sub">流年</span></h2>
        <p className="easy-note">
          💡 쉽게 말하면 — 앞으로 몇 년간 <b>두 사람의 관계 기운</b>이 해마다 어떻게 흐르는지 봐요. (각자의 배우자 자리와 그해 기운의 어울림·부딪힘 기준)
        </p>
        <div className="cyear-list">
          {compat.timeline.map((y) => (
            <div className={y.isNow ? 'cyear now' : 'cyear'} key={y.year}>
              <div className="cyear-head">
                <span className="cyear-gzbadge" style={{ background: ELEMENT_COLOR[y.element] }}>{y.ganZhi}</span>
                <div className="cyear-headtext">
                  <span className="cyear-year">{y.year}{y.isNow ? ' · 올해' : ''}</span>
                  <span className="cyear-gz">{y.ganZhi} ({y.hangul})</span>
                </div>
                <span className={`ctag ctag-${y.tag}`}>{y.tag}</span>
              </div>
              {y.paras.map((para, i) => (
                <p className="cyear-note" key={i}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
