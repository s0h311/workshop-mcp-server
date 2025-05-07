import client from '~/client'

export default defineEventHandler(async (_event) => {
  const res = await client.calendarList.list()

  return res.data.items
})
