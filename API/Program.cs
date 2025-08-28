using System.Text.Json.Serialization;
using API.Contexts;
using API.Interfaces;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.WebHost.ConfigureKestrel((context, options) =>
{
    options.Configure(context.Configuration.GetSection("Kestrel"));
});

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
// Database connection string
var connectionType = builder.Configuration.GetValue<string>("ConnectionType")!;

if (connectionType.Equals("ipv4", StringComparison.CurrentCultureIgnoreCase))
{
    Console.WriteLine("Using IPV4 Connection");
    var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnectionIPV4");
    builder.Services.AddDbContext<PostgresContext>(options =>
    {
        options.UseNpgsql(connectionString);
    });
}
else
{
    Console.WriteLine("Using IPV6 Connection");
    var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnectionIPV6");
    builder.Services.AddDbContext<PostgresContext>(options =>
    {
        options.UseNpgsql(connectionString);
    });
}

// Add Swagger generation
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "My API",
        Version = "v1",
        Description = "A simple example ASP.NET Core Web API"
    });
});

// Dependency injection for repositories
builder.Services.AddScoped<IToyRepository, ToyRepository>();
builder.Services.AddScoped<IToyTypeRepository, ToyTypeRepository>();
builder.Services.AddScoped<IPackageRepository, PackageRepository>();
builder.Services.AddScoped<IPackageRarityTypeRepository, PackageRarityTypeRepository>();
builder.Services.AddScoped<IGiveawayRepository, GiveawayRepository>();
builder.Services.AddScoped<IRarityTypeRepository, RarityTypeRepository>();
builder.Services.AddScoped<IToyService, ToyService>();
builder.Services.AddScoped<IDeletedService, DeletedService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhostClient", policy =>
    {
        policy.WithOrigins("https://pw3v9thc-4286.euw.devtunnels.ms", "http://localhost:5173", "https://localhost:5173", "http://localhost:4286", "https://localhost:4286") // Buraya izin vermek istediğin adresi yaz
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
    // options.AddPolicy("AllowVscodePortClient", policy =>
    // {
    //     policy.WithOrigins("https://pw3v9thc-4286.euw.devtunnels.ms")
    //           .AllowAnyHeader()
    //           .AllowAnyMethod();
    // });
});


var app = builder.Build();
app.UseCors("AllowLocalhostClient");
// app.UseCors("AllowVscodePortClient");

app.UseHttpsRedirection();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
