import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileReviewRoutingModule } from './profile-review-routing.module';
import { ProfileReviewComponent } from './profile-review.component';


@NgModule({
  declarations: [ProfileReviewComponent],
  imports: [
    CommonModule,
    ProfileReviewRoutingModule
  ]
})
export class ProfileReviewModule { }
