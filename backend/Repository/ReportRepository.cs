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

        // Method to get all reports for a user
        public IEnumerable<Report> GetAllReportsForUser(string email)
        {
            return _context.Reports.Where(r => r.Email == email).OrderBy(p => p.Id);
        }

        // Method to delete a report for a user
        public void DeleteReportForUser(string id)
        {
            var report = _context.Reports.FirstOrDefault(r => r.Id.ToString() == id);
            if (report != null)
            {
                _context.Reports.Remove(report);
                _context.SaveChanges();
            }
        }

        // Method to add a report for a user
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

        // Method to update a report for a user
        public void UpdateReportForUser(string id, string email, string reportContent, string ticker)
        {
            var report = _context.Reports.FirstOrDefault(r => r.Id.ToString() == id);
            if (report != null)
            {
                report.Email = email;
                report.Content = reportContent;
                report.Ticker = ticker;
                _context.SaveChanges();
            }
        }
    }
}