import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileReviewRoutingModule } from './profile-review-routing.module';
import { ProfileReviewComponent } from './profile-review.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ProfileReviewComponent],
  imports: [
    CommonModule,
    ProfileReviewRoutingModule,
    MaterialModule,
    CustomPipeModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ProfileReviewModule {}
