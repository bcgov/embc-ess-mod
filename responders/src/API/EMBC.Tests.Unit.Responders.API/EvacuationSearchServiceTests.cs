using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Responders.API;
using EMBC.Responders.API.Services;
using FakeItEasy;
using Newtonsoft.Json;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.Responders.API
{
    public class EvacuationSearchServiceTests
    {
        private readonly IEvacuationSearchService service;

        private IEnumerable<EvacuationFile> stagedFiles = Array.Empty<EvacuationFile>();
        private IEnumerable<RegistrantWithFiles> stagedProfiles = Array.Empty<RegistrantWithFiles>();

        public EvacuationSearchServiceTests()
        {
            var mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Startup));
            }).CreateMapper();

            var messagingClient = A.Fake<IMessagingClient>();
            A.CallTo(() => messagingClient.Send(A<EvacuationFilesSearchQuery>.That.IsNotNull()))
                .ReturnsLazily(o =>
                {
                    var query = o.GetArgument<EvacuationFilesSearchQuery>(0);
                    return Task.FromResult(new EvacuationFilesSearchQueryResult
                    {
                        Items = stagedFiles
                    });
                });

            A.CallTo(() => messagingClient.Send(A<RegistrantsSearchQuery>.That.IsNotNull()))
               .ReturnsLazily(o =>
               {
                   var query = o.GetArgument<RegistrantsSearchQuery>(0);
                   return Task.FromResult(new RegistrantsSearchQueryResult
                   {
                       Items = stagedProfiles
                   });
               });
            service = new EvacuationSearchService(messagingClient, mapper);
        }

        [Theory]
        [MemberData(nameof(EvacuationSearchTestCaseGenerator.GenerateCases), MemberType = typeof(EvacuationSearchTestCaseGenerator))]
        public async Task SearchOnRestrictions(EMBC.Responders.API.Controllers.MemberRole role,
            MemberDataSerializer<IEnumerable<EvacuationFile>> files,
            MemberDataSerializer<IEnumerable<RegistrantWithFiles>> profiles,
            int expectedFiles,
            int expectedProfiles)
        {
            stagedFiles = files.Object;
            stagedProfiles = profiles.Object;

            var results = await service.Search("first", "last", "01/13/1999", role);

            results.Files.Count().ShouldBe(expectedFiles);
            results.Registrants.Count().ShouldBe(expectedProfiles);
        }
    }

    public static class EvacuationSearchTestCaseGenerator
    {
        private static Func<bool, IEnumerable<EvacuationFile>> files = restriction => FakeGenerator.CreateEvacuationFiles(withAtLeastOneRestrictedAccess: restriction);
        private static Func<bool, IEnumerable<RegistrantWithFiles>> profiles = restriction => FakeGenerator.CreateRegistrantProfilesWithFiles(withAtLeastOneRestrictedAccess: restriction);

        public static IEnumerable<object[]> GenerateCases()
        {
            var testCases = new List<object[]>();
            var testFilesWithRestriction = files(true);
            var testFilesWithNoRestiction = files(false);
            var testProfilesWithRestriction = profiles(true);
            var testProfilesWithNoRestiction = profiles(false);

            foreach (var role in Enum.GetValues(typeof(EMBC.Responders.API.Controllers.MemberRole)).Cast<EMBC.Responders.API.Controllers.MemberRole>())
            {
                var fileOptions = new[] { (resticted: false, items: Array.Empty<EvacuationFile>()), (resticted: true, items: testFilesWithRestriction), (resticted: false, items: testFilesWithNoRestiction) };
                foreach (var fileOption in fileOptions)
                {
                    var profileOptions = new[] { (resticted: false, items: Array.Empty<RegistrantWithFiles>()), (resticted: true, items: testProfilesWithRestriction), (resticted: false, items: testProfilesWithNoRestiction) };
                    foreach (var profileOption in profileOptions)
                    {
                        var expectedNumberOfProfiles = profileOption.resticted && role == EMBC.Responders.API.Controllers.MemberRole.Tier1 ? 0 : profileOption.items.Count();
                        var expectedNumberOfFiles = fileOption.resticted && role == EMBC.Responders.API.Controllers.MemberRole.Tier1 ? 0 : fileOption.items.Count();
                        testCases.Add(new object[] {
                            role,
                            new MemberDataSerializer<IEnumerable<EvacuationFile>>(fileOption.items),
                            new MemberDataSerializer<IEnumerable<RegistrantWithFiles>>(profileOption.items),
                            expectedNumberOfFiles,
                            expectedNumberOfProfiles
                        });
                    }
                }
            }

            return testCases;
        }
    }

    public class MemberDataSerializer<T> : IXunitSerializable
    {
        public T Object { get; private set; }

        public MemberDataSerializer()
        {
        }

        public MemberDataSerializer(T objectToSerialize)
        {
            Object = objectToSerialize;
        }

        public void Deserialize(IXunitSerializationInfo info)
        {
            Object = JsonConvert.DeserializeObject<T>(info.GetValue<string>("objValue"));
        }

        public void Serialize(IXunitSerializationInfo info)
        {
            var json = JsonConvert.SerializeObject(Object);
            info.AddValue("objValue", json);
        }
    }
}
