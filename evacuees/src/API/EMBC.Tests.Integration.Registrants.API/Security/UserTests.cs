using System;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.SecurityModule;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.Registrants.API.Security
{
    public class UserTests : WebAppTestBase
    {
        private readonly IUserManager userManager;

        public UserTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            userManager = services.GetRequiredService<IUserManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task NewUser_Created()
        {
            var userId = $"test_user_{Guid.NewGuid().ToString("N").Substring(0, 5)}";

            (await userManager.Get(userId)).ShouldBeNull();

            var newUser = Mappings.MapBCSCUserDataToProfile(userId, CreateUserDocument(userId, userId));
            var id = await userManager.Save(newUser);
            id.ShouldNotBeNull().ShouldBe(userId);

            var user = (await userManager.Get(userId)).ShouldNotBeNull();

            user.Id.ShouldBe(userId);
            user.DisplayName.ShouldBe(userId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task ExistingUser_Updated()
        {
            var userId = $"test_user_{Guid.NewGuid().ToString("N").Substring(0, 5)}";
            var newUser = Mappings.MapBCSCUserDataToProfile(userId, CreateUserDocument(userId, userId));

            //create
            await userManager.Save(newUser);

            //update
            var updatedUser = Mappings.MapBCSCUserDataToProfile(userId, CreateUserDocument(userId, userId + "_updated"));
            (await userManager.Save(updatedUser)).ShouldBe(userId);

            var user = (await userManager.Get(userId)).ShouldNotBeNull();
            user.Id.ShouldBe(userId);
            user.DisplayName.ShouldEndWith("_updated");
        }

        private JsonDocument CreateUserDocument(string bcscUserId, string displayName)
        {
            var userJson = @"
{
    ""sub"": ""{USER_ID}"",
    ""age_19_or_over"": true,
    ""birthdate"": ""1999-10-16"",
    ""gender"": ""male"",
    ""iss"": ""https://idtest.gov.bc.ca/oauth2/"",
    ""given_names"": ""EVAC Asima"",
    ""client_id"": ""urn.ca.bc.gov.justice.embc.evac.dev"",
    ""authentication_method"": ""SmartCardPasscode"",
    ""user_type"": ""VerifiedIndividual"",
    ""transaction_identifier"": ""5a097122-4fc4-4e5d-81a2-31f952c7a613"",
    ""identification_level"": 3,
    ""iat"": 1610577881,
    ""jti"": ""b40254a6-c211-4b92-9731-c4e095f46eee"",
    ""authoritative_party_name"": ""IAS"",
    ""address"": {
                ""street_address"": ""2135 QUIET SQUARE"",
        ""country"": ""CA"",
        ""formatted"": ""2135 QUIET SQUARE\nTRAIL, BC  V1R 3X2"",
        ""locality"": ""TRAIL"",
        ""region"": ""BC"",
        ""postal_code"": ""V1R 3X2""
    },
    ""given_name"": ""EVAC"",
    ""sector_identifier_uri"": ""urn:ca:bc:gov:justice:test"",
    ""transaction_type"": ""AO"",
    ""display_name"": ""{DISPLAY_NAME}"",
    ""identity_assurance_level3"": true,
    ""identity_assurance_level2"": true,
    ""identity_assurance_level1"": true,
    ""authoritative_party_identifier"": ""urn:ca:bc:gov:ias:idtest"",
    ""user_identifier_type"": ""did"",
    ""credential_type"": ""TBCSC"",
    ""aud"": ""urn.ca.bc.gov.justice.embc.evac.dev"",
    ""credential_reference"": ""3c8059d0-5dc5-428b-946c-858270d26680"",
    ""identity_assurance_level"": 3,
    ""family_name"": ""ONE"",
    ""age"": 21,
    ""authentication_zone_identifier"": ""urn:ca:bc:gov:justice:test:zone1""
}
            ";
            userJson = userJson.Replace("{USER_ID}", bcscUserId).Replace("{DISPLAY_NAME}", displayName);
            return JsonDocument.Parse(userJson);
        }
    }
}
