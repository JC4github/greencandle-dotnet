using Microsoft.EntityFrameworkCore;
using greencandle_dotnet.Models;

namespace greencandle_dotnet.Data
{
    public class ReportContext : DbContext
    {
        public ReportContext(DbContextOptions<ReportContext> options) : base(options)
        {
        }

        public DbSet<Report> Reports { get; set; } = default!;
    }
}
