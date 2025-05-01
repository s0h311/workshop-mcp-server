import { z } from 'zod'
import create from '~/event/create'

export default defineEventHandler(async (event) => {
  const { success, error, data } = await readValidatedBody(event, schema.safeParse)

  if (!success) {
    setResponseStatus(event, 400)
    return error
  }

  // @ts-expect-error
  return await create(data)
})

const schema = z.object({
  summary: z.string(),
  startDatetime: z.string().datetime({ local: true }),
  endDatetime: z.string().datetime({ local: true }),
  description: z.string().optional(),
  location: z.string().optional(),
})
