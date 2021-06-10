import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewComponent } from './review.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomPipeModule } from '../../../core/pipe/customPipe.module';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ReviewComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CustomPipeModule,
    CoreModule
  ],
  exports: [ReviewComponent]
})
export class ReviewModule {}
