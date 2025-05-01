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
    options.timeMin = new Date(startDate).toISOString()
  }

  if (endDate) {
    options.timeMax = new Date(endDate).toISOString()
  }

  const res = await client.events.list(options)
  return res.data.items
}
