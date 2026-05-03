import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/en'
import 'dayjs/locale/fr'

export default defineNuxtPlugin(() => {
  // Extend dayjs with plugins
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(relativeTime)
  dayjs.extend(customParseFormat)
  dayjs.extend(localizedFormat)

  // Provide dayjs to the app
  return {
    provide: {
      dayjs
    }
  }
})
