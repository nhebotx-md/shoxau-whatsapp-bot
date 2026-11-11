const TTS_ENDPOINT = 'https://translate.google.com/translate_tts'

export async function textToSpeechAudio(text, language = 'id') {
  if (typeof text !== 'string' || !text.trim()) {
    throw new TypeError('Teks untuk TTS wajib diisi.')
  }

  const url = new URL(TTS_ENDPOINT)
  url.searchParams.set('ie', 'UTF-8')
  url.searchParams.set('client', 'tw-ob')
  url.searchParams.set('tl', language)
  url.searchParams.set('q', text.trim())

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ShoxauBot/1.0)',
      Accept: 'audio/mpeg'
    },
    signal: AbortSignal.timeout(15000)
  })

  if (!response.ok) {
    throw new Error(`Provider TTS merespons HTTP ${response.status}.`)
  }

  const audio = Buffer.from(await response.arrayBuffer())
  if (audio.length < 64) {
    throw new Error('Provider TTS mengembalikan audio kosong atau tidak valid.')
  }

  return audio
}
