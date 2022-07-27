using Microsoft.Extensions.Configuration;

namespace EMBC.Tests.Automation.Registrants.StepDefinitions
{
    [Binding]
    public class LoginSteps
    {
        private readonly RegistrationMethod registrationMethod;
        private readonly BCSC bcsc;
        private readonly IEnumerable<BcscUser> bcscUsers;

        public LoginSteps(BrowserDriver driver)
        {
            registrationMethod = new RegistrationMethod(driver.Current);
            bcsc = new BCSC(driver.Current);
            bcscUsers = driver.Configuration.GetSection("users").Get<IEnumerable<BcscUser>>();
        }

        [StepDefinition(@"I start self registration")]
        public void Anonymous()
        {
            registrationMethod.SelfRegister();
        }

        [StepDefinition(@"I log in with BCSC credentials (.*)")]
        public void Bcsc(string userName)
        {
            registrationMethod.Wait();

            registrationMethod.LoginWithBcsc();
            registrationMethod.Wait();

            var user = bcscUsers.SingleOrDefault(u => u.Csn.Equals(userName, StringComparison.OrdinalIgnoreCase));

            if (user == null) throw new InvalidOperationException($"User {userName} not found in the test configuration");

            bcsc.LoginUsingTestCard(user.Csn, user.Passcode);
        }
    }

    public class BcscUser
    {
        public string Csn { get; set; } = null!;
        public string Passcode { get; set; } = null!;
    }
}
