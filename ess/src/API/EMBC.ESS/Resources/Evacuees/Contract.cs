using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Evacuees
{
    public interface IEvacueesRepository
    {
        Task<ManageEvacueeCommandResult> Manage(ManageEvacueeCommand cmd);

        Task<EvacueeQueryResult> Query(EvacueeQuery query);
    }

    public interface IInvitationRepository
    {
        Task<ManageInvitationCommandResult> Manage(ManageInvitationCommand cmd);

        Task<InvitationQueryResult> Query(InvitationQuery query);
    }

    public abstract class ManageEvacueeCommand
    { }

    public class ManageEvacueeCommandResult
    {
        public string EvacueeId { get; set; }
    }

    public class EvacueeQuery
    {
        public string EvacueeId { get; set; }
        public string UserId { get; set; }
        public bool MaskSecurityAnswers { get; set; } = true;
    }

    public class EvacueeQueryResult
    {
        public IEnumerable<Evacuee> Items { get; set; }
    }

    public class SaveEvacuee : ManageEvacueeCommand
    {
        [Required]
        public Evacuee Evacuee { get; set; }
    }

    public class DeleteEvacuee : ManageEvacueeCommand
    {
        [Required]
        public string Id { get; set; }
    }

    public abstract class ManageInvitationCommand
    { }

    public class ManageInvitationCommandResult
    {
        public string InviteId { get; set; }
    }

    public abstract class InvitationQuery
    { }

    public class InvitationQueryResult
    {
        public IEnumerable<Invitation> Items { get; set; }
    }

    public class CreateNewEmailInvitation : ManageInvitationCommand
    {
        [Required]
        public string EvacueeId { get; set; } = null!;

        [Required]
        public string Email { get; set; }

        public string? RequestingUserId { get; set; }

        [Required]
        public DateTime InviteDate { get; set; }
    }

    public class CompleteInvitation : ManageInvitationCommand
    {
        [Required]
        public string EvacueeId { get; set; }

        [Required]
        public string InviteId { get; set; }
    }

    public class EmailInvitationQuery : InvitationQuery
    {
        public string InviteId { get; set; }
    }

    public class Evacuee
    {
        public string? Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedByUserId { get; set; }
        public string CreatedByDisplayName { get; set; }
        public DateTime LastModified { get; set; }
        public string LastModifiedUserId { get; set; }
        public string LastModifiedDisplayName { get; set; }
        public bool? Authenticated { get; set; }
        public bool? Verified { get; set; }
        public bool Minor { get; set; }
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
        public IEnumerable<SecurityQuestion> SecurityQuestions { get; set; }
        public string? UserId { get; set; }
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
        public bool AnswerIsMasked { get; set; } = true;
    }

    public class Invitation
    {
        public string InviteId { get; set; }
        public string EvacueeId { get; set; }
        public DateTime ExpiryDate { get; set; }
    }

    public enum InvitationStatus
    {
        Active,
        Used,
        Expired
    }
}
