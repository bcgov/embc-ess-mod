import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmRestrictionRoutingModule } from './confirm-restriction-routing.module';
import { ConfirmRestrictionComponent } from './confirm-restriction.component';
import { RestrictionFormModule } from '../../forms/restriction-form/restriction-form.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfirmRestrictionComponent],
  imports: [
    CommonModule,
    ConfirmRestrictionRoutingModule,
    RestrictionFormModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class ConfirmRestrictionModule {}
