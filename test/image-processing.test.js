import assert from 'node:assert/strict'
import sharp from 'sharp'
import test from 'node:test'
import { drawBoard } from '../src/lib/shoxau-game-ulartangga.js'

test('helper papan game menggunakan Sharp dan memiliki kontrak drawBoard', () => {
  assert.equal(typeof sharp, 'function')
  assert.equal(typeof drawBoard, 'function')
})
