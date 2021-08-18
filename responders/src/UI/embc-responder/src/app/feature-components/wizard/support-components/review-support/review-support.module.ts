import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewSupportRoutingModule } from './review-support-routing.module';
import { ReviewSupportComponent } from './review-support.component';

@NgModule({
  declarations: [ReviewSupportComponent],
  imports: [CommonModule, ReviewSupportRoutingModule]
})
export class ReviewSupportModule {}
