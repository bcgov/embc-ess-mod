import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutageComponent } from './outage.component';

const routes: Routes = [{ path: '', component: OutageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutageRoutingModule {}
