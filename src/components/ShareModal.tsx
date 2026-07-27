import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import ShareCard from './ShareCard'
import type { SajuResult } from '../lib/saju'
import type { Interpretation } from '../lib/interpret'

interface Props {
  result: SajuResult
  interp: Interpretation
  name: string
  onClose: () => void
}

export default function ShareModal({ result, interp, name, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function capture(): Promise<string | null> {
    if (!cardRef.current) return null
    return toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#f5f0e6',
    })
  }

  async function handleSave() {
    setBusy(true)
    setMsg('')
    try {
      const url = await capture()
      if (!url) return
      const a = document.createElement('a')
      a.href = url
      a.download = `사주_${name || '결과'}.png`
      a.click()
      setMsg('이미지를 저장했어요. 📥')
    } catch (e) {
      setMsg('저장에 실패했어요: ' + (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function handleShare() {
    setBusy(true)
    setMsg('')
    try {
      const url = await capture()
      if (!url) return
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'saju.png', { type: 'image/png' })
      const nav = navigator as Navigator & {
        canShare?: (data?: unknown) => boolean
        share?: (data?: unknown) => Promise<void>
      }
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], title: '내 사주', text: '정통 사주로 본 나의 명식' })
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = `사주_${name || '결과'}.png`
        a.click()
        setMsg('이 브라우저는 공유가 안 돼서 이미지로 저장했어요. 📥')
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setMsg('공유에 실패했어요: ' + (e as Error).message)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-preview">
          <div ref={cardRef}>
            <ShareCard result={result} interp={interp} name={name} />
          </div>
        </div>
        <div className="modal-actions">
          <button className="submit-btn modal-btn" onClick={handleShare} disabled={busy}>
            {busy ? '처리 중…' : '공유하기'}
          </button>
          <button className="modal-btn ghost" onClick={handleSave} disabled={busy}>
            이미지 저장
          </button>
          <button className="modal-btn ghost" onClick={onClose}>
            닫기
          </button>
        </div>
        {msg && <p className="modal-msg">{msg}</p>}
      </div>
    </div>
  )
}
