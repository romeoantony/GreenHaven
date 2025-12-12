using GreenHaven.API.Data;
using GreenHaven.API.DTOs;
using GreenHaven.API.Entities;
using GreenHaven.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GreenHaven.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlantsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IImageService _imageService;
    private readonly ILogger<PlantsController> _logger;

    public PlantsController(AppDbContext context, IImageService imageService, ILogger<PlantsController> logger)
    {
        _context = context;
        _imageService = imageService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlantDto>>> GetPlantsAsync(CancellationToken cancellationToken)
    {
        var plants = await _context.Plants
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted)
            .Select(p => new PlantDto
            {
                Id = p.Id,
                Name = p.Name,
                ScientificName = p.ScientificName,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                StockQuantity = p.StockQuantity,
                LightRequirement = p.LightRequirement,
                WaterNeeds = p.WaterNeeds,
                IsPetFriendly = p.IsPetFriendly,
                Difficulty = p.Difficulty,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty
            })
            .ToListAsync(cancellationToken);

        return Ok(plants);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PlantDto>> GetPlantAsync(int id, CancellationToken cancellationToken)
    {
        var plant = await _context.Plants
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.Id == id && !p.IsDeleted)
            .Select(p => new PlantDto
            {
                Id = p.Id,
                Name = p.Name,
                ScientificName = p.ScientificName,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                StockQuantity = p.StockQuantity,
                LightRequirement = p.LightRequirement,
                WaterNeeds = p.WaterNeeds,
                IsPetFriendly = p.IsPetFriendly,
                Difficulty = p.Difficulty,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (plant == null)
        {
            return NotFound();
        }

        return Ok(plant);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PlantDto>> CreatePlantAsync([FromForm] CreatePlantWithImageDto dto, CancellationToken cancellationToken)
    {
        string imageUrl = "/placeholder.jpg";

        if (dto.ImageFile != null && dto.ImageFile.Length > 0)
        {
            imageUrl = await _imageService.SaveImageAsync(dto.ImageFile);
        }

        var plant = new Plant
        {
            Name = dto.Name,
            ScientificName = dto.ScientificName,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = imageUrl,
            StockQuantity = dto.StockQuantity,
            LightRequirement = dto.LightRequirement,
            WaterNeeds = dto.WaterNeeds,
            IsPetFriendly = dto.IsPetFriendly,
            Difficulty = dto.Difficulty,
            CategoryId = dto.CategoryId
        };

        _context.Plants.Add(plant);
        await _context.SaveChangesAsync(cancellationToken);

        // Fetch back to get Category name if needed, or just map manually
        // For simplicity, we'll return the DTO with the data we have
        var plantDto = new PlantDto
        {
            Id = plant.Id,
            Name = plant.Name,
            ScientificName = plant.ScientificName,
            Description = plant.Description,
            Price = plant.Price,
            ImageUrl = plant.ImageUrl,
            StockQuantity = plant.StockQuantity,
            LightRequirement = plant.LightRequirement,
            WaterNeeds = plant.WaterNeeds,
            IsPetFriendly = plant.IsPetFriendly,
            Difficulty = plant.Difficulty,
            CategoryId = plant.CategoryId,
            // CategoryName would need a fetch or we accept it's null in response for create
        };

        return CreatedAtAction(nameof(GetPlantAsync), new { id = plant.Id }, plantDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePlantAsync(int id, [FromForm] CreatePlantWithImageDto dto, CancellationToken cancellationToken)
    {
        var plant = await _context.Plants.FindAsync(new object[] { id }, cancellationToken);

        if (plant == null)
        {
            return NotFound();
        }

        if (dto.ImageFile != null && dto.ImageFile.Length > 0)
        {
            plant.ImageUrl = await _imageService.SaveImageAsync(dto.ImageFile);
        }

        plant.Name = dto.Name;
        plant.ScientificName = dto.ScientificName;
        plant.Description = dto.Description;
        plant.Price = dto.Price;
        plant.StockQuantity = dto.StockQuantity;
        plant.LightRequirement = dto.LightRequirement;
        plant.WaterNeeds = dto.WaterNeeds;
        plant.IsPetFriendly = dto.IsPetFriendly;
        plant.Difficulty = dto.Difficulty;
        plant.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePlantAsync(int id, CancellationToken cancellationToken)
    {
        var plant = await _context.Plants.FindAsync(new object[] { id }, cancellationToken);
        if (plant == null)
        {
            return NotFound();
        }

        plant.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
