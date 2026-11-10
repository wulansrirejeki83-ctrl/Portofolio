# 📚 Website Karya Sastra Guru

## 1. Gambaran Umum

Project ini adalah website publik untuk menyimpan, mengelola, dan menampilkan karya sastra milik seorang guru Bahasa Indonesia.

Website ditujukan agar karya-karya tersebut dapat dipublikasikan secara online dan dibaca oleh masyarakat umum melalui browser tanpa perlu melakukan login.

Guru sebagai pemilik karya memiliki akses khusus untuk mengelola konten melalui halaman admin.

Tujuan utama project:

* Menjadi arsip digital karya sastra.
* Memudahkan masyarakat membaca karya secara online.
* Memberikan tampilan profesional untuk karya dan profil penulis.
* Memudahkan guru menambahkan dan mengelola karya.
* Menyediakan platform publik yang dapat dikembangkan di masa depan.

---

# 2. Konsep Website

Website dibagi menjadi dua sisi utama:

## Public Website

Dapat diakses siapa saja tanpa login.

Fitur utama:

* Home
* Daftar karya
* Detail karya
* Kategori karya
* Pencarian karya
* Profil penulis
* Informasi tentang penulis
* Kontak

## Admin Dashboard

Hanya dapat diakses oleh guru/pemilik website.

Fitur utama:

* Login
* Dashboard
* Kelola karya
* Tambah karya
* Edit karya
* Hapus karya
* Publish / Unpublish karya
* Kelola kategori
* Kelola profil penulis

---

# 3. Target Pengguna

## 3.1 Pengunjung

Pengunjung website dapat:

* Melihat daftar karya.
* Membaca karya.
* Mencari karya.
* Memfilter karya berdasarkan kategori.
* Melihat informasi penulis.

Pengunjung tidak perlu memiliki akun.

## 3.2 Guru / Admin

Guru merupakan pemilik dan pengelola website.

Admin dapat:

* Login.
* Membuat karya baru.
* Mengedit karya.
* Menghapus karya.
* Menyimpan karya sebagai draft.
* Mempublikasikan karya.
* Mengatur kategori.
* Mengubah informasi profil.

---

# 4. Recommended Tech Stack

Stack utama yang digunakan:

| Bagian           | Teknologi           |
| ---------------- | ------------------- |
| Framework        | Next.js             |
| Bahasa           | TypeScript          |
| Styling          | Tailwind CSS        |
| Database         | Supabase PostgreSQL |
| Authentication   | Supabase Auth       |
| File Storage     | Supabase Storage    |
| Hosting          | Vercel              |
| Rich Text Editor | TipTap / Lexical    |
| Icon             | Lucide              |

## Arsitektur

```text
                         ┌─────────────────┐
                         │     Vercel      │
                         │    Hosting      │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     Next.js     │
                         │                 │
                         │ Public Website  │
                         │ Admin Dashboard │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
           ┌─────────────────┐        ┌─────────────────┐
           │    Supabase     │        │ Supabase Storage│
           │   PostgreSQL    │        │                 │
           │                 │        │ Cover / Images  │
           │ Works           │        │                 │
           │ Categories      │        └─────────────────┘
           │ Users           │
           └─────────────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Supabase Auth   │
           │                 │
           │ Admin Login     │
           └─────────────────┘
```

---

# 5. Struktur Halaman

## Public

### `/`

Homepage.

Konten yang dapat ditampilkan:

* Hero section
* Nama penulis
* Deskripsi singkat
* Karya terbaru
* Kategori karya
* CTA untuk melihat seluruh karya
* Informasi singkat penulis

---

### `/karya`

Halaman seluruh karya.

Fitur:

* Daftar karya
* Search
* Filter kategori
* Sorting berdasarkan tanggal
* Pagination jika jumlah karya sudah banyak

Contoh:

```text
Karya

[ Cari karya... ]

[ Semua ] [ Puisi ] [ Cerpen ] [ Esai ]

┌────────────────────┐
│      Cover         │
│                    │
│ Judul Karya        │
│ Puisi              │
│ 12 September 2026  │
└────────────────────┘
```

---

### `/karya/[slug]`

Halaman detail karya.

Menampilkan:

* Judul
* Penulis
* Kategori
* Tanggal publikasi
* Cover jika tersedia
* Isi karya
* Navigasi karya sebelumnya/berikutnya

Contoh URL:

```text
/karya/jejak-yang-tertinggal
```

---

### `/tentang`

Halaman profil penulis.

Dapat berisi:

* Foto
* Nama
* Biografi
* Profesi
* Pengalaman
* Karya atau publikasi
* Informasi lainnya

---

### `/kontak`

Halaman kontak.

Dapat berisi:

* Email
* Media sosial
* Informasi kontak
* Link platform lain

---

# 6. Admin Dashboard

Prefix:

```text
/admin
```

## `/admin/login`

Halaman login admin.

Login menggunakan:

* Email
* Password

Authentication menggunakan Supabase Auth.

---

## `/admin`

Dashboard utama.

Informasi yang dapat ditampilkan:

```text
Total Karya
Karya Published
Karya Draft
Total Kategori
```

Dashboard tidak perlu terlalu kompleks pada versi awal.

---

## `/admin/karya`

Menampilkan seluruh karya milik admin.

Contoh tabel:

```text
Judul              Kategori     Status       Aksi
---------------------------------------------------------
Jejak Senja        Puisi        Published    Edit
Hujan              Cerpen       Draft        Edit
Tentang Waktu      Esai         Published    Edit
```

---

## `/admin/karya/tambah`

Form untuk membuat karya baru.

Field:

* Judul
* Kategori
* Cover
* Isi karya
* Status
* Tanggal publikasi

Status:

```text
draft
published
```

---

## `/admin/karya/[id]/edit`

Digunakan untuk mengedit karya yang sudah ada.

Admin dapat mengubah:

* Judul
* Kategori
* Cover
* Isi
* Status
* Tanggal publikasi

---

## `/admin/kategori`

Digunakan untuk mengelola kategori karya.

Contoh:

```text
Puisi
Cerpen
Esai
Artikel
Drama
Novel
Lainnya
```

Kategori dapat ditambah atau dihapus oleh admin.

---

## `/admin/profil`

Digunakan untuk mengubah informasi penulis.

Field dapat mencakup:

* Nama
* Foto
* Bio
* Deskripsi
* Email
* Social media
* Informasi lainnya

---

# 7. Database

Database menggunakan PostgreSQL melalui Supabase.

## Table: `users`

Digunakan untuk data tambahan admin.

```text
users
├── id
├── name
├── email
├── avatar_url
└── created_at
```

Authentication utama tetap menggunakan Supabase Auth.

---

## Table: `categories`

```text
categories
├── id
├── name
├── slug
└── created_at
```

Contoh:

```text
1 | Puisi
2 | Cerpen
3 | Esai
4 | Artikel
```

---

## Table: `works`

Tabel utama untuk menyimpan karya sastra.

```text
works
├── id
├── title
├── slug
├── category_id
├── content
├── cover_image
├── status
├── published_at
├── created_at
└── updated_at
```

Relasi:

```text
categories
     │
     │ 1
     │
     │ N
     ▼
   works
```

Satu kategori dapat memiliki banyak karya.

---

## Table: `author_profile`

Untuk menyimpan informasi profil penulis.

```text
author_profile
├── id
├── name
├── bio
├── photo_url
├── email
├── instagram_url
├── facebook_url
├── website_url
├── created_at
└── updated_at
```

Pada versi awal, tabel ini cukup memiliki satu record karena website hanya digunakan untuk satu guru/penulis.

---

# 8. Status Karya

Setiap karya memiliki status.

## Draft

Karya sudah dibuat tetapi belum ditampilkan kepada publik.

```text
status = draft
```

## Published

Karya sudah dipublikasikan dan dapat dibaca pengunjung.

```text
status = published
```

Public website hanya mengambil karya:

```text
status = published
```

---

# 9. Storage

Supabase Storage digunakan untuk menyimpan file gambar.

Contoh:

```text
Supabase Storage
│
└── works/
    ├── cover-001.jpg
    ├── cover-002.jpg
    └── cover-003.jpg
```

File yang dapat disimpan:

* Cover karya
* Foto penulis
* Gambar pendukung

Untuk versi awal, tidak perlu menyediakan upload PDF atau DOCX kecuali memang dibutuhkan.

---

# 10. Content Editor

Admin membutuhkan editor untuk menulis karya.

Contoh kebutuhan formatting:

* Bold
* Italic
* Heading
* Paragraph
* Quote
* List
* Link
* Line break

Pilihan editor:

* TipTap
* Lexical

Untuk karya sastra, **line break harus diperhatikan** karena format puisi berbeda dengan artikel biasa.

Contoh:

```text
Aku berjalan

melewati senja

dan menemukan
diriku sendiri.
```

Format baris harus tetap dipertahankan ketika ditampilkan kepada pembaca.

---

# 11. SEO

Karena website ditujukan untuk publik, SEO perlu diperhatikan.

Setiap karya memiliki:

* `title`
* `description`
* `slug`
* Open Graph metadata

Contoh:

```text
https://domain.com/karya/jejak-yang-tertinggal
```

Metadata:

```text
Title:
Jejak yang Tertinggal — Karya Sastra

Description:
Sebuah karya sastra karya [Nama Penulis].
```

Next.js digunakan untuk mengatur metadata halaman.

---

# 12. Responsive Design

Website harus dapat digunakan pada:

* Desktop
* Laptop
* Tablet
* Smartphone

Prioritas utama:

```text
Mobile
   ↓
Tablet
   ↓
Desktop
```

Halaman membaca karya harus nyaman terutama pada layar smartphone.

---

# 13. Design Direction

Nuansa website harus mencerminkan:

* Sastra
* Elegan
* Tenang
* Personal
* Profesional
* Tidak terlalu ramai

Hindari desain yang terlalu menyerupai:

* Dashboard SaaS
* Marketplace
* Social media
* Website corporate yang terlalu formal

Website lebih cocok menggunakan pendekatan **literary portfolio / digital literary archive**.

Contoh elemen visual:

* Typography yang kuat
* Whitespace
* Layout editorial
* Cover karya
* Serif font untuk judul/konten sastra
* Sans-serif untuk navigasi dan UI

---

# 14. Security

Admin dashboard harus dilindungi.

Aturan dasar:

* Pengunjung tidak dapat mengakses halaman admin.
* Hanya akun yang terautentikasi yang dapat mengelola karya.
* Supabase Row Level Security (RLS) harus digunakan.
* Public hanya dapat membaca karya yang sudah `published`.
* Operasi insert/update/delete hanya diperbolehkan untuk admin.
* Credential dan secret key tidak boleh dimasukkan ke source code.

Environment variable:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Secret yang bersifat server-only tidak boleh diekspos ke browser.

---

# 15. Deployment

Target hosting:

**Vercel**

Repository:

```text
GitHub
   ↓
Vercel
   ↓
Next.js Application
```

Database dan storage:

```text
Supabase
```

Alur deployment:

```text
Developer
   ↓
Git Push
   ↓
GitHub
   ↓
Vercel Build
   ↓
Production
```

---

# 16. MVP

Versi pertama tidak perlu memiliki terlalu banyak fitur.

## Wajib

### Public

* [x] Homepage
* [x] Daftar karya
* [x] Detail karya
* [x] Kategori
* [x] Search
* [x] Profil penulis

### Admin

* [x] Login
* [x] Dashboard
* [x] Tambah karya
* [x] Edit karya
* [x] Hapus karya
* [x] Publish / Draft
* [x] Kelola kategori
* [x] Kelola profil

### Infrastructure

* [x] Supabase Database
* [x] Supabase Auth
* [x] Supabase Storage
* [x] Vercel Deployment

---

# 17. Future Features

Fitur berikut tidak wajib untuk MVP.

Kemungkinan pengembangan:

* View counter
* Like karya
* Bookmark
* Komentar
* Share karya
* Download PDF
* Export karya
* Newsletter
* RSS Feed
* Sitemap otomatis
* Google Search Console
* Analytics
* Multi-author
* Koleksi / seri karya
* Tag
* Featured works
* Related works
* Dark mode
* PWA
* Custom domain

Fitur tersebut hanya ditambahkan jika memang memiliki kebutuhan nyata.

---

# 18. Scope Awal

Project ini pada tahap awal merupakan:

> **Personal Literary Portfolio & Digital Literary Archive**

Bukan:

* Social media
* Marketplace
* Platform publishing multi-user
* E-book marketplace
* CMS besar
* Platform komunitas

Fokus utama adalah **publikasi dan pengarsipan karya sastra seorang guru**.

---

# 19. Development Principle

Pengembangan harus dilakukan secara bertahap.

Urutan:

```text
1. Analisis kebutuhan
        ↓
2. Sitemap
        ↓
3. UI/UX Design
        ↓
4. Database Design
        ↓
5. Setup Next.js
        ↓
6. Setup Supabase
        ↓
7. Public Website
        ↓
8. Authentication
        ↓
9. Admin Dashboard
        ↓
10. CRUD Karya
        ↓
11. Storage
        ↓
12. SEO
        ↓
13. Responsive Testing
        ↓
14. Deployment Vercel
        ↓
15. Testing & Refinement
```

---

# 20. Prinsip Penting Project

1. **Content first**
   Karya sastra merupakan inti website.

2. **Readable**
   Pengalaman membaca harus menjadi prioritas utama.

3. **Simple administration**
   Guru harus dapat mengelola karya tanpa memahami programming.

4. **Responsive**
   Website harus nyaman digunakan pada smartphone.

5. **Secure**
   Admin dan data harus memiliki kontrol akses yang tepat.

6. **Maintainable**
   Struktur project harus mudah dikembangkan.

7. **Scalable when needed**
   Fitur tambahan hanya dibuat ketika kebutuhan muncul.

---

# 21. Project Identity

Nama project sementara:

```text
Website Karya Sastra Guru
```

Nama brand/domain dapat ditentukan kemudian berdasarkan nama guru, nama pena, atau konsep website.

Contoh struktur:

```text
[Brand / Nama Penulis]

Karya sastra • Puisi • Cerpen • Esai
```

---

# 22. Final Architecture

```text
                         INTERNET
                            │
                            ▼
                    ┌───────────────┐
                    │    VERCEL     │
                    │               │
                    │    Next.js    │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       PUBLIC WEBSITE              ADMIN DASHBOARD
              │                           │
              │                     Supabase Auth
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   SUPABASE   │
                     │              │
                     │ PostgreSQL   │
                     │ Auth         │
                     │ Storage      │
                     └──────────────┘
```

---

# 23. Current Recommendation

Untuk project ini, stack yang direkomendasikan:

```text
Frontend + Backend
        ↓
      Next.js

Language
        ↓
    TypeScript

UI
        ↓
  Tailwind CSS

Database
        ↓
Supabase PostgreSQL

Authentication
        ↓
Supabase Auth

Storage
        ↓
Supabase Storage

Hosting
        ↓
     Vercel
```

Stack tersebut dipilih karena cocok untuk website publik berbasis konten dengan satu pengelola utama, sekaligus tetap memungkinkan project berkembang di kemudian hari.
