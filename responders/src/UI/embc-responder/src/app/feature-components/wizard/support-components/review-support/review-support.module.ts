import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewSupportRoutingModule } from './review-support-routing.module';
import { ReviewSupportComponent } from './review-support.component';
import { MaterialModule } from 'src/app/material.module';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, ReviewSupportRoutingModule, MaterialModule, CustomPipeModule, SharedModule, ReviewSupportComponent]
})
export class ReviewSupportModule {}
