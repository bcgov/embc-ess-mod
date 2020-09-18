import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PersonDetailsForm, PersonDetails } from '../model/personDetails.model';
import { CustomValidationService } from './customValidation.service';

@Injectable({ providedIn: 'root' })
export class FormCreationService {

    private personalDetailsForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.formBuilder.group(new PersonDetailsForm(new PersonDetails(), this.customValidator)));

    private personalDetailsForm$: Observable<FormGroup> = this.personalDetailsForm.asObservable();

    constructor(private formBuilder: FormBuilder, private customValidator: CustomValidationService) { }

    getPeronalDetailsForm(): Observable<FormGroup> {
        return this.personalDetailsForm$;
    }

    setPersonDetailsForm(personForm: FormGroup): void {
        this.personalDetailsForm.next(personForm);
        console.log(this.personalDetailsForm);
    }

}
