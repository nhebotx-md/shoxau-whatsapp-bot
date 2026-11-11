const SEARCH_ENDPOINT = 'https://www.youtube.com/results'
const MAX_HTML_BYTES = 4 * 1024 * 1024
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

function extractInitialData(html) {
  const marker = /(?:var\s+)?ytInitialData\s*=\s*/.exec(html)
  if (!marker) throw new Error('YouTube tidak mengembalikan data hasil yang dikenali.')

  let start = marker.index + marker[0].length
  while (html[start] && html[start] !== '{') start += 1
  if (!html[start]) throw new Error('Data hasil YouTube tidak lengkap.')

  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < html.length; index += 1) {
    const char = html[index]
    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }

    if (char === '"') inString = true
    else if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) return JSON.parse(html.slice(start, index + 1))
    }
  }

  throw new Error('Data hasil YouTube tidak lengkap.')
}

function textOf(value) {
  if (!value) return ''
  if (typeof value.simpleText === 'string') return value.simpleText
  if (Array.isArray(value.runs)) return value.runs.map((run) => run.text || '').join('')
  return ''
}

function durationToSeconds(timestamp) {
  if (!timestamp) return 0
  const parts = timestamp.split(':').map(Number)
  if (!parts.length || parts.some((part) => !Number.isFinite(part))) return 0
  return parts.reduce((seconds, part) => seconds * 60 + part, 0)
}

function parseViewCount(viewText) {
  const match = String(viewText || '').match(/([\d,.]+)\s*([KMB])?/i)
  if (!match) return 0
  const value = Number.parseFloat(match[1].replace(/,/g, ''))
  if (!Number.isFinite(value)) return 0
  const multiplier = { K: 1e3, M: 1e6, B: 1e9 }[match[2]?.toUpperCase()] || 1
  return Math.round(value * multiplier)
}

function collectVideoRenderers(node, output, seen) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) collectVideoRenderers(item, output, seen)
    return
  }

  if (node.videoRenderer?.videoId) {
    const video = node.videoRenderer
    const id = video.videoId
    if (!seen.has(id)) {
      seen.add(id)
      const title = textOf(video.title)
      const authorRun = video.ownerText?.runs?.[0] || video.longBylineText?.runs?.[0]
      const duration = textOf(video.lengthText) || textOf(video.thumbnailOverlays?.[0]?.thumbnailOverlayTimeStatusRenderer?.text)
      let thumbnail = video.thumbnail?.thumbnails?.at(-1)?.url || ''
      if (thumbnail.startsWith('//')) thumbnail = `https:${thumbnail}`
      const authorPath = authorRun?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url || ''

      output.push({
        videoId: id,
        title,
        url: `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`,
        author: {
          name: authorRun?.text || 'Unknown',
          url: authorPath.startsWith('/') ? `https://www.youtube.com${authorPath}` : authorPath
        },
        duration,
        timestamp: duration,
        seconds: durationToSeconds(duration),
        ago: textOf(video.publishedTimeText),
        views: parseViewCount(textOf(video.viewCountText)),
        thumbnail
      })
    }
  }

  for (const value of Object.values(node)) collectVideoRenderers(value, output, seen)
}

export function parseYouTubeSearchHtml(html, limit = 10) {
  if (typeof html !== 'string' || html.length > MAX_HTML_BYTES) {
    throw new TypeError('Respons pencarian YouTube kosong atau melebihi batas ukuran.')
  }
  const initialData = extractInitialData(html)
  const videos = []
  collectVideoRenderers(initialData, videos, new Set())
  return videos.slice(0, Math.max(1, Math.min(Number(limit) || 10, 20)))
}

async function readBoundedText(response) {
  const declaredBytes = Number(response.headers.get('content-length'))
  if (declaredBytes > MAX_HTML_BYTES) throw new Error('Respons pencarian YouTube terlalu besar.')
  if (!response.body) throw new Error('Respons pencarian YouTube kosong.')

  const reader = response.body.getReader()
  const chunks = []
  let totalBytes = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    totalBytes += value.byteLength
    if (totalBytes > MAX_HTML_BYTES) {
      await reader.cancel()
      throw new Error('Respons pencarian YouTube terlalu besar.')
    }
    chunks.push(Buffer.from(value))
  }
  return Buffer.concat(chunks, totalBytes).toString('utf8')
}

export async function searchYouTube(query, { limit = 10 } = {}) {
  const normalizedQuery = String(query || '').trim()
  if (!normalizedQuery) return { videos: [] }
  if (normalizedQuery.length > 160) throw new RangeError('Query pencarian maksimal 160 karakter.')

  const url = new URL(SEARCH_ENDPOINT)
  url.searchParams.set('search_query', normalizedQuery)
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml'
    },
    signal: AbortSignal.timeout(15000)
  })
  if (!response.ok) throw new Error(`YouTube merespons HTTP ${response.status}.`)

  const html = await readBoundedText(response)
  return { videos: parseYouTubeSearchHtml(html, limit) }
}
