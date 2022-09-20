import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import {
  PersonDetailsForm,
  PersonDetails,
  ContactDetailsForm,
  ContactDetails,
  AddressForm,
  Address,
  RestrictionForm,
  Restriction,
  SecurityQuestions,
  SecurityQuestionsForm
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
  PetForm,
  Secret,
  SecretForm
} from '../model/needs.model';

@Injectable({ providedIn: 'root' })
export class FormCreationService {
  restrictionForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(new RestrictionForm(new Restriction()))
    );

  restrictionForm$: Observable<UntypedFormGroup> =
    this.restrictionForm.asObservable();

  personalDetailsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new PersonDetailsForm(new PersonDetails(), this.customValidator)
      )
    );

  personalDetailsForm$: Observable<UntypedFormGroup> =
    this.personalDetailsForm.asObservable();

  contactDetailsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new ContactDetailsForm(new ContactDetails(), this.customValidator)
      )
    );

  contactDetailsForm$: Observable<UntypedFormGroup> =
    this.contactDetailsForm.asObservable();

  addressForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new AddressForm(new Address(), this.formBuilder, this.customValidator)
      )
    );

  addressForm$: Observable<UntypedFormGroup> = this.addressForm.asObservable();

  securityQuestionsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new SecurityQuestionsForm(
          new SecurityQuestions(),
          this.formBuilder,
          this.customValidator
        )
      )
    );

  securityQuestionsForm$: Observable<UntypedFormGroup> =
    this.securityQuestionsForm.asObservable();

  evacuatedForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new EvacuatedForm(
          new Evacuated(),
          this.formBuilder,
          this.customValidator
        )
      )
    );

  evacuatedForm$: Observable<UntypedFormGroup> =
    this.evacuatedForm.asObservable();

  householdMembersForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new HouseholdMembersForm(
          new HouseholdMembers(),
          this.customValidator,
          this.formBuilder
        )
      )
    );

  householdMembersForm$: Observable<UntypedFormGroup> =
    this.householdMembersForm.asObservable();

  petsForm: BehaviorSubject<UntypedFormGroup | undefined> = new BehaviorSubject(
    this.formBuilder.group(
      new PetForm(new Pet(), this.customValidator, this.formBuilder)
    )
  );

  petsForm$: Observable<UntypedFormGroup> = this.petsForm.asObservable();

  identifyNeedsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(new IdentifyNeedsForm(new IdentifyNeeds()))
    );

  identifyNeedsForm$: Observable<UntypedFormGroup> =
    this.identifyNeedsForm.asObservable();

  secretForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(this.formBuilder.group(new SecretForm(new Secret())));

  secretForm$: Observable<UntypedFormGroup> = this.secretForm.asObservable();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private customValidator: CustomValidationService
  ) {}

  getRestrictionForm(): Observable<UntypedFormGroup> {
    return this.restrictionForm$;
  }

  setRestrictionForm(restrictionForm: UntypedFormGroup): void {
    this.restrictionForm.next(restrictionForm);
  }

  getPersonalDetailsForm(): Observable<UntypedFormGroup> {
    return this.personalDetailsForm$;
  }

  setPersonDetailsForm(personForm: UntypedFormGroup): void {
    this.personalDetailsForm.next(personForm);
  }

  getContactDetailsForm(): Observable<UntypedFormGroup> {
    return this.contactDetailsForm$;
  }

  setContactDetailsForm(contactForm: UntypedFormGroup): void {
    this.contactDetailsForm.next(contactForm);
  }

  getSecurityQuestionsForm(): Observable<UntypedFormGroup> {
    return this.securityQuestionsForm$;
  }

  setSecurityQuestionsForm(securityQuestionsForm: UntypedFormGroup): void {
    return this.securityQuestionsForm.next(securityQuestionsForm);
  }

  getAddressForm(): Observable<UntypedFormGroup> {
    return this.addressForm$;
  }

  setAddressForm(addressForm: UntypedFormGroup): void {
    this.addressForm.next(addressForm);
  }

  getEvacuatedForm(): Observable<UntypedFormGroup> {
    return this.evacuatedForm$;
  }

  setEvacuatedForm(evacuatedForm: UntypedFormGroup): void {
    this.evacuatedForm.next(evacuatedForm);
  }

  getHouseholdMembersForm(): Observable<UntypedFormGroup> {
    return this.householdMembersForm$;
  }

  setHouseholdMembersForm(householdMembersForm: UntypedFormGroup): void {
    this.householdMembersForm.next(householdMembersForm);
  }

  getPetsForm(): Observable<UntypedFormGroup> {
    return this.petsForm$;
  }

  setPetsForm(petsForm: UntypedFormGroup): void {
    this.petsForm.next(petsForm);
  }

  getIndentifyNeedsForm(): Observable<UntypedFormGroup> {
    return this.identifyNeedsForm$;
  }

  setIdentifyNeedsForm(identifyNeedsForm: UntypedFormGroup): void {
    this.identifyNeedsForm.next(identifyNeedsForm);
  }

  getSecretForm(): Observable<UntypedFormGroup> {
    return this.secretForm$;
  }

  setSecretForm(secretForm: UntypedFormGroup): void {
    this.secretForm.next(secretForm);
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
    this.securityQuestionsForm.next(
      this.formBuilder.group(
        new SecurityQuestionsForm(
          new SecurityQuestions(),
          this.formBuilder,
          this.customValidator
        )
      )
    );
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
    this.secretForm.next(this.formBuilder.group(new SecretForm(new Secret())));
  }
}
