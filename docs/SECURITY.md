# Catatan keamanan

## Dependency WhatsApp

Commit sumber mengunci dependency `ourin-baileys@9.0.21`. Pada saat pembuatan Shoxau, npm menampilkan nama itu sebagai **security holding package** dan menyatakan paket sebelumnya berisi kode berbahaya serta telah dihapus dari registry ([halaman npm paket](https://www.npmjs.com/package/ourin-baileys)). Shoxau tidak memasang paket tersebut maupun alias lamanya.

Fondasi koneksi memakai paket resmi [`@whiskeysockets/baileys`](https://www.npmjs.com/package/@whiskeysockets/baileys) `7.0.0-rc14`, versi yang npm audit rekomendasikan untuk memperbaiki advisory pada rilis 6 yang diuji. Ini adalah release candidate, jadi uji plugin langsung sebelum produksi dan tinjau [catatan migrasi resmi v7](https://baileys.wiki/migration/v7). Helper papan game menggunakan Sharp `0.35.5` dan membatasi unduhan gambar ke HTTPS, timeout 15 detik, serta 8 MiB.

## Credential dan data runtime

- Nomor owner/pairing, nomor pembayaran, database live, serta sesi dari sumber tidak disalin.
- Dependency `gtts`, `yt-search`, dan helper `bycf` yang tidak dipakai dihapus; pencarian YouTube memakai parser internal dengan batas ukuran/timeout.
- API key yang ditemukan pada source dipindah ke `.env` atau dihapus. Integrasi TopMedia membaca `TOPMEDIA_API_KEY`; key dikosongkan dari source. Jangan commit `.env`.
- Beberapa field `token` pada contoh pesan commerce adalah nilai demo untuk struktur pesan, bukan token autentikasi layanan.
- `storage/session/` menyimpan kunci autentikasi WhatsApp. Jangan bagikan atau commit folder ini.
- Integrasi pembayaran, panel, dan layanan eksternal tidak aktif sampai pemilik mengatur credential sendiri.
- `.gitignore` mengecualikan `.env`, sesi, database runtime, log, dan arsip backup.

## Penggunaan

Baileys bukan API resmi WhatsApp. Tautkan hanya akun yang Anda miliki dan gunakan pada konteks yang berizin. Hormati kebijakan WhatsApp, privasi anggota grup, dan persetujuan penerima; jangan gunakan untuk spam, pengiriman massal tanpa persetujuan, atau pemantauan tersembunyi.

## Pemindaian dependency

Snapshot pada 11 November 2026: `npm audit` dan `npm audit --omit=dev` sama-sama melaporkan **0 advisory**. `package-lock.json` mengunci resolusi dependency dan `package.json` memiliki override untuk sejumlah package transitif; jangan menghapus override tanpa menjalankan ulang tes dan audit. Ini hanya hasil pada tanggal pemindaian—registry dapat menambahkan advisory baru, jadi audit ulang sebelum setiap rilis.
