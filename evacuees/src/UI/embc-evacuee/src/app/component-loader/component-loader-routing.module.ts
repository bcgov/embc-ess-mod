import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentLoaderComponent } from './component-loader.component';

const routes: Routes = [
  {
    path: '', component: ComponentLoaderComponent, children: [
      { path: 'registration/:stepPos', loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule) },
      { path: 'needs-assessment', loadChildren: () => import('../needs-assessment/needs-assessment.module').then(m => m.NeedsAssessmentModule) },
      {
        path: '',
        redirectTo: 'registration',
        pathMatch: 'full'
      },
      { path: 'edit/:type', loadChildren: () => import('../edit/edit.module').then(m => m.EditModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentLoaderRoutingModule { }
