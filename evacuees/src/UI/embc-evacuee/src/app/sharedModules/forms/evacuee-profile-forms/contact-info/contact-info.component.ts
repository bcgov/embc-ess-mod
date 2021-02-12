import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted)) || control.parent.hasError('emailMatch');
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
  matcher = new CustomErrorStateMatcher();

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService,
              public customValidator: CustomValidationService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.contactInfoForm$ = this.formCreationService.getContactDetailsForm().subscribe(
      contactInfo => {
        this.contactInfoForm = contactInfo;
        this.contactInfoForm.setValidators([this.customValidator.confirmEmailValidator().bind(this.customValidator)]);
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

  /**
   * Triggers when the checkbox selction changes and reset and disables
   * email form fields
   * @param event : Checkbox selected event
   */
  hideEmail(event: MatCheckboxChange): void {
    if (event.checked) {
      this.contactInfoForm.get('email').reset();
      this.contactInfoForm.get('email').disable();

      this.contactInfoForm.get('confirmEmail').reset();
      this.contactInfoForm.get('confirmEmail').disable();
    } else {
      this.contactInfoForm.get('email').enable();
      this.contactInfoForm.get('confirmEmail').enable();
    }
  }

  /**
   * Triggers when the checkbox selction changes and reset and disables
   * phone form fields
   * @param event : Checkbox selected event
   */
  hidePhone(event: MatCheckboxChange): void {
    if (event.checked) {
      this.contactInfoForm.get('phone').reset();
      this.contactInfoForm.get('phone').disable();
    } else {
      this.contactInfoForm.get('phone').enable();
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
    TextMaskModule
  ],
  declarations: [
    ContactInfoComponent,
  ]
})
class ContactInfoModule {

}
