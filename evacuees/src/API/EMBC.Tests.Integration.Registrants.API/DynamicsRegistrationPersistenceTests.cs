using System;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Registrants.API;
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
        public async Task Profile_Registration()
        {
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var registration = new Registration
            {
                InformationCollectionConsent = true,
                RestrictedAccess = true,
                SecretPhrase = $"secret phrase {textContextIdentifier}",
                BCServicesCardId = $"BCSC-ID-{textContextIdentifier}",
                PersonalDetails = new PersonDetails
                {
                    FirstName = $"PriRegTestFirst-{textContextIdentifier}",
                    LastName = $"PriRegTestLast-{textContextIdentifier}",
                    DateOfBirth = "2000/01/01",
                    Gender = "Male",
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
                    Country = new Country { Code = "CAN", Name = "Canada" },
                    StateProvince = new StateProvince { Code = "BC", Name = "British Columbia" },
                    PostalCode = "V1V 1V1",
                    Jurisdiction = new Jurisdiction { Code = "226adfaf-9f97-ea11-b813-005056830319", Name = "North Vancouver" }
                },
                MailingAddress = new Address
                {
                    AddressLine1 = "100 Mailing Address L1",
                    AddressLine2 = "Address L2",
                    Country = new Country { Code = "USA", Name = "USA" },
                    StateProvince = new StateProvince { Code = "WA", Name = "Washington" },
                    PostalCode = "12345",
                    Jurisdiction = new Jurisdiction { Code = null, Name = "Seattle" }
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
                    Gender = "Female",
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
                    Country = new Country { Code = "AFG", Name = "Afghanistan" },
                    //StateProvince = new StateProvince { Code = "BC", Name = "British Columbia" },
                    PostalCode = "XX99",
                    Jurisdiction = new Jurisdiction { Code = null, Name = "Afghanistan City" }
                },
                MailingAddress = new Address
                {
                    AddressLine1 = "100 Mailing Address L1",
                    AddressLine2 = "Address L2",
                    Country = new Country { Code = "DZA", Name = "Algeria" },
                    //StateProvince = new StateProvince { Code = "WA", Name = "Washington" },
                    PostalCode = "999Z",
                    Jurisdiction = new Jurisdiction { Code = null, Name = "Algeria City" }
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
                    EvacuatedFromAddress = new Address
                    {
                        AddressLine1 = $"addr1-{textContextIdentifier}",
                        Country = new Country { Code = "CA" },
                        Jurisdiction = new Jurisdiction { Code = "226adfaf-9f97-ea11-b813-005056830319" },
                        StateProvince = new StateProvince { Code = "BC", Name = "British Columbia" },
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

        [Fact(Skip = RequiresDynamics)]
        public async Task GeProfileById()
        {
            var regManager = services.GetRequiredService<IRegistrationManager>();
            var profile = await regManager.GetProfileById(new Guid("83a1a0fa-6eb9-4abb-b521-cbfcd0c4bac1"));
            Assert.NotNull(profile);
            Assert.NotEmpty(profile.PersonalDetails.FirstName);
            testLogger.LogDebug("Registration Profile: " + JsonSerializer.Serialize(profile));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task GetProfileByBcscId()
        {
            var regManager = services.GetRequiredService<IRegistrationManager>();
            var profile = await regManager.GetProfileByBcscId("BCSC-ID-12:49 PM");
            Assert.NotNull(profile);
            Assert.NotEmpty(profile.PersonalDetails.FirstName);
            testLogger.LogDebug("Registration Profile: " + JsonSerializer.Serialize(profile));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanPatchProfileById()
        {
            var regManager = services.GetRequiredService<IRegistrationManager>();
            var profile = await regManager.GetProfileById(new Guid("83a1a0fa-6eb9-4abb-b521-cbfcd0c4bac1"));
            Assert.NotNull(profile);
            Assert.NotEmpty(profile.PersonalDetails.FirstName);
            profile.PersonalDetails.PreferredName = "Chris";
            var patchedProfile = await regManager.PatchProfileById(new Guid("83a1a0fa-6eb9-4abb-b521-cbfcd0c4bac1"), profile);
            Assert.Equal("Chris", patchedProfile.PersonalDetails.PreferredName);
            profile.PersonalDetails.PreferredName = "";
            patchedProfile = await regManager.PatchProfileById(new Guid("83a1a0fa-6eb9-4abb-b521-cbfcd0c4bac1"), profile);
            Assert.Equal("", patchedProfile.PersonalDetails.PreferredName);

            testLogger.LogDebug("Registration Profile: " + JsonSerializer.Serialize(profile));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task RegistrantEvacuationByBCSC()
        {
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var registrantEvacuation = new RegistrantEvacuation
            {
                //ContactId = "91d6f457-b8b5-4fd4-ac71-0e45bd7e989d",
                Id = "BCSC-ID-RP-TEST",
                PreliminaryNeedsAssessment = new NeedsAssessment
                {
                    EvacuatedFromAddress = new Address
                    {
                        AddressLine1 = $"AddressLine1-{textContextIdentifier}",
                        Country = new Country { Code = "CA" },
                        Jurisdiction = new Jurisdiction { Code = "226adfaf-9f97-ea11-b813-005056830319" },
                        StateProvince = new StateProvince { Code = "BC", Name = "British Columbia" },
                        PostalCode = "V8V 8V8"
                    },
                    FamilyMembers = new[]
                    {
                        new PersonDetails
                        {
                            FirstName = $"MemberFirstName-{textContextIdentifier}",
                            LastName = $"MemberLastName-{textContextIdentifier}",
                            PreferredName = $"Preferred-{textContextIdentifier}",
                            Initials = $"ML-{textContextIdentifier}",
                            Gender = "Female",
                            DateOfBirth = "1990-09-09"
                        },
                        new PersonDetails
                        {
                            FirstName = $"Member2FirstName-{textContextIdentifier}",
                            LastName = $"Member2LastName-{textContextIdentifier}",
                            PreferredName = $"Preferred2-{textContextIdentifier}",
                            Initials = $"ML2-{textContextIdentifier}",
                            Gender = "X",
                            DateOfBirth = "2000-01-03"
                        }

                    },
                    HaveMedication = false,
                    Insurance = NeedsAssessment.InsuranceOption.Unknown,
                    HaveSpecialDiet = true,
                    SpecialDietDetails = "4th Level Vegan",
                    HasPetsFood = true,
                    CanEvacueeProvideClothing = true,
                    CanEvacueeProvideFood = false,
                    CanEvacueeProvideIncidentals = true,
                    CanEvacueeProvideLodging = false,
                    CanEvacueeProvideTransportation = false,
                    Pets = new[]
                    {
                        new Pet{ Type = $"Cat{textContextIdentifier}", Quantity = "2" },
                        new Pet{ Type = $"Dog{textContextIdentifier}", Quantity = "1" },
                        new Pet{ Type = $"Bird{textContextIdentifier}", Quantity = "3" },
                    },
                }
            };

            var regManager = services.GetRequiredService<IRegistrationManager>();
            var result = await regManager.CreateRegistrantEvacuation(registrantEvacuation);

            testLogger.LogDebug("ESS File #: " + result);
            Assert.NotNull(result);
            Assert.True(int.Parse(result) > 0);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task GetRegistrantEvacuationsByContactId()
        {
            Guid.TryParse("01c93fa2-a2f7-43f3-9e1a-6eceecf40865", out Guid contactId);
            var regManager = services.GetRequiredService<IRegistrationManager>();
            var evacuationList = await regManager.GetRegistrantEvacuations(contactId);
            Assert.NotNull(evacuationList);
            Assert.NotEmpty(evacuationList);
            testLogger.LogDebug("Test Result: " + JsonSerializer.Serialize(evacuationList));
        }
    }
}
