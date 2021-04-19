import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchRegistartionComponent } from './search-registartion.component';

const routes: Routes = [
  {
    path: '', component: SearchRegistartionComponent,
    children: [
      {
        path: '',
        redirectTo: 'task',
        pathMatch: 'full'
      },
      {
        path: 'task',
        loadChildren: () => import('../task-search/task-search.module').then(m => m.TaskSearchModule)
      },
      {
        path: 'task-details',
        loadChildren: () => import('../task-details/task-details.module').then(m => m.TaskDetailsModule)
      },
      {
        path: 'evacuee',
        loadChildren: () => import('../evacuee-search/evacuee-search.module').then(m => m.EvacueeSearchModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRegistartionRoutingModule { }
