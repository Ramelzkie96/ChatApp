using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Models
{
    public class UserFriendship
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int FriendId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // new — nullable because existing rows won't have a value
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }

        [ForeignKey(nameof(FriendId))]
        public virtual User? Friend { get; set; }
    }
}
