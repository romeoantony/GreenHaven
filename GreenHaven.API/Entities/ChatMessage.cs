using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHaven.API.Entities;

public class ChatMessage
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string SenderId { get; set; }
    [ForeignKey("SenderId")]
    public ApplicationUser Sender { get; set; }

    // If ReceiverId is null, it's a message to Admins
    public string? ReceiverId { get; set; }
    [ForeignKey("ReceiverId")]
    public ApplicationUser? Receiver { get; set; }

    // The user this conversation belongs to (grouping key)
    [Required]
    public string ConversationUserId { get; set; }
    [ForeignKey("ConversationUserId")]
    public ApplicationUser ConversationUser { get; set; }

    [Required]
    public string Content { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;
    
    public bool IsFromAdmin { get; set; }
}
