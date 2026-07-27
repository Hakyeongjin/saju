import { Solar } from 'lunar-typescript'
import { ganOf, jiOf, ELEMENT_HANJA, type Element } from './ganji'
import type { SajuResult } from './saju'

export type Badge = '합' | '충'

export interface Relation {
  kind: string // 육합·삼합·반합·지지충·천간합·천간충
  badge: Badge
  chars: string // "子자 · 午오"
  labels: string // "년지·월지" 또는 "올해 ↔ 일지"
  detail?: string // "→ 화(火)"
  meaning: string
}

// ── 관계 테이블 ──
const JI_YUKHAP: [string, string, Element][] = [
  ['子', '丑', '토'], ['寅', '亥', '목'], ['卯', '戌', '화'],
  ['辰', '酉', '금'], ['巳', '申', '수'], ['午', '未', '화'],
]
const JI_SAMHAP: [string, string, string, Element][] = [
  ['申', '子', '辰', '수'], ['寅', '午', '戌', '화'],
  ['巳', '酉', '丑', '금'], ['亥', '卯', '未', '목'],
]
const JI_CHUNG: [string, string][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
]
const GAN_HAP: [string, string, Element][] = [
  ['甲', '己', '토'], ['乙', '庚', '금'], ['丙', '辛', '수'], ['丁', '壬', '목'], ['戊', '癸', '화'],
]
const GAN_CHUNG: [string, string][] = [
  ['甲', '庚'], ['乙', '辛'], ['丙', '壬'], ['丁', '癸'],
]

const M_HAP = '서로 끌어당겨 묶이는 관계입니다. 결속·협력·인연을 뜻하지만, 때로는 묶여서 제 역할을 못 하기도 합니다.'
const M_SAMHAP = '세 기운이 힘을 합쳐 강한 세력(局)을 이루는 관계입니다. 그 오행의 힘이 크게 강해집니다.'
const M_BANHAP = '삼합의 절반으로, 해당 오행으로 끌리는 결속이 어느 정도 생깁니다.'
const M_CHUNG = '정면으로 부딪히는 관계입니다. 변동·이동·갈등·자극을 뜻하며, 깨짐과 새 출발이 함께 옵니다.'

interface Pos {
  label: string
  c: string
}

function jc(h: string): string {
  const j = jiOf(h)
  return j ? `${h}${j.hangul}` : h
}
function gc(h: string): string {
  const g = ganOf(h)
  return g ? `${h}${g.hangul}` : h
}
function eqPair(a: string, b: string, x: string, y: string): boolean {
  return (a === x && b === y) || (a === y && b === x)
}

function natalJis(r: SajuResult): Pos[] {
  const p = r.pillars
  const out: Pos[] = [
    { label: '년지', c: p.year.ji.hanja },
    { label: '월지', c: p.month.ji.hanja },
    { label: '일지', c: p.day.ji.hanja },
  ]
  if (p.hour) out.push({ label: '시지', c: p.hour.ji.hanja })
  return out
}
function natalGans(r: SajuResult): Pos[] {
  const p = r.pillars
  const out: Pos[] = [
    { label: '년간', c: p.year.gan.hanja },
    { label: '월간', c: p.month.gan.hanja },
    { label: '일간', c: p.day.gan.hanja },
  ]
  if (p.hour) out.push({ label: '시간', c: p.hour.gan.hanja })
  return out
}

function natalRelations(r: SajuResult): Relation[] {
  const res: Relation[] = []
  const jis = natalJis(r)
  const gans = natalGans(r)

  // 지지 육합 / 충
  for (let i = 0; i < jis.length; i++) {
    for (let j = i + 1; j < jis.length; j++) {
      const a = jis[i]
      const b = jis[j]
      for (const [x, y, el] of JI_YUKHAP) {
        if (eqPair(a.c, b.c, x, y))
          res.push({ kind: '육합', badge: '합', chars: `${jc(a.c)} · ${jc(b.c)}`, labels: `${a.label}·${b.label}`, detail: `→ ${el}(${ELEMENT_HANJA[el]})`, meaning: M_HAP })
      }
      for (const [x, y] of JI_CHUNG) {
        if (eqPair(a.c, b.c, x, y))
          res.push({ kind: '지지충', badge: '충', chars: `${jc(a.c)} · ${jc(b.c)}`, labels: `${a.label}·${b.label}`, meaning: M_CHUNG })
      }
    }
  }

  // 삼합 / 반합
  for (const [a, w, c, el] of JI_SAMHAP) {
    const fa = jis.filter((p) => p.c === a)
    const fw = jis.filter((p) => p.c === w)
    const fc = jis.filter((p) => p.c === c)
    const cnt = (fa.length ? 1 : 0) + (fw.length ? 1 : 0) + (fc.length ? 1 : 0)
    if (cnt === 3) {
      res.push({ kind: '삼합', badge: '합', chars: `${jc(a)}·${jc(w)}·${jc(c)}`, labels: [...fa, ...fw, ...fc].map((p) => p.label).join('·'), detail: `→ ${el}(${ELEMENT_HANJA[el]}) 국(局)`, meaning: M_SAMHAP })
    } else if (cnt === 2 && fw.length) {
      const other = fa.length ? a : c
      const involved = fa.length ? [...fw, ...fa] : [...fw, ...fc]
      res.push({ kind: '반합', badge: '합', chars: `${jc(w)}·${jc(other)}`, labels: involved.map((p) => p.label).join('·'), detail: `→ ${el}(${ELEMENT_HANJA[el]})`, meaning: M_BANHAP })
    }
  }

  // 천간 합 / 충
  for (let i = 0; i < gans.length; i++) {
    for (let j = i + 1; j < gans.length; j++) {
      const a = gans[i]
      const b = gans[j]
      for (const [x, y, el] of GAN_HAP) {
        if (eqPair(a.c, b.c, x, y))
          res.push({ kind: '천간합', badge: '합', chars: `${gc(a.c)} · ${gc(b.c)}`, labels: `${a.label}·${b.label}`, detail: `→ ${el}(${ELEMENT_HANJA[el]})`, meaning: M_HAP })
      }
      for (const [x, y] of GAN_CHUNG) {
        if (eqPair(a.c, b.c, x, y))
          res.push({ kind: '천간충', badge: '충', chars: `${gc(a.c)} · ${gc(b.c)}`, labels: `${a.label}·${b.label}`, meaning: M_CHUNG })
      }
    }
  }
  return res
}

function externalRelations(src: string, ganH: string, jiH: string, r: SajuResult): Relation[] {
  const res: Relation[] = []
  for (const nj of natalJis(r)) {
    for (const [x, y, el] of JI_YUKHAP) {
      if (eqPair(jiH, nj.c, x, y))
        res.push({ kind: '육합', badge: '합', chars: `${jc(jiH)} · ${jc(nj.c)}`, labels: `${src} ↔ ${nj.label}`, detail: `→ ${el}(${ELEMENT_HANJA[el]})`, meaning: M_HAP })
    }
    for (const [x, y] of JI_CHUNG) {
      if (eqPair(jiH, nj.c, x, y))
        res.push({ kind: '지지충', badge: '충', chars: `${jc(jiH)} · ${jc(nj.c)}`, labels: `${src} ↔ ${nj.label}`, meaning: M_CHUNG })
    }
  }
  for (const ng of natalGans(r)) {
    for (const [x, y, el] of GAN_HAP) {
      if (eqPair(ganH, ng.c, x, y))
        res.push({ kind: '천간합', badge: '합', chars: `${gc(ganH)} · ${gc(ng.c)}`, labels: `${src} ↔ ${ng.label}`, detail: `→ ${el}(${ELEMENT_HANJA[el]})`, meaning: M_HAP })
    }
    for (const [x, y] of GAN_CHUNG) {
      if (eqPair(ganH, ng.c, x, y))
        res.push({ kind: '천간충', badge: '충', chars: `${gc(ganH)} · ${gc(ng.c)}`, labels: `${src} ↔ ${ng.label}`, meaning: M_CHUNG })
    }
  }
  return res
}

export interface HapChungAnalysis {
  natal: Relation[]
  seun: { label: string; relations: Relation[] }
  daeun: { label: string; relations: Relation[] } | null
}

export function analyzeHapChung(r: SajuResult, now: Date): HapChungAnalysis {
  const lunar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate()).getLunar()
  const seunGz = lunar.getYearInGanZhiByLiChun()
  const seun = {
    label: `올해 세운 (${seunGz})`,
    relations: externalRelations('올해', seunGz.charAt(0), seunGz.charAt(1), r),
  }

  const nowYear = now.getFullYear()
  const cur = r.daeun.list.find((d) => nowYear >= d.startYear && nowYear <= d.endYear)
  const daeun = cur
    ? {
        label: `현재 대운 (${cur.ganZhi})`,
        relations: externalRelations('현재대운', cur.gan.hanja, cur.ji.hanja, r),
      }
    : null

  return { natal: natalRelations(r), seun, daeun }
}
