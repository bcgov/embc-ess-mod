import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileReviewRoutingModule } from './profile-review-routing.module';
import { ProfileReviewComponent } from './profile-review.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileReviewComponent],
  imports: [
    CommonModule,
    ProfileReviewRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ProfileReviewModule {}
