# Integrasi Cloudinary — PILAR Backend

## 1. Tujuan

Cloudinary disiapkan sebagai provider penyimpanan media untuk backend PILAR berbasis Strapi v5. Tujuannya adalah menyediakan penyimpanan media eksternal untuk deployment, tanpa menghapus atau memindahkan media lokal yang sudah ada.

## 2. Konfigurasi

Provider upload diatur melalui `config/plugins.ts`. Kebijakan Content Security Policy di `config/middlewares.ts` mengizinkan pemuatan media dari domain Cloudinary.

Variabel lingkungan yang digunakan:

- `CLOUDINARY_NAME`
- `CLOUDINARY_KEY`
- `CLOUDINARY_SECRET`

Nilai asli wajib disimpan secara lokal pada `.env` atau secret manager lingkungan deployment. Jangan menulis nilai kredensial ke dokumentasi, commit, log, atau laporan.

Template nama variabel tersedia pada `.env.example`. Saat deployment, masukkan ketiga nilai tersebut melalui pengaturan environment Railway. Jangan mengunggah file `.env`.

## 3. Hasil verifikasi

| Pemeriksaan | Status | Keterangan |
|---|---|---|
| Dependensi provider Cloudinary | Terpasang | `@strapi/provider-upload-cloudinary` |
| Build Strapi | Berhasil | `npm run build` selesai dengan exit code 0 |
| Autentikasi Cloudinary | Berhasil | Kredensial diterima oleh Cloudinary |
| Upload langsung melalui SDK | Berhasil | File PNG uji berhasil diunggah |
| Provider melalui endpoint upload Strapi | Belum diverifikasi | Memerlukan pengujian Strapi yang aman |
| Deployment Railway | Belum diverifikasi | Memerlukan konfigurasi environment dan pengujian deployment |

Pengujian SDK secara langsung tidak membuktikan bahwa provider upload Strapi telah berjalan dengan benar.

## 4. Perlindungan database dan media lama

- Jangan menjalankan Strapi terhadap database yang berisi data penting untuk sekadar menguji provider.
- Sebelum pengujian integrasi Strapi, verifikasi backup dan siapkan database uji terpisah yang tidak berisi data produksi.
- Jangan menghapus, memindahkan, atau melakukan migrasi terhadap file di `public/uploads` sebagai bagian dari konfigurasi awal.
- Jangan menghapus database pemulihan, database pengujian, atau file backup.
- Audit relasi media dan kompatibilitas URL harus dilakukan sebelum merencanakan migrasi media lama.

## 5. Langkah berikutnya

1. Verifikasi konfigurasi provider dan environment tanpa menampilkan secret.
2. Siapkan database uji terisolasi setelah backup dan skema diverifikasi.
3. Uji upload melalui endpoint Strapi pada database uji.
4. Verifikasi URL media yang dikembalikan dan akses file dari Cloudinary.
5. Konfigurasikan secret pada Railway dan verifikasi deployment secara terpisah.
6. Catat hasil tes, kendala, dan perubahan melalui GitHub Issue dan pull request.

## 6. Batasan status

Dokumentasi ini mencatat pengujian yang sudah dilakukan. Integrasi provider melalui Strapi dan deployment Railway tidak boleh dinyatakan berhasil sebelum keduanya benar-benar diuji.
