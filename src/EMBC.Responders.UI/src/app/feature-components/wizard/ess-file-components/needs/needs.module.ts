import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedsRoutingModule } from './needs-routing.module';
import { NeedsComponent } from './needs.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NeedsComponent],
  imports: [
    CommonModule,
    NeedsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class NeedsModule {}
