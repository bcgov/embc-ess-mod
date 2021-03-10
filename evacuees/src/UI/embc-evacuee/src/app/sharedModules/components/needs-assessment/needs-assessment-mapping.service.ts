import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Address, InsuranceOption, NeedsAssessment, Pet } from 'src/app/core/api/models';
import { PersonDetails } from 'src/app/core/model/profile.model';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { NeedsAssessmentService } from './needs-assessment.service';

@Injectable({ providedIn: 'root' })

export class NeedsAssessmentMappingService {

    constructor(
        private formCreationService: FormCreationService, private profileDataService: ProfileDataService,
        private needsAssessmentService: NeedsAssessmentService) { }

    setNeedsAssessment(needsAssessment: NeedsAssessment): void {

        this.setEvacuationAddress(needsAssessment.evacuatedFromAddress, needsAssessment.insurance);
        this.setFamilyMedicationDiet(
            needsAssessment.haveMedication, needsAssessment.haveSpecialDiet,
            needsAssessment.familyMembers, needsAssessment.specialDietDetails);
        this.setPets(needsAssessment.pets, needsAssessment.hasPetsFood);
        this.setIdentifiedNeeds(
            needsAssessment.canEvacueeProvideClothing, needsAssessment.canEvacueeProvideFood,
            needsAssessment.canEvacueeProvideIncidentals, needsAssessment.canEvacueeProvideLodging,
            needsAssessment.canEvacueeProvideTransportation);
    }

    private familyMembersForm(familyMembers: Array<PersonDetails>): Array<PersonDetails> {
        const familyMembersFormArray: Array<PersonDetails> = [];

        for (const member of familyMembers) {
            const memberDetails: PersonDetails = {
                firstName: member.firstName,
                lastName: member.lastName,
                initials: member.initials,
                gender: member.gender,
                dateOfBirth: member.dateOfBirth,
                sameLastNameCheck: this.isSameLastName(member.lastName)
            };

            familyMembersFormArray.push(memberDetails);
        }
        return familyMembersFormArray;
    }

    setEvacuationAddress(evacuatedFromAddress: Address, insurance: InsuranceOption): void {
        this.needsAssessmentService.evacuatedFromAddress = evacuatedFromAddress;
        this.needsAssessmentService.insurance = insurance;

        this.formCreationService.getEvacuatedForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    evacuatedFromPrimary: this.isSameAddress(evacuatedFromAddress),
                    evacuatedFromAddress,
                    insurance
                });
            });
    }

    setFamilyMedicationDiet(
        haveMedication: boolean, haveSpecialDiet: boolean,
        familyMembers: Array<PersonDetails>, specialDietDetails: string): void {

        this.needsAssessmentService.haveMedication = haveMedication;
        this.needsAssessmentService.haveSpecialDiet = haveSpecialDiet;
        this.needsAssessmentService.specialDietDetails = specialDietDetails;
        this.needsAssessmentService.familyMembers = familyMembers;

        this.formCreationService.getFamilyMembersForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    haveMedication,
                    haveSpecialDiet,
                    specialDietDetails,
                    familyMember: this.familyMembersForm(familyMembers),
                    member:
                    {
                        dateOfBirth: '',
                        firstName: '',
                        gender: '',
                        initials: '',
                        lastName: '',
                        sameLastNameCheck: ''
                    },
                    addFamilyMemberIndicator: null
                });

            });

    }

    setPets(pets: Array<Pet>, hasPetsFood: boolean): void {

        this.needsAssessmentService.hasPetsFood = hasPetsFood;
        this.needsAssessmentService.pets = pets;

        this.formCreationService.getPetsForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    pets,
                    pet:
                    {
                        quantity: '',
                        type: ''
                    },
                    addPetIndicator: null,
                    hasPetsFood,
                    addPetFoodIndicator: null,
                });
            });
    }

    setIdentifiedNeeds(
        canEvacueeProvideClothing: boolean, canEvacueeProvideFood: boolean,
        canEvacueeProvideIncidentals: boolean, canEvacueeProvideLodging: boolean,
        canEvacueeProvideTransportation: boolean): void {

        this.needsAssessmentService.canEvacueeProvideClothing = canEvacueeProvideClothing;
        this.needsAssessmentService.canEvacueeProvideFood = canEvacueeProvideFood;
        this.needsAssessmentService.canEvacueeProvideIncidentals = canEvacueeProvideIncidentals;
        this.needsAssessmentService.canEvacueeProvideLodging = canEvacueeProvideLodging;
        this.needsAssessmentService.canEvacueeProvideTransportation = canEvacueeProvideTransportation;

        this.formCreationService.getIndentifyNeedsForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    canEvacueeProvideClothing,
                    canEvacueeProvideFood,
                    canEvacueeProvideIncidentals,
                    canEvacueeProvideLodging,
                    canEvacueeProvideTransportation
                });
            });
    }

    private isSameLastName(lastname: string): boolean {
        const userPersonalDetails = this.profileDataService.personalDetails;
        const userLastname = userPersonalDetails.lastName;

        return (userLastname === lastname);
    }

    private isSameAddress(evacAddress: Address): boolean {
        const userPersonalAddress = this.profileDataService.primaryAddressDetails;
        return (evacAddress === userPersonalAddress);
    }

}
