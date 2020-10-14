import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PersonDetailsForm, PersonDetails, ContactDetailsForm, ContactDetails, Secret, SecretForm, AddressForm, Address } from '../model/profile.model';
import { CustomValidationService } from './customValidation.service';
import { Evacuated, EvacuatedForm, FamilyMembers, FamilyMembersForm } from '../model/needs.model';

@Injectable({ providedIn: 'root' })
export class FormCreationService {

    private personalDetailsForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new PersonDetailsForm(new PersonDetails(), this.customValidator)));

    private personalDetailsForm$: Observable<FormGroup> = this.personalDetailsForm.asObservable();

    private contactDetailsForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new ContactDetailsForm(new ContactDetails(), this.customValidator)));

    private contactDetailsForm$: Observable<FormGroup> = this.contactDetailsForm.asObservable();

    private secretForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new SecretForm(new Secret())));

    private secretForm$: Observable<FormGroup> = this.secretForm.asObservable();

    private addressForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new AddressForm(new Address(), this.formBuilder, this.customValidator)));

    private addressForm$: Observable<FormGroup> = this.addressForm.asObservable();

    private evacuatedForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new EvacuatedForm(new Evacuated(), this.formBuilder, this.customValidator)));

    private evacuatedForm$: Observable<FormGroup> = this.evacuatedForm.asObservable();

    private familyMembersForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new FamilyMembersForm(new FamilyMembers(), this.customValidator, this.formBuilder)));

    private familyMembersForm$: Observable<FormGroup> = this.familyMembersForm.asObservable();

    constructor(private formBuilder: FormBuilder, private customValidator: CustomValidationService) { }

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

}
