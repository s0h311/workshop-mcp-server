import client from '~/client'
import { calendar_v3 } from 'googleapis'

export default defineEventHandler(async (event) => {
  const queryParams: QueryParams = getQuery(event)

  const options: calendar_v3.Params$Resource$Events$List = {
    calendarId: 'primary',
    maxResults: 50,
    singleEvents: true,
  }

  if (queryParams.max) {
    options.maxResults = Number(queryParams.max)
  }

  if (queryParams.startDate) {
    options.timeMin = new Date(queryParams.startDate).toISOString()
  }

  if (queryParams.endDate) {
    options.timeMax = new Date(queryParams.endDate).toISOString()
  }

  const res = await client.events.list(options)

  return res.data.items
})

type QueryParams = {
  startDate?: string
  endDate?: string
  max?: string
}
