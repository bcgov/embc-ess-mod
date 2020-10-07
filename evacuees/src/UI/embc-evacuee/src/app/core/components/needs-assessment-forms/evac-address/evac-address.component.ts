import { Component, OnInit, NgModule, Inject, ɵConsole } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../../services/formCreation.service';
import { CustomPipeModule } from '../../../pipe/customPipe.module';
import { InsuranceOption } from '../../../model/insurance-option';
import { DataService } from '../../../services/data.service';
import { Registration } from '../../../model/registration';
import * as globalConst from '../../../services/globalConstants';
import { AddressFormsModule } from '../../address-forms/address-forms.module';

@Component({
  selector: 'app-evac-address',
  templateUrl: './evac-address.component.html',
  styleUrls: ['./evac-address.component.scss']
})
export default class EvacAddressComponent implements OnInit {

  evacuatedForm: FormGroup;
  gender: Array<string> = new Array<string>();
  formBuilder: FormBuilder;
  evacuatedForm$: Subscription;
  formCreationService: FormCreationService;
  insuranceOption = InsuranceOption;
  registration: Partial<Registration>;

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService, public dataService: DataService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
   }

  ngOnInit(): void {
    this.registration = this.dataService.getRegistration();
    console.log(this.registration);
    this.evacuatedForm$ = this.formCreationService.getEvacuatedForm().subscribe(
      evacuatedForm => {
        this.evacuatedForm = evacuatedForm;
      }
    );
  }

  primaryAddressChange(event: MatRadioChange): void {
    console.log(event.value)
    if (event.value === 'No') {
      this.evacuatedForm.get('evacuatedFromAddress').reset();
      this.evacuatedForm.get('evacuatedFromAddress.stateProvince').setValue(globalConst.defaultProvince);
      this.evacuatedForm.get('evacuatedFromAddress.country').setValue(globalConst.defaultCountry);
    } else {
      this.evacuatedForm.get('evacuatedFromAddress').setValue(this.registration.primaryAddress);
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
