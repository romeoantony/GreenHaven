using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHaven.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePlantPrices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 1,
                column: "Price",
                value: 499.00m);

            migrationBuilder.UpdateData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 2,
                column: "Price",
                value: 399.00m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 1,
                column: "Price",
                value: 15.99m);

            migrationBuilder.UpdateData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 2,
                column: "Price",
                value: 12.50m);
        }
    }
}
