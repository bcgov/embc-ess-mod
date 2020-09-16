import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewComponent } from './review.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    ReviewComponent
  ]
})
export class ReviewModule { }
