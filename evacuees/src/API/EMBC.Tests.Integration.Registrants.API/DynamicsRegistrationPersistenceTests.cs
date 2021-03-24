using System;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.EvacuationsModule;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.RegistrationsModule;
using EMBC.Registrants.API.Security;
using EMBC.Registrants.API.Shared;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.Registrants.API
{
    public class DynamicsRegistrationPersistenceTests : WebAppTestBase
    {
        public DynamicsRegistrationPersistenceTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task GetSecurityToken()
        {
            var tokenProvider = services.GetRequiredService<ISecurityTokenProvider>();
            testLogger.LogDebug("Authorization: Bearer {0}", await tokenProvider.AcquireToken());
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Anonymous_Registration()
        {
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var registration = new AnonymousRegistration
            {
                RegistrationDetails = new Profile
                {
                    //InformationCollectionConsent = true,
                    RestrictedAccess = true,
                    SecretPhrase = "secret phrase",
                    PersonalDetails = new PersonDetails
                    {
                        FirstName = $"PriRegTestFirst-{textContextIdentifier}",
                        LastName = $"PriRegTestLast-{textContextIdentifier}",
                        DateOfBirth = "2000/01/01",
                        Gender = "Female",
                        Initials = "initials1",
                        PreferredName = "preferred1"
                    },
                    ContactDetails = new ContactDetails
                    {
                        Email = "email@org.com",
                        Phone = "999-999-9999",
                        HidePhoneRequired = false,
                        HideEmailRequired = false
                    },
                    PrimaryAddress = new Address
                    {
                        AddressLine1 = $"paddr1-{textContextIdentifier}",
                        AddressLine2 = "paddr2",
                        Country = new Country { Code = "CAN", Name = "Canada" },
                        StateProvince = new StateProvince { Code = "BC", Name = "British Columbia" },
                        PostalCode = "v1v 1v1",
                        Jurisdiction = new Jurisdiction { Code = "226adfaf-9f97-ea11-b813-005056830319", Name = "North Vancouver" }
                    },
                    MailingAddress = new Address
                    {
                        AddressLine1 = $"maddr1-{textContextIdentifier}",
                        AddressLine2 = "maddr2",
                        Country = new Country { Code = "USA", Name = "USA" },
                        StateProvince = new StateProvince { Code = "WA", Name = "Washington" },
                        PostalCode = "12345",
                        Jurisdiction = new Jurisdiction { Code = null, Name = "Seattle" }
                    }
                },
                PreliminaryNeedsAssessment = new NeedsAssessment
                {
                    HouseholdMembers = new[]
                    {
                        new HouseholdMember
                        {
                            Id = null,
                            Details = new PersonDetails
                            {
                                FirstName = $"MemRegTestFirst-{textContextIdentifier}",
                                LastName = $"MemRegTestLast-{textContextIdentifier}",
                                Gender = "X",
                                DateOfBirth = "2010-01-01"
                            }
                        }
                    },
                    HaveMedication = false,
                    Insurance = NeedsAssessment.InsuranceOption.Yes,
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
                    },
                },
                EvacuatedFromAddress = new Address
                {
                    AddressLine1 = $"addr1-{textContextIdentifier}",
                    Country = new Country { Code = "CA" },
                    Jurisdiction = new Jurisdiction { Code = "226adfaf-9f97-ea11-b813-005056830319" },
                    StateProvince = new StateProvince { Code = "BC", Name = "British Columbia" },
                    PostalCode = "v1v 1v1"
                }
            };

            var regManager = services.GetRequiredService<IRegistrationManager>();
            var result = await regManager.CreateRegistrationAnonymous(registration);

            testLogger.LogDebug("ESS File #: " + result);
            Assert.NotNull(result);
            Assert.True(int.Parse(result) > 0);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetListOfJurisdictions()
        {
            var repo = services.GetRequiredService<EMBC.Registrants.API.LocationModule.IListsRepository>();
            var jurisdictions = await repo.GetJurisdictions();

            Assert.NotEmpty(jurisdictions);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetListOfStateProvinces()
        {
            var repo = services.GetRequiredService<EMBC.Registrants.API.LocationModule.IListsRepository>();
            var jurisdictions = await repo.GetStateProvinces();

            Assert.NotEmpty(jurisdictions);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetListOfCountries()
        {
            var repo = services.GetRequiredService<EMBC.Registrants.API.LocationModule.IListsRepository>();
            var jurisdictions = await repo.GetCountries();

            Assert.NotEmpty(jurisdictions);
        }
    }
}
