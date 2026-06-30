import { useState, useMemo } from 'react'
import { weekDates, weekLabel, dk, todayStr } from '../utils/dateUtils'

export function useWeek() {
  const [offset, setOffset] = useState(0)

  const dates = useMemo(() => weekDates(offset), [offset])
  const label = useMemo(() => weekLabel(offset), [offset])
  const from = useMemo(() => dk(dates[0]), [dates])
  const to = useMemo(() => dk(dates[4]), [dates])
  const today = todayStr()

  const prev = () => setOffset(o => o - 1)
  const next = () => setOffset(o => o + 1)

  return { offset, dates, label, from, to, today, prev, next }
}
