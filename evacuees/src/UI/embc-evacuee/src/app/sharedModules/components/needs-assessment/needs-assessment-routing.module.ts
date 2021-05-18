import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeedsAssessmentComponent } from './needs-assessment.component';

const routes: Routes = [{ path: '', component: NeedsAssessmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedsAssessmentRoutingModule {}
