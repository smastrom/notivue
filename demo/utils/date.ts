import { DateTime } from 'luxon'

export function toNow(date: number) {
   return DateTime.fromMillis(date).toRelative({ locale: 'en', padding: 60 * 1000 })
}
