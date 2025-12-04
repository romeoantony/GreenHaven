using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GreenHaven.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Plants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScientificName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    LightRequirement = table.Column<int>(type: "int", nullable: false),
                    WaterNeeds = table.Column<int>(type: "int", nullable: false),
                    IsPetFriendly = table.Column<bool>(type: "bit", nullable: false),
                    Difficulty = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Plants_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Air Purifying" },
                    { 2, "Low Light" },
                    { 3, "Pet Friendly" }
                });

            migrationBuilder.InsertData(
                table: "Plants",
                columns: new[] { "Id", "CategoryId", "Description", "Difficulty", "ImageUrl", "IsPetFriendly", "LightRequirement", "Name", "Price", "ScientificName", "StockQuantity", "WaterNeeds" },
                values: new object[,]
                {
                    { 1, 1, "A hardy plant that thrives in low light.", 0, "https://placeholder.com/snakeplant.jpg", false, 0, "Snake Plant", 15.99m, "Sansevieria trifasciata", 50, 0 },
                    { 2, 3, "Easy to grow and produces babies.", 0, "https://placeholder.com/spiderplant.jpg", true, 1, "Spider Plant", 12.50m, "Chlorophytum comosum", 30, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Plants_CategoryId",
                table: "Plants",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Plants");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
