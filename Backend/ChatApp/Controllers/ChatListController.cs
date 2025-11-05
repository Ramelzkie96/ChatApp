using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApp.Data;
using System;
using System.Linq;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatListController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatListController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ 1️⃣ Used in login or general user listing
        // GET: api/chatlist?currentUser=username
        [HttpGet]
        public IActionResult GetChatList([FromQuery] string currentUser)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var users = _context.Users
                .Where(u => u.Username != currentUser)
                .Select(u => new
                {
                    id = u.Id,
                    name = u.Username,
                    lastMessage = "Messages and calls",
                    timeAgo = "just now",
                    avatar = string.IsNullOrEmpty(u.ProfilePictureUrl)
                        ? $"{baseUrl}/images/user-image.jpg"
                        : $"{baseUrl}{u.ProfilePictureUrl}",
                    isOnline = u.IsOnline
                })
                .ToList();

            return Ok(users);
        }

        // ✅ 2️⃣ Used in AllChats.jsx — show all users with messages (even Pending)
        // GET: api/chatlist/{userId}
        [HttpGet("{userId}")]
        public IActionResult GetUserChats(int userId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var chats = _context.UserMessages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .ToList()
                .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Select(group =>
                {
                    var lastMessage = group.OrderByDescending(m => m.SentAt).FirstOrDefault();
                    if (lastMessage == null) return null;

                    // ✅ Get friendship between users
                    var friendship = _context.UserFriendships
                        .FirstOrDefault(f =>
                            (f.UserId == userId && f.FriendId == group.Key) ||
                            (f.FriendId == userId && f.UserId == group.Key));

                    // 🚫 Skip if friendship is Blocked
                    if (friendship != null && friendship.Status == "Blocked")
                        return null;

                    // 🚫 Skip if Pending and current user didn’t send the request
                    if (friendship != null && friendship.Status == "Pending" && friendship.UserId != userId)
                        return null;

                    var otherUser = lastMessage.SenderId == userId
                        ? lastMessage.Receiver
                        : lastMessage.Sender;

                    string lastMessageText = lastMessage.SenderId == userId
                        ? $"You: {lastMessage.Content}"
                        : lastMessage.Content;

                    return new
                    {
                        id = otherUser.Id,
                        username = otherUser.Username,
                        profilePictureUrl = string.IsNullOrEmpty(otherUser.ProfilePictureUrl)
                            ? $"{baseUrl}/images/user-image.jpg"
                            : $"{baseUrl}{otherUser.ProfilePictureUrl}",
                        lastMessage = lastMessageText ?? "",
                        timeAgo = lastMessage.SentAt.ToLocalTime().ToString("yyyy-MM-ddTHH:mm:ss"),
                        isOnline = otherUser.IsOnline,
                        status = friendship != null ? friendship.Status : "NoFriendship"
                    };
                })
                .Where(c => c != null)
                .OrderByDescending(c => c.timeAgo)
                .ToList();

            return Ok(chats);
        }

    }
}
