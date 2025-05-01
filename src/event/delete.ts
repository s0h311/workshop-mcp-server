import client from '~/client'
import { calendar_v3 } from 'googleapis'
import { GaxiosPromise } from 'googleapis-common'

export default async function deleteEvent(id: string): GaxiosPromise<void> {
  const event: calendar_v3.Params$Resource$Events$Delete = {
    calendarId: 'primary',
    eventId: id,
  }

  return await client.events.delete(event)
}
