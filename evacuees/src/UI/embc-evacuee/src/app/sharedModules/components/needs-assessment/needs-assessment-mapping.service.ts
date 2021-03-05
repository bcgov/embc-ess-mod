import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { NeedsAssessment } from 'src/app/core/api/models';
import { PersonDetails } from 'src/app/core/model/profile.model';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { ProfileDataService } from '../profile/profile-data.service';

@Injectable({ providedIn: 'root' })

export class NeedsAssessmentMappingService {

    constructor(private formCreationService: FormCreationService, private profileDataService: ProfileDataService) { }

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
                    familyMember: this.familyMembersForm(needsAssessment.familyMembers),
                    member:
                    {
                        dateOfBirth: "",
                        firstName: "",
                        gender: "",
                        initials: "",
                        lastName: "",
                        sameLastNameCheck: ""
                    },
                    addFamilyMemberIndicator: null
                });
            });

        this.formCreationService.getPetsForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    pets: needsAssessment.pets,
                    pet:
                    {
                        quantity: "",
                        type: ""
                    },
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

    private familyMembersForm(familyMembers: Array<PersonDetails>): Array<PersonDetails> {
        let familyMembersFormArray: Array<PersonDetails> = [];

        for (let member of familyMembers) {
            let memberDetails: PersonDetails = {
                firstName: member.firstName,
                lastName: member.lastName,
                preferredName: member.preferredName,
                initials: member.initials,
                gender: member.gender,
                dateOfBirth: member.dateOfBirth,
                sameLastNameCheck: this.isSameLastName(member.lastName)
            }

            familyMembersFormArray.push(memberDetails);
        }

        console.log(familyMembersFormArray)
        return familyMembersFormArray;
    }

    private isSameLastName(lastname: string): boolean {
        let userProfile = this.profileDataService.getProfile();
        let userLastname = userProfile.personalDetails.lastName;

        return (userLastname === lastname);
    }

}