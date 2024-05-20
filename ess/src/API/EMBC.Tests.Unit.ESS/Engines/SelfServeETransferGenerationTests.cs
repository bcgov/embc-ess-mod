using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;
using EMBC.Utilities.Extensions;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS.Engines;

public class SelfServeETransferGenerationTests
{
    private readonly SelfServeEtransferGenerator strategy;
    private readonly DateTime startDate;
    private readonly DateTime endDate;
    private readonly IEnumerable<SelfServeHouseholdMember> householdMembers;
    private readonly List<string> expectedHouseholdMemberIds;
    private static string fileId = "1234";
    private static string registrantId = "2345";

    public SelfServeETransferGenerationTests()
    {
        var mapper = new MapperConfiguration(cfg =>
        {
            cfg.AddMaps("EMBC.ESS");
        }).CreateMapper();

        strategy = new SelfServeEtransferGenerator(mapper);

        startDate = new DateTime(2024, 5, 1, 12, 0, 0, DateTimeKind.Utc).ToPST();
        endDate = startDate.AddHours(72);
        householdMembers = Enumerable.Range(1, 5).Select(i => new SelfServeHouseholdMember(i.ToString(), false));
        expectedHouseholdMemberIds = householdMembers.Select(hm => hm.Id).ToList();
    }

    [Fact]
    public async Task Generate_Clothing_SupportCreated()
    {
        var selfServeSupport = new SelfServeClothingSupport
        {
            IncludedHouseholdMembers = expectedHouseholdMemberIds,
            TotalAmount = 100d
        };
        var etransferDetails = new ETransferDetails
        {
            ContactEmail = "testcontact",
            ETransferEmail = "testemail",
            RecipientName = "test test",
            ETransferMobile = "testmobile"
        };

        var response = (GenerateSelfServeETransferSupportsResponse)await strategy.Generate(new GenerateSelfServeETransferSupports(fileId, registrantId, [selfServeSupport], etransferDetails, startDate, endDate), default);
        var support = response.Supports.ShouldHaveSingleItem().ShouldBeOfType<ClothingSupport>();
        support.From.ShouldBe(startDate);
        support.To.ShouldBe(endDate);
        support.IsSelfServe.ShouldBeTrue();
        support.TotalAmount.ShouldBe(Convert.ToDecimal(selfServeSupport.TotalAmount));
        support.IncludedHouseholdMembers.ShouldBe(selfServeSupport.IncludedHouseholdMembers);

        var etransfer = support.SupportDelivery.ShouldBeOfType<Interac>();
        etransfer.NotificationEmail.ShouldBe(etransferDetails.ETransferEmail);
        etransfer.NotificationMobile.ShouldBe(etransferDetails.ETransferMobile);
        etransfer.ReceivingRegistrantId.ShouldBe(registrantId);
    }

    [Fact]
    public async Task Generate_ClothingNoHouseholdMembers_NotCreated()
    {
        var response = (GenerateSelfServeETransferSupportsResponse)await strategy.Generate(new GenerateSelfServeETransferSupports(fileId, registrantId, [], new ETransferDetails(), startDate, endDate), default);
        response.Supports.ShouldBeEmpty();
    }
}
