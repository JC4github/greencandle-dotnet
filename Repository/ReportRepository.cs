using greencandle_dotnet.Interfaces;
using greencandle_dotnet.Data;
using greencandle_dotnet.Models;

namespace greencandle_dotnet.Repository
{
    public class ReportRepository : IReportRepository
    {
        private readonly ReportContext _context;

        public ReportRepository(ReportContext context)
        {
            _context = context;
        }

        // implement the interface methods
        public IEnumerable<Report> GetAllReportsForUser(string email)
        {
            return _context.Reports.Where(r => r.Email == email).OrderBy(p => p.Id);
        }

        public void DeleteReportForUser(string email, string ticker)
        {
            var report = _context.Reports.FirstOrDefault(r => r.Email == email && r.Ticker == ticker);
            if (report != null)
            {
                _context.Reports.Remove(report);
                _context.SaveChanges();
            }
        }

        public void AddReportForUser(string email, string reportContent, string ticker)
        {
            var report = new Report
            {
                Email = email,
                Content = reportContent,
                Ticker = ticker
            };
            _context.Reports.Add(report);
            _context.SaveChanges();
        }
    }
}