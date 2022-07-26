import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeIdVerifyRoutingModule } from './evacuee-id-verify-routing.module';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EvacueeIdVerifyComponent],
  imports: [
    CommonModule,
    EvacueeIdVerifyRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class EvacueeIdVerifyModule {}
