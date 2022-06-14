using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace OAuthServer
{
    public static class TestUsersConfiguration
    {
        public static IServiceCollection AddTestUsers(this IServiceCollection services, IConfiguration configuration)
        {
            var testUsersFile = configuration.GetValue("IDENTITYSERVER_TESTUSERS_FILE", string.Empty);
            if (!string.IsNullOrEmpty(testUsersFile) && File.Exists(testUsersFile))
            {
                var testUsers = JsonConvert.DeserializeObject<BcscTestUser[]>(File.ReadAllText(testUsersFile));
                if (testUsers.Any())
                {
                    services.AddSingleton<IResourceOwnerPasswordValidator>(sp =>
                    {
                        var env = sp.GetRequiredService<IWebHostEnvironment>();
                        if (env.IsProduction()) return new TestUsersResourceOwnerPasswordValidator(Array.Empty<BcscTestUser>());
                        return new TestUsersResourceOwnerPasswordValidator(testUsers);
                    });
                }
            }
            return services;
        }
    }

    public class TestUsersResourceOwnerPasswordValidator : IResourceOwnerPasswordValidator
    {
        private readonly BcscTestUser[] testUsers;

        public TestUsersResourceOwnerPasswordValidator(BcscTestUser[] testUsers)
        {
            this.testUsers = testUsers;
        }

        public async Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
        {
            await Task.CompletedTask;
            var user = testUsers.Where(u => u.userName.Equals(context.UserName, StringComparison.OrdinalIgnoreCase) && u.password == context.Password).SingleOrDefault();
            if (user == null)
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant, $"incorrect username or password");
            }
            else
            {
                context.Result = new GrantValidationResult(subject: user.sub, authenticationMethod: "custom", claims: user.Claims);
            }
        }
    }

    public class BcscTestUser
    {
        public string sub { get; set; }
        public string userName { get; set; }
        public string password { get; set; }
        public string aud { get; set; }
        public string birthdate { get; set; }
        public BcscTestUserAddress address { get; set; }
        public string iss { get; set; }
        public string given_name { get; set; }
        public string display_name { get; set; }
        public string family_name { get; set; }

        public Claim[] Claims => new[]           {
            new Claim("display_name", display_name),
            new Claim(JwtClaimTypes.GivenName, given_name),
            new Claim(JwtClaimTypes.FamilyName, family_name),
            new Claim(JwtClaimTypes.Email, string.Empty),
            new Claim("birthdate", birthdate),
            new Claim("aud", aud),
            new Claim(JwtClaimTypes.Address, JsonConvert.SerializeObject(address), IdentityServerConstants.ClaimValueTypes.Json)
        };
    }

    public class BcscTestUserAddress
    {
        public string street_address { get; set; }
        public string country { get; set; }
        public string formatted { get; set; }
        public string locality { get; set; }
        public string region { get; set; }
        public string postal_code { get; set; }
    }
}
