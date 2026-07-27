import { useState } from 'react'
import { ELEMENT_COLOR } from '../lib/ganji'
import { daeunDetail, type PeriodReading } from '../lib/interpret'
import type { DaeunInfo, Daeun } from '../lib/saju'

function HalfReading({ label, years, reading }: { label: string; years: string; reading: PeriodReading }) {
  return (
    <div className="half">
      <div className="half-head">
        <span className="half-label">{label}</span>
        <span className="half-years">{years}</span>
        <span className={`favor favor-${reading.favor.tag}`}>{reading.favor.tag}</span>
      </div>
      <p className="half-shishen"><b>{reading.shishen}</b> · {reading.meaning}</p>
      <p className="half-favor">{reading.favor.text}</p>
    </div>
  )
}

function Detail({ d, strengthLabel }: { d: Daeun; strengthLabel: '신강' | '신약' | '중화' }) {
  const detail = daeunDetail(d, strengthLabel)
  const mid = d.startYear + 5
  return (
    <div className="daeun-detail">
      <h3 className="daeun-detail-title">
        {d.startAge}세 대운 · {d.gan.hanja}{d.ji.hanja}
        <span className="dd-sub">({d.gan.hangul}{d.ji.hangul} · {d.startYear}~{d.endYear})</span>
      </h3>
      <HalfReading label="전반 5년" years={`${d.startYear}~${mid - 1}`} reading={detail.ganHalf} />
      <HalfReading label="후반 5년" years={`${mid}~${d.endYear}`} reading={detail.jiHalf} />
    </div>
  )
}

export default function DaeunView({
  daeun,
  strengthLabel,
}: {
  daeun: DaeunInfo
  strengthLabel: '신강' | '신약' | '중화'
}) {
  const nowYear = new Date().getFullYear()
  const currentIdx = daeun.list.findIndex((d) => nowYear >= d.startYear && nowYear <= d.endYear)
  const [sel, setSel] = useState<number>(currentIdx >= 0 ? currentIdx : 0)

  return (
    <section className="card">
      <h2 className="section-title">
        대운 <span className="hanja-sub">大運 · 10년 운의 흐름</span>
      </h2>

      <div className="daeun-meta">
        <span className={`daeun-dir dir-${daeun.direction}`}>{daeun.direction}</span>
        <span className="daeun-su">대운수 {daeun.startText}</span>
      </div>

      <div className="daeun-track">
        {daeun.list.map((d, i) => {
          const isNow = i === currentIdx
          const color = ELEMENT_COLOR[d.element]
          const cls = `daeun-card${isNow ? ' now' : ''}${i === sel ? ' sel' : ''}`
          return (
            <button className={cls} key={d.startYear} onClick={() => setSel(i)}>
              {isNow && <span className="daeun-now-tag">현재</span>}
              <span className="daeun-age">{d.startAge}세~</span>
              <span className="daeun-gz" style={{ background: color }}>
                <span className="daeun-gan">{d.gan.hanja}</span>
                <span className="daeun-ji">{d.ji.hanja}</span>
              </span>
              <span className="daeun-ko">{d.gan.hangul}{d.ji.hangul}</span>
              <span className="daeun-ss" style={{ color }}>{d.shishen}</span>
              <span className="daeun-year">{d.startYear}~{d.endYear}</span>
            </button>
          )
        })}
      </div>
      <p className="table-note">카드를 누르면 그 시기의 상세 풀이가 보입니다. (좌우로 넘겨보세요 →)</p>

      {daeun.list[sel] && <Detail d={daeun.list[sel]} strengthLabel={strengthLabel} />}
    </section>
  )
}
