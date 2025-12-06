using GreenHaven.API.Controllers;
using GreenHaven.API.Data;
using GreenHaven.API.DTOs;
using GreenHaven.API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;
using Xunit;

namespace GreenHaven.Tests;

public class MessagesControllerTests
{
    private readonly AppDbContext _context;
    private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
    private readonly MessagesController _controller;

    public MessagesControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);

        var store = new Mock<IUserStore<ApplicationUser>>();
        _mockUserManager = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);

        _controller = new MessagesController(_context, _mockUserManager.Object);
    }

    private void SetupUser(string userId, string role)
    {
        var user = new ApplicationUser { Id = userId, UserName = "testuser" };
        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);
        _mockUserManager.Setup(x => x.IsInRoleAsync(user, "Admin")).ReturnsAsync(role == "Admin");

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId)
        };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    [Fact]
    public async Task SendMessage_UserToAdmin_Success()
    {
        // Arrange
        var userId = "user1";
        SetupUser(userId, "User");
        var dto = new SendMessageDto { Content = "Hello Admin" };

        // Act
        var result = await _controller.SendMessage(dto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnDto = Assert.IsType<ChatMessageDto>(createdResult.Value);
        Assert.Equal("Hello Admin", returnDto.Content);
        Assert.False(returnDto.IsFromAdmin);

        var messageInDb = await _context.ChatMessages.FirstAsync();
        Assert.Equal(userId, messageInDb.SenderId);
        Assert.Null(messageInDb.ReceiverId); // Should be null for Admin
        Assert.Equal(userId, messageInDb.ConversationUserId);
    }

    [Fact]
    public async Task SendMessage_UserToOtherUser_Forbidden()
    {
        // Arrange
        var userId = "user1";
        SetupUser(userId, "User");
        var dto = new SendMessageDto { Content = "Hello User", ReceiverId = "user2" };

        // Act
        var result = await _controller.SendMessage(dto);

        // Assert
        var forbidResult = Assert.IsType<ForbidResult>(result.Result);
    }

    [Fact]
    public async Task SendMessage_AdminToUser_Success()
    {
        // Arrange
        var adminId = "admin1";
        var userId = "user1";
        SetupUser(adminId, "Admin");
        var dto = new SendMessageDto { Content = "Hello User", ReceiverId = userId };

        // Act
        var result = await _controller.SendMessage(dto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnDto = Assert.IsType<ChatMessageDto>(createdResult.Value);
        Assert.True(returnDto.IsFromAdmin);

        var messageInDb = await _context.ChatMessages.FirstAsync();
        Assert.Equal(adminId, messageInDb.SenderId);
        Assert.Equal(userId, messageInDb.ReceiverId);
        Assert.Equal(userId, messageInDb.ConversationUserId);
    }

    [Fact]
    public async Task SendMessage_AdminWithoutReceiver_BadRequest()
    {
        // Arrange
        var adminId = "admin1";
        SetupUser(adminId, "Admin");
        var dto = new SendMessageDto { Content = "Hello User" }; // Missing ReceiverId

        // Act
        var result = await _controller.SendMessage(dto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("Admins must specify a receiver.", badRequestResult.Value);
    }
}
