using GreenHaven.API.Entities;

namespace GreenHaven.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            var categories = new Category[]
            {
                new Category { Name = "Air Purifying" },
                new Category { Name = "Succulents" },
                new Category { Name = "Flowering" }
            };

            // Ensure categories exist
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(categories);
                context.SaveChanges();
            }
            else
            {
                // Reload categories to get their IDs
                categories = context.Categories.ToArray();
            }

            var airPurifying = context.Categories.FirstOrDefault(c => c.Name == "Air Purifying") ?? categories[0];
            var succulents = context.Categories.FirstOrDefault(c => c.Name == "Succulents") ?? categories[1];
            var flowering = context.Categories.FirstOrDefault(c => c.Name == "Flowering") ?? categories[2];

            var plants = new Plant[]
            {
                new Plant 
                { 
                    Name = "Snake Plant", 
                    ScientificName = "Sansevieria trifasciata",
                    Description = "A hardy plant that thrives in low light.",
                    Price = 499.00m,
                    ImageUrl = "/SnakePlant.png",
                    StockQuantity = 50,
                    LightRequirement = LightLevel.Low,
                    WaterNeeds = WaterFrequency.Low,
                    IsPetFriendly = false,
                    Difficulty = DifficultyLevel.Beginner,
                    Category = airPurifying
                },
                new Plant 
                { 
                    Name = "Spider Plant", 
                    ScientificName = "Chlorophytum comosum",
                    Description = "Easy to grow and produces babies.",
                    Price = 299.00m,
                    ImageUrl = "/SpiderPlant.png",
                    StockQuantity = 30,
                    LightRequirement = LightLevel.Indirect,
                    WaterNeeds = WaterFrequency.Medium,
                    IsPetFriendly = true,
                    Difficulty = DifficultyLevel.Beginner,
                    Category = airPurifying
                },
                new Plant { Name = "Monstera Deliciosa", ScientificName = "Monstera deliciosa", Description = "Famous for its natural leaf holes.", Price = 1299.00m, ImageUrl = "/Monstera.png", StockQuantity = 20, LightRequirement = LightLevel.Indirect, WaterNeeds = WaterFrequency.Medium, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = airPurifying },
                new Plant { Name = "Fiddle Leaf Fig", ScientificName = "Ficus lyrata", Description = "Popular indoor tree with large leaves.", Price = 2499.00m, ImageUrl = "/FiddleLeaf.png", StockQuantity = 15, LightRequirement = LightLevel.Direct, WaterNeeds = WaterFrequency.Medium, IsPetFriendly = false, Difficulty = DifficultyLevel.Expert, Category = airPurifying },
                new Plant { Name = "Peace Lily", ScientificName = "Spathiphyllum", Description = "Beautiful white flowers and air purifying.", Price = 599.00m, ImageUrl = "/PeaceLily.png", StockQuantity = 40, LightRequirement = LightLevel.Low, WaterNeeds = WaterFrequency.High, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = flowering },
                new Plant { Name = "Rubber Plant", ScientificName = "Ficus elastica", Description = "Shiny, dark leaves.", Price = 899.00m, ImageUrl = "/RubberPlant.png", StockQuantity = 25, LightRequirement = LightLevel.Indirect, WaterNeeds = WaterFrequency.Medium, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = airPurifying },
                new Plant { Name = "Aloe Vera", ScientificName = "Aloe barbadensis miller", Description = "Medicinal succulent.", Price = 249.00m, ImageUrl = "/AloeVera.png", StockQuantity = 60, LightRequirement = LightLevel.Direct, WaterNeeds = WaterFrequency.Low, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = succulents },
                new Plant { Name = "Golden Pothos", ScientificName = "Epipremnum aureum", Description = "Fast growing trailing vine.", Price = 299.00m, ImageUrl = "/Pothos.png", StockQuantity = 55, LightRequirement = LightLevel.Low, WaterNeeds = WaterFrequency.Medium, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = airPurifying },
                new Plant { Name = "ZZ Plant", ScientificName = "Zamioculcas zamiifolia", Description = "Extremely drought tolerant.", Price = 799.00m, ImageUrl = "/ZZPlant.png", StockQuantity = 35, LightRequirement = LightLevel.Low, WaterNeeds = WaterFrequency.Low, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = airPurifying },
                new Plant { Name = "Bird of Paradise", ScientificName = "Strelitzia nicolai", Description = "Tropical flair with large leaves.", Price = 1899.00m, ImageUrl = "/BirdOfParadise.png", StockQuantity = 10, LightRequirement = LightLevel.Direct, WaterNeeds = WaterFrequency.High, IsPetFriendly = false, Difficulty = DifficultyLevel.Intermediate, Category = flowering },
                new Plant { Name = "English Ivy", ScientificName = "Hedera helix", Description = "Classic trailing plant.", Price = 399.00m, ImageUrl = "/EnglishIvy.png", StockQuantity = 45, LightRequirement = LightLevel.Indirect, WaterNeeds = WaterFrequency.Medium, IsPetFriendly = false, Difficulty = DifficultyLevel.Intermediate, Category = airPurifying },
                new Plant { Name = "Heartleaf Philodendron", ScientificName = "Philodendron hederaceum", Description = "Heart-shaped leaves.", Price = 449.00m, ImageUrl = "/HeartleafPhilodendron.png", StockQuantity = 40, LightRequirement = LightLevel.Indirect, WaterNeeds = WaterFrequency.Medium, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = airPurifying },
                new Plant { Name = "Jade Plant", ScientificName = "Crassula ovata", Description = "Symbol of good luck.", Price = 599.00m, ImageUrl = "/JadePlant.png", StockQuantity = 30, LightRequirement = LightLevel.Direct, WaterNeeds = WaterFrequency.Low, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = succulents },
                new Plant { Name = "String of Pearls", ScientificName = "Senecio rowleyanus", Description = "Unique cascading succulent.", Price = 649.00m, ImageUrl = "/StringOfPearls.png", StockQuantity = 20, LightRequirement = LightLevel.Indirect, WaterNeeds = WaterFrequency.Low, IsPetFriendly = false, Difficulty = DifficultyLevel.Expert, Category = succulents },
                new Plant { Name = "Bamboo Palm", ScientificName = "Chamaedorea seifrizii", Description = "Pet friendly air purifier.", Price = 1499.00m, ImageUrl = "/BambooPalm.png", StockQuantity = 15, LightRequirement = LightLevel.Low, WaterNeeds = WaterFrequency.High, IsPetFriendly = true, Difficulty = DifficultyLevel.Beginner, Category = airPurifying },
                new Plant { Name = "Chinese Money Plant", ScientificName = "Pilea peperomioides", Description = "Round, coin-like leaves.", Price = 549.00m, ImageUrl = "/ChineseMoneyPlant.png", StockQuantity = 25, LightRequirement = LightLevel.Indirect, WaterNeeds = WaterFrequency.Medium, IsPetFriendly = true, Difficulty = DifficultyLevel.Intermediate, Category = airPurifying },
                new Plant { Name = "Calathea Prayer Plant", ScientificName = "Calathea orbifolia", Description = "Leaves fold up at night.", Price = 999.00m, ImageUrl = "/CalatheaPrayerPlant.png", StockQuantity = 18, LightRequirement = LightLevel.Low, WaterNeeds = WaterFrequency.High, IsPetFriendly = true, Difficulty = DifficultyLevel.Expert, Category = airPurifying },
                new Plant { Name = "Lavender", ScientificName = "Lavandula", Description = "Aromatic and calming.", Price = 399.00m, ImageUrl = "/Lavender.png", StockQuantity = 50, LightRequirement = LightLevel.Direct, WaterNeeds = WaterFrequency.Low, IsPetFriendly = false, Difficulty = DifficultyLevel.Intermediate, Category = flowering },
                new Plant { Name = "Boston Fern", ScientificName = "Nephrolepis exaltata", Description = "Lush and feathery.", Price = 599.00m, ImageUrl = "/BostonFern.png", StockQuantity = 30, LightRequirement = LightLevel.Indirect, WaterNeeds = WaterFrequency.High, IsPetFriendly = true, Difficulty = DifficultyLevel.Intermediate, Category = airPurifying },
                new Plant { Name = "Barrel Cactus", ScientificName = "Echinocactus grusonii", Description = "Round and spiky.", Price = 899.00m, ImageUrl = "/BarrelCactus.png", StockQuantity = 12, LightRequirement = LightLevel.Direct, WaterNeeds = WaterFrequency.Low, IsPetFriendly = false, Difficulty = DifficultyLevel.Beginner, Category = succulents },
                new Plant { Name = "Phalaenopsis Orchid", ScientificName = "Phalaenopsis", Description = "Elegant blooming orchid.", Price = 1199.00m, ImageUrl = "/PeaceLily.png", StockQuantity = 20, LightRequirement = LightLevel.Indirect, WaterNeeds = WaterFrequency.Medium, IsPetFriendly = true, Difficulty = DifficultyLevel.Intermediate, Category = flowering },
                new Plant { Name = "Echeveria", ScientificName = "Echeveria elegans", Description = "Rosette forming succulent.", Price = 249.00m, ImageUrl = "/AloeVera.png", StockQuantity = 40, LightRequirement = LightLevel.Direct, WaterNeeds = WaterFrequency.Low, IsPetFriendly = true, Difficulty = DifficultyLevel.Beginner, Category = succulents }
            };

            if (!context.Plants.Any())
            {
                context.Plants.AddRange(plants);
                context.SaveChanges();
            }
            else
            {
                // Update existing plants with new images and prices
                foreach (var plant in plants)
                {
                    var existingPlant = context.Plants.FirstOrDefault(p => p.Name == plant.Name);
                    if (existingPlant != null)
                    {
                        bool isModified = false;

                        if (existingPlant.ImageUrl != plant.ImageUrl)
                        {
                            existingPlant.ImageUrl = plant.ImageUrl;
                            isModified = true;
                        }

                        if (existingPlant.Price != plant.Price)
                        {
                            existingPlant.Price = plant.Price;
                            isModified = true;
                        }
                    }
                }
                context.SaveChanges();
            }
        }
    }
}
