import type { ShishenAnalysis } from '../lib/interpret'
import type { ShishenGroup } from '../lib/ganji'

const GROUP_COLOR: Record<ShishenGroup, string> = {
  비겁: '#4f7d5b',
  식상: '#c9772e',
  재성: '#b8902f',
  관성: '#a8443a',
  인성: '#3f5b8c',
}

export default function ShishenView({ analysis }: { analysis: ShishenAnalysis }) {
  const max = Math.max(...analysis.groups.map((g) => g.count), 1)
  return (
    <section id="sec-shishen" className="card">
      <h2 className="section-title">
        십신 분석 <span className="hanja-sub">十神</span>
      </h2>
      <p className="easy-note">
        💡 쉽게 말하면 — 내 일간을 기준으로 나머지 글자들이 <b>재물·명예·표현·도움</b> 같은 어떤 역할을 하는지 나눈 거예요.
      </p>

      <div className="ss-groups">
        {analysis.groups.map((g) => {
          const isDom = analysis.dominant === g.group
          return (
            <div className={isDom ? 'ss-group dom' : 'ss-group'} key={g.group}>
              <div className="ss-bar-wrap">
                <div
                  className="ss-bar"
                  style={{
                    height: `${(g.count / max) * 100}%`,
                    background: GROUP_COLOR[g.group],
                  }}
                />
              </div>
              <div className="ss-count" style={{ color: GROUP_COLOR[g.group] }}>
                {g.count}
              </div>
              <div className="ss-name">{g.group}</div>
              <div className="ss-members">{g.members.join('·') || '—'}</div>
            </div>
          )
        })}
      </div>

      <p className="balance-text">{analysis.summary}</p>

      {analysis.present.length > 0 && (
        <div className="ss-detail">
          {analysis.present.map((s) => (
            <div className="ss-item" key={s.name}>
              <span
                className="ss-chip"
                style={{ background: GROUP_COLOR[s.group] }}
              >
                {s.name}
                {s.count > 1 && <em> ×{s.count}</em>}
              </span>
              <div className="ss-item-body">
                <p>{s.text}</p>
                <p className="example">📌 {s.example}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
