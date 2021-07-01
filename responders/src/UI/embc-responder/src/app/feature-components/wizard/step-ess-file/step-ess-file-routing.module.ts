import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepEssFileComponent } from './step-ess-file.component';

const routes: Routes = [
  {
    path: '',
    component: StepEssFileComponent,
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
        path: 'needs',
        loadChildren: () =>
          import('../ess-file-components/needs/needs.module').then(
            (m) => m.NeedsModule
          )
      },
      {
        path: 'security-phrase',
        loadChildren: () =>
          import(
            '../ess-file-components/security-phrase/security-phrase.module'
          ).then((m) => m.SecurityPhraseModule)
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
export class StepEssFileRoutingModule {}
