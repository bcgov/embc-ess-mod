import * as faker from 'faker/locale/en_CA';
import { ClothingSupport } from '../../api/responders/models/clothing-support';
import { EvacuationFile } from '../../api/responders/models/evacuation-file';
import { FoodGroceriesSupport } from '../../api/responders/models/food-groceries-support';
import { FoodRestaurantSupport } from '../../api/responders/models/food-restaurant-support';
import { IncidentalsSupport } from '../../api/responders/models/incidentals-support';
import { Interac } from '../../api/responders/models/interac';
import { LodgingBilletingSupport } from '../../api/responders/models/lodging-billeting-support';
import { LodgingGroupSupport } from '../../api/responders/models/lodging-group-support';
import { LodgingHotelSupport } from '../../api/responders/models/lodging-hotel-support';
import { ProcessDigitalSupportsRequest } from '../../api/responders/models/process-digital-supports-request';
import { Referral } from '../../api/responders/models/referral';
import { Supplier } from '../../api/responders/models/supplier';
import { Support } from '../../api/responders/models/support';
import { SupportCategory } from '../../api/responders/models/support-category';
import { SupportMethod } from '../../api/responders/models/support-method';
import { SupportStatus } from '../../api/responders/models/support-status';
import { SupportSubCategory } from '../../api/responders/models/support-sub-category';
import { TransportationOtherSupport } from '../../api/responders/models/transportation-other-support';
import { TransportationTaxiSupport } from '../../api/responders/models/transportation-taxi-support';
import { addDays, getRandomInt } from '../../utilities';

export function generateSupports(file: EvacuationFile, suppliers: Array<Supplier>): ProcessDigitalSupportsRequest {
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
    return {
        includeSummaryInPrintRequest: true,
        supports: supports
    };
}

function generateClothingSupport(file: EvacuationFile, suppliers: Array<Supplier>): ClothingSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Clothing, SupportSubCategory.None) as ClothingSupport;
    support.extremeWinterConditions = faker.datatype.boolean();
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateIncidentalSupport(file: EvacuationFile, suppliers: Array<Supplier>): IncidentalsSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Incidentals, SupportSubCategory.None) as IncidentalsSupport;
    support.approvedItems = faker.lorem.word();
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateLodgingHotelSupport(file: EvacuationFile, suppliers: Array<Supplier>): LodgingHotelSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Lodging, SupportSubCategory.Lodging_Hotel) as LodgingHotelSupport;
    support.numberOfNights = getRandomInt(1, 7);
    support.numberOfRooms = getRandomInt(1, 3);
    return support;
}

function generateLodgingBiletingSupport(file: EvacuationFile, suppliers: Array<Supplier>): LodgingBilletingSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Lodging, SupportSubCategory.Lodging_Billeting) as LodgingBilletingSupport;
    support.numberOfNights = getRandomInt(1, 7);
    support.hostAddress = faker.address.streetAddress();
    support.hostCity = faker.address.city();
    support.hostEmail = "autotest." + faker.internet.email();
    support.hostName = faker.name.firstName() + ' ' + faker.name.lastName();
    support.hostPhone = faker.phone.phoneNumber("###-###-####");
    return support;
}

function generateLodgingGroupSupport(file: EvacuationFile, suppliers: Array<Supplier>): LodgingGroupSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Lodging, SupportSubCategory.Lodging_Group) as LodgingGroupSupport;
    support.numberOfNights = getRandomInt(1, 7);
    support.facilityAddress = faker.address.streetAddress();
    support.facilityCity = faker.address.city();
    support.facilityContactPhone = faker.phone.phoneNumber("###-###-####");
    support.facilityName = faker.company.companyName();
    return support;
}

function generateFoodGroceriesSupport(file: EvacuationFile, suppliers: Array<Supplier>): FoodGroceriesSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Food, SupportSubCategory.Food_Groceries) as FoodGroceriesSupport;
    support.numberOfDays = getRandomInt(1, 7);
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateFoodRestaurantSupport(file: EvacuationFile, suppliers: Array<Supplier>): FoodRestaurantSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Food, SupportSubCategory.Food_Restaurant) as FoodRestaurantSupport;
    support.numberOfBreakfastsPerPerson = getRandomInt(1, 7);
    support.numberOfLunchesPerPerson = getRandomInt(1, 7);
    support.numberOfDinnersPerPerson = getRandomInt(1, 7);
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateTransportationTaxiSupport(file: EvacuationFile, suppliers: Array<Supplier>): TransportationTaxiSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Transportation, SupportSubCategory.Transportation_Taxi) as TransportationTaxiSupport;
    support.fromAddress = faker.address.streetAddress();
    support.toAddress = faker.address.streetAddress();
    return support;
}

function generateTransportationOtherSupport(file: EvacuationFile, suppliers: Array<Supplier>): TransportationOtherSupport {
    let support = generateSupport(file, suppliers, SupportCategory.Transportation, SupportSubCategory.Transportation_Other) as TransportationOtherSupport;
    support.transportMode = faker.vehicle.type();
    support.totalAmount = getRandomInt(50, 200);
    return support;
}

function generateSupport(file: EvacuationFile, suppliers: Array<Supplier>, category: SupportCategory, subCategory: SupportSubCategory): Support {
    let now = new Date();
    let member_count = getRandomInt(1, (file.householdMembers?.length || 1) - 1);
    let member_ids: Array<string> = [];
    for (let i = 0; i < member_count; ++i) {
        member_ids.push(file.householdMembers ? file.householdMembers[i].id || "" : "");
    }

    let method = faker.random.arrayElement([SupportMethod.Referral, SupportMethod.ETransfer]);

    let random_supplier = faker.random.arrayElement(suppliers);

    let supportDelivery: Referral | Interac = method == SupportMethod.Referral ? {
        method: SupportMethod.Referral,
        issuedToPersonName: file.primaryRegistrantLastName + "," + file.primaryRegistrantFirstName,
        supplierAddress: random_supplier?.address,
        supplierId: random_supplier?.id || "",
        supplierName: random_supplier?.name || "",
        supplierNotes: "notes",
    } as Referral :
        {
            method: SupportMethod.ETransfer,
            receivingRegistrantId: file.primaryRegistrantId,
            recipientFirstName: file.primaryRegistrantFirstName,
            recipientLastName: file.primaryRegistrantLastName,
            notificationEmail: "autotest." + faker.internet.email(),
            notificationMobile: faker.phone.phoneNumber("###-###-####"),
        } as Interac;

    return {
        needsAssessmentId: file.needsAssessment.id,
        from: now.toISOString(),
        to: addDays(now, getRandomInt(1, 5)).toISOString(),
        status: SupportStatus.Draft,
        method: method,
        category: category,
        subCategory: subCategory,
        supportDelivery: supportDelivery,
        includedHouseholdMembers: member_ids,
    };
}
