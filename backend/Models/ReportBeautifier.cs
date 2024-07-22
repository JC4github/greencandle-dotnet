using System;
using System.Linq;
using System.Text.RegularExpressions;
namespace greencandle_dotnet.ReportBeautifier;

public static class HtmlProcessor
{
    public static string Beautify(string reportHTML)
    {
        // Check if reportHTML contains "<h1>" and "</style>"
        int startIdx = reportHTML.IndexOf("<h1>");
        int endIdx = reportHTML.IndexOf("</style>") + 8;

        if (startIdx == -1 || endIdx == -1)
        {
            throw new ArgumentException("Invalid HTML format: Missing <h1> or </style> tags.");
        }

        string beforeRemovedHTML = reportHTML.Substring(startIdx);
        string afterRemovedHTML = beforeRemovedHTML.Substring(0, endIdx - startIdx);

        // Check if afterRemovedHTML contains "<ul>" and "</ul>"
        string[] ulSplit = afterRemovedHTML.Split(new[] { "<ul>" }, StringSplitOptions.None);
        if (ulSplit.Length < 2)
        {
            throw new ArgumentException("Invalid HTML format: Missing <ul> tag.");
        }

        string[] ulContentSplit = ulSplit[1].Split(new[] { "</ul>" }, StringSplitOptions.None);
        if (ulContentSplit.Length < 2)
        {
            throw new ArgumentException("Invalid HTML format: Missing </ul> tag.");
        }

        string rawUlContents = ulContentSplit[0];
        var rawTableContents = rawUlContents.Split(new[] { "<li>" }, StringSplitOptions.RemoveEmptyEntries)
                                            .Select(content => content.Split(new[] { "</li>" }, StringSplitOptions.None)[0].Trim())
                                            .Select(content => content.Split(new[] { ": " }, StringSplitOptions.None))
                                            .Select(result => new { Stat = result[0], Value = result.Length > 1 ? result[1] : string.Empty })
                                            .ToList();

        // Create the new HTML table
        string newHTML = "<table>";
        foreach (var content in rawTableContents)
        {
            newHTML += $@"
            <tr>
                <td>{content.Stat}</td>
                <td>{content.Value}</td>
            </tr>";
        }
        newHTML += "</table>";

        // Append table to HTML
        string beforeList = ulSplit[0];
        string afterList = ulContentSplit[1];
        string finalHTML = $"{beforeList}\n{newHTML}\n{afterList}";

        return finalHTML;
    }
}