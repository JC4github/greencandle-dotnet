using greencandle_dotnet.Models;

namespace greencandle_dotnet.Interfaces
{
    public interface IReportRepository
    {
        // get all reports for a user
        IEnumerable<Report> GetAllReportsForUser(string email);

        // delete a report for a user
        void DeleteReportForUser(string email, string ticker);

        // add a report for a user
        void AddReportForUser(string email, string reportContent, string ticker);
    
    }
}