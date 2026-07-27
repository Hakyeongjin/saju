import { useState } from 'react'
import './App.css'
import InputForm from './components/InputForm'
import PillarsTable from './components/PillarsTable'
import InterpretationView from './components/Interpretation'
import ShishenView from './components/ShishenView'
import DaeunView from './components/DaeunView'
import FortuneView from './components/FortuneView'
import HapChungView from './components/HapChungView'
import ShareModal from './components/ShareModal'
import { computeSaju, type SajuInput, type SajuResult } from './lib/saju'
import { interpret, type Interpretation } from './lib/interpret'

interface Reading {
  result: SajuResult
  interp: Interpretation
  name: string
}

export default function App() {
  const [reading, setReading] = useState<Reading | null>(null)
  const [showShare, setShowShare] = useState(false)

  function handleSubmit(input: SajuInput, name: string) {
    const result = computeSaju(input)
    const interp = interpret(result)
    setReading({ result, interp, name })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <header className="hero">
        <h1 className="brand">
          <span className="brand-mark">命</span> 정통 사주
        </h1>
        <p className="tagline">생년월일시로 풀어보는 나의 사주팔자와 오행</p>
      </header>

      <main className="container">
        {!reading ? (
          <InputForm onSubmit={handleSubmit} />
        ) : (
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
                <button className="reset-btn accent" onClick={() => setShowShare(true)}>
                  저장·공유
                </button>
                <button className="reset-btn" onClick={() => setReading(null)}>다시 입력</button>
              </div>
            </div>
            <PillarsTable result={reading.result} />
            <InterpretationView interp={reading.interp} result={reading.result} />
            <ShishenView analysis={reading.interp.shishen} />
            <DaeunView
              daeun={reading.result.daeun}
              strengthLabel={reading.interp.strength.label}
            />
            <FortuneView
              dayMaster={reading.result.dayMaster}
              strengthLabel={reading.interp.strength.label}
            />
            <HapChungView result={reading.result} />
            <p className="disclaimer">
              ※ 정통 명리학 이론에 따른 참고용 풀이입니다. 자시(子時) 경계 등 유파에 따라 해석이 달라질 수 있습니다.
            </p>
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
      </main>

      <footer className="footer">四柱八字 · 정통 사주</footer>
    </div>
  )
}
