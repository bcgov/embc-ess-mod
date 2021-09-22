import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileSupportsRoutingModule } from './ess-file-supports-routing.module';
import { EssFileSupportsComponent } from './ess-file-supports.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EssFileSupportsComponent],
  imports: [
    CommonModule,
    EssFileSupportsRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class EssFileSupportsModule {}
