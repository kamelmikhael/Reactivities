using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {}

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var activityBuilder = builder.Entity<ActivityAttendee>();
            activityBuilder
                .HasKey(aa => new {aa.ActivityId, aa.AppUserId});
            activityBuilder
                .HasOne(x => x.AppUser)
                .WithMany(x => x.Activities)
                .HasForeignKey(x => x.AppUserId);
            activityBuilder
                .HasOne(x => x.Activity)
                .WithMany(x => x.Attendees)
                .HasForeignKey(x => x.ActivityId);

            var photoBuilder = builder.Entity<Photo>();
            photoBuilder
                .HasOne(x => x.AppUser)
                .WithMany(x => x.Photos)
                .HasForeignKey(x => x.AppUserId);

            
            var commentBuilder = builder.Entity<Comment>();
            commentBuilder
                .HasOne(x => x.Activity)
                .WithMany(x => x.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b => 
            {
                b.HasKey(x => new {x.ObserverId, x.TargetId});
                
                b.HasOne(x => x.Observer)
                 .WithMany(x => x.Followings)
                 .HasForeignKey(x => x.ObserverId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(x => x.Target)
                 .WithMany(x => x.Followers)
                 .HasForeignKey(x => x.TargetId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}