import { computeFortune } from './fortune'
import { SHISHEN_GROUP, type ShishenGroup } from './ganji'
import type { SajuResult } from './saju'
import type { Interpretation } from './interpret'

export interface CareerReading {
  styleTitle: string
  styleText: string
  fields: string[] // 추천 분야
  caution: string
  flowText: string // 현재 직장운 흐름 (대운·세운)
  basis: string // 판단 근거
}

interface Profile {
  title: string
  text: string
  fields: string[]
  caution: string
}

const GWAN_JUNG: Profile = {
  title: '조직형 · 안정 지향',
  text: '규율과 책임을 잘 지키는 성향이라, 체계가 잡힌 조직에서 신뢰받고 인정받습니다. 맡은 자리를 꾸준히 지키며 위로 올라가는 힘이 있어요.',
  fields: ['공직·공기업', '대기업', '행정·관리', '법무·회계', '교육'],
  caution: '규범에 너무 얽매이면 답답해질 수 있으니, 가끔은 유연함도 챙기세요.',
}
const GWAN_PYEON: Profile = {
  title: '리더형 · 승부 지향',
  text: '경쟁과 압박 속에서 오히려 힘을 내는 추진형입니다. 사람을 이끌고 밀어붙이는 자리에서 두각을 나타냅니다.',
  fields: ['영업·세일즈', '군인·경찰', '스포츠', '창업·리더', '현장 관리'],
  caution: '과로와 스트레스가 쌓이기 쉬우니 페이스 조절이 중요해요.',
}

const PROFILES: Record<ShishenGroup, Profile> = {
  관성: GWAN_JUNG,
  재성: {
    title: '사업·재물형',
    text: '돈의 흐름을 읽고 실리를 챙기는 감각이 뛰어납니다. 성과가 곧 보상으로 돌아오는 분야에서 신나게 일합니다.',
    fields: ['사업·창업', '유통·무역', '금융·투자', '부동산', '영업'],
    caution: '벌인 일을 끝까지 관리하는 힘을 함께 기르면 크게 됩니다.',
  },
  식상: {
    title: '전문·창작형',
    text: '타고난 재능과 표현력으로 승부하는 타입입니다. 내 능력을 직접 펼쳐 보이는 일에서 빛이 납니다.',
    fields: ['전문기술', '창작·예술', '교육·강의', '방송·콘텐츠', '프리랜서'],
    caution: '틀에 박힌 조직 생활은 답답해할 수 있어요. 자율성이 있는 환경을 찾으세요.',
  },
  인성: {
    title: '학문·전문지식형',
    text: '배우고 익혀 쌓은 지식으로 인정받습니다. 자격과 전문성을 바탕으로 오래 신뢰받는 길이 잘 맞습니다.',
    fields: ['연구·학술', '교육', '의료·보건', '행정', '자격 전문직'],
    caution: '아는 것을 실행·마무리로 옮기는 추진력을 더하면 좋아요.',
  },
  비겁: {
    title: '독립·자영형',
    text: '주체적으로 내 일을 꾸리고 싶어하는 성향입니다. 남 밑보다 스스로 결정하는 자리에서 힘이 납니다.',
    fields: ['자영업', '전문직 개업', '1인 사업', '프리랜서'],
    caution: '동업이나 공동 재물은 다툼이 생기기 쉬우니 신중하게 접근하세요.',
  },
}

const FLOW_THEME: Record<ShishenGroup, string> = {
  비겁: '독립·경쟁·동료 관계가 부각되는',
  식상: '재능 발휘·이직·표현 욕구가 커지는',
  재성: '사업·재물 활동이 활발해지는',
  관성: '직장·승진·명예 기회가 움직이는',
  인성: '공부·자격·안정을 다지는',
}

// 직업 성향별 "쉬운 예시"
export const CAREER_EXAMPLE: Record<string, string> = {
  '조직형 · 안정 지향': '공무원·대기업 인사팀처럼 체계 안에서 차근차근 인정받는 커리어.',
  '리더형 · 승부 지향': '영업 관리자·군경·스포츠 지도자처럼 사람을 이끌고 밀어붙이는 자리.',
  '사업·재물형': '자영업·유통·투자처럼 성과가 곧 수입으로 이어지는 일.',
  '전문·창작형': '디자이너·강사·크리에이터처럼 내 재능을 직접 펼치는 일.',
  '학문·전문지식형': '연구원·교사·전문 자격직처럼 배움을 밑천으로 삼는 일.',
  '독립·자영형': '1인 사업·프리랜서·전문직 개업처럼 내가 주도하는 일.',
}

export function analyzeCareer(
  result: SajuResult,
  interp: Interpretation,
  now: Date,
): CareerReading {
  const count: Record<ShishenGroup, number> = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 }
  for (const g of interp.shishen.groups) count[g.group] = g.count

  // 직업 성향은 관성·재성·식상 중심으로 판단 (동점이면 이 우선순위)
  const order: ShishenGroup[] = ['관성', '재성', '식상', '인성', '비겁']
  let primary: ShishenGroup = '비겁'
  let best = -1
  for (const grp of order) {
    if (count[grp] > best) {
      best = count[grp]
      primary = grp
    }
  }

  let profile: Profile
  if (primary === '관성') {
    const jung = interp.shishen.present.find((p) => p.name === '정관')?.count ?? 0
    const pyeon = interp.shishen.present.find((p) => p.name === '편관')?.count ?? 0
    profile = pyeon > jung ? GWAN_PYEON : GWAN_JUNG
  } else {
    profile = PROFILES[primary]
  }
  const noGwan = count['관성'] === 0

  // 흐름: 현재 대운 + 올해 세운
  const y = now.getFullYear()
  const cur = result.daeun.list.find((d) => y >= d.startYear && y <= d.endYear)
  const seunShishen = computeFortune(result.dayMaster, interp.strength.label, now).year.ganShishen
  const seunGroup = SHISHEN_GROUP[seunShishen]
  const flowParts: string[] = []
  if (cur) flowParts.push(`지금 대운은 ‘${FLOW_THEME[SHISHEN_GROUP[cur.shishen]]}’ 시기`)
  flowParts.push(`올해 세운은 ‘${FLOW_THEME[seunGroup]}’ 기운`)

  return {
    styleTitle: profile.title,
    styleText:
      profile.text +
      (noGwan
        ? ' 사주에 관성(직장의 별)이 뚜렷하지 않아, 짜인 조직보다 자유롭게 내 전문성을 펼치는 길이 더 잘 맞는 편입니다.'
        : ''),
    fields: profile.fields,
    caution: profile.caution,
    flowText: flowParts.join(', ') + '입니다.',
    basis: `내 십신 분포 — 관성 ${count['관성']} · 재성 ${count['재성']} · 식상 ${count['식상']} · 인성 ${count['인성']} · 비겁 ${count['비겁']}개. 이 중 가장 강한 ‘${primary}’ 기운을 기준으로 성향을 봤고, 흐름은 현재 대운 십신 ‘${cur ? cur.shishen : '-'}’ + 올해 세운 십신 ‘${seunShishen}’로 판단했어요.`,
  }
}
