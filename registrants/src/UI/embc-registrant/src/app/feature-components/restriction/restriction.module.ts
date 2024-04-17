import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RestrictionRoutingModule } from './restriction-routing.module';
import { RestrictionComponent } from './restriction.component';
import { MatRadioModule } from '@angular/material/radio';
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
