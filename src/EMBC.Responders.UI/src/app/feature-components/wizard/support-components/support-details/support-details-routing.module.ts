import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportDetailsComponent } from './support-details.component';

const routes: Routes = [{ path: '', component: SupportDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportDetailsRoutingModule {}
