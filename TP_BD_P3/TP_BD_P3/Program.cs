using Microsoft.EntityFrameworkCore;
using TP_BD_P3.Models.Scaffolded;
using TP_BD_P3.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ---------- ConnectionString ----------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine("DefaultConnection = " + (string.IsNullOrWhiteSpace(connectionString) ? "<null or empty>" : connectionString));
if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found. Check appsettings.json or environment variables.");

// ---------- DbContext ----------
builder.Services.AddDbContext<TP_BD_P2Context>(options =>
    options.UseSqlServer(connectionString));

// ---------- Repos / Controllers ----------
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        // camelCase para que en JS veas tipoCliente, totalVentas, etc.
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// ---------- CORS ----------
const string FrontendCors = "FrontendCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: FrontendCors, policy =>
    {
        policy
            .WithOrigins(
                "http://127.0.0.1:5500", // Live Server
                "http://localhost:5500",
                "http://localhost:5173",  // Vite (opcional)
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        // .AllowCredentials(); // solo si vas a usar cookies/autenticación
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Si tu página corre en HTTP, podés dejar esto.
// Si te complica en local, podés comentar temporalmente la redirección HTTPS.
app.UseHttpsRedirection();

// ---------- CORS en el pipeline (debe ir antes de MapControllers) ----------
app.UseCors(FrontendCors);

app.UseAuthorization();
app.MapControllers();
app.Run();










//using Microsoft.EntityFrameworkCore;
//using TP_BD_P3.Models.Scaffolded;
//using TP_BD_P3.Repositories;

//var builder = WebApplication.CreateBuilder(args);

//// -------------------------
//// LEER Y VERIFICAR CONNECTIONSTRING
//// -------------------------
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//// Debug: imprimilo para comprobar (eliminalo en producción)
//Console.WriteLine("DefaultConnection = " + (string.IsNullOrWhiteSpace(connectionString) ? "<null or empty>" : connectionString));

//// Fail fast: si está vacío, lanzamos excepción clara
//if (string.IsNullOrWhiteSpace(connectionString))
//{
//    throw new InvalidOperationException("Connection string 'DefaultConnection' not found. Check appsettings.json or environment variables.");
//}

//// -------------------------
//// REGISTRAR DbContext
//// -------------------------
//builder.Services.AddDbContext<TP_BD_P2Context>(options =>
//    options.UseSqlServer(connectionString));

//// Registrar repositorios y controllers
//builder.Services.AddScoped<IReportRepository, ReportRepository>();
//builder.Services.AddControllers()
//    .AddJsonOptions(opts =>
//    {
//        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
//    });

//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();
//app.UseAuthorization();
//app.MapControllers();
//app.Run();
