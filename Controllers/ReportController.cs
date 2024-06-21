using greencandle_dotnet.Interfaces;
using Microsoft.AspNetCore.Mvc;
using greencandle_dotnet.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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
    }
}