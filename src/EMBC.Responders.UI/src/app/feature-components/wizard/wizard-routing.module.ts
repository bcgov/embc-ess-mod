import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardComponent } from './wizard.component';

const routes: Routes = [
  {
    path: '',
    component: WizardComponent,
    children: [
      {
        path: 'evacuee-profile',
        loadChildren: () =>
          import('./step-evacuee-profile/step-evacuee-profile.module').then(
            (m) => m.StepEvacueeProfileModule
          )
      },
      {
        path: 'ess-file',
        loadChildren: () =>
          import('./step-ess-file/step-ess-file.module').then(
            (m) => m.StepEssFileModule
          )
      },
      {
        path: 'add-supports',
        loadChildren: () =>
          import('./step-supports/step-supports.module').then(
            (m) => m.StepSupportsModule
          )
      },
      {
        path: 'add-notes',
        loadChildren: () =>
          import('./step-notes/step-notes.module').then(
            (m) => m.StepNotesModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WizardRoutingModule {}
