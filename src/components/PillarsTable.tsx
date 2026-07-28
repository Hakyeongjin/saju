import { ELEMENT_COLOR } from '../lib/ganji'
import type { Pillar, SajuResult } from '../lib/saju'

function GanCell({ pillar }: { pillar: Pillar }) {
  const c = ELEMENT_COLOR[pillar.gan.element]
  return (
    <div className="glyph" style={{ background: c }}>
      <span className="glyph-hanja">{pillar.gan.hanja}</span>
      <span className="glyph-ko">{pillar.gan.hangul}{pillar.gan.element}</span>
    </div>
  )
}

function JiCell({ pillar }: { pillar: Pillar }) {
  const c = ELEMENT_COLOR[pillar.ji.element]
  return (
    <div className="glyph" style={{ background: c }}>
      <span className="glyph-hanja">{pillar.ji.hanja}</span>
      <span className="glyph-ko">{pillar.ji.hangul}{pillar.ji.element} · {pillar.ji.animal}띠</span>
    </div>
  )
}

function Column({ pillar, isDay }: { pillar: Pillar; isDay?: boolean }) {
  return (
    <div className={isDay ? 'pillar day-pillar' : 'pillar'}>
      <div className="pillar-head">
        <span className="pillar-label">{pillar.label}</span>
        <span className="pillar-shishen">{isDay ? '일간(나)' : pillar.shishenGan}</span>
      </div>
      <GanCell pillar={pillar} />
      <JiCell pillar={pillar} />
      <div className="hidegan">지장간 {pillar.hideGan.join(' ')}</div>
    </div>
  )
}

export default function PillarsTable({ result }: { result: SajuResult }) {
  const { hour, day, month, year } = result.pillars
  return (
    <section id="sec-pillars" className="card">
      <h2 className="section-title">사주팔자 <span className="hanja-sub">四柱八字</span></h2>
      <p className="easy-note">
        💡 쉽게 말하면 — 태어난 <b>연·월·일·시</b>를 각각 하늘 기운(천간)과 땅 기운(지지) 두 글자로 나타낸 <b>여덟 글자</b>예요. 내 운명의 기본 설계도랍니다.
      </p>
      <div className="pillars">
        {hour ? (
          <Column pillar={hour} />
        ) : (
          <div className="pillar unknown">
            <div className="pillar-head">
              <span className="pillar-label">시주</span>
              <span className="pillar-shishen">모름</span>
            </div>
            <div className="glyph empty">?</div>
            <div className="glyph empty">?</div>
            <div className="hidegan">—</div>
          </div>
        )}
        <Column pillar={day} isDay />
        <Column pillar={month} />
        <Column pillar={year} />
      </div>
      <p className="table-note">
        각 기둥은 위가 천간(天干), 아래가 지지(地支)입니다. 가운데 <b>일간</b>이 사주의 주인, 즉 &lsquo;나&rsquo;를 뜻합니다.
      </p>
    </section>
  )
}
