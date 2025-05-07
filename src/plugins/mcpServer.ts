import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import list from '~/event/list'
import create from '~/event/create'
import deleteEvent from '~/event/delete'

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
    async (params) => {
      const result = await list(params)
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
      const result = await deleteEvent(params.eventId)
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

  server.prompt('manage-calendar-efficiently', () => {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Du bist dafür verantwortlich meinen Kalender effizient zu verwalten.
            Antworte immer in kurzen und akkuraten Sätzen.
            Berücksichtige, wenn es Sinn ergibt die aktuellen Termine der Woche.
            Es ist besser, wenn du Daten und Zeiten ohne Zeitzone angibst.`,
          },
        },
      ],
    }
  })

  const transport = new StdioServerTransport()
  await server.connect(transport)
})
