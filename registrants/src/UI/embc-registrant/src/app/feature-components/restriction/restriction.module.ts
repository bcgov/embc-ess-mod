import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { RestrictionRoutingModule } from './restriction-routing.module';
import { RestrictionComponent } from './restriction.component';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { ReactiveFormsModule } from '@angular/forms';
import { RestrictionFormModule } from '../../sharedModules/forms/restriction-form/restriction-form.module';

@NgModule({
  declarations: [RestrictionComponent],
  imports: [
    CommonModule,
    RestrictionRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    RestrictionFormModule
  ]
})
export class RestrictionModule {}
