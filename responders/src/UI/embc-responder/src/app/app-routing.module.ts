import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'responder-access',
    pathMatch: 'full'
  },
  {
    path: 'responder-access',
    loadChildren: () => import('./shared/responder-access/responder-access.module').then(m => m.ResponderAccessModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
