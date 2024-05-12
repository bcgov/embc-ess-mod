import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepEvacueeProfileRoutingModule } from './step-evacuee-profile-routing.module';
import { StepEvacueeProfileComponent } from './step-evacuee-profile.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, StepEvacueeProfileRoutingModule, MaterialModule, SharedModule, StepEvacueeProfileComponent]
})
export class StepEvacueeProfileModule {}
