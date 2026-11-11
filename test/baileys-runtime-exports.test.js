import assert from 'node:assert/strict'
import test from 'node:test'

test('Baileys resmi menyediakan export yang diperlukan adapter koneksi', async () => {
  const baileys = await import('@whiskeysockets/baileys')

  for (const exportName of [
    'makeWASocket',
    'useMultiFileAuthState',
    'makeCacheableSignalKeyStore',
    'fetchLatestBaileysVersion',
    'Browsers'
  ]) {
    assert.ok(exportName in baileys, `export wajib tidak tersedia: ${exportName}`)
  }

  assert.equal(typeof baileys.default, 'function')
  assert.equal(typeof baileys.useMultiFileAuthState, 'function')
  assert.equal(typeof baileys.makeCacheableSignalKeyStore, 'function')
  assert.equal(typeof baileys.fetchLatestBaileysVersion, 'function')
  assert.equal(typeof baileys.Browsers.ubuntu, 'function')
})
