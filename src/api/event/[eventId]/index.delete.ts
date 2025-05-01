import deleteEvent from '~/event/delete'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'eventId')

  return await deleteEvent(eventId)
})
