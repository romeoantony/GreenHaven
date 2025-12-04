using GreenHaven.API.Entities;
using System.ComponentModel.DataAnnotations;

namespace GreenHaven.API.DTOs;

public class CreatePlantWithImageDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string ScientificName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public decimal Price { get; set; }

    public IFormFile? ImageFile { get; set; }

    [Required]
    public int StockQuantity { get; set; }

    public LightLevel LightRequirement { get; set; }

    public WaterFrequency WaterNeeds { get; set; }

    public bool IsPetFriendly { get; set; }

    public DifficultyLevel Difficulty { get; set; }

    [Required]
    public int CategoryId { get; set; }
}
