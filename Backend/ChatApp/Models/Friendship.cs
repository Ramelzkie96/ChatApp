namespace ChatApp.Models
{
    public class Friendship
    {
        public int Id { get; set; }

        public int RequesterId { get; set; }
        public User Requester { get; set; }

        public int AddresseeId { get; set; }
        public User Addressee { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsAccepted { get; set; } = false;
    }
}
