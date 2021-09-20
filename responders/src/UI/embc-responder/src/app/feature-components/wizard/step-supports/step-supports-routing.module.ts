import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepSupportsComponent } from './step-supports.component';

const routes: Routes = [
  {
    path: '',
    component: StepSupportsComponent,
    children: [
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full'
      },
      {
        path: 'view',
        loadChildren: () =>
          import(
            '../support-components/view-supports/view-supports.module'
          ).then((m) => m.ViewSupportsModule)
      },
      {
        path: 'select-support',
        loadChildren: () =>
          import(
            '../support-components/select-support/select-support.module'
          ).then((m) => m.SelectSupportModule)
      },
      {
        path: 'details',
        loadChildren: () =>
          import(
            '../support-components/support-details/support-details.module'
          ).then((m) => m.SupportDetailsModule)
      },
      {
        path: 'delivery',
        loadChildren: () =>
          import(
            '../support-components/support-delivery/support-delivery.module'
          ).then((m) => m.SupportDeliveryModule)
      },
      {
        path: 'view-detail',
        loadChildren: () =>
          import(
            '../support-components/existing-support-details/existing-support-details.module'
          ).then((m) => m.ExistingSupportDetailsModule)
      },
      {
        path: 'review',
        loadChildren: () =>
          import(
            '../support-components/review-support/review-support.module'
          ).then((m) => m.ReviewSupportModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepSupportsRoutingModule {}
