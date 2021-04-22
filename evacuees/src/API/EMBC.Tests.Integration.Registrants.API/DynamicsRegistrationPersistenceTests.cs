using System;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.RegistrationsModule;
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
                        Country = "CAN",
                        StateProvince = "BC",
                        PostalCode = "v1v 1v1",
                        Jurisdiction = "226adfaf-9f97-ea11-b813-005056830319"
                    },
                    MailingAddress = new Address
                    {
                        AddressLine1 = $"maddr1-{textContextIdentifier}",
                        AddressLine2 = "maddr2",
                        Country = "USA",
                        StateProvince = "WA",
                        PostalCode = "12345",
                        Jurisdiction = "Seattle"
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
                    Country = "CAN",
                    Jurisdiction = "226adfaf-9f97-ea11-b813-005056830319",
                    StateProvince = "BC",
                    PostalCode = "v1v 1v1"
                }
            };

            var regManager = services.GetRequiredService<IRegistrationManager>();
            var result = await regManager.CreateRegistrationAnonymous(registration);

            testLogger.LogDebug("ESS File #: " + result);
            Assert.NotNull(result);
            Assert.True(int.Parse(result) > 0);
        }
    }
}
