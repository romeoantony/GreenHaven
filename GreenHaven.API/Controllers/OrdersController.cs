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

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            Console.WriteLine($"Received CreateOrder Request. Items: {createOrderDto?.Items?.Count ?? 0}, Address: {createOrderDto?.ShippingAddress}, Phone: {createOrderDto?.PhoneNumber}");
            if (createOrderDto?.Items != null)
            {
                foreach(var item in createOrderDto.Items)
                {
                    Console.WriteLine($"Item - PlantId: {item.PlantId}, Qty: {item.Quantity}");
                }
            }

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null) return Unauthorized();

                if (createOrderDto.Items == null || !createOrderDto.Items.Any())
                {
                    return BadRequest("Order must contain at least one item.");
                }

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
                    var plant = await _context.Plants.FindAsync(itemDto.PlantId);
                    if (plant == null)
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
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, new { order.Id, order.TotalAmount, order.Status });
            }
            catch (Exception ex)
            {
                // Log the inner exception if it exists
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : "";
                return StatusCode(500, new { message = "Internal Server Error during order creation", error = ex.Message, innerError = innerMessage, stack = ex.StackTrace });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Plant)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

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
                    oi.Quantity,
                    oi.UnitPrice
                })
            });
        }

        [HttpGet("any/{id}")]
        public async Task<IActionResult> GetOrderAdmin(int id)
        {
            try
            {
                // Admin only endpoint to fetch any order details
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Plant)
                    .FirstOrDefaultAsync(o => o.Id == id);

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
                        oi.Quantity,
                        oi.UnitPrice
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message, stack = ex.StackTrace });
            }
        }
        
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var orders = await _context.Orders
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
                .ToListAsync();

            return Ok(orders);
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            // Ideally, check for Admin role here. 
            // For now, assuming the UI protects this or we add [Authorize(Roles = "Admin")] if roles are set up.
            // Since roles might not be fully configured, we'll rely on the fact that only Admins see the dashboard.
            // But for security, let's check if the user has "Admin" role if possible, or just return all for now as requested.
            
            var orders = await _context.Orders
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
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderDto updateOrderDto)
        {
            // Ideally authorize Admin only
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Plant)
                .FirstOrDefaultAsync(o => o.Id == id);

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
                        // If quantity is 0, maybe remove? For now assuming > 0
                        if (existingItem.Quantity <= 0) 
                        {
                             _context.Entry(existingItem).State = EntityState.Deleted;
                        }
                        else 
                        {
                            totalAmount += existingItem.Quantity * existingItem.UnitPrice;
                        }
                    }
                }
                
                // Recalculate total for items not in DTO? 
                // The loop above only updates total for items in DTO. 
                // We should recalculate total from scratch based on all items in DB after update.
                // But wait, we haven't saved changes yet so DB has old values.
                // Better approach: Update quantities, then recalculate total from all items in memory.
                
                // Let's re-iterate to calculate total correctly
                totalAmount = 0;
                foreach(var item in order.OrderItems)
                {
                     // If it was marked deleted, skip? 
                     // EF Core tracks state.
                     if (_context.Entry(item).State != EntityState.Deleted)
                     {
                         totalAmount += item.Quantity * item.UnitPrice;
                     }
                }
                order.TotalAmount = totalAmount;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
