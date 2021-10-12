import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepEvacueeProfileComponent } from './step-evacuee-profile.component';

const routes: Routes = [
  {
    path: '',
    component: StepEvacueeProfileComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'collection-notice',
      //   pathMatch: 'full'
      // },
      {
        path: 'collection-notice',
        loadChildren: () =>
          import(
            '../profile-components/collection-notice/collection-notice.module'
          ).then((m) => m.CollectionNoticeModule)
      },
      {
        path: 'restriction',
        loadChildren: () =>
          import('../profile-components/restriction/restriction.module').then(
            (m) => m.RestrictionModule
          )
      },
      {
        path: 'evacuee-details',
        loadChildren: () =>
          import(
            '../profile-components/evacuee-details/evacuee-details.module'
          ).then((m) => m.EvacueeDetailsModule)
      },
      {
        path: 'address',
        loadChildren: () =>
          import('../profile-components/address/address.module').then(
            (m) => m.AddressModule
          )
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('../profile-components/contact/contact.module').then(
            (m) => m.ContactModule
          )
      },
      {
        path: 'security-questions',
        loadChildren: () =>
          import(
            '../profile-components/security-questions/security-questions.module'
          ).then((m) => m.SecurityQuestionsModule)
      },
      {
        path: 'review',
        loadChildren: () =>
          import(
            '../profile-components/profile-review/profile-review.module'
          ).then((m) => m.ProfileReviewModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepEvacueeProfileRoutingModule {}
