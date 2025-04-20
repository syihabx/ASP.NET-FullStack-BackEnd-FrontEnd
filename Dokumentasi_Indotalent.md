# Dokumentasi Aplikasi Indotalent

## 1. Ikhtisar Proyek

Indotalent adalah aplikasi full-stack berbasis ASP.NET Core yang menerapkan arsitektur Clean Architecture dengan Domain-Driven Design (DDD) dan Command Query Responsibility Segregation (CQRS). Aplikasi ini menyediakan solusi pengelolaan pelanggan dan vendor dengan fitur tambahan seperti manajemen dokumen, pengguna, dan data master.

## 2. Arsitektur Aplikasi

Aplikasi ini mengimplementasikan Clean Architecture yang terdiri dari tiga layer utama:

### 2.1 Core Layer
**Domain Layer**
- Berisi entitas bisnis, interface repository, dan aturan invariant
- Tidak memiliki dependensi ke layer lain
- Merepresentasikan konsep bisnis murni tanpa implementasi teknis

**Application Layer**
- Mengimplementasikan use case
- Mengkoordinasikan aliran data antara entitas domain
- Menerapkan pola CQRS untuk memisahkan operasi baca dan tulis

### 2.2 Infrastructure Layer
- Implementasi teknis dari interface yang didefinisikan di Core
- Termasuk akses database, enkripsi, logging, email, dan layanan teknis lainnya
- Bergantung pada Core layer tetapi tidak sebaliknya

### 2.3 Presentation Layer
- Menangani interaksi dengan pengguna
- Menyediakan REST API untuk akses data
- Implementasi UI dengan Razor Pages dan Vue.js

## 3. Domain Model

### 3.1 Entitas Pelanggan (Customer)
- **Customer**: Entitas utama yang menyimpan data pelanggan
- **CustomerGroup**: Pengelompokan pelanggan berdasarkan kategori
- **CustomerSubGroup**: Sub-kategori dari CustomerGroup
- **CustomerContact**: Data kontak pelanggan yang terkait dengan entitas Customer

### 3.2 Entitas Vendor
- **Vendor**: Entitas utama yang menyimpan data vendor/pemasok
- **VendorGroup**: Pengelompokan vendor berdasarkan kategori
- **VendorSubGroup**: Sub-kategori dari VendorGroup
- **VendorContact**: Data kontak vendor yang terkait dengan entitas Vendor

### 3.3 Entitas Pendukung
- **Currency**: Mata uang yang digunakan dalam transaksi
- **Gender**: Jenis kelamin untuk data pengguna dan kontak
- **Config**: Pengaturan sistem
- **NumberSequence**: Pengelolaan nomor urut dokumen
- **FileImage/FileDoc**: Pengelolaan file gambar dan dokumen
- **Token**: Pengelolaan token autentikasi

## 4. Implementasi CQRS

CQRS (Command Query Responsibility Segregation) diterapkan untuk memisahkan operasi baca dan tulis:

### 4.1 Commands
- Bertanggung jawab untuk operasi yang mengubah state (create, update, delete)
- Menggunakan pola Repository untuk akses data
- Mendukung validasi dan transaksi
- Mengimplementasikan pola Mediator (MediatR) untuk mengisolasi handler command

### 4.2 Queries
- Bertanggung jawab untuk operasi baca data
- Menggunakan OData untuk filtering, paging, dan sorting
- Menggunakan LINQ untuk query dinamis
- Dirancang untuk optimasi performa pada operasi baca

### 4.3 Lokasi Implementasi
- Setiap entitas memiliki folder commands dan queries
- Path: `Core/Application/Features/[Entity]/Commands` dan `Core/Application/Features/[Entity]/Queries`

## 5. Komponen Infrastruktur

### 5.1 DataAccessManagers
- Implementasi repository pattern
- Pengelolaan koneksi database
- Implementasi Unit of Work pattern
- Mendukung transaksi database

### 5.2 SecurityManagers
- Autentikasi dan otorisasi pengguna
- Pengelolaan JWT token
- Role-based access control
- Pengelolaan password hashing

### 5.3 EmailManagers
- Pengelolaan pengiriman email
- Template email
- Antrian email

### 5.4 DocumentManagers
- Penyimpanan dan pengambilan dokumen
- Validasi tipe dokumen
- Pengelolaan ukuran file

### 5.5 LoggingManagers
- Pencatatan aktivitas sistem
- Pengelolaan error dan exception
- Konfigurasi level log

### 5.6 EncryptionManagers
- Enkripsi dan dekripsi data sensitif
- Pengelolaan kunci enkripsi

### 5.7 NumberSequenceManagers
- Pengelolaan nomor urut dokumen
- Pengaturan format nomor

### 5.8 SeedManagers
- Inisialisasi data awal database
- Pengelolaan migrasi data

## 6. Presentation Layer

### 6.1 REST API
- Controller untuk setiap entitas domain
- Implementasi OData untuk query fleksibel
- Autentikasi berbasis token JWT
- Validasi input data

### 6.2 Razor Pages
- Antarmuka pengguna berbasis server-side
- Layout konsisten dengan template utama
- Partial view untuk komponen yang dapat digunakan kembali
- Integrasi dengan Vue.js

### 6.3 Vue.js Components
- Komponen reaktif untuk meningkatkan pengalaman pengguna
- Diimplementasikan tanpa build system (Vue CDN)
- Menggantikan jQuery untuk interaksi UI dinamis
- Komunikasi dengan API melalui Fetch API

### 6.4 Dashboard
- Visualisasi data bisnis
- Metrik dan KPI utama
- Grafik dan tabel interaktif

## 7. Integrasi Front-End dan Back-End

### 7.1 Komunikasi Data
- REST API sebagai backend untuk akses data
- Fetch API untuk komunikasi antara front-end dan back-end
- Format data JSON untuk pertukaran data

### 7.2 OData Integration
- Dukungan query dinamis dengan OData
- Filter, sort, dan paging di sisi server
- Pengurangan lalu lintas jaringan

### 7.3 Validasi
- Validasi sisi klien dengan Vue.js
- Validasi sisi server dengan FluentValidation
- Pesan error yang konsisten

## 8. Fitur Utama

### 8.1 Manajemen Pelanggan
- CRUD operasi untuk data pelanggan
- Pengelompokan pelanggan
- Manajemen kontak pelanggan
- Riwayat transaksi pelanggan

### 8.2 Manajemen Vendor
- CRUD operasi untuk data vendor
- Pengelompokan vendor
- Manajemen kontak vendor
- Riwayat transaksi vendor

### 8.3 Manajemen Pengguna
- Autentikasi dan otorisasi
- Manajemen role dan hak akses
- Profil pengguna
- Reset password

### 8.4 Manajemen Dokumen
- Upload dan download dokumen
- Pengelolaan gambar
- Preview dokumen

### 8.5 Dashboard & Reporting
- Visualisasi data bisnis
- Laporan kinerja
- Metrik utama

## 9. Panduan Pengembangan

### 9.1 Menambahkan Entitas Baru
1. Definisikan entitas di Domain layer
2. Buat interface repository
3. Implementasikan Commands dan Queries
4. Tambahkan controller API
5. Buat Razor Pages untuk UI

### 9.2 Memperluas Fungsionalitas
1. Identifikasi layer yang relevan (Domain, Application, Infrastructure, atau Presentation)
2. Ikuti pola desain yang sudah ada
3. Patuhi prinsip Clean Architecture (dependensi selalu mengarah ke dalam)
4. Terapkan CQRS untuk operasi data baru

### 9.3 Testing
1. Domain layer: Unit testing untuk business rules
2. Application layer: Unit testing untuk use cases
3. Infrastructure layer: Integration testing
4. Presentation layer: UI testing

## 10. Kesimpulan

Aplikasi Indotalent merupakan implementasi Clean Architecture dengan Domain-Driven Design yang menyediakan solusi manajemen pelanggan dan vendor yang komprehensif. Dengan menerapkan CQRS, aplikasi ini memisahkan dengan jelas operasi baca dan tulis untuk mengoptimalkan performa dan skalabilitas. Penggunaan OData di back-end dan Vue.js di front-end memberikan pengalaman pengguna yang responsif dan fleksibel. 