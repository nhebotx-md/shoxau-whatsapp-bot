import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const testDir = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.join(testDir, '../package.json'), 'utf8')
)

test('mengunci Baileys resmi dan tidak membawa dependency Ourin yang ditarik', () => {
  assert.equal(packageJson.dependencies['@whiskeysockets/baileys'], '7.0.0-rc14')
  assert.equal(packageJson.dependencies['ourin-baileys'], undefined)
  assert.equal(packageJson.dependencies.Shoxau, undefined)
  assert.equal(packageJson.dependencies.jimp, undefined)
  assert.equal(packageJson.dependencies.sharp, '0.35.5')
  assert.equal(packageJson.dependencies['yt-search'], undefined)
  assert.equal(packageJson.dependencies.bycf, undefined)
  assert.equal(packageJson.dependencies.archiver, '7.0.1')
})
