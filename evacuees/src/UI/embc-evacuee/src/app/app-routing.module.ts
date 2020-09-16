import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/non-verified-registration',
    pathMatch: 'full'
  },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  // },
  {
    path: 'non-verified-registration',
    loadChildren: () => import('./non-verified-registration/non-verified-registration.module').then(m => m.NonVerifiedRegistrationModule)
  },
  // {
  //   path: 'loader',
  //   loadChildren: () => import('./component-loader/component-loader.module').then(m => m.ComponentLoaderModule)
  // },
  {
    path: 'fileSubmission',
    loadChildren: () => import('./file-submission/file-submission.module').then(m => m.FileSubmissionModule)
  },
  // {
  //   path: 'create-profile/:type',//
  //   loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  // },
  // {
  //   path: 'needs-assessment',//
  //   loadChildren: () => import('./evacuation-file/evacuation-file.module').then(m => m.EvacuationFileModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//pre-registration/:profile