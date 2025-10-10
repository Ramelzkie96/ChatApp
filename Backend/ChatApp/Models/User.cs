namespace ChatApp.Models
{
    public class User
    {
        public int Id { get; set; }  // Primary Key
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; } // hashed, not plain text

        // ✅ Profile Picture URL (default if none is uploaded)
        public string ProfilePictureUrl { get; set; } = "/images/user-image.jpg";

        // ✅ New: Online/Offline status
        public bool IsOnline { get; set; } = false;


    }
}
