import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileReviewRoutingModule } from './ess-file-review-routing.module';
import { EssFileReviewComponent } from './ess-file-review.component';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, CustomPipeModule, MaterialModule, SharedModule, EssFileReviewRoutingModule, EssFileReviewComponent]
})
export class EssFileReviewModule {}
