import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisableBackGuard } from '../../core/services/disableBack.guard';
import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';

const routes: Routes = [
  {
    path: '',
    component: NonVerifiedRegistrationComponent,
    children: [
      {
        path: '',
        redirectTo: 'collection-notice',
        pathMatch: 'full'
      },
      {
        path: 'collection-notice',
        loadChildren: () =>
          import('../collection-notice/collection-notice.module').then(
            (m) => m.CollectionNoticeModule
          ),
        data: { flow: 'non-verified-registration' }
      },
      {
        path: 'restriction',
        loadChildren: () =>
          import('../restriction/restriction.module').then(
            (m) => m.RestrictionModule
          ),
        data: { flow: 'non-verified-registration' }
      },
      {
        path: 'create-profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
        data: { flow: 'non-verified-registration' }
      },
      {
        path: 'needs-assessment',
        loadChildren: () =>
          import('../needs-assessment/needs-assessment.module').then(
            (m) => m.NeedsAssessmentModule
          ),
        data: { flow: 'non-verified-registration' }
      },
      {
        path: 'edit/:type',
        loadChildren: () =>
          import('../edit/edit.module').then((m) => m.EditModule),
        data: { flow: 'non-verified-registration' }
      },
      {
        path: 'file-submission',
        loadChildren: () =>
          import('../file-submission/file-submission.module').then(
            (m) => m.FileSubmissionModule
          ),
        data: { flow: 'non-verified-registration' },
        canDeactivate: [DisableBackGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonVerifiedRegistrationRoutingModule {}
