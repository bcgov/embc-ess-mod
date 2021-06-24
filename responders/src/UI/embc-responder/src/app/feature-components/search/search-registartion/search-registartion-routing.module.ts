import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchRegistartionComponent } from './search-registartion.component';

const routes: Routes = [
  {
    path: '',
    component: SearchRegistartionComponent,
    children: [
      {
        path: '',
        redirectTo: 'task',
        pathMatch: 'full'
      },
      {
        path: 'task',
        loadChildren: () =>
          import('../task-search/task-search.module').then(
            (m) => m.TaskSearchModule
          )
      },
      {
        path: 'task-details',
        loadChildren: () =>
          import('../task-search/task-details/task-details.module').then(
            (m) => m.TaskDetailsModule
          )
      },
      {
        path: 'evacuee',
        loadChildren: () =>
          import('../evacuee-search/evacuee-search.module').then(
            (m) => m.EvacueeSearchModule
          )
      },
      {
        path: 'security-phrase',
        loadChildren: () =>
          import(
            '../essfile-security-phrase/essfile-security-phrase.module'
          ).then((m) => m.EssfileSecurityPhraseModule)
      },
      {
        path: 'security-questions',
        loadChildren: () =>
          import(
            '../profile-security-questions/profile-security-questions.module'
          ).then((m) => m.ProfileSecurityQuestionsModule)
      },
      {
        path: 'evacuee-profile-dashboard',
        loadChildren: () =>
          import(
            '../evacuee-profile-dashboard/evacuee-profile-dashboard.module'
          ).then((m) => m.EvacueeProfileDashboardModule)
      },
      {
        path: 'essfile-dashboard',
        loadChildren: () =>
          import('../essfile-dashboard/essfile-dashboard.module').then(
            (m) => m.EssfileDashboardModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRegistartionRoutingModule {}
