using Microsoft.EntityFrameworkCore;
using TP_BD_P3.Models.Scaffolded;
using TP_BD_P3.Repositories;

var builder = WebApplication.CreateBuilder(args);

// -------------------------
// LEER Y VERIFICAR CONNECTIONSTRING
// -------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Debug: imprimilo para comprobar (eliminalo en producción)
Console.WriteLine("DefaultConnection = " + (string.IsNullOrWhiteSpace(connectionString) ? "<null or empty>" : connectionString));

// Fail fast: si está vacío, lanzamos excepción clara
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found. Check appsettings.json or environment variables.");
}

// -------------------------
// REGISTRAR DbContext
// -------------------------
builder.Services.AddDbContext<TP_BD_P2Context>(options =>
    options.UseSqlServer(connectionString));

// Registrar repositorios y controllers
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
