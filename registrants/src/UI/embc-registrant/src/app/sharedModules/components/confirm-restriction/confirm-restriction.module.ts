import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmRestrictionRoutingModule } from './confirm-restriction-routing.module';
import { ConfirmRestrictionComponent } from './confirm-restriction.component';
import { RestrictionFormModule } from '../../forms/restriction-form/restriction-form.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
