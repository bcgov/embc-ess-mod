import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllowNavigationGuard } from '../../core/services/allowNavigation.guard';
import { VerifiedRegistrationComponent } from './verified-registration.component';

const routes: Routes = [
  {
    path: '',
    component: VerifiedRegistrationComponent,
    children: [
      {
        path: 'conflicts',
        loadChildren: () =>
          import(
            '../../sharedModules/components/conflict-management/conflict-management.module'
          ).then((m) => m.ConflictManagementModule),
        data: { flow: 'verified-registration' },
        canActivate: [AllowNavigationGuard]
      },
      {
        path: 'collection-notice',
        loadChildren: () =>
          import('../collection-notice/collection-notice.module').then(
            (m) => m.CollectionNoticeModule
          ),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'restriction',
        loadChildren: () =>
          import('../restriction/restriction.module').then(
            (m) => m.RestrictionModule
          ),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'create-profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import(
            '../../sharedModules/components/dashboard/dashboard.module'
          ).then((m) => m.DashboardModule),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'edit/:type',
        loadChildren: () =>
          import('../edit/edit.module').then((m) => m.EditModule),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'confirm-restriction',
        loadChildren: () =>
          import(
            '../../sharedModules/components/confirm-restriction/confirm-restriction.module'
          ).then((m) => m.ConfirmRestrictionModule),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'needs-assessment',
        loadChildren: () =>
          import('../needs-assessment/needs-assessment.module').then(
            (m) => m.NeedsAssessmentModule
          ),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'fileSubmission',
        loadChildren: () =>
          import('../file-submission/file-submission.module').then(
            (m) => m.FileSubmissionModule
          ),
        data: { flow: 'verified-registration' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifiedRegistrationRoutingModule {}
