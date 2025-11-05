using ChatApp.Data;
using ChatApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

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

            var pendingRequests = _context.UserFriendships
                .Include(f => f.User)
                .Include(f => f.Friend)
                .Where(f => f.FriendId == userId && f.Status == "Pending")
                .OrderByDescending(f => f.CreatedAt)
                .ToList()
                .Select(f => new
                {
                    id = f.User.Id,
                    username = f.User.Username,
                    profilePictureUrl = string.IsNullOrEmpty(f.User.ProfilePictureUrl)
                        ? $"{baseUrl}/images/user-image.jpg"
                        : $"{baseUrl}{f.User.ProfilePictureUrl}",
                    lastMessage = "Wants to connect with you",
                    timeAgo = GetTimeAgo(f.CreatedAt),
                    isOnline = f.User.IsOnline,
                    status = f.Status
                })
                .ToList();

            return Ok(pendingRequests);
        }

        // ✅ NEW: GET pending count
        [HttpGet("count/{userId}")]
        public async Task<IActionResult> GetPendingRequestCount(int userId)
        {
            var count = await _context.UserFriendships
                .CountAsync(r => r.FriendId == userId && r.Status == "Pending");

            return Ok(new { count });
        }

        // ✅ POST: api/request/accept
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptRequest([FromBody] AcceptRequestModel model)
        {
            var request = await _context.UserFriendships
                .FirstOrDefaultAsync(f => f.UserId == model.RequesterId && f.FriendId == model.ReceiverId);

            if (request == null)
                return NotFound("Friend request not found.");

            request.Status = "Accepted";
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend request accepted successfully." });
        }

        // ✅ POST: api/request/block
        [HttpPost("block")]
        public async Task<IActionResult> BlockRequest([FromBody] AcceptRequestModel model)
        {
            var request = await _context.UserFriendships
                .FirstOrDefaultAsync(f => f.UserId == model.RequesterId && f.FriendId == model.ReceiverId);

            if (request == null)
                return NotFound("Friend request not found.");

            request.Status = "Blocked";
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "User has been blocked successfully." });
        }

        // 🕒 Helper for Messenger-style time display
        private string GetTimeAgo(DateTime dateTime)
        {
            var now = DateTime.Now;
            var diff = now - dateTime.ToLocalTime();

            if (diff.TotalSeconds < 60)
                return "Just now";
            if (diff.TotalMinutes < 60)
                return $"{Math.Floor(diff.TotalMinutes)} minute{(diff.TotalMinutes >= 2 ? "s" : "")} ago";
            if (diff.TotalHours < 24)
                return $"{Math.Floor(diff.TotalHours)} hour{(diff.TotalHours >= 2 ? "s" : "")} ago";
            if (diff.TotalDays < 7)
                return $"{Math.Floor(diff.TotalDays)} day{(diff.TotalDays >= 2 ? "s" : "")} ago";

            return dateTime.ToLocalTime().ToString("MMM dd, yyyy");
        }

        // ✅ Helper DTO
        public class AcceptRequestModel
        {
            public int RequesterId { get; set; }
            public int ReceiverId { get; set; }
        }
    }
}
