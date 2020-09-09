import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'collection-notice',
    loadChildren: () => import('./pre-registration/pre-registration.module').then(m => m.PreRegistrationModule)
  },
  {
    path: 'restriction',
    loadChildren: () => import('./restriction/restriction.module').then(m => m.RestrictionModule)
  },
  {
    path: 'create-profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'create-evac-file',
    loadChildren: () => import('./evacuation-file/evacuation-file.module').then(m => m.EvacuationFileModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then(m => m.ReviewModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//pre-registration/:profile