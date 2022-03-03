import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExistingSupportDetailsRoutingModule } from './existing-support-details-routing.module';
import { ExistingSupportDetailsComponent } from './existing-support-details.component';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ExistingSupportDetailsComponent],
  imports: [
    CommonModule,
    ExistingSupportDetailsRoutingModule,
    CustomPipeModule,
    MaterialModule,
    SharedModule
  ]
})
export class ExistingSupportDetailsModule {}
