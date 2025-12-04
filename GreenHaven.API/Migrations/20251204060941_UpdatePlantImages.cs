using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHaven.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePlantImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImageUrl",
                value: "/SnakePlant.png");

            migrationBuilder.UpdateData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageUrl",
                value: "/SpiderPlant.png");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImageUrl",
                value: "https://placeholder.com/snakeplant.jpg");

            migrationBuilder.UpdateData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageUrl",
                value: "https://placeholder.com/spiderplant.jpg");
        }
    }
}
