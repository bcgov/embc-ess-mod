import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { NeedsAssessment } from 'src/app/core/api/models';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@Injectable({ providedIn: 'root' })

export class NeedsAssessmentMappingService {

    constructor(private formCreationService: FormCreationService) { }

    setNeedsAssessment(needsAssessment: NeedsAssessment) {

        this.formCreationService.getEvacuatedForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    evacuatedFromPrimary: null,
                    evacuatedFromAddress: needsAssessment.evacuatedFromAddress,
                    insurance: needsAssessment.insurance
                });
            })

        this.formCreationService.getFamilyMembersForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    haveMedication: needsAssessment.haveMedication,
                    haveSpecialDiet: needsAssessment.haveSpecialDiet,
                    specialDietDetails: needsAssessment.specialDietDetails,
                    familyMember: needsAssessment.familyMembers,
                    addFamilyMemberIndicator: null
                });
            });

        this.formCreationService.getPetsForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    pets: needsAssessment.pets,
                    addPetIndicator: null,
                    hasPetsFood: needsAssessment.hasPetsFood,
                    addPetFoodIndicator: null,
                });
            })

        this.formCreationService.getIndentifyNeedsForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    canEvacueeProvideClothing: needsAssessment.canEvacueeProvideClothing,
                    canEvacueeProvideFood: needsAssessment.canEvacueeProvideFood,
                    canEvacueeProvideIncidentals: needsAssessment.canEvacueeProvideIncidentals,
                    canEvacueeProvideLodging: needsAssessment.canEvacueeProvideLodging,
                    canEvacueeProvideTransportation: needsAssessment.canEvacueeProvideTransportation
                });
            });
    }

}