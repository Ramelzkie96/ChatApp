using ChatApp.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class UserFriend
{
    public int Id { get; set; }

    [ForeignKey("Requester")]
    public int RequesterId { get; set; }
    public User Requester { get; set; }

    [ForeignKey("Receiver")]
    public int ReceiverId { get; set; }
    public User Receiver { get; set; }

    public string Status { get; set; } = "Pending"; // Requested, Accepted, Blocked
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? AcceptedAt { get; set; }
}
