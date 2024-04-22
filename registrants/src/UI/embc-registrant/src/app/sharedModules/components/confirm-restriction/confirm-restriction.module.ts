import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmRestrictionRoutingModule } from './confirm-restriction-routing.module';
import { ConfirmRestrictionComponent } from './confirm-restriction.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ConfirmRestrictionRoutingModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    ConfirmRestrictionComponent
  ]
})
export class ConfirmRestrictionModule {}
