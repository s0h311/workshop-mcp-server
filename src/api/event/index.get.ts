import list from '~/event/list'

export default defineEventHandler((event) => {
  const queryParams: QueryParams = getQuery(event)

  return list(queryParams)
})

type QueryParams = {
  startDate?: string
  endDate?: string
  max?: string
}
