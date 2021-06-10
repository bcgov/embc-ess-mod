import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  PersonDetailsForm,
  PersonDetails,
  ContactDetailsForm,
  ContactDetails,
  Secret,
  SecretForm,
  AddressForm,
  Address,
  RestrictionForm,
  Restriction
} from '../model/profile.model';
import { CustomValidationService } from './customValidation.service';
import {
  Evacuated,
  EvacuatedForm,
  HouseholdMembers,
  HouseholdMembersForm,
  IdentifyNeeds,
  IdentifyNeedsForm,
  Pet,
  PetForm
} from '../model/needs.model';

@Injectable({ providedIn: 'root' })
export class FormCreationService {
  restrictionForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
    this.formBuilder.group(new RestrictionForm(new Restriction()))
  );

  restrictionForm$: Observable<FormGroup> = this.restrictionForm.asObservable();

  personalDetailsForm: BehaviorSubject<FormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new PersonDetailsForm(new PersonDetails(), this.customValidator)
      )
    );

  personalDetailsForm$: Observable<FormGroup> =
    this.personalDetailsForm.asObservable();

  contactDetailsForm: BehaviorSubject<FormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new ContactDetailsForm(new ContactDetails(), this.customValidator)
      )
    );

  contactDetailsForm$: Observable<FormGroup> =
    this.contactDetailsForm.asObservable();

  secretForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
    this.formBuilder.group(new SecretForm(new Secret()))
  );

  secretForm$: Observable<FormGroup> = this.secretForm.asObservable();

  addressForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
    this.formBuilder.group(
      new AddressForm(new Address(), this.formBuilder, this.customValidator)
    )
  );

  addressForm$: Observable<FormGroup> = this.addressForm.asObservable();

  evacuatedForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
    this.formBuilder.group(
      new EvacuatedForm(new Evacuated(), this.formBuilder, this.customValidator)
    )
  );

  evacuatedForm$: Observable<FormGroup> = this.evacuatedForm.asObservable();

  householdMembersForm: BehaviorSubject<FormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new HouseholdMembersForm(
          new HouseholdMembers(),
          this.customValidator,
          this.formBuilder
        )
      )
    );

  householdMembersForm$: Observable<FormGroup> =
    this.householdMembersForm.asObservable();

  petsForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
    this.formBuilder.group(
      new PetForm(new Pet(), this.customValidator, this.formBuilder)
    )
  );

  petsForm$: Observable<FormGroup> = this.petsForm.asObservable();

  identifyNeedsForm: BehaviorSubject<FormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(new IdentifyNeedsForm(new IdentifyNeeds()))
    );

  identifyNeedsForm$: Observable<FormGroup> =
    this.identifyNeedsForm.asObservable();

  constructor(
    private formBuilder: FormBuilder,
    private customValidator: CustomValidationService
  ) {}

  getRestrictionForm(): Observable<FormGroup> {
    return this.restrictionForm$;
  }

  setRestrictionForm(restrictionForm: FormGroup): void {
    this.restrictionForm.next(restrictionForm);
  }

  getPersonalDetailsForm(): Observable<FormGroup> {
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

  getHouseholdMembersForm(): Observable<FormGroup> {
    return this.householdMembersForm$;
  }

  setHouseholdMembersForm(householdMembersForm: FormGroup): void {
    this.householdMembersForm.next(householdMembersForm);
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

  clearProfileData(): void {
    this.restrictionForm.next(
      this.formBuilder.group(new RestrictionForm(new Restriction()))
    );
    this.addressForm.next(
      this.formBuilder.group(
        new AddressForm(new Address(), this.formBuilder, this.customValidator)
      )
    );
    this.personalDetailsForm.next(
      this.formBuilder.group(
        new PersonDetailsForm(new PersonDetails(), this.customValidator)
      )
    );
    this.contactDetailsForm.next(
      this.formBuilder.group(
        new ContactDetailsForm(new ContactDetails(), this.customValidator)
      )
    );
    this.secretForm.next(this.formBuilder.group(new SecretForm(new Secret())));
  }

  clearNeedsAssessmentData(): void {
    this.evacuatedForm.next(
      this.formBuilder.group(
        new EvacuatedForm(
          new Evacuated(),
          this.formBuilder,
          this.customValidator
        )
      )
    );
    this.householdMembersForm.next(
      this.formBuilder.group(
        new HouseholdMembersForm(
          new HouseholdMembers(),
          this.customValidator,
          this.formBuilder
        )
      )
    );
    this.petsForm.next(
      this.formBuilder.group(
        new PetForm(new Pet(), this.customValidator, this.formBuilder)
      )
    );
    this.identifyNeedsForm.next(
      this.formBuilder.group(new IdentifyNeedsForm(new IdentifyNeeds()))
    );
  }
}
