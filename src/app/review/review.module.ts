import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { ReviewRoutingModule } from './review-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReviewRoutingModule
  ],
  declarations: [
    ReviewComponent,
    ],
  exports: [
    ]
})
export class ReviewModule { }