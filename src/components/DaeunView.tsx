import { useState } from 'react'
import { ELEMENT_COLOR, type Gan } from '../lib/ganji'
import { daeunDetail } from '../lib/interpret'
import { sewoonForYear } from '../lib/fortune'
import type { DaeunInfo } from '../lib/saju'

export default function DaeunView({
  daeun,
  dayMaster,
  strengthLabel,
}: {
  daeun: DaeunInfo
  dayMaster: Gan
  strengthLabel: '신강' | '신약' | '중화'
}) {
  const nowYear = new Date().getFullYear()
  const currentIdx = daeun.list.findIndex((d) => nowYear >= d.startYear && nowYear <= d.endYear)
  const [open, setOpen] = useState<number>(currentIdx >= 0 ? currentIdx : 0)

  return (
    <section id="sec-daeun" className="card">
      <h2 className="section-title">
        대운 <span className="hanja-sub">大運 · 10년 운의 흐름</span>
      </h2>
      <p className="easy-note">
        💡 쉽게 말하면 — <b>10년마다 바뀌는 큰 운</b>이에요. 각 카드를 누르면 그 10년의 <b>연도별 세운(그해의 운)</b>이 펼쳐집니다.
      </p>

      <div className="daeun-meta">
        <span className={`daeun-dir dir-${daeun.direction}`}>{daeun.direction}</span>
        <span className="daeun-su">대운수 {daeun.startText}</span>
      </div>

      <div className="cdecade-list">
        {daeun.list.map((d, i) => {
          const isNow = i === currentIdx
          const isOpen = open === i
          const detail = daeunDetail(d, strengthLabel)
          return (
            <div className={isNow ? 'cdecade now' : 'cdecade'} key={d.startYear}>
              <button className="cdecade-head" onClick={() => setOpen(isOpen ? -1 : i)}>
                <span className="cyear-gzbadge" style={{ background: ELEMENT_COLOR[d.element] }}>
                  {d.gan.hanja}{d.ji.hanja}
                </span>
                <div className="cdecade-headtext">
                  <span className="cdecade-range">
                    {d.startAge}세~ · {d.gan.hangul}{d.ji.hangul}{isNow ? ' · 현재' : ''}
                  </span>
                  <span className="cdecade-counts">
                    {d.startYear}~{d.endYear} · 전반 {d.shishen} / 후반 {d.jiShishen}
                  </span>
                </div>
                <span className="cdecade-toggle">{isOpen ? '▲' : '▼'}</span>
              </button>
              <div className="cdecade-summary">
                <p>
                  <b>전반 5년 · {detail.ganHalf.shishen}</b>{' '}
                  <span className={`favor favor-${detail.ganHalf.favor.tag}`}>{detail.ganHalf.favor.tag}</span>
                  {' — '}{detail.ganHalf.favor.text}
                </p>
                <p style={{ marginTop: '6px' }}>
                  <b>후반 5년 · {detail.jiHalf.shishen}</b>{' '}
                  <span className={`favor favor-${detail.jiHalf.favor.tag}`}>{detail.jiHalf.favor.tag}</span>
                  {' — '}{detail.jiHalf.favor.text}
                </p>
              </div>
              {isOpen && (
                <div className="cdecade-years">
                  {Array.from({ length: d.endYear - d.startYear + 1 }, (_, k) =>
                    sewoonForYear(dayMaster, strengthLabel, d.startYear + k),
                  ).map((y) => (
                    <div className="cyearrow" key={y.year}>
                      <div className="cyearrow-head">
                        <span className="cyearrow-year">{y.year}</span>
                        <span className="cyearrow-gz">{y.ganZhi}({y.hangul}) · {y.shishen}</span>
                        <span className={`favor favor-${y.tag}`}>{y.tag}</span>
                      </div>
                      <p className="cyearrow-note">{y.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
