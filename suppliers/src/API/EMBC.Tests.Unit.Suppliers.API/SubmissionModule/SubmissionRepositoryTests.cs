using System;
using System.Collections.Generic;
using System.IO.Abstractions.TestingHelpers;
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace EMBC.Tests.Unit.Suppliers.API.SubmissionModule
{
    public class SubmissionRepositoryTests
    {
        private readonly MockFileSystem fileSystem;
        private readonly IConfigurationRoot configuration;
        private readonly ReferenceNumberGenerator referenceNumberGenerator;
        private static readonly string submissionPersistencePath = "/submissions/";

        public SubmissionRepositoryTests()
        {
            fileSystem = new MockFileSystem();
            referenceNumberGenerator = new ReferenceNumberGenerator();
            configuration = new ConfigurationBuilder().AddInMemoryCollection(new[] {
                new KeyValuePair<string,string>("Submission_Storage_Path", submissionPersistencePath)
            }).Build();
        }

        [Fact]
        public async Task Save_FileExistsInFolder()
        {
            var repo = new SubmissionRepository(fileSystem, configuration, referenceNumberGenerator);

            var submission = new Submission
            {
            };

            var referenceNumber = await repo.SaveAsync(submission);

            Assert.NotNull(referenceNumber);
            Assert.True(fileSystem.FileExists(fileSystem.Path.Combine(submissionPersistencePath, $"submission_{referenceNumber}.json")));
        }

        [Fact]
        public async Task Get_SavedSubmissionReturned()
        {
            var repo = new SubmissionRepository(fileSystem, configuration, referenceNumberGenerator);

            var submission = new Submission
            {
            };

            var referenceNumber = await repo.SaveAsync(submission);
            var loadedSumbission = await repo.GetAsync(referenceNumber);
            Assert.NotNull(loadedSumbission);
        }

        [Fact]
        public async Task Save_DuplicateReferenceNumber_Failed()
        {
            var presetReferenceNumber = "refnumber";
            referenceNumberGenerator.PresetReferenceNumber(presetReferenceNumber);
            var repo = new SubmissionRepository(fileSystem, configuration, referenceNumberGenerator);

            var submission = new Submission
            {
            };

            await repo.SaveAsync(submission);
            await Assert.ThrowsAsync<Exception>(async () => await repo.SaveAsync(submission));
        }
    }
}
