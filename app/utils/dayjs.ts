import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export type Dayjs = dayjs.Dayjs

dayjs().utc().utcOffset()

export default dayjs