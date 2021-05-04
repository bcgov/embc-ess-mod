import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileReviewRoutingModule } from './ess-file-review-routing.module';
import { EssFileReviewComponent } from './ess-file-review.component';

@NgModule({
  declarations: [EssFileReviewComponent],
  imports: [CommonModule, EssFileReviewRoutingModule]
})
export class EssFileReviewModule {}
