import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseNoteSearchComponent } from './case-note-search.component';

const routes: Routes = [{ path: '', component: CaseNoteSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseNoteSearchRoutingModule {}
