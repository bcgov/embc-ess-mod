import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvacueeSearchResultsComponent } from './evacuee-search-results.component';

const routes: Routes = [{ path: '', component: EvacueeSearchResultsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacueeSearchResultsRoutingModule {}
