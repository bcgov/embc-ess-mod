import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileReviewRoutingModule } from './profile-review-routing.module';
import { ProfileReviewComponent } from './profile-review.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ProfileReviewRoutingModule, ReactiveFormsModule, ProfileReviewComponent]
})
export class ProfileReviewModule {}
