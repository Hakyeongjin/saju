import { ELEMENT_COLOR } from '../lib/ganji'
import { DAY_MASTER_EXAMPLE, type Interpretation } from '../lib/interpret'
import type { SajuResult } from '../lib/saju'

function OhaengChart({ interp }: { interp: Interpretation }) {
  const max = Math.max(...interp.bars.map((b) => b.count), 1)
  return (
    <div className="ohaeng">
      {interp.bars.map((b) => (
        <div className="ohaeng-item" key={b.element}>
          <div className="ohaeng-bar-wrap">
            <div
              className="ohaeng-bar"
              style={{
                height: `${(b.count / max) * 100}%`,
                background: ELEMENT_COLOR[b.element],
              }}
            >
              <span className="ohaeng-count">{b.count}</span>
            </div>
          </div>
          <div className="ohaeng-label" style={{ color: ELEMENT_COLOR[b.element] }}>
            {b.element}
            <em>{b.hanja}</em>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function InterpretationView({
  interp,
  result,
}: {
  interp: Interpretation
  result: SajuResult
}) {
  const dm = interp.dayMaster
  return (
    <>
      {/* 일간 성격 */}
      <section id="sec-ilgan" className="card">
        <h2 className="section-title">
          나의 기질 <span className="hanja-sub">日干</span>
        </h2>
        <p className="easy-note">
          💡 쉽게 말하면 — 여덟 글자 중 <b>‘나 자신’</b>을 뜻하는 글자 하나(일간)로 보는 기본 성격이에요.
        </p>
        <div className="daymaster">
          <div
            className="daymaster-badge"
            style={{ background: ELEMENT_COLOR[result.dayMasterElement] }}
          >
            <span className="dm-hanja">{result.dayMaster.hanja}</span>
          </div>
          <div className="daymaster-body">
            <h3 className="dm-title">{dm.title}</h3>
            <p className="dm-nature">“{dm.nature}”</p>
            <div className="dm-keywords">
              {dm.keywords.map((k) => (
                <span className="chip" key={k}>{k}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="dm-overview">{dm.overview}</p>
        <p className="example">📌 이런 사람이에요 — {DAY_MASTER_EXAMPLE[result.dayMaster.hanja]}</p>
        <div className="dm-detail">
          <p><b className="pos">강점</b> {dm.strength}</p>
          <p><b className="neg">주의</b> {dm.caution}</p>
        </div>
      </section>

      {/* 오행 분석 */}
      <section id="sec-ohaeng" className="card">
        <h2 className="section-title">
          오행 분포 <span className="hanja-sub">五行</span>
        </h2>
        <p className="easy-note">
          💡 쉽게 말하면 — 내 안에 <b>목·화·토·금·수</b> 다섯 기운이 얼마나 있는지 봐요. 많거나 없는 기운이 성향을 만들고, <b>신강/신약</b>은 내 기운이 센 편인지 약한 편인지를 뜻해요.
        </p>
        <OhaengChart interp={interp} />
        <p className="balance-text">{interp.balanceText}</p>
        <div className="strength-box">
          <span className={`strength-tag tag-${interp.strength.label}`}>
            {interp.strength.label}
          </span>
          <p>{interp.strength.text}</p>
        </div>
      </section>
    </>
  )
}
