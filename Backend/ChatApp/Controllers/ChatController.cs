// Controllers/ChatController.cs
using ChatApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Get only friends of the current user
        [HttpGet("friends/{userId}")]
        public async Task<IActionResult> GetFriends(int userId)
        {
            var friends = await _context.Friendships
                .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) && f.IsAccepted)
                .Select(f => f.RequesterId == userId ? f.Addressee : f.Requester)
                .ToListAsync();

            return Ok(friends);
        }
    }
}
