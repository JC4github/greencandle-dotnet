using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace greencandle_dotnet.Migrations
{
    /// <inheritdoc />
    public partial class AddTicker : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ticker",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ticker",
                table: "Reports");
        }
    }
}
