import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
//import { AddressComponent } from './address/address.component';
// import { ContactInfoComponent } from './contact-info/contact-info.component';
// import { SecretComponent } from './secret/secret.component'
import { ComponentWrapperComponent } from './component-wrapper/component-wrapper.component'

@NgModule({
  declarations: [
    //PersonalDetailsComponent,
    //AddressComponent,
    //ContactInfoComponent,
    //SecretComponent
    ComponentWrapperComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    ComponentWrapperComponent
      // PersonalDetailsComponent,
      //AddressComponent,
      //ContactInfoComponent,
      //SecretComponent
  ]
})
export class EvacueeProfileFormsModule { }
