import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectedEssfileComponent } from './selected-essfile.component';

const routes: Routes = [{ path: '', component: SelectedEssfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectedEssfileComponentRoutingModule {}
