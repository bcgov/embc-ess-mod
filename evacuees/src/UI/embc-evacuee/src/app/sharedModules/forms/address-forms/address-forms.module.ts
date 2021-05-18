import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcAddressComponent } from './bc-address/bc-address.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CanAddressComponent } from './can-address/can-address.component';
import { UsaAddressComponent } from './usa-address/usa-address.component';
import { OtherAddressComponent } from './other-address/other-address.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    BcAddressComponent,
    CanAddressComponent,
    UsaAddressComponent,
    OtherAddressComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  exports: [
    BcAddressComponent,
    CanAddressComponent,
    UsaAddressComponent,
    OtherAddressComponent
  ]
})
export class AddressFormsModule {}
