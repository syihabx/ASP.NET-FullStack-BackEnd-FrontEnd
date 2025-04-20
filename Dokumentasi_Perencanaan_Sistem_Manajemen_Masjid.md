# Dokumentasi Perencanaan Sistem Manajemen Masjid

## 1. Ringkasan Eksekutif

Dokumen ini menyajikan perencanaan pengembangan Sistem Manajemen Masjid (SMM) yang mencakup pengelolaan inventori dan keuangan masjid. Sistem ini bertujuan untuk meningkatkan transparansi, akuntabilitas, dan efisiensi dalam pengelolaan aset dan keuangan masjid.

## 2. Latar Belakang Proyek

### 2.1. Masalah yang Dihadapi
- Pencatatan aset dan inventaris masjid masih dilakukan secara manual
- Pengelolaan keuangan belum terkelola dengan baik dan sulit untuk dilacak
- Kurangnya transparansi dalam pengelolaan dana dan aset masjid
- Kesulitan dalam pembuatan laporan keuangan dan aset secara periodik
- Proses koordinasi antar pengurus masjid tidak efisien

### 2.2. Tujuan Proyek
- Menyediakan sistem terintegrasi untuk pengelolaan inventori dan keuangan masjid
- Meningkatkan akurasi dalam pengelolaan aset dan keuangan
- Memudahkan pembuatan laporan dan transparansi kepada jamaah
- Mempermudah pengawasan dan monitoring kondisi aset
- Meningkatkan efisiensi kerja pengurus masjid

## 3. Cakupan Sistem

### 3.1. Modul Utama
1. **Manajemen Aset dan Inventori**
   - Pendataan dan pelacakan aset masjid
   - Pengelompokan aset berdasarkan kategori
   - Pemantauan kondisi dan lokasi aset
   - Pencatatan pemeliharaan dan perbaikan

2. **Manajemen Keuangan**
   - Pencatatan pemasukan dan pengeluaran
   - Pengelolaan sumber dana dan kategori transaksi
   - Pengelolaan data donatur
   - Pembuatan laporan keuangan

3. **Administrasi Sistem**
   - Manajemen pengguna dan hak akses
   - Pengaturan profil masjid
   - Backup dan pemulihan data
   - Konfigurasi sistem

4. **Pelaporan dan Dashboard**
   - Dashboard interaktif untuk visualisasi data
   - Laporan inventori dan kondisi aset
   - Laporan keuangan (harian, mingguan, bulanan, tahunan)
   - Laporan donatur dan sumber pendanaan

### 3.2. Fitur Penunjang
- Notifikasi untuk pemeliharaan aset terjadwal
- Upload dan penyimpanan bukti transaksi digital
- Pencetakan laporan dalam berbagai format
- Pengumuman kegiatan masjid

## 4. Analisis Kebutuhan

### 4.1. Stakeholder Utama
1. **Pengurus Masjid**
   - Takmir/Ketua Masjid: Membutuhkan laporan lengkap dan dashboard
   - Bendahara: Fokus pada pengelolaan keuangan
   - Seksi Sarana: Fokus pada pengelolaan inventori dan aset

2. **Jamaah**
   - Membutuhkan transparansi pengelolaan dana dan aset

3. **Donatur**
   - Membutuhkan laporan penggunaan dana yang disumbangkan

### 4.2. Kebutuhan Fungsional

#### 4.2.1. Manajemen Aset dan Inventori
- **F-A-01**: Sistem harus mampu mencatat data aset lengkap (nama, kode, deskripsi, nilai, foto)
- **F-A-02**: Sistem harus mendukung pengelompokan aset dalam berbagai kategori
- **F-A-03**: Sistem harus mencatat lokasi penempatan setiap aset
- **F-A-04**: Sistem harus memungkinkan pencatatan riwayat pemeliharaan aset
- **F-A-05**: Sistem harus mendukung pencarian aset berdasarkan berbagai kriteria
- **F-A-06**: Sistem harus memungkinkan pemantauan kondisi aset
- **F-A-07**: Sistem harus mendukung pencetakan barcode/QR code untuk identifikasi aset

#### 4.2.2. Manajemen Keuangan
- **F-K-01**: Sistem harus mendukung pencatatan transaksi pemasukan dan pengeluaran
- **F-K-02**: Sistem harus memungkinkan kategorisasi jenis pemasukan dan pengeluaran
- **F-K-03**: Sistem harus mendukung penyimpanan bukti transaksi digital
- **F-K-04**: Sistem harus mampu menghasilkan laporan keuangan periodik
- **F-K-05**: Sistem harus mencatat data donatur dan sumbangan
- **F-K-06**: Sistem harus menghitung saldo dan arus kas secara otomatis
- **F-K-07**: Sistem harus mendukung pencatatan anggaran dan realisasinya

#### 4.2.3. Administrasi Sistem
- **F-S-01**: Sistem harus mengelola pengguna dengan berbagai peran dan hak akses
- **F-S-02**: Sistem harus mencatat log aktivitas pengguna
- **F-S-03**: Sistem harus mendukung backup dan pemulihan data
- **F-S-04**: Sistem harus memungkinkan konfigurasi profil masjid

#### 4.2.4. Pelaporan dan Dashboard
- **F-D-01**: Sistem harus menyediakan dashboard visual untuk data keuangan
- **F-D-02**: Sistem harus menyediakan dashboard visual untuk kondisi aset
- **F-D-03**: Sistem harus menghasilkan berbagai jenis laporan yang dapat diekspor
- **F-D-04**: Sistem harus mendukung grafik dan visualisasi data interaktif

### 4.3. Kebutuhan Non-Fungsional
- **NF-01**: Sistem harus mudah digunakan oleh pengguna dengan pengetahuan teknologi minimal
- **NF-02**: Sistem harus responsif dan dapat diakses dari berbagai perangkat
- **NF-03**: Sistem harus menjamin keamanan data dan akses
- **NF-04**: Sistem harus memberikan performa yang baik bahkan dengan koneksi internet terbatas
- **NF-05**: Sistem harus mendukung bahasa Indonesia
- **NF-06**: Sistem harus dapat dikembangkan lebih lanjut di masa depan

## 5. Desain Sistem

### 5.1. Arsitektur Sistem
Sistem akan dikembangkan menggunakan Clean Architecture dengan pendekatan Domain-Driven Design (DDD) dan Command Query Responsibility Segregation (CQRS) seperti pada proyek Indotalent.

```
                   +----------------------------+
                   |                            |
                   |  Presentation Layer (UI)   |
                   |  - Razor Pages + Vue.js    |
                   |                            |
                   +------------+---------------+
                                |
                                v
                   +----------------------------+
                   |                            |
                   |     API Layer (WebAPI)     |
                   |                            |
                   +------------+---------------+
                                |
                                v
                   +----------------------------+
                   |                            |
                   |    Application Layer       |
                   |     (Commands/Queries)     |
                   |                            |
                   +------------+---------------+
                                |
                                v
                   +----------------------------+
                   |                            |
                   |      Domain Layer          |
                   |   (Entities/Business)      |
                   |                            |
                   +------------+---------------+
                                |
                                v
                   +----------------------------+
                   |                            |
                   |   Infrastructure Layer     |
                   |  (Database/Services)       |
                   |                            |
                   +----------------------------+
```

### 5.2. Entitas Utama dan Relasi

#### 5.2.1. Domain Aset dan Inventori
- **Aset**: Inventori atau barang yang dimiliki masjid
- **KategoriAset**: Pengelompokan aset (elektronik, furniture, alat ibadah, dll)
- **LokasiAset**: Lokasi penempatan aset di masjid
- **PemeliharaanAset**: Riwayat pemeliharaan/perbaikan aset
- **PeminjamanAset**: Pencatatan peminjaman aset jika ada

#### 5.2.2. Domain Keuangan
- **TransaksiKeuangan**: Catatan pemasukan/pengeluaran keuangan
- **KategoriTransaksi**: Jenis transaksi keuangan (infaq, zakat, operasional, dll)
- **SumberDana**: Sumber dana masjid (kotak amal, transfer bank, dll)
- **Donatur**: Data penyumbang dana
- **Anggaran**: Perencanaan anggaran dan realisasinya

#### 5.2.3. Domain Administrasi
- **Pengguna**: Akun pengurus masjid yang menggunakan sistem
- **Peran**: Hak akses dan peran pengguna (admin, bendahara, inventaris)
- **ProfilMasjid**: Data tentang masjid yang dikelola
- **LogAktivitas**: Pencatatan aktivitas pengguna dalam sistem

### 5.3. Diagram Relasi Entitas (ERD)

```
  +----------------+       +---------------+       +---------------+
  |     Aset       |       | KategoriAset  |       |  LokasiAset   |
  +----------------+       +---------------+       +---------------+
  | PK: Id         |<----->| PK: Id        |       | PK: Id        |
  | Kode           |       | Nama          |       | Nama          |
  | Nama           |       | Deskripsi     |       | Deskripsi     |
  | Deskripsi      |<----->+---------------+       | Kode          |
  | NilaiPerolehan |                               +------^--------+
  | TanggalBeli    |                                      |
  | Kondisi        |                                      |
  | Foto           |                                      |
  | FK: KategoriId |                                      |
  | FK: LokasiId   |------------------------------------- +
  +-------^--------+
          |
          |        +----------------------+
          |        | PemeliharaanAset     |
          +------->+----------------------+
                   | PK: Id               |
                   | Tanggal              |
                   | Keterangan           |
                   | Biaya                |
                   | FK: AsetId           |
                   +----------------------+


  +--------------------+       +------------------+
  | TransaksiKeuangan  |       | KategoriTransaksi|
  +--------------------+       +------------------+
  | PK: Id             |<----->| PK: Id           |
  | NoTransaksi        |       | Nama             |
  | TanggalTransaksi   |       | Deskripsi        |
  | Keterangan         |       | JenisAliran      |
  | Nominal            |       +------------------+
  | JenisTransaksi     |
  | BuktiTransaksi     |       +------------------+
  | FK: KategoriId     |       | SumberDana       |
  | FK: DonaturId      |<----->+------------------+
  | FK: SumberDanaId   |<--+   | PK: Id           |
  +--------------------+   |   | Nama             |
                           |   | Deskripsi        |
  +--------------------+   |   +------------------+
  | Donatur            |   |
  +--------------------+   |
  | PK: Id             |<--+
  | Nama               |
  | Alamat             |
  | Telepon            |
  | Email              |
  | IsDonaturTetap     |
  +--------------------+
```

## 6. Rencana Implementasi

### 6.1. Tahapan Pengembangan

#### 6.1.1. Fase 1: Persiapan (1-2 minggu)
- Setup proyek dan lingkungan pengembangan
- Desain basis data dan pembuatan migrasi awal
- Pembuatan struktur proyek Clean Architecture

#### 6.1.2. Fase 2: Pengembangan Domain dan Core (3-4 minggu)
- Implementasi entitas domain
- Implementasi interface repository
- Implementasi business logic dan validasi
- Unit testing untuk domain dan business logic

#### 6.1.3. Fase 3: Pengembangan Infrastructure (2-3 minggu)
- Implementasi repository
- Implementasi database context dan migrations
- Implementasi file storage dan service eksternal
- Implementasi authentication dan authorization

#### 6.1.4. Fase 4: Pengembangan Application Layer (3-4 minggu)
- Implementasi CQRS pattern (Commands dan Queries)
- Implementasi validators
- Implementasi service layer
- Implementasi mapper

#### 6.1.5. Fase 5: Pengembangan API (2-3 minggu)
- Implementasi REST API endpoints
- Implementasi OData query
- Dokumentasi API
- Testing API endpoints

#### 6.1.6. Fase 6: Pengembangan UI (4-5 minggu)
- Implementasi layout dan template
- Implementasi halaman manajemen aset
- Implementasi halaman manajemen keuangan
- Implementasi dashboard dan laporan
- Implementasi halaman administrasi

#### 6.1.7. Fase 7: Testing dan Deployment (2-3 minggu)
- Integration testing
- User Acceptance Testing (UAT)
- Perbaikan bug dan optimasi
- Deployment ke lingkungan produksi
- Dokumentasi pengguna

### 6.2. Teknologi yang Digunakan

#### 6.2.1. Backend
- **Framework**: ASP.NET Core 6.0+
- **ORM**: Entity Framework Core
- **API**: REST API dengan dukungan OData
- **Authentication**: JWT (JSON Web Token)
- **Database**: Microsoft SQL Server/PostgreSQL

#### 6.2.2. Frontend
- **Framework UI**: ASP.NET Core Razor Pages + Vue.js
- **CSS Framework**: Bootstrap 5
- **Chart Library**: Chart.js
- **UI Components**: Bootstrap Vue

#### 6.2.3. Tools dan Libraries
- **Dependency Injection**: Built-in ASP.NET Core
- **Logging**: Serilog
- **Validation**: FluentValidation
- **Mapping**: AutoMapper
- **Testing**: xUnit, NSubstitute, Moq
- **CQRS**: MediatR

## 7. Rencana Pengujian

### 7.1. Strategi Pengujian
- **Unit Testing**: Untuk domain model dan business logic
- **Integration Testing**: Untuk API endpoints dan repository
- **UI Testing**: Untuk antarmuka pengguna
- **User Acceptance Testing**: Dengan stakeholder utama

### 7.2. Kriteria Keberhasilan
- Sistem mampu mengelola minimal 1000 aset tanpa penurunan performa
- Waktu respons API tidak lebih dari 1 detik
- Sistem dapat diakses dari minimal 3 perangkat berbeda secara bersamaan
- Keakuratan laporan keuangan 100%
- Tingkat kepuasan pengguna minimal 80%

## 8. Antisipasi Risiko

| Risiko | Probability | Impact | Mitigasi |
|--------|------------|--------|----------|
| Resistensi pengguna terhadap teknologi baru | High | Medium | Pelatihan dan pendampingan intensif |
| Keterbatasan infrastruktur IT di masjid | Medium | High | Desain sistem dengan kebutuhan minimal dan opsi offline mode |
| Keamanan data sensitif (keuangan) | Low | High | Implementasi enkripsi dan access control yang ketat |
| Perubahan kebutuhan selama pengembangan | Medium | Medium | Metodologi agile dan komunikasi rutin dengan stakeholder |
| Keterbatasan anggaran pengembangan | Medium | High | Pengembangan bertahap dengan prioritas fitur utama |

## 9. Rencana Pemeliharaan dan Pengembangan Lanjutan

### 9.1. Pemeliharaan Rutin
- Backup database otomatis harian
- Monitoring sistem dan performa
- Pembaruan keamanan berkala

### 9.2. Pengembangan Lanjutan (Future Development)
- Integrasi dengan sistem SMS/WhatsApp untuk notifikasi
- Aplikasi mobile untuk akses lebih mudah
- Modul manajemen kegiatan masjid
- Modul manajemen zakat dan wakaf
- Sistem informasi jadwal kegiatan untuk jamaah

## 10. Sumber Daya yang Dibutuhkan

### 10.1. Tim Pengembangan
- 1 Project Manager
- 2 Backend Developer
- 1 Frontend Developer
- 1 UI/UX Designer
- 1 Quality Assurance Engineer

### 10.2. Infrastruktur
- Development Server
- Production Server
- Database Server
- File Storage Server
- Domain dan Hosting

### 10.3. Perangkat Pendukung
- Komputer untuk pengembangan
- Perangkat untuk testing (PC, tablet, smartphone)
- Koneksi internet yang stabil
- Printer untuk dokumentasi dan laporan

## 11. Kesimpulan

Sistem Manajemen Masjid yang direncanakan akan memberikan solusi komprehensif untuk pengelolaan inventori dan keuangan masjid dengan pendekatan modern berbasis teknologi. Dengan mengadopsi arsitektur Clean Architecture, sistem ini dirancang untuk mudah dikembangkan, dipelihara, dan disesuaikan dengan kebutuhan masjid di masa depan.

Implementasi sistem ini diharapkan akan meningkatkan efisiensi, transparansi, dan akuntabilitas dalam pengelolaan aset dan keuangan masjid, yang pada akhirnya akan memberikan manfaat bagi pengurus masjid dan jamaah. 