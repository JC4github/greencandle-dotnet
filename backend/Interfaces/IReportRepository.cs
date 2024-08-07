using greencandle_dotnet.Models;

namespace greencandle_dotnet.Interfaces
{
    public interface IReportRepository
    {
        // get all reports for a user
        IEnumerable<Report> GetAllReportsForUser(string email);

        // get a report by email and ticker match
        Report GetReportByEmailAndTicker(string email, string ticker); // New method

        // delete a report for a user
        void DeleteReportForUser(string id);

        // add a report for a user
        void AddReportForUser(string email, string reportContent, string ticker);

        // update a report for a user
        void UpdateReportForUser(string id, string email, string reportContent, string ticker);
    }
}