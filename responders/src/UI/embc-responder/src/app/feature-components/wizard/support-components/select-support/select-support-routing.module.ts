import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectSupportComponent } from './select-support.component';

const routes: Routes = [{ path: '', component: SelectSupportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectSupportRoutingModule {}
