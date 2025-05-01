import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import list from '~/event/list'
import create from '~/event/create'

export default defineNitroPlugin(async (_nitroApp) => {
  const server = new McpServer({
    name: 'calendar-mcp',
    version: '0.0.1',
  })

  server.tool(
    'list-calendar-events',
    {
      maxResult: z.number().optional(),
      startDate: z.string().date().optional(),
      endDate: z.string().date().optional(),
    },
    async ({ maxResult, startDate, endDate }) => {
      const result = list({ maxResult, startDate, endDate })
      const data = JSON.stringify(result)

      return {
        content: [
          {
            type: 'text',
            text: data,
          },
        ],
      }
    }
  )

  server.tool(
    'create-calendar-event',
    {
      summary: z.string(),
      startDatetime: z.string().datetime({ local: true }),
      endDatetime: z.string().datetime({ local: true }),
      description: z.string().optional(),
      location: z.string().optional(),
    },
    async (params) => {
      // @ts-expect-error
      const result = await create(params)
      const data = JSON.stringify(result)

      return {
        content: [
          {
            type: 'text',
            text: data,
          },
        ],
      }
    }
  )

  server.tool(
    'delete-calendar-event',
    {
      eventId: z.string(),
    },
    async (params) => {
      // @ts-expect-error
      const result = await create(params.eventId)
      const data = JSON.stringify(result)

      return {
        content: [
          {
            type: 'text',
            text: data,
          },
        ],
      }
    }
  )

  const transport = new StdioServerTransport()
  await server.connect(transport)
})
