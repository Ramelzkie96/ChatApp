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
    public class UserMessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserMessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ POST: api/UserMessages/send
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] UserMessage message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.Content))
                return BadRequest("Message content cannot be empty.");

            // ✅ Optional: Validate that sender and receiver exist
            var senderExists = await _context.Users.AnyAsync(u => u.Id == message.SenderId);
            var receiverExists = await _context.Users.AnyAsync(u => u.Id == message.ReceiverId);

            if (!senderExists || !receiverExists)
                return NotFound("Sender or receiver not found.");

            message.SentAt = DateTime.UtcNow;
            _context.UserMessages.Add(message);
            await _context.SaveChangesAsync();

            // Return created message
            return Ok(message);
        }

        // ✅ GET: api/UserMessages/conversation/1/2
        [HttpGet("conversation/{userId}/{otherUserId}")]
        public async Task<IActionResult> GetConversation(int userId, int otherUserId)
        {
            var messages = await _context.UserMessages
                .Where(m =>
                    (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                    (m.SenderId == otherUserId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        // ✅ PUT: api/UserMessages/mark-read/5
        [HttpPut("mark-read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var msg = await _context.UserMessages.FindAsync(id);
            if (msg == null)
                return NotFound();

            msg.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok(msg);
        }
    }
}
