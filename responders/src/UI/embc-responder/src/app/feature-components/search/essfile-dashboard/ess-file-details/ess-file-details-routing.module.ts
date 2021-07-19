import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssFileDetailsComponent } from './ess-file-details.component';

const routes: Routes = [{ path: '', component: EssFileDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssFileDetailsRoutingModule {}
