import {
  ELEMENT_ORDER,
  ELEMENT_HANJA,
  GENERATES,
  CONTROLS,
  generatorOf,
  controllerOf,
  shishenBetween,
  ganOf,
  SHISHEN_GROUP,
  ZHI_MAIN_GAN,
  type Element,
  type ShishenGroup,
} from './ganji'
import type { Daeun, Pillar, SajuResult } from './saju'

// ── 일간(日干) 성격 해석 ─────────────────────────────
// 사주의 주인인 '일간' 하나로 보는 기본 성향 (정통 명리 기준)

export interface DayMasterProfile {
  title: string // 예: 갑목 (甲木)
  nature: string // 물상 비유
  keywords: string[]
  strength: string
  caution: string
}

export const DAY_MASTER: Record<string, DayMasterProfile> = {
  甲: {
    title: '갑목 (甲木) · 큰 나무',
    nature: '하늘을 향해 곧게 뻗는 아름드리 나무',
    keywords: ['리더십', '추진력', '명예', '올곧음'],
    strength:
      '앞장서서 이끄는 우두머리 기질이 있고, 정직하며 기획력과 명예욕이 강합니다. 큰 그림을 그리고 밀어붙이는 힘이 있어요.',
    caution:
      '고집이 세고 융통성이 부족합니다. 한 번 꺾이면 크게 흔들릴 수 있으니, 굽힐 줄 아는 유연함을 기르면 좋습니다.',
  },
  乙: {
    title: '을목 (乙木) · 화초와 넝쿨',
    nature: '어디서든 뿌리내리는 부드러운 풀과 덩굴',
    keywords: ['유연함', '적응력', '생활력', '섬세함'],
    strength:
      '환경 적응력과 현실 감각이 뛰어나고 생활력이 강합니다. 온화하고 처세에 능해 사람들 사이에서 잘 어울립니다.',
    caution:
      '남에게 기대거나 우유부단해지기 쉽고, 속으로 계산이 많을 수 있습니다. 줏대를 세우면 더 단단해집니다.',
  },
  丙: {
    title: '병화 (丙火) · 태양',
    nature: '만물을 골고루 비추는 한낮의 태양',
    keywords: ['정열', '표현력', '사교성', '솔직함'],
    strength:
      '밝고 열정적이며 표현력과 사교성이 탁월합니다. 화통하고 숨김이 없어 주변을 환하게 만드는 사람입니다.',
    caution:
      '성급하고 감정 기복이 큽니다. 말이 앞서 실수할 수 있으니 한 박자 쉬어가는 습관이 도움이 됩니다.',
  },
  丁: {
    title: '정화 (丁火) · 등불',
    nature: '어둠을 밝히는 촛불과 등불',
    keywords: ['따뜻함', '헌신', '집중력', '감수성'],
    strength:
      '따뜻하고 섬세하며 헌신적입니다. 사려 깊고 집중력이 좋아 한 분야를 깊게 파고드는 힘이 있습니다.',
    caution:
      '예민하고 감정적이라 기분에 따라 빛의 밝기가 달라집니다. 마음을 다스리는 자기만의 방법이 필요합니다.',
  },
  戊: {
    title: '무토 (戊土) · 큰 산',
    nature: '넓고 든든하게 자리한 산과 대지',
    keywords: ['포용력', '신뢰', '중후함', '중심'],
    strength:
      '포용력과 신뢰감이 있고 중심을 잘 잡습니다. 듬직하고 흔들리지 않아 사람들이 믿고 기댑니다.',
    caution:
      '고집이 세고 변화를 싫어합니다. 느긋함이 때로 답답함으로 비칠 수 있으니 유연한 시도를 곁들이면 좋습니다.',
  },
  己: {
    title: '기토 (己土) · 옥토',
    nature: '만물을 길러내는 논밭과 정원의 흙',
    keywords: ['자상함', '실속', '포용', '현실감각'],
    strength:
      '자상하고 실속 있으며 포용력과 섬세함을 함께 지녔습니다. 현실적이고 계산이 밝아 살림과 관리에 강합니다.',
    caution:
      '소극적이고 속을 잘 드러내지 않아 의심이 많아 보일 수 있습니다. 마음을 조금 더 열면 관계가 넓어집니다.',
  },
  庚: {
    title: '경금 (庚金) · 무쇠',
    nature: '아직 다듬어지지 않은 강한 쇳덩이',
    keywords: ['의리', '결단력', '추진력', '승부욕'],
    strength:
      '의리 있고 결단력과 추진력이 강합니다. 시원시원하고 불의를 못 참는 리더 기질이 있습니다.',
    caution:
      '거칠고 다혈질이며 융통성이 부족할 수 있습니다. 강함을 부드럽게 다듬으면 크게 쓰입니다.',
  },
  辛: {
    title: '신금 (辛金) · 보석',
    nature: '정교하게 세공된 보석과 금속',
    keywords: ['예리함', '깔끔함', '완벽주의', '자존심'],
    strength:
      '예리하고 깔끔하며 감각이 세련됐습니다. 완벽을 추구해 마무리가 정교하고 자기 관리가 뛰어납니다.',
    caution:
      '예민하고 까다로우며 상처를 오래 담아둡니다. 작은 흠에 집착하지 않는 여유가 필요합니다.',
  },
  壬: {
    title: '임수 (壬水) · 큰 물',
    nature: '넓고 깊게 흐르는 강과 바다',
    keywords: ['지혜', '포용', '활동성', '스케일'],
    strength:
      '지혜롭고 포용력이 크며 활동적입니다. 스케일이 크고 융통성이 있어 어디서든 길을 찾아냅니다.',
    caution:
      '변덕스럽고 종잡기 어려우며 마무리가 약할 수 있습니다. 벌인 일을 끝까지 매듭짓는 힘을 기르면 좋습니다.',
  },
  癸: {
    title: '계수 (癸水) · 맑은 물',
    nature: '이슬과 빗물처럼 맑고 조용한 물',
    keywords: ['총명함', '섬세함', '직관', '순수함'],
    strength:
      '총명하고 섬세하며 상상력과 직관이 뛰어납니다. 순수하고 헌신적이라 사람의 마음을 잘 헤아립니다.',
    caution:
      '내향적이고 감정 기복이 있으며 걱정이 많습니다. 생각을 너무 오래 붙들지 않는 연습이 도움이 됩니다.',
  },
}

// ── 십신(十神) 의미 ─────────────────────────────
export const SHISHEN_MEANING: Record<string, string> = {
  비견: '자립심·주체성. 형제·동료·경쟁의 별. 독립적이고 고집이 있으며 남에게 굽히지 않습니다.',
  겁재: '경쟁·승부·추진력. 재물을 두고 다투는 기운이라, 협업·동업에서는 주의가 필요합니다.',
  식신: '표현·여유·재능. 먹복과 낙천성의 별. 꾸준히 만들어내는 생산력과 온화함이 있습니다.',
  상관: '재능·언변·창의. 톡톡 튀고 표현력이 뛰어나지만, 틀·규율을 답답해하는 면이 있습니다.',
  편재: '활동적 재물·사업 수완. 큰돈을 굴리고 유통·투자에 능하나 씀씀이가 클 수 있습니다.',
  정재: '성실한 재물·안정. 알뜰하고 현실적이며 관리에 강한, 꾸준히 모으는 실속의 별입니다.',
  편관: '권위·카리스마·추진. 강한 리더십과 결단의 별이나, 과하면 압박·스트레스가 됩니다.',
  정관: '명예·책임·규율. 반듯하고 신뢰감 있으며 조직·공직에 잘 맞는 모범의 별입니다.',
  편인: '직관·궁리·임기응변. 눈치가 빠르고 비주류·전문 분야에 강한 순발력의 별입니다.',
  정인: '학문·인덕·수용. 배움과 보호, 명예의 별. 안정적이고 어른의 덕을 잘 받습니다.',
}

// 십신 5분류 설명
export const GROUP_DESC: Record<ShishenGroup, string> = {
  비겁: '나(自我)와 같은 기운 · 자립/경쟁',
  식상: '내가 낳는 기운 · 표현/재능',
  재성: '내가 다스리는 기운 · 재물/결과',
  관성: '나를 다스리는 기운 · 명예/직장',
  인성: '나를 돕는 기운 · 학문/보호',
}

// ── 오행 균형 해석 ─────────────────────────────
export interface ElementBar {
  element: Element
  hanja: string
  count: number
  ratio: number // 0~1
}

export interface StrengthAnalysis {
  label: '신강' | '신약' | '중화'
  ally: number // 아군(비겁+인성) 개수
  foe: number // 적군(식상+재성+관성) 개수
  text: string
}

export interface ShishenGroupTally {
  group: ShishenGroup
  desc: string
  count: number
  members: string[] // 이 분류에서 실제 등장한 십신 이름
}

export interface ShishenAnalysis {
  groups: ShishenGroupTally[] // 5분류 (비겁·식상·재성·관성·인성 순)
  total: number
  dominant: ShishenGroup | null
  absentGroups: ShishenGroup[]
  present: { name: string; group: ShishenGroup; count: number; text: string }[]
  summary: string
}

export interface Interpretation {
  dayMaster: DayMasterProfile
  bars: ElementBar[]
  excess: Element[] // 과다한 오행
  lacking: Element[] // 부족(0개)한 오행
  balanceText: string
  strength: StrengthAnalysis
  shishen: ShishenAnalysis
}

const GROUP_ORDER: ShishenGroup[] = ['비겁', '식상', '재성', '관성', '인성']

function analyzeShishen(result: SajuResult): ShishenAnalysis {
  const dm = result.dayMaster
  const p = result.pillars
  const points: string[] = []

  // 천간 십신: 년·월·시 (일간 자신은 제외)
  for (const pil of [p.year, p.month, p.hour]) {
    if (pil) points.push(shishenBetween(dm, pil.gan))
  }
  // 지지 십신: 년·월·일·시 (지지 정기 기준)
  for (const pil of [p.year, p.month, p.day, p.hour] as (Pillar | null)[]) {
    if (!pil) continue
    const mainGan = ganOf(ZHI_MAIN_GAN[pil.ji.hanja])
    if (mainGan) points.push(shishenBetween(dm, mainGan))
  }

  const nameCount = new Map<string, number>()
  for (const n of points) nameCount.set(n, (nameCount.get(n) ?? 0) + 1)

  const groups: ShishenGroupTally[] = GROUP_ORDER.map((group) => {
    const members: string[] = []
    let count = 0
    for (const [name, c] of nameCount) {
      if (SHISHEN_GROUP[name] === group) {
        members.push(name)
        count += c
      }
    }
    return { group, desc: GROUP_DESC[group], count, members }
  })

  const total = points.length
  const maxCount = Math.max(...groups.map((g) => g.count))
  const topGroups = groups.filter((g) => g.count === maxCount && maxCount > 0)
  const dominant = topGroups.length === 1 && maxCount >= 2 ? topGroups[0].group : null
  const absentGroups = groups.filter((g) => g.count === 0).map((g) => g.group)

  const present = [...nameCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      group: SHISHEN_GROUP[name],
      count,
      text: SHISHEN_MEANING[name],
    }))

  const parts: string[] = []
  if (dominant) {
    const g = groups.find((x) => x.group === dominant)!
    parts.push(
      `${dominant}(${g.members.join('·')}) 기운이 가장 두드러집니다. ‘${GROUP_DESC[dominant]}’의 성향이 삶에서 크게 작용합니다.`,
    )
  } else {
    parts.push('특정 십신에 크게 치우치지 않고 여러 기운이 고루 섞여 있습니다.')
  }
  if (absentGroups.length) {
    parts.push(
      `${absentGroups.join('·')} 기운은 뚜렷하지 않아, 그 영역은 후천적으로 보완하면 균형이 좋아집니다.`,
    )
  }

  return { groups, total, dominant, absentGroups, present, summary: parts.join(' ') }
}

export function interpret(result: SajuResult): Interpretation {
  const { elementCount, totalCounted, dayMasterElement } = result

  const bars: ElementBar[] = ELEMENT_ORDER.map((element) => ({
    element,
    hanja: ELEMENT_HANJA[element],
    count: elementCount[element],
    ratio: totalCounted ? elementCount[element] / totalCounted : 0,
  }))

  const excess = ELEMENT_ORDER.filter((e) => elementCount[e] >= 3)
  const lacking = ELEMENT_ORDER.filter((e) => elementCount[e] === 0)

  // 균형 해설
  const parts: string[] = []
  if (excess.length) {
    parts.push(
      `${excess.map((e) => `${e}(${ELEMENT_HANJA[e]})`).join('·')} 기운이 강하게 몰려 있습니다. 이 기운의 성향이 도드라지되, 지나치면 오히려 부담이 될 수 있습니다.`,
    )
  }
  if (lacking.length) {
    parts.push(
      `${lacking.map((e) => `${e}(${ELEMENT_HANJA[e]})`).join('·')} 기운이 사주에 드러나 있지 않습니다. 이 기운이 상징하는 부분은 후천적으로 보완하면 좋습니다.`,
    )
  }
  if (!excess.length && !lacking.length) {
    parts.push('오행이 비교적 고르게 분포되어 균형 잡힌 사주입니다. 어느 한쪽으로 치우치지 않는 안정감이 강점입니다.')
  }

  // 간이 신강/신약: 아군(비겁=일간과 같은 오행, 인성=일간을 생하는 오행) vs 나머지
  const same = dayMasterElement
  const gen = generatorOf(dayMasterElement) // 인성
  const ally = elementCount[same] + elementCount[gen]
  const foe = totalCounted - ally
  let label: StrengthAnalysis['label']
  let sText: string
  if (ally > foe) {
    label = '신강'
    sText =
      '일간을 돕는 기운(비겁·인성)이 많은 신강(身强) 사주입니다. 주체성과 힘이 강하니, 그 힘을 밖으로 잘 써낼 활동과 목표가 있으면 크게 발현됩니다.'
  } else if (ally < foe) {
    label = '신약'
    sText =
      '일간을 빼가고 누르는 기운이 많은 신약(身弱) 사주입니다. 자기를 지지해줄 사람·환경·인성의 기운을 곁에 두면 안정되고 힘이 납니다.'
  } else {
    label = '중화'
    sText =
      '돕는 기운과 빼가는 기운이 균형을 이룬 중화(中和)에 가까운 사주입니다. 상황에 맞춰 유연하게 힘을 조절할 수 있습니다.'
  }
  const controller = controllerOf(dayMasterElement)

  return {
    dayMaster: DAY_MASTER[result.dayMaster.hanja],
    bars,
    excess,
    lacking,
    balanceText: parts.join(' '),
    strength: {
      label,
      ally,
      foe,
      text: `${sText} (일간 ${dayMasterElement}${ELEMENT_HANJA[dayMasterElement]}을 돕는 ${same}·${gen} 기운 ${ally}개, 빼가거나 누르는 ${GENERATES[dayMasterElement]}·${CONTROLS[dayMasterElement]}·${controller} 기운 ${foe}개)`,
    },
    shishen: analyzeShishen(result),
  }
}

// ── 운(運) 길흉: 억부(抑扶) 기준 ─────────────────────────────
// 신약이면 돕는 기운(비겁·인성)이 길, 신강이면 빼는 기운(식상·재성·관성)이 길
export type FavorTag = '순탄' | '분발' | '무난'
const HELPING_GROUPS: ShishenGroup[] = ['비겁', '인성']

export function favorOf(
  group: ShishenGroup,
  strength: StrengthAnalysis['label'],
): { tag: FavorTag; text: string } {
  if (strength === '중화') {
    return { tag: '무난', text: '일간이 균형을 이뤄, 큰 굴곡 없이 무난하게 흐르는 기운입니다.' }
  }
  const helps = HELPING_GROUPS.includes(group)
  const good = strength === '신약' ? helps : !helps
  if (good) {
    return {
      tag: '순탄',
      text:
        strength === '신약'
          ? '약한 일간을 받쳐주는 기운이라, 힘을 얻고 일이 순조롭게 풀리기 좋은 흐름입니다.'
          : '강한 힘을 밖으로 잘 써낼 수 있어, 성취와 결실이 큰 흐름입니다.',
    }
  }
  return {
    tag: '분발',
    text:
      strength === '신약'
        ? '기운을 빼가는 흐름이라, 무리한 확장보다 실속을 챙기며 힘을 아낄 때입니다.'
        : '가뜩이나 강한 일간에 힘이 더해져 과할 수 있으니, 욕심과 고집을 다스릴 때입니다.',
  }
}

export interface PeriodReading {
  shishen: string
  group: ShishenGroup
  meaning: string
  favor: { tag: FavorTag; text: string }
}

export interface DaeunDetail {
  ganHalf: PeriodReading // 전반 5년 (천간)
  jiHalf: PeriodReading // 후반 5년 (지지)
}

function readingOf(name: string, strength: StrengthAnalysis['label']): PeriodReading {
  const group = SHISHEN_GROUP[name]
  return { shishen: name, group, meaning: SHISHEN_MEANING[name], favor: favorOf(group, strength) }
}

export function daeunDetail(d: Daeun, strength: StrengthAnalysis['label']): DaeunDetail {
  return {
    ganHalf: readingOf(d.shishen, strength),
    jiHalf: readingOf(d.jiShishen, strength),
  }
}
