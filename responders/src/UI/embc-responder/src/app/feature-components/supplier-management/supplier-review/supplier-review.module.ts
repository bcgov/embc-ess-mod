import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierReviewRoutingModule } from './supplier-review-routing.module';
import { SupplierReviewComponent } from './supplier-review.component';

@NgModule({
  imports: [CommonModule, SupplierReviewRoutingModule, SupplierReviewComponent]
})
export class SupplierReviewModule {}
