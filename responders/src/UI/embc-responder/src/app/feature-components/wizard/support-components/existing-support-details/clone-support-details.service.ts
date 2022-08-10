import { Injectable } from '@angular/core';
import {
  IncidentalsSupport,
  Interac,
  LodgingBilletingSupport,
  LodgingGroupSupport,
  LodgingHotelSupport,
  Referral,
  Support,
  SupportCategory,
  SupportMethod,
  SupportSubCategory,
  TransportationOtherSupport,
  TransportationTaxiSupport
} from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import {
  Billeting,
  Clothing,
  Groceries,
  GroupLodging,
  HotelMotel,
  Incidentals,
  OtherTransport,
  RestaurantMeal,
  SupplierDetailsModel,
  Taxi
} from 'src/app/core/models/support-details.model';
import {
  Community,
  LocationsService
} from 'src/app/core/services/locations.service';
import { DateConversionService } from 'src/app/core/services/utility/dateConversion.service';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';

@Injectable({ providedIn: 'root' })
export class CloneSupportDetailsService {
  recipientFirstName: string;
  recipientLastName: string;
  receivingRegistrantId: string;
  constructor(
    private locationService: LocationsService,
    public stepSupportsService: StepSupportsService,
    private dateConversionService: DateConversionService,
    private loadEvacueeListService: LoadEvacueeListService
  ) {}

  /**
   * Clones selected support
   *
   * @param selectedSupport
   * @param needsAssessmentForSupport
   */
  cloneSupport(
    selectedSupport: Support,
    needsAssessmentForSupport: EvacuationFileModel
  ) {
    const referralDelivery = selectedSupport.supportDelivery as Referral;
    const name = referralDelivery.issuedToPersonName?.split(',');
    const issuedToVal = name
      ? needsAssessmentForSupport.householdMembers.find((member) => {
          if (
            member.lastName === name[0].trim() &&
            member.firstName === name[1].trim()
          ) {
            return member;
          }
        })
      : null;

    const supplierValue = this.stepSupportsService?.supplierList?.find(
      (supplier) => supplier.id === referralDelivery.supplierId
    );

    const category = this.loadEvacueeListService
      .getSupportCategories()
      .find((supportValue) => supportValue.value === selectedSupport.category);
    const subCategory = this.loadEvacueeListService
      .getSupportSubCategories()
      .find(
        (supportValue) => supportValue.value === selectedSupport.subCategory
      );

    this.stepSupportsService.supportTypeToAdd =
      selectedSupport.category === SupportCategory.Clothing ||
      selectedSupport.category === SupportCategory.Incidentals
        ? category
        : subCategory;

    const fromDate = new Date();
    const fromTime = this.dateConversionService.convertDateTimeToTime(
      fromDate.toISOString()
    );
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);
    const toTime = this.dateConversionService.convertDateTimeToTime(
      toDate.toISOString()
    );
    toDate.setHours(0, 0, 0, 0);

    this.stepSupportsService.supportDetails = {
      issuedBy: '',
      issuedOn: '',
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      toTime,
      fromTime,
      members: [],
      noOfDays: 1,
      referral: this.cloneReferral(selectedSupport)
    };

    let interac: Interac;
    if (selectedSupport.method === SupportMethod.ETransfer) {
      interac = selectedSupport.supportDelivery as Interac;
      this.recipientFirstName = interac.recipientFirstName;
      this.recipientLastName = interac.recipientLastName;
      this.receivingRegistrantId = interac.receivingRegistrantId;
    }

    this.stepSupportsService.supportDelivery = {
      issuedTo: issuedToVal,
      name:
        issuedToVal === undefined ? referralDelivery.issuedToPersonName : '',
      supplier: supplierValue,
      supplierNote: referralDelivery.supplierNotes,
      details: this.createDeliveryDetails(selectedSupport),
      method: selectedSupport.method,
      notificationEmail: interac?.notificationEmail,
      notificationMobile: interac?.notificationMobile
    };
  }

  /**
   * Creates the delivery details for a given support, based in its subcategory
   *
   * @param selectedSupport
   * @returns
   */
  createDeliveryDetails(selectedSupport: Support): SupplierDetailsModel {
    if (selectedSupport.subCategory === SupportSubCategory.Lodging_Billeting) {
      return {
        hostName: (selectedSupport as LodgingBilletingSupport).hostName,
        hostAddress: (selectedSupport as LodgingBilletingSupport).hostAddress,
        hostCity: (selectedSupport as LodgingBilletingSupport).hostCity,
        hostPhone: (selectedSupport as LodgingBilletingSupport).hostPhone,
        emailAddress: (selectedSupport as LodgingBilletingSupport).hostEmail
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Group
    ) {
      return {
        hostName: (selectedSupport as LodgingGroupSupport).facilityName,
        hostAddress: (selectedSupport as LodgingGroupSupport).facilityAddress,
        hostCity: this.parseCommunityString(
          (selectedSupport as LodgingGroupSupport).facilityCommunityCode
        ),
        hostPhone: (selectedSupport as LodgingGroupSupport).facilityContactPhone
      };
    }
  }

  /**
   * Creates a referral based on its subcategory
   *
   * @param selectedSupport
   * @returns
   */
  cloneReferral(
    selectedSupport: Support
  ):
    | RestaurantMeal
    | Groceries
    | Taxi
    | OtherTransport
    | Billeting
    | GroupLodging
    | HotelMotel
    | Incidentals
    | Clothing {
    if (selectedSupport.subCategory === SupportSubCategory.Food_Restaurant) {
      return {
        noOfBreakfast: 1,
        noOfLunches: 1,
        noOfDinners: 1,
        totalAmount: null
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Food_Groceries
    ) {
      return {
        noOfMeals: 1,
        totalAmount: null,
        userTotalAmount: null,
        approverName: null
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Transportation_Taxi
    ) {
      return {
        fromAddress: (selectedSupport as TransportationTaxiSupport).fromAddress,
        toAddress: (selectedSupport as TransportationTaxiSupport).toAddress
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Transportation_Other
    ) {
      return {
        transportMode: (selectedSupport as TransportationOtherSupport)
          .transportMode,
        totalAmount: null
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Billeting
    ) {
      return {
        noOfNights: 1
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Group
    ) {
      return {
        noOfNights: 1
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Hotel
    ) {
      return {
        noOfNights: 1,
        noOfRooms: (selectedSupport as LodgingHotelSupport).numberOfRooms
      };
    } else if (selectedSupport.category === SupportCategory.Incidentals) {
      return {
        approvedItems: (selectedSupport as IncidentalsSupport).approvedItems,
        totalAmount: null,
        userTotalAmount: null,
        approverName: null
      };
    } else if (selectedSupport.category === SupportCategory.Clothing) {
      return {
        extremeWinterConditions: null,
        totalAmount: null,
        userTotalAmount: null,
        approverName: null
      };
    }
  }

  /**
   * Transforms a community code into a Community object
   *
   * @param communityCode
   * @returns
   */
  parseCommunityString(communityCode: string): Community {
    const communities = this.locationService.getCommunityList();
    const community = communities.find((comm) => comm.code === communityCode);
    return community;
  }
}
