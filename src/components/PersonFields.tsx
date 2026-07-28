import type { Calendar, Gender } from '../lib/saju'

export interface PersonState {
  name: string
  calendar: Calendar
  isLeapMonth: boolean
  year: string
  month: string
  day: string
  unknownTime: boolean
  time: string
  gender: Gender
}

export function makePerson(gender: Gender): PersonState {
  return {
    name: '',
    calendar: '양력',
    isLeapMonth: false,
    year: '1990',
    month: '1',
    day: '1',
    unknownTime: false,
    time: '12:00',
    gender,
  }
}

const currentYear = 2026

interface Props {
  value: PersonState
  onChange: (patch: Partial<PersonState>) => void
  namePlaceholder?: string
}

export default function PersonFields({ value: p, onChange, namePlaceholder }: Props) {
  return (
    <div className="person-fields">
      <label className="field">
        <span className="field-label">이름 <em>(선택)</em></span>
        <input
          className="text-input"
          type="text"
          value={p.name}
          placeholder={namePlaceholder ?? '예: 홍길동'}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </label>

      <div className="field">
        <span className="field-label">달력</span>
        <div className="segmented">
          {(['양력', '음력'] as Calendar[]).map((c) => (
            <button
              type="button"
              key={c}
              className={p.calendar === c ? 'seg active' : 'seg'}
              onClick={() => onChange({ calendar: c })}
            >
              {c}
            </button>
          ))}
        </div>
        {p.calendar === '음력' && (
          <label className="checkbox">
            <input
              type="checkbox"
              checked={p.isLeapMonth}
              onChange={(e) => onChange({ isLeapMonth: e.target.checked })}
            />
            윤달(閏月)
          </label>
        )}
      </div>

      <div className="field">
        <span className="field-label">생년월일</span>
        <div className="date-row">
          <input className="text-input num" type="number" value={p.year} min={1900} max={currentYear}
            onChange={(e) => onChange({ year: e.target.value })} /> <span className="unit">년</span>
          <input className="text-input num" type="number" value={p.month} min={1} max={12}
            onChange={(e) => onChange({ month: e.target.value })} /> <span className="unit">월</span>
          <input className="text-input num" type="number" value={p.day} min={1} max={31}
            onChange={(e) => onChange({ day: e.target.value })} /> <span className="unit">일</span>
        </div>
      </div>

      <div className="field">
        <span className="field-label">태어난 시간</span>
        <div className="time-row">
          <input
            className="text-input"
            type="time"
            value={p.time}
            disabled={p.unknownTime}
            onChange={(e) => onChange({ time: e.target.value })}
          />
          <label className="checkbox">
            <input
              type="checkbox"
              checked={p.unknownTime}
              onChange={(e) => onChange({ unknownTime: e.target.checked })}
            />
            시간 모름
          </label>
        </div>
      </div>

      <div className="field">
        <span className="field-label">성별</span>
        <div className="segmented">
          {(['남', '여'] as Gender[]).map((g) => (
            <button
              type="button"
              key={g}
              className={p.gender === g ? 'seg active' : 'seg'}
              onClick={() => onChange({ gender: g })}
            >
              {g === '남' ? '남성' : '여성'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
