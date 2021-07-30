import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSuppliersComponent } from './list-suppliers.component';

const routes: Routes = [{ path: '', component: ListSuppliersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListSuppliersRoutingModule {}
