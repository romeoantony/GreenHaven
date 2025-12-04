using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GreenHaven.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveHardcodedSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Plants",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Air Purifying" },
                    { 4, "Succulents" },
                    { 5, "Flowering" }
                });

            migrationBuilder.InsertData(
                table: "Plants",
                columns: new[] { "Id", "CategoryId", "Description", "Difficulty", "ImageUrl", "IsDeleted", "IsPetFriendly", "LightRequirement", "Name", "Price", "ScientificName", "StockQuantity", "WaterNeeds" },
                values: new object[,]
                {
                    { 1, 1, "A hardy plant that thrives in low light.", 0, "/SnakePlant.png", false, false, 0, "Snake Plant", 499.00m, "Sansevieria trifasciata", 50, 0 },
                    { 2, 1, "Easy to grow and produces babies.", 0, "/SpiderPlant.png", false, true, 1, "Spider Plant", 399.00m, "Chlorophytum comosum", 30, 1 },
                    { 3, 1, "Famous for its natural leaf holes.", 0, "/Monstera.png", false, false, 1, "Monstera Deliciosa", 1299.00m, "Monstera deliciosa", 20, 1 },
                    { 4, 1, "Popular indoor tree with large leaves.", 2, "/FiddleLeaf.png", false, false, 2, "Fiddle Leaf Fig", 2499.00m, "Ficus lyrata", 15, 1 },
                    { 5, 5, "Beautiful white flowers and air purifying.", 0, "/PeaceLily.png", false, false, 0, "Peace Lily", 699.00m, "Spathiphyllum", 40, 2 },
                    { 6, 1, "Shiny, dark leaves.", 0, "/RubberPlant.png", false, false, 1, "Rubber Plant", 899.00m, "Ficus elastica", 25, 1 },
                    { 7, 4, "Medicinal succulent.", 0, "/AloeVera.png", false, false, 2, "Aloe Vera", 299.00m, "Aloe barbadensis miller", 60, 0 },
                    { 8, 1, "Fast growing trailing vine.", 0, "/Pothos.png", false, false, 0, "Golden Pothos", 349.00m, "Epipremnum aureum", 55, 1 },
                    { 9, 1, "Extremely drought tolerant.", 0, "/ZZPlant.png", false, false, 0, "ZZ Plant", 799.00m, "Zamioculcas zamiifolia", 35, 0 },
                    { 10, 5, "Tropical flair with large leaves.", 1, "/Monstera.png", false, false, 2, "Bird of Paradise", 1899.00m, "Strelitzia nicolai", 10, 2 },
                    { 11, 1, "Classic trailing plant.", 1, "/Pothos.png", false, false, 1, "English Ivy", 399.00m, "Hedera helix", 45, 1 },
                    { 12, 1, "Heart-shaped leaves.", 0, "/Pothos.png", false, false, 1, "Heartleaf Philodendron", 449.00m, "Philodendron hederaceum", 40, 1 },
                    { 13, 4, "Symbol of good luck.", 0, "/AloeVera.png", false, false, 2, "Jade Plant", 599.00m, "Crassula ovata", 30, 0 },
                    { 14, 4, "Unique cascading succulent.", 2, "/AloeVera.png", false, false, 1, "String of Pearls", 649.00m, "Senecio rowleyanus", 20, 0 },
                    { 15, 1, "Pet friendly air purifier.", 0, "/Monstera.png", false, true, 0, "Bamboo Palm", 1499.00m, "Chamaedorea seifrizii", 15, 2 },
                    { 16, 1, "Round, coin-like leaves.", 1, "/ZZPlant.png", false, true, 1, "Chinese Money Plant", 549.00m, "Pilea peperomioides", 25, 1 },
                    { 17, 1, "Leaves fold up at night.", 2, "/PeaceLily.png", false, true, 0, "Calathea Prayer Plant", 999.00m, "Calathea orbifolia", 18, 2 },
                    { 18, 5, "Aromatic and calming.", 1, "/PeaceLily.png", false, false, 2, "Lavender", 399.00m, "Lavandula", 50, 0 },
                    { 19, 1, "Lush and feathery.", 1, "/SpiderPlant.png", false, true, 1, "Boston Fern", 599.00m, "Nephrolepis exaltata", 30, 2 },
                    { 20, 4, "Round and spiky.", 0, "/AloeVera.png", false, false, 2, "Barrel Cactus", 899.00m, "Echinocactus grusonii", 12, 0 },
                    { 21, 5, "Elegant blooming orchid.", 1, "/PeaceLily.png", false, true, 1, "Phalaenopsis Orchid", 1199.00m, "Phalaenopsis", 20, 1 },
                    { 22, 4, "Rosette forming succulent.", 0, "/AloeVera.png", false, true, 2, "Echeveria", 249.00m, "Echeveria elegans", 40, 0 }
                });
        }
    }
}
