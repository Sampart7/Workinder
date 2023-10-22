using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }
        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserLike>()
                .HasKey(key => new { key.SourceUserId, key.TargetUserId });
        
            modelBuilder.Entity<UserLike>()
                .HasOne(source => source.SourceUser)
                .WithMany(like => like.LikedUsers)
                .HasForeignKey(source => source.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserLike>()
                .HasOne(source => source.TargetUser)
                .WithMany(like => like.LikedByUsers)
                .HasForeignKey(source => source.TargetUserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}