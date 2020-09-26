import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';

const routes: Routes = [
  {
    path: '', component: NonVerifiedRegistrationComponent,
    children: [
      {
        path: '',
        redirectTo: 'create-profile',
        pathMatch: 'full',
      },
      {
        path: 'collection-notice',
        loadChildren: () => import('../collection-notice/collection-notice.module').then(m => m.CollectionNoticeModule)
      },
      {
        path: 'restriction',
        loadChildren: () => import('../restriction/restriction.module').then(m => m.RestrictionModule)
      },
      {
        path: 'create-profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule)
      }, /// :stepPos
      {
        path: 'needs-assessment',
        loadChildren: () => import('../needs-assessment/needs-assessment.module').then(m => m.NeedsAssessmentModule)
      },
      {
        path: 'edit/:type',
        loadChildren: () => import('../edit/edit.module').then(m => m.EditModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonVerifiedRegistrationRoutingModule { }
