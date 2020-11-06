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
                    PersonalDetails = new PersonDetails
                    {
                        FirstName = $"first1{textContextIdentifier}",
                        LastName = "last1",
                        DateOfBirth = "2000/01/01",
                        Gender = "none",
                        Initials = "initials1",
                        PreferredName = "preferred1"
                    },
                    ContactDetails = new ContactDetails
                    {
                        Email = "email@org.com",
                        Phone = "999-999-9999"
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
                PerliminaryNeedsAssessment = new NeedsAssessment
                {
                    EvacuatedFromAddress = new Address
                    {
                        AddressLine1 = "addr1",
                        Country = new Country { CountryCode = "CA" },
                        Jurisdiction = new Jurisdiction { JurisdictionCode = "" },
                        StateProvince = new StateProvince { StateProvinceCode = "BC" },
                        PostalCode = "v1v 1v1"
                    },
                    FamilyMembers = new[]
                    {
                        new PersonDetails
                        {
                            FirstName=$"fm1{textContextIdentifier}",
                            LastName = "fmlast",
                            Gender = "M",
                            DateOfBirth = "2010-01-01"
                        }
                    },
                    HaveMedication = false,
                    Insurance = NeedsAssessment.InsuranceOption.Yes,
                    HaveSpecialDiet = false,
                    RequiresClothing = true,
                    RequiresFood = true,
                    RequiresLodging = true,
                    Pets = new[]
                    {
                        new Pet{ Type = $"dog{textContextIdentifier}", Quantity = "4" }
                    },
                    RequiresIncidentals = null,
                    RequiresTransportation = null
                }
            };

            var regManager = services.GetRequiredService<IRegistrationManager>();
            var result = await regManager.RegisterNew(registration);
            Assert.StartsWith("E", result);
            Assert.Equal(10, result.Length);
        }

        [Fact]
        public async Task CanGetListOfJurisdictions()
        {
            var gw = services.GetRequiredService<IDynamicsListsGateway>();
            var jurisdictions = await gw.GetJurisdictionsAsync();

            Assert.NotEmpty(jurisdictions);
        }
    }
}
