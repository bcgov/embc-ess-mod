import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { HouseholdMember, IdentifiedNeed, InsuranceOption, NeedsAssessment, Pet } from 'src/app/core/api/models';
import { RegAddress } from 'src/app/core/model/address';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../../sharedModules/components/evacuation-file/evacuation-file-data.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { NeedsAssessmentService } from './needs-assessment.service';
import * as _ from 'lodash';
import { ShelterType } from 'src/app/core/services/globalConstants';
import { HouseholdMemberModel } from 'src/app/core/model/household-member.model';

@Injectable({ providedIn: 'root' })
export class NeedsAssessmentMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private profileDataService: ProfileDataService,
    private needsAssessmentService: NeedsAssessmentService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {}

  setNeedsAssessment(evacuatedAddress: RegAddress, needsAssessment: NeedsAssessment): void {
    this.setNeedsAssessmentId(needsAssessment.id);
    this.setInsurance(evacuatedAddress, needsAssessment.insurance);
    this.setHouseholdMembers(needsAssessment.householdMembers);
    this.setPets(needsAssessment.pets);
    this.setIdentifiedNeeds(needsAssessment.needs);
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
          evacuatedFromPrimary: this.isSameRegAddress(this.profileDataService.primaryAddressDetails, evacuatedAddress),
          evacuatedFromAddress: evacuatedAddress,
          insurance
        });
      });
  }

  setHouseholdMembers(householdMembers: Array<HouseholdMember>): void {
    this.needsAssessmentService.householdMembers = householdMembers;

    this.formCreationService
      .getHouseholdMembersForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          householdMembers: this.convertVerifiedHouseholdMembers(householdMembers),
          householdMember: {
            dateOfBirth: '',
            firstName: '',
            gender: '',
            initials: '',
            lastName: '',
            sameLastNameCheck: '',
            isPrimaryRegistrant: false,
            id: '',
            isMinor: false,
            email: '',
            phone: ''
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

  setIdentifiedNeeds(needs: IdentifiedNeed[]): void {
    this.formCreationService
      .getIndentifyNeedsForm()
      .pipe(first())
      .subscribe((details) => {
        details.controls.requiresClothing.setValue(needs.includes(IdentifiedNeed.Clothing));
        details.controls.requiresFood.setValue(needs.includes(IdentifiedNeed.Food));
        details.controls.requiresIncidentals.setValue(needs.includes(IdentifiedNeed.Incidentals));
        if (needs.includes(IdentifiedNeed.ShelterReferral)) {
          details.controls.requiresShelterType.setValue(ShelterType.referral);
        } else if (needs.includes(IdentifiedNeed.ShelterAllowance)) {
          details.controls.requiresShelterType.setValue(ShelterType.allowance);
        } else {
          details.controls.requiresShelterType.setValue(undefined);
        }

        details.controls.requiresShelter.setValue(details.controls.requiresShelterType.value !== undefined);

        // if none of the needs are selected then set requiresNothing to true
        if (!needs || needs?.length === 0) details.controls.requiresNothing.setValue(true);
      });
  }

  public convertVerifiedHouseholdMembers(householdMembers: Array<HouseholdMember>): Array<HouseholdMemberModel> {
    const householdMembersFormArray: Array<HouseholdMemberModel> = [];

    for (const member of householdMembers) {
      const memberDetails: HouseholdMemberModel = {
        firstName: member.details.firstName,
        lastName: member.details.lastName,
        initials: member.details.initials,
        gender: member.details.gender,
        dateOfBirth: member.details.dateOfBirth,
        isPrimaryRegistrant: member.isPrimaryRegistrant,
        sameLastNameCheck: this.isSameLastName(member.details.lastName),
        id: member.id,
        isMinor: member.isMinor,
        email: member.contactDetails?.email,
        phone: member.contactDetails?.phone
      };

      householdMembersFormArray.push(memberDetails);
    }

    return householdMembersFormArray;
  }

  public convertNonVerifiedHouseholdMembers(householdMembers: Array<HouseholdMember>): Array<HouseholdMemberModel> {
    const householdMembersFormArray: Array<HouseholdMemberModel> = [];

    for (const member of householdMembers) {
      const memberDetails: HouseholdMemberModel = {
        firstName: member.details.firstName,
        lastName: member.details.lastName,
        initials: member.details.initials,
        gender: member.details.gender,
        dateOfBirth: member.details.dateOfBirth,
        sameLastNameCheck: this.isSameLastName(member.details.lastName),
        isMinor: member.isMinor,
        email: member.contactDetails?.email,
        phone: member.contactDetails?.phone
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
