import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
    PersonDetailsForm, PersonDetails, ContactDetailsForm, ContactDetails, Secret, SecretForm,
    AddressForm, Address, RestrictionForm, Restriction
} from '../model/profile.model';
import { CustomValidationService } from './customValidation.service';
import { Evacuated, EvacuatedForm, FamilyMembers, FamilyMembersForm, IdentifyNeeds, IdentifyNeedsForm, Pet, PetForm } from '../model/needs.model';

@Injectable({ providedIn: 'root' })
export class FormCreationService {

    private restrictionForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new RestrictionForm(new Restriction())));

    restrictionForm$: Observable<FormGroup> = this.restrictionForm.asObservable();

    private personalDetailsForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new PersonDetailsForm(new PersonDetails(), this.customValidator)));

    personalDetailsForm$: Observable<FormGroup> = this.personalDetailsForm.asObservable();

    private contactDetailsForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new ContactDetailsForm(new ContactDetails(), this.customValidator)));

    contactDetailsForm$: Observable<FormGroup> = this.contactDetailsForm.asObservable();

    private secretForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new SecretForm(new Secret())));

    secretForm$: Observable<FormGroup> = this.secretForm.asObservable();

    private addressForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new AddressForm(new Address(), this.formBuilder, this.customValidator)));

    addressForm$: Observable<FormGroup> = this.addressForm.asObservable();

    private evacuatedForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new EvacuatedForm(new Evacuated(), this.formBuilder, this.customValidator)));

    evacuatedForm$: Observable<FormGroup> = this.evacuatedForm.asObservable();

    private familyMembersForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new FamilyMembersForm(new FamilyMembers(), this.customValidator, this.formBuilder)));

    familyMembersForm$: Observable<FormGroup> = this.familyMembersForm.asObservable();

    private petsForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new PetForm(new Pet(), this.customValidator, this.formBuilder)));

    petsForm$: Observable<FormGroup> = this.petsForm.asObservable();

    private identifyNeedsForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new IdentifyNeedsForm(new IdentifyNeeds())));

    identifyNeedsForm$: Observable<FormGroup> = this.identifyNeedsForm.asObservable();

    constructor(private formBuilder: FormBuilder, private customValidator: CustomValidationService) { }

    getRestrictionForm(): Observable<FormGroup> {
        return this.restrictionForm$;
    }

    setRestrictionForm(restrictionForm: FormGroup): void {
        this.restrictionForm.next(restrictionForm);
    }

    getPeronalDetailsForm(): Observable<FormGroup> {
        return this.personalDetailsForm$;
    }

    setPersonDetailsForm(personForm: FormGroup): void {
        this.personalDetailsForm.next(personForm);
    }

    getContactDetailsForm(): Observable<FormGroup> {
        return this.contactDetailsForm$;
    }

    setContactDetailsForm(contactForm: FormGroup): void {
        this.contactDetailsForm.next(contactForm);
    }

    getSecretForm(): Observable<FormGroup> {
        return this.secretForm$;
    }

    setSecretForm(secretForm: FormGroup): void {
        this.secretForm.next(secretForm);
    }

    getAddressForm(): Observable<FormGroup> {
        return this.addressForm$;
    }

    setAddressForm(addressForm: FormGroup): void {
        this.addressForm.next(addressForm);
    }

    getEvacuatedForm(): Observable<FormGroup> {
        return this.evacuatedForm$;
    }

    setEvacuatedForm(evacuatedForm: FormGroup): void {
        this.evacuatedForm.next(evacuatedForm);
    }

    getFamilyMembersForm(): Observable<FormGroup> {
        return this.familyMembersForm$;
    }

    setFamilyMembersForm(familyMembersForm: FormGroup): void {
        this.familyMembersForm.next(familyMembersForm);
    }

    getPetsForm(): Observable<FormGroup> {
        return this.petsForm$;
    }

    setPetsForm(petsForm: FormGroup): void {
        this.petsForm.next(petsForm);
    }

    getIndentifyNeedsForm(): Observable<FormGroup> {
        return this.identifyNeedsForm$;
    }

    setIdentifyNeedsForm(identifyNeedsForm: FormGroup): void {
        this.identifyNeedsForm.next(identifyNeedsForm);
    }

    clearData(): void {
        this.restrictionForm.next(this.formBuilder.group(new RestrictionForm(new Restriction())));
        this.personalDetailsForm.next(this.formBuilder.group(new PersonDetailsForm(new PersonDetails(), this.customValidator)));
        this.contactDetailsForm.next(this.formBuilder.group(new ContactDetailsForm(new ContactDetails(), this.customValidator)));
        this.secretForm.next(this.formBuilder.group(new SecretForm(new Secret())));
        this.addressForm.next(this.formBuilder.group(new AddressForm(new Address(), this.formBuilder, this.customValidator)));
        this.evacuatedForm.next(this.formBuilder.group(new EvacuatedForm(new Evacuated(), this.formBuilder, this.customValidator)));
        this.familyMembersForm.next(this.formBuilder.group(new FamilyMembersForm(new FamilyMembers(),
            this.customValidator, this.formBuilder)));
        this.petsForm.next(this.formBuilder.group(new PetForm(new Pet(), this.customValidator, this.formBuilder)));
        this.identifyNeedsForm.next(this.formBuilder.group(new IdentifyNeedsForm(new IdentifyNeeds())));
    }

}
