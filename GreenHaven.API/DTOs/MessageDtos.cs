using System;

namespace GreenHaven.API.DTOs;

public class SendMessageDto
{
    public string Content { get; set; }
    public string? ReceiverId { get; set; } // Only for Admins replying
}

public class ChatMessageDto
{
    public int Id { get; set; }
    public string SenderId { get; set; }
    public string SenderName { get; set; }
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsFromAdmin { get; set; }
}

public class ConversationDto
{
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string LastMessage { get; set; }
    public DateTime LastMessageTime { get; set; }
    public int UnreadCount { get; set; }
}
