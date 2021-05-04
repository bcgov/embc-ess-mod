import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardComponent } from './wizard.component';

const routes: Routes = [
  {
    path: '',
    component: WizardComponent,
    children: [
      {
        path: 'create-evacuee-profile',
        loadChildren: () =>
          import('./step-create-profile/step-create-profile.module').then(
            (m) => m.StepCreateProfileModule
          )
      },
      {
        path: 'create-ess-file',
        loadChildren: () =>
          import('./step-create-ess-file/step-create-ess-file.module').then(
            (m) => m.StepCreateEssFileModule
          )
      },
      {
        path: 'add-supports',
        loadChildren: () =>
          import('./step-add-supports/step-add-supports.module').then(
            (m) => m.StepAddSupportsModule
          )
      },
      {
        path: 'add-notes',
        loadChildren: () =>
          import('./step-add-notes/step-add-notes.module').then(
            (m) => m.StepAddNotesModule
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
