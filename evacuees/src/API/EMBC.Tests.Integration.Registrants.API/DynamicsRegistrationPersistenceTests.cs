using System;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.RegistrationsModule;
using EMBC.Registrants.API.Security;
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
        public async Task Profile_Registration()
        {
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var registration = new Registration
                {
                    InformationCollectionConsent = true,
                    RestrictedAccess = true,
                    SecretPhrase = $"secret phrase {textContextIdentifier}",
                    PersonalDetails = new PersonDetails
                    {
                        FirstName = $"PriRegTestFirst-{textContextIdentifier}",
                        LastName = $"PriRegTestLast-{textContextIdentifier}",
                        DateOfBirth = "2000/01/01",
                        Gender = "M",
                        Initials = "initials1",
                        PreferredName = "preferred1"
                    },
                    ContactDetails = new ContactDetails
                    {
                        Email = "prireg@org.com",
                        Phone = "999-999-9999",
                        HidePhoneRequired = false,
                        HideEmailRequired = false
                    },
                    PrimaryAddress = new Address
                    {
                        AddressLine1 = "100 Primary Address L1",
                        AddressLine2 = "Address L2",
                        Country = new Country { CountryCode = "CAN", CountryName = "Canada" },
                        StateProvince = new StateProvince { StateProvinceCode = "BC", StateProvinceName = "British Columbia" },
                        PostalCode = "V1V 1V1",
                        Jurisdiction = new Jurisdiction { JurisdictionCode = "226adfaf-9f97-ea11-b813-005056830319", JurisdictionName = "North Vancouver" }
                    },
                    MailingAddress = new Address
                    {
                        AddressLine1 = "100 Mailing Address L1",
                        AddressLine2 = "Address L2",
                        Country = new Country { CountryCode = "USA", CountryName = "USA" },
                        StateProvince = new StateProvince { StateProvinceCode = "WA", StateProvinceName = "Washington" },
                        PostalCode = "12345",
                        Jurisdiction = new Jurisdiction { JurisdictionCode = null, JurisdictionName = "Seattle" }
                    }
                };

            var regManager = services.GetRequiredService<IRegistrationManager>();
            var result = await regManager.CreateProfile(registration);
            //Assert.StartsWith("E", result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Profile_Registration_ForeignAddress()
        {
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var registration = new Registration
            {
                InformationCollectionConsent = true,
                RestrictedAccess = true,
                SecretPhrase = $"secret phrase {textContextIdentifier}",
                PersonalDetails = new PersonDetails
                {
                    FirstName = $"PriRegTestFirst-{textContextIdentifier}",
                    LastName = $"PriRegTestLast-{textContextIdentifier}",
                    DateOfBirth = "2000/01/01",
                    Gender = "F",
                    Initials = "initials1",
                    PreferredName = "preferred1"
                },
                ContactDetails = new ContactDetails
                {
                    Email = "prireg@org.com",
                    Phone = "999-999-9999",
                    HidePhoneRequired = false,
                    HideEmailRequired = false
                },
                PrimaryAddress = new Address
                {
                    AddressLine1 = "100 Primary Address L1",
                    AddressLine2 = "Address L2",
                    Country = new Country { CountryCode = "AFG", CountryName = "Afghanistan" },
                    //StateProvince = new StateProvince { StateProvinceCode = "BC", StateProvinceName = "British Columbia" },
                    PostalCode = "XX99",
                    Jurisdiction = new Jurisdiction { JurisdictionCode = null, JurisdictionName = "Afghanistan City" }
                },
                MailingAddress = new Address
                {
                    AddressLine1 = "100 Mailing Address L1",
                    AddressLine2 = "Address L2",
                    Country = new Country { CountryCode = "DZA", CountryName = "Algeria" },
                    //StateProvince = new StateProvince { StateProvinceCode = "WA", StateProvinceName = "Washington" },
                    PostalCode = "999Z",
                    Jurisdiction = new Jurisdiction { JurisdictionCode = null, JurisdictionName = "Algeria City" }
                }
            };

            var regManager = services.GetRequiredService<IRegistrationManager>();
            var result = await regManager.CreateProfile(registration);
            //Assert.StartsWith("E", result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Anonymous_Registration()
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
                        FirstName = $"PriRegTestFirst-{textContextIdentifier}",
                        LastName = $"PriRegTestLast-{textContextIdentifier}",
                        DateOfBirth = "2000/01/01",
                        Gender = "F",
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
                        Country = new Country { CountryCode = "CAN", CountryName = "Canada" },
                        StateProvince = new StateProvince { StateProvinceCode = "BC", StateProvinceName = "British Columbia" },
                        PostalCode = "v1v 1v1",
                        Jurisdiction = new Jurisdiction { JurisdictionCode = "226adfaf-9f97-ea11-b813-005056830319", JurisdictionName = "North Vancouver" }
                    },
                    MailingAddress = new Address
                    {
                        AddressLine1 = $"maddr1-{textContextIdentifier}",
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
                        AddressLine1 = $"addr1-{textContextIdentifier}",
                        Country = new Country { CountryCode = "CA" },
                        Jurisdiction = new Jurisdiction { JurisdictionCode = "226adfaf-9f97-ea11-b813-005056830319" },
                        StateProvince = new StateProvince { StateProvinceCode = "BC", StateProvinceName = "British Columbia" },
                        PostalCode = "v1v 1v1"
                    },
                    FamilyMembers = new[]
                    {
                        new PersonDetails
                        {
                            FirstName = $"MemRegTestFirst-{textContextIdentifier}",
                            LastName = $"MemRegTestLast-{textContextIdentifier}",
                            Gender = "X",
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

            testLogger.LogDebug("ESS File #: " + result);
            Assert.NotNull(result);
            Assert.True(int.Parse(result)>0);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetListOfJurisdictions()
        {
            var repo = services.GetRequiredService<EMBC.Registrants.API.LocationModule.IListsRepository>();
            var jurisdictions = await repo.GetJurisdictions();

            Assert.NotEmpty(jurisdictions);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task GeProfileById()
        {
            var regManager = services.GetRequiredService<IRegistrationManager>();
            var profile = await regManager.GetProfileById(new Guid("91d6f457-b8b5-4fd4-ac71-0e45bd7e989d"));
            Assert.NotNull(profile);
            Assert.NotEmpty(profile.PersonalDetails.FirstName);
            testLogger.LogDebug("Registration Profile: " + JsonSerializer.Serialize(profile));
        }


    }
}
