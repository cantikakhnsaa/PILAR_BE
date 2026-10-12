# PILAR Backend

Backend aplikasi PILAR untuk menyajikan data tempat PKL, kategori, jurusan, dan role. Aplikasi menggunakan Strapi v5, TypeScript, dan MySQL/MariaDB.

## Persyaratan

- Node.js versi 20 atau yang sesuai dengan `engines` di `package.json`.
- npm.
- MySQL/MariaDB, misalnya melalui XAMPP.
- File konfigurasi lingkungan `.env` yang sesuai.

## Instalasi

```bash
npm install
```

Siapkan database kosong sesuai konfigurasi lokal. Isi `.env` menggunakan nama variabel yang dibaca oleh file konfigurasi database di proyek.

Jangan menyalin atau mengunggah `.env` yang berisi password atau secret ke Git.

## Menjalankan backend

Mode pengembangan:

```bash
npm run develop
```

Mode server:

```bash
npm run start
```

Membuat build admin:

```bash
npm run build
```

Panel admin lokal:

`http://localhost:1337/admin`

REST API lokal:

`http://localhost:1337/api`

## Endpoint utama

| Resource | Endpoint |
|---|---|
| Tempat PKL | `/api/tempat-pkls` |
| Kategori | `/api/kategoris` |
| Jurusan | `/api/jurusans` |
| Role | `/api/roless` |

Dokumentasi field, relasi, contoh query, pagination, dan status verifikasi tersedia di [`docs/api.md`](docs/api.md).

## Pengujian API

Koleksi Postman tersedia di [`postman/PILAR_BE.postman_collection.json`](postman/PILAR_BE.postman_collection.json).

Spesifikasi OpenAPI tersedia di [`docs/openapi.yaml`](docs/openapi.yaml).

Jalankan pengujian terhadap backend lokal yang sedang aktif. Respons yang berhasil pada lingkungan lokal tidak otomatis membuktikan konfigurasi deployment sudah benar.

## Database dan keamanan

- Pastikan layanan MySQL/MariaDB aktif sebelum menjalankan Strapi.
- Pastikan nama database dan konfigurasi koneksi sesuai dengan `.env` dan file konfigurasi proyek.
- Jangan menghapus atau membuat ulang database untuk mengatasi error sebelum membuat backup.
- Tinjau permission Public dan Authenticated sebelum deployment.
- Jangan memasukkan kredensial, token, atau secret ke dokumentasi dan repositori.

## Catatan integrasi

Nama field backend harus dicocokkan dengan kontrak frontend. Perubahan field atau relasi harus melalui diskusi dan review agar tidak merusak integrasi.
