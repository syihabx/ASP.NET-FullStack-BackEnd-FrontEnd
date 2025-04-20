# Dokumentasi Pengembangan Menu Baru pada Aplikasi Indotalent

## Pendahuluan

Dokumen ini menyediakan panduan langkah demi langkah untuk mengembangkan menu atau fitur baru pada aplikasi Indotalent yang mengimplementasikan Clean Architecture, Domain-Driven Design (DDD), dan Command Query Responsibility Segregation (CQRS). Panduan ini ditujukan untuk developer baru yang ingin memahami alur pengembangan fitur sesuai dengan standar kode dan arsitektur yang telah diterapkan.

## Daftar Isi

1. [Analisis Kebutuhan](#1-analisis-kebutuhan)
2. [Pengembangan Domain Layer](#2-pengembangan-domain-layer)
3. [Pengembangan Application Layer](#3-pengembangan-application-layer)
4. [Implementasi Infrastructure Layer](#4-implementasi-infrastructure-layer)
5. [Pengembangan Presentation Layer - API](#5-pengembangan-presentation-layer---api)
6. [Pengembangan Presentation Layer - UI](#6-pengembangan-presentation-layer---ui)
7. [Integrasi dengan Navigasi](#7-integrasi-dengan-navigasi)
8. [Pengujian](#8-pengujian)
9. [Checklist Deployment](#9-checklist-deployment)

## 1. Analisis Kebutuhan

Sebelum memulai pengembangan, tentukan:

- **Entitas**: Identifikasi entitas baru yang akan dibuat dan atributnya
- **Relasi**: Tentukan relasi entitas dengan entitas lain yang sudah ada
- **Operasi**: Definisikan operasi CRUD dan business logic yang diperlukan
- **UI/UX**: Rancang tampilan menu dan interaksi pengguna

## 2. Pengembangan Domain Layer

### 2.1. Membuat Entitas

Buat kelas entitas baru di direktori `Core/Domain/Entities`:

```csharp
// Contoh: Core/Domain/Entities/Product.cs
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? LastModifiedOn { get; set; }
    public string LastModifiedBy { get; set; }
}
```

### 2.2. Membuat Interface Repository

Definisikan interface repository di direktori `Core/Domain/Interfaces`:

```csharp
// Contoh: Core/Domain/Interfaces/IProductRepository.cs
public interface IProductRepository
{
    Task<List<Product>> GetListAsync();
    Task<int> GetCountAsync();
    Task<Product> GetByIdAsync(Guid id);
    Task<Product> InsertAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Product product);
}
```

### 2.3. Menambahkan Validasi atau Invariant (Opsional)

Jika entitas memerlukan validasi khusus, tambahkan di direktori `Core/Domain/Invariants`:

```csharp
// Contoh: Core/Domain/Invariants/ProductInvariants.cs
public static class ProductInvariants
{
    public static void EnsureValidProduct(this Product product)
    {
        if (string.IsNullOrEmpty(product.Name))
            throw new ArgumentException("Product name cannot be empty");
            
        if (product.Price < 0)
            throw new ArgumentException("Product price cannot be negative");
    }
}
```

## 3. Pengembangan Application Layer

### 3.1. Menyiapkan Struktur Folder

Buat struktur folder untuk fitur baru di direktori `Core/Application/Features`:

```
Core/Application/Features/Products/
├── Commands/
│   ├── CreateProduct/
│   ├── UpdateProduct/
│   └── DeleteProduct/
└── Queries/
    ├── GetProducts/
    └── GetProductById/
```

### 3.2. Membuat DTO/Response Model

Buat model respons untuk entitas di direktori `Core/Application/Features/Products`:

```csharp
// Core/Application/Features/Products/ProductResponse.cs
public class ProductResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
}
```

### 3.3. Implementasi Commands

Buat command dan handler untuk operasi Create, Update, dan Delete:

```csharp
// Core/Application/Features/Products/Commands/CreateProduct/CreateProductCommand.cs
public class CreateProductCommand : IRequest<ServiceResponse<ProductResponse>>
{
    public string Name { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
}

// Core/Application/Features/Products/Commands/CreateProduct/CreateProductCommandHandler.cs
public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ServiceResponse<ProductResponse>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    
    public CreateProductCommandHandler(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }
    
    public async Task<ServiceResponse<ProductResponse>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            Price = request.Price,
            IsActive = true,
            CreatedOn = DateTime.UtcNow,
            CreatedBy = "system" // Ganti dengan user aktif
        };
        
        await _productRepository.InsertAsync(product);
        
        var response = _mapper.Map<ProductResponse>(product);
        return new ServiceResponse<ProductResponse>(response);
    }
}
```

### 3.4. Implementasi Queries

Buat query dan handler untuk operasi Get:

```csharp
// Core/Application/Features/Products/Queries/GetProducts/GetProductsQuery.cs
public class GetProductsQuery : IRequest<ServiceResponse<List<ProductResponse>>>
{
    // Parameter query seperti filter, paging, dll.
}

// Core/Application/Features/Products/Queries/GetProducts/GetProductsQueryHandler.cs
public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, ServiceResponse<List<ProductResponse>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    
    public GetProductsQueryHandler(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }
    
    public async Task<ServiceResponse<List<ProductResponse>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetListAsync();
        var response = _mapper.Map<List<ProductResponse>>(products);
        return new ServiceResponse<List<ProductResponse>>(response);
    }
}
```

### 3.5. Mapper Configuration (AutoMapper)

Tambahkan konfigurasi mapping untuk entitas baru di kelas profile AutoMapper:

```csharp
// Core/Application/Common/Mappings/GeneralProfile.cs
public class GeneralProfile : Profile
{
    public GeneralProfile()
    {
        CreateMap<Product, ProductResponse>();
        // Mapping lainnya
    }
}
```

## 4. Implementasi Infrastructure Layer

### 4.1. Implementasi Repository

Buat implementasi repository di direktori `Infrastructure/Infrastructure/DataAccessManagers`:

```csharp
// Infrastructure/Infrastructure/DataAccessManagers/ProductRepository.cs
public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _dbContext;
    
    public ProductRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<List<Product>> GetListAsync()
    {
        return await _dbContext.Products.ToListAsync();
    }
    
    public async Task<int> GetCountAsync()
    {
        return await _dbContext.Products.CountAsync();
    }
    
    public async Task<Product> GetByIdAsync(Guid id)
    {
        return await _dbContext.Products.FindAsync(id);
    }
    
    public async Task<Product> InsertAsync(Product product)
    {
        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();
        return product;
    }
    
    public async Task UpdateAsync(Product product)
    {
        _dbContext.Entry(product).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }
    
    public async Task DeleteAsync(Product product)
    {
        _dbContext.Products.Remove(product);
        await _dbContext.SaveChangesAsync();
    }
}
```

### 4.2. Update AppDbContext

Tambahkan DbSet untuk entitas baru di `AppDbContext`:

```csharp
// Infrastructure/Infrastructure/DataAccessManagers/AppDbContext.cs
public DbSet<Product> Products { get; set; }
```

### 4.3. Registrasi Dependency Injection

Daftarkan repository baru di konfigurasi dependency injection:

```csharp
// Infrastructure/Infrastructure/DependencyInjection.cs
public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
{
    // Kode yang sudah ada
    
    // Tambahkan repository baru
    services.AddScoped<IProductRepository, ProductRepository>();
    
    return services;
}
```

### 4.4. Database Migration

Buat dan terapkan migrasi database untuk entitas baru:

```bash
# Membuat migrasi
dotnet ef migrations add AddProductEntity --project Infrastructure/Infrastructure --startup-project Presentation/WebAPI

# Menerapkan migrasi
dotnet ef database update --project Infrastructure/Infrastructure --startup-project Presentation/WebAPI
```

## 5. Pengembangan Presentation Layer - API

### 5.1. Membuat Controller API

Buat controller API untuk entitas baru di direktori `Presentation/WebAPI/Controllers`:

```csharp
// Presentation/WebAPI/Controllers/Products/ProductsController.cs
[ApiController]
[Route("api/[controller]")]
public class ProductsController : BaseApiController
{
    [HttpGet]
    [EnableQuery]
    public async Task<ActionResult<ServiceResponse<List<ProductResponse>>>> Get()
    {
        return await Mediator.Send(new GetProductsQuery());
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceResponse<ProductResponse>>> GetById(Guid id)
    {
        return await Mediator.Send(new GetProductByIdQuery { Id = id });
    }
    
    [HttpPost]
    public async Task<ActionResult<ServiceResponse<ProductResponse>>> Create(CreateProductCommand command)
    {
        return await Mediator.Send(command);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<ServiceResponse<ProductResponse>>> Update(Guid id, UpdateProductCommand command)
    {
        command.Id = id;
        return await Mediator.Send(command);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult<ServiceResponse<bool>>> Delete(Guid id)
    {
        return await Mediator.Send(new DeleteProductCommand { Id = id });
    }
}
```

## 6. Pengembangan Presentation Layer - UI

### 6.1. Membuat Struktur Razor Pages

Buat folder dan file Razor Pages untuk menu baru di direktori `Presentation/WebAPI/Pages`:

```
Presentation/WebAPI/Pages/Products/
├── Index.cshtml
├── Index.cshtml.cs
├── Create.cshtml
├── Create.cshtml.cs
├── Edit.cshtml
├── Edit.cshtml.cs
└── Delete.cshtml
└── Delete.cshtml.cs
```

### 6.2. Implementasi Halaman Indeks (Daftar)

Buat halaman indeks untuk menampilkan daftar entitas:

```html
<!-- Presentation/WebAPI/Pages/Products/Index.cshtml -->
@page
@model WebAPI.Pages.Products.IndexModel
@{
    ViewData["Title"] = "Produk";
}

<div id="app">
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Daftar Produk</h4>
            <a href="/Products/Create" class="btn btn-primary">Tambah Baru</a>
        </div>
        <div class="card-body">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Status</th>
                        <th width="150">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td>{{item.code}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.price}}</td>
                        <td>
                            <span v-if="item.isActive" class="badge bg-success">Aktif</span>
                            <span v-else class="badge bg-danger">Tidak Aktif</span>
                        </td>
                        <td>
                            <a :href="'/Products/Edit?id=' + item.id" class="btn btn-sm btn-info">Edit</a>
                            <button @click="deleteItem(item.id)" class="btn btn-sm btn-danger">Hapus</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="text-center" v-if="items.length === 0">
                <p>Tidak ada data</p>
            </div>
        </div>
    </div>
</div>

@section Scripts {
    <script>
        var app = new Vue({
            el: '#app',
            data: {
                items: []
            },
            mounted() {
                this.loadData();
            },
            methods: {
                loadData() {
                    fetch('/api/Products')
                        .then(response => response.json())
                        .then(data => {
                            if (data.succeeded) {
                                this.items = data.data;
                            }
                        });
                },
                deleteItem(id) {
                    if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
                        fetch('/api/Products/' + id, {
                            method: 'DELETE'
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.succeeded) {
                                this.loadData();
                            }
                        });
                    }
                }
            }
        });
    </script>
}
```

### 6.3. Implementasi Halaman Tambah/Edit

Buat halaman form untuk operasi Create dan Edit:

```html
<!-- Presentation/WebAPI/Pages/Products/Create.cshtml -->
@page
@model WebAPI.Pages.Products.CreateModel
@{
    ViewData["Title"] = "Tambah Produk";
}

<div id="app">
    <div class="card">
        <div class="card-header">
            <h4>Tambah Produk Baru</h4>
        </div>
        <div class="card-body">
            <form @submit.prevent="saveData">
                <div class="mb-3">
                    <label class="form-label">Kode</label>
                    <input type="text" class="form-control" v-model="form.code" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nama</label>
                    <input type="text" class="form-control" v-model="form.name" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Deskripsi</label>
                    <textarea class="form-control" v-model="form.description" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Harga</label>
                    <input type="number" class="form-control" v-model="form.price" min="0" required>
                </div>
                <div class="d-flex justify-content-between">
                    <a href="/Products" class="btn btn-secondary">Kembali</a>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>

@section Scripts {
    <script>
        var app = new Vue({
            el: '#app',
            data: {
                form: {
                    code: '',
                    name: '',
                    description: '',
                    price: 0
                }
            },
            methods: {
                saveData() {
                    fetch('/api/Products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.form)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.succeeded) {
                            window.location.href = '/Products';
                        }
                    });
                }
            }
        });
    </script>
}
```

## 7. Integrasi dengan Navigasi

### 7.1. Tambahkan Menu di Navigasi Utama

Update file navigasi di `Presentation/WebAPI/Pages/Shared/_Layout.cshtml` atau file navigasi terkait:

```html
<!-- Presentation/WebAPI/Pages/Shared/_Layout.cshtml -->
<li class="nav-item">
    <a class="nav-link" href="/Products">
        <i class="fas fa-box"></i>
        <span>Produk</span>
    </a>
</li>
```

## 8. Pengujian

### 8.1. Unit Testing

Buat unit test untuk command dan query handler:

```csharp
// Tests/Application.Tests/Features/Products/CreateProductCommandHandlerTests.cs
public class CreateProductCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldCreateProduct_WhenCommandIsValid()
    {
        // Arrange
        var repository = Substitute.For<IProductRepository>();
        var mapper = Substitute.For<IMapper>();
        var handler = new CreateProductCommandHandler(repository, mapper);
        var command = new CreateProductCommand { Name = "Test Product", Code = "P001", Price = 100 };
        
        // Act
        var result = await handler.Handle(command, CancellationToken.None);
        
        // Assert
        await repository.Received(1).InsertAsync(Arg.Any<Product>());
        Assert.True(result.Succeeded);
    }
}
```

### 8.2. Integration Testing

Buat integration test untuk API endpoint:

```csharp
// Tests/WebAPI.IntegrationTests/Controllers/ProductsControllerTests.cs
public class ProductsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    
    public ProductsControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }
    
    [Fact]
    public async Task Get_ShouldReturnProducts()
    {
        // Arrange
        var client = _factory.CreateClient();
        
        // Act
        var response = await client.GetAsync("/api/Products");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ServiceResponse<List<ProductResponse>>>(content);
        Assert.NotNull(result);
        Assert.True(result.Succeeded);
    }
}
```

## 9. Checklist Deployment

Sebelum deployment fitur baru, pastikan:

- [x] Semua unit test dan integration test telah lolos
- [x] Validasi input telah diimplementasikan dengan benar
- [x] Relasi database telah terkonfigurasi dengan benar
- [x] Migrasi database telah diterapkan
- [x] UI responsif dan berfungsi di berbagai perangkat
- [x] Menu navigasi telah ditambahkan
- [x] Izin dan otorisasi telah diterapkan (jika diperlukan)
- [x] Dokumentasi telah diperbarui 