import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistingSupportDetailsComponent } from './existing-support-details.component';

const routes: Routes = [
  { path: '', component: ExistingSupportDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExistingSupportDetailsRoutingModule {}
