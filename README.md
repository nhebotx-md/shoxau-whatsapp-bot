# Shoxau WhatsApp Bot

Shoxau adalah base bot WhatsApp Multi-Device berbasis Node.js dengan core modular dan **749 file plugin** yang diadaptasi dari ShooNhee MD. Folder, konfigurasi, dan panduan disusun agar mudah dipelajari serta dikembangkan. Lihat [katalog fitur](docs/FEATURES.md), [arsitektur](docs/ARCHITECTURE.md), [panduan plugin](docs/PLUGIN_GUIDE.md), dan [panduan kontribusi](CONTRIBUTING.md).

> Bot tidak otomatis online hanya dengan mengunduh repo. Setiap pengguna perlu menyiapkan host, membuat `.env` sendiri, lalu menautkan akun WhatsApp miliknya. Jangan pernah membagikan `storage/session/` atau isi `.env`.

## Fitur dan status

- 749 file plugin yang dikelompokkan ke dalam direktori kategori di `plugins/`.
- Runtime Node.js ES Modules, routing command, konfigurasi, database runtime lokal, dan helper media.
- Contoh konfigurasi aman tersedia pada [`.env.example`](.env.example); semua secret dan data akun sumber telah dibersihkan.
- Tes bawaan: `npm test`.

Koneksi memakai Baileys, library pihak ketiga untuk WhatsApp Web—bukan API resmi WhatsApp. Versi Baileys yang dipin adalah `7.0.0-rc14` (release candidate), sehingga lakukan uji pada akun dan grup yang memang berhak Anda kelola. Sebagian plugin memanggil layanan/API pihak ketiga; fitur tertentu memerlukan API key milik Anda dan dapat berubah bila layanan tersebut berubah.

## Persyaratan

Untuk cara yang dijelaskan di bawah, siapkan ponsel Android dengan ruang penyimpanan dan koneksi internet yang cukup, aplikasi Termux dari sumber resmi, serta akun WhatsApp milik Anda. Shoxau memerlukan **Node.js 22 atau yang lebih baru**. Beberapa fitur audio/video juga menggunakan FFmpeg.

Tutorial ini memakai Ubuntu 24.04 di dalam Termux melalui PRoot-Distro. Ini adalah lingkungan Linux rootless, bukan virtual machine penuh dan bukan akses root Android. PRoot-Distro mendokumentasikan perintah instalasi/login Ubuntu serta batasan layanan sistem seperti `systemd` di [repo resminya](https://github.com/termux/proot-distro).

## Instalasi Termux → Ubuntu

### 1. Pasang Termux dari satu sumber resmi

Pasang Termux dari [F-Droid](https://f-droid.org/en/packages/com.termux/) atau [GitHub Releases resmi Termux](https://github.com/termux/termux-app/releases). Jika memakai Termux:API atau Termux:Boot, pasang add-on itu dari **sumber tanda tangan yang sama** dengan aplikasi Termux. Jangan mencampur APK Termux dari sumber yang berbeda; petunjuk resmi menjelaskan perbedaan tanda tangan pada [halaman instalasi Termux](https://github.com/termux/termux-app#installation).

Buka Termux, lalu perbarui paket dan pasang pengelola distro:

```bash
pkg update -y && pkg upgrade -y
pkg install -y proot-distro
```

Jika repositori Termux sedang bermasalah, jalankan `termux-change-repo`, pilih mirror yang tersedia, lalu ulangi `pkg update`.

### 2. Instal dan buka Ubuntu 24.04

Jalankan perintah ini **di Termux**, bukan di shell Ubuntu:

```bash
proot-distro install ubuntu:24.04
proot-distro login ubuntu
```

Perintah pertama mengunduh root filesystem Ubuntu ke penyimpanan internal Termux. Perintah kedua membuka shell Ubuntu. Saat login awal, `whoami` biasanya menampilkan `root`; itu adalah identitas root semu di dalam PRoot, bukan root pada Android. Tidak perlu memakai `sudo` di langkah Ubuntu berikut.

Untuk masuk kembali ke Ubuntu pada hari berikutnya, cukup buka Termux lalu jalankan:

```bash
proot-distro login ubuntu
```

### 3. Pasang paket Ubuntu dan Node.js 22

Semua perintah pada bagian ini dijalankan **di dalam shell Ubuntu**:

```bash
apt update
apt install -y ca-certificates curl git python3 build-essential ffmpeg
```

Pasang Node.js 22 dari repositori NodeSource untuk Ubuntu/Debian. Instruksi ini mengikuti [dokumentasi instalasi Node.js 22 NodeSource](https://github.com/nodesource/distributions/blob/master/DEV_README.md):

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
bash /tmp/nodesource_setup.sh
apt install -y nodejs
rm -f /tmp/nodesource_setup.sh
```

Pastikan versinya benar:

```bash
node --version
npm --version
```

`node --version` harus menampilkan `v22.x.x` atau lebih baru. Jika tetap menampilkan Node versi lama, periksa apakah perintah tadi dijalankan di Ubuntu PRoot dan apakah instalasi NodeSource selesai tanpa error.

## 4. Unduh Shoxau dan instal dependency

Clone repo publik Shoxau dari akun GitHub `nhebotx-md`:

```bash
cd /root
git clone https://github.com/nhebotx-md/shoxau-whatsapp-bot.git
cd shoxau-whatsapp-bot
npm ci
```

`npm ci` memasang dependency persis dari `package-lock.json`. Instalasi pertama dapat memerlukan waktu dan ruang penyimpanan cukup besar, terutama di ponsel.

Jalankan tes sebelum menghubungkan WhatsApp:

```bash
npm test
```

Tes yang gagal bukan sesuatu yang perlu diabaikan. Catat error lengkapnya, cek versi Node, koneksi internet, dan ulangi `npm ci` setelah penyebabnya diperbaiki.

### 5. Isi konfigurasi privat

Buat file `.env` dari template, lalu buka dengan editor:

```bash
cp .env.example .env
nano .env
```

Untuk penggunaan dasar, isi setidaknya dua baris ini. Ganti angka contoh dengan nomor Anda sendiri dalam format internasional, tanpa spasi dan tanpa tanda `+`:

```dotenv
BOT_OWNER_NUMBERS=6281234567890
BOT_PAIRING_NUMBER=6281234567890
BOT_USE_PAIRING_CODE=true
```

Simpan di nano dengan `Ctrl+O`, `Enter`, lalu keluar dengan `Ctrl+X`. Lindungi file tersebut:

```bash
chmod 600 .env
```

`BOT_OWNER_NUMBERS` menentukan nomor yang memperoleh hak owner. `BOT_PAIRING_NUMBER` adalah nomor WhatsApp yang akan ditautkan. Nomor pada dua variabel itu boleh sama. Isi `TOPMEDIA_API_KEY` hanya jika Anda sendiri mempunyai key TopMedia dan ingin memakai fitur TTS terkait; API key lain juga opsional sesuai plugin. Jangan menaruh key pada kode sumber, issue, screenshot, atau commit Git.

File `.env`, `storage/`, database runtime, dan file sesi dikecualikan dari Git melalui `.gitignore`; pengecualian itu tetap harus dipertahankan saat Anda mengembangkan bot.

### 6. Tautkan perangkat WhatsApp dan jalankan bot

Di shell Ubuntu, mulai bot:

```bash
npm start
```

Saat kode pairing muncul di terminal, buka WhatsApp pada **nomor yang sama** dan pilih **Perangkat tertaut → Tautkan perangkat → Tautkan dengan nomor telepon**. Masukkan kode yang tampil di terminal ke WhatsApp. Nama menu dapat sedikit berbeda menurut versi aplikasi.

Setelah koneksi berhasil, bot akan menyimpan kredensial di `storage/session/` dan menggunakannya kembali saat restart. Folder itu berisi kunci sesi yang dapat memberi akses ke akun tertaut. Jangan unggah, kirim, atau masukkan folder tersebut ke repo publik. Untuk menghentikan proses di foreground, tekan `Ctrl+C`.

Jika ingin memakai QR, ubah `BOT_USE_PAIRING_CODE=false` di `.env`, jalankan ulang `npm start`, lalu pindai QR melalui menu Perangkat tertaut. Jangan menjalankan dua salinan bot dengan sesi yang sama secara bersamaan.

## Menjaga bot tetap berjalan di Termux

Android dapat menangguhkan atau menghentikan aplikasi latar. Mode hemat baterai, jaringan yang tidak stabil, suhu perangkat, dan batas proses Android dapat membuat bot offline. Termux sendiri juga memperingatkan bahwa Android dapat menghentikan proses latar pada versi tertentu di [README resminya](https://github.com/termux/termux-app). Termux pada ponsel cocok untuk uji coba atau pemakaian ringan; uptime 24/7 lebih andal di VPS.

### Menjalankan dengan PM2

Di Ubuntu PRoot, setelah masuk ke folder proyek, pasang PM2 dan daftarkan bot:

```bash
npm install --global pm2
pm2 start index.js --name shoxau
pm2 save
pm2 status
pm2 logs shoxau
```

Perintah yang sering dipakai:

```bash
pm2 restart shoxau
pm2 stop shoxau
pm2 delete shoxau
```

PRoot bukan init system Linux penuh. Jangan menjalankan `pm2 startup` atau mengandalkan `systemd` di dalam Ubuntu PRoot. PM2 menjaga proses saat sesi PRoot hidup, tetapi tidak dapat mencegah Android menutup Termux.

### Opsional: mulai otomatis setelah ponsel reboot

Cara ini memerlukan aplikasi **Termux:Boot** dari sumber tanda tangan yang sama dengan Termux. Buka Termux:Boot sekali setelah menginstalnya, seperti dijelaskan pada [panduan resmi Termux:Boot](https://github.com/termux/termux-boot). Untuk wake lock, pasang Termux:API beserta aplikasinya dari sumber yang sama; dukungan API tersedia pada [repo Termux:API](https://github.com/termux/termux-api).

Di Termux (shell luar, bukan Ubuntu), pasang paket API dan buat folder boot:

```bash
pkg install -y termux-api
mkdir -p ~/.termux/boot
```

Pastikan PM2 sudah berjalan sekali di Ubuntu dan `pm2 save` sudah dilakukan. Kemudian buat skrip boot di Termux:

```bash
cat > ~/.termux/boot/50-shoxau <<'EOF'
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
proot-distro login ubuntu -- bash -lc 'cd /root/shoxau-whatsapp-bot && pm2 resurrect'
EOF
chmod +x ~/.termux/boot/50-shoxau
```

Ganti path `/root/shoxau-whatsapp-bot` jika nama folder clone Anda berbeda. Uji skrip dengan menjalankan isinya secara manual sebelum mengandalkan boot otomatis. Wake lock membantu mencegah perangkat tidur, tetapi bukan jaminan uptime; pengaturan baterai pabrikan tetap dapat menghentikan Termux.

Untuk melepas wake lock saat tidak lagi diperlukan, jalankan perintah `termux-wake-unlock` di Termux.

## Memperbarui Shoxau

Masuk ke folder repo di Ubuntu PRoot dan jalankan:

```bash
cd /root/shoxau-whatsapp-bot
git pull --ff-only
npm ci
npm test
pm2 restart shoxau --update-env
```

Jika menjalankan bot di foreground, hentikan dengan `Ctrl+C`, lakukan pembaruan, lalu jalankan kembali `npm start`. Sebelum pembaruan besar, cadangkan `storage/session/` secara privat dan terenkripsi; jangan simpan backup itu di repo.

## Struktur proyek

```text
shoxau-whatsapp-bot/
├── assets/              # Aset media dan font
├── case/                # Handler command tambahan
├── config.js            # Konfigurasi runtime dan pemeriksaan role
├── data/                # Dataset fitur
├── database/            # Data runtime lokal; tidak dibagikan
├── docs/                # Arsitektur, katalog fitur, keamanan, deployment
├── plugins/              # Plugin per kategori
├── scripts/              # Skrip pemeriksaan/integrasi
├── src/
│   ├── connection.js    # Koneksi WhatsApp dan reconnect
│   ├── handler.js       # Routing pesan dan middleware
│   ├── handlerbutton.js # Handler interaksi tombol
│   ├── data/            # Dataset tambahan
│   └── lib/             # Database, logger, adapter, scheduler, helper
├── storage/session/     # Kredensial privat; jangan commit
├── .env.example         # Template aman untuk konfigurasi
├── index.js             # Entry point
└── package.json         # Dependency dan perintah npm
```

Database, pengguna, grup, kredensial, dan sesi dari repo sumber tidak disalin. Database Shoxau diinisialisasi lokal saat runtime.

## Mengembangkan plugin

1. Buat file `.js` di kategori yang sesuai di `plugins/<kategori>/`.
2. Gunakan pola `config` dan `handler` pada [panduan plugin](docs/PLUGIN_GUIDE.md).
3. Periksa izin owner/admin/grup sebelum mengeksekusi tindakan sensitif.
4. Jangan menaruh token, nomor privat, sesi, atau database pengguna di plugin.
5. Jalankan `npm test` dan pemeriksaan yang relevan sebelum membuat pull request.

Untuk mengembangkan core, baca [arsitektur](docs/ARCHITECTURE.md). Mohon baca [CONTRIBUTING.md](CONTRIBUTING.md) sebelum mengirim perubahan.

## Pemecahan masalah

- **`node: command not found` atau versi di bawah 22:** masuk lagi ke Ubuntu PRoot, verifikasi dengan `which node` dan `node --version`, lalu ulangi pemasangan NodeSource.
- **`npm ci` gagal atau proses ditutup Android:** pastikan ruang kosong cukup, jaringan stabil, tutup aplikasi berat, lalu jalankan ulang `npm ci`. Build native bisa lebih lambat di ponsel.
- **Termux melaporkan mirror/repository bermasalah:** jalankan `termux-change-repo` dari shell Termux, pilih mirror lain, lalu ulangi `pkg update`.
- **Bot langsung berhenti atau PM2 tidak menunjukkan proses:** jalankan `pm2 status` dan `pm2 logs shoxau`; pastikan `pm2 start` dijalankan dari direktori repo Ubuntu yang benar.
- **Pairing gagal:** pastikan nomor tanpa `+`, gunakan akun yang sama dengan `BOT_PAIRING_NUMBER`, periksa koneksi internet, dan pastikan tidak ada proses bot lain yang sedang memakai sesi.
- **Fitur tertentu membalas error API:** periksa apakah plugin memerlukan API key di `.env` dan apakah layanan tersebut masih tersedia. Integrasi opsional tidak berarti kredensial sudah disertakan.
- **Fitur audio/video gagal:** di Ubuntu jalankan `ffmpeg -version`; jika tidak ditemukan, pasang `ffmpeg` melalui `apt`.

## Keamanan, atribusi, dan lisensi

Gunakan bot hanya pada akun/grup yang Anda berhak kelola. Jangan mengirim spam atau pesan massal tanpa persetujuan. Jangan publikasikan `.env`, token, database pribadi, atau `storage/session/`. Koneksi memakai library pihak ketiga dan bukan API resmi WhatsApp.

Shoxau adalah adaptasi dari [nhebotx-md/ShooNhee-md](https://github.com/nhebotx-md/ShooNhee-md). Atribusi, commit dasar, dan pernyataan lisensi ISC upstream dicatat di [`NOTICE.md`](NOTICE.md); teks lisensi tersedia di [`LICENSE`](LICENSE). Dependency dan aset pihak ketiga tetap tunduk pada lisensi masing-masing. Baca [catatan keamanan](docs/SECURITY.md) sebelum produksi.
