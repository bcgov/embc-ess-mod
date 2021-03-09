import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Address, NeedsAssessment } from 'src/app/core/api/models';
import { PersonDetails } from 'src/app/core/model/profile.model';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { NeedsAssessmentService } from './needs-assessment.service';

@Injectable({ providedIn: 'root' })

export class NeedsAssessmentMappingService {

    constructor(
        private formCreationService: FormCreationService, private profileDataService: ProfileDataService,
        private needsAssessmentService: NeedsAssessmentService) { }

    setNeedsAssessment(needsAssessment: NeedsAssessment) {

        this.needsAssessmentService.evacuatedFromAddress = needsAssessment.evacuatedFromAddress;
        this.needsAssessmentService.insurance = needsAssessment.insurance;

        this.formCreationService.getEvacuatedForm().pipe(
            first()).subscribe(details => {
                console.log(details);
                details.setValue({
                    evacuatedFromPrimary: this.isSameAddress(needsAssessment.evacuatedFromAddress),
                    evacuatedFromAddress: needsAssessment.evacuatedFromAddress,
                    insurance: needsAssessment.insurance
                });
            })

        this.needsAssessmentService.haveMedication = needsAssessment.haveMedication;
        this.needsAssessmentService.haveSpecialDiet = needsAssessment.haveSpecialDiet;
        this.needsAssessmentService.specialDietDetails = needsAssessment.specialDietDetails;
        this.needsAssessmentService.familyMembers = needsAssessment.familyMembers;

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

        this.needsAssessmentService.hasPetsFood = needsAssessment.hasPetsFood;
        this.needsAssessmentService.pets = needsAssessment.pets;

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

        this.needsAssessmentService.canEvacueeProvideClothing = needsAssessment.canEvacueeProvideClothing;
        this.needsAssessmentService.canEvacueeProvideFood = needsAssessment.canEvacueeProvideFood;
        this.needsAssessmentService.canEvacueeProvideIncidentals = needsAssessment.canEvacueeProvideIncidentals;
        this.needsAssessmentService.canEvacueeProvideLodging = needsAssessment.canEvacueeProvideLodging;
        this.needsAssessmentService.canEvacueeProvideTransportation = needsAssessment.canEvacueeProvideTransportation;

        this.formCreationService.getIndentifyNeedsForm().pipe(
            first()).subscribe(details => {
                needsAssessment.canEvacueeProvideIncidentals
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
                initials: member.initials,
                gender: member.gender,
                dateOfBirth: member.dateOfBirth,
                sameLastNameCheck: this.isSameLastName(member.lastName)
            }

            familyMembersFormArray.push(memberDetails);
        }
        return familyMembersFormArray;
    }

    private isSameLastName(lastname: string): boolean {
        let userPersonalDetails = this.profileDataService.personalDetails;
        let userLastname = userPersonalDetails.lastName;

        return (userLastname === lastname);
    }

    private isSameAddress(evacAddress: Address): boolean {
        let userPersonalAddress = this.profileDataService.primaryAddressDetails;
        return (evacAddress === userPersonalAddress);
    }

}