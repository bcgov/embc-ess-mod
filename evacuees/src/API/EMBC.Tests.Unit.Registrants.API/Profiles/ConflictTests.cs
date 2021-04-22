using System.Linq;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.ProfilesModule;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.Registrants.API.Profiles
{
    public class ConflictTests
    {
        [Fact]
        public void CanDetectConflicts()
        {
            var source = FakeGenerator.CreateRegistrantProfile();
            var target = FakeGenerator.CreateRegistrantProfile();

            var conflicts = ProfilesConflictDetector.DetectConflicts(source, target).ToArray();

            conflicts.Count().ShouldBe(3);
            var nameConflict = conflicts.Where(c => c is NameDataConflict).Cast<NameDataConflict>().ShouldHaveSingleItem();
            nameConflict.OriginalValue.firstName.ShouldNotBeNull().ShouldBe(source.PersonalDetails.FirstName);
            nameConflict.OriginalValue.lastName.ShouldNotBeNull().ShouldBe(source.PersonalDetails.LastName);
            nameConflict.ConflictingValue.firstName.ShouldNotBeNull().ShouldBe(target.PersonalDetails.FirstName);
            nameConflict.ConflictingValue.lastName.ShouldNotBeNull().ShouldBe(target.PersonalDetails.LastName);

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
