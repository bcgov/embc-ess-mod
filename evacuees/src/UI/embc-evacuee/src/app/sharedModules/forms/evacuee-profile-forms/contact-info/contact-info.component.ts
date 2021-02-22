import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

export class CustomErrorRequiredFields implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted)) || control.parent.hasError('contactInfoReq');
  }
}

export class CustomErrorMailMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted)) || control.parent.hasError('emailMatch');
  }
}

export class CustomErrorRequiredConfirmMail implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted)) || control.parent.hasError('confirmEmailRequired');
  }
}

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export default class ContactInfoComponent implements OnInit, OnDestroy {

  contactInfoForm: FormGroup;
  formBuilder: FormBuilder;
  contactInfoForm$: Subscription;
  formCreationService: FormCreationService;
  readonly phoneMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  requiredFieldsMatcher = new CustomErrorRequiredFields();
  emailMatcher = new CustomErrorMailMatcher();
  requiredConfirmEmail = new CustomErrorRequiredConfirmMail();
  contactsFlag = false;

  constructor(
    @Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.contactInfoForm$ = this.formCreationService.getContactDetailsForm().subscribe(
      contactInfo => {
        this.contactInfoForm = contactInfo;
        this.contactInfoForm.setValidators([this.customValidator.contactInfoValidator().bind(this.customValidator),
        this.customValidator.confirmEmailValidator().bind(this.customValidator),
        this.customValidator.requiredConfirmEmailValidator().bind(this.customValidator)]);
        this.contactInfoForm.updateValueAndValidity();
      }
    );
  }

  /**
   * Returns the control of the form
   */
  get contactFormControl(): { [key: string]: AbstractControl; } {
    return this.contactInfoForm.controls;
  }

  hideContact(event: MatRadioChange): void {
    this.contactsFlag = event.value;
    if (!event.value) {
      this.contactInfoForm.get('phone').reset();
      this.contactInfoForm.get('email').reset();
      this.contactInfoForm.get('confirmEmail').reset();
    }
  }

  ngOnDestroy(): void {
    this.contactInfoForm$.unsubscribe();
  }

}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    DirectivesModule,
    TextMaskModule,
    MatRadioModule
  ],
  declarations: [
    ContactInfoComponent,
  ]
})
class ContactInfoModule {

}
