import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../evacuation-file/evacuation-file-data.service';
import { NeedsAssessmentMappingService } from '../needs-assessment/needs-assessment-mapping.service';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { RestrictionService } from '../restriction/restriction.service';

@Injectable({ providedIn: 'root' })
export class EditService {

    constructor(
        private profileDataService: ProfileDataService, private needsAssessmentDataService: NeedsAssessmentService,
        private restrictionService: RestrictionService, private formCreationService: FormCreationService,
        private needsAssessmentMapping: NeedsAssessmentMappingService, private evacuationFileDataService: EvacuationFileDataService) { }

    /**
     * Updates the form with latest values
     * @param component current component name
     */
    saveFormData(component: string, form: FormGroup): void {
        switch (component) {
            case 'restriction':
                this.restrictionService.restrictedAccess = form.get('restrictedAccess').value;
                console.log(this.restrictionService.restrictedAccess);
                break;
            case 'personal-details':
                this.profileDataService.personalDetails = form.value;
                break;
            case 'address':
                this.profileDataService.primaryAddressDetails = form.get('address').value;
                this.profileDataService.mailingAddressDetails = form.get('mailingAddress').value;
                let evacFromPrimary: string;
                this.formCreationService.getEvacuatedForm().pipe(first()).subscribe(
                    evacuatedForm => {
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
            case 'secret':
                this.profileDataService.secretWordPhrase = form.value;
                break;
            case 'evac-address':
                this.evacuationFileDataService.evacuatedFromAddress = form.get('evacuatedFromAddress').value;
                this.needsAssessmentDataService.insurance = form.get('insurance').value;
                break;
            case 'family-information':
                this.needsAssessmentDataService.haveSpecialDiet = form.get('haveSpecialDiet').value;
                this.needsAssessmentDataService.haveMedication = form.get('haveMedication').value;
                this.needsAssessmentDataService.specialDietDetails = form.get('specialDietDetails').value;
                this.needsAssessmentDataService.familyMembers = form.get('familyMember').value;
                break;
            case 'pets':
                this.needsAssessmentDataService.pets = form.get('pets').value;
                this.needsAssessmentDataService.hasPetsFood = form.get('hasPetsFood').value;
                break;
            case 'identify-needs':
                this.needsAssessmentDataService.setNeedsDetails(form);
                break;
            default:
        }
    }

    /**
     * Cancels the updates and sets the form with existing values
     * @param component current component name
     * @param form  form to update
     */
    cancelFormData(component: string, form: FormGroup): void {
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
                if (this.profileDataService.primaryAddressDetails !== undefined &&
                    this.profileDataService.mailingAddressDetails !== undefined) {
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
            case 'secret':
                if (this.profileDataService.secretWordPhrase !== undefined) {
                    form.get('secretPhrase').patchValue(this.profileDataService.secretWordPhrase);
                } else {
                    form.reset();
                }
                break;
            case 'evac-address':
                if (this.evacuationFileDataService.evacuatedFromAddress !== undefined &&
                    this.needsAssessmentDataService.insurance !== undefined) {
                    form.get('evacuatedFromAddress').patchValue(this.evacuationFileDataService.evacuatedFromAddress);
                    form.get('insurance').patchValue(this.needsAssessmentDataService.insurance);
                } else {
                    form.reset();
                }
                break;
            case 'family-information':
                if (this.needsAssessmentDataService.familyMembers.length !== 0 ||
                    this.needsAssessmentDataService.haveMedication !== undefined &&
                    this.needsAssessmentDataService.haveSpecialDiet !== undefined &&
                    this.needsAssessmentDataService.specialDietDetails !== undefined) {
                    form.get('familyMember').patchValue(this.needsAssessmentDataService.familyMembers);
                    form.get('haveMedication').patchValue(this.needsAssessmentDataService.haveMedication);
                    form.get('haveSpecialDiet').patchValue(this.needsAssessmentDataService.haveSpecialDiet);
                    form.get('specialDietDetails').patchValue(this.needsAssessmentDataService.specialDietDetails);
                } else {
                    form.get('familyMember').patchValue([]);
                    form.get('haveMedication').reset();
                    form.get('haveSpecialDiet').reset();
                    form.get('specialDietDetails').reset();
                }
                break;
            case 'pets':
                if (this.needsAssessmentDataService.pets.length !== 0 &&
                    this.needsAssessmentDataService.hasPetsFood !== undefined) {
                    form.get('pets').patchValue(this.needsAssessmentDataService.pets);
                    form.get('hasPetsFood').patchValue(this.needsAssessmentDataService.hasPetsFood);
                } else {
                    form.get('pets').patchValue([]);
                    form.get('hasPetsFood').reset();
                }
                break;
            case 'identify-needs':
                if (this.needsAssessmentDataService.canEvacueeProvideClothing !== undefined &&
                    this.needsAssessmentDataService.canEvacueeProvideFood !== undefined
                    && this.needsAssessmentDataService.canEvacueeProvideIncidentals !== undefined &&
                    this.needsAssessmentDataService.canEvacueeProvideLodging !== undefined
                    && this.needsAssessmentDataService.canEvacueeProvideTransportation !== undefined) {
                    form.get('canEvacueeProvideClothing').patchValue(this.needsAssessmentDataService.canEvacueeProvideClothing);
                    form.get('canEvacueeProvideFood').patchValue(this.needsAssessmentDataService.canEvacueeProvideFood);
                    form.get('canEvacueeProvideIncidentals').patchValue(this.needsAssessmentDataService.canEvacueeProvideIncidentals);
                    form.get('canEvacueeProvideLodging').patchValue(this.needsAssessmentDataService.canEvacueeProvideLodging);
                    form.get('canEvacueeProvideTransportation').patchValue(this.needsAssessmentDataService.canEvacueeProvideTransportation);
                } else {
                    form.reset();
                }
                break;
            default:
        }
    }



}
