import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { ReviewRoutingModule } from './review-routing.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  imports: [CommonModule, ReviewRoutingModule, CoreModule],
  declarations: [ReviewComponent],
  exports: []
})
export class ReviewModule {}
