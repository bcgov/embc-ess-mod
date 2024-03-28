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
      needsAssessment.householdMembers
    );
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
    householdMembers: Array<HouseholdMember>
  ): void {
    this.needsAssessmentService.householdMembers = householdMembers;

    this.formCreationService
      .getHouseholdMembersForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
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

  setPets(pets: Array<Pet>): void {
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
          addPetIndicator: null
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
      globalConst.booleanOptions.find(
        (ins) => ins.value === canEvacueeProvideFood
      )?.name;

    this.needsAssessmentService.canEvacueeProvideLodging =
      globalConst.booleanOptions.find(
        (ins) => ins.value === canEvacueeProvideLodging
      )?.name;

    this.needsAssessmentService.canEvacueeProvideClothing =
      globalConst.booleanOptions.find(
        (ins) => ins.value === canEvacueeProvideClothing
      )?.name;

    this.needsAssessmentService.canEvacueeProvideTransportation =
      globalConst.booleanOptions.find(
        (ins) => ins.value === canEvacueeProvideTransportation
      )?.name;

    this.needsAssessmentService.canEvacueeProvideIncidentals =
      globalConst.booleanOptions.find(
        (ins) => ins.value === canEvacueeProvideIncidentals
      )?.name;

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
