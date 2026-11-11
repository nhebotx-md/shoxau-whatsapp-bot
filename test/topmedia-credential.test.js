import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const sourcePath = fileURLToPath(new URL('../src/scraper/topmedia.js', import.meta.url))
const source = await readFile(sourcePath, 'utf8')

test('TopMedia credential is read from environment, not embedded in source', () => {
  assert.match(source, /process\.env\.TOPMEDIA_API_KEY/)
  assert.doesNotMatch(source, /^\s*const\s+API_KEY\s*=\s*["'][^"']+["']/m)
})

test('TopMedia integration fails clearly when its optional key is missing', async () => {
  const previous = process.env.TOPMEDIA_API_KEY
  delete process.env.TOPMEDIA_API_KEY
  try {
    const { default: generateCustomTTS } = await import('../src/scraper/topmedia.js')
    await assert.rejects(generateCustomTTS(null, 'test'), /TOPMEDIA_API_KEY belum diatur/)
  } finally {
    if (previous !== undefined) process.env.TOPMEDIA_API_KEY = previous
  }
})
