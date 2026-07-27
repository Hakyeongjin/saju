// 천간·지지·오행 기초 데이터 (정통 명리 기준)

export type Element = '목' | '화' | '토' | '금' | '수'
export type YinYang = '양' | '음'

export const ELEMENT_ORDER: Element[] = ['목', '화', '토', '금', '수']

// 오행별 색상 (UI 표시용)
export const ELEMENT_COLOR: Record<Element, string> = {
  목: '#3f9c58', // 청(靑) - 나무
  화: '#d6453d', // 적(赤) - 불
  토: '#c99a3b', // 황(黃) - 흙
  금: '#9aa0a6', // 백(白) - 쇠
  수: '#2b3a55', // 흑(黑) - 물
}

// 오행별 한자
export const ELEMENT_HANJA: Record<Element, string> = {
  목: '木',
  화: '火',
  토: '土',
  금: '金',
  수: '水',
}

export interface Gan {
  hanja: string
  hangul: string
  element: Element
  yinYang: YinYang
}

export interface Ji {
  hanja: string
  hangul: string
  element: Element
  yinYang: YinYang
  animal: string // 십이지 동물(띠)
}

// 천간 10개
export const GAN: Record<string, Gan> = {
  甲: { hanja: '甲', hangul: '갑', element: '목', yinYang: '양' },
  乙: { hanja: '乙', hangul: '을', element: '목', yinYang: '음' },
  丙: { hanja: '丙', hangul: '병', element: '화', yinYang: '양' },
  丁: { hanja: '丁', hangul: '정', element: '화', yinYang: '음' },
  戊: { hanja: '戊', hangul: '무', element: '토', yinYang: '양' },
  己: { hanja: '己', hangul: '기', element: '토', yinYang: '음' },
  庚: { hanja: '庚', hangul: '경', element: '금', yinYang: '양' },
  辛: { hanja: '辛', hangul: '신', element: '금', yinYang: '음' },
  壬: { hanja: '壬', hangul: '임', element: '수', yinYang: '양' },
  癸: { hanja: '癸', hangul: '계', element: '수', yinYang: '음' },
}

// 지지 12개
export const JI: Record<string, Ji> = {
  子: { hanja: '子', hangul: '자', element: '수', yinYang: '양', animal: '쥐' },
  丑: { hanja: '丑', hangul: '축', element: '토', yinYang: '음', animal: '소' },
  寅: { hanja: '寅', hangul: '인', element: '목', yinYang: '양', animal: '호랑이' },
  卯: { hanja: '卯', hangul: '묘', element: '목', yinYang: '음', animal: '토끼' },
  辰: { hanja: '辰', hangul: '진', element: '토', yinYang: '양', animal: '용' },
  巳: { hanja: '巳', hangul: '사', element: '화', yinYang: '음', animal: '뱀' },
  午: { hanja: '午', hangul: '오', element: '화', yinYang: '양', animal: '말' },
  未: { hanja: '未', hangul: '미', element: '토', yinYang: '음', animal: '양' },
  申: { hanja: '申', hangul: '신', element: '금', yinYang: '양', animal: '원숭이' },
  酉: { hanja: '酉', hangul: '유', element: '금', yinYang: '음', animal: '닭' },
  戌: { hanja: '戌', hangul: '술', element: '토', yinYang: '양', animal: '개' },
  亥: { hanja: '亥', hangul: '해', element: '수', yinYang: '음', animal: '돼지' },
}

// 십신 한자(간체 포함) → 한글
export const SHISHEN: Record<string, string> = {
  比肩: '비견',
  劫財: '겁재',
  劫财: '겁재',
  食神: '식신',
  傷官: '상관',
  伤官: '상관',
  偏財: '편재',
  偏财: '편재',
  正財: '정재',
  正财: '정재',
  偏官: '편관',
  七殺: '편관',
  七杀: '편관',
  正官: '정관',
  偏印: '편인',
  正印: '정인',
}

export function ganOf(hanja: string): Gan | undefined {
  return GAN[hanja]
}

export function jiOf(hanja: string): Ji | undefined {
  return JI[hanja]
}

export function shishenKo(hanja: string): string {
  return SHISHEN[hanja] ?? hanja
}

// ── 오행 상생·상극 ─────────────────────────────
// 상생 순환: 목→화→토→금→수→목
export const GENERATES: Record<Element, Element> = {
  목: '화', 화: '토', 토: '금', 금: '수', 수: '목',
}
// 상극 순환: 목→토→수→화→금→목
export const CONTROLS: Record<Element, Element> = {
  목: '토', 토: '수', 수: '화', 화: '금', 금: '목',
}
// el 을 생(生)해주는 오행
export function generatorOf(el: Element): Element {
  return (Object.keys(GENERATES) as Element[]).find((k) => GENERATES[k] === el)!
}
// el 을 극(剋)하는 오행
export function controllerOf(el: Element): Element {
  return (Object.keys(CONTROLS) as Element[]).find((k) => CONTROLS[k] === el)!
}

// ── 십신(十神) ─────────────────────────────
export type ShishenGroup = '비겁' | '식상' | '재성' | '관성' | '인성'

// 일간(dayGan) 기준, target 천간의 십신(한글)
export function shishenBetween(dayGan: Gan, target: Gan): string {
  const dEl = dayGan.element
  const tEl = target.element
  const same = dayGan.yinYang === target.yinYang
  if (tEl === dEl) return same ? '비견' : '겁재'
  if (GENERATES[dEl] === tEl) return same ? '식신' : '상관' // 일간이 생 → 식상
  if (CONTROLS[dEl] === tEl) return same ? '편재' : '정재' // 일간이 극 → 재성
  if (CONTROLS[tEl] === dEl) return same ? '편관' : '정관' // target이 일간을 극 → 관성
  return same ? '편인' : '정인' // target이 일간을 생 → 인성
}

export const SHISHEN_GROUP: Record<string, ShishenGroup> = {
  비견: '비겁', 겁재: '비겁',
  식신: '식상', 상관: '식상',
  편재: '재성', 정재: '재성',
  편관: '관성', 정관: '관성',
  편인: '인성', 정인: '인성',
}

// 지지 정기(본기) → 천간 (지지 십신 산출용)
export const ZHI_MAIN_GAN: Record<string, string> = {
  子: '癸', 丑: '己', 寅: '甲', 卯: '乙', 辰: '戊', 巳: '丙',
  午: '丁', 未: '己', 申: '庚', 酉: '辛', 戌: '戊', 亥: '壬',
}
