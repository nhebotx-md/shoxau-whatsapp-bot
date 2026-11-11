import assert from 'node:assert/strict'
import test from 'node:test'
import { parseYouTubeSearchHtml, searchYouTube } from '../src/lib/shoxau-youtube-search.js'

const fixture = `<script>var ytInitialData = {"contents":{"videoRenderer":{"videoId":"video_123","title":{"runs":[{"text":"Contoh Video"}]},"ownerText":{"runs":[{"text":"Kanal Contoh","navigationEndpoint":{"commandMetadata":{"webCommandMetadata":{"url":"/@contoh"}}}}]},"lengthText":{"simpleText":"3:05"},"viewCountText":{"simpleText":"1,234 views"},"publishedTimeText":{"simpleText":"2 days ago"},"thumbnail":{"thumbnails":[{"url":"https://img.youtube.test/thumb.jpg"}]}}}};</script>`

test('parser mengubah renderer video YouTube ke kontrak plugin Shoxau', () => {
  const [video] = parseYouTubeSearchHtml(fixture)
  assert.equal(video.title, 'Contoh Video')
  assert.equal(video.videoId, 'video_123')
  assert.equal(video.url, 'https://www.youtube.com/watch?v=video_123')
  assert.equal(video.author.name, 'Kanal Contoh')
  assert.equal(video.author.url, 'https://www.youtube.com/@contoh')
  assert.equal(video.timestamp, '3:05')
  assert.equal(video.seconds, 185)
  assert.equal(video.views, 1234)
})

test('parser memvalidasi HTML dan pencarian menolak query yang terlalu panjang', async () => {
  assert.throws(() => parseYouTubeSearchHtml('<html></html>'), /tidak mengembalikan data hasil/)
  assert.deepEqual(await searchYouTube('   '), { videos: [] })
  await assert.rejects(searchYouTube('x'.repeat(161)), /maksimal 160 karakter/)
})
