using System;

namespace EMBC.ESS.Shared.Contracts.Teams
{
    public class LogInUserCommand : Query<LogInUserResponse>
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string SourceSystem { get; set; }
    }

    public abstract class LogInUserResponse
    {
    }

    public class SuccessfulLogin : LogInUserResponse
    {
        public UserProfile Profile { get; set; }
    }

    public class FailedLogin : LogInUserResponse
    {
        public string Reason { get; set; }
    }

    public class SignResponderAgreementCommand : Command
    {
        public string UserName { get; set; }
        public DateTime SignatureDate { get; set; }
    }

    public class UserProfile
    {
        public string Id { get; set; }

        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string Role { get; set; }

        public bool RequiredToSignAgreement { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
