import client from '~/client'
import { calendar_v3 } from 'googleapis'

export default async function list({
  maxResult,
  startDate,
  endDate,
}: {
  maxResult?: number
  startDate?: string
  endDate?: string
}): Promise<calendar_v3.Schema$Event[]> {
  const options: calendar_v3.Params$Resource$Events$List = {
    calendarId: 'primary',
    maxResults: 50,
    singleEvents: true,
  }

  if (maxResult) {
    options.maxResults = maxResult
  }

  if (startDate) {
    const date = new Date(startDate)
    date.setHours(0, 0, 0)

    options.timeMin = date.toISOString()
  }

  if (endDate) {
    const date = new Date(endDate)
    date.setHours(23, 59, 59)

    options.timeMax = date.toISOString()
  }

  const res = await client.events.list(options)
  return res.data.items
}
