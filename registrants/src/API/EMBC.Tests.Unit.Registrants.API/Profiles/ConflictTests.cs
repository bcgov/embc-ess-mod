using System.Linq;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.Services;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.Registrants.API.Profiles;

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

    [Fact]
    public void Detect_WhitespaceButSamePostalCode_Pass()
    {
        var source = FakeGenerator.CreateClientRegistrantProfile();
        var target = FakeGenerator.CreateClientRegistrantProfile();
        source.PrimaryAddress.PostalCode = "\t\nV1V  1V1  \n";
        target.PrimaryAddress = new Address
        {
            AddressLine1 = source.PrimaryAddress.AddressLine1,
            AddressLine2 = source.PrimaryAddress.AddressLine2,
            City = source.PrimaryAddress.City,
            Community = source.PrimaryAddress.Community,
            StateProvince = source.PrimaryAddress.StateProvince,
            Country = source.PrimaryAddress.Country,
            PostalCode = "  v1v1v1 \t\n"
        };
        target.PrimaryAddress.PostalCode = $"\t {source.PrimaryAddress.PostalCode}\n";

        var conflicts = ProfilesConflictDetector.DetectConflicts(source, target).ToArray();
        conflicts.Where(c => c is AddressDataConflict).ShouldBeEmpty();
    }

    [Fact]
    public void Detect_NullPostalCode_Detected()
    {
        var source = FakeGenerator.CreateClientRegistrantProfile();
        var target = FakeGenerator.CreateClientRegistrantProfile();
        target.PrimaryAddress = new Address
        {
            AddressLine1 = source.PrimaryAddress.AddressLine1,
            AddressLine2 = source.PrimaryAddress.AddressLine2,
            City = source.PrimaryAddress.City,
            Community = source.PrimaryAddress.Community,
            StateProvince = source.PrimaryAddress.StateProvince,
            Country = source.PrimaryAddress.Country,
            PostalCode = null
        };

        var conflicts = ProfilesConflictDetector.DetectConflicts(source, target).ToArray();
        var conflict = (AddressDataConflict)conflicts.Where(c => c is AddressDataConflict).ShouldHaveSingleItem();
        conflict.OriginalValue.PostalCode.ShouldBe(source.PrimaryAddress.PostalCode);
        conflict.ConflictingValue.PostalCode.ShouldBe(target.PrimaryAddress.PostalCode);
    }
}
