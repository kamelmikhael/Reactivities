using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public static class Seed
    {
        public static async Task SeedActivityData(DataContext context, UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser {DisplayName = "Bob", UserName = "bob", Email = "bob@test.com"},
                    new AppUser {DisplayName = "Tom", UserName = "tom", Email = "tom@test.com"},
                    new AppUser {DisplayName = "Jane", UserName = "jane", Email = "jane@test.com"},
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if(context.Activities.Any()) return;

            var activities = new List<Activity>()
            {
                new Activity
                {
                    Title = "Past Activity #1",
                    Date = DateTime.Now.AddMonths(-2),
                    Description = "Activity 2 months ago",
                    Category = "drinks",
                    City = "London",
                    Venue = "Pub"
                },
                new Activity
                {
                    Title = "Past Activity #2",
                    Date = DateTime.Now.AddMonths(-1),
                    Description = "Activity 1 month ago",
                    Category = "culture",
                    City = "Paris",
                    Venue = "Louvre"
                },
                new Activity
                {
                    Title = "Future Activity #1",
                    Date = DateTime.Now.AddMonths(1),
                    Description = "Activity 1 month in the future",
                    Category = "film",
                    City = "London",
                    Venue = "Cinema"
                },
            };

            await context.Activities.AddRangeAsync(activities);
            await context.SaveChangesAsync();
        }
    }
}
