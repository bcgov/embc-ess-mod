import * as faker from 'faker/locale/en_CA';
import { ClothingReferral, EvacuationFile, FoodGroceriesReferral, FoodRestaurantReferral, IncidentalsReferral, LodgingBilletingReferral, LodgingGroupReferral, LodgingHotelReferral, Referral, Supplier, Support, SupportCategory, SupportMethod, SupportStatus, SupportSubCategory, TransportationOtherReferral, TransportationTaxiReferral } from '../../api/responders/models';
import { addDays, getRandomInt } from '../../utilities';

export function generateSupports(file: EvacuationFile, suppliers: Array<Supplier>): Array<Support> {
    let supportFunctions = [generateClothingSupport,
        generateIncidentalSupport,
        generateLodgingHotelSupport,
        generateLodgingBiletingSupport,
        generateLodgingGroupSupport,
        generateFoodGroceriesSupport,
        generateFoodRestaurantSupport,
        generateTransportationTaxiSupport,
        generateTransportationOtherSupport];
    let support_count = getRandomInt(1, supportFunctions.length);
    let supports: Array<Support> = [];

    for (let i = 0; i < support_count; ++i) {
        let random_support = supportFunctions.splice(getRandomInt(0, supportFunctions.length - 1), 1)[0];
        supports.push(random_support(file, suppliers));
    }
    return supports;
}

function generateClothingSupport(file: EvacuationFile, suppliers: Array<Supplier>): ClothingReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Clothing, SupportSubCategory.None) as ClothingReferral;
    support.extremeWinterConditions = faker.datatype.boolean();
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateIncidentalSupport(file: EvacuationFile, suppliers: Array<Supplier>): IncidentalsReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Incidentals, SupportSubCategory.None) as IncidentalsReferral;
    support.approvedItems = faker.lorem.word();
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateLodgingHotelSupport(file: EvacuationFile, suppliers: Array<Supplier>): LodgingHotelReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Lodging, SupportSubCategory.Lodging_Hotel) as LodgingHotelReferral;
    support.numberOfNights = getRandomInt(1, 7);
    support.numberOfRooms = getRandomInt(1, 3);
    return support;
}

function generateLodgingBiletingSupport(file: EvacuationFile, suppliers: Array<Supplier>): LodgingBilletingReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Lodging, SupportSubCategory.Lodging_Billeting) as LodgingBilletingReferral;
    support.numberOfNights = getRandomInt(1, 7);
    support.hostAddress = faker.address.streetAddress();
    support.hostCity = faker.address.city();
    support.hostEmail = faker.internet.email();
    support.hostName = faker.name.firstName() + ' ' + faker.name.lastName();
    support.hostPhone = faker.phone.phoneNumber("###-###-####");
    return support;
}

function generateLodgingGroupSupport(file: EvacuationFile, suppliers: Array<Supplier>): LodgingGroupReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Lodging, SupportSubCategory.Lodging_Group) as LodgingGroupReferral;
    support.numberOfNights = getRandomInt(1, 7);
    support.facilityAddress = faker.address.streetAddress();
    support.facilityCity = faker.address.city();
    support.facilityContactPhone = faker.phone.phoneNumber("###-###-####");
    support.facilityName = faker.company.companyName();
    return support;
}

function generateFoodGroceriesSupport(file: EvacuationFile, suppliers: Array<Supplier>): FoodGroceriesReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Food, SupportSubCategory.Food_Groceries) as FoodGroceriesReferral;
    support.numberOfDays = getRandomInt(1, 7);
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateFoodRestaurantSupport(file: EvacuationFile, suppliers: Array<Supplier>): FoodRestaurantReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Food, SupportSubCategory.Food_Restaurant) as FoodRestaurantReferral;
    support.numberOfBreakfastsPerPerson = getRandomInt(1, 7);
    support.numberOfLunchesPerPerson = getRandomInt(1, 7);
    support.numberOfDinnersPerPerson = getRandomInt(1, 7);
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateTransportationTaxiSupport(file: EvacuationFile, suppliers: Array<Supplier>): TransportationTaxiReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Transportation, SupportSubCategory.Transportation_Taxi) as TransportationTaxiReferral;
    support.fromAddress = faker.address.streetAddress();
    support.toAddress = faker.address.streetAddress();
    return support;
}

function generateTransportationOtherSupport(file: EvacuationFile, suppliers: Array<Supplier>): TransportationOtherReferral {
    let support = generateRerral(file, suppliers, SupportCategory.Transportation, SupportSubCategory.Transportation_Other) as TransportationOtherReferral;
    support.transportMode = faker.vehicle.type();
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateRerral(file: EvacuationFile, suppliers: Array<Supplier>, category: SupportCategory, subCategory: SupportSubCategory): Referral {
    let now = new Date();
    let member_count = getRandomInt(1, (file.householdMembers?.length || 1) - 1);
    let member_ids: Array<string> = [];
    for (let i = 0; i < member_count; ++i) {
        member_ids.push(file.householdMembers ? file.householdMembers[i].id || "" : "");
    }

    let random_supplier = faker.random.arrayElement(suppliers);
    return {
        from: now.toISOString(),
        includedHouseholdMembers: member_ids,
        needsAssessmentId: file.needsAssessment.id,
        status: SupportStatus.Draft,
        to: addDays(now, getRandomInt(1, 5)).toISOString(),
        category: category,
        method: SupportMethod.Referral,
        subCategory: subCategory,
        issuedToPersonName: file.primaryRegistrantLastName + "," + file.primaryRegistrantFirstName,
        supplierAddress: random_supplier?.address || null,
        supplierId: random_supplier?.id || "",
        supplierName: random_supplier?.name || null,
        supplierNotes: "notes",
    };
}
