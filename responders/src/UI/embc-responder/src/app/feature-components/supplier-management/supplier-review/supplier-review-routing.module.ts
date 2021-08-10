import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierReviewComponent } from './supplier-review.component';

const routes: Routes = [{ path: '', component: SupplierReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierReviewRoutingModule {}
