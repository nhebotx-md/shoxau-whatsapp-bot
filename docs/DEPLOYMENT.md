# Aktivasi dan deployment Shoxau

## Persiapan

Gunakan Node.js 22+ dan koneksi internet stabil. Beberapa fitur media membutuhkan FFmpeg. Jalankan perintah dari direktori proyek:

```bash
npm ci
cp .env.example .env
```

Edit `.env` secara lokal; jangan tempel isinya ke chat atau unggah ke repository. Isi `BOT_OWNER_NUMBERS` dan `BOT_PAIRING_NUMBER` dengan nomor WhatsApp yang Anda miliki atau punya izin untuk mengelolanya. Nomor memakai kode negara tanpa `+`, misalnya format `62…`. Bot tidak terhubung sebelum pairing dilakukan.

## Pairing perangkat

Jalankan:

```bash
npm start
```

Mode awal memakai pairing code. Buka WhatsApp pada nomor yang sama, pilih **Perangkat tertaut → Tautkan perangkat → Tautkan dengan nomor telepon**, lalu masukkan kode yang tampil di terminal. Anda juga dapat memakai QR dengan mengatur `BOT_USE_PAIRING_CODE=false` sebelum menjalankan ulang.

Satu nomor hanya boleh dijalankan dari satu proses aktif pada satu waktu. Jangan salin `storage/session/` ke chat, repository, atau host yang tidak dipercaya. Folder itu memuat kredensial dan kunci sesi; buat backup terenkripsi bila diperlukan.

## Menjaga proses berjalan di VPS/Linux

Gunakan supervisor seperti PM2 atau systemd agar proses dimulai ulang saat host reboot. Contoh PM2:

```bash
npm install -g pm2
pm2 start index.js --name shoxau
pm2 save
pm2 logs shoxau
```

Pastikan `.env` berada di direktori proyek dengan permission terbatas. Jangan jalankan dua salinan Shoxau dengan direktori sesi yang sama.

## Android/Termux

Jalankan proyek pada perangkat yang layak dan jaga Termux tetap aktif. Android dapat menghentikan proses latar; matikan optimisasi baterai untuk Termux hanya jika Anda memang mempercayai perangkat tersebut, gunakan koneksi stabil, dan hindari berbagi sesi. Proses di sandbox pengembangan ini tidak dijamin selalu aktif atau 24/7.

## Pemeriksaan

```bash
npm test
npm start
```

Pairing dan uji kirim pesan pertama dilakukan oleh pemilik akun. Jangan gunakan mode uji untuk menghubungi pihak lain tanpa persetujuan mereka.
