import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepEvacueeProfileRoutingModule } from './step-evacuee-profile-routing.module';
import { StepEvacueeProfileComponent } from './step-evacuee-profile.component';

@NgModule({
  imports: [CommonModule, StepEvacueeProfileRoutingModule, StepEvacueeProfileComponent]
})
export class StepEvacueeProfileModule {}
