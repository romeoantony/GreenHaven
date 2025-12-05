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

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        var userDtos = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.UserName,
                Roles = roles
            });
        }
        return Ok(userDtos);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto model)
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
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound("User not found");
        }

        // Prevent deleting the last admin or specific protected accounts if needed
        // For now, we'll just allow deletion but maybe check if it's the current user?
        // var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        // if (currentUserId == id) return BadRequest("Cannot delete your own account");

        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded)
        {
            return Ok(new { message = "User deleted successfully" });
        }

        return BadRequest(result.Errors);
    }
}

public class UpdateUserDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
}
