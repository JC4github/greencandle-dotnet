using greencandle_dotnet.Data;
using Microsoft.EntityFrameworkCore;
using greencandle_dotnet.Interfaces;
using greencandle_dotnet.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddControllers();

if (builder.Environment.IsDevelopment())
{
    // builder.Services.AddDbContext<ReportContext>(options => 
    //     options.UseInMemoryDatabase("Report"));

    builder.Services.AddDbContext<ReportContext>(options => 
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string not found")));
} 
else 
{
    builder.Services.AddDbContext<ReportContext>(options => 
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string not found")));
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
