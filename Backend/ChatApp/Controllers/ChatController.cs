using ChatApp.Data;
using ChatApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Existing friends list (still works)
        [HttpGet("friends/{userId}")]
        public async Task<IActionResult> GetChatFriends(int userId)
        {
            var friendIds = await _context.UserMessages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .Select(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Distinct()
                .ToListAsync();

            var friends = await _context.Users
                .Where(u => friendIds.Contains(u.Id))
                .Select(u => new
                {
                    id = u.Id,
                    username = u.Username,
                    profilePictureUrl = u.ProfilePictureUrl,
                    isOnline = u.IsOnline,
                    lastMessageData = _context.UserMessages
                        .Where(m =>
                            (m.SenderId == userId && m.ReceiverId == u.Id) ||
                            (m.SenderId == u.Id && m.ReceiverId == userId))
                        .OrderByDescending(m => m.SentAt)
                        .Select(m => new
                        {
                            m.Content,
                            m.SenderId,
                            m.SentAt
                        })
                        .FirstOrDefault(),
                })
                .ToListAsync();

            var result = friends.Select(f =>
            {
                string formattedMessage = f.lastMessageData == null
                    ? null
                    : f.lastMessageData.SenderId == userId
                        ? $"You: {f.lastMessageData.Content}"
                        : f.lastMessageData.Content;

                return new
                {
                    f.id,
                    f.username,
                    f.profilePictureUrl,
                    f.isOnline,
                    lastMessage = formattedMessage ?? "No messages yet",
                    timeAgo = f.lastMessageData?.SentAt
                };
            });

            return Ok(result);
        }

        // ✅ Chats initiated by you (AllChats)
        [HttpGet("all-chats/{userId}")]
        public async Task<IActionResult> GetAllChats(int userId)
        {
            var chats = await _context.UserMessages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Select(g => g.OrderByDescending(m => m.SentAt).FirstOrDefault())
                .ToListAsync();

            var allChats = await _context.Users
                .Where(u => chats.Select(c => c.SenderId == userId ? c.ReceiverId : c.SenderId).Contains(u.Id))
                .Select(u => new
                {
                    id = u.Id,
                    username = u.Username,
                    profilePictureUrl = u.ProfilePictureUrl,
                    isOnline = u.IsOnline,
                    lastMessageData = _context.UserMessages
                        .Where(m =>
                            (m.SenderId == userId && m.ReceiverId == u.Id) ||
                            (m.SenderId == u.Id && m.ReceiverId == userId))
                        .OrderByDescending(m => m.SentAt)
                        .Select(m => new
                        {
                            m.Content,
                            m.SenderId,
                            m.SentAt
                        })
                        .FirstOrDefault(),
                })
                .ToListAsync();

            var result = allChats
                .Where(c => c.lastMessageData != null && c.lastMessageData.SenderId == userId)
                .Select(c => new
                {
                    c.id,
                    c.username,
                    c.profilePictureUrl,
                    c.isOnline,
                    lastMessage = $"You: {c.lastMessageData.Content}",
                    timeAgo = c.lastMessageData.SentAt
                });

            return Ok(result);
        }

        // ✅ Requests (when others messaged you first)
        [HttpGet("requests/{userId}")]
        public async Task<IActionResult> GetChatRequests(int userId)
        {
            // Find all distinct senders who messaged current user
            var incomingMessages = await _context.UserMessages
                .Where(m => m.ReceiverId == userId)
                .GroupBy(m => m.SenderId)
                .Select(g => g.OrderByDescending(m => m.SentAt).FirstOrDefault())
                .ToListAsync();

            // Only include users where current user has never sent a message to them
            var requestSenders = incomingMessages
                .Where(m => !_context.UserMessages.Any(x => x.SenderId == userId && x.ReceiverId == m.SenderId))
                .Select(m => m.SenderId)
                .Distinct()
                .ToList();

            var requests = await _context.Users
                .Where(u => requestSenders.Contains(u.Id))
                .Select(u => new
                {
                    id = u.Id,
                    username = u.Username,
                    profilePictureUrl = u.ProfilePictureUrl,
                    isOnline = u.IsOnline,
                    lastMessageData = _context.UserMessages
                        .Where(m => m.SenderId == u.Id && m.ReceiverId == userId)
                        .OrderByDescending(m => m.SentAt)
                        .Select(m => new
                        {
                            m.Content,
                            m.SentAt
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();

            var result = requests.Select(r => new
            {
                r.id,
                r.username,
                r.profilePictureUrl,
                r.isOnline,
                lastMessage = r.lastMessageData?.Content ?? "New message request",
                timeAgo = r.lastMessageData?.SentAt
            });

            return Ok(result);
        }
    }
}
