using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Messaging;
using FakeItEasy;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.Responders.API
{
    public class RegistrationsTests
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;

        private static RegistrantProfile[] stagedRegistrants = InitializeRegistrants();

        private static RegistrantProfile[] InitializeRegistrants()
        {
            RegistrantProfile[] ret = new RegistrantProfile[3];
            ret[0] = new RegistrantProfile
            {
                SecurityQuestions = InitializeSecurityQuestions(),
                RestrictedAccess = false,
                MailingAddress = new Address
                {
                    AddressLine1 = "123 fake st",
                    AddressLine2 = "",
                    Community = "community 1",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "v2v 2v2"
                },
                PrimaryAddress = new Address
                {
                    AddressLine1 = "100 Test Rd",
                    AddressLine2 = "",
                    Community = "community",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "V2V2V2"
                },
                Phone = "6049877897",
                Email = "test@email.com",
                DateOfBirth = "1985-08-22",
                Gender = "Male",
                PreferredName = "",
                Initials = "",
                LastName = "Smith",
                FirstName = "John",
                UserId = "Test-1",
                Id = "123-abc",
                AuthenticatedUser = true,
                VerifiedUser = true
            };
            ret[1] = new RegistrantProfile
            {
                SecurityQuestions = InitializeSecurityQuestions(),
                RestrictedAccess = false,
                MailingAddress = new Address
                {
                    AddressLine1 = "1234 fake st",
                    AddressLine2 = "",
                    Community = "community 1",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "v2v 2v2"
                },
                PrimaryAddress = new Address
                {
                    AddressLine1 = "1001 Test Rd",
                    AddressLine2 = "",
                    Community = "community",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "V2V2V2"
                },
                Phone = "7789877897",
                Email = "tes2t@email.com",
                DateOfBirth = "1992-08-22",
                Gender = "Female",
                PreferredName = "",
                Initials = "",
                LastName = "Doe",
                FirstName = "Jane",
                UserId = "Test-2",
                Id = "222-bcd",
                AuthenticatedUser = true,
                VerifiedUser = true
            };
            ret[2] = new RegistrantProfile
            {
                SecurityQuestions = InitializeSecurityQuestions(),
                RestrictedAccess = false,
                MailingAddress = new Address
                {
                    AddressLine1 = "455 fake st",
                    AddressLine2 = "",
                    Community = "community 1",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "v2v 2v2"
                },
                PrimaryAddress = new Address
                {
                    AddressLine1 = "455 Test Rd",
                    AddressLine2 = "",
                    Community = "community",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "V2V2V2"
                },
                Phone = "5559877897",
                Email = "test3@email.com",
                DateOfBirth = "1999-08-22",
                Gender = "X",
                PreferredName = "",
                Initials = "",
                LastName = "Jones",
                FirstName = "Jack",
                UserId = "Test-3",
                Id = "321-zyx",
                AuthenticatedUser = true,
                VerifiedUser = true
            };

            return ret;
        }

        private static IEnumerable<SecurityQuestion> InitializeSecurityQuestions()
        {
            List<SecurityQuestion> ret = new List<SecurityQuestion>();
            ret.Add(new SecurityQuestion
            {
                Id = 1,
                Question = "question1",
                Answer = "answer1",
                AnswerChanged = false
            });
            ret.Add(new SecurityQuestion
            {
                Id = 2,
                Question = "question2",
                Answer = "answer2",
                AnswerChanged = false
            });
            ret.Add(new SecurityQuestion
            {
                Id = 3,
                Question = "question3",
                Answer = "answer3",
                AnswerChanged = false
            });
            return ret;
        }

        private Dictionary<string, RegistrantProfile> stagedRegistrantsDictionary = new Dictionary<string, RegistrantProfile>()
        {
            { "r1", stagedRegistrants[0] },
            { "r2", stagedRegistrants[1] },
            { "r3", stagedRegistrants[2] }
        };

        public RegistrationsTests()
        {
            mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(EMBC.Responders.API.Configuration));
            }).CreateMapper();

            messagingClient = A.Fake<IMessagingClient>();

            //Handle RegistrantsQuery
            A.CallTo(() => messagingClient.Send(A<RegistrantsQuery>.That.IsNotNull()))
                .ReturnsLazily(o =>
                {
                    var query = o.GetArgument<RegistrantsQuery>(0);
                    IEnumerable<KeyValuePair<string, RegistrantProfile>> ret = stagedRegistrantsDictionary.Where(a => true);

                    if (!string.IsNullOrEmpty(query.Id)) ret = ret.Where(r => r.Value.Id == query.Id);
                    if (!string.IsNullOrEmpty(query.UserId)) ret = ret.Where(r => r.Value.UserId == query.UserId);

                    return Task.FromResult(new RegistrantsQueryResponse
                    {
                        Items = ret.Select(r => r.Value)
                    });
                });
        }

        //TODO - use fake messaging client to test search service
        [Fact]
        public async Task GetRegistrantProfileById()
        {
            var registrantId = "123-abc";
            var registrant = (await messagingClient.Send(new RegistrantsQuery
            {
                Id = registrantId
            })).Items.FirstOrDefault();

            registrant.Id.ShouldBe(registrantId);
        }
    }
}
