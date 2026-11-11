import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('handler memuat Baileys resmi tanpa meminta getBuffer yang tidak tersedia', async () => {
  const source = await readFile(new URL('../src/handler.js', import.meta.url), 'utf8')
  assert.match(source, /await import\('@whiskeysockets\/baileys'\)/)
  assert.doesNotMatch(source, /generateWAMessage, getBuffer, generateWAMessageFromContent/)
})
