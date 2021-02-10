import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'electronic-agreement',
    pathMatch: 'full'
  },
  {
    path: 'responder-access',
    loadChildren: () => import('./shared/responder-access/responder-access.module').then(m => m.ResponderAccessModule)
  },
  {
    path: 'electronic-agreement',
    loadChildren: () => import('./shared/electronic-agreement/electronic-agreement.module').then(m => m.ElectronicAgreementModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
