import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Address, InsuranceOption, NeedsAssessment, PersonDetails, Pet, RegistrationResult, NeedsAssessmentType } from 'src/app/core/api/models';
import { EvacuationService } from 'src/app/core/api/services';
//import { PersonDetails } from 'src/app/core/model/profile.model';


@Injectable({ providedIn: 'root' })
export class NeedsAssessmentService {

    private _insurance: InsuranceOption;
    private _haveMedication: boolean;
    private _haveSpecialDiet: boolean;
    private _familyMembers: Array<PersonDetails>;
    private _specialDietDetails: string;
    private _pets: Array<Pet> = [];
    private _hasPetsFood: boolean;
    private _canEvacueeProvideClothing: boolean;
    private _canEvacueeProvideFood: boolean;
    private _canEvacueeProvideIncidentals: boolean;
    private _canEvacueeProvideLodging: boolean;
    private _canEvacueeProvideTransportation: boolean;
    private registrationResult: RegistrationResult;
    private verifiedRegistrationResult: string;

    constructor(private evacuationService: EvacuationService) { }


    public get insurance(): InsuranceOption {
        return this._insurance;
    }
    public set insurance(value: InsuranceOption) {
        this._insurance = value;
    }

    public get canEvacueeProvideClothing(): boolean {
        return this._canEvacueeProvideClothing;
    }

    public set canEvacueeProvideClothing(value: boolean) {
        this._canEvacueeProvideClothing = value;
    }

    public get canEvacueeProvideFood(): boolean {
        return this._canEvacueeProvideFood;
    }

    public set canEvacueeProvideFood(value: boolean) {
        this._canEvacueeProvideFood = value;
    }

    public get canEvacueeProvideIncidentals(): boolean {
        return this._canEvacueeProvideIncidentals;
    }

    public set canEvacueeProvideIncidentals(value: boolean) {
        this._canEvacueeProvideIncidentals = value;
    }

    public get canEvacueeProvideLodging(): boolean {
        return this._canEvacueeProvideLodging;
    }

    public set canEvacueeProvideLodging(value: boolean) {
        this._canEvacueeProvideLodging = value;
    }

    public get canEvacueeProvideTransportation(): boolean {
        return this._canEvacueeProvideTransportation;
    }

    public set canEvacueeProvideTransportation(value: boolean) {
        this._canEvacueeProvideTransportation = value;
    }

    public get hasPetsFood(): boolean {
        return this._hasPetsFood;
    }

    public set hasPetsFood(value: boolean) {
        this._hasPetsFood = value;
    }

    public get pets(): Array<Pet> {
        return this._pets;
    }

    public set pets(value: Array<Pet>) {
        this._pets = value;
    }

    public get haveMedication(): boolean {
        return this._haveMedication;
    }

    public set haveMedication(value: boolean) {
        this._haveMedication = value;
    }

    public get haveSpecialDiet(): boolean {
        return this._haveSpecialDiet;
    }

    public set haveSpecialDiet(value: boolean) {
        this._haveSpecialDiet = value;
    }

    public get familyMembers(): Array<PersonDetails> {
        return this._familyMembers;
    }

    public set familyMembers(value: Array<PersonDetails>) {
        this._familyMembers = value;
    }

    public get specialDietDetails(): string {
        return this._specialDietDetails;
    }
    public set specialDietDetails(value: string) {
        this._specialDietDetails = value;
    }

    public setNeedsDetails(formGroup: FormGroup): void {
        this.canEvacueeProvideClothing = formGroup.get('canEvacueeProvideClothing').value === 'null' ? null : formGroup.get('canEvacueeProvideClothing').value;
        this.canEvacueeProvideFood =
            formGroup.get('canEvacueeProvideFood').value === 'null' ? null : formGroup.get('canEvacueeProvideFood').value;
        this.canEvacueeProvideIncidentals = formGroup.get('canEvacueeProvideIncidentals').value === 'null' ? null : formGroup.get('canEvacueeProvideIncidentals').value;
        this.canEvacueeProvideLodging = formGroup.get('canEvacueeProvideLodging').value === 'null' ? null : formGroup.get('canEvacueeProvideLodging').value;
        this.canEvacueeProvideTransportation = formGroup.get('canEvacueeProvideTransportation').value === 'null' ?
            null : formGroup.get('canEvacueeProvideTransportation').value;
    }

    public createNeedsAssessmentDTO(): NeedsAssessment {
        return {
            canEvacueeProvideClothing: this.canEvacueeProvideClothing,
            canEvacueeProvideFood: this.canEvacueeProvideFood,
            canEvacueeProvideIncidentals: this.canEvacueeProvideIncidentals,
            canEvacueeProvideLodging: this.canEvacueeProvideLodging,
            canEvacueeProvideTransportation: this.canEvacueeProvideTransportation,
            familyMembers: this.familyMembers,
            hasPetsFood: this.hasPetsFood,
            haveMedication: this.haveMedication,
            haveSpecialDiet: this.haveSpecialDiet,
            insurance: this.insurance,
            pets: this.pets,
            type: NeedsAssessmentType.Preliminary
        };
    }


    public setNonVerifiedEvacuationFileNo(registrationResult: RegistrationResult): void {
        this.registrationResult = registrationResult;
    }

    public getNonVerifiedEvacuationFileNo(): RegistrationResult {
        return this.registrationResult;
    }

    public setVerifiedEvacuationFileNo(registrationResult: string): void {
        this.verifiedRegistrationResult = registrationResult;
    }

    public getVerifiedEvacuationFileNo(): string {
        return this.verifiedRegistrationResult;
    }

    public clearEvacuationFileNo(): void {
        this.registrationResult = { referenceNumber: null };
        this.verifiedRegistrationResult = null;
    }

}
