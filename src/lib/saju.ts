import { Solar, Lunar } from 'lunar-typescript'
import {
  ganOf,
  jiOf,
  shishenKo,
  shishenBetween,
  ZHI_MAIN_GAN,
  ELEMENT_ORDER,
  type Gan,
  type Ji,
  type Element,
} from './ganji'

export type Calendar = '양력' | '음력'
export type Gender = '남' | '여'

export interface SajuInput {
  year: number
  month: number
  day: number
  hour: number // 0~23
  minute: number
  calendar: Calendar
  isLeapMonth: boolean // 음력 윤달 여부
  unknownTime: boolean
  gender: Gender
}

export interface Pillar {
  label: string // 시주/일주/월주/년주
  ganZhi: string // 한자 두 글자 (예: 庚午)
  gan: Gan
  ji: Ji
  shishenGan: string | null // 천간 십신(한글). 일주는 일간 자신이라 null
  hideGan: string[] // 지장간 (한자)
}

export interface Daeun {
  ganZhi: string
  gan: Gan
  ji: Ji
  element: Element // 대운 천간 오행
  shishen: string // 대운 천간 십신(한글) — 전반 5년
  jiShishen: string // 대운 지지(정기) 십신(한글) — 후반 5년
  startAge: number // 시작 나이(세는나이)
  startYear: number
  endYear: number
}

export interface DaeunInfo {
  direction: '순행' | '역행'
  startText: string // 대운수 (예: "7년 2개월")
  list: Daeun[]
}

export interface SajuResult {
  input: SajuInput
  solarText: string
  lunarText: string
  pillars: {
    hour: Pillar | null // 시간 모름이면 null
    day: Pillar
    month: Pillar
    year: Pillar
  }
  dayMaster: Gan // 일간 (사주의 주인)
  dayMasterElement: Element
  elementCount: Record<Element, number> // 오행 분포 (팔자 기준)
  totalCounted: number
  daeun: DaeunInfo
}

function makePillar(
  label: string,
  ganZhi: string,
  shishenGanHanja: string | null,
  hideGan: string[],
): Pillar {
  const ganHanja = ganZhi.charAt(0)
  const jiHanja = ganZhi.charAt(1)
  const gan = ganOf(ganHanja)!
  const ji = jiOf(jiHanja)!
  return {
    label,
    ganZhi,
    gan,
    ji,
    shishenGan: shishenGanHanja ? shishenKo(shishenGanHanja) : null,
    hideGan,
  }
}

export function computeSaju(input: SajuInput): SajuResult {
  const { year, month, day, calendar, isLeapMonth, unknownTime } = input
  // 시간 모름이면 계산용으로 정오(12시)를 쓰되 시주는 결과에서 제외한다.
  const hour = unknownTime ? 12 : input.hour
  const minute = unknownTime ? 0 : input.minute

  let lunar: Lunar
  let solar: Solar
  if (calendar === '양력') {
    solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
    lunar = solar.getLunar()
  } else {
    const lm = isLeapMonth ? -month : month
    lunar = Lunar.fromYmdHms(year, lm, day, hour, minute, 0)
    solar = lunar.getSolar()
  }

  const ec = lunar.getEightChar()

  const yearPillar = makePillar('년주', ec.getYear(), ec.getYearShiShenGan(), ec.getYearHideGan())
  const monthPillar = makePillar('월주', ec.getMonth(), ec.getMonthShiShenGan(), ec.getMonthHideGan())
  const dayPillar = makePillar('일주', ec.getDay(), null, ec.getDayHideGan())
  const hourPillar = unknownTime
    ? null
    : makePillar('시주', ec.getTime(), ec.getTimeShiShenGan(), ec.getTimeHideGan())

  const dayMaster = dayPillar.gan

  // 오행 분포: 팔자(천간+지지)의 오행을 센다. 시간 모르면 6글자만.
  const elementCount: Record<Element, number> = {
    목: 0, 화: 0, 토: 0, 금: 0, 수: 0,
  }
  const countedPillars = [yearPillar, monthPillar, dayPillar, hourPillar].filter(
    (p): p is Pillar => p !== null,
  )
  for (const p of countedPillars) {
    elementCount[p.gan.element] += 1
    elementCount[p.ji.element] += 1
  }
  const totalCounted = ELEMENT_ORDER.reduce((s, e) => s + elementCount[e], 0)

  const solarText = `${solar.getYear()}년 ${solar.getMonth()}월 ${solar.getDay()}일 (양력)`
  const lunarText = `${lunar.getYear()}년 ${lunar.getMonth() < 0 ? '윤' : ''}${Math.abs(
    lunar.getMonth(),
  )}월 ${lunar.getDay()}일 (음력)`

  // ── 대운(大運) ──
  const genderCode = input.gender === '남' ? 1 : 0
  const yun = ec.getYun(genderCode)
  const daeunList: Daeun[] = yun
    .getDaYun()
    .filter((d) => {
      const gz = d.getGanZhi()
      return gz.length === 2 && ganOf(gz.charAt(0)) && jiOf(gz.charAt(1))
    })
    .map((d) => {
      const gz = d.getGanZhi()
      const gan = ganOf(gz.charAt(0))!
      const ji = jiOf(gz.charAt(1))!
      const jiMainGan = ganOf(ZHI_MAIN_GAN[ji.hanja])
      return {
        ganZhi: gz,
        gan,
        ji,
        element: gan.element,
        shishen: shishenBetween(dayMaster, gan),
        jiShishen: jiMainGan ? shishenBetween(dayMaster, jiMainGan) : '',
        startAge: d.getStartAge(),
        startYear: d.getStartYear(),
        endYear: d.getEndYear(),
      }
    })
  // 방향: 양남·음녀 → 순행 / 음남·양녀 → 역행
  const yearYin = yearPillar.gan.yinYang
  const direction: DaeunInfo['direction'] =
    (yearYin === '양' && input.gender === '남') || (yearYin === '음' && input.gender === '여')
      ? '순행'
      : '역행'

  return {
    input,
    solarText,
    lunarText,
    pillars: {
      hour: hourPillar,
      day: dayPillar,
      month: monthPillar,
      year: yearPillar,
    },
    dayMaster,
    dayMasterElement: dayMaster.element,
    elementCount,
    totalCounted,
    daeun: {
      direction,
      startText: `${yun.getStartYear()}년 ${yun.getStartMonth()}개월`,
      list: daeunList,
    },
  }
}
