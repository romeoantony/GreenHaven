using GreenHaven.API.DTOs;
using GreenHaven.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GreenHaven.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly GreenHaven.API.Data.AppDbContext _context;

    public UsersController(UserManager<ApplicationUser> userManager, GreenHaven.API.Data.AppDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsersAsync(CancellationToken cancellationToken)
    {
        // Fix N+1: Join Users with UserRoles and Roles
        var usersWithRoles = await _context.Users
            .AsNoTracking()
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.UserName,
                Roles = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id)
                    .Join(_context.Roles,
                        ur => ur.RoleId,
                        r => r.Id,
                        (ur, r) => r.Name)
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        return Ok(usersWithRoles);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUserAsync(string id, [FromBody] UpdateUserDto model)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound("User not found");
        }

        user.FullName = model.FullName;
        user.Email = model.Email;
        user.UserName = model.Email; // Keep UserName in sync with Email

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            // Handle Role Update
            if (!string.IsNullOrEmpty(model.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                if (model.Role == "Admin" && !currentRoles.Contains("Admin"))
                {
                    await _userManager.AddToRoleAsync(user, "Admin");
                }
                else if (model.Role == "User" && currentRoles.Contains("Admin"))
                {
                    await _userManager.RemoveFromRoleAsync(user, "Admin");
                }
            }

            return Ok(new { message = "User updated successfully" });
        }

        return BadRequest(result.Errors);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUserAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound("User not found");
        }

        try
        {
            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "User deleted successfully" });
            }

            return BadRequest(result.Errors);
        }
        catch (DbUpdateException ex)
        {
            // Check for foreign key constraint violation
            if (ex.InnerException != null && ex.InnerException.Message.Contains("REFERENCE constraint"))
            {
                return BadRequest("Cannot delete user because they have associated data (e.g., chat messages or orders).");
            }
            return StatusCode(500, "An error occurred while deleting the user.");
        }
        catch (Exception)
        {
            return StatusCode(500, "An internal server error occurred.");
        }
    }
}

public class UpdateUserDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
}
