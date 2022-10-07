import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmissionComponent } from './submission.component';

const routes: Routes = [{ path: '', component: SubmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule {}
