using Microsoft.AspNetCore.Mvc;
using ChatApp.Data;
using ChatApp.Models;

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

        // GET: api/chatlist
        [HttpGet]
        public IActionResult GetChatList([FromQuery] string currentUser)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var users = _context.Users
                .Where(u => u.Username != currentUser)
                .Select(u => new
                {
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

    }
}
