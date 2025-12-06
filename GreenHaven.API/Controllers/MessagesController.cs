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

    public MessagesController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // POST: api/messages
    [HttpPost]
    public async Task<ActionResult<ChatMessageDto>> SendMessage(SendMessageDto dto)
    {
        try
        {
            var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine($"SendMessage called. SenderId: {senderId}, Content: {dto.Content}");
            
            var user = await _userManager.FindByIdAsync(senderId);
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

            Console.WriteLine($"Saving message. ConversationUserId: {message.ConversationUserId}");
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();
            Console.WriteLine("Message saved successfully.");

            return Ok(new ChatMessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderName = user.FullName ?? user.UserName,
                Content = message.Content,
                Timestamp = message.Timestamp,
                IsFromAdmin = message.IsFromAdmin
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in SendMessage: {ex.Message} - {ex.StackTrace}");
            return StatusCode(500, $"Internal Server Error: {ex.Message} - {ex.StackTrace}");
        }
    }

    // GET: api/messages/my
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetMyMessages()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var messages = await _context.ChatMessages
            .Include(m => m.Sender)
            .Where(m => m.ConversationUserId == userId)
            .OrderBy(m => m.Timestamp)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender.FullName ?? m.Sender.UserName,
                Content = m.Content,
                Timestamp = m.Timestamp,
                IsFromAdmin = m.IsFromAdmin
            })
            .ToListAsync();

        return messages;
    }

    // GET: api/messages/conversations
    [HttpGet("conversations")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ConversationDto>>> GetConversations()
    {
        Console.WriteLine("GetConversations called.");
        var userIds = await _context.ChatMessages
            .Select(m => m.ConversationUserId)
            .Distinct()
            .ToListAsync();
        
        Console.WriteLine($"Found {userIds.Count} distinct conversation users.");

        var conversations = new List<ConversationDto>();

        foreach (var userId in userIds)
        {
            Console.WriteLine($"Processing user: {userId}");
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) 
            {
                Console.WriteLine($"User {userId} not found.");
                continue;
            }

            var lastMessage = await _context.ChatMessages
                .Where(m => m.ConversationUserId == userId)
                .OrderByDescending(m => m.Timestamp)
                .FirstOrDefaultAsync();

            var unreadCount = await _context.ChatMessages
                .CountAsync(m => m.ConversationUserId == userId && !m.IsRead && !m.IsFromAdmin);

            conversations.Add(new ConversationDto
            {
                UserId = userId,
                UserName = user.FullName ?? user.UserName,
                LastMessage = lastMessage?.Content,
                LastMessageTime = lastMessage?.Timestamp ?? DateTime.MinValue,
                UnreadCount = unreadCount
            });
        }

        return conversations.OrderByDescending(c => c.LastMessageTime).ToList();
    }

    // GET: api/messages/conversations/{userId}
    [HttpGet("conversations/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetConversation(string userId)
    {
        var messages = await _context.ChatMessages
            .Include(m => m.Sender)
            .Where(m => m.ConversationUserId == userId)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();

        // Mark user messages as read
        var unreadMessages = messages.Where(m => !m.IsRead && !m.IsFromAdmin).ToList();
        if (unreadMessages.Any())
        {
            foreach (var msg in unreadMessages)
            {
                msg.IsRead = true;
            }
            await _context.SaveChangesAsync();
        }

        return messages.Select(m => new ChatMessageDto
        {
            Id = m.Id,
            SenderId = m.SenderId,
            SenderName = m.Sender.FullName ?? m.Sender.UserName,
            Content = m.Content,
            Timestamp = m.Timestamp,
            IsFromAdmin = m.IsFromAdmin
        }).ToList();
    }
}
