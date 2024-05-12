import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierReviewRoutingModule } from './supplier-review-routing.module';
import { SupplierReviewComponent } from './supplier-review.component';
import { MaterialModule } from 'src/app/material.module';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, SupplierReviewRoutingModule, MaterialModule, CustomPipeModule, SharedModule, SupplierReviewComponent]
})
export class SupplierReviewModule {}
