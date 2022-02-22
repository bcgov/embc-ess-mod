import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileReviewComponent } from './profile-review.component';

const routes: Routes = [{ path: '', component: ProfileReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileReviewRoutingModule {}
