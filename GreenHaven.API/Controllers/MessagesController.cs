using GreenHaven.API.Data;
using GreenHaven.API.DTOs;
using GreenHaven.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GreenHaven.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<MessagesController> _logger;

    public MessagesController(AppDbContext context, UserManager<ApplicationUser> userManager, ILogger<MessagesController> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    // POST: api/messages
    [HttpPost]
    public async Task<ActionResult<ChatMessageDto>> SendMessageAsync(SendMessageDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(senderId))
            {
                return Unauthorized("User ID not found.");
            }

            _logger.LogInformation("SendMessage called. SenderId: {SenderId}, Content: {Content}", senderId, dto.Content);
            
            var user = await _userManager.FindByIdAsync(senderId);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

            var message = new ChatMessage
            {
                SenderId = senderId,
                Content = dto.Content,
                Timestamp = DateTime.UtcNow,
                IsFromAdmin = isAdmin
            };

            if (isAdmin)
            {
                if (string.IsNullOrEmpty(dto.ReceiverId))
                {
                    return BadRequest("Admins must specify a receiver.");
                }

                message.ReceiverId = dto.ReceiverId;
                message.ConversationUserId = dto.ReceiverId; 
            }
            else
            {
                if (!string.IsNullOrEmpty(dto.ReceiverId))
                {
                    return Forbid("Users can only message admins.");
                }

                message.ReceiverId = null; 
                message.ConversationUserId = senderId; 
            }

            _logger.LogInformation("Saving message. ConversationUserId: {ConversationUserId}", message.ConversationUserId);
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Message saved successfully.");

            return Ok(new ChatMessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderName = user.FullName ?? user.UserName ?? "Unknown",
                Content = message.Content,
                Timestamp = message.Timestamp,
                IsFromAdmin = message.IsFromAdmin
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in SendMessage");
            return StatusCode(500, $"Internal Server Error: {ex.Message}");
        }
    }

    // GET: api/messages/my
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetMyMessagesAsync(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var messages = await _context.ChatMessages
            .AsNoTracking()
            .Include(m => m.Sender)
            .Where(m => m.ConversationUserId == userId)
            .OrderBy(m => m.Timestamp)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender.FullName ?? m.Sender.UserName ?? "Unknown",
                Content = m.Content,
                Timestamp = m.Timestamp,
                IsFromAdmin = m.IsFromAdmin
            })
            .ToListAsync(cancellationToken);

        return Ok(messages);
    }

    // GET: api/messages/conversations
    [HttpGet("conversations")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ConversationDto>>> GetConversationsAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("GetConversations called.");

        // Fix N+1: Group by ConversationUserId in database
        var conversations = await _context.ChatMessages
            .AsNoTracking()
            .GroupBy(m => m.ConversationUserId)
            .Select(g => new
            {
                UserId = g.Key,
                LastMessage = g.OrderByDescending(m => m.Timestamp).FirstOrDefault(),
                UnreadCount = g.Count(m => !m.IsRead && !m.IsFromAdmin)
            })
            .Join(_context.Users,
                  c => c.UserId,
                  u => u.Id,
                  (c, u) => new ConversationDto
                  {
                      UserId = c.UserId,
                      UserName = u.FullName ?? u.UserName,
                      LastMessage = c.LastMessage != null ? c.LastMessage.Content : string.Empty,
                      LastMessageTime = c.LastMessage != null ? c.LastMessage.Timestamp : DateTime.MinValue,
                      UnreadCount = c.UnreadCount
                  })
            .OrderByDescending(c => c.LastMessageTime)
            .ToListAsync(cancellationToken);

        return Ok(conversations);
    }

    // GET: api/messages/conversations/{userId}
    [HttpGet("conversations/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetConversationAsync(string userId, CancellationToken cancellationToken)
    {
        var messages = await _context.ChatMessages
            .Include(m => m.Sender)
            .Where(m => m.ConversationUserId == userId)
            .OrderBy(m => m.Timestamp)
            .ToListAsync(cancellationToken);

        // Mark user messages as read
        var unreadMessages = messages.Where(m => !m.IsRead && !m.IsFromAdmin).ToList();
        if (unreadMessages.Any())
        {
            foreach (var msg in unreadMessages)
            {
                msg.IsRead = true;
            }
            await _context.SaveChangesAsync(cancellationToken);
        }

        return messages.Select(m => new ChatMessageDto
        {
            Id = m.Id,
            SenderId = m.SenderId,
            SenderName = m.Sender.FullName ?? m.Sender.UserName ?? "Unknown",
            Content = m.Content,
            Timestamp = m.Timestamp,
            IsFromAdmin = m.IsFromAdmin
        }).ToList();
    }
}
