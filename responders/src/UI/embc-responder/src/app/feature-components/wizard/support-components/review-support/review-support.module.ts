import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewSupportRoutingModule } from './review-support-routing.module';
import { ReviewSupportComponent } from './review-support.component';
import { MaterialModule } from 'src/app/material.module';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

@NgModule({
  declarations: [ReviewSupportComponent],
  imports: [
    CommonModule,
    ReviewSupportRoutingModule,
    MaterialModule,
    CustomPipeModule
  ]
})
export class ReviewSupportModule {}
