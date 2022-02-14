using System.Linq;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.Services;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.Registrants.API.Profiles
{
    public class ConflictTests
    {
        [Fact]
        public void CanDetectConflicts()
        {
            var source = FakeGenerator.CreateClientRegistrantProfile();
            var target = FakeGenerator.CreateClientRegistrantProfile();

            var conflicts = ProfilesConflictDetector.DetectConflicts(source, target).ToArray();

            conflicts.Count().ShouldBe(3);
            var nameConflict = conflicts.Where(c => c is NameDataConflict).Cast<NameDataConflict>().ShouldHaveSingleItem();
            nameConflict.OriginalValue.FirstName.ShouldNotBeNull().ShouldBe(source.PersonalDetails.FirstName);
            nameConflict.OriginalValue.LastName.ShouldNotBeNull().ShouldBe(source.PersonalDetails.LastName);
            nameConflict.ConflictingValue.FirstName.ShouldNotBeNull().ShouldBe(target.PersonalDetails.FirstName);
            nameConflict.ConflictingValue.LastName.ShouldNotBeNull().ShouldBe(target.PersonalDetails.LastName);

            var dobConflict = conflicts.Where(c => c is DateOfBirthDataConflict).Cast<DateOfBirthDataConflict>().ShouldHaveSingleItem();
            dobConflict.OriginalValue.ShouldNotBeNull().ShouldBe(source.PersonalDetails.DateOfBirth);
            dobConflict.ConflictingValue.ShouldNotBeNull().ShouldBe(target.PersonalDetails.DateOfBirth);

            var addressConflict = conflicts.Where(c => c is AddressDataConflict).Cast<AddressDataConflict>().ShouldHaveSingleItem();
            addressConflict.OriginalValue.AddressLine1.ShouldNotBeNull().ShouldBe(source.PrimaryAddress.AddressLine1);
            addressConflict.OriginalValue.PostalCode.ShouldNotBeNull().ShouldBe(source.PrimaryAddress.PostalCode);
            addressConflict.ConflictingValue.AddressLine1.ShouldNotBeNull().ShouldBe(target.PrimaryAddress.AddressLine1);
            addressConflict.ConflictingValue.PostalCode.ShouldNotBeNull().ShouldBe(target.PrimaryAddress.PostalCode);
        }
    }
}
