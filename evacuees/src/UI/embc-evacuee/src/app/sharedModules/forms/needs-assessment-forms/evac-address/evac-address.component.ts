import { Component, OnInit, NgModule, Inject, ɵConsole } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { CustomPipeModule } from '../../../../core/pipe/customPipe.module';
import { InsuranceOption } from '../../../../core/model/insurance-option';
import { DataService } from '../../../../core/services/data.service';
import * as globalConst from '../../../../core/services/globalConstants';
import { AddressFormsModule } from '../../address-forms/address-forms.module';

@Component({
  selector: 'app-evac-address',
  templateUrl: './evac-address.component.html',
  styleUrls: ['./evac-address.component.scss']
})
export default class EvacAddressComponent implements OnInit {

  evacuatedForm: FormGroup;
  formBuilder: FormBuilder;
  evacuatedForm$: Subscription;
  formCreationService: FormCreationService;
  insuranceOption = globalConst.insuranceOptions;

  // registrationAddress: Partial<Registration>;

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService,
              public dataService: DataService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    // this.registration = this.dataService.getRegistration();
    this.evacuatedForm$ = this.formCreationService.getEvacuatedForm().subscribe(
      evacuatedForm => {
        this.evacuatedForm = evacuatedForm;
      }
    );

    this.otherAddressTemplate();
  }

  primaryAddressChange(event: MatRadioChange): void {
    if (event.value === 'No') {
      this.evacuatedForm.get('evacuatedFromAddress').reset();
      this.evacuatedForm.get('evacuatedFromAddress.stateProvince').setValue(globalConst.defaultProvince);
      this.evacuatedForm.get('evacuatedFromAddress.country').setValue(globalConst.defaultCountry);
    } else {
      this.formCreationService.getAddressForm().subscribe(
        registrationAddress => {
          console.log(registrationAddress);
          this.evacuatedForm.get('evacuatedFromAddress').setValue(registrationAddress.get('address').value);
        }
      );
    }
  }

  otherAddressTemplate(): void {
      if(this.evacuatedForm.get('evacuatedFromAddress.stateProvince').value == ""){
        this.evacuatedForm.get('evacuatedFromAddress').reset();
        this.evacuatedForm.get('evacuatedFromAddress.stateProvince').setValue(globalConst.defaultProvince);
        this.evacuatedForm.get('evacuatedFromAddress.country').setValue(globalConst.defaultCountry);
      }
      
  }

  /**
   * Returns the control of the form
   */
  get evacuatedFormControl(): { [key: string]: AbstractControl; } {
    return this.evacuatedForm.controls;
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
    MatRadioModule,
    CustomPipeModule,
    AddressFormsModule
  ],
  declarations: [
    EvacAddressComponent,
  ]
})
class EvacAddressModule {

}
