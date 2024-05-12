import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeIdVerifyRoutingModule } from './evacuee-id-verify-routing.module';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, EvacueeIdVerifyRoutingModule, ReactiveFormsModule, EvacueeIdVerifyComponent]
})
export class EvacueeIdVerifyModule {}
