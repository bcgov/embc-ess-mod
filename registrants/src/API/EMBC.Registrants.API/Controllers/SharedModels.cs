using System.ComponentModel.DataAnnotations;

namespace EMBC.Registrants.API.Controllers
{
    /// <summary>
    /// Address data with optional lookup code
    /// </summary>
    public class Address
    {
        [Required]
        public string AddressLine1 { get; set; }

        public string? AddressLine2 { get; set; }

        public string? Community { get; set; }
        public string? City { get; set; }

        public string? StateProvince { get; set; }

        [Required]
        public string Country { get; set; }

        public string? PostalCode { get; set; }
    }

    /// <summary>
    /// Profile personal details
    /// </summary>
    public class PersonDetails
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string? Initials { get; set; }
        public string? PreferredName { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string DateOfBirth { get; set; }
    }

    /// <summary>
    /// Profile contact information
    /// </summary>
    public class ContactDetails
    {
        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public bool HidePhoneRequired { get; set; }

        public bool HideEmailRequired { get; set; }
    }

    /// <summary>
    /// Profile security questions
    /// </summary>
    public class SecurityQuestion
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public bool AnswerChanged { get; set; }
    }
}
