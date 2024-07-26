using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using OpenAI.Managers;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels;
using greencandle_dotnet.ReportBeautifier;
using DotNetEnv;
using OpenAI;

namespace greencandle_dotnet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : Controller
    {
        private readonly OpenAIService _api;
        private readonly HttpClient _httpClient;
        private const string ApiUrlTemplate = "https://stockanalysis.com/stocks/{0}/__data.json?x-sveltekit-trailing-slash=1&x-sveltekit-invalidated=001]";

        public AIController()
        {
            Env.Load();
            _api = new OpenAIService(new OpenAiOptions { ApiKey = Environment.GetEnvironmentVariable("GPT_KEY") });
            _httpClient = new HttpClient();
        }

        [HttpGet("{ticker}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetCompletion([FromRoute] string ticker)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var jsonData = await FetchDataFromApi(ticker);
                var extractedValues = ExtractDataFromJson(jsonData);

                if (extractedValues == null)
                {
                    return Ok("Error generating report.");
                }

                var report = await GenerateReport(ticker, extractedValues);
                if (string.IsNullOrEmpty(report))
                {
                    return Ok("Error generating report.");
                }

                var beautifiedReport = HtmlProcessor.Beautify(report);
                var response = new { content = beautifiedReport };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private async Task<string> FetchDataFromApi(string ticker)
        {
            string url = string.Format(ApiUrlTemplate, ticker);

            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }

            throw new HttpRequestException($"Error fetching data from external API: {response.StatusCode}");
        }

        private string[] ExtractDataFromJson(string jsonData)
        {
            using var doc = JsonDocument.Parse(jsonData);
            var root = doc.RootElement;

            if (root.TryGetProperty("nodes", out var nodesElement) && nodesElement.ValueKind == JsonValueKind.Array)
            {
                var secondNode = nodesElement.EnumerateArray().ElementAt(2);

                if (secondNode.TryGetProperty("data", out var dataElement) && dataElement.ValueKind == JsonValueKind.Array)
                {
                    var dataArray = dataElement.EnumerateArray().Skip(1).Take(15).ToList();
                    var defaultValues = new string[] { "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A" };
                    var indices = new int[] { 0, 1, 3, 4, 5, 6, 8, 14 };
                    var extractedValues = new string[indices.Length];

                    for (int i = 0; i < indices.Length; i++)
                    {
                        int index = indices[i];
                        try
                        {
                            extractedValues[i] = dataArray[index].GetString();
                        }
                        catch
                        {
                            extractedValues[i] = defaultValues[i];
                        }
                    }

                    return extractedValues;
                }
            }

            return null;
        }

        private async Task<string> GenerateReport(string ticker, string[] extractedValues)
        {
            var (marketCap, revenue, netIncome, sharesOut, eps, peRatio, dividend, description) = (
                extractedValues[0], extractedValues[1], extractedValues[2], extractedValues[3],
                extractedValues[4], extractedValues[5], extractedValues[6], extractedValues[7]
            );

            string date = DateTime.Now.ToString("MMMM dd, yyyy");

            string css = "<style>/* CSS styles */body {font-family: Arial, sans-serif;line-height: 1.6;}h1 {font-size: 24px;font-weight: bold;margin-bottom: 10px;}h2 {color: #555;font-size: 20px;margin-top: 30px;margin-bottom: 10px;}p {color: #666;font-size: 16px;margin-bottom: 15px;text-align: justify;}ul {list-style-type: none;padding-left: 0;margin-bottom: 15px;}li {margin-bottom: 5px;}table,td {padding-left: 0;margin-bottom: 15px;border: 1px solid;}table {width: 100%;border-collapse: collapse;}td {padding: 4px 0px 4px 10px;}.report-date {text-align: right;margin-top: 0px;margin-bottom: 0px;}</style>";

            string prompt = $@"
                Act as a professional stock market analyst.
                Write me a due diligence report on Ticker symbol {ticker.ToUpper()}, here is some background information on the company: {description}.

                You MUST start with the company's name and their stock symbol, followed by today's date which is {date}, then write 3 sections: Company background, Financial evaluation and conclusion.

                In the company background section talk about what kind of business the company does, how reliable is the leadership team, mention the CEO, CFO and other important figures, followed by its position in the market and how the company stands against other competitors and what could go wrong.

                In the Financial evaluation section use these key metrics to inform the reader of the financial health of the company:
                Market cap: {marketCap}
                Revenue (last 12 month): {revenue}
                Net Income (last 12 months): {netIncome}
                Shares outstanding: {sharesOut}
                EPS (last 12 months): {eps}
                PE ratio: {peRatio}
                Dividend per share: {dividend}

                In the conclusion section wrap up the last two sections and give a holistic evaluation of the company’s future outlook but do not mention if it is a good choice to buy the stock.

                The expected outcome would be a report for the public investor to get a better understanding of the company and for them to make a more educated investment decision.
                In the report you MUST use analytical human-sounding language and do not exceed 800 words. And finally, your output would just be the report; do not include anything else.
                The report MUST follow this format:
                <h1>Due Diligence Report on {ticker.ToUpper()}</h1>
                <h2 class='report-date'>{date}</h2> 
                <h2>Company Background</h2>
                <p>...</p>
                <h2>Financial Evaluation</h2>
                <ul>
                    <li>...</li>
                </ul>
                <p>...</p>
                <h2>Conclusion</h2>
                <p>...</p>
                {css}
            ";

            var completionResult = await _api.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
            {
                Messages = new List<ChatMessage>
                {
                    ChatMessage.FromUser(prompt)
                },
                Model = OpenAI.ObjectModels.Models.Gpt_3_5_Turbo_1106,
            });

            if (completionResult.Successful)
            {
                return completionResult.Choices.First().Message.Content;
            }

            return null;
        }
    }
}
