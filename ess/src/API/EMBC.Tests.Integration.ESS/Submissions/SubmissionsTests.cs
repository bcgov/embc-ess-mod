using System;
using System.Linq;
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
        public async Task CanSubmitAnonymousRegistration()
        {
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var profile = new RegistrantProfile
            {
                UserId = null,
                Id = null,
                AuthenticatedUser = false,
                VerifiedUser = false,
                RestrictedAccess = false,
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

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSubmitNewEvacuation()
        {
            var registrant = (await manager.Handle(new RegistrantsQuery { ByUserId = "ChrisTest3" })).Items.Single();
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
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
            var cmd = new SubmitEvacuationFileCommand
            {
                File = new EvacuationFile
                {
                    Id = null,
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
                    PrimaryRegistrantId = registrant.Id
                },
            };

            var fileId = await manager.Handle(cmd);
            fileId.ShouldNotBeNull();

            var file = (await manager.Handle(new EvacuationFilesQuery { ByFileId = fileId })).Items.ShouldHaveSingleItem();
            file.PrimaryRegistrantId.ShouldBe(registrant.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuation()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);

            var registrant = (await manager.Handle(new RegistrantsQuery { ByUserId = "ChrisTest3" })).Items.Single();
            var file = (await manager.Handle(new EvacuationFilesQuery { ByUserId = registrant.UserId })).Items.Last();

            file.Id.ShouldNotBeNullOrEmpty();
            file.EvacuationDate.ShouldNotBe(now);
            file.EvacuationDate = now;
            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            fileId.ShouldNotBeNullOrEmpty();
            var updatedFile = (await manager.Handle(new EvacuationFilesQuery { ByFileId = fileId })).Items.ShouldHaveSingleItem();
            updatedFile.Id.ShouldBe(file.Id);
            updatedFile.EvacuationDate.ShouldBe(now);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateNewRegistrantProfile()
        {
            var baseRegistrant = (await manager.Handle(new RegistrantsQuery { ByUserId = "ChrisTest3" })).Items.Single();

            var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
            var country = "CAN";
            var province = "BC";
            var city = "226adfaf-9f97-ea11-b813-005056830319";

            baseRegistrant.Id = null;
            baseRegistrant.UserId = newProfileBceId;
            baseRegistrant.PrimaryAddress.Country = country;
            baseRegistrant.PrimaryAddress.StateProvince = province;
            baseRegistrant.PrimaryAddress.Community = city;
            baseRegistrant.MailingAddress.Country = country;
            baseRegistrant.MailingAddress.StateProvince = province;
            baseRegistrant.MailingAddress.Community = city;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = baseRegistrant });

            var newRegistrant = (await manager.Handle(new RegistrantsQuery { ByUserId = newProfileBceId })).Items.ShouldHaveSingleItem();

            newRegistrant.Id.ShouldBe(id);
            newRegistrant.Id.ShouldNotBe(baseRegistrant.Id);
            newRegistrant.PrimaryAddress.Country.ShouldBe(country);
            newRegistrant.PrimaryAddress.StateProvince.ShouldBe(province);
            newRegistrant.PrimaryAddress.Community.ShouldBe(city);

            newRegistrant.MailingAddress.Country.ShouldBe(country);
            newRegistrant.MailingAddress.StateProvince.ShouldBe(province);
            newRegistrant.MailingAddress.Community.ShouldBe(city);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteRegistrantProfile()
        {
            var baseRegistrant = (await manager.Handle(new RegistrantsQuery { ByUserId = "ChrisTest3" })).Items.Single();

            baseRegistrant.Id = null;
            baseRegistrant.UserId = Guid.NewGuid().ToString("N").Substring(0, 10);

            var newRegistrantId = await manager.Handle(new SaveRegistrantCommand { Profile = baseRegistrant });
            newRegistrantId.ShouldNotBeNull();

            await manager.Handle(new DeleteRegistrantCommand { UserId = baseRegistrant.UserId });

            (await manager.Handle(new RegistrantsQuery { ByUserId = baseRegistrant.UserId })).Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateProfile()
        {
            var registrant = (await manager.Handle(new RegistrantsQuery { ByUserId = "ChrisTest3" })).Items.Single();
            var currentCity = registrant.PrimaryAddress.Community;
            var newCity = currentCity == "406adfaf-9f97-ea11-b813-005056830319"
                ? "226adfaf-9f97-ea11-b813-005056830319"
                : "406adfaf-9f97-ea11-b813-005056830319";

            registrant.Email = "christest3@email" + Guid.NewGuid().ToString("N").Substring(0, 10);
            registrant.PrimaryAddress.Community = newCity;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var updatedRegistrant = (await manager.Handle(new RegistrantsQuery { ByUserId = "ChrisTest3" })).Items.ShouldHaveSingleItem();
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.Email.ShouldBe(registrant.Email);
            updatedRegistrant.PrimaryAddress.Community.ShouldBe(newCity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetRegistrantProfile()
        {
            var registrant = (await manager.Handle(new RegistrantsQuery { ByUserId = "test" })).Items.Single();

            registrant.ShouldNotBeNull();

            registrant.PrimaryAddress.Country.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.Country.ShouldNotBeNull();
            registrant.PrimaryAddress.StateProvince.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.StateProvince.ShouldNotBeNull();
            registrant.PrimaryAddress.Community.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.Community.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuationFiles()
        {
            var registrant = (await manager.Handle(new RegistrantsQuery { ByUserId = "ChrisTest3" })).Items.Single();
            var files = (await manager.Handle(new EvacuationFilesQuery { ByUserId = registrant.UserId })).Items;

            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.PrimaryRegistrantId == registrant.Id);
        }
    }
}
