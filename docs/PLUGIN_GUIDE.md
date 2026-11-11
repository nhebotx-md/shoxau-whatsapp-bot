# Panduan plugin

Simpan satu fitur dalam file JavaScript di direktori kategori yang relevan, misalnya `plugins/fun/halo.js`. Ikuti pola metadata yang dipakai proyek:

```js
const pluginConfig = {
  name: 'halo',
  alias: [],
  category: 'fun',
  description: 'Membalas sapaan sederhana.',
  usage: '.halo',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true
}

async function handler(m, { sock }) {
  await m.reply('Halo dari Shoxau.')
}

export { pluginConfig as config, handler }
```

Repo ini juga memakai plugin dengan export `config` dan `handler`; pertahankan kontrak pada kategori yang sedang Anda ubah. Sebelum membuat plugin, cari pola serupa dalam folder kategori. Gunakan nama file huruf kecil dengan tanda hubung untuk fitur multi-kata, misalnya `cek-cuaca.js`. Hindari membuat command duplikat dan jangan menaruh API key atau nomor pribadi di file.

Pada mode pengembangan, watcher dapat memuat ulang plugin tanpa memulai ulang seluruh sesi. Perubahan pada `src/` tidak otomatis hot reload dengan aman. Uji dengan `npm test` serta pastikan akses owner/admin/premium dan cakupan chat sesuai kebutuhan fitur.
