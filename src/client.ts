import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { google } from 'googleapis'
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth'
import { authenticate } from '@google-cloud/local-auth'
import { OAuth2Client } from 'google-auth-library'

const cwd = process.cwd()

const tokenJsonPath = join(cwd, 'token.json')
const credentialsJsonPath = join(cwd, 'credentials.json')

if (!existsSync(tokenJsonPath)) {
  writeFileSync(tokenJsonPath, '', { encoding: 'utf-8' })
}

if (!existsSync(credentialsJsonPath)) {
  console.error('credentials.json could not be found')
  process.exit(1)
}

function loadSavedCredentialsIfExist(): JSONClient | null {
  const content = readFileSync(tokenJsonPath, { encoding: 'utf-8' })

  if (!content) {
    return null
  }

  const credentials = JSON.parse(content)
  return google.auth.fromJSON(credentials)
}

function saveCredentials(client: JSONClient | OAuth2Client): void {
  const content = readFileSync(credentialsJsonPath, { encoding: 'utf-8' })
  const keys = JSON.parse(content)

  const key = keys.installed || keys.web

  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })

  writeFileSync(tokenJsonPath, payload, { encoding: 'utf-8' })
}

async function authorize(): Promise<JSONClient | OAuth2Client> {
  let client: JSONClient | OAuth2Client = loadSavedCredentialsIfExist()

  if (client) {
    return client
  }

  client = await authenticate({
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    keyfilePath: credentialsJsonPath,
  })

  if (client.credentials) {
    saveCredentials(client)
  }

  return client
}

// @ts-expect-error
const client = google.calendar({ version: 'v3', auth: await authorize() })

export default client
