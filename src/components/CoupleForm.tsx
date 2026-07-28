import { useState } from 'react'
import PersonFields, { makePerson, type PersonState } from './PersonFields'
import { isValidSolarDate, type SajuInput } from '../lib/saju'
import type { RelType } from '../lib/compat'

interface Props {
  onSubmit: (
    inputA: SajuInput,
    nameA: string,
    inputB: SajuInput,
    nameB: string,
    relationType: RelType,
  ) => void
}

function toInput(p: PersonState): { input?: SajuInput; error?: string } {
  const cy = new Date().getFullYear()
  const y = parseInt(p.year, 10)
  const m = parseInt(p.month, 10)
  const d = parseInt(p.day, 10)
  if (!y || y < 1900 || y > cy) return { error: `연도를 1900~${cy} 사이로 입력해 주세요.` }
  if (!m || m < 1 || m > 12) return { error: '월을 1~12 사이로 입력해 주세요.' }
  if (!d || d < 1 || d > 31) return { error: '일을 1~31 사이로 입력해 주세요.' }
  if (p.calendar === '양력' && !isValidSolarDate(y, m, d)) return { error: '존재하지 않는 날짜예요. 날짜를 다시 확인해 주세요.' }
  const [hh, mm] = p.time.split(':').map((v) => parseInt(v, 10))
  return {
    input: {
      year: y, month: m, day: d,
      hour: p.unknownTime ? 12 : hh || 0,
      minute: p.unknownTime ? 0 : mm || 0,
      calendar: p.calendar,
      isLeapMonth: p.calendar === '음력' && p.isLeapMonth,
      unknownTime: p.unknownTime,
      trueSolar: p.trueSolar,
      gender: p.gender,
    },
  }
}

export default function CoupleForm({ onSubmit }: Props) {
  const [me, setMe] = useState<PersonState>(() => makePerson('남'))
  const [partner, setPartner] = useState<PersonState>(() => makePerson('여'))
  const [rel, setRel] = useState<RelType>('연인')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ra = toInput(me)
    if (ra.error) return setError(`[나] ${ra.error}`)
    const rb = toInput(partner)
    if (rb.error) return setError(`[상대] ${rb.error}`)
    setError('')
    onSubmit(ra.input!, me.name.trim(), rb.input!, partner.name.trim(), rel)
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="couple-block">
        <span className="field-label">어떤 사이인가요?</span>
        <div className="segmented">
          {(['연인', '친구', '동료'] as RelType[]).map((r) => (
            <button
              type="button"
              key={r}
              className={rel === r ? 'seg active' : 'seg'}
              onClick={() => setRel(r)}
            >
              {r === '동료' ? '직장동료' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="couple-block">
        <h3 className="couple-heading"><span className="couple-tag me">나</span> 내 정보</h3>
        <PersonFields value={me} onChange={(patch) => setMe({ ...me, ...patch })} namePlaceholder="내 이름 (선택)" />
      </div>

      <div className="couple-divider">{rel === '연인' ? '💞' : '🤝'}</div>

      <div className="couple-block">
        <h3 className="couple-heading"><span className="couple-tag you">상대</span> 상대 정보</h3>
        <PersonFields value={partner} onChange={(patch) => setPartner({ ...partner, ...patch })} namePlaceholder="상대 이름 (선택)" />
      </div>

      {error && <p className="error">{error}</p>}
      <button type="submit" className="submit-btn">궁합 보기</button>
    </form>
  )
}
