import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcAddressComponent } from './bc-address/bc-address.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';
import { CanAddressComponent } from './can-address/can-address.component';
import { UsaAddressComponent } from './usa-address/usa-address.component';
import { OtherAddressComponent } from './other-address/other-address.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

@NgModule({
  declarations: [BcAddressComponent, CanAddressComponent, UsaAddressComponent, OtherAddressComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  exports: [BcAddressComponent, CanAddressComponent, UsaAddressComponent, OtherAddressComponent]
})
export class AddressFormsModule {}
