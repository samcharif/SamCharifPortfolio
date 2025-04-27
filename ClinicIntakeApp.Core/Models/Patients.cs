namespace ClinicIntakeApp.Core.Models
{
    public class Patient
    {
        public int Id { get; set; }  // Primary Key

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        public string ReasonForVisit { get; set; } = string.Empty;
    }
}