using System.Collections.Generic;
using System.IO.Abstractions.TestingHelpers;
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace EMBC.Tests.Suppliers.API.SubmissionModule
{
    public class SubmissionRepositoryTests
    {
        private readonly MockFileSystem fileSystem;
        private readonly IConfigurationRoot configuration;
        private static string submissionPersistencePath = "/submissions/";

        public SubmissionRepositoryTests()
        {
            fileSystem = new MockFileSystem();
            configuration = new ConfigurationBuilder().AddInMemoryCollection(new[] {
                new KeyValuePair<string,string>("Submission_Storage_Path", submissionPersistencePath)
            }).Build();
        }

        [Fact]
        public async Task CanSave()
        {
            var repo = new SubmissionRepository(fileSystem, configuration);

            var submission = new Submission
            {
            };

            var referenceNumber = await repo.SaveAsync(submission);

            Assert.NotNull(referenceNumber);
            Assert.True(fileSystem.FileExists(fileSystem.Path.Combine(submissionPersistencePath, $"submission_{referenceNumber}.json")));
        }

        [Fact]
        public async Task CanGet()
        {
            var repo = new SubmissionRepository(fileSystem, configuration);

            var submission = new Submission
            {
            };

            var referenceNumber = await repo.SaveAsync(submission);
            var loadedSumbission = await repo.GetAsync(referenceNumber);
            Assert.NotNull(loadedSumbission);
        }
    }
}
