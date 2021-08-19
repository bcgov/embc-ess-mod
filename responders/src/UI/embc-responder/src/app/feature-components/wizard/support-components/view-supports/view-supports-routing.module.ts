import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSupportsComponent } from './view-supports.component';

const routes: Routes = [{ path: '', component: ViewSupportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewSupportsRoutingModule {}
