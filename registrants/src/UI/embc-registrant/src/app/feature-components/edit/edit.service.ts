import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../../sharedModules/components/evacuation-file/evacuation-file-data.service';
import { NeedsAssessmentMappingService } from '../needs-assessment/needs-assessment-mapping.service';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { RestrictionService } from '../restriction/restriction.service';

@Injectable({ providedIn: 'root' })
export class EditService {
  constructor(
    private profileDataService: ProfileDataService,
    private needsAssessmentDataService: NeedsAssessmentService,
    private restrictionService: RestrictionService,
    private formCreationService: FormCreationService,
    private needsAssessmentMapping: NeedsAssessmentMappingService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {}

  /**
   * Updates the form with latest values
   *
   * @param component current component name
   */
  saveFormData(component: string, form: UntypedFormGroup, path: string): void {
    switch (component) {
      case 'restriction':
        this.restrictionService.restrictedAccess = form.get('restrictedAccess').value;
        break;
      case 'personal-details':
        this.profileDataService.personalDetails = form.value;
        break;
      case 'address':
        this.profileDataService.primaryAddressDetails = form.get('address').value;
        this.profileDataService.mailingAddressDetails = form.get('mailingAddress').value;
        let evacFromPrimary: string;
        this.formCreationService
          .getEvacuatedForm()
          .pipe(first())
          .subscribe((evacuatedForm) => {
            evacFromPrimary = evacuatedForm.value.evacuatedFromPrimary;
          });

        if (evacFromPrimary === 'Yes') {
          const evacuationAddress = form.get('address').value;
          const insurance = this.needsAssessmentDataService.insurance;
          this.needsAssessmentMapping.setInsurance(evacuationAddress, insurance);
        }
        break;
      case 'contact-info':
        this.profileDataService.contactDetails = form.value;
        break;
      case 'security-questions':
        this.saveSecurityQuestions(form.get('questions') as UntypedFormGroup);
        break;
      case 'evac-address':
        this.evacuationFileDataService.evacuatedAddress = form.get('evacuatedFromAddress').value;
        this.needsAssessmentDataService.insurance = form.get('insurance').value;
        break;
      case 'pets':
        this.needsAssessmentDataService.pets = form.get('pets').value;
        break;
      case 'family-information':
        this.needsAssessmentDataService.setHouseHoldMembers(form.get('householdMembers').value);
        break;
      case 'identify-needs':
        this.needsAssessmentDataService.setNeedsDetails(form);
        break;
      case 'secret':
        this.evacuationFileDataService.secretPhrase = form.get('secretPhrase').value;
        break;
      default:
    }
  }

  /**
   * Cancels the updates and sets the form with existing values
   *
   * @param component current component name
   * @param form  form to update
   */
  cancelFormData(component: string, form: UntypedFormGroup, path: string): void {
    switch (component) {
      case 'restriction':
        if (this.restrictionService.restrictedAccess !== undefined) {
          form.get('restrictedAccess').patchValue(this.restrictionService.restrictedAccess);
        } else {
          form.reset();
        }
        break;
      case 'personal-details':
        if (this.profileDataService.personalDetails !== undefined) {
          form.patchValue(this.profileDataService.personalDetails);
        } else {
          form.reset();
        }
        break;
      case 'address':
        if (
          this.profileDataService.primaryAddressDetails !== undefined &&
          this.profileDataService.mailingAddressDetails !== undefined
        ) {
          form.get('address').patchValue(this.profileDataService.primaryAddressDetails);
          form.get('mailingAddress').patchValue(this.profileDataService.mailingAddressDetails);
        } else {
          form.reset();
        }
        break;
      case 'contact-info':
        if (this.profileDataService.contactDetails !== undefined) {
          form.patchValue(this.profileDataService.contactDetails);
        } else {
          form.reset();
        }
        break;
      case 'security-questions':
        if (this.profileDataService.securityQuestions !== undefined) {
          form.get('questions.question1').patchValue(this.profileDataService?.securityQuestions[0]?.question);
          form.get('questions.answer1').patchValue(this.profileDataService?.securityQuestions[0]?.answer);

          form.get('questions.question2').patchValue(this.profileDataService?.securityQuestions[1]?.question);
          form.get('questions.answer2').patchValue(this.profileDataService?.securityQuestions[1]?.answer);

          form.get('questions.question3').patchValue(this.profileDataService?.securityQuestions[2]?.question);
          form.get('questions.answer3').patchValue(this.profileDataService?.securityQuestions[2]?.answer);
        } else {
          form.reset();
        }
        break;
      case 'evac-address':
        if (
          this.evacuationFileDataService.evacuatedAddress !== undefined &&
          this.needsAssessmentDataService.insurance !== undefined
        ) {
          form.get('evacuatedFromAddress').patchValue(this.evacuationFileDataService.evacuatedAddress);
          form.get('insurance').patchValue(this.needsAssessmentDataService.insurance);
        } else {
          form.reset();
        }
        break;
      case 'family-information':
        if (this.needsAssessmentDataService.householdMembers.length !== 0) {
          if (path === 'verified-registration') {
            form
              .get('householdMembers')
              .patchValue(
                this.needsAssessmentMapping.convertVerifiedHouseholdMembers(
                  this.needsAssessmentDataService.householdMembers
                )
              );
          } else {
            form
              .get('householdMembers')
              .patchValue(
                this.needsAssessmentMapping.convertNonVerifiedHouseholdMembers(
                  this.needsAssessmentDataService.householdMembers
                )
              );
          }
        } else {
          form.get('householdMembers').patchValue([]);
        }
        break;
      case 'pets':
        if (this.needsAssessmentDataService.pets?.length !== 0) {
          form.get('pets').patchValue(this.needsAssessmentDataService.pets);
        } else {
          form.get('pets').patchValue([]);
        }
        break;
      case 'identify-needs':
        if (
          this.needsAssessmentDataService.requiresClothing ||
          this.needsAssessmentDataService.requiresFood ||
          this.needsAssessmentDataService.requiresIncidentals ||
          this.needsAssessmentDataService.requiresShelterType
        ) {
          form.get('requiresClothing').patchValue(this.needsAssessmentDataService.requiresClothing);
          form.get('requiresFood').patchValue(this.needsAssessmentDataService.requiresFood);
          form.get('requiresIncidentals').patchValue(this.needsAssessmentDataService.requiresIncidentals);
          form.get('requiresShelterType').patchValue(this.needsAssessmentDataService.requiresShelterType);
        } else {
          form.reset();
        }
        break;

      case 'secret':
        if (this.evacuationFileDataService.secretPhrase !== undefined) {
          form.get('secretPhrase').patchValue(this.evacuationFileDataService.secretPhrase);
        } else {
          form.reset();
        }
        break;
      default:
    }
  }

  private saveSecurityQuestions(questionForm: UntypedFormGroup) {
    let anyValueSet = false;
    const questionSet = [];
    // Create SecurityQuestion objects and save to array, and check if any value set
    for (let i = 1; i <= 3; i++) {
      const question = questionForm.get(`question${i}`).value?.trim() ?? '';

      const answer = questionForm.get(`answer${i}`).value?.trim() ?? '';

      if (question.length > 0 || answer.length > 0) {
        anyValueSet = true;
      }

      questionSet.push({
        id: i,
        answerChanged: true,
        question,
        answer
      });
    }

    this.profileDataService.securityQuestions = questionSet;
  }
}
