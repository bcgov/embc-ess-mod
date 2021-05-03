using System;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Managers.Submissions;
using EMBC.ESS.Shared.Contracts.Submissions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Submissions
{
    public class SubmissionsTests : WebAppTestBase
    {
        private readonly SubmissionsManager manager;

        public SubmissionsTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            manager = services.GetRequiredService<SubmissionsManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Anonymous_Registration()
        {
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var profile = new RegistrantProfile
            {
                //InformationCollectionConsent = true,
                RestrictedAccess = true,
                SecretPhrase = "secret phrase",

                FirstName = $"PriRegTestFirst-{textContextIdentifier}",
                LastName = $"PriRegTestLast-{textContextIdentifier}",
                DateOfBirth = "2000/01/01",
                Gender = "Female",
                Initials = "initials1",
                PreferredName = "preferred1",
                Email = "email@org.com",
                Phone = "999-999-9999",
                PrimaryAddress = new Address
                {
                    AddressLine1 = $"paddr1-{textContextIdentifier}",
                    AddressLine2 = "paddr2",
                    Country = "CAN",
                    StateProvince = "BC",
                    PostalCode = "v1v 1v1",
                    Community = "226adfaf-9f97-ea11-b813-005056830319"
                },
                MailingAddress = new Address
                {
                    AddressLine1 = $"maddr1-{textContextIdentifier}",
                    AddressLine2 = "maddr2",
                    Country = "USA",
                    StateProvince = "WA",
                    PostalCode = "12345",
                    Community = "Seattle"
                }
            };
            var needsAssessment = new NeedsAssessment
            {
                HouseholdMembers = new[]
                    {
                        new HouseholdMember
                        {
                            Id = null,

                                FirstName = $"MemRegTestFirst-{textContextIdentifier}",
                                LastName = $"MemRegTestLast-{textContextIdentifier}",
                                Gender = "X",
                                DateOfBirth = "2010-01-01"
                        }
                    },
                HaveMedication = false,
                Insurance = InsuranceOption.Yes,
                HaveSpecialDiet = true,
                SpecialDietDetails = "Gluten Free",
                HasPetsFood = true,
                CanEvacueeProvideClothing = false,
                CanEvacueeProvideFood = true,
                CanEvacueeProvideIncidentals = null,
                CanEvacueeProvideLodging = false,
                CanEvacueeProvideTransportation = true,
                Pets = new[]
                    {
                        new Pet{ Type = $"dog{textContextIdentifier}", Quantity = "4" }
                    }
            };
            var cmd = new SubmitAnonymousEvacuationFileCommand
            {
                File = new EvacuationFile
                {
                    EvacuatedFromAddress = new Address
                    {
                        AddressLine1 = $"addr1-{textContextIdentifier}",
                        Country = "CAN",
                        Community = "226adfaf-9f97-ea11-b813-005056830319",
                        StateProvince = "BC",
                        PostalCode = "v1v 1v1"
                    },
                    EvacuationDate = DateTime.Now,
                    NeedsAssessments = new[] { needsAssessment },
                },
                SubmitterProfile = profile
            };

            var fileId = await manager.Handle(cmd);
            fileId.ShouldNotBeNull();
        }
    }
}
