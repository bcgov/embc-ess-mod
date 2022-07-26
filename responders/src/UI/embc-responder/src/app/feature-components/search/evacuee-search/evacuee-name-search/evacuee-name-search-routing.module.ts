import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvacueeNameSearchComponent } from './evacuee-name-search.component';

const routes: Routes = [{ path: '', component: EvacueeNameSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacueeNameSearchRoutingModule {}
