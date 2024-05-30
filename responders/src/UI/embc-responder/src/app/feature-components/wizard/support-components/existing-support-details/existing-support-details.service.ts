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
  LodgingAllowanceSupport,
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
  ShelterAllowance,
  HotelMotel,
  Incidentals,
  OtherTransport,
  RestaurantMeal,
  SupplierDetailsModel,
  Taxi
} from 'src/app/core/models/support-details.model';
import { mergeMap } from 'rxjs/operators';
import { Community, LocationsService } from 'src/app/core/services/locations.service';
import { DateConversionService } from 'src/app/core/services/utility/dateConversion.service';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';

@Injectable({ providedIn: 'root' })
export class ExistingSupportDetailsService {
  constructor(
    private registrationService: RegistrationsService,
    private locationService: LocationsService,
    public stepSupportsService: StepSupportsService,
    private dateConversionService: DateConversionService,
    private loadEvacueeListService: LoadEvacueeListService
  ) {}

  /**
   * Method that deletes Referrals from the Database
   *
   * @param fileId
   * @param supportId
   * @param voidReason
   * @returns
   */
  voidSupport(fileId: string, supportId: string, voidReason: SupportVoidReason): Observable<void> {
    return this.registrationService.registrationsVoidSupport({
      fileId,
      supportId,
      voidReason
    });
  }

  /**
   * Method that deletes e-Transfers from the Database
   *
   * @param fileId
   * @param supportId
   * @returns
   */
  cancelSupport(fileId: string, supportId: string): Observable<void> {
    return this.registrationService.registrationsCancelSupport({
      fileId,
      supportId
    });
  }

  /**
   * Method that reprints pdf of the selected referral
   *
   * @param fileId
   * @param supportId
   * @param reprintReason
   * @returns
   */
  reprintSupport(
    fileId: string,
    supportId: string,
    reprintReason: SupportReprintReason,
    includeSummary: boolean
  ): Observable<Blob> {
    return this.registrationService
      .registrationsReprintSupport({
        fileId,
        supportId,
        reprintReason,
        includeSummary
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

  /**
   * Finds the given householdmember based on the given ID
   *
   * @param memberId
   * @param needsAssessmentForSupport
   * @returns
   */
  mapMember(memberId: string, needsAssessmentForSupport: EvacuationFileModel): EvacuationFileHouseholdMember {
    return needsAssessmentForSupport.householdMembers.find((value) => {
      if (value?.id === memberId) {
        return value;
      }
    });
  }

  /**
   * Creates a temporary support as draft that the user can edit
   *
   * @param selectedSupport
   * @param needsAssessmentForSupport
   */
  createEditableDraft(selectedSupport: Support, needsAssessmentForSupport: EvacuationFileModel) {
    const members: Array<EvacuationFileHouseholdMember> = selectedSupport.includedHouseholdMembers.map((id) => {
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

    const supplierValue = this.stepSupportsService?.supplierList?.find(
      (supplier) => supplier.id === referralDelivery.supplierId
    );

    const category = this.loadEvacueeListService
      .getSupportCategories()
      .find((supportValue) => supportValue.value === selectedSupport.category);
    const subCategory = this.loadEvacueeListService
      .getSupportSubCategories()
      .find((supportValue) => supportValue.value === selectedSupport.subCategory);

    this.stepSupportsService.supportTypeToAdd =
      selectedSupport.category === SupportCategory.Clothing || selectedSupport.category === SupportCategory.Incidentals
        ? category
        : subCategory;

    //fix bug where from/to time was being pushed forward during save. Save expects the date to have a time of 0,0,0,0
    //and adds the time field to it
    const fromDate = new Date(selectedSupport.from);
    const fromTime = this.dateConversionService.convertDateTimeToTime(fromDate.toISOString());
    const toDate = new Date(selectedSupport.to);
    const toTime = this.dateConversionService.convertDateTimeToTime(toDate.toISOString());
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
    this.stepSupportsService.supportDetails = {
      externalReferenceId: (selectedSupport.supportDelivery as Referral).manualReferralId?.substring(1),
      issuedBy: selectedSupport.issuedBy,
      issuedOn: selectedSupport.issuedOn,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      toTime,
      fromTime,
      members,
      noOfDays: this.dateConversionService.getNoOfDays(selectedSupport.to, selectedSupport.from),
      referral: this.createReferral(selectedSupport)
    };

    let interac: Interac;
    if (selectedSupport.method === SupportMethod.ETransfer) {
      interac = selectedSupport.supportDelivery as Interac;
    }

    this.stepSupportsService.supportDelivery = {
      issuedTo: issuedToVal !== null ? issuedToVal : null,
      name: issuedToVal === undefined ? referralDelivery.issuedToPersonName : '',
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
    } else if (selectedSupport.subCategory === SupportSubCategory.Lodging_Group) {
      return {
        hostName: (selectedSupport as LodgingGroupSupport).facilityName,
        hostAddress: (selectedSupport as LodgingGroupSupport).facilityAddress,
        hostCity: this.parseCommunityString((selectedSupport as LodgingGroupSupport).facilityCommunityCode),
        hostPhone: (selectedSupport as LodgingGroupSupport).facilityContactPhone
      };
    } else if (selectedSupport.subCategory === SupportSubCategory.Lodging_Allowance) {
      return {
        hostName: ((selectedSupport as LodgingAllowanceSupport).supportDelivery as Referral).issuedToPersonName,
        hostPhone: (selectedSupport as LodgingAllowanceSupport).contactPhone,
        emailAddress: (selectedSupport as LodgingAllowanceSupport).contactEmail
      };
    }
  }

  /**
   * Creates a referral based on its subcategory
   *
   * @param selectedSupport
   * @returns
   */
  createReferral(
    selectedSupport: Support
  ):
    | RestaurantMeal
    | Groceries
    | Taxi
    | OtherTransport
    | Billeting
    | GroupLodging
    | ShelterAllowance
    | HotelMotel
    | Incidentals
    | Clothing {
    if (selectedSupport.subCategory === SupportSubCategory.Food_Restaurant) {
      return {
        noOfBreakfast: (selectedSupport as FoodRestaurantSupport).numberOfBreakfastsPerPerson,
        noOfLunches: (selectedSupport as FoodRestaurantSupport).numberOfLunchesPerPerson,
        noOfDinners: (selectedSupport as FoodRestaurantSupport).numberOfDinnersPerPerson,
        totalAmount: (selectedSupport as FoodRestaurantSupport).totalAmount
      };
    } else if (selectedSupport.subCategory === SupportSubCategory.Food_Groceries) {
      return {
        noOfMeals: (selectedSupport as FoodGroceriesSupport).numberOfDays,
        totalAmount: (selectedSupport as FoodGroceriesSupport).totalAmount,
        userTotalAmount: (selectedSupport as FoodGroceriesSupport).totalAmount,
        approverName: (selectedSupport as FoodGroceriesSupport).approverName
      };
    } else if (selectedSupport.subCategory === SupportSubCategory.Transportation_Taxi) {
      return {
        fromAddress: (selectedSupport as TransportationTaxiSupport).fromAddress,
        toAddress: (selectedSupport as TransportationTaxiSupport).toAddress
      };
    } else if (selectedSupport.subCategory === SupportSubCategory.Transportation_Other) {
      return {
        transportMode: (selectedSupport as TransportationOtherSupport).transportMode,
        totalAmount: (selectedSupport as TransportationOtherSupport).totalAmount
      };
    } else if (selectedSupport.subCategory === SupportSubCategory.Lodging_Billeting) {
      return {
        noOfNights: (selectedSupport as LodgingBilletingSupport).numberOfNights
      };
    } else if (selectedSupport.subCategory === SupportSubCategory.Lodging_Group) {
      return {
        noOfNights: (selectedSupport as LodgingGroupSupport).numberOfNights
      };
    } else if (selectedSupport.subCategory === SupportSubCategory.Lodging_Hotel) {
      return {
        noOfNights: (selectedSupport as LodgingHotelSupport).numberOfNights,
        noOfRooms: (selectedSupport as LodgingHotelSupport).numberOfRooms
      };
    } else if (selectedSupport.subCategory === SupportSubCategory.Lodging_Allowance) {
      return {
        noOfNights: (selectedSupport as LodgingAllowanceSupport).numberOfNights,
        totalAmount: (selectedSupport as LodgingAllowanceSupport).totalAmount,
        contactEmail: (selectedSupport as LodgingAllowanceSupport).contactEmail,
        contactPhone: (selectedSupport as LodgingAllowanceSupport).contactPhone,
        fullName: (selectedSupport.supportDelivery as Referral).issuedToPersonName
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
        extremeWinterConditions: (selectedSupport as ClothingSupport).extremeWinterConditions,
        totalAmount: (selectedSupport as ClothingSupport).totalAmount,
        userTotalAmount: (selectedSupport as ClothingSupport).totalAmount,
        approverName: (selectedSupport as FoodGroceriesSupport).approverName
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
