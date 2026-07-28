import { useState } from 'react'
import { isValidSolarDate, type SajuInput, type Calendar, type Gender } from '../lib/saju'

interface Props {
  onSubmit: (input: SajuInput, name: string) => void
}

const currentYear = new Date().getFullYear()

export default function InputForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [calendar, setCalendar] = useState<Calendar>('양력')
  const [isLeapMonth, setIsLeapMonth] = useState(false)
  const [year, setYear] = useState('1990')
  const [month, setMonth] = useState('1')
  const [day, setDay] = useState('1')
  const [unknownTime, setUnknownTime] = useState(false)
  const [time, setTime] = useState('12:00')
  const [trueSolar, setTrueSolar] = useState(false)
  const [gender, setGender] = useState<Gender>('남')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const y = parseInt(year, 10)
    const m = parseInt(month, 10)
    const d = parseInt(day, 10)
    if (!y || y < 1900 || y > currentYear) {
      setError(`연도를 1900 ~ ${currentYear} 사이로 입력해 주세요.`)
      return
    }
    if (!m || m < 1 || m > 12) {
      setError('월을 1 ~ 12 사이로 입력해 주세요.')
      return
    }
    if (!d || d < 1 || d > 31) {
      setError('일을 1 ~ 31 사이로 입력해 주세요.')
      return
    }
    if (calendar === '양력' && !isValidSolarDate(y, m, d)) {
      setError('존재하지 않는 날짜예요. 날짜를 다시 확인해 주세요.')
      return
    }
    const [hh, mm] = time.split(':').map((v) => parseInt(v, 10))
    setError('')
    onSubmit(
      {
        year: y,
        month: m,
        day: d,
        hour: unknownTime ? 12 : hh || 0,
        minute: unknownTime ? 0 : mm || 0,
        calendar,
        isLeapMonth: calendar === '음력' && isLeapMonth,
        unknownTime,
        trueSolar,
        gender,
      },
      name.trim(),
    )
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">이름 <em>(선택)</em></span>
        <input
          className="text-input"
          type="text"
          value={name}
          placeholder="예: 홍길동"
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div className="field">
        <span className="field-label">달력</span>
        <div className="segmented">
          {(['양력', '음력'] as Calendar[]).map((c) => (
            <button
              type="button"
              key={c}
              className={calendar === c ? 'seg active' : 'seg'}
              onClick={() => setCalendar(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {calendar === '음력' && (
          <label className="checkbox">
            <input
              type="checkbox"
              checked={isLeapMonth}
              onChange={(e) => setIsLeapMonth(e.target.checked)}
            />
            윤달(閏月)
          </label>
        )}
      </div>

      <div className="field">
        <span className="field-label">생년월일</span>
        <div className="date-row">
          <input className="text-input num" type="number" value={year} min={1900} max={currentYear}
            onChange={(e) => setYear(e.target.value)} /> <span className="unit">년</span>
          <input className="text-input num" type="number" value={month} min={1} max={12}
            onChange={(e) => setMonth(e.target.value)} /> <span className="unit">월</span>
          <input className="text-input num" type="number" value={day} min={1} max={31}
            onChange={(e) => setDay(e.target.value)} /> <span className="unit">일</span>
        </div>
      </div>

      <div className="field">
        <span className="field-label">태어난 시간</span>
        <div className="time-row">
          <input
            className="text-input"
            type="time"
            value={time}
            disabled={unknownTime}
            onChange={(e) => setTime(e.target.value)}
          />
          <label className="checkbox">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
            />
            시간 모름
          </label>
        </div>
        {unknownTime && <p className="hint">시주(時柱)를 제외하고 나머지로만 풀이합니다.</p>}
        {!unknownTime && (
          <label className="checkbox">
            <input
              type="checkbox"
              checked={trueSolar}
              onChange={(e) => setTrueSolar(e.target.checked)}
            />
            진태양시 보정 <em style={{ fontStyle: 'normal', opacity: 0.7 }}>(한국 기준 약 −32분, 시주 정확도↑)</em>
          </label>
        )}
      </div>

      <div className="field">
        <span className="field-label">성별</span>
        <div className="segmented">
          {(['남', '여'] as Gender[]).map((g) => (
            <button
              type="button"
              key={g}
              className={gender === g ? 'seg active' : 'seg'}
              onClick={() => setGender(g)}
            >
              {g === '남' ? '남성' : '여성'}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="submit-btn">사주 풀이 보기</button>
    </form>
  )
}
