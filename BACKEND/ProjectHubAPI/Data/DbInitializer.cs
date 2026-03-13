using ProjectHubAPI.Models;
using System.Linq;

namespace ProjectHubAPI.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Roles.Any())
            {
                context.Roles.AddRange(
                    new Role { Name = "Admin" },
                    new Role { Name = "Manager" },
                    new Role { Name = "Employee" }
                );
                context.SaveChanges();
            }

            if (!context.Users.Any())
            {
                var adminRole = context.Roles.First(r => r.Name == "Admin");
                context.Users.Add(new User
                {
                    Name = "System Admin",
                    Email = "admin@projecthub.com",
                    Password = "Admin123", 
                    RoleId = adminRole.Id
                });
                context.SaveChanges();
            }
        }
    }
}
