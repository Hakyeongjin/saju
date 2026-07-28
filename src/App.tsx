import { useEffect, useState } from 'react'
import './App.css'
import InputForm from './components/InputForm'
import CoupleForm from './components/CoupleForm'
import PillarsTable from './components/PillarsTable'
import InterpretationView from './components/Interpretation'
import ShishenView from './components/ShishenView'
import DaeunView from './components/DaeunView'
import FortuneView from './components/FortuneView'
import HapChungView from './components/HapChungView'
import CareerView from './components/CareerView'
import ThemeView from './components/ThemeView'
import CompatView from './components/CompatView'
import Toc from './components/Toc'
import ShareModal from './components/ShareModal'
import LegalView from './components/LegalPages'
import { computeSaju, type SajuInput, type SajuResult } from './lib/saju'
import { interpret, type Interpretation } from './lib/interpret'
import { analyzeCompat, type CompatResult, type RelType } from './lib/compat'

type Mode = 'single' | 'couple'

interface Reading {
  result: SajuResult
  interp: Interpretation
  name: string
}

interface CoupleReading {
  a: SajuResult
  b: SajuResult
  compat: CompatResult
  nameA: string
  nameB: string
  relationType: RelType
}

const SINGLE_TOC = [
  { id: 'sec-pillars', label: '사주팔자' },
  { id: 'sec-ilgan', label: '나의 기질' },
  { id: 'sec-ohaeng', label: '오행 분포' },
  { id: 'sec-shishen', label: '십신' },
  { id: 'sec-daeun', label: '대운' },
  { id: 'sec-fortune', label: '올해·오늘 운세' },
  { id: 'sec-career', label: '직장운' },
  { id: 'sec-theme', label: '테마별 운세' },
  { id: 'sec-hapchung', label: '합·충' },
]

export default function App() {
  const [mode, setMode] = useState<Mode>('single')
  const [reading, setReading] = useState<Reading | null>(null)
  const [couple, setCouple] = useState<CoupleReading | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [formError, setFormError] = useState('')
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, ''))

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash.replace(/^#/, ''))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const legalPage: 'privacy' | 'terms' | null =
    route === 'privacy' || route === 'terms' ? route : null

  function handleSingle(input: SajuInput, name: string) {
    try {
      const result = computeSaju(input)
      setReading({ result, interp: interpret(result), name })
      setFormError('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setFormError('사주를 계산할 수 없는 날짜예요. 음력·윤달·날짜를 다시 확인해 주세요.')
    }
  }

  function handleCouple(
    inputA: SajuInput,
    nameA: string,
    inputB: SajuInput,
    nameB: string,
    relationType: RelType,
  ) {
    try {
      const a = computeSaju(inputA)
      const ia = interpret(a)
      const b = computeSaju(inputB)
      const ib = interpret(b)
      setCouple({
        a, b,
        compat: analyzeCompat(a, ia, b, ib, nameA, nameB, new Date(), relationType),
        nameA, nameB, relationType,
      })
      setFormError('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setFormError('궁합을 계산할 수 없는 날짜예요. 두 사람의 음력·윤달·날짜를 다시 확인해 주세요.')
    }
  }

  function restart(nextMode?: Mode) {
    if (nextMode) setMode(nextMode)
    setReading(null)
    setCouple(null)
    setShowShare(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasResult = reading || couple

  return (
    <div className="app">
      <header className="hero">
        <h1 className="brand">
          <span className="brand-mark">命</span> 정통 사주
        </h1>
        <p className="tagline">생년월일시로 풀어보는 사주팔자 · 오행 · 궁합</p>
      </header>

      <main className="container">
        {legalPage ? (
          <LegalView page={legalPage} onBack={() => { window.location.hash = '' }} />
        ) : (
          <>
        {!hasResult && (
          <>
            <div className="mode-toggle">
              {(['single', 'couple'] as Mode[]).map((m) => (
                <button
                  key={m}
                  className={mode === m ? 'mode-btn active' : 'mode-btn'}
                  onClick={() => { setMode(m); setFormError('') }}
                >
                  {m === 'single' ? '내 사주' : '궁합'}
                </button>
              ))}
            </div>
            {formError && <p className="form-error-banner">⚠️ {formError}</p>}
            {mode === 'single' ? (
              <InputForm onSubmit={handleSingle} />
            ) : (
              <CoupleForm onSubmit={handleCouple} />
            )}
          </>
        )}

        {reading && (
          <>
            <div className="summary-bar">
              <div>
                <b>{reading.name || '무명'}</b> 님 · {reading.result.input.gender === '남' ? '남성' : '여성'}
                <div className="summary-dates">
                  {reading.result.solarText} · {reading.result.lunarText}
                  {reading.result.input.unknownTime ? ' · 시간 모름' : ''}
                </div>
              </div>
              <div className="summary-btns">
                <button className="reset-btn accent" onClick={() => setShowShare(true)}>저장·공유</button>
                <button className="reset-btn" onClick={() => restart()}>다시 입력</button>
              </div>
            </div>
            <Toc items={SINGLE_TOC} />
            <PillarsTable result={reading.result} />
            <InterpretationView interp={reading.interp} result={reading.result} />
            <ShishenView analysis={reading.interp.shishen} />
            <DaeunView daeun={reading.result.daeun} dayMaster={reading.result.dayMaster} strengthLabel={reading.interp.strength.label} />
            <FortuneView dayMaster={reading.result.dayMaster} strengthLabel={reading.interp.strength.label} />
            <CareerView result={reading.result} interp={reading.interp} />
            <ThemeView result={reading.result} interp={reading.interp} />
            <HapChungView result={reading.result} />
            <p className="disclaimer">
              ※ 정통 명리학 이론에 따른 참고용 풀이입니다. 자시(子時) 경계 등 유파에 따라 해석이 달라질 수 있습니다.
            </p>
            <nav className="result-nav">
              <p className="result-nav-title">다른 것도 볼까요?</p>
              <div className="result-nav-btns">
                <button className="nav-link-btn primary" onClick={() => restart('couple')}>💞 궁합 보기</button>
                <button className="nav-link-btn" onClick={() => restart()}>🏠 처음 화면으로</button>
              </div>
            </nav>
            {showShare && (
              <ShareModal
                result={reading.result}
                interp={reading.interp}
                name={reading.name}
                onClose={() => setShowShare(false)}
              />
            )}
          </>
        )}

        {couple && (
          <>
            <div className="summary-bar">
              <div>
                <b>궁합 결과</b>
                <div className="summary-dates">
                  {(couple.nameA || '나')} ({couple.a.input.year}) · {(couple.nameB || '상대')} ({couple.b.input.year})
                </div>
              </div>
              <button className="reset-btn" onClick={() => restart()}>다시 입력</button>
            </div>
            <Toc
              items={[
                { id: 'sec-compat', label: '궁합 요약' },
                ...couple.compat.sections.map((s, i) => ({ id: `sec-c-${i}`, label: s.title })),
                { id: 'sec-compat-fortune', label: '올해·오늘 운세' },
                { id: 'sec-compat-timeline', label: '시기별 흐름' },
              ]}
            />
            <CompatView
              compat={couple.compat}
              a={couple.a}
              b={couple.b}
              nameA={couple.nameA}
              nameB={couple.nameB}
              relationType={couple.relationType}
            />
            <p className="disclaimer">
              ※ 정통 명리학 이론에 따른 참고용 궁합 풀이입니다. 재미로 즐겨주세요 🙂
            </p>
            <nav className="result-nav">
              <p className="result-nav-title">다른 것도 볼까요?</p>
              <div className="result-nav-btns">
                <button className="nav-link-btn primary" onClick={() => restart('single')}>🔮 내 사주 보기</button>
                <button className="nav-link-btn" onClick={() => restart()}>🏠 처음 화면으로</button>
              </div>
            </nav>
          </>
        )}
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-brand">四柱八字 · 정통 사주</div>
        <nav className="footer-links">
          <a href="#privacy">개인정보처리방침</a>
          <span aria-hidden="true">·</span>
          <a href="#terms">이용약관</a>
        </nav>
        <p className="footer-note">본 서비스의 사주·운세·궁합 결과는 재미·참고용입니다.</p>
      </footer>
    </div>
  )
}
