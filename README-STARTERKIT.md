# Indotalent Starter Kit (MySQL-only)

This repository is trimmed to a minimal Dashboard-focused starter kit on .NET 8, using MySQL only. Extra menus and multi-DB providers are removed from the default experience.

## Struktur Solusi
- `Core`
  - `Domain`: Entitas domain, konstanta, invariants, interfaces repository.
  - `Application`: CQRS (Commands/Queries) services, fitur aplikasi, dependency injection aplikasi.
- `Infrastructure`
  - `DataAccessManagers/EFCores`: EF Core DbContexts (`DataContext`, `CommandContext`, `QueryContext`), repositories, dan registrasi MySQL-only.
  - `SecurityManagers`: ASP.NET Identity (store ke `DataContext`), JWT token.
  - `LoggingManagers`: Serilog.
  - `EmailManagers`: Layanan email (MailKit/MimeKit).
  - `DependencyInjection.cs`: Entry registrasi semua servis Infrastructure.
- `Presentation/WebAPI`
  - `Program.cs`: Entry-point, pipeline, Swagger, seeding, Razor Pages + Controllers.
  - `Pages`: Razor Pages untuk UI. Hanya Dashboard yang diekspos default.
  - `wwwroot/src/Theme`: Layout SPA sederhana (`Content.js`, `ContentRouter.js`).
  - `Controllers`: Endpoint API (Dashboard, Auth, Config, dll.). Hanya Dashboard ditampilkan di UI.

## File Kunci
- `Presentation/WebAPI/Program.cs`: Konfigurasi aplikasi, middleware, Swagger, seeding data.
- `Infrastructure/Infrastructure/DependencyInjection.cs`: Registrasi layer Infrastructure terpusat.
- `Infrastructure/.../EFCores/DI.cs`: Registrasi EF Core MySQL-only.
- `Presentation/WebAPI/appsettings.json`: Connection string MySQL, JWT, Serilog.
- `Presentation/WebAPI/wwwroot/src/Theme/Content.js`: Menetapkan menu minimal (hanya Dashboard) dan routing SPA.
- `Presentation/WebAPI/Pages/Shared/_Content.cshtml`: Layout (sidebar/header/footer) yang menampung area konten dinamis.
- `Presentation/WebAPI/Pages/Dashboards/Index.cshtml` dan `wwwroot/src/Pages/Dashboards/Index.js`: Tampilan Dashboard dan script Vue untuk grafik.

## Perubahan Utama Untuk Starter Kit
- DB Provider dipaksa MySQL:
  - Hapus dukungan SqlServer dan PostgreSQL dari `Infrastructure.csproj`.
  - `EFCores/DI.cs` mendaftarkan `UseMySql(...)` saja.
  - `appsettings.json` memakai `ConnectionStrings:DefaultConnection` MySQL.
- UI minimal:
  - Menu dipaksa 1 item: Dashboard (lihat `Content.js` dan `_Content.cshtml`).
  - `WebAPI.csproj` hanya mem-publish halaman dan script Dashboard.

## Menjalankan Secara Lokal
1) Siapkan MySQL (contoh via Docker):
   - `docker run --name mysql8 -e MYSQL_ROOT_PASSWORD=devroot -e MYSQL_DATABASE=IndotalentStarter -e MYSQL_USER=development -e MYSQL_PASSWORD=development -p 3306:3306 -d mysql:8.0`
2) Konfigurasi koneksi di `Presentation/WebAPI/appsettings.json`:
   - `"DefaultConnection": "Server=localhost;Database=IndotalentStarter;Uid=development;Pwd=development;"`
3) Jalankan aplikasi:
   - `dotnet build Indotalent.sln -c Release`
   - `dotnet run --project Presentation/WebAPI/WebAPI.csproj`
4) Akses:
   - UI: `http://localhost:5000` (atau port yang tercetak di console)
   - Swagger: `/swagger`

Catatan: Kode seeding demo dapat diaktifkan via `IsDemoVersion` pada `appsettings.json`.

## Hal-Hal Penting Dipahami
- Arsitektur berlapis + CQRS ringan:
  - `CommandContext` untuk tulis, `QueryContext` untuk baca (memungkinkan optimasi di masa depan).
  - Repositories di Infrastructure injek melalui interface di Domain.
- Identity dan Auth:
  - ASP.NET Identity memakai `DataContext`.
  - JWT diatur di `appsettings.json` (`Jwt:Key`, dll.).
- Logging: Serilog tulis ke `Data/Logs`.
- Static files dan SPA ringan:
  - Layout Razor menampung area konten dan router SPA berbasis fetch HTML + module script.

## Langkah Lanjutan Yang Disarankan
- Pelajari struktur `Entities` dan `Repositories` untuk menambah modul baru.
- Tambah migrasi EF Core (saat ini `EnsureCreated()` untuk dev; produksi sebaiknya `Migrations`).
- Harden security: validasi konfigurasi JWT, cookie `HttpOnly`, CORS, rate-limiting.
- Testing: unit test untuk Application/Domain, integration test untuk Controllers.
- Observability: tambah Serilog sinks lain (console/seq), request logging, dan korelasi.
- CI/CD: pipeline build/test, containerization, dan deployment.

## Tambah Menu/Modul Baru (Cepat)
- UI: tambah item di `Content.js` (array `menuData`) dan buat Razor Page + JS di `Pages/<Module>/Index.cshtml` dan `wwwroot/src/Pages/<Module>/Index.js`.
- API: buat controller di `Presentation/WebAPI/Controllers/<Module>` dan service di `Application`/`Infrastructure` sesuai kebutuhan.