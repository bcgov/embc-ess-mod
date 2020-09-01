import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreRegistrationRoutingModule } from './pre-registration-routing.module';
import { PreRegistrationComponent } from './pre-registration.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PreRegistrationComponent
  ],
  imports: [
    CommonModule,
    PreRegistrationRoutingModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class PreRegistrationModule { }
