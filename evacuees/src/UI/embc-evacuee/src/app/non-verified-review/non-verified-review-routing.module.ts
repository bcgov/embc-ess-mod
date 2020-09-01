import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonVerifiedReviewComponent } from './non-verified-review.component';

const routes: Routes = [
  { path:'', component: NonVerifiedReviewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonVerifiedReviewRoutingModule { }
