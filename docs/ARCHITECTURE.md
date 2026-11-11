# Arsitektur Shoxau

## Alur runtime

`index.js` menjadi composition root. Ia memuat konfigurasi, menyiapkan logging, database, plugin, scheduler, pemantau sumber daya, lalu meminta modul koneksi membuat sesi WhatsApp. `src/connection.js` mengelola autentikasi, event koneksi, reconnect, status grup, dan meneruskan event pesan ke handler.

`src/handler.js` menormalkan pesan masuk, memeriksa konteks chat dan izin, lalu memilih command atau handler otomatis. Plugin dimuat dari direktori kategori `plugins/`; metadata plugin menentukan nama command, alias, kategori, syarat admin/owner/premium/grup, serta batas penggunaan. Helper di `src/lib/` menyediakan formatter, adapter socket, middleware, database, cache, scheduler, perlindungan grup, dan utilitas media.

## Batas data

- `src/data/` dan `data/` menyimpan dataset statis fitur.
- `database/main/` menyimpan state pengguna, grup, pengaturan, statistik, premium, owner, dan data sewa dengan Lowdb JSON.
- `storage/session/` menyimpan credential dan kunci Signal WhatsApp. Perlakukan sebagai rahasia jangka panjang.
- `.env` menyimpan konfigurasi/credential integrasi pribadi dan dikecualikan dari Git.

Jangan menaruh sesi atau data pengguna di Git. Jika membutuhkan backup, enkripsi arsip dan simpan terpisah dari repo.

## Ekstensi

Buat plugin baru dalam folder kategori yang sesuai, gunakan `docs/PLUGIN_GUIDE.md`, dan gunakan konfigurasi/env untuk layanan eksternal. Hindari hardcoded API key dan nomor pribadi. Jalankan `npm test` setelah perubahan core.
