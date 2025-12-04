using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenHaven.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesAndLastUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdated",
                table: "Orders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastUpdated",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Orders");
        }
    }
}
