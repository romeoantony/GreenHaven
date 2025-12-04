using System.ComponentModel.DataAnnotations;
using GreenHaven.API.Entities;

namespace GreenHaven.API.DTOs;

public class UpdatePlantDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string ScientificName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Range(0.01, 10000)]
    public decimal Price { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    [Range(0, 10000)]
    public int StockQuantity { get; set; }

    public LightLevel LightRequirement { get; set; }
    public WaterFrequency WaterNeeds { get; set; }
    public bool IsPetFriendly { get; set; }
    public DifficultyLevel Difficulty { get; set; }

    [Required]
    public int CategoryId { get; set; }
}
