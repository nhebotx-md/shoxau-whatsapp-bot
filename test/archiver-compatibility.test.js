import assert from 'node:assert/strict'
import archiver from 'archiver'
import { once } from 'node:events'
import test from 'node:test'

test('Archiver menghasilkan arsip ZIP pada versi yang dipin', async () => {
  const archive = archiver('zip', { zlib: { level: 1 } })
  const chunks = []
  archive.on('data', (chunk) => chunks.push(chunk))
  const ended = once(archive, 'end')

  archive.append('Shoxau backup probe', { name: 'probe.txt' })
  await archive.finalize()
  await ended

  const zip = Buffer.concat(chunks)
  assert.equal(zip.subarray(0, 2).toString(), 'PK')
  assert.ok(zip.length > 50)
})
