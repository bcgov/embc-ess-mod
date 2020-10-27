import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';

const routes: Routes = [
  {
    path: '', component: NonVerifiedRegistrationComponent,
    children: [
      {
        path: '',
        redirectTo: 'collection-notice',
        pathMatch: 'full',
      },
      {
        path: 'collection-notice',
        loadChildren: () => import('../sharedRoutes/collection-notice/collection-notice.module').then(m => m.CollectionNoticeModule)
      },
      {
        path: 'restriction',
        loadChildren: () => import('../sharedRoutes/restriction/restriction.module').then(m => m.RestrictionModule)
      },
      {
        path: 'create-profile',
        loadChildren: () => import('../sharedRoutes/profile/profile.module').then(m => m.ProfileModule)
      }, /// :stepPos
      {
        path: 'needs-assessment',
        loadChildren: () => import('../sharedRoutes/needs-assessment/needs-assessment.module').then(m => m.NeedsAssessmentModule)
      },
      {
        path: 'edit/:type',
        loadChildren: () => import('../edit/edit.module').then(m => m.EditModule)
      },
      {
        path: 'fileSubmission',
        loadChildren: () => import('../sharedRoutes/file-submission/file-submission.module').then(m => m.FileSubmissionModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonVerifiedRegistrationRoutingModule { }
