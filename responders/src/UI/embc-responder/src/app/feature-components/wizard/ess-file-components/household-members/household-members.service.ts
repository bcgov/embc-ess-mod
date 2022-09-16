import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';

@Injectable({ providedIn: 'root' })
export class HouseholdMembersService {
  /**
   * Updates the validations for personalDetailsForm
   */
  public updateOnVisibility(householdForm: UntypedFormGroup): UntypedFormGroup {
    householdForm.get('houseHoldMember.firstName').updateValueAndValidity();
    householdForm.get('houseHoldMember.lastName').updateValueAndValidity();
    householdForm.get('houseHoldMember.gender').updateValueAndValidity();
    householdForm.get('houseHoldMember.dateOfBirth').updateValueAndValidity();

    return householdForm;
  }

  /**
   * Displays the PersonDetails form to add new household members to the form
   */
  addMembers(householdForm: UntypedFormGroup): UntypedFormGroup {
    householdForm.get('houseHoldMember').reset();
    householdForm.get('addMemberFormIndicator').setValue(true);
    householdForm.get('addMemberIndicator').setValue(true);

    return householdForm;
  }

  saveHouseholdMember(householdForm: UntypedFormGroup): UntypedFormGroup {
    householdForm.get('houseHoldMember').reset();
    householdForm.get('addMemberFormIndicator').setValue(false);
    householdForm.get('addMemberIndicator').setValue(false);

    return householdForm;
  }

  /**
   * Allows editing information from inserted household members
   *
   * @param element
   * @param index
   */
  editRow(householdForm: UntypedFormGroup, element): UntypedFormGroup {
    householdForm.get('houseHoldMember').patchValue(element);
    householdForm.get('addMemberFormIndicator').setValue(true);
    return householdForm;
  }

  /**
   * Resets the househol Member form and goes back to the main Form
   */
  cancel(householdForm: UntypedFormGroup): UntypedFormGroup {
    householdForm.get('addMemberFormIndicator').setValue(false);
    householdForm.get('addMemberIndicator').setValue(false);
    householdForm.get('houseHoldMember').reset();
    return householdForm;
  }

  householdMemberExists(
    newMember: HouseholdMemberModel,
    household: HouseholdMemberModel[]
  ): HouseholdMemberModel {
    return household.find((member) => this.householdEquals(newMember, member));
  }

  private householdEquals(
    newMember: HouseholdMemberModel,
    oldMember: HouseholdMemberModel
  ): boolean {
    return (
      newMember.dateOfBirth === oldMember.dateOfBirth &&
      newMember.firstName.toLowerCase() === oldMember.firstName.toLowerCase() &&
      newMember.lastName.toLowerCase() === oldMember.lastName.toLowerCase() &&
      newMember.gender === oldMember.gender
    );
  }
}
