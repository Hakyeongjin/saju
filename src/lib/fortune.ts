import { Solar } from 'lunar-typescript'
import {
  ganOf,
  jiOf,
  shishenBetween,
  SHISHEN_GROUP,
  ZHI_MAIN_GAN,
  type Gan,
  type Ji,
  type Element,
} from './ganji'
import { favorOf, SHISHEN_MEANING, type FavorTag, type StrengthAnalysis } from './interpret'

export interface YearFortune {
  year: number
  ganZhi: string
  hangul: string
  shishen: string
  tag: FavorTag
  note: string
}

// 특정 해의 세운(歲運)을 개인 기준으로 계산 (대운 연도별 상세용)
export function sewoonForYear(
  dayMaster: Gan,
  strength: StrengthAnalysis['label'],
  year: number,
): YearFortune {
  const gz = Solar.fromYmd(year, 6, 1).getLunar().getYearInGanZhiByLiChun()
  const gan = ganOf(gz.charAt(0))!
  const ji = jiOf(gz.charAt(1))!
  const shishen = shishenBetween(dayMaster, gan)
  const jiMain = ganOf(ZHI_MAIN_GAN[ji.hanja])
  const jiShishen = jiMain ? shishenBetween(dayMaster, jiMain) : ''
  const favor = favorOf(SHISHEN_GROUP[shishen], strength)
  const jiPart =
    jiShishen && jiShishen !== shishen ? ` 바탕(지지)에는 ‘${jiShishen}’ 기운도 함께 흘러요.` : ''
  return {
    year,
    ganZhi: gz,
    hangul: `${gan.hangul}${ji.hangul}`,
    shishen,
    tag: favor.tag,
    note: `천간에 ‘${shishen}’ 기운이 들어오는 해예요. ${SHISHEN_MEANING[shishen]}${jiPart} ${favor.text}`,
  }
}

export interface FortunePeriod {
  title: string // "올해 세운" / "오늘의 일진"
  when: string // "2026년 · 丙午(병오)"
  gan: Gan
  ji: Ji
  element: Element // 천간 오행 (색상용)
  ganShishen: string
  jiShishen: string
  ganMeaning: string
  jiMeaning: string
  favor: { tag: FavorTag; text: string }
}

export interface Fortune {
  year: FortunePeriod
  today: FortunePeriod
}

function build(
  title: string,
  when: string,
  ganZhi: string,
  dayMaster: Gan,
  strength: StrengthAnalysis['label'],
): FortunePeriod {
  const gan = ganOf(ganZhi.charAt(0))!
  const ji = jiOf(ganZhi.charAt(1))!
  const ganShishen = shishenBetween(dayMaster, gan)
  const jiMain = ganOf(ZHI_MAIN_GAN[ji.hanja])
  const jiShishen = jiMain ? shishenBetween(dayMaster, jiMain) : ''
  return {
    title,
    when,
    gan,
    ji,
    element: gan.element,
    ganShishen,
    jiShishen,
    ganMeaning: SHISHEN_MEANING[ganShishen],
    jiMeaning: jiShishen ? SHISHEN_MEANING[jiShishen] : '',
    favor: favorOf(SHISHEN_GROUP[ganShishen], strength),
  }
}

export function computeFortune(
  dayMaster: Gan,
  strength: StrengthAnalysis['label'],
  now: Date,
): Fortune {
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const d = now.getDate()
  const lunar = Solar.fromYmd(y, m, d).getLunar()

  const yearGz = lunar.getYearInGanZhiByLiChun() // 입춘 기준 세운
  const dayGz = lunar.getDayInGanZhi() // 오늘 일진

  const yg = ganOf(yearGz.charAt(0))!
  const yj = jiOf(yearGz.charAt(1))!
  const dg = ganOf(dayGz.charAt(0))!
  const dj = jiOf(dayGz.charAt(1))!

  return {
    year: build(
      '올해 세운',
      `${y}년 · ${yearGz}(${yg.hangul}${yj.hangul})`,
      yearGz,
      dayMaster,
      strength,
    ),
    today: build(
      '오늘의 일진',
      `${y}년 ${m}월 ${d}일 · ${dayGz}(${dg.hangul}${dj.hangul})`,
      dayGz,
      dayMaster,
      strength,
    ),
  }
}
