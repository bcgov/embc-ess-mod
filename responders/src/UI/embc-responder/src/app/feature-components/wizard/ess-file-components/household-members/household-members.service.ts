import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class HouseholdMembersService {
  /**
   * Updates the validations for personalDetailsForm
   */
  public updateOnVisibility(householdForm: FormGroup): FormGroup {
    householdForm.get('houseHoldMember.firstName').updateValueAndValidity();
    householdForm.get('houseHoldMember.lastName').updateValueAndValidity();
    householdForm.get('houseHoldMember.gender').updateValueAndValidity();
    householdForm.get('houseHoldMember.dateOfBirth').updateValueAndValidity();

    return householdForm;
  }

  /**
   * Displays the PersonDetails form to add new household members to the form
   */
  addMembers(householdForm: FormGroup): FormGroup {
    householdForm.get('houseHoldMember').reset();
    householdForm.get('addMemberIndicator').setValue(true);

    return householdForm;
  }

  saveHouseholdMember(householdForm: FormGroup, data: any[]): FormGroup {
    householdForm.get('houseHoldMember').reset();
    householdForm.get('addMemberIndicator').setValue(false);

    return householdForm;
  }

  /**
   * Allows editing information from inserted household members
   *
   * @param element
   * @param index
   */
  editRow(householdForm: FormGroup, element): FormGroup {
    householdForm.get('houseHoldMember').setValue(element);
    householdForm.get('addMemberIndicator').setValue(true);
    return householdForm;
  }

  /**
   * Resets the househol Member form and goes back to the main Form
   */
  cancel(householdForm: FormGroup): FormGroup {
    householdForm.get('addMemberIndicator').setValue(false);
    householdForm.get('houseHoldMember').reset();
    return householdForm;
  }
}
