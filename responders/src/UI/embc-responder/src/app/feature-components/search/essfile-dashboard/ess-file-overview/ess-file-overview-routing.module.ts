import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssFileOverviewComponent } from './ess-file-overview.component';

const routes: Routes = [{ path: '', component: EssFileOverviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssFileOverviewRoutingModule {}
