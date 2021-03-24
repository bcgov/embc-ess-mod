import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Address, HouseholdMember, InsuranceOption, NeedsAssessment, Pet } from 'src/app/core/api/models';
import { PersonDetails } from 'src/app/core/model/profile.model';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../evacuation-file/evacuation-file-data.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { NeedsAssessmentService } from './needs-assessment.service';

@Injectable({ providedIn: 'root' })

export class NeedsAssessmentMappingService {

    constructor(
        private formCreationService: FormCreationService, private profileDataService: ProfileDataService,
        private needsAssessmentService: NeedsAssessmentService, private evacuationFileDataService: EvacuationFileDataService) { }

    setNeedsAssessment(evacuatedFromAddress: Address, needsAssessment: NeedsAssessment): void {

        console.log(needsAssessment);
        this.setNeedsAssessmentId(needsAssessment.id);
        this.setInsurance(evacuatedFromAddress, needsAssessment.insurance);
        this.setFamilyMedicationDiet(
            needsAssessment.haveMedication, needsAssessment.haveSpecialDiet,
            needsAssessment.householdMembers, needsAssessment.specialDietDetails);
        this.setPets(needsAssessment.pets, needsAssessment.hasPetsFood);
        this.setIdentifiedNeeds(
            needsAssessment.canEvacueeProvideClothing, needsAssessment.canEvacueeProvideFood,
            needsAssessment.canEvacueeProvideIncidentals, needsAssessment.canEvacueeProvideLodging,
            needsAssessment.canEvacueeProvideTransportation);
    }

    setNeedsAssessmentId(needsAssessmentID: string): void {
        this.needsAssessmentService.id = needsAssessmentID;
    }

    setInsurance(evacuatedFromAddress: Address, insurance: InsuranceOption): void {
        this.evacuationFileDataService.evacuatedFromAddress = evacuatedFromAddress;
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
        householdMembers: Array<HouseholdMember>, specialDietDetails: string): void {

        this.needsAssessmentService.haveMedication = haveMedication;
        this.needsAssessmentService.haveSpecialDiet = haveSpecialDiet;
        this.needsAssessmentService.specialDietDetails = specialDietDetails;
        this.needsAssessmentService.householdMembers = householdMembers;

        this.formCreationService.getHouseholdMembersForm().pipe(
            first()).subscribe(details => {
                details.setValue({
                    haveMedication,
                    haveSpecialDiet,
                    specialDietDetails,
                    householdMembers: this.householdMembersForm(householdMembers),
                    householdMember:
                    {
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

    private isSameAddress(evacAddress: Address): string {
        const userPersonalAddress = this.profileDataService.primaryAddressDetails;
        console.log(evacAddress === userPersonalAddress);

        if (evacAddress === userPersonalAddress) {
            return 'Yes';
        } else {
            return 'No';
        }
    }

    private householdMembersForm(householdMembers: Array<HouseholdMember>): Array<PersonDetails> {
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

}
