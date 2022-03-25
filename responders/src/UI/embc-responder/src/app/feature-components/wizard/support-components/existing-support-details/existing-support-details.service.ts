import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ClothingSupport,
  EvacuationFileHouseholdMember,
  FoodGroceriesSupport,
  FoodRestaurantSupport,
  IncidentalsSupport,
  Interac,
  LodgingBilletingSupport,
  LodgingGroupSupport,
  LodgingHotelSupport,
  Referral,
  ReferralPrintRequestResponse,
  Support,
  SupportCategory,
  SupportMethod,
  SupportReprintReason,
  SupportSubCategory,
  SupportVoidReason,
  TransportationOtherSupport,
  TransportationTaxiSupport
} from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';
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
import { mergeMap } from 'rxjs/operators';
import {
  Community,
  LocationsService
} from 'src/app/core/services/locations.service';
import { DateConversionService } from 'src/app/core/services/utility/dateConversion.service';

@Injectable({ providedIn: 'root' })
export class ExistingSupportDetailsService {
  constructor(
    private registrationService: RegistrationsService,
    private locationService: LocationsService,
    public stepSupportsService: StepSupportsService,
    private dateConversionService: DateConversionService
  ) {}

  voidSupport(
    fileId: string,
    supportId: string,
    voidReason: SupportVoidReason
  ): Observable<void> {
    return this.registrationService.registrationsVoidSupport({
      fileId,
      supportId,
      voidReason
    });
  }

  reprintSupport(
    fileId: string,
    supportId: string,
    reprintReason: SupportReprintReason
  ): Observable<Blob> {
    return this.registrationService
      .registrationsReprintSupport({
        fileId,
        supportId,
        reprintReason
      })
      .pipe(
        mergeMap((result: ReferralPrintRequestResponse) => {
          const printRequestId = result.printRequestId;
          return this.registrationService.registrationsGetPrint({
            fileId,
            printRequestId
          });
        })
      );
  }

  mapMember(
    memberId: string,
    needsAssessmentForSupport: EvacuationFileModel
  ): EvacuationFileHouseholdMember {
    return needsAssessmentForSupport.householdMembers.find((value) => {
      if (value?.id === memberId) {
        return value;
      }
    });
  }

  createEditableDraft(
    selectedSupport: Support,
    needsAssessmentForSupport: EvacuationFileModel
  ) {
    console.log(selectedSupport);
    const members: Array<EvacuationFileHouseholdMember> =
      selectedSupport.includedHouseholdMembers.map((id) => {
        return this.mapMember(id, needsAssessmentForSupport);
      });

    const referralDelivery = selectedSupport.supportDelivery as Referral;
    const name = referralDelivery.issuedToPersonName?.split(',');
    const issuedToVal = name
      ? needsAssessmentForSupport.householdMembers.find((member) => {
          if (member.lastName === name[0] && member.firstName === name[1]) {
            return member;
          }
        })
      : null;

    const supplierValue = this.stepSupportsService.supplierList.find(
      (supplier) => supplier.id === referralDelivery.supplierId
    );

    const category = this.stepSupportsService.supportCategory.find(
      (supportValue) => supportValue.value === selectedSupport.category
    );
    const subCategory = this.stepSupportsService.supportSubCategory.find(
      (supportValue) => supportValue.value === selectedSupport.subCategory
    );

    this.stepSupportsService.supportTypeToAdd =
      selectedSupport.category === SupportCategory.Clothing ||
      selectedSupport.category === SupportCategory.Incidentals
        ? category
        : subCategory;
    this.stepSupportsService.supportDetails = {
      externalReferenceId: (
        selectedSupport.supportDelivery as Referral
      ).manualReferralId?.substr(1),
      issuedBy: selectedSupport.issuedBy,
      issuedOn: selectedSupport.issuedOn,
      fromDate: selectedSupport.from,
      toDate: selectedSupport.to,
      toTime: this.dateConversionService.convertDateTimeToTime(
        selectedSupport.to
      ),
      fromTime: this.dateConversionService.convertDateTimeToTime(
        selectedSupport.from
      ),
      members,
      noOfDays: this.dateConversionService.getNoOfDays(
        selectedSupport.to,
        selectedSupport.from
      ),
      referral: this.createReferral(selectedSupport)
    };

    let interac: Interac;
    if (selectedSupport.method === SupportMethod.ETransfer) {
      interac = selectedSupport.supportDelivery as Interac;
    }

    this.stepSupportsService.supportDelivery = {
      issuedTo: issuedToVal !== null ? issuedToVal : null,
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

  createReferral(
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
        noOfBreakfast: (selectedSupport as FoodRestaurantSupport)
          .numberOfBreakfastsPerPerson,
        noOfLunches: (selectedSupport as FoodRestaurantSupport)
          .numberOfLunchesPerPerson,
        noOfDinners: (selectedSupport as FoodRestaurantSupport)
          .numberOfDinnersPerPerson,
        totalAmount: (selectedSupport as FoodRestaurantSupport).totalAmount
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Food_Groceries
    ) {
      return {
        noOfMeals: (selectedSupport as FoodGroceriesSupport).numberOfDays,
        totalAmount: (selectedSupport as FoodGroceriesSupport).totalAmount,
        userTotalAmount: (selectedSupport as FoodGroceriesSupport).totalAmount,
        approverName: (selectedSupport as FoodGroceriesSupport).approverName
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
        totalAmount: (selectedSupport as TransportationOtherSupport).totalAmount
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Billeting
    ) {
      return {
        noOfNights: (selectedSupport as LodgingBilletingSupport).numberOfNights
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Group
    ) {
      return {
        noOfNights: (selectedSupport as LodgingGroupSupport).numberOfNights
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Hotel
    ) {
      return {
        noOfNights: (selectedSupport as LodgingHotelSupport).numberOfNights,
        noOfRooms: (selectedSupport as LodgingHotelSupport).numberOfRooms
      };
    } else if (selectedSupport.category === SupportCategory.Incidentals) {
      return {
        approvedItems: (selectedSupport as IncidentalsSupport).approvedItems,
        totalAmount: (selectedSupport as IncidentalsSupport).totalAmount,
        userTotalAmount: (selectedSupport as IncidentalsSupport).totalAmount,
        approverName: (selectedSupport as FoodGroceriesSupport).approverName
      };
    } else if (selectedSupport.category === SupportCategory.Clothing) {
      return {
        extremeWinterConditions: (selectedSupport as ClothingSupport)
          .extremeWinterConditions,
        totalAmount: (selectedSupport as ClothingSupport).totalAmount,
        userTotalAmount: (selectedSupport as ClothingSupport).totalAmount,
        approverName: (selectedSupport as FoodGroceriesSupport).approverName
      };
    }
  }

  parseCommunityString(communityCode: string): Community {
    const communities = this.locationService.getCommunityList();
    const community = communities.find((comm) => comm.code === communityCode);
    return community;
  }
}
