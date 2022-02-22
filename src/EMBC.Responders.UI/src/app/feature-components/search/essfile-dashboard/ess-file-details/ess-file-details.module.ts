import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileDetailsRoutingModule } from './ess-file-details-routing.module';
import { EssFileDetailsComponent } from './ess-file-details.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

@NgModule({
  declarations: [EssFileDetailsComponent],
  imports: [
    CommonModule,
    EssFileDetailsRoutingModule,
    MaterialModule,
    SharedModule,
    CustomPipeModule
  ]
})
export class EssFileDetailsModule {}
