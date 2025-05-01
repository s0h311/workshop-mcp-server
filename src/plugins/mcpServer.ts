import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import client from '~/client'
import { calendar_v3 } from 'googleapis'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

export default defineNitroPlugin(async (_nitroApp) => {
  const server = new McpServer({
    name: 'calendar-mcp',
    version: '0.0.1',
  })

  server.tool(
    'list-calendar-events',
    {
      maxResult: z.number().nullable(),
      startDate: z.string().date().nullable(),
      endDate: z.string().date().nullable(),
    },
    // new ResourceTemplate('event://event/{maxResult/{startDate}/{endDate}', { list: undefined }),
    async ({ maxResult, startDate, endDate }) => {
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
      const data = JSON.stringify(res.data.items)

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
