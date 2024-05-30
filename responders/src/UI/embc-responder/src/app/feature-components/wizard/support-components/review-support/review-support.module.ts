import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewSupportRoutingModule } from './review-support-routing.module';
import { ReviewSupportComponent } from './review-support.component';

@NgModule({
  imports: [CommonModule, ReviewSupportRoutingModule, ReviewSupportComponent]
})
export class ReviewSupportModule {}
