export {}

const workerUrl = process.env.RSS_WORKER_URL ?? 'http://localhost:8787'
const token = process.env.RSS_WORKER_TRIGGER_TOKEN ?? ''
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined

const response = await fetch(`${workerUrl.replace(/\/$/, '')}/trigger`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  },
  body: JSON.stringify({ ...(limit ? { limit } : {}) }),
})

const text = await response.text()
console.log(text)

if (!response.ok) {
  process.exitCode = 1
}
