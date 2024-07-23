using Microsoft.AspNetCore.Mvc;
using DotNetEnv;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using OpenAI.Managers;
using OpenAI;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels;
using System.Text.Json;
using greencandle_dotnet.ReportBeautifier;

namespace greencandle_dotnet.Controllers
{
    // Define the route and specify that this class is a controller
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : Controller
    {
        private readonly OpenAIService _api;
        public AIController()
        {
            Env.Load();
            _api = new OpenAIService(new OpenAiOptions(){
                ApiKey = Environment.GetEnvironmentVariable("GPT_KEY")
                });
            
        }

        // Define a POST method for getting a completion from the OpenAI API
        [HttpGet("{ticker}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetCompletion([FromRoute] string ticker)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            HttpClient client = new HttpClient();
            string url = $"https://stockanalysis.com/stocks/{ticker}/__data.json?x-sveltekit-trailing-slash=1&x-sveltekit-invalidated=001]";
            
            try 
            {
                HttpResponseMessage responseMessage = await client.GetAsync(url);

                if (responseMessage.IsSuccessStatusCode)
                {
                    string jsonString = await responseMessage.Content.ReadAsStringAsync();
                    JsonDocument doc = JsonDocument.Parse(jsonString);
                    JsonElement root = doc.RootElement;
                    if (root.TryGetProperty("nodes", out JsonElement nodesElement) && nodesElement.ValueKind == JsonValueKind.Array)
                    {
                        // Get the second node
                        JsonElement secondNode = nodesElement.EnumerateArray().ElementAt(2);

                        // Check if the second node has a "data" property
                        if (secondNode.TryGetProperty("data", out JsonElement dataElement) && dataElement.ValueKind == JsonValueKind.Array)
                        {
                            // Extract the first 15 elements from the data array
                            var dataArray = dataElement.EnumerateArray().Skip(1).Take(15).ToList();

                            // Define an array of default values for each field
                            var defaultValues = new string[] { "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A" };

                            // Define an array of indices for the fields
                            int[] indices = new int[] { 0, 1, 3, 4, 5, 6, 8, 14 };

                            // Define an array to hold the extracted values
                            var extractedValues = new string[indices.Length];

                            // Iterate over the indices array and extract values
                            for (int i = 0; i < indices.Length; i++)
                            {
                                int index = indices[i];
                                try
                                {
                                    extractedValues[i] = dataArray[index].GetString();
                                }
                                catch (Exception)
                                {
                                    extractedValues[i] = defaultValues[i];
                                }
                            }

                            // Assign variables from the extracted values
                            var marketCap = extractedValues[0];
                            var revenue = extractedValues[1];
                            var netIncome = extractedValues[2];
                            var sharesOut = extractedValues[3];
                            var eps = extractedValues[4];
                            var peRatio = extractedValues[5];
                            var dividend = extractedValues[6];
                            var description = extractedValues[7];

                            // Get the current date
                            string date = DateTime.Now.ToString("MMMM dd, yyyy");

                            // Predefined CSS styles
                            string css = "<style>/* CSS styles */body {font-family: Arial, sans-serif;line-height: 1.6;}h1 {font-size: 24px;font-weight: bold;margin-bottom: 10px;}h2 {color: #555;font-size: 20px;margin-top: 30px;margin-bottom: 10px;}p {color: #666;font-size: 16px;margin-bottom: 15px;text-align: justify;}ul {list-style-type: none;padding-left: 0;margin-bottom: 15px;}li {margin-bottom: 5px;}table,td {padding-left: 0;margin-bottom: 15px;border: 1px solid;}table {width: 100%;border-collapse: collapse;}td {padding: 4px 0px 4px 10px;}.report-date {text-align: right;margin-top: 0px;margin-bottom: 0px;}</style>";

                            // Build the report generation prompt
                            string reportGenerationPrompt = $@"
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

                            // Generate the report using OpenAI API
                            var completionResult = await _api.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
                            {
                                Messages = new List<ChatMessage>
                                {
                                    ChatMessage.FromUser(reportGenerationPrompt)
                                },
                                Model = OpenAI.ObjectModels.Models.Gpt_3_5_Turbo_1106,
                            });

                            if (completionResult.Successful)
                            {
                                var gptReport = completionResult.Choices.First().Message.Content;

                                //log the report
                                Console.WriteLine(gptReport);
                                // Beautify the report
                                
                                if (string.IsNullOrEmpty(gptReport))
                                {
                                    return Ok("Error generating report.");
                                }

                                var beautifiedReport = HtmlProcessor.Beautify(gptReport);
                                var response = new { content = beautifiedReport };
                                return Ok(response);
                            }
                            return Ok("Error generating report.");
                        }
                    }
                }
                else
                {
                    Console.WriteLine($"Error fetching data from external API: {responseMessage.StatusCode}");
                    return StatusCode((int)responseMessage.StatusCode, "Error fetching data from external API.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching data from external API, exception caught: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("No data found.");
        }
    }
}