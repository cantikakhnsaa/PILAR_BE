# Dokumentasi API Backend PILAR

**Status:** Dokumentasi backend berdasarkan skema dan respons API lokal yang telah diperiksa. Kontrak integrasi final tetap perlu disepakati dengan frontend.

## 1. Lingkungan

- Base URL pengembangan: `http://localhost:1337`
- Prefix REST API: `/api`
- CMS: Strapi v5
- Database: MySQL/MariaDB
- Format respons: JSON
- Identitas dokumen Strapi v5: `documentId`

Endpoint lokal bukan otomatis URL deployment. Gunakan URL backend sesuai lingkungan masing-masing.

## 2. Daftar endpoint

| Kebutuhan | Method | Endpoint |
|---|---|---|
| Daftar Tempat PKL | GET | `/api/tempat-pkls` |
| Detail Tempat PKL | GET | `/api/tempat-pkls/:documentId` |
| Daftar kategori | GET | `/api/kategoris` |
| Detail kategori | GET | `/api/kategoris/:documentId` |
| Daftar jurusan | GET | `/api/jurusans` |
| Detail jurusan | GET | `/api/jurusans/:documentId` |
| Daftar role | GET | `/api/roless` |
| Detail role | GET | `/api/roless/:documentId` |

Nama endpoint mengikuti plural name yang terdaftar di backend. Endpoint role yang terverifikasi adalah `/api/roless`, bukan `/api/roles`.

Endpoint detail menggunakan `documentId` Strapi v5, bukan mengasumsikan ID numerik.

## 3. Field Tempat PKL

| Field | Tipe | Ketentuan |
|---|---|---|
| `nama_tempat` | string | Wajib |
| `slug` | UID/string | Wajib, target `nama_tempat` |
| `deskripsi` | text | Wajib |
| `card_description` | text | Wajib |
| `kuota` | integer | Wajib |
| `lokasi_utama` | text | Wajib |
| `link_maps` | string | Opsional |
| `telepon` | string | Wajib |
| `email` | email | Opsional |
| `website` | string | Wajib |
| `logo` | media gambar tunggal | Wajib |
| `foto_detail` | media gambar tunggal | Opsional |
| `kategori` | relasi many-to-many | Kategori |
| `jurusans` | relasi many-to-many | Jurusan |
| `roles` | relasi many-to-many | Role |
| `cabang_list` | komponen berulang | Opsional |
| `kegiatan_pkl` | blocks | Opsional |

Strapi juga dapat mengembalikan `id`, `documentId`, `createdAt`, `updatedAt`, dan `publishedAt`.

## 4. Field master data

Kategori, Jurusan, dan Role masing-masing memiliki:

- `nama`: string, wajib, unik.
- `slug`: UID, wajib.
- Metadata Strapi seperti `id`, `documentId`, `createdAt`, `updatedAt`, dan `publishedAt`.

Nama field untuk relasi Tempat PKL adalah `kategori`, `jurusans`, dan `roles`. Ketiganya berbentuk relasi many-to-many.

## 5. Contoh request

### Daftar Tempat PKL dengan relasi dan gambar

```http
GET /api/tempat-pkls?pagination[page]=1&pagination[pageSize]=9&populate[logo]=true&populate[foto_detail]=true&populate[kategori]=true&populate[jurusans]=true&populate[roles]=true&populate[cabang_list]=true
```

### Detail Tempat PKL

```http
GET /api/tempat-pkls/:documentId?populate[logo]=true&populate[foto_detail]=true&populate[kategori]=true&populate[jurusans]=true&populate[roles]=true&populate[cabang_list]=true
```

Ganti `:documentId` dengan nilai `documentId` dari respons daftar.

### Pencarian nama

```http
GET /api/tempat-pkls?filters[nama_tempat][$containsi]=sawala
```

### Filter kategori

```http
GET /api/tempat-pkls?filters[kategori][slug][$eq]=pemerintahan-and-pelayanan-publik&populate[kategori]=true
```

### Filter jurusan

```http
GET /api/tempat-pkls?filters[jurusans][slug][$eq]=pplg&populate[jurusans]=true
```

### Filter role

```http
GET /api/tempat-pkls?filters[roles][slug][$eq]=backend&populate[roles]=true
```

### Pagination dan sorting

```http
GET /api/tempat-pkls?pagination[page]=1&pagination[pageSize]=9&sort=nama_tempat:asc
```

Contoh filter di atas mengikuti nama field skema. Setiap variasi filter perlu diuji di lingkungan yang dipakai frontend sebelum dinyatakan lulus integrasi. Query yang memakai tanda kurung siku dapat di-URL-encode oleh klien HTTP.

## 6. Bentuk respons

Respons daftar umumnya memiliki bentuk berikut:

```json
{
  "data": [
    {
      "id": 115,
      "documentId": "contoh-document-id",
      "nama_tempat": "RSUD Umar Wirahadikusuma",
      "slug": "rsud-umar-wirahadikusuma",
      "deskripsi": "Deskripsi tempat PKL",
      "card_description": "Ringkasan untuk kartu",
      "kuota": 10,
      "lokasi_utama": "Alamat utama",
      "link_maps": "https://maps.google.com/",
      "telepon": "0261201021",
      "email": "contoh@example.com",
      "website": "https://example.com",
      "logo": {
        "url": "/uploads/contoh.jpeg",
        "formats": {
          "small": {
            "url": "/uploads/small_contoh.jpeg"
          }
        }
      },
      "foto_detail": null,
      "kategori": [],
      "jurusans": [],
      "roles": [],
      "cabang_list": [],
      "kegiatan_pkl": [],
      "publishedAt": "2026-10-10T07:48:15.751Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 9,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

Contoh tersebut adalah ilustrasi struktur, bukan salinan satu record lengkap. Field media, relasi, dan metadata dapat berbeda sesuai data yang tersimpan serta parameter `populate`.

Respons detail menggunakan `data` sebagai satu objek, sedangkan respons daftar menggunakan `data` sebagai array.

## 7. URL gambar

Field media mengembalikan URL relatif, misalnya `/uploads/RSUD.jpeg`.

Untuk lingkungan lokal, URL absolut dapat dibentuk dengan menggabungkan base URL dan path tersebut:

`http://localhost:1337/uploads/RSUD.jpeg`

Gunakan `formats.small.url` atau format lain yang tersedia untuk menampilkan gambar berukuran lebih kecil. Periksa kembali URL media saat backend dipindahkan ke server lain.

## 8. Pagination dan publikasi

Content type yang diperiksa menggunakan `draftAndPublish: true`. Daftar publik bergantung pada status publikasi dan permission yang aktif.

Parameter pagination yang umum:

- `pagination[page]`
- `pagination[pageSize]`

Periksa `meta.pagination.total` untuk jumlah data yang cocok dengan request, bukan hanya jumlah item yang diterima pada halaman pertama.

## 9. Permission dan keamanan

- GET pada empat endpoint master data telah berhasil diuji di lingkungan lokal.
- POST kategori tanpa token pernah menghasilkan HTTP 403 setelah permission publikasi CRUD dinonaktifkan.
- Pengujian tersebut tidak membuktikan seluruh metode, seluruh endpoint, dan seluruh role pengguna telah diuji.
- Sebelum deployment, tinjau ulang permission Public dan Authenticated. Jangan mengaktifkan operasi tulis publik hanya untuk mempermudah integrasi.
- Jangan menaruh secret, token admin, atau kredensial database di repositori maupun koleksi Postman.

## 10. Error

Strapi dapat mengembalikan objek error JSON, misalnya:

```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Not Found",
    "details": {}
  }
}
```

Status dan detail aktual bergantung pada jenis kesalahan, permission, validasi, dan route yang diminta.

## 11. Catatan integrasi frontend

Dokumentasi lama memakai beberapa nama field yang berbeda dari implementasi saat ini, seperti `nama`, `tentang`, `lokasi`, `foto`, `jurusan`, dan `role`.

Field backend saat ini meliputi `nama_tempat`, `deskripsi`, `lokasi_utama`, `logo`, `jurusans`, dan `roles`.

Perbedaan ini perlu disepakati dengan frontend melalui issue atau PR sebelum kontrak dinyatakan final. Jangan mengubah skema backend hanya berdasarkan contoh respons lama.

## 12. Status verifikasi

| Pemeriksaan | Status |
|---|---|
| GET daftar Tempat PKL | Berhasil pada pengujian lokal |
| GET daftar Kategori | Berhasil pada pengujian lokal |
| GET daftar Jurusan | Berhasil pada pengujian lokal |
| GET daftar Role | Berhasil pada pengujian lokal |
| Populate media dan relasi Tempat PKL | Berhasil pada sampel lokal |
| Semua kombinasi filter | Belum seluruhnya diverifikasi |
| Seluruh endpoint detail | Belum seluruhnya diverifikasi |
| Seluruh metode CRUD | Belum seluruhnya diverifikasi |
| Integrasi frontend | Menunggu pencocokan kontrak |
| Deployment dan URL media produksi | Perlu verifikasi terpisah |
