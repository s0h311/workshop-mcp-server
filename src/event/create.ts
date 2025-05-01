import client from '~/client'
import { calendar_v3 } from 'googleapis'
import { GaxiosPromise } from 'googleapis-common'

export default async function create({
  summary,
  startDatetime,
  endDatetime,
  description,
  location,
}: {
  summary: string
  startDatetime: string
  endDatetime: string
  description?: string
  location?: string
}): GaxiosPromise<calendar_v3.Schema$Event> {
  const event: calendar_v3.Params$Resource$Events$Insert = {
    calendarId: 'primary',
    requestBody: {
      summary,
      start: { dateTime: startDatetime, timeZone: 'Europe/Berlin' },
      end: { dateTime: endDatetime, timeZone: 'Europe/Berlin' },
    },
  }

  if (description) {
    event.requestBody.description = description
  }

  if (location) {
    event.requestBody.location = description
  }

  return await client.events.insert(event)
}
