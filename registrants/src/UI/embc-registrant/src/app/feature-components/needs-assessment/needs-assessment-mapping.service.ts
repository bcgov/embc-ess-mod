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
    console.log(evacuatedAddress);
    this.evacuationFileDataService.evacuatedAddress = evacuatedAddress;
    this.needsAssessmentService.insurance = insurance;

    this.formCreationService
      .getEvacuatedForm()
      .pipe(first())
      .subscribe((details) => {
        console.log(details);
        details.setValue({
          evacuatedFromPrimary: this.isSameAddress(evacuatedAddress),
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
            sameLastNameCheck: ''
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
    this.needsAssessmentService.canEvacueeProvideClothing =
      canEvacueeProvideClothing;
    this.needsAssessmentService.canEvacueeProvideFood = canEvacueeProvideFood;
    this.needsAssessmentService.canEvacueeProvideIncidentals =
      canEvacueeProvideIncidentals;
    this.needsAssessmentService.canEvacueeProvideLodging =
      canEvacueeProvideLodging;
    this.needsAssessmentService.canEvacueeProvideTransportation =
      canEvacueeProvideTransportation;

    this.formCreationService
      .getIndentifyNeedsForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          canEvacueeProvideClothing,
          canEvacueeProvideFood,
          canEvacueeProvideIncidentals,
          canEvacueeProvideLodging,
          canEvacueeProvideTransportation
        });
      });
  }

  public convertVerifiedHouseholdMembers(
    householdMembers: Array<HouseholdMember>
  ): Array<PersonDetails> {
    const householdMembersFormArray: Array<PersonDetails> = [];

    for (const member of householdMembers) {
      if (!this.isSameUser(member.details)) {
        const memberDetails: PersonDetails = {
          firstName: member.details.firstName,
          lastName: member.details.lastName,
          initials: member.details.initials,
          gender: member.details.gender,
          dateOfBirth: member.details.dateOfBirth,
          sameLastNameCheck: this.isSameLastName(member.details.lastName)
        };

        householdMembersFormArray.push(memberDetails);
      } else {
        this.needsAssessmentService.mainHouseholdMember = member;
      }
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

  public addMainHouseholdMembers(): void {
    if (
      !this.needsAssessmentService.householdMembers.includes(
        this.needsAssessmentService.mainHouseholdMember
      )
    ) {
      this.needsAssessmentService.householdMembers.push(
        this.needsAssessmentService.mainHouseholdMember
      );
    }
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

  private isSameAddress(evacAddress: RegAddress): string {
    const userPersonalAddress = this.profileDataService.primaryAddressDetails;

    if (evacAddress === userPersonalAddress) {
      return 'Yes';
    } else {
      return 'No';
    }
  }

  private isSameUser(householdMember: PersonDetails): boolean {
    const currentUser = this.profileDataService.personalDetails;
    if (
      currentUser.firstName === householdMember.firstName &&
      currentUser.lastName === householdMember.lastName &&
      currentUser.dateOfBirth === householdMember.dateOfBirth &&
      currentUser.gender === householdMember.gender &&
      currentUser.initials === householdMember.initials &&
      currentUser.preferredName === householdMember.preferredName
    ) {
      return true;
    } else {
      return false;
    }
  }
}
