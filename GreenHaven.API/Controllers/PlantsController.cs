using GreenHaven.API.Data;
using GreenHaven.API.DTOs;
using GreenHaven.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GreenHaven.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlantsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public PlantsController(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Plant>>> GetPlants()
    {
        return await _context.Plants
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Plant>> GetPlant(int id)
    {
        var plant = await _context.Plants
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (plant == null)
        {
            return NotFound();
        }

        return plant;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Plant>> CreatePlant([FromForm] CreatePlantWithImageDto dto)
    {
        string imageUrl = "/placeholder.jpg"; // Default

        if (dto.ImageFile != null && dto.ImageFile.Length > 0)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
            var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", fileName);

            // Ensure directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ImageFile.CopyToAsync(stream);
            }

            imageUrl = $"/{fileName}";
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
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPlant), new { id = plant.Id }, plant);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePlant(int id, [FromForm] CreatePlantWithImageDto dto)
    {
        var plant = await _context.Plants.FindAsync(id);

        if (plant == null)
        {
            return NotFound();
        }

        if (dto.ImageFile != null && dto.ImageFile.Length > 0)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
            var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ImageFile.CopyToAsync(stream);
            }

            plant.ImageUrl = $"/{fileName}";
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

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePlant(int id)
    {
        var plant = await _context.Plants.FindAsync(id);
        if (plant == null)
        {
            return NotFound();
        }

        plant.IsDeleted = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
