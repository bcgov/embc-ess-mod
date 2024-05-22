import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';

@NgModule({
  imports: [CommonModule, ReviewRoutingModule, ReviewComponent],
  exports: []
})
export class ReviewModule {}
