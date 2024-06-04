using System;
using System.Collections.Generic;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe.SupportCreationStrategies;

internal interface ISelfServeSupportCreationStrategy<T> where T : SelfServeSupport
{
    T Create(CreateSelfServeSupport cmd);

    T Evaluate(T support);

    bool Validate(T support);
}

internal interface ISelfServeSupportCreationStrategy
{
    SelfServeSupport Create(CreateSelfServeSupport cmd);

    SelfServeSupport Evaluate(SelfServeSupport support);

    bool Validate(SelfServeSupport support);
}

internal record CreateSelfServeSupport(SelfServeSupportType Type, IEnumerable<SelfServeHouseholdMember> HouseholdMembers, DateTime From, DateTime To);

internal class SelfServeSupportCreationStrategy : ISelfServeSupportCreationStrategy
{
    public SelfServeSupport Create(CreateSelfServeSupport cmd) =>
        cmd.Type switch
        {
            SelfServeSupportType.ShelterAllowance => new ShelterAllowanceStrategy().Create(cmd),
            SelfServeSupportType.FoodGroceries => new FoodGroceriesStrategy().Create(cmd),
            SelfServeSupportType.FoodRestaurant => new FoodRestraurantStrategy().Create(cmd),
            SelfServeSupportType.Incidentals => new IncidentalsStrategy().Create(cmd),
            SelfServeSupportType.Clothing => new ClothingStrategy().Create(cmd),

            _ => throw new NotImplementedException()
        };

    public SelfServeSupport Evaluate(SelfServeSupport support) =>
        support switch
        {
            SelfServeClothingSupport s => new ClothingStrategy().Evaluate(s),
            SelfServeFoodGroceriesSupport s => new FoodGroceriesStrategy().Evaluate(s),
            SelfServeFoodRestaurantSupport s => new FoodRestraurantStrategy().Evaluate(s),
            SelfServeIncidentalsSupport s => new IncidentalsStrategy().Evaluate(s),
            SelfServeShelterAllowanceSupport s => new ShelterAllowanceStrategy().Evaluate(s),

            _ => throw new NotImplementedException()
        };

    public bool Validate(SelfServeSupport support) =>
        support switch
        {
            SelfServeClothingSupport s => new ClothingStrategy().Validate(s),
            SelfServeFoodGroceriesSupport s => new FoodGroceriesStrategy().Validate(s),
            SelfServeFoodRestaurantSupport s => new FoodRestraurantStrategy().Validate(s),
            SelfServeIncidentalsSupport s => new IncidentalsStrategy().Validate(s),
            SelfServeShelterAllowanceSupport s => new ShelterAllowanceStrategy().Validate(s),

            _ => throw new NotImplementedException()
        };
}
