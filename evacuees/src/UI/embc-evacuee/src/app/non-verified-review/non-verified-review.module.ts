import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NonVerifiedReviewRoutingModule } from './non-verified-review-routing.module';
import { NonVerifiedReviewComponent } from './non-verified-review.component';

@NgModule({
  declarations: [
    NonVerifiedReviewComponent
  ],
  imports: [
    CommonModule,
    NonVerifiedReviewRoutingModule
  ]
})
export class NonVerifiedReviewModule { }
