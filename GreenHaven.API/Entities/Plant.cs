namespace GreenHaven.API.Entities;

public class Plant
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ScientificName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int StockQuantity { get; set; }

    public LightLevel LightRequirement { get; set; }
    public WaterFrequency WaterNeeds { get; set; }
    public bool IsPetFriendly { get; set; }
    public DifficultyLevel Difficulty { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public bool IsDeleted { get; set; } = false;
}

public enum LightLevel { Low, Indirect, Direct }
public enum WaterFrequency { Low, Medium, High }
public enum DifficultyLevel { Beginner, Intermediate, Expert }
