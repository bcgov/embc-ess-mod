import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ClothingReferral,
  EvacuationFileHouseholdMember,
  FoodGroceriesReferral,
  FoodRestaurantReferral,
  IncidentalsReferral,
  LodgingBilletingReferral,
  LodgingGroupReferral,
  LodgingHotelReferral,
  Referral,
  ReferralPrintRequestResponse,
  Support,
  SupportCategory,
  SupportReprintReason,
  SupportSubCategory,
  SupportVoidReason,
  TransportationOtherReferral,
  TransportationTaxiReferral
} from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as moment from 'moment';
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

@Injectable({ providedIn: 'root' })
export class ExistingSupportDetailsService {
  constructor(
    private registrationService: RegistrationsService,
    private locationService: LocationsService,
    public stepSupportsService: StepSupportsService,
    public datePipe: DatePipe
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

    const milliseconds = moment(
      this.datePipe.transform(selectedSupport.to, 'yyyy-MM-dd')
    ).diff(this.datePipe.transform(selectedSupport.from, 'yyy-MM-dd'));

    const days = milliseconds / 86400000;

    const referralDelivery = selectedSupport as Referral;
    const name = referralDelivery.issuedToPersonName.split(',');
    const issuedToVal = needsAssessmentForSupport.householdMembers.find(
      (member) => {
        if (member.lastName === name[0] && member.firstName === name[1]) {
          return member;
        }
      }
    );
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
        selectedSupport as Referral
      ).externalReferenceId.substr(1),
      issuedBy: selectedSupport.issuedBy,
      issuedOn: selectedSupport.issuedOn,
      fromDate: selectedSupport.from,
      toDate: selectedSupport.to,
      toTime: this.datePipe.transform(selectedSupport.to, 'HH:mm'),
      fromTime: this.datePipe.transform(selectedSupport.from, 'HH:mm'),
      members,
      noOfDays: days,
      referral: this.createReferral(selectedSupport)
    };

    this.stepSupportsService.supportDelivery = {
      issuedTo: issuedToVal !== null ? issuedToVal : null,
      name:
        issuedToVal === undefined ? referralDelivery.issuedToPersonName : '',
      supplier: supplierValue,
      supplierNote: referralDelivery.supplierNotes,
      details: this.createDeliveryDetails(selectedSupport)
    };
  }

  createDeliveryDetails(selectedSupport: Support): SupplierDetailsModel {
    if (selectedSupport.subCategory === SupportSubCategory.Lodging_Billeting) {
      return {
        hostName: (selectedSupport as LodgingBilletingReferral).hostName,
        hostAddress: (selectedSupport as LodgingBilletingReferral).hostAddress,
        hostCity: (selectedSupport as LodgingBilletingReferral).hostCity,
        hostPhone: (selectedSupport as LodgingBilletingReferral).hostPhone,
        emailAddress: (selectedSupport as LodgingBilletingReferral).hostEmail
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Group
    ) {
      return {
        hostName: (selectedSupport as LodgingGroupReferral).facilityName,
        hostAddress: (selectedSupport as LodgingGroupReferral).facilityAddress,
        hostCity: this.parseCommunityString(
          (selectedSupport as LodgingGroupReferral).facilityCommunityCode
        ),
        hostPhone: (selectedSupport as LodgingGroupReferral)
          .facilityContactPhone
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
        noOfBreakfast: (selectedSupport as FoodRestaurantReferral)
          .numberOfBreakfastsPerPerson,
        noOfLunches: (selectedSupport as FoodRestaurantReferral)
          .numberOfLunchesPerPerson,
        noOfDinners: (selectedSupport as FoodRestaurantReferral)
          .numberOfDinnersPerPerson,
        totalAmount: (selectedSupport as FoodRestaurantReferral).totalAmount
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Food_Groceries
    ) {
      return {
        noOfMeals: (selectedSupport as FoodGroceriesReferral).numberOfDays,
        totalAmount: (selectedSupport as FoodGroceriesReferral).totalAmount,
        userTotalAmount: (selectedSupport as FoodGroceriesReferral).totalAmount
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Transportation_Taxi
    ) {
      return {
        fromAddress: (selectedSupport as TransportationTaxiReferral)
          .fromAddress,
        toAddress: (selectedSupport as TransportationTaxiReferral).toAddress
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Transportation_Other
    ) {
      return {
        transportMode: (selectedSupport as TransportationOtherReferral)
          .transportMode,
        totalAmount: (selectedSupport as TransportationOtherReferral)
          .totalAmount
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Billeting
    ) {
      return {
        noOfNights: (selectedSupport as LodgingBilletingReferral).numberOfNights
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Group
    ) {
      return {
        noOfNights: (selectedSupport as LodgingGroupReferral).numberOfNights
      };
    } else if (
      selectedSupport.subCategory === SupportSubCategory.Lodging_Hotel
    ) {
      return {
        noOfNights: (selectedSupport as LodgingHotelReferral).numberOfNights,
        noOfRooms: (selectedSupport as LodgingHotelReferral).numberOfRooms
      };
    } else if (selectedSupport.category === SupportCategory.Incidentals) {
      return {
        approvedItems: (selectedSupport as IncidentalsReferral).approvedItems,
        totalAmount: (selectedSupport as IncidentalsReferral).totalAmount,
        userTotalAmount: (selectedSupport as IncidentalsReferral).totalAmount
      };
    } else if (selectedSupport.category === SupportCategory.Clothing) {
      return {
        extremeWinterConditions: (selectedSupport as ClothingReferral)
          .extremeWinterConditions,
        totalAmount: (selectedSupport as ClothingReferral).totalAmount,
        userTotalAmount: (selectedSupport as ClothingReferral).totalAmount
      };
    }
  }

  parseCommunityString(communityCode: string): Community {
    const communities = this.locationService.getCommunityList();
    const community = communities.find((comm) => comm.code === communityCode);
    return community;
  }
}
