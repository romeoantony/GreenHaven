using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHaven.API.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderIdentifier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrderIdentifier",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderIdentifier",
                table: "Orders");
        }
    }
}
