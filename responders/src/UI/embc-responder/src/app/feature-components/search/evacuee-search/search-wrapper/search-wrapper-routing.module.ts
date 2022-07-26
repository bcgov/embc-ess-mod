import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchWrapperComponent } from './search-wrapper.component';

const routes: Routes = [{ path: '', component: SearchWrapperComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchWrapperRoutingModule {}
