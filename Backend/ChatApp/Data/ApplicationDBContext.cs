//using ChatApp.Models; // 👈 where your entity classes (like User, Message, etc.) will be
using ChatApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        // Constructor
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Example DbSets (tables in database)
        //public DbSet<User> Users { get; set; }
        //public DbSet<Message> Messages { get; set; }

        public DbSet<User> Users { get; set; }

    }
}
