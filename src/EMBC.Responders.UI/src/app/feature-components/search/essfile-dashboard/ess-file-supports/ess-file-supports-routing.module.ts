import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssFileSupportsComponent } from './ess-file-supports.component';

const routes: Routes = [{ path: '', component: EssFileSupportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssFileSupportsRoutingModule {}
