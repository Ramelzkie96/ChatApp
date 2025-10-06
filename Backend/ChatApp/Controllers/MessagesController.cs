using ChatApp.Data;
using ChatApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ POST: api/Messages/send
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            if (message == null)
                return BadRequest("Message cannot be null.");

            // Ensure sender and receiver are valid
            var senderExists = await _context.Users.AnyAsync(u => u.Id == message.SenderId);
            var receiverExists = await _context.Users.AnyAsync(u => u.Id == message.ReceiverId);

            if (!senderExists || !receiverExists)
                return BadRequest("Invalid sender or receiver.");

            message.SentAt = DateTime.UtcNow;

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message.Id,
                message.SenderId,
                message.ReceiverId,
                message.Content,
                message.SentAt,
                message.IsRead
            });
        }

        // ✅ GET: api/Messages/conversation?user1Id=1&user2Id=2
        [HttpGet("conversation")]
        public async Task<IActionResult> GetConversation(int user1Id, int user2Id)
        {
            var messages = await _context.Messages
                .Where(m =>
                    (m.SenderId == user1Id && m.ReceiverId == user2Id) ||
                    (m.SenderId == user2Id && m.ReceiverId == user1Id))
                .OrderBy(m => m.SentAt)
                .Select(m => new
                {
                    m.Id,
                    m.Content,
                    m.SentAt,
                    m.SenderId,
                    m.ReceiverId,
                    m.IsRead
                })
                .ToListAsync();

            return Ok(messages);
        }
    }
}
