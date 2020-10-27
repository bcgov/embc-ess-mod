import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from './data.service';
import { FormCreationService } from './formCreation.service';

@Injectable({ providedIn: 'root' })
export class DataUpdationService {

    constructor(public dataService: DataService, public formCreationService: FormCreationService) { }

    updatePersonalDetails(formGroup: FormGroup) {
        this.formCreationService.setPersonDetailsForm(formGroup);
        this.dataService.updateRegistartion({ personalDetails: formGroup.value });
    }

    updateAddressDetails(formGroup: FormGroup) {
        this.formCreationService.setAddressForm(formGroup);
        this.dataService.updateRegistartion({ mailingAddress: formGroup.get('mailingAddress').value });
        this.dataService.updateRegistartion({ primaryAddress: formGroup.get('address').value });
    }

    updateContactDetails(formGroup: FormGroup) {
        this.formCreationService.setContactDetailsForm(formGroup);
        this.dataService.updateRegistartion({ contactDetails: formGroup.value });
    }

    updateSecretDetails(formGroup: FormGroup) {
        this.formCreationService.setSecretForm(formGroup);
        this.dataService.updateRegistartion(formGroup.value);
    }

    updateEvacuationDetails(formGroup: FormGroup) {
        this.formCreationService.setEvacuatedForm(formGroup);
        this.dataService.updateNeedsAssessment({ evacuatedFromAddress: formGroup.get('evacuatedFromAddress').value });
        this.dataService.updateNeedsAssessment({ insurance: formGroup.get('insurance').value });
    }

    updateFamilyMemberDetails(formGroup: FormGroup) {
        this.formCreationService.setFamilyMembersForm(formGroup);
        this.dataService.updateNeedsAssessment({ haveMedication: formGroup.get('haveMedication').value });
        this.dataService.updateNeedsAssessment({ haveSpecialDiet: formGroup.get('haveSpecialDiet').value });
        this.dataService.updateNeedsAssessment({ familyMembers: formGroup.get('familyMember').value });
    }

    updatePetsDetails(formGroup: FormGroup){
        this.formCreationService.setPetsForm(formGroup);
        this.dataService.updateNeedsAssessment({ pets: formGroup.get('pets').value });
    }

    updateNeedsDetails(formGroup: FormGroup) {
        this.formCreationService.setIdentifyNeedsForm(formGroup);
        this.dataService.updateNeedsAssessment({ requiresClothing: formGroup.get('requiresClothing').value });
        this.dataService.updateNeedsAssessment({ requiresFood: formGroup.get('requiresFood').value });
        this.dataService.updateNeedsAssessment({ requiresIncidentals: formGroup.get('requiresIncidentals').value });
        this.dataService.updateNeedsAssessment({ requiresLodging: formGroup.get('requiresLodging').value });
        this.dataService.updateNeedsAssessment({ requiresTransportation: formGroup.get('requiresTransportation').value });
    }
}
