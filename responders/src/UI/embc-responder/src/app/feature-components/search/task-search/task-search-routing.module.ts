import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskSearchComponent } from './task-search.component';

const routes: Routes = [{ path: '', component: TaskSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskSearchRoutingModule {}
