import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import {
  Address,
  HouseholdMember,
  InsuranceOption,
  NeedsAssessment,
  Pet
} from 'src/app/core/api/models';
import { RegAddress } from 'src/app/core/model/address';
import { PersonDetails } from 'src/app/core/model/profile.model';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../../sharedModules/components/evacuation-file/evacuation-file-data.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { NeedsAssessmentService } from './needs-assessment.service';
import * as _ from 'lodash';
import * as globalConst from '../../core/services/globalConstants';

@Injectable({ providedIn: 'root' })
export class NeedsAssessmentMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private profileDataService: ProfileDataService,
    private needsAssessmentService: NeedsAssessmentService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {}

  setNeedsAssessment(
    evacuatedAddress: RegAddress,
    needsAssessment: NeedsAssessment
  ): void {
    this.setNeedsAssessmentId(needsAssessment.id);
    this.setInsurance(evacuatedAddress, needsAssessment.insurance);
    this.setFamilyMedicationDiet(
      needsAssessment.haveMedication,
      needsAssessment.haveSpecialDiet,
      needsAssessment.householdMembers,
      needsAssessment.specialDietDetails
    );
    this.setPets(needsAssessment.pets, needsAssessment.hasPetsFood);
    this.setIdentifiedNeeds(
      needsAssessment.canEvacueeProvideClothing,
      needsAssessment.canEvacueeProvideFood,
      needsAssessment.canEvacueeProvideIncidentals,
      needsAssessment.canEvacueeProvideLodging,
      needsAssessment.canEvacueeProvideTransportation
    );
  }

  setNeedsAssessmentId(needsAssessmentID: string): void {
    this.needsAssessmentService.id = needsAssessmentID;
  }

  setInsurance(evacuatedAddress: RegAddress, insurance: InsuranceOption): void {
    this.evacuationFileDataService.evacuatedAddress = evacuatedAddress;
    this.needsAssessmentService.insurance = insurance;

    this.formCreationService
      .getEvacuatedForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          evacuatedFromPrimary: this.isSameRegAddress(
            this.profileDataService.primaryAddressDetails,
            evacuatedAddress
          ),
          evacuatedFromAddress: evacuatedAddress,
          insurance
        });
      });
  }

  setFamilyMedicationDiet(
    haveMedication: boolean,
    haveSpecialDiet: boolean,
    householdMembers: Array<HouseholdMember>,
    specialDietDetails: string
  ): void {
    this.needsAssessmentService.haveMedication = haveMedication;
    this.needsAssessmentService.haveSpecialDiet = haveSpecialDiet;
    this.needsAssessmentService.specialDietDetails = specialDietDetails;
    this.needsAssessmentService.householdMembers = householdMembers;

    this.formCreationService
      .getHouseholdMembersForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          haveMedication,
          haveSpecialDiet,
          specialDietDetails,
          householdMembers:
            this.convertVerifiedHouseholdMembers(householdMembers),
          householdMember: {
            dateOfBirth: '',
            firstName: '',
            gender: '',
            initials: '',
            lastName: '',
            sameLastNameCheck: '',
            isPrimaryRegistrant: ''
          },
          addHouseholdMemberIndicator: null
        });
      });
  }

  setPets(pets: Array<Pet>, hasPetsFood: boolean): void {
    this.needsAssessmentService.hasPetsFood = hasPetsFood;
    this.needsAssessmentService.pets = pets;

    this.formCreationService
      .getPetsForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          pets,
          pet: {
            quantity: '',
            type: ''
          },
          addPetIndicator: null,
          hasPetsFood,
          addPetFoodIndicator: null
        });
      });
  }

  setIdentifiedNeeds(
    canEvacueeProvideClothing: boolean,
    canEvacueeProvideFood: boolean,
    canEvacueeProvideIncidentals: boolean,
    canEvacueeProvideLodging: boolean,
    canEvacueeProvideTransportation: boolean
  ): void {
    this.needsAssessmentService.canEvacueeProvideFood =
      globalConst.needsOptions.find(
        (ins) => ins.apiValue === canEvacueeProvideFood
      )?.value;

    this.needsAssessmentService.canEvacueeProvideLodging =
      globalConst.needsOptions.find(
        (ins) => ins.apiValue === canEvacueeProvideLodging
      )?.value;

    this.needsAssessmentService.canEvacueeProvideClothing =
      globalConst.needsOptions.find(
        (ins) => ins.apiValue === canEvacueeProvideClothing
      )?.value;

    this.needsAssessmentService.canEvacueeProvideTransportation =
      globalConst.needsOptions.find(
        (ins) => ins.apiValue === canEvacueeProvideTransportation
      )?.value;

    this.needsAssessmentService.canEvacueeProvideIncidentals =
      globalConst.needsOptions.find(
        (ins) => ins.apiValue === canEvacueeProvideIncidentals
      )?.value;

    this.formCreationService
      .getIndentifyNeedsForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          canEvacueeProvideClothing:
            this.needsAssessmentService.canEvacueeProvideClothing,
          canEvacueeProvideFood:
            this.needsAssessmentService.canEvacueeProvideFood,
          canEvacueeProvideIncidentals:
            this.needsAssessmentService.canEvacueeProvideIncidentals,
          canEvacueeProvideLodging:
            this.needsAssessmentService.canEvacueeProvideLodging,
          canEvacueeProvideTransportation:
            this.needsAssessmentService.canEvacueeProvideTransportation
        });
      });
  }

  public convertVerifiedHouseholdMembers(
    householdMembers: Array<HouseholdMember>
  ): Array<PersonDetails> {
    const householdMembersFormArray: Array<PersonDetails> = [];

    for (const member of householdMembers) {
      const memberDetails: PersonDetails = {
        firstName: member.details.firstName,
        lastName: member.details.lastName,
        initials: member.details.initials,
        gender: member.details.gender,
        dateOfBirth: member.details.dateOfBirth,
        isPrimaryRegistrant: member.isPrimaryRegistrant,
        sameLastNameCheck: this.isSameLastName(member.details.lastName)
      };

      householdMembersFormArray.push(memberDetails);
    }

    return householdMembersFormArray;
  }

  public convertNonVerifiedHouseholdMembers(
    householdMembers: Array<HouseholdMember>
  ): Array<PersonDetails> {
    const householdMembersFormArray: Array<PersonDetails> = [];

    for (const member of householdMembers) {
      const memberDetails: PersonDetails = {
        firstName: member.details.firstName,
        lastName: member.details.lastName,
        initials: member.details.initials,
        gender: member.details.gender,
        dateOfBirth: member.details.dateOfBirth,
        sameLastNameCheck: this.isSameLastName(member.details.lastName)
      };

      householdMembersFormArray.push(memberDetails);
    }

    return householdMembersFormArray;
  }

  private isSameLastName(lastname: string): boolean {
    const pathname = window.location.pathname;
    let userLastname: string;

    if (pathname.includes('non-verified-registration')) {
      this.formCreationService
        .getPersonalDetailsForm()
        .pipe(first())
        .subscribe((personalDetails) => {
          userLastname = personalDetails.get('lastName').value;
        });
    } else {
      const userPersonalDetails = this.profileDataService.personalDetails;
      userLastname = userPersonalDetails.lastName;
    }

    return userLastname === lastname;
  }

  private isSameRegAddress(address1: RegAddress, address2: RegAddress): string {
    const result: boolean = _.isEqual(address1, address2);

    if (result) {
      return 'Yes';
    } else {
      return 'No';
    }
  }
}
