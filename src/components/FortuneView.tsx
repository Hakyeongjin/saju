import { useMemo } from 'react'
import { ELEMENT_COLOR, type Gan } from '../lib/ganji'
import { computeFortune, type FortunePeriod } from '../lib/fortune'

function FortuneCard({ p }: { p: FortunePeriod }) {
  const color = ELEMENT_COLOR[p.element]
  return (
    <div className="fortune-card">
      <div className="fortune-top">
        <div className="fortune-gz" style={{ background: color }}>
          <span>{p.gan.hanja}</span>
          <span>{p.ji.hanja}</span>
        </div>
        <div className="fortune-headtext">
          <div className="fortune-title">{p.title}</div>
          <div className="fortune-when">{p.when}</div>
          <span className={`favor favor-${p.favor.tag}`}>{p.favor.tag}</span>
        </div>
      </div>
      <p className="fortune-favor">{p.favor.text}</p>
      <div className="fortune-shishen">
        <p><b>{p.ganShishen}</b> {p.ganMeaning}</p>
        {p.jiShishen && <p><b>{p.jiShishen}</b> {p.jiMeaning}</p>}
      </div>
    </div>
  )
}

export default function FortuneView({
  dayMaster,
  strengthLabel,
}: {
  dayMaster: Gan
  strengthLabel: '신강' | '신약' | '중화'
}) {
  const fortune = useMemo(
    () => computeFortune(dayMaster, strengthLabel, new Date()),
    [dayMaster, strengthLabel],
  )
  return (
    <section className="card">
      <h2 className="section-title">
        올해·오늘 운세 <span className="hanja-sub">歲運 · 日辰</span>
      </h2>
      <div className="fortune-grid">
        <FortuneCard p={fortune.year} />
        <FortuneCard p={fortune.today} />
      </div>
      <p className="table-note">
        세운(歲運)은 그해의 운, 일진(日辰)은 그날의 기운입니다. 사주 원국(나의 그릇)에 오늘의 기운이 어떻게 맞물리는지를 봅니다.
      </p>
    </section>
  )
}
