import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesComponent } from './notes.component';

const routes: Routes = [
  {
    path: '',
    component: NotesComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'list',
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'list',
      //   loadChildren: () =>
      //     import('../list-notes/list-notes.module').then(
      //       (m) => m.ListNotesModule
      //     )
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule {}
