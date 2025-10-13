using ChatApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/request/{userId}
        [HttpGet("{userId}")]
        public IActionResult GetPendingRequests(int userId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            // ✅ Fetch all pending friendships where current user is the receiver
            var pendingRequests = _context.UserFriendships
                .Include(f => f.User) // sender
                .Include(f => f.Friend) // receiver
                .Where(f => f.FriendId == userId && f.Status == "Pending")
                .Select(f => new
                {
                    id = f.User.Id,
                    username = f.User.Username,
                    profilePictureUrl = string.IsNullOrEmpty(f.User.ProfilePictureUrl)
                        ? $"{baseUrl}/images/user-image.jpg"
                        : $"{baseUrl}{f.User.ProfilePictureUrl}",
                    lastMessage = "Wants to connect with you",
                    timeAgo = f.CreatedAt.ToLocalTime().ToString("MMM dd, yyyy hh:mm tt"),
                    isOnline = f.User.IsOnline
                })
                .ToList();

            return Ok(pendingRequests);
        }
    }
}
