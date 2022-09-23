import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvacueeSearchComponent } from './evacuee-search.component';

const routes: Routes = [
  { path: '', component: EvacueeSearchComponent },
  {
    path: 'wrapper',
    loadChildren: () =>
      import('../evacuee-search/search-wrapper/search-wrapper.module').then(
        (m) => m.SearchWrapperModule
      )
  },
  {
    path: 'remote-search',
    loadChildren: () =>
      import('../evacuee-search/remote-search/remote-search.module').then(
        (m) => m.RemoteSearchModule
      )
  },
  {
    path: 'caseNotes-search',
    loadChildren: () =>
      import('../evacuee-search/case-note-search/case-note-search.module').then(
        (m) => m.CaseNoteSearchModule
      )
  },
  {
    path: 'id-search',
    loadChildren: () =>
      import(
        '../evacuee-search/evacuee-id-verify/evacuee-id-verify.module'
      ).then((m) => m.EvacueeIdVerifyModule)
  },
  {
    path: 'name-search',
    loadChildren: () =>
      import(
        '../evacuee-search/evacuee-name-search/evacuee-name-search.module'
      ).then((m) => m.EvacueeNameSearchModule)
  },
  {
    path: 'search-results',
    loadChildren: () =>
      import(
        '../evacuee-search/evacuee-search-results/evacuee-search-results.module'
      ).then((m) => m.EvacueeSearchResultsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacueeSearchRoutingModule {}
