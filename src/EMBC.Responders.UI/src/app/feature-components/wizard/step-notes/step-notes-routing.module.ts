import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepNotesComponent } from './step-notes.component';

const routes: Routes = [
  {
    path: '',
    component: StepNotesComponent,
    children: [
      {
        path: '',
        redirectTo: 'notes',
        pathMatch: 'full'
      },

      {
        path: 'notes',
        loadChildren: () =>
          import('../notes-components/notes/notes.module').then(
            (m) => m.NotesModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepNotesRoutingModule {}
