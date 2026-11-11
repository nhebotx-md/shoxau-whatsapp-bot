# Kontribusi ke Shoxau

Terima kasih sudah ingin mengembangkan Shoxau. Kontribusi kecil, dokumentasi, laporan bug, dan plugin baru dipersilakan selama menghormati lisensi sumber, privasi pengguna, dan aturan WhatsApp.

## Sebelum mulai

1. Baca [README](README.md), [arsitektur](docs/ARCHITECTURE.md), [panduan plugin](docs/PLUGIN_GUIDE.md), dan [catatan keamanan](docs/SECURITY.md).
2. Buat fork repo, lalu clone fork milik Anda. Jangan bekerja langsung pada branch `main`.
3. Gunakan Node.js 22 atau lebih baru dan instal dependency dengan `npm ci`.
4. Jangan menautkan akun WhatsApp orang lain untuk pengujian. Gunakan akun dan grup yang Anda miliki atau punya izin untuk kelola.

## Alur perubahan

Buat branch terpisah untuk satu tujuan, misalnya `feature/menu-baru` atau `fix/pairing-timeout`. Perubahan fitur bot sebaiknya menjadi plugin baru di `plugins/<kategori>/` jika tidak perlu mengubah core. Ikuti kontrak `config` dan `handler` di panduan plugin serta gunakan helper yang sudah ada sebelum menambah abstraksi baru.

Jalankan tes sebelum mengirim pull request:

```bash
npm ci
npm test
```

Jika perubahan memerlukan API key atau layanan pihak ketiga, jelaskan nama variabel environment, layanan yang dibutuhkan, dan perilaku saat key kosong. Jangan menaruh secret sungguhan dalam contoh. Tes otomatis sebaiknya tidak mengirim pesan WhatsApp atau membuat panggilan berbayar.

## Batas keamanan

Jangan pernah commit `.env`, `storage/session/`, kredensial, token, data anggota/grup, nomor privat, database runtime, atau backup. Jangan mengaktifkan pembayaran, panel hosting, auto-message, atau tindakan destruktif tanpa pemeriksaan izin dan persetujuan yang sesuai. Jangan menambahkan fitur spam, pengumpulan data tersembunyi, atau pengiriman pesan massal tanpa persetujuan penerima.

Jika menemukan kerentanan, jangan memublikasikan token, sesi, atau langkah eksploitasi yang dapat disalahgunakan dalam issue publik. Sampaikan laporan secara privat kepada pemilik/pengelola repo melalui kanal yang disediakan GitHub.

## Pull request

Satu pull request sebaiknya menyelesaikan satu masalah. Sertakan ringkasan tujuan, perubahan perilaku, langkah uji, variabel konfigurasi baru (bila ada), serta tangkapan error yang sudah disamarkan. Jangan sertakan `.env`, JID, pairing code, isi sesi, atau log yang memuat identitas pengguna.

Dengan mengirim kontribusi, Anda menyatakan memiliki hak untuk membagikan perubahan tersebut dan bersedia kontribusi Anda didistribusikan menurut lisensi proyek. Kode upstream serta dependency tetap tunduk pada lisensinya masing-masing; lihat [NOTICE](NOTICE.md) dan [LICENSE](LICENSE).
