using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Events
{
    /// <summary>
    /// Save registrant's profile
    /// </summary>
    public class SaveRegistrantCommand : Command
    {
        public RegistrantProfile Profile { get; set; }
    }

    /// <summary>
    /// Updated registrant's verified status
    /// </summary>
    public class SetRegistrantVerificationStatusCommand : Command
    {
        public string RegistrantId { get; set; }
        public bool Verified { get; set; }
    }

    /// <summary>
    /// Link Registrant and Household Member
    /// </summary>
    public class LinkRegistrantCommand : Command
    {
        public string FileId { get; set; }
        public string RegistantId { get; set; }
        public string HouseholdMemberId { get; set; }
    }

    /// <summary>
    /// send an registrant an invite to join the application
    /// </summary>
    public class InviteRegistrantCommand : Command
    {
        public string RegistrantId { get; set; }
        public string Email { get; set; }
        public string RequestingUserId { get; set; }
    }

    /// <summary>
    /// Link Registrant with a user
    /// </summary>
    public class ProcessRegistrantInviteCommand : Command
    {
        public string InviteId { get; set; }
        public string LoggedInUserId { get; set; }
    }

    public class RegistrantProfile
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedByUserId { get; set; }
        public string CreatedByDisplayName { get; set; }
        public DateTime LastModified { get; set; }
        public string LastModifiedUserId { get; set; }
        public string LastModifiedDisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Address PrimaryAddress { get; set; }
        public Address MailingAddress { get; set; }
        public bool RestrictedAccess { get; set; }
        public IEnumerable<SecurityQuestion> SecurityQuestions { get; set; } = Array.Empty<SecurityQuestion>();
        public bool? AuthenticatedUser { get; set; }
        public bool? VerifiedUser { get; set; }
        public bool IsMinor { get; set; }
    }

    public class Address
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string Community { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }

    public class SecurityQuestion
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public bool AnswerChanged { get; set; } = false;
    }
}
