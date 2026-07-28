import { Solar } from 'lunar-typescript'
import {
  GENERATES,
  ELEMENT_ORDER,
  ELEMENT_HANJA,
  ganOf,
  jiOf,
  type Element,
  type ShishenGroup,
} from './ganji'
import { DAY_MASTER } from './interpret'
import type { SajuResult } from './saju'
import type { Interpretation } from './interpret'

const YUKHAP: [string, string, Element][] = [
  ['子', '丑', '토'], ['寅', '亥', '목'], ['卯', '戌', '화'],
  ['辰', '酉', '금'], ['巳', '申', '수'], ['午', '未', '화'],
]
const CHUNG: [string, string][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
]
const SAMHAP: [string, string, string][] = [
  ['申', '子', '辰'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['亥', '卯', '未'],
]
const ELEMENT_ORGAN: Record<Element, string> = {
  목: '간·신경', 화: '심장·혈압', 토: '위장·소화', 금: '폐·호흡기', 수: '신장·비뇨',
}
// 그해 기운(오행)이 관계에 주는 색깔
const ELEMENT_YEAR_THEME: Record<Element, string> = {
  목: '새로운 것을 함께 시작하거나 관계가 한 단계 성장하기 좋은 기운이 돌아요',
  화: '애정 표현이 활발해지고 즐겁고 뜨거운 일이 많아지는 편이에요',
  토: '집·돈·미래처럼 현실적인 문제를 함께 다지며 안정을 꾀하기 좋아요',
  금: '관계를 정리하거나 매듭을 짓고 결단하게 되는 기운이 강해요',
  수: '감정 교류와 대화가 깊어지되, 마음이 여려지고 예민해질 수 있어요',
}

export interface CompatSection {
  icon: string
  title: string
  paras: string[]
  example: string // 상황별 예시
  basis: string
}

export interface CouplePeriod {
  label: string // "올해" / "오늘"
  ganZhi: string
  hangul: string
  element: Element // 천간 오행 (배지 색)
  tag: '좋음' | '무난' | '주의'
  paras: string[] // 1~2문단
}

export interface CoupleYear {
  year: number
  ganZhi: string
  hangul: string
  tag: '좋음' | '무난' | '주의'
  note: string // 한 줄 요약 (근거 포함)
}

export interface CoupleDecade {
  startYear: number
  endYear: number
  tag: '좋음' | '무난' | '주의'
  goodYears: number
  cautionYears: number
  summary: string // 10년 요약 (한 문단)
  years: CoupleYear[] // 연도별 상세 (펼침용)
  isNow: boolean // 현재 연도가 포함된 10년대
}

export interface CompatResult {
  score: number
  grade: string
  summary: string
  sections: CompatSection[]
  fortune: { year: CouplePeriod; today: CouplePeriod }
  timeline: CoupleDecade[]
}

type OhaengRel = '상생' | '상극' | '비화'
function ohaengRel(a: Element, b: Element): OhaengRel {
  if (a === b) return '비화'
  if (GENERATES[a] === b || GENERATES[b] === a) return '상생'
  return '상극'
}
function eqPair(a: string, b: string, x: string, y: string): boolean {
  return (a === x && b === y) || (a === y && b === x)
}
function groupCounts(i: Interpretation): Record<ShishenGroup, number> {
  const c: Record<ShishenGroup, number> = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 }
  for (const g of i.shishen.groups) c[g.group] = g.count
  return c
}
function careerLabel(c: Record<ShishenGroup, number>): string {
  const order: [ShishenGroup, string][] = [
    ['관성', '조직·안정형'], ['재성', '사업·재물형'], ['식상', '전문·창작형'],
    ['인성', '학문·전문형'], ['비겁', '독립·자영형'],
  ]
  let best = -1
  let label = '독립·자영형'
  for (const [g, l] of order) {
    if (c[g] > best) {
      best = c[g]
      label = l
    }
  }
  return label
}

export function analyzeCompat(
  a: SajuResult,
  ia: Interpretation,
  b: SajuResult,
  ib: Interpretation,
  nameA: string,
  nameB: string,
  now: Date,
): CompatResult {
  const clean = (s: string) => s.replace(/[<>&]/g, '').slice(0, 20)
  const na = clean(nameA) || '나'
  const nb = clean(nameB) || '상대'
  const ca = groupCounts(ia)
  const cb = groupCounts(ib)
  let score = 60

  const sections: CompatSection[] = []

  // ── 1. 성향 궁합 (일간) ──
  {
    const ael = a.dayMaster.element
    const bel = b.dayMaster.element
    const rel = ohaengRel(ael, bel)
    const aProf = DAY_MASTER[a.dayMaster.hanja]
    const bProf = DAY_MASTER[b.dayMaster.hanja]
    const paras: string[] = []
    if (rel === '상생') {
      score += 14
      paras.push(
        `두 사람의 타고난 성향(일간)이 서로 <b>돕는 상생 관계</b>예요. 한쪽의 기운이 다른 쪽을 북돋아 주기 때문에, 함께 있으면 편안하고 힘이 나는 사이랍니다.`,
      )
    } else if (rel === '비화') {
      score += 7
      paras.push(
        `두 사람 다 <b>같은 ${ael}(${ELEMENT_HANJA[ael]}) 기운</b>의 사람이에요. 성향이 비슷해 “말 안 해도 통하는” 게 많지만, 닮은 만큼 같은 부분에서 부딪힐 수도 있어요.`,
      )
    } else {
      score += 3
      paras.push(
        `두 사람의 성향이 <b>서로 자극하는 상극 관계</b>예요. 긴장감이 매력과 설렘이 되기도, 신경전이 되기도 하는 관계라 서로의 다름을 인정하는 게 열쇠입니다.`,
      )
    }
    paras.push(
      `${na}는 ‘${aProf.nature}’ 같은 <b>${aProf.title.split(' ')[0]}</b> 기질(${aProf.keywords.slice(0, 2).join('·')}), ${nb}는 ‘${bProf.nature}’ 같은 <b>${bProf.title.split(' ')[0]}</b> 기질(${bProf.keywords.slice(0, 2).join('·')})이에요. 서로의 이런 결을 이해하면 부딪힐 일이 훨씬 줄어듭니다.`,
    )
    sections.push({
      icon: '🌳',
      title: '성향 궁합',
      paras,
      example:
        rel === '상생'
          ? '서로 기운을 북돋우니, 힘든 일이 있을 때 상대에게 기대면 회복이 빨라요.'
          : rel === '비화'
            ? '비슷해서 잘 통하지만 같은 고집이 부딪히니, 한 명이 먼저 져주면 편해져요.'
            : '티격태격이 매력이 되기도 하니, 예민한 날엔 한 발 물러서 주면 좋아요.',
      basis: `일간 — ${na} ${ael}(${ELEMENT_HANJA[ael]}) · ${nb} ${bel}(${ELEMENT_HANJA[bel]}) → ${rel} 관계`,
    })
  }

  // ── 2. 배우자 자리 (일지) ──
  {
    const aj = a.pillars.day.ji.hanja
    const bj = b.pillars.day.ji.hanja
    const paras: string[] = []
    const yuk = YUKHAP.some(([x, y]) => eqPair(aj, bj, x, y))
    const chung = CHUNG.some(([x, y]) => eqPair(aj, bj, x, y))
    const sameSamhap = SAMHAP.some((t) => t.includes(aj) && t.includes(bj) && aj !== bj)
    paras.push('일지(태어난 날의 아래 글자)는 <b>배우자·짝이 앉는 자리</b>예요. 두 사람의 이 자리가 어떻게 만나는지가 함께 살 때의 궁합을 보여줍니다.')
    if (yuk) {
      score += 16
      paras.push('두 사람의 배우자 자리가 <b>육합(六合)</b> — 자석처럼 딱 맞물리는 찰떡 관계예요. 서로에게 끌리고, 곁에 있으면 편안함을 느끼는 좋은 짝입니다.')
    } else if (aj === bj) {
      score += 6
      paras.push(`배우자 자리가 <b>같은 글자(${a.pillars.day.ji.hangul})</b>예요. 취향과 생활 리듬이 닮아 서로를 빨리 이해하는 편이에요.`)
    } else if (sameSamhap) {
      score += 12
      paras.push('배우자 자리가 <b>삼합의 짝(반합)</b> — 같은 목표를 바라보며 힘을 모으는, 함께일 때 시너지가 큰 관계예요.')
    } else if (chung) {
      score -= 12
      paras.push('배우자 자리가 <b>충(沖)</b> — 티격태격 부딪히기 쉬운 자리예요. 하지만 충은 “미운 정”이 드는 관계이기도 해서, 서로 다름을 존중하면 오히려 자극을 주고받으며 성장하는 커플이 됩니다.')
    } else {
      paras.push('배우자 자리는 특별한 합·충 없이 <b>담백하고 무난한</b> 관계예요. 큰 끌림도, 큰 갈등도 없이 서로의 페이스를 지켜주는 편입니다.')
    }
    sections.push({
      icon: '💑',
      title: '배우자 자리 (일지)',
      paras,
      example: yuk
        ? '함께 있을수록 편안해지는 사이니, 자주 붙어 지내면 정이 깊어져요.'
        : aj === bj
          ? '취향·생활 리듬이 닮아 말 안 해도 통하지만, 비슷한 만큼 같은 실수를 할 수 있으니 서로 챙겨주세요.'
          : sameSamhap
            ? '같은 목표를 향할 때 시너지가 크니, 함께 이루고 싶은 걸 정해보세요.'
            : chung
              ? '집에만 있으면 사소한 걸로 부딪히기 쉬우니, 여행처럼 새 자극을 함께 즐기면 오히려 좋아요.'
              : '서로의 혼자만의 시간을 존중하면 오래 편안한 사이예요.',
      basis: `일지 — ${na} ${a.pillars.day.ji.hangul}(${aj}) · ${nb} ${b.pillars.day.ji.hangul}(${bj}) → ${yuk ? '육합' : chung ? '충' : sameSamhap ? '반합' : aj === bj ? '같은 글자' : '무관계'}`,
    })
  }

  // ── 3. 기운 보완 (오행) ──
  {
    const aFills: Element[] = []
    const bFills: Element[] = []
    let complement = 0
    for (const e of ELEMENT_ORDER) {
      if (a.elementCount[e] === 0 && b.elementCount[e] > 0) { bFills.push(e); complement += 4 }
      if (b.elementCount[e] === 0 && a.elementCount[e] > 0) { aFills.push(e); complement += 4 }
    }
    complement = Math.min(complement, 16)
    score += complement
    const paras: string[] = []
    if (aFills.length || bFills.length) {
      const parts: string[] = []
      if (bFills.length) parts.push(`${nb}가 ${na}에게 부족한 <b>${bFills.map((e) => e + ELEMENT_HANJA[e]).join('·')}</b> 기운을`)
      if (aFills.length) parts.push(`${na}가 ${nb}에게 부족한 <b>${aFills.map((e) => e + ELEMENT_HANJA[e]).join('·')}</b> 기운을`)
      paras.push(`두 사람은 <b>서로 부족한 기운을 채워주는</b> 사이예요. ${parts.join(', ')} 메워줍니다. 혼자서는 한쪽으로 치우칠 수 있는 기운이 둘이 만나면 균형을 이루니, 함께 있을 때 더 안정되고 온전해지는 조합이에요.`)
    } else {
      paras.push('오행 구성이 비슷한 편이라, 서로 채워주기보다는 <b>비슷한 결을 공유</b>하는 관계예요. 취향과 가치관이 잘 맞아 편안하지만, 부족한 부분은 함께 의식적으로 보완해가면 좋습니다.')
    }
    sections.push({
      icon: '⚖️',
      title: '기운 보완 (오행)',
      paras,
      example:
        aFills.length || bFills.length
          ? '한 명이 조급할 때 다른 한 명이 속도를 잡아주면 균형이 딱 맞아요.'
          : '비슷한 성향이니, 부족한 부분은 함께 새 취미·습관으로 채워보세요.',
      basis: `${nb}가 채워줌: [${bFills.map((e) => e + ELEMENT_HANJA[e]).join('·') || '없음'}] · ${na}가 채워줌: [${aFills.map((e) => e + ELEMENT_HANJA[e]).join('·') || '없음'}]`,
    })
  }

  // ── 4. 재물 궁합 ──
  {
    const paras: string[] = []
    const strong = ca['재성'] >= 2 || cb['재성'] >= 2
    const both = ca['재성'] >= 1 && cb['재성'] >= 1
    if (strong) {
      const who = ca['재성'] >= cb['재성'] ? na : nb
      paras.push(`두 사람 중 특히 <b>${who}</b>에게 재물의 별(재성)이 넉넉해, 함께라면 돈을 벌고 굴리는 힘이 있는 커플이에요. 한 사람이 재물의 중심을 잡아주는 구조라 경제적으로 든든합니다.`)
    } else if (both) {
      paras.push('두 사람 모두 재물 감각이 어느 정도 있어, <b>맞벌이나 공동 재테크</b>가 잘 어울리는 커플이에요. 각자 벌어 함께 모으면 시너지가 납니다.')
    } else {
      paras.push('둘 다 재물의 별이 크게 두드러지진 않아요. 화려한 소비보다 <b>알뜰하게 함께 모으는 방식</b>이 잘 맞는 커플이라, 서로 아껴 쓰는 습관을 맞춰두면 오히려 돈이 잘 붙습니다.')
    }
    if (ia.strength.label === '신약' && ca['재성'] >= 2) paras.push(`다만 ${na}는 재물을 감당할 힘이 다소 약한 편이라, 큰 투자보다 안정적인 관리를 함께 챙기면 좋아요.`)
    else if (ib.strength.label === '신약' && cb['재성'] >= 2) paras.push(`다만 ${nb}는 재물을 감당할 힘이 다소 약한 편이라, 큰 투자보다 안정적인 관리를 함께 챙기면 좋아요.`)
    sections.push({
      icon: '💰',
      title: '재물 궁합',
      paras,
      example:
        ca['재성'] >= 2 || cb['재성'] >= 2
          ? '재물 감각이 좋은 쪽이 공동 재정을 맡으면 시너지가 커져요.'
          : ca['재성'] >= 1 && cb['재성'] >= 1
            ? '맞벌이로 각자 벌어 공동 통장에 모으면 잘 불어나요.'
            : '둘 다 알뜰형이니, 소비 규칙을 함께 정해두면 돈이 잘 모여요.',
      basis: `재성(재물의 별) — ${na} ${ca['재성']}개 · ${nb} ${cb['재성']}개`,
    })
  }

  // ── 5. 건강 궁합 ──
  {
    const bothLack = ELEMENT_ORDER.filter((e) => a.elementCount[e] === 0 && b.elementCount[e] === 0)
    const complementHealth = ELEMENT_ORDER.some(
      (e) => (a.elementCount[e] === 0 && b.elementCount[e] > 0) || (b.elementCount[e] === 0 && a.elementCount[e] > 0),
    )
    const paras: string[] = []
    if (bothLack.length) {
      paras.push(`두 사람 모두 <b>${bothLack.map((e) => e + ELEMENT_HANJA[e]).join('·')}</b> 기운이 약한 편이에요. 이와 연결된 <b>${bothLack.map((e) => ELEMENT_ORGAN[e]).join(', ')}</b> 쪽은 서로 챙겨주며 함께 관리하면 좋습니다.`)
    } else if (complementHealth) {
      paras.push('한 사람이 약한 기운을 다른 사람이 갖고 있어, <b>건강 면에서도 서로를 보완</b>하는 조합이에요. 생활 습관을 맞춰가면 둘 다 더 건강해질 수 있는 사이랍니다.')
    } else {
      paras.push('두 사람의 기운 구성이 비슷해, 건강도 <b>비슷한 리듬</b>을 타는 편이에요. 함께 운동하거나 식습관을 맞추면 서로에게 좋은 자극이 됩니다.')
    }
    sections.push({
      icon: '🌿',
      title: '건강 궁합',
      paras,
      example: bothLack.length
        ? `둘 다 약한 ${bothLack.map((e) => ELEMENT_ORGAN[e]).join('·')}는 함께 챙기며 관리하면 좋아요.`
        : '같이 운동하거나 식단을 맞추면 서로 건강을 챙겨주기 좋아요.',
      basis: `두 사람 공통으로 약한 오행 [${bothLack.map((e) => e + ELEMENT_HANJA[e]).join('·') || '없음'}]`,
    })
  }

  // ── 6. 일·직장 궁합 ──
  {
    const la = careerLabel(ca)
    const lb = careerLabel(cb)
    const paras: string[] = []
    if (la === lb) {
      paras.push(`두 사람 다 <b>${la}</b> 스타일이라 일에 대한 가치관과 방향이 비슷해요. 서로를 잘 이해하고 응원할 수 있지만, 같은 영역에서는 은근한 경쟁이 될 수도 있으니 역할을 나누면 좋습니다.`)
    } else {
      paras.push(`${na}는 <b>${la}</b>, ${nb}는 <b>${lb}</b> 스타일이에요. 서로 다른 강점을 가진 만큼, 한쪽의 안정감과 다른 쪽의 추진력이 <b>균형을 이루는 좋은 조합</b>이 될 수 있습니다. 상대의 방식이 나와 다르다고 답답해하기보다 “우리 팀의 다른 포지션”으로 봐주세요.`)
    }
    sections.push({
      icon: '💼',
      title: '일·직장 궁합',
      paras,
      example:
        la === lb
          ? `둘 다 ${la}이라 방향이 같으니, 역할을 나눠 경쟁 대신 협력하면 좋아요.`
          : '서로 강점이 다르니, 큰 결정을 내릴 땐 각자의 시각을 합치면 실수가 줄어요.',
      basis: `직업 성향 — ${na} ${la} · ${nb} ${lb}`,
    })
  }

  // ── 7. 대인관계·소통 궁합 ──
  {
    const paras: string[] = []
    const talkA = ca['식상'] >= 1
    const talkB = cb['식상'] >= 1
    if (talkA && talkB) {
      paras.push('두 사람 다 <b>표현의 별(식상)</b>이 있어 말이 잘 통하고 감정 표현이 자연스러운 커플이에요. 대화가 즐겁고 서로 심심할 틈이 없습니다.')
    } else if (talkA || talkB) {
      const who = talkA ? na : nb
      paras.push(`<b>${who}</b>가 표현력이 좋아 관계에서 분위기를 이끄는 편이에요. 한 사람이 이야기를 꺼내면 다른 사람이 들어주는, 균형 잡힌 대화 스타일입니다.`)
    } else {
      paras.push('두 사람 다 말수가 많은 편은 아니라, <b>말보다 행동·분위기로 통하는</b> 담백한 커플이에요. 가끔은 마음을 말로 표현해주면 오해가 줄어듭니다.')
    }
    if (ca['비겁'] >= 2 || cb['비겁'] >= 2) paras.push('친구·동료의 별(비겁)이 강해, 연인이면서 <b>친구 같은 편안함</b>도 있는 관계예요.')
    sections.push({
      icon: '🤝',
      title: '대인관계·소통 궁합',
      paras,
      example:
        talkA && talkB
          ? '대화가 잘 통하니, 서운한 건 그날 가볍게 말하고 넘기면 돼요.'
          : '표현이 적은 편이니, 짧게라도 마음을 말로 전하는 습관이 오해를 줄여요.',
      basis: `식상(표현의 별) — ${na} ${ca['식상']}개 · ${nb} ${cb['식상']}개`,
    })
  }

  // ── 시기별 궁합 흐름 (10년 단위 요약 + 연도별 상세) ──
  const ajFor = a.pillars.day.ji.hanja
  const bjFor = b.pillars.day.ji.hanja
  const nowY = now.getFullYear()

  // 특정 해의 두 사람 관계 기운 계산 (합·충 기준)
  const scoreYear = (y: number): CoupleYear => {
    const gz = Solar.fromYmd(y, 6, 1).getLunar().getYearInGanZhiByLiChun()
    const zhi = gz.charAt(1)
    const gan = ganOf(gz.charAt(0))
    const ji = jiOf(zhi)
    let s = 0
    const ev: string[] = []
    const check = (name: string, pj: string) => {
      const pjH = jiOf(pj)?.hangul ?? pj
      const zH = ji?.hangul ?? zhi
      if (YUKHAP.some(([x, yy]) => eqPair(zhi, pj, x, yy))) { s += 2; ev.push(`${name} 일지 ${pjH}·${zH} 육합`) }
      else if (SAMHAP.some((t) => t.includes(zhi) && t.includes(pj) && zhi !== pj)) { s += 1 }
      if (CHUNG.some(([x, yy]) => eqPair(zhi, pj, x, yy))) { s -= 2; ev.push(`${name} 일지 ${pjH}·${zH} 충`) }
    }
    check(na, ajFor)
    check(nb, bjFor)
    const tag: CoupleYear['tag'] = s >= 2 ? '좋음' : s <= -2 ? '주의' : '무난'
    const evText = ev.length ? ` (${ev.join(', ')})` : ''
    const jiEl: Element = ji ? ji.element : '토'
    let base: string
    if (tag === '좋음') base = `두 사람의 인연 자리와 잘 맞물리는 해예요.${evText}`
    else if (tag === '주의') base = `배우자 자리가 부딪히기 쉬워 서로 한 번 더 배려가 필요한 해예요.${evText}`
    else base = ev.length ? `합과 충이 함께 섞여 있는 해예요.${evText}` : '두 사람 사이에 뚜렷한 합·충은 없는 해예요.'
    const note = `${base} 그해엔 ${jiEl}(${ELEMENT_HANJA[jiEl]}) 기운이 흘러, 관계에도 ${ELEMENT_YEAR_THEME[jiEl]}.`
    return { year: y, ganZhi: gz, hangul: `${gan?.hangul ?? ''}${ji?.hangul ?? ''}`, tag, note }
  }

  // 평생을 10년 단위로 (더 젊은 사람이 약 85세가 될 때까지)
  const youngerAge = nowY - Math.max(a.input.year, b.input.year)
  const nDecades = Math.min(7, Math.max(3, Math.ceil((85 - youngerAge) / 10)))
  const timeline: CoupleDecade[] = []
  for (let d = 0; d < nDecades; d++) {
    const startYear = nowY + d * 10
    const endYear = startYear + 9
    const years: CoupleYear[] = []
    for (let y = startYear; y <= endYear; y++) years.push(scoreYear(y))
    const good = years.filter((y) => y.tag === '좋음').length
    const caution = years.filter((y) => y.tag === '주의').length
    const tag: CoupleDecade['tag'] = good > caution ? '좋음' : caution > good ? '주의' : '무난'
    const vibe = tag === '좋음' ? '대체로 순조롭고 서로 가까워지기 좋은' : tag === '주의' ? '다소 부딪힘과 조율이 필요한' : '큰 굴곡 없이 잔잔한'
    let summary = `${startYear}~${endYear}년은 두 사람에게 ${vibe} 10년이에요. 관계가 특히 잘 맞물리는 해가 ${good}번, 서로 배려가 필요한 해가 ${caution}번 들어 있어요.`
    const goodList = years.filter((y) => y.tag === '좋음').map((y) => y.year)
    const cautionList = years.filter((y) => y.tag === '주의').map((y) => y.year)
    const hi: string[] = []
    if (goodList.length) hi.push(`💛 좋은 해: ${goodList.join('·')}`)
    if (cautionList.length) hi.push(`🌱 조율할 해: ${cautionList.join('·')}`)
    if (hi.length) summary += ' ' + hi.join(' / ') + '.'
    timeline.push({ startYear, endYear, tag, goodYears: good, cautionYears: caution, summary, years, isNow: d === 0 })
  }

  // ── 커플 올해·오늘 운세 (한 문단 코멘트) ──
  const mkPeriod = (label: string, gz: string, josa: string): CouplePeriod => {
    const zhi = gz.charAt(1)
    const gan = ganOf(gz.charAt(0))
    const ji = jiOf(zhi)
    const jiEl: Element = ji ? ji.element : '토'
    const unit = label === '올해' ? '해' : '날'
    let s = 0
    const ev: string[] = []
    const chk = (name: string, pj: string) => {
      const pjH = jiOf(pj)?.hangul ?? pj
      const zH = ji?.hangul ?? zhi
      if (YUKHAP.some(([x, y]) => eqPair(zhi, pj, x, y))) { s += 2; ev.push(`${name} 일지 ${pjH}·${zH} 육합`) }
      else if (SAMHAP.some((t) => t.includes(zhi) && t.includes(pj) && zhi !== pj)) { s += 1; ev.push(`${name} 일지 ${pjH} 삼합`) }
      if (CHUNG.some(([x, y]) => eqPair(zhi, pj, x, y))) { s -= 2; ev.push(`${name} 일지 ${pjH}·${zH} 충`) }
    }
    chk(na, ajFor)
    chk(nb, bjFor)
    const tag: CouplePeriod['tag'] = s >= 2 ? '좋음' : s <= -2 ? '주의' : '무난'
    const evText = ev.length ? ` (${ev.join(', ')})` : ''
    let p1: string
    if (tag === '좋음') {
      p1 = `${label}(${gz})${josa} 두 사람의 기운이 서로 잘 맞물리는 흐름이에요.${evText} 서로에게 너그러워지고 마음이 가까워지기 쉬운 때라, 함께 좋은 시간을 보내거나 미뤄둔 이야기를 꺼내기에 좋은 ${unit}입니다.`
    } else if (tag === '주의') {
      p1 = `${label}(${gz})${josa} 사소한 일로 부딪히기 쉬운 기운이 섞여 있어요.${evText} 평소 같으면 넘어갈 일에도 예민해질 수 있으니, 말투를 한 번 더 고르고 서로의 입장을 먼저 헤아리면 큰 탈 없이 지나갑니다.`
    } else {
      p1 = ev.length
        ? `${label}(${gz})${josa} 좋은 기운과 조율할 기운이 함께 있는 시기예요.${evText} 어느 한쪽으로 크게 기울지 않으니, 서로의 리듬을 존중하며 지내면 무난합니다.`
        : `${label}(${gz})${josa} 두 사람 사이에 큰 굴곡 없이 잔잔하게 흐르는 시기예요. 특별한 이벤트보다 소소한 다정함을 주고받기 좋은 때랍니다.`
    }
    const advice =
      tag === '좋음' ? '이 기운을 살려 서로에게 표현을 아끼지 말아보세요.'
        : tag === '주의' ? '조금만 조심하면 오히려 서로를 더 깊이 이해하게 되는 계기가 됩니다.'
          : '기대를 조금 낮추고 일상을 함께 즐기면 편안한 시간이 됩니다.'
    const p2 = `${label}에는 ${jiEl}(${ELEMENT_HANJA[jiEl]}) 기운이 도드라져, 두 사람 사이에도 ${ELEMENT_YEAR_THEME[jiEl]}. ${advice}`
    return {
      label,
      ganZhi: gz,
      hangul: `${gan?.hangul ?? ''}${ji?.hangul ?? ''}`,
      element: jiEl,
      tag,
      paras: [p1, p2],
    }
  }
  const seunGzNow = Solar.fromYmd(nowY, 6, 1).getLunar().getYearInGanZhiByLiChun()
  const dayGzNow = Solar.fromYmd(nowY, now.getMonth() + 1, now.getDate()).getLunar().getDayInGanZhi()
  const fortune = { year: mkPeriod('올해', seunGzNow, '는'), today: mkPeriod('오늘', dayGzNow, '은') }

  score = Math.max(42, Math.min(98, score))
  let grade: string
  if (score >= 85) grade = '천생연분 💞'
  else if (score >= 72) grade = '좋은 궁합 💛'
  else if (score >= 58) grade = '무난한 궁합 🙂'
  else grade = '노력이 필요한 궁합 🌱'

  const summary = `${na}와 ${nb}의 궁합은 <b>${grade}</b> (${score}점)이에요. ${
    score >= 72
      ? '서로에게 좋은 기운을 주고받는 인연이니, 아래 분야별 풀이를 참고해 관계를 더 예쁘게 가꿔보세요.'
      : score >= 58
        ? '큰 문제 없이 무난한 사이예요. 서로의 다른 점을 이해하면 훨씬 더 깊어질 수 있습니다.'
        : '다른 점이 많은 만큼, 서로를 있는 그대로 존중하는 노력이 이 관계를 단단하게 만들어요.'
  }`

  return { score, grade, summary, sections, fortune, timeline }
}
