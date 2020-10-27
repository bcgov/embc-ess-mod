import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewComponent } from './review.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomPipeModule } from '../../pipe/customPipe.module';

@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CustomPipeModule
  ],
  exports: [
    ReviewComponent
  ]
})
export class ReviewModule { }
