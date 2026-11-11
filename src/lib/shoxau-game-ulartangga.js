import sharp from 'sharp'

const BOARD_MAPS = [
  {
    map: 'https://telegra.ph/file/46a0c38104f79cdbfe83f.jpg',
    name: 'Classic',
    snakesLadders: {
      2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 78: 98, 71: 91, 87: 94,
      16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 89: 68, 92: 88, 95: 75, 99: 80
    },
    stabil_x: 20,
    stabil_y: 20
  }
]

const PLAYER_IMAGES = [
  'https://telegra.ph/file/30f92f923fb0484f0e4e0.png',
  'https://telegra.ph/file/6e07b5f30b24baedc7822.png',
  'https://telegra.ph/file/34f47137df0dc9aa9c15a.png',
  'https://telegra.ph/file/860b5df98963a1f14a91c.png'
]

const DICE_STICKERS = [
  'https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/1.webp',
  'https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/2.webp',
  'https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/3.webp',
  'https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/4.webp',
  'https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/5.webp',
  'https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/6.webp'
]

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

async function fetchImageBuffer(imageUrl) {
  const url = new URL(imageUrl)
  if (url.protocol !== 'https:') throw new Error('Hanya URL HTTPS yang diizinkan.')

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ShoxauBot/1.0)' }
  })
  if (!response.ok) throw new Error(`Gagal mengambil gambar (HTTP ${response.status}).`)

  const contentLength = Number(response.headers.get('content-length'))
  if (contentLength > MAX_IMAGE_BYTES) throw new Error('Gambar melebihi batas ukuran.')

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
    throw new Error('Ukuran gambar kosong atau melebihi batas.')
  }
  return buffer
}

/**
 * Gambar papan permainan beserta posisi pemain.
 * @param {string} boardImageURL URL gambar papan HTTPS.
 * @param {number|null} user1 Posisi pemain 1 (1-100) atau null.
 * @param {number|null} user2 Posisi pemain 2 (1-100) atau null.
 * @param {number|null} user3 Posisi pemain 3 (1-100) atau null.
 * @param {number|null} user4 Posisi pemain 4 (1-100) atau null.
 * @param {number} stabil_x Offset horizontal kalibrasi.
 * @param {number} stabil_y Offset vertikal kalibrasi.
 * @returns {Promise<Buffer|null>} PNG buffer atau null bila gagal.
 */
async function drawBoard(
  boardImageURL,
  user1 = null,
  user2 = null,
  user3 = null,
  user4 = null,
  stabil_x = 20,
  stabil_y = 20
) {
  try {
    const boardBuffer = await fetchImageBuffer(boardImageURL)
    const positions = [user1, user2, user3, user4]
      .map((position, index) => ({ position, index }))
      .filter(({ position }) => Number.isInteger(position) && position >= 1 && position <= 100)

    const overlays = []
    for (const player of positions) {
      try {
        const imageBuffer = await fetchImageBuffer(PLAYER_IMAGES[player.index])
        const resized = await sharp(imageBuffer).resize(50, 50).png().toBuffer()
        const row = Math.floor((player.position - 1) / 10)
        const col = row % 2 === 0
          ? (player.position - 1) % 10
          : 9 - ((player.position - 1) % 10)

        overlays.push({
          input: resized,
          left: col * 60 + stabil_x - 4,
          top: (9 - row) * 60 + stabil_y - 4
        })
      } catch (error) {
        console.warn(`[ULARTANGGA] Gagal memuat gambar pemain ${player.index}: ${error.message}`)
      }
    }

    const image = sharp(boardBuffer)
    if (overlays.length) image.composite(overlays)
    return await image.png().toBuffer()
  } catch (error) {
    console.error('[ULARTANGGA] Gagal menggambar papan:', error.message)
    return null
  }
}

function getRandomMap() {
  return BOARD_MAPS[Math.floor(Math.random() * BOARD_MAPS.length)]
}

export { drawBoard, getRandomMap, BOARD_MAPS, PLAYER_IMAGES, DICE_STICKERS }
