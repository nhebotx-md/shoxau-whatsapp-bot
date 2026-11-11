import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoots = ['src', 'plugins', 'case']

function javascriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return javascriptFiles(entryPath)
    return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : []
  })
}

test('source runtime tidak mengimpor package Ourin atau alias ShooNhee yang ditarik', () => {
  for (const relativeRoot of sourceRoots) {
    const root = path.join(projectRoot, relativeRoot)
    for (const file of javascriptFiles(root)) {
      const source = fs.readFileSync(file, 'utf8')
      assert.doesNotMatch(source, /(?:from\s*|import\s*\()\s*['"](?:ourin-baileys|ShooNhee)['"]/, file)
    }
  }
})
