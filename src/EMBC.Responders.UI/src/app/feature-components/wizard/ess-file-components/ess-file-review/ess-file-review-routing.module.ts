import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssFileReviewComponent } from './ess-file-review.component';

const routes: Routes = [{ path: '', component: EssFileReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssFileReviewRoutingModule {}
