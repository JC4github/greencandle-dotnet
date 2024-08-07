using greencandle_dotnet.Interfaces;
using Microsoft.AspNetCore.Mvc;
using greencandle_dotnet.Models;

namespace greencandle_dotnet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : Controller
    {
        private readonly IReportRepository _reportRepository;
        public ReportController(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        //GET method for getting reports for a user
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

        //GET method for getting a report by email and ticker match
        [HttpGet("search")]
        [ProducesResponseType(200, Type = typeof(Report))]
        [ProducesResponseType(404)]
        public IActionResult GetReportByEmailAndTicker([FromQuery] string email, [FromQuery] string ticker)
        {
            var report = _reportRepository.GetReportByEmailAndTicker(email, ticker);

            if (report == null)
            {
                return NotFound();
            }
            return Ok(report);
        }

        //POST method for adding a report
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

        //DELETE method for deleting a report
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

        //PUT method for updating a report
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