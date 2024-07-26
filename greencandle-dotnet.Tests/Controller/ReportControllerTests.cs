using Xunit;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using greencandle_dotnet.Controllers;
using greencandle_dotnet.Models;
using greencandle_dotnet.Repository;
using greencandle_dotnet.Interfaces;
using System.Collections.Generic;

namespace greencandle_dotnet.Tests.Controller
{
    public class ReportControllerTests
    {
        private readonly IReportRepository _reportRepository;
        private readonly ReportController _reportController;
        public ReportControllerTests()
        {
            
            _reportRepository = A.Fake<IReportRepository>();
            _reportController = new ReportController(_reportRepository);
        }

        // Test the GetReportsForUser method, this method should return all reports for a user if they exist
        [Fact]
        public void GetReportsForUser_ReportsExist_ReturnsOkWithReports()
        {
            // Arrange
            var email = "test@example.com";
            var reports = new List<Report>
            {
                new Report { Email = email, Ticker = "AAPL" },
                new Report { Email = email, Ticker = "MSFT" }
            };

            A.CallTo(() => _reportRepository.GetAllReportsForUser(email))
                .Returns(reports);

            // Act
            var result = _reportController.GetReportsForUser(email) as OkObjectResult;

            // Assert
            Assert.NotNull(result); // Ensure the result is not null
            Assert.Equal(200, result.StatusCode); // Check if the status code is OK (200)
            Assert.Equal(reports, result.Value); // Verify the returned reports are correct
        }
        
        // Test the GetReportsForUser method, this method should return a 400 if the model state is invalid
        [Fact]
        public void GetReportsForUser_ModelStateInvalid_ReturnsBadRequest()
        {
            // Arrange
            var email = "test@example.com";
            _reportController.ModelState.AddModelError("error", "model state invalid"); // Simulate invalid model state

            // Act
            var result = _reportController.GetReportsForUser(email);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result); // Check if the result is BadRequest
            var badRequestResult = result as BadRequestObjectResult;
            Assert.Equal(400, badRequestResult.StatusCode); // Check if the status code is BadRequest (400)
        }

        // Test the GetReportByEmailAndTicker method, this method should return the report if it exists
        [Fact]
        public void GetReportByEmailAndTicker_ReportExists_ReturnsOk()
        {
            // Arrange
            var email = "test@example.com";
            var ticker = "AAPL";
            var report = new Report { Email = email, Ticker = ticker };

            A.CallTo(() => _reportRepository.GetReportByEmailAndTicker(email, ticker))
                .Returns(report);

            // Act
            var result = _reportController.GetReportByEmailAndTicker(email, ticker) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(report, result.Value);
        }
        
        // Test the GetReportByEmailAndTicker method, this method should return a 404 if the report does not exist
        [Fact]
        public void GetReportByEmailAndTicker_ReportDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var email = "test@example.com";
            var ticker = "AAPL";

            A.CallTo(() => _reportRepository.GetReportByEmailAndTicker(email, ticker))
                .Returns(null as Report);

            // Act
            var result = _reportController.GetReportByEmailAndTicker(email, ticker);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        // Test the AddReport method, this method should add a report and return a 201 if successful
        [Fact]
        public void AddReport_ValidReport_ReturnsCreated()
        {
            // Arrange
            var report = new Report
            {
                Email = "test@example.com",
                Content = "Sample report content",
                Ticker = "AAPL"
            };
            
            // Act
            var result = _reportController.AddReport(report) as CreatedAtActionResult;

            // Assert
            Assert.NotNull(result); // Ensure the result is not null
            Assert.Equal(201, result.StatusCode); // Check if the status code is Created (201)
            Assert.Equal(report, result.Value); // Verify the returned report is correct
            A.CallTo(() => _reportRepository.AddReportForUser(report.Email, report.Content, report.Ticker))
                .MustHaveHappened(); // Verify the repository method was called
        }

        // Test the AddReport method, this method should return a 400 if the model state is invalid
        [Fact]
        public void AddReport_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var report = new Report
            {
                Email = "test@example.com",
                Content = "Sample report content",
                Ticker = "AAPL"
            };
            _reportController.ModelState.AddModelError("error", "model state invalid"); // Simulate invalid model state

            // Act
            var result = _reportController.AddReport(report);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result); // Check if the result is BadRequest
            var badRequestResult = result as BadRequestObjectResult;
            Assert.Equal(400, badRequestResult.StatusCode); // Check if the status code is BadRequest (400)
        }

        // Test the DeleteReport method, this method should delete a report and return a 200 if successful
        [Fact]
        public void DeleteReport_ValidId_ReturnsOk()
        {
            // Arrange
            var reportId = "123"; // Sample valid ID

            // Act
            var result = _reportController.DeleteReport(reportId) as OkResult;

            // Assert
            Assert.NotNull(result); // Ensure the result is not null
            Assert.Equal(200, result.StatusCode); // Check if the status code is OK (200)
            A.CallTo(() => _reportRepository.DeleteReportForUser(reportId))
                .MustHaveHappened(); // Verify the repository method was called
        }

        // Test the DeleteReport method, this method should return a 400 if the model state is invalid
        [Fact]
        public void DeleteReport_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var reportId = "123"; // Sample valid ID
            _reportController.ModelState.AddModelError("error", "Model state is invalid"); // Simulate invalid model state

            // Act
            var result = _reportController.DeleteReport(reportId);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result); // Check if the result is BadRequest
            var badRequestResult = result as BadRequestObjectResult;
            Assert.Equal(400, badRequestResult.StatusCode); // Check if the status code is BadRequest (400)
        }

        // Test the UpdateReport method, this method should update a report and return a 200 if successful
        [Fact]
        public void UpdateReport_ValidRequest_ReturnsOk()
        {
            // Arrange
            var reportId = "123"; // Sample valid ID
            var report = new Report
            {
                Email = "test@example.com",
                Content = "Report Content",
                Ticker = "AAPL"
            }; // Sample valid report data

            // Act
            var result = _reportController.UpdateReport(reportId, report) as OkResult;

            // Assert
            Assert.NotNull(result); // Ensure the result is not null
            Assert.Equal(200, result.StatusCode); // Check if the status code is OK (200)
            A.CallTo(() => _reportRepository.UpdateReportForUser(reportId, report.Email, report.Content, report.Ticker))
                .MustHaveHappened(); // Verify the repository method was called
        }

        // Test the UpdateReport method, this method should return a 400 if the model state is invalid
        [Fact]
        public void UpdateReport_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var reportId = "123"; // Sample valid ID
            var report = new Report
            {
                Email = "test@example.com",
                Content = "Report Content",
                Ticker = "AAPL"
            }; // Sample valid report data
            _reportController.ModelState.AddModelError("error", "Model state is invalid"); // Simulate invalid model state

            // Act
            var result = _reportController.UpdateReport(reportId, report);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result); // Check if the result is BadRequest
            var badRequestResult = result as BadRequestObjectResult;
            Assert.Equal(400, badRequestResult.StatusCode); // Check if the status code is BadRequest (400)
        }
    }
}