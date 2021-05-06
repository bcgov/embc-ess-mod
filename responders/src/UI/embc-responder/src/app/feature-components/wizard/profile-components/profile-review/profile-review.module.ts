import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileReviewRoutingModule } from './profile-review-routing.module';
import { ProfileReviewComponent } from './profile-review.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [ProfileReviewComponent],
  imports: [CommonModule, ProfileReviewRoutingModule, MaterialModule]
})
export class ProfileReviewModule {}
