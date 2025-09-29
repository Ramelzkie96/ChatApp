using ChatApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserSearchController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserSearchController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/UserSearch?query=ramel
        [HttpGet]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(new List<object>());

            var users = await _context.Users
                .Where(u => u.Username.Contains(query))
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.ProfilePictureUrl,
                    u.IsOnline
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
