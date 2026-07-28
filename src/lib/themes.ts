import { ELEMENT_HANJA, ELEMENT_ORDER, type Element, type ShishenGroup } from './ganji'
import type { SajuResult } from './saju'
import type { Interpretation } from './interpret'

export interface ThemeReading {
  icon: string
  title: string
  paras: string[] // 1~2문단
  example: string // 상황별 예시
  basis: string // 판단 근거
}

// 오행별 몸의 장부 (건강운용)
const ELEMENT_ORGAN: Record<Element, string> = {
  목: '간·담, 근육과 신경',
  화: '심장·혈관, 혈압',
  토: '위장·소화기',
  금: '폐·기관지, 대장',
  수: '신장·방광, 비뇨·생식기',
}

export function analyzeThemes(result: SajuResult, interp: Interpretation): ThemeReading[] {
  const gc: Record<ShishenGroup, number> = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 }
  for (const g of interp.shishen.groups) gc[g.group] = g.count
  const nameCount = (n: string) => interp.shishen.present.find((p) => p.name === n)?.count ?? 0
  const strong = interp.strength.label
  const male = result.input.gender === '남'
  const ec = result.elementCount

  const themes: ThemeReading[] = []

  // ── 1. 연애·결혼운 ──
  {
    // 남자는 재성(정재·편재), 여자는 관성(정관·편관)이 배우자/이성의 별
    const cnt = male ? gc['재성'] : gc['관성']
    const jeong = male ? nameCount('정재') : nameCount('정관') // 안정형
    const pyeon = male ? nameCount('편재') : nameCount('편관') // 자유형
    const starName = male ? '재성(정재·편재)' : '관성(정관·편관)'
    const paras: string[] = []
    if (cnt >= 2) {
      paras.push(
        `사주에 이성·배우자를 뜻하는 별인 ${starName}이 넉넉해서, 이성과의 인연이 풍부하고 연애에 활발한 편이에요. 매력을 어필할 기회도 많고, 사람들 사이에서 인기를 얻기 쉬운 사주랍니다.`,
      )
    } else if (cnt === 1) {
      paras.push(
        `이성·배우자의 별(${starName})이 적당히 자리해, 인연이 필요할 때 잘 찾아오는 무난한 연애운이에요. 너무 서두르지 않아도 때가 되면 좋은 사람을 만날 흐름입니다.`,
      )
    } else {
      paras.push(
        `이성·배우자의 별(${starName})이 겉으로 뚜렷하게 드러나지 않은 편이에요. 인연이 조금 늦게 오거나 귀하게 찾아오는 스타일이라, 기다리기보다 내가 먼저 마음을 열고 다가가면 좋은 만남으로 이어집니다.`,
      )
    }
    if (jeong > pyeon) {
      paras.push('연애 스타일은 <b>진지하고 안정적인 쪽</b>이에요. 한 사람에게 정착해 오래가는 관계를 편안해합니다.')
    } else if (pyeon > jeong) {
      paras.push('연애 스타일은 <b>자유롭고 다채로운 쪽</b>이에요. 설렘과 변화를 즐기지만, 진짜 인연 앞에서는 진득함도 챙겨보세요.')
    }
    themes.push({
      icon: '💗',
      title: '연애·결혼운',
      paras,
      example:
        cnt >= 2
          ? '인연이 자주 생기는 편이라, 좋은 사람인지 천천히 살펴보는 여유가 오히려 도움이 돼요.'
          : cnt === 1
            ? '서두르지 않아도 때가 되면 자연스러운 인연이 찾아와요.'
            : '인연이 늦게 오는 편이니, 마음에 드는 사람에겐 내가 먼저 다가가 보세요.',
      basis: `${male ? '남자라 이성·배우자의 별은 재성' : '여자라 이성·배우자의 별은 관성'} — ${starName} ${cnt}개 (안정형 ${jeong} · 자유형 ${pyeon})`,
    })
  }

  // ── 2. 재물운 ──
  {
    const jae = gc['재성']
    const paras: string[] = []
    if (jae >= 2 && strong === '신강') {
      paras.push(
        '재물의 별(재성)이 튼튼하고 일간의 힘도 강해서, 돈을 벌고 지킬 그릇이 큰 <b>재복이 좋은 사주</b>예요. 벌이의 기회를 잘 잡고, 큰돈도 감당할 수 있는 힘이 있습니다.',
      )
    } else if (jae >= 2 && strong === '신약') {
      paras.push(
        '재물의 별(재성)은 넉넉하지만 일간의 힘이 약한 편이라, <b>돈은 들어오되 관리가 관건</b>인 사주예요. 욕심내 무리하게 벌이면 몸과 마음이 지칠 수 있으니, 감당할 만큼만 챙기고 건강·저축을 함께 신경 쓰면 안정됩니다.',
      )
    } else if (jae >= 1) {
      paras.push('재물의 별이 적절히 있어, 크게 부족하지 않고 꾸준히 벌어 모으는 <b>안정적인 재물운</b>이에요.')
    } else {
      paras.push(
        '재물의 별이 뚜렷하지 않은 편이라, 큰 한탕보다 <b>성실하게 쌓아가는 방식</b>이 잘 맞아요. 자기 재주(식상)를 갈고닦아 전문성으로 버는 길이 재물운을 크게 키워줍니다.',
      )
    }
    if (nameCount('편재') > nameCount('정재') && jae >= 1) {
      paras.push('큰 흐름의 돈(편재)이 강해 <b>사업·투자 감각</b>이 있지만 기복도 있으니, 벌 때 관리하는 습관이 중요해요.')
    } else if (nameCount('정재') >= 1) {
      paras.push('꾸준한 돈(정재)이 있어 <b>성실하게 모으는 힘</b>이 좋습니다. 알뜰함이 곧 재산이 되는 타입이에요.')
    }
    themes.push({
      icon: '💰',
      title: '재물운',
      paras,
      example:
        jae >= 2
          ? '재물 기회가 왔을 때 감당할 그릇이 있으니, 좋은 기회는 과감히 잡아보세요.'
          : jae >= 1
            ? '무리한 한 방보다 버는 만큼 꾸준히 모으면 착실히 불어나요.'
            : '큰 욕심보다 매달 자동저축부터 시작하는 게 당신에겐 정답이에요.',
      basis: `재물의 별(재성) ${jae}개, 일간의 힘 ‘${strong}’ 기준`,
    })
  }

  // ── 3. 건강운 ──
  {
    const excess = ELEMENT_ORDER.filter((e) => ec[e] >= 3)
    const lacking = ELEMENT_ORDER.filter((e) => ec[e] === 0)
    const paras: string[] = []
    if (!excess.length && !lacking.length) {
      paras.push('오행이 비교적 고르게 갖춰져 <b>큰 굴곡 없이 건강한 편</b>이에요. 지금처럼 규칙적인 생활을 유지하면 평생 건강의 든든한 밑천이 됩니다.')
    } else {
      if (excess.length) {
        paras.push(
          `${excess.map((e) => `${e}(${ELEMENT_HANJA[e]})`).join('·')} 기운이 강하게 몰려 있어요. 이 기운과 연결된 <b>${excess.map((e) => ELEMENT_ORGAN[e]).join(', ')}</b>가 과로하거나 열이 쌓이기 쉬우니 무리하지 않도록 살펴주세요.`,
        )
      }
      if (lacking.length) {
        paras.push(
          `${lacking.map((e) => `${e}(${ELEMENT_HANJA[e]})`).join('·')} 기운이 약한 편이라, <b>${lacking.map((e) => ELEMENT_ORGAN[e]).join(', ')}</b> 쪽이 상대적으로 약할 수 있어요. 평소 이 부위를 따뜻하게 하고 무리를 줄이면 좋습니다.`,
        )
      }
      paras.push('사주의 건강운은 “타고난 체질의 경향”일 뿐, 생활습관으로 얼마든지 보완할 수 있으니 너무 걱정하지 않으셔도 돼요. 🙂')
    }
    themes.push({
      icon: '🌿',
      title: '건강운',
      paras,
      example: lacking.length
        ? `${lacking.map((e) => ELEMENT_ORGAN[e]).join('·')} 쪽이 약할 수 있으니, 과로·과음을 피하고 그 부위를 따뜻하게 관리하세요.`
        : excess.length
          ? `${excess.map((e) => ELEMENT_ORGAN[e]).join('·')}에 열·무리가 쌓이기 쉬우니, 스트레스를 그때그때 풀어주세요.`
          : '큰 약점이 없으니 규칙적인 수면·식사만 지켜도 건강이 잘 유지돼요.',
      basis: `오행 과다 [${excess.map((e) => e + ELEMENT_HANJA[e]).join('·') || '없음'}] · 부족 [${lacking.map((e) => e + ELEMENT_HANJA[e]).join('·') || '없음'}]`,
    })
  }

  // ── 4. 학업·시험운 ──
  {
    const paras: string[] = []
    if (gc['인성'] >= 1) {
      paras.push(
        '공부와 문서·시험의 별인 <b>인성</b>이 있어, 배우고 익히는 데 유리한 사주예요. 한 분야를 꾸준히 파고들어 자격이나 학위로 결실 맺는 힘이 있습니다.',
      )
      if (gc['관성'] >= 1) paras.push('여기에 <b>관성(합격·명예의 별)</b>까지 있어 시험·자격증·입시 같은 “관문 통과” 운이 특히 좋은 편이에요.')
    } else {
      paras.push(
        '문서·공부의 별(인성)이 뚜렷하지 않아, 책상 암기보다 <b>직접 경험하고 부딪히며 배우는 실전형</b>이에요. 흥미가 생긴 분야에 몰입할 때 학습 효율이 확 올라갑니다.',
      )
    }
    if (gc['식상'] >= 2) paras.push('표현·응용의 별(식상)이 강해 <b>이해력과 창의력이 뛰어나지만</b>, 반복 암기는 지루해할 수 있어요. 나만의 방식으로 정리하며 공부하면 훨씬 잘 맞습니다.')
    themes.push({
      icon: '📚',
      title: '학업·시험운',
      paras,
      example:
        gc['인성'] >= 1
          ? '자격증·시험처럼 목표가 뚜렷한 공부가 잘 맞으니, 계획표대로 꾸준히 준비해요.'
          : '이론 암기보다 실습·프로젝트로 부딪히며 배우면 훨씬 빨리 흡수해요.',
      basis: `인성(공부의 별) ${gc['인성']}개 · 관성(합격의 별) ${gc['관성']}개 · 식상 ${gc['식상']}개 기준`,
    })
  }

  // ── 5. 대인관계운 ──
  {
    const paras: string[] = []
    if (gc['비겁'] >= 2) {
      paras.push(
        '형제·친구·동료의 별인 <b>비겁</b>이 많아, 사람을 좋아하고 주변에 사람이 잘 모이는 <b>의리파</b>예요. 다만 그만큼 경쟁이나 금전 거래에서 부딪힐 수 있으니, 가까운 사이일수록 돈 문제는 깔끔히 하는 게 좋아요.',
      )
    } else if (gc['비겁'] === 0) {
      paras.push('비겁(동료의 별)이 약해 넓게 어울리기보다 <b>소수와 깊게</b> 사귀는 스타일이에요. 혼자만의 시간도 소중히 여기는 독립적인 사람입니다.')
    } else {
      paras.push('사람 관계에서 크게 치우치지 않고 <b>적당한 거리감을 잘 지키는</b> 무난한 대인운이에요.')
    }
    if (gc['식상'] >= 1) paras.push('표현의 별(식상)이 있어 <b>말솜씨와 매력으로 사람을 끄는 힘</b>이 있고, 인성이 있으면 윗사람·어른의 덕도 잘 받습니다.')
    else if (gc['인성'] >= 1) paras.push('인성(도움의 별)이 있어 <b>윗사람·어른의 덕</b>을 잘 받는 편이에요. 어려울 때 도와주는 귀인이 곁에 있습니다.')
    themes.push({
      icon: '🤝',
      title: '대인관계운',
      paras,
      example:
        gc['비겁'] >= 2
          ? '친구가 많은 만큼, 돈 거래·보증은 아무리 친해도 문서로 분명히 하세요.'
          : gc['비겁'] === 0
            ? '넓게보다 소수와 깊게 사귀는 편이니, 소중한 몇 명에게 정성을 쏟으면 돼요.'
            : '먼저 안부를 챙기고 다가가면 관계가 한결 단단해져요.',
      basis: `비겁(동료의 별) ${gc['비겁']}개 · 식상(표현의 별) ${gc['식상']}개 · 인성 ${gc['인성']}개 기준`,
    })
  }

  return themes
}
