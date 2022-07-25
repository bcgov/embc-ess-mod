import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemoteSearchComponent } from './remote-search.component';

const routes: Routes = [{ path: '', component: RemoteSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemoteSearchRoutingModule {}
