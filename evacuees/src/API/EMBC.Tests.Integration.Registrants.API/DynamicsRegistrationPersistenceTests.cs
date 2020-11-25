using System;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.Dynamics;
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
        public async Task GetSecurityToken()
        {
            var tokenProvider = services.GetRequiredService<ISecurityTokenProvider>();
            testLogger.LogDebug("Authorization: Bearer {0}", await tokenProvider.AcquireToken());
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Register_Anonymous_NewReferenceNumber()
        {
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var registration = new AnonymousRegistration
            {
                RegistrationDetails = new Registration
                {
                    InformationCollectionConsent = true,
                    RestrictedAccess = true,
                    SecretPhrase = "secret phrase",
                    PersonalDetails = new PersonDetails
                    {
                        FirstName = $"RegistrantFirst1{textContextIdentifier}",
                        LastName = "RegistrantLast1",
                        DateOfBirth = "2000/01/01",
                        Gender = "Male",
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
                        AddressLine1 = "paddr1",
                        AddressLine2 = "paddr2",
                        Country = new Country { CountryCode = "CAN", CountryName = "Canada" },
                        StateProvince = new StateProvince { StateProvinceCode = "BC", StateProvinceName = "British Columbia" },
                        PostalCode = "v1v 1v1",
                        Jurisdiction = new Jurisdiction { JurisdictionCode = "226adfaf-9f97-ea11-b813-005056830319", JurisdictionName = "North Vancouver" }
                    },
                    MailingAddress = new Address
                    {
                        AddressLine1 = "maddr1",
                        AddressLine2 = "maddr2",
                        Country = new Country { CountryCode = "USA", CountryName = "USA" },
                        StateProvince = new StateProvince { StateProvinceCode = "WA", StateProvinceName = "Washington" },
                        PostalCode = "12345",
                        Jurisdiction = new Jurisdiction { JurisdictionCode = null, JurisdictionName = "Seattle" }
                    }
                },
                PreliminaryNeedsAssessment = new NeedsAssessment
                {
                    EvacuatedFromAddress = new Address
                    {
                        AddressLine1 = "addr1",
                        Country = new Country { CountryCode = "CA" },
                        Jurisdiction = new Jurisdiction { JurisdictionCode = "226adfaf-9f97-ea11-b813-005056830319" },
                        StateProvince = new StateProvince { StateProvinceCode = "BC", StateProvinceName = "British Columbia" },
                        PostalCode = "v1v 1v1"
                    },
                    FamilyMembers = new[]
                    {
                        new PersonDetails
                        {
                            FirstName = $"MemberFirst1{textContextIdentifier}",
                            LastName = "MemberLast1",
                            Gender = "M",
                            DateOfBirth = "2010-01-01"
                        }
                    },
                    HaveMedication = false,
                    Insurance = NeedsAssessment.InsuranceOption.Yes,
                    HaveSpecialDiet = true,
                    HasPetsFood = true,
                    RequiresClothing = true,
                    RequiresFood = true,
                    RequiresLodging = true,
                    RequiresIncidentals = true,
                    RequiresTransportation = true,
                    Pets = new[]
                    {
                        new Pet{ Type = $"dog{textContextIdentifier}", Quantity = "4" }
                    },
                }
            };

            var regManager = services.GetRequiredService<IRegistrationManager>();
            var result = await regManager.CreateRegistrationAnonymous(registration);
            Assert.StartsWith("E", result);
            Assert.Equal(10, result.Length);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetListOfJurisdictions()
        {
            var gw = services.GetRequiredService<IDynamicsListsGateway>();
            var jurisdictions = await gw.GetJurisdictionsAsync();

            Assert.NotEmpty(jurisdictions);
        }
    }
}
