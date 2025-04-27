using ClinicIntakeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicIntakeApp.Data.DataContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

        public DbSet<Patient> Patients { get; set; }
    }
}