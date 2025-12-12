using GreenHaven.API.Data;
using GreenHaven.API.DTOs;
using GreenHaven.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GreenHaven.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrderAsync([FromBody] CreateOrderDto createOrderDto, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Received CreateOrder Request. Items: {ItemCount}, Address: {Address}, Phone: {Phone}", 
                createOrderDto?.Items?.Count ?? 0, createOrderDto?.ShippingAddress, createOrderDto?.PhoneNumber);

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null) return Unauthorized();

                if (createOrderDto.Items == null || !createOrderDto.Items.Any())
                {
                    return BadRequest("Order must contain at least one item.");
                }

                // Fix N+1: Fetch all plants in one query
                var plantIds = createOrderDto.Items.Select(i => i.PlantId).ToList();
                var plants = await _context.Plants
                    .Where(p => plantIds.Contains(p.Id))
                    .ToDictionaryAsync(p => p.Id, p => p, cancellationToken);

                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Pending",
                    OrderIdentifier = createOrderDto.OrderIdentifier,
                    ShippingAddress = createOrderDto.ShippingAddress,
                    PhoneNumber = createOrderDto.PhoneNumber,
                    OrderItems = new List<OrderItem>()
                };

                decimal totalAmount = 0;

                foreach (var itemDto in createOrderDto.Items)
                {
                    if (!plants.TryGetValue(itemDto.PlantId, out var plant))
                    {
                        return BadRequest($"Plant with ID {itemDto.PlantId} not found.");
                    }

                    var orderItem = new OrderItem
                    {
                        PlantId = plant.Id,
                        Quantity = itemDto.Quantity,
                        UnitPrice = plant.Price
                    };

                    order.OrderItems.Add(orderItem);
                    totalAmount += plant.Price * itemDto.Quantity;
                }

                order.TotalAmount = totalAmount;

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(cancellationToken);

                return CreatedAtAction(nameof(GetOrderAsync), new { id = order.Id }, new { order.Id, order.TotalAmount, order.Status });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal Server Error during order creation");
                return StatusCode(500, new { message = "Internal Server Error during order creation" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderAsync(int id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var order = await _context.Orders
                .AsNoTracking()
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Plant)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId, cancellationToken);

            if (order == null) return NotFound();

            return Ok(new
            {
                order.Id,
                order.OrderDate,
                order.TotalAmount,
                order.Status,
                order.OrderIdentifier,
                order.Notes,
                order.LastUpdated,
                Items = order.OrderItems.Select(oi => new
                {
                    oi.PlantId,
                    PlantName = oi.Plant != null ? oi.Plant.Name : "Unknown Plant",
                    ImageUrl = oi.Plant != null ? oi.Plant.ImageUrl : null,
                    oi.Quantity,
                    oi.UnitPrice
                })
            });
        }

        [HttpGet("any/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetOrderAdminAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var order = await _context.Orders
                    .AsNoTracking()
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Plant)
                    .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

                if (order == null) return NotFound();

                return Ok(new
                {
                    order.Id,
                    order.OrderDate,
                    order.TotalAmount,
                    order.Status,
                    order.OrderIdentifier,
                    order.Notes,
                    order.LastUpdated,
                    Items = order.OrderItems.Select(oi => new
                    {
                        oi.PlantId,
                        PlantName = oi.Plant != null ? oi.Plant.Name : "Unknown Plant",
                        ImageUrl = oi.Plant != null ? oi.Plant.ImageUrl : null,
                        oi.Quantity,
                        oi.UnitPrice
                    })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetOrderAdmin");
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
        
        [HttpGet]
        public async Task<IActionResult> GetMyOrdersAsync(CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var orders = await _context.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new 
                {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    ItemCount = o.OrderItems.Sum(oi => oi.Quantity)
                })
                .ToListAsync(cancellationToken);

            return Ok(orders);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrdersAsync(CancellationToken cancellationToken)
        {
            var orders = await _context.Orders
                .AsNoTracking()
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new 
                {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    o.OrderIdentifier,
                    o.Notes,
                    o.LastUpdated,
                    UserEmail = o.User.Email,
                    ItemCount = o.OrderItems.Sum(oi => oi.Quantity)
                })
                .ToListAsync(cancellationToken);

            return Ok(orders);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderAsync(int id, [FromBody] UpdateOrderDto updateOrderDto, CancellationToken cancellationToken)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Plant)
                .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

            if (order == null) return NotFound();

            order.Status = updateOrderDto.Status;
            order.OrderIdentifier = updateOrderDto.OrderIdentifier;
            order.Notes = updateOrderDto.Notes;
            order.LastUpdated = DateTime.UtcNow;

            if (updateOrderDto.Items != null)
            {
                decimal totalAmount = 0;
                foreach (var itemDto in updateOrderDto.Items)
                {
                    var existingItem = order.OrderItems.FirstOrDefault(oi => oi.PlantId == itemDto.PlantId);
                    if (existingItem != null)
                    {
                        existingItem.Quantity = itemDto.Quantity;
                        if (existingItem.Quantity <= 0) 
                        {
                             _context.Entry(existingItem).State = EntityState.Deleted;
                        }
                    }
                }
                
                // Recalculate total
                // We need to check current state of items
                foreach(var item in order.OrderItems)
                {
                     if (_context.Entry(item).State != EntityState.Deleted)
                     {
                         totalAmount += item.Quantity * item.UnitPrice;
                     }
                }
                order.TotalAmount = totalAmount;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
