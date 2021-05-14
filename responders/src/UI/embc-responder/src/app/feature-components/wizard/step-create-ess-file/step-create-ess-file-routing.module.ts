import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepCreateEssFileComponent } from './step-create-ess-file.component';

const routes: Routes = [
  {
    path: '',
    component: StepCreateEssFileComponent,
    children: [
      {
        path: '',
        redirectTo: 'evacuation-details',
        pathMatch: 'full'
      },
      {
        path: 'evacuation-details',
        loadChildren: () =>
          import(
            '../ess-file-components/evacuation-details/evacuation-details.module'
          ).then((m) => m.EvacuationDetailsModule)
      },
      {
        path: 'household-members',
        loadChildren: () =>
          import(
            '../ess-file-components/household-members/household-members.module'
          ).then((m) => m.HouseholdMembersModule)
      },
      {
        path: 'animals',
        loadChildren: () =>
          import('../ess-file-components/animals/animals.module').then(
            (m) => m.AnimalsModule
          )
      },
      {
        path: 'review',
        loadChildren: () =>
          import(
            '../ess-file-components/ess-file-review/ess-file-review.module'
          ).then((m) => m.EssFileReviewModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepCreateEssFileRoutingModule {}
