import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SupportDetailsRoutingModule } from './support-details-routing.module';
import { SupportDetailsComponent } from './support-details.component';
import { MaterialModule } from 'src/app/material.module';
import { OverrideDatetimeComponent } from './override-datetime/override-datetime.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SupportDetailsComponent, OverrideDatetimeComponent],
  imports: [
    CommonModule,
    SupportDetailsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe]
})
export class SupportDetailsModule {}
