# API Contract PILAR_BE (DRAFT)

Status: draft, menunggu persetujuan Frontend. Nama field tidak boleh
diubah tanpa diskusi di issue.

Base URL (dev): `http://localhost:1337`
Semua endpoint bersifat publik dan hanya membaca (GET).

## Endpoint

| Kebutuhan | Method | Path |
|---|---|---|
| Daftar tempat PKL | GET | `/api/tempat-pkls` |
| Detail tempat PKL | GET | `/api/tempat-pkls/:documentId` |
| Daftar kategori | GET | `/api/kategoris` |
| Daftar jurusan | GET | `/api/jurusans` |
| Daftar role | GET | `/api/roles` |

## Query untuk daftar tempat PKL

| Fungsi | Query |
|---|---|
| Search nama | `filters[nama][$containsi]=sawala` |
| Filter kategori | `filters[kategori][slug][$eq]=perusahaan` |
| Filter jurusan | `filters[jurusan][slug][$eq]=pplg` |
| Filter role | `filters[role][slug][$eq]=backend` |
| Halaman | `pagination[page]=1` |
| Jumlah per halaman | `pagination[pageSize]=9` |
| Urutan | `sort=nama:asc` |

Semua query bisa digabung.

## Response daftar (card)

```json
{
  "data": [
    {
      "id": 3,
      "documentId": "abc123placeholder",
      "nama": "PT Sawala Inovasi Indonesia",
      "slug": "pt-sawala-inovasi-indonesia",
      "kategori": { "nama": "Perusahaan", "slug": "perusahaan" },
      "lokasi": { "kabupaten": "Kab. Sumedang" },
      "foto": [
        { "url": "/uploads/contoh.jpg",
          "formats": { "small": { "url": "/uploads/small_contoh.jpg" } } }
      ]
    }
  ],
  "meta": { "pagination": { "page": 1, "pageSize": 9, "pageCount": 1, "total": 5 } }
}
```

## Response detail

```json
{
  "data": {
    "id": 3,
    "documentId": "abc123placeholder",
    "nama": "PT Sawala Inovasi Indonesia",
    "slug": "pt-sawala-inovasi-indonesia",
    "tentang": "[deskripsi contoh]",
    "kuota": 20,
    "kategori": { "nama": "Perusahaan", "slug": "perusahaan" },
    "lokasi": {
      "kabupaten": "Kab. Sumedang",
      "alamat": "[ALAMAT_CONTOH]",
      "google_maps_url": "https://example.com/maps-placeholder"
    },
    "kontak": {
      "telepon": "[TELEPON_CONTOH]",
      "email": "contoh@example.com",
      "website": "https://example.com"
    },
    "foto": [
      { "url": "/uploads/contoh.jpg",
        "formats": { "small": { "url": "/uploads/small_contoh.jpg" } } }
    ],
    "kegiatan": [
      { "id": 1, "nama": "Ngoding" },
      { "id": 2, "nama": "Mendesain Web/Apk" },
      { "id": 3, "nama": "Analisis Data" }
    ],
    "jurusan": [
      { "nama": "PPLG", "slug": "pplg" },
      { "nama": "MPLB", "slug": "mplb" },
      { "nama": "Akuntansi", "slug": "akuntansi" },
      { "nama": "Pemasaran", "slug": "pemasaran" }
    ],
    "role": [
      { "nama": "UI/UX Design", "slug": "ui-ux-design" },
      { "nama": "Frontend", "slug": "frontend" },
      { "nama": "Backend", "slug": "backend" },
      { "nama": "DevOps", "slug": "devops" }
    ]
  },
  "meta": {}
}
```

## URL gambar

`url` bersifat relatif. Gabungkan dengan base URL:
`http://localhost:1337` + `/uploads/contoh.jpg`.
Untuk card, pakai `formats.small.url` bila tersedia.

## Error

```json
{ "data": null, "error": { "status": 404, "name": "NotFoundError", "message": "Not Found", "details": {} } }
```

## Aturan

- FE tidak boleh menebak nama field; hanya pakai yang tertulis di sini.
- BE tidak boleh mengubah nama field tanpa mengumumkan lewat issue/PR.
- Perubahan dokumen ini harus disetujui kedua pihak.

## Pertanyaan untuk FE

- Apakah card menampilkan sesuatu selain foto, nama, kategori, dan kabupaten?
- Apakah FE butuh field lain pada halaman detail?
- Alamat dev FE (untuk pengaturan CORS), misalnya `http://localhost:5173`?