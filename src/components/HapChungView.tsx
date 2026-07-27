import { useMemo } from 'react'
import { analyzeHapChung, type Relation } from '../lib/hapchung'
import type { SajuResult } from '../lib/saju'

function RelationRow({ r }: { r: Relation }) {
  return (
    <div className="hc-row">
      <span className={`hc-badge hc-${r.badge}`}>{r.badge}</span>
      <div className="hc-body">
        <div className="hc-line">
          <b className="hc-chars">{r.chars}</b>
          <span className="hc-kind">{r.kind}</span>
          <span className="hc-pos">{r.labels}</span>
          {r.detail && <span className="hc-detail">{r.detail}</span>}
        </div>
        <p className="hc-meaning">{r.meaning}</p>
      </div>
    </div>
  )
}

function Group({ title, relations }: { title: string; relations: Relation[] }) {
  return (
    <div className="hc-group">
      <h3 className="hc-group-title">{title}</h3>
      {relations.length ? (
        relations.map((r, i) => <RelationRow key={i} r={r} />)
      ) : (
        <p className="hc-none">뚜렷한 합·충 관계가 없습니다.</p>
      )}
    </div>
  )
}

export default function HapChungView({ result }: { result: SajuResult }) {
  const hc = useMemo(() => analyzeHapChung(result, new Date()), [result])
  return (
    <section className="card">
      <h2 className="section-title">
        합·충 심화 <span className="hanja-sub">合 · 沖</span>
      </h2>
      <Group title="원국 안에서 (타고난 사주)" relations={hc.natal} />
      <Group title={hc.seun.label} relations={hc.seun.relations} />
      {hc.daeun && <Group title={hc.daeun.label} relations={hc.daeun.relations} />}
      <p className="table-note">
        <b className="hc-legend hc-합">합</b> 은 기운이 묶이는 인연·결속, <b className="hc-legend hc-충">충</b> 은 부딪혀 흔들리는 변동을 뜻합니다. 운(대운·세운)의 글자가 내 원국과 합·충하면 그 시기에 관련된 일이 두드러집니다.
      </p>
    </section>
  )
}
