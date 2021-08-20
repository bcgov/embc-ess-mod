import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectSupportRoutingModule } from './select-support-routing.module';
import { SelectSupportComponent } from './select-support.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SelectSupportComponent],
  imports: [
    CommonModule,
    SelectSupportRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SelectSupportModule {}
