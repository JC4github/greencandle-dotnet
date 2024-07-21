using greencandle_dotnet.Interfaces;
using Microsoft.AspNetCore.Mvc;
using greencandle_dotnet.Models;

namespace greencandle_dotnet.Controllers
{
    // Define the route and specify that this class is a controller
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : Controller
    {
        private readonly IReportRepository _reportRepository;
        public ReportController(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        // Define a GET method for getting reports for a user
        [HttpGet("{email}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Report>))]
        public IActionResult GetReportsForUser([FromRoute] string email)
        {
            var reports = _reportRepository.GetAllReportsForUser(email);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(reports);
        }

        // Define a POST method for adding a report
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(500)]
        public IActionResult AddReport([FromBody] Report report)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _reportRepository.AddReportForUser(report.Email, report.Content, report.Ticker);
            return CreatedAtAction("AddReport", report);
        }

        // Define a DELETE method for deleting a report
        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public IActionResult DeleteReport([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _reportRepository.DeleteReportForUser(id);
            return Ok();
        }

        // Define a PUT method for updating a report
        [HttpPut("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public IActionResult UpdateReport([FromRoute] string id, [FromBody] Report report)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _reportRepository.UpdateReportForUser(id, report.Email, report.Content, report.Ticker);
            return Ok();
        }
    }
}