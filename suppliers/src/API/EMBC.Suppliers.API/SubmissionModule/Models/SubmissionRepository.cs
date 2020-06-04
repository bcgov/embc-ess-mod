using System;
using System.IO.Abstractions;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Microsoft.Extensions.Configuration;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly IFileSystem fileSystem;
        private readonly IReferenceNumberGenerator referenceNumberGenerator;
        private string submissionStoragePath;

        public SubmissionRepository(IFileSystem fileSystem, IConfiguration configuration, IReferenceNumberGenerator referenceNumberGenerator)
        {
            submissionStoragePath = configuration.GetValue<string>("Submission_Storage_Path");
            this.fileSystem = fileSystem ?? throw new System.ArgumentNullException(nameof(fileSystem));
            this.referenceNumberGenerator = referenceNumberGenerator;
            if (!fileSystem.Directory.Exists(submissionStoragePath)) fileSystem.Directory.CreateDirectory(submissionStoragePath);
        }

        public async Task<Submission> GetAsync(string referenceNumber)
        {
            var filePath = fileSystem.Path.Combine(submissionStoragePath, $"submission_{referenceNumber}.json");
            if (!fileSystem.File.Exists(filePath)) return null;
            using var fs = fileSystem.File.OpenRead(filePath);
            return await JsonSerializer.DeserializeAsync<Submission>(fs);
        }

        public async Task<string> SaveAsync(Submission submission)
        {
            var referenceNumber = referenceNumberGenerator.CreateNew();
            var filePath = fileSystem.Path.Combine(submissionStoragePath, $"submission_{referenceNumber}.json");
            if (fileSystem.File.Exists(filePath)) throw new Exception($"Submission with reference number r{referenceNumber} already exists");
            using var fs = fileSystem.File.OpenWrite(filePath);
            await JsonSerializer.SerializeAsync(fs, submission);
            return referenceNumber;
        }
    }
}
